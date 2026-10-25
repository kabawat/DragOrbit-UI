"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const EclipseTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.eclipseInvoice} >
                {/* Header */}
                <div className={styles.header}>
                    <h1>INVOICE</h1>
                    <p>{selectedStore?.storeName || "Your Store"}</p>
                    <p>Invoice No: {invoiceData.invoiceNumber}</p>
                    <p>{formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY")}</p>
                </div>

                {/* Customer & Store Info */}
                <div className={styles.detailsSection}>
                    <div className={styles.block}>
                        <div className={styles.label}>Bill To</div>
                        <div className={styles.value}>
                            {invoiceData.customer?.name || "Walk-in Customer"}
                        </div>
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                        {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                        {invoiceData.customer?.address && <p>{invoiceData.customer.address}</p>}
                    </div>

                    <div className={styles.block} style={{ textAlign: "right" }}>
                        <div className={styles.label}>From</div>
                        <div className={styles.value}>
                            {selectedStore?.storeName || "Your Store"}
                        </div>
                        {selectedStore?.email && <p>{selectedStore.email}</p>}
                        {selectedStore?.phone && <p>{selectedStore.phone}</p>}
                        {selectedStore?.address && <p>{selectedStore.address}</p>}
                    </div>
                </div>

                {/* Table Selection */}
                <div className={styles.tableContainer}>
                    <table className={styles.invoiceTable}>
                        <thead>
                            <tr>
                                <th style={{ width: "40%" }}>Item</th>
                                <th style={{ width: "10%", textAlign: "center" }}>Qty</th>
                                <th style={{ width: "18%", textAlign: "right" }}>Price</th>
                                <th style={{ width: "12%", textAlign: "right" }}>Discount</th>
                                <th style={{ width: "20%", textAlign: "right" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => (
                                <tr key={index}>
                                    <td>
                                        <div className={styles.productName}>
                                            {item.product?.name || "Unnamed Product"}
                                        </div>
                                        {item.product?.sku && (
                                            <span className={styles.productSku}>
                                                SKU: {item.product.sku}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{qty}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: "#ef4444" }}>
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
                                <td style={{ textAlign: "right", color: "#ef4444" }}>
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

                {/* Totals Section */}
                <div className={styles.totals}>
                    <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>Item Total:</span>
                        <span className={styles.totalValue}>{fmt(grossTotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Discount:</span>
                            <span className={styles.totalValue} style={{ color: "#ef4444" }}>
                                -{fmt(totalDiscount)}
                            </span>
                        </div>
                    )}
                    {hasAnyGst && (
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>GST:</span>
                            <span className={styles.totalValue}>{fmt(totalGst)}</span>
                        </div>
                    )}
                    <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                        <span className={styles.totalLabel}>Total:</span>
                        <span className={styles.totalValue}>{fmt(totalAmount)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for your business!</p>
                    <p>
                        Generated on{" "}
                        {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY [at] HH:mm")}
                    </p>
                    <p>
                        This invoice was auto-generated and does not require a signature.
                    </p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default EclipseTemplate;
