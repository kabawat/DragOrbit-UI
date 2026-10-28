"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const ApexTemplate = ({ invoiceData, selectedStore }) => {
    const ACCENT_COLOR = "#e74c3c";

    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    return (
        <InvoiceContainer>
            <div className={styles.apexInvoice}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1 data-invoice-header>INVOICE</h1>
                        <p className={styles.dateText}>Date: {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</p>
                    </div>
                    <div className={styles.storeInfo}>
                        <h2>{selectedStore?.storeName || "Your Store"}</h2>
                        <p>{selectedStore?.address || ""}</p>
                        {selectedStore?.phone && <p>{selectedStore.phone}</p>}
                        {selectedStore?.email && <p>{selectedStore.email}</p>}
                        {selectedStore?.gst && <p>GSTIN: {selectedStore.gst}</p>}
                    </div>
                </div>

                {/* Details */}
                <div className={styles.detailsSection}>
                    <div className={styles.infoBlock}>
                        <div className="label">Invoice Number</div>
                        <div className="value">{invoiceData.invoiceNumber}</div>
                        <div className="label">Bill To</div>
                        <p className="value">{invoiceData.customer?.name || "Walk-in Customer"}</p>
                        {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                    </div>
                    <div className={`${styles.infoBlock} ${styles.rightAlign}`}>
                        <div className="label">Payment Status</div>
                        <div className="value" style={{ color: ACCENT_COLOR }}>
                            {invoiceData.paymentStatus || "PAID"}
                        </div>
                    </div>
                </div>

                {/* B2C Items Table */}
                <table className={styles.table}>
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
                                <td>
                                    <div className={styles.productName}>{item.product?.name || item.productName || "Product"}</div>
                                </td>
                                <td style={{ textAlign: "center" }}>{qty}{item.uom ? ` ${item.uom}` : ""}</td>
                                <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                <td style={{ textAlign: "right", color: lineDiscount > 0 ? ACCENT_COLOR : "#aaa" }}>
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
                            <td style={{ textAlign: "right", fontWeight: 700, color: tableTotalDiscount > 0 ? ACCENT_COLOR : "inherit" }}>
                                {tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "—"}
                            </td>
                            <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(tableTotalAmount)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* B2C Totals */}
                <div className={styles.totalsSection}>
                    <div className={styles.totals}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Item Total:</span>
                            <span className={styles.totalAmount}>{fmt(grossTotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>Discount (-):</span>
                                <span className={styles.totalAmount} style={{ color: ACCENT_COLOR, fontWeight: 700 }}>
                                    -{fmt(totalDiscount)}
                                </span>
                            </div>
                        )}
                        {totalGst > 0 && (
                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>{allInclusive ? "GST (included):" : "GST (+):"}</span>
                                <span className={styles.totalAmount}>{fmt(totalGst)}</span>
                            </div>
                        )}
                        {hasAnyGst && <div className={styles.gstNote}>{allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}</div>}
                    </div>
                </div>

                {/* Final Total Bar */}
                <div className={styles.finalBar}>
                    <span>TOTAL AMOUNT DUE:</span>
                    <span>{fmt(totalAmount)}</span>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for your business!</p>
                    <p>Generated on {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY [at] HH:mm")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default ApexTemplate;
