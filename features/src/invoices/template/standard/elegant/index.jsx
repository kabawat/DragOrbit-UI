"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const ElegantTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.elegantInvoice} >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.storeDetails}>
                        <div className={styles.storeName}>
                            {selectedStore?.storeName || "Your Store"}
                        </div>
                        <div className={styles.storeAddress}>
                            {selectedStore?.address && <p>{selectedStore.address}</p>}
                            {selectedStore?.phone && <p>Phone: {selectedStore.phone}</p>}
                            {selectedStore?.email && <p>Email: {selectedStore.email}</p>}
                        </div>
                    </div>
                    <div className={styles.invoiceDetails}>
                        <div className={styles.title}>INVOICE</div>
                        <p>{invoiceData.invoiceNumber}</p>
                        <p>{formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY")}</p>
                    </div>
                </div>

                {/* Info Section */}
                <div className={styles.infoSection}>
                    <div className={styles.infoBox}>
                        <h3>Bill To</h3>
                        <p>
                            <strong>
                                {invoiceData.customer?.name || "Walk-in Customer"}
                            </strong>
                        </p>
                        {invoiceData.customer?.address && (
                            <p>{invoiceData.customer.address}</p>
                        )}
                        {invoiceData.customer?.phone && (
                            <p>Phone: {invoiceData.customer.phone}</p>
                        )}
                        {invoiceData.customer?.email && (
                            <p>Email: {invoiceData.customer.email}</p>
                        )}
                    </div>
                    {invoiceData.paymentMode && (
                        <div className={styles.infoBox}>
                            <h3>Payment Info</h3>
                            <p><strong>Method:</strong> {invoiceData.paymentMode}</p>
                            <p><strong>Status:</strong> {invoiceData.status || "Paid"}</p>
                        </div>
                    )}
                </div>

                {/* Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.elegantTable}>
                        <thead>
                            <tr>
                                <th style={{ width: "40%" }}>Product</th>
                                <th style={{ width: "10%", textAlign: "center" }}>Qty</th>
                                <th style={{ width: "18%", textAlign: "right" }}>Unit Price</th>
                                <th style={{ width: "12%", textAlign: "right" }}>Discount</th>
                                <th style={{ width: "20%", textAlign: "right" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => (
                                <tr key={index}>
                                    <td>
                                        <div className={styles.alignLeft}>
                                            {item.product?.name || "Unnamed Product"}
                                        </div>
                                    </td>
                                    <td><div className={styles.alignCenter}>{qty}</div></td>
                                    <td><div className={styles.alignRight}>{fmt(unitPrice)}</div></td>
                                    <td>
                                        <div className={styles.alignRight} style={{ color: "#ff4d4f" }}>
                                            {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "-"}
                                        </div>
                                    </td>
                                    <td><div className={styles.alignRight}>{fmt(lineAmount)}</div></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className={styles.tableFooterRow}>
                                <td><strong>Totals</strong></td>
                                <td><div className={styles.alignCenter}><strong>{tableTotalQty}</strong></div></td>
                                <td><div className={styles.alignRight}><strong>{fmt(grossTotal)}</strong></div></td>
                                <td>
                                    <div className={styles.alignRight} style={{ color: "#ff4d4f" }}>
                                        <strong>{tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "-"}</strong>
                                    </div>
                                </td>
                                <td><div className={styles.alignRight}><strong>{fmt(tableTotalAmount)}</strong></div></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* GST Note */}
                {hasAnyGst && (
                    <p className={styles.gstNote}>
                        * Prices are GST {allInclusive ? "inclusive" : "exclusive"}
                    </p>
                )}

                {/* Totals Section */}
                <div className={styles.totalsSection}>
                    <div className={styles.totalsBox}>
                        <div className={styles.totalRow}>
                            <span>Item Total:</span>
                            <span>{fmt(grossTotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <span>Discount:</span>
                                <span style={{ color: "#ff4d4f" }}>
                                    -{fmt(totalDiscount)}
                                </span>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.totalRow}>
                                <span>GST:</span>
                                <span>{fmt(totalGst)}</span>
                            </div>
                        )}
                        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                            <span>Total:</span>
                            <span>{fmt(totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for shopping with us!</p>
                    <p>
                        Generated on
                        {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY [at] hh:mm A")}
                    </p>
                    <p>
                        This is a system-generated invoice and does not require a signature.
                    </p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default ElegantTemplate;
