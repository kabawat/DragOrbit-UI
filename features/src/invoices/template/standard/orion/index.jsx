"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const OrionTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.orionInvoice} >
                {/* Header */}
                <div className={styles.header}>
                    <h1>INVOICE</h1>
                    <p>
                        Invoice No: <strong>{invoiceData.invoiceNumber}</strong>
                    </p>
                </div>

                <div className={styles.content}>
                    {/* Store Info */}
                    <div className={styles.storeInfo}>
                        <h2>{selectedStore?.storeName || "Your Store"}</h2>
                        <p>{selectedStore?.address || "123 Business Street, City"}</p>
                        {selectedStore?.phone && <p>Ph: {selectedStore.phone}</p>}
                        {selectedStore?.email && <p>Email: {selectedStore.email}</p>}
                    </div>

                    {/* Details Bar */}
                    <div className={styles.details}>
                        <div className={styles.block}>
                            <div className={styles.label}>Bill To</div>
                            <div className={styles.value}>
                                {invoiceData.customer?.name || "Walk-in Customer"}
                            </div>
                            {invoiceData.customer?.email && (
                                <p>{invoiceData.customer.email}</p>
                            )}
                            {invoiceData.customer?.phone && (
                                <p>{invoiceData.customer.phone}</p>
                            )}
                            {invoiceData.customer?.address && (
                                <p>{invoiceData.customer.address}</p>
                            )}
                        </div>
                        <div className={styles.block} style={{ textAlign: "right" }}>
                            <div className={styles.label}>Date</div>
                            <div className={styles.value}>
                                {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY")}
                            </div>
                            {invoiceData.paymentMode && (
                                <div style={{ marginTop: "10px" }}>
                                    <div className={styles.label}>Payment Mode</div>
                                    <div className={styles.value}>{invoiceData.paymentMode}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <td className="font-bold" style={{ width: "35%" }}>Description</td>
                                <td className="font-bold" style={{ width: "5%", textAlign: "center" }}>Qty</td>
                                <td className="font-bold" style={{ width: "20%", textAlign: "right" }}>Rate</td>
                                <td className="font-bold" style={{ width: "20%", textAlign: "right" }}>Discount</td>
                                <td className="font-bold" style={{ width: "20%", textAlign: "right" }}>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => (
                                <tr key={index}>
                                    <td className={styles.productName}>
                                        {item.product?.name || "Unnamed Product"}
                                        {item.product?.sku && (
                                            <div style={{ fontSize: "11px", fontWeight: "normal", color: "#7f8c8d" }}>
                                                SKU: {item.product.sku}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{qty}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: "#e74c3c" }}>
                                        {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "-"}
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                                        {fmt(lineAmount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className={styles.tableFooterRow}>
                                <td><strong>Totals</strong></td>
                                <td style={{ textAlign: "center" }}><strong>{tableTotalQty}</strong></td>
                                <td style={{ textAlign: "right" }}><strong>{fmt(grossTotal)}</strong></td>
                                <td style={{ textAlign: "right", color: "#e74c3c" }}>
                                    <strong>{tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "-"}</strong>
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}><strong>{fmt(tableTotalAmount)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* GST Note */}
                    {hasAnyGst && (
                        <p className={styles.gstNote}>
                            * Prices are GST {allInclusive ? "inclusive" : "exclusive"}
                        </p>
                    )}

                    {/* Totals Section */}
                    <div className={styles.totals}>
                        <div className={styles.row}>
                            <div className={styles.totalLabel}>Item Total:</div>
                            <div className={styles.amount}>
                                {fmt(grossTotal)}
                            </div>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.row}>
                                <div className={styles.totalLabel}>Discount:</div>
                                <div className={styles.amount} style={{ color: "#e74c3c" }}>
                                    -{fmt(totalDiscount)}
                                </div>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.row}>
                                <div className={styles.totalLabel}>Tax (GST):</div>
                                <div className={styles.amount}>
                                    {fmt(totalGst)}
                                </div>
                            </div>
                        )}
                        <div className={`${styles.row} ${styles.finalRow}`}>
                            <div className={styles.totalLabel}>Total:</div>
                            <div className={styles.amount}>
                                {fmt(totalAmount)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for shopping with us!</p>
                    <p>
                        Generated on{" "}
                        {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY [at] HH:mm")}
                    </p>
                    <p>
                        This invoice is system-generated and doesn’t require a signature.
                    </p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default OrionTemplate;
