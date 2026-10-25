"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const AurumTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    return (
        <InvoiceContainer>
            <div className={styles.aurumInvoice}>
                {/* Header */}
                <div className={styles.header}>
                    <h1>INVOICE</h1>
                    <div className={styles.subtitle}>{selectedStore?.storeName || "Your Store Name"}</div>
                    <div className={styles.contactInfo}>
                        {selectedStore?.address && <span>{selectedStore.address} | </span>}
                        {selectedStore?.phone && <span>Ph: {selectedStore.phone} | </span>}
                        {selectedStore?.email && <span>Email: {selectedStore.email}</span>}
                        {selectedStore?.gst && <span> | GSTIN: {selectedStore.gst}</span>}
                    </div>
                </div>

                {/* Info */}
                <div className={styles.infoSection}>
                    <div className={styles.infoBlock}>
                        <div className={styles.label}>Invoice Details</div>
                        <p>Invoice #: <strong>{invoiceData.invoiceNumber}</strong></p>
                        <p>Date: <strong>{formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</strong></p>
                        {invoiceData.paymentMode && <p>Payment: <strong>{invoiceData.paymentMode}</strong></p>}
                    </div>
                    <div className={styles.infoBlock}>
                        <div className={styles.label}>Bill To</div>
                        <p><strong>{invoiceData.customer?.name || "Walk-in Customer"}</strong></p>
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                        {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                    </div>
                </div>

                {/* B2C Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.invoiceTable}>
                        <thead>
                            <tr>
                                <td style={{ width: "40%", textAlign: "left" }}>Product</td>
                                <td style={{ width: "12%", textAlign: "center" }}>Qty</td>
                                <td style={{ width: "16%", textAlign: "right" }}>Unit Price</td>
                                <td style={{ width: "14%", textAlign: "right" }}>Discount</td>
                                <td style={{ width: "18%", textAlign: "right" }}>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {getItemRows(items).map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => (
                                <tr key={index}>
                                    <td>{item.product?.name || item.productName || "Product"}</td>
                                    <td style={{ textAlign: "center" }}>{qty}{item.uom ? ` ${item.uom}` : ""}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: lineDiscount > 0 ? "#ff4d4f" : "#aaa" }}>
                                        {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "—"}
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(lineAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className={styles.tableFooterRow}>
                                <td style={{ textAlign: "left", fontWeight: 700 }}>Total</td>
                                <td style={{ textAlign: "center", fontWeight: 700 }}>{tableTotalQty}</td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(grossTotal)}</td>
                                <td style={{ textAlign: "right", fontWeight: 700, color: tableTotalDiscount > 0 ? "#ff4d4f" : "inherit" }}>
                                    {tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "—"}
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(tableTotalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* B2C Totals */}
                <div className={styles.totalsSection}>
                    <div className={styles.totalCard}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Item Total:</span>
                            <span>{fmt(grossTotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>Discount (-):</span>
                                <span style={{ color: "#ff4d4f" }}>-{fmt(totalDiscount)}</span>
                            </div>
                        )}
                        {totalGst > 0 && (
                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>{allInclusive ? "GST (included):" : "GST (+):"}</span>
                                <span>{fmt(totalGst)}</span>
                            </div>
                        )}
                        <div className={`${styles.totalRow} ${styles.finalRow}`}>
                            <span>Total Amount:</span>
                            <span>{fmt(totalAmount)}</span>
                        </div>
                        {hasAnyGst && <div className={styles.gstNote}>{allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}</div>}
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for your business!</p>
                    <div className={styles.timestamp}>
                        Generated on {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY [at] HH:mm")}
                    </div>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default AurumTemplate;
