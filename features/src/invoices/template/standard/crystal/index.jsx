"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

export default function CrystalTemplate({ invoiceData, selectedStore }) {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    return (
        <InvoiceContainer>
            <div className={styles.crystalInvoice} id="invoice">
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.storeDetails}>
                        <div className={styles.storeName}>{selectedStore?.storeName || "CRYSTAL VENTURES"}</div>
                        <div className={styles.storeInfo}>
                            {selectedStore?.address && <p>{selectedStore.address}</p>}
                            <p>
                                {selectedStore?.phone && <span>Tel: {selectedStore.phone} | </span>}
                                {selectedStore?.email && <span>{selectedStore.email}</span>}
                                {selectedStore?.gst && <span> | GSTIN: {selectedStore.gst}</span>}
                            </p>
                        </div>
                    </div>
                    <div className={styles.invoiceTitleBox}>
                        <h1 data-invoice-header>INVOICE</h1>
                        <p>Ref: {invoiceData.invoiceNumber}</p>
                        <p>Date: {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</p>
                    </div>
                </div>

                {/* Info */}
                <div className={styles.infoSection}>
                    <div className={styles.infoBox}>
                        <h3>Billed To</h3>
                        <p><strong>{invoiceData.customer?.name || "Walk-in Customer"}</strong></p>
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                        {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                    </div>
                    <div className={styles.infoBox}>
                        <h3>Invoice Details</h3>
                        <p><strong>Payment:</strong> {invoiceData.paymentMode || "—"}</p>
                        <p><strong>Status:</strong> {invoiceData.status || "Approved"}</p>
                    </div>
                </div>

                {/* B2C Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.crystalTable}>
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
                                    <td><span className={styles.productName}>{item.product?.name || item.productName || "Product"}</span></td>
                                    <td style={{ textAlign: "center" }}>{qty}{item.uom ? ` ${item.uom}` : ""}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: lineDiscount > 0 ? "#ef4444" : "#aaa" }}>
                                        {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "—"}
                                    </td>
                                    <td style={{ textAlign: "right" }}>{fmt(lineAmount)}</td>
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
                </div>

                {/* B2C Totals */}
                <div className={styles.totalsSection}>
                    <div className={styles.totalsBox}>
                        <div className={styles.totalRow}>
                            <span>Item Total:</span>
                            <span>{fmt(grossTotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <span>Discount (-):</span>
                                <span style={{ color: "#ef4444" }}>-{fmt(totalDiscount)}</span>
                            </div>
                        )}
                        {totalGst > 0 && (
                            <div className={styles.totalRow}>
                                <span>{allInclusive ? "GST (included):" : "GST (+):"}</span>
                                <span>{fmt(totalGst)}</span>
                            </div>
                        )}
                        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                            <span>BALANCE DUE:</span>
                            <span>{fmt(totalAmount)}</span>
                        </div>
                        {hasAnyGst && <div className={styles.gstNote}>{allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}</div>}
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>We appreciate your valuable business.</p>
                    <p>Generated on {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY [at] HH:mm")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
}
