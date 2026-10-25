"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const CelesteTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    return (
        <InvoiceContainer>
            <div className={styles.celesteInvoice}>
                <div className={styles.header}>
                    <h1>INVOICE</h1>
                    <p>
                        Invoice No: <strong>{invoiceData.invoiceNumber}</strong> | Date:{" "}
                        {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}
                    </p>
                </div>

                {/* Billed To / Issued By */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoBlock}>
                        <div className={styles.label}>Billed To</div>
                        <div className={styles.value}>{invoiceData.customer?.name || "Walk-in Customer"}</div>
                        {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                    </div>
                    <div className={styles.infoBlock}>
                        <div className={styles.label}>Issued By</div>
                        <div className={styles.value}>{selectedStore?.storeName || "Your Store Name"}</div>
                        {selectedStore?.address && <p>{selectedStore.address}</p>}
                        {selectedStore?.phone && <p>Ph: {selectedStore.phone}</p>}
                        {selectedStore?.email && <p>{selectedStore.email}</p>}
                        {selectedStore?.gst && <p>GSTIN: {selectedStore.gst}</p>}
                    </div>
                </div>

                {/* B2C Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.celesteTable}>
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
                                    <td><div className={styles.productName}>{item.product?.name || item.productName || "Product"}</div></td>
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
                <div className={styles.totalsContainer}>
                    <div className={styles.totals}>
                        <div className={styles.totalRow}>
                            <div className={styles.totalLabel}>Item Total:</div>
                            <div className={styles.amount}>{fmt(grossTotal)}</div>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <div className={styles.totalLabel}>Discount (-):</div>
                                <div className={styles.amount} style={{ color: "#ff4d4f" }}>-{fmt(totalDiscount)}</div>
                            </div>
                        )}
                        {totalGst > 0 && (
                            <div className={styles.totalRow}>
                                <div className={styles.totalLabel}>{allInclusive ? "GST (included):" : "GST (+):"}</div>
                                <div className={styles.amount}>{fmt(totalGst)}</div>
                            </div>
                        )}
                        <div className={`${styles.totalRow} ${styles.finalRow}`}>
                            <div className={styles.finalLabel}>TOTAL DUE:</div>
                            <div className={styles.finalAmount}>{fmt(totalAmount)}</div>
                        </div>
                        {hasAnyGst && <div className={styles.gstNote}>{allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}</div>}
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for choosing {selectedStore?.storeName || "Our Store"}!</p>
                    <p>Generated on {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY [at] hh:mm A")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default CelesteTemplate;
