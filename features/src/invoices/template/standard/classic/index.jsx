"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const ClassicTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    return (
        <InvoiceContainer>
            <div className={styles.classicInvoice}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 data-invoice-header>INVOICE</h1>
                    <div className={styles.invoiceNumber}>{invoiceData.invoiceNumber}</div>
                    <p>Date: {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</p>
                </div>

                {/* Info */}
                <div className={styles.infoSection}>
                    <div className={styles.infoBlock}>
                        <h3>FROM:</h3>
                        <p><strong>{selectedStore?.storeName || "Your Store"}</strong></p>
                        {selectedStore?.address && <p>{selectedStore.address}</p>}
                        {selectedStore?.phone && <p>Phone: {selectedStore.phone}</p>}
                        {selectedStore?.email && <p>Email: {selectedStore.email}</p>}
                        {selectedStore?.gst && <p>GSTIN: {selectedStore.gst}</p>}
                    </div>
                    <div className={styles.infoBlock}>
                        <h3>BILL TO:</h3>
                        <p><strong>{invoiceData.customer?.name || "Walk-in Customer"}</strong></p>
                        {invoiceData.customer?.email && <p>Email: {invoiceData.customer.email}</p>}
                        {invoiceData.customer?.phone && <p>Phone: {invoiceData.customer.phone}</p>}
                    </div>
                </div>

                {/* B2C Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.classicTable}>
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
                                    <td style={{ textAlign: "right", color: lineDiscount > 0 ? "#c0392b" : "#aaa" }}>
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
                                <td style={{ textAlign: "right", fontWeight: 700, color: tableTotalDiscount > 0 ? "#c0392b" : "inherit" }}>
                                    {tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "—"}
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(tableTotalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* B2C Totals */}
                <div className={styles.totalsSection}>
                    <div className={styles.totalRow}>
                        <span>Item Total:</span>
                        <span>{fmt(grossTotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div className={styles.totalRow}>
                            <span>Discount (-):</span>
                            <span style={{ color: "#c0392b" }}>-{fmt(totalDiscount)}</span>
                        </div>
                    )}
                    {totalGst > 0 && (
                        <div className={styles.totalRow}>
                            <span>{allInclusive ? "GST (included):" : "GST (+):"}</span>
                            <span>{fmt(totalGst)}</span>
                        </div>
                    )}
                    <div className={`${styles.totalRow} ${styles.final}`}>
                        <span>TOTAL:</span>
                        <span>{fmt(totalAmount)}</span>
                    </div>
                    {hasAnyGst && <div className={styles.gstNote}>{allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}</div>}
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

export default ClassicTemplate;
