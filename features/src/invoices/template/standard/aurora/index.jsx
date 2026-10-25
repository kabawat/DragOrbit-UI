"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const AuroraTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    return (
        <InvoiceContainer>
            <div className={styles.auroraInvoice}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>INVOICE</h1>
                        <p>{selectedStore?.storeName || "Your Store"}</p>
                        {selectedStore?.gst && <p style={{ fontSize: "11px" }}>GSTIN: {selectedStore.gst}</p>}
                    </div>
                    <div className={styles.headerRight}>
                        <p>Invoice No: <strong>{invoiceData.invoiceNumber}</strong></p>
                        <p>Date: {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</p>
                    </div>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoBox}>
                            <h4>Bill To</h4>
                            <p>{invoiceData.customer?.name || "Walk-in Customer"}</p>
                            {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                            {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                        </div>
                        <div className={styles.infoBox}>
                            <h4>From</h4>
                            <p>{selectedStore?.storeName || "Your Store"}</p>
                            {selectedStore?.email && <p>{selectedStore.email}</p>}
                            {selectedStore?.phone && <p>{selectedStore.phone}</p>}
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
                                    <td><div className={styles.productName}>{item.product?.name || item.productName || "Product"}</div></td>
                                    <td style={{ textAlign: "center" }}>{qty}{item.uom ? ` ${item.uom}` : ""}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: lineDiscount > 0 ? "#ef4444" : "#aaa" }}>
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
                                <td style={{ textAlign: "right", fontWeight: 700, color: tableTotalDiscount > 0 ? "#ef4444" : "inherit" }}>
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
                                    <span className={styles.totalAmount} style={{ color: "#ef4444" }}>-{fmt(totalDiscount)}</span>
                                </div>
                            )}
                            {totalGst > 0 && (
                                <div className={styles.totalRow}>
                                    <span className={styles.totalLabel}>{allInclusive ? "GST (included):" : "GST (+):"}</span>
                                    <span className={styles.totalAmount}>{fmt(totalGst)}</span>
                                </div>
                            )}
                            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                                <span className={styles.totalLabel}>Total Payable:</span>
                                <span className={styles.totalAmount}>{fmt(totalAmount)}</span>
                            </div>
                            {hasAnyGst && <div className={styles.gstNote}>{allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}</div>}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for your purchase!</p>
                    <p>Generated on {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY [at] HH:mm")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default AuroraTemplate;
