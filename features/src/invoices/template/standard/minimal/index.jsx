"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const MinimalTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.minimalInvoice} >
                {/* Header */}
                <div className={styles.header}>
                    <h1 data-invoice-header>INVOICE</h1>
                    <div className={styles.invoiceNumber}>{invoiceData.invoiceNumber}</div>
                    <div className={styles.date}>
                        {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY")}
                    </div>
                </div>

                {/* Info Section */}
                <div className={styles.infoSection}>
                    <div className={styles.section}>
                        <div className={styles.label}>From</div>
                        <div className={styles.companyName}>
                            {selectedStore?.storeName || "Your Store"}
                        </div>
                        <p>{selectedStore?.address || "123 Business Street"}</p>
                        <p>
                            {selectedStore?.phone && <span>Ph: {selectedStore.phone}</span>}
                        </p>
                        <p>
                            {selectedStore?.email && <span>Email: {selectedStore.email}</span>}
                        </p>
                    </div>

                    <div className={styles.section} style={{ textAlign: "right" }}>
                        <div className={styles.label}>Bill To</div>
                        <div className={styles.customerName}>
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
                </div>

                {/* Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.minimalTable}>
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
                                    <td>
                                        <div className={styles.productName}>
                                            {item.product?.name || "Unknown Product"}
                                        </div>
                                        {item.product?.sku && (
                                            <div className={styles.productSku} style={{ fontSize: "10px", color: "#999" }}>
                                                SKU: {item.product.sku}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{qty}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: "#e74c3c" }}>
                                        {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "-"}
                                    </td>
                                    <td style={{ textAlign: "right" }}>{fmt(lineAmount)}</td>
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
                                <td style={{ textAlign: "right" }}><strong>{fmt(tableTotalAmount)}</strong></td>
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

                {/* Totals */}
                <div className={styles.totals}>
                    <div className={styles.totalRow}>
                        <div className={styles.label}>Item Total:</div>
                        <div className={styles.amount}>{fmt(grossTotal)}</div>
                    </div>
                    {totalDiscount > 0 && (
                        <div className={styles.totalRow}>
                            <div className={styles.label}>Discount:</div>
                            <div className={styles.amount} style={{ color: "#e74c3c" }}>
                                -{fmt(totalDiscount)}
                            </div>
                        </div>
                    )}
                    {hasAnyGst && (
                        <div className={styles.totalRow}>
                            <div className={styles.label}>GST:</div>
                            <div className={styles.amount}>{fmt(totalGst)}</div>
                        </div>
                    )}
                    <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                        <div className={styles.label}>Total Due:</div>
                        <div className={styles.amount}>{fmt(totalAmount)}</div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for your business</p>
                    <p>
                        This is a computer-generated invoice and does not require a
                        signature
                    </p>
                    <p>
                        Generated on
                        {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY [at] HH:mm")}
                    </p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default MinimalTemplate;
