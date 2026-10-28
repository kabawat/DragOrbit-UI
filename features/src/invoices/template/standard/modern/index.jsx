"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows, formatAddress } from "../../b2cHelpers.js";

const ModernTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.modernInvoice} >
                {/* Header Section */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 data-invoice-header>INVOICE</h1>
                        <div className={styles.subtitle}>
                            Professional Business Invoice
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.invoiceNumberValue}>{invoiceData.invoiceNumber}</div>
                        <div className={styles.dateText}>
                            {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY")}
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoSection}>
                        <h3>From</h3>
                        <div className={styles.entityName}>
                            {selectedStore?.storeName || "Your Store"}
                        </div>
                        <p>{formatAddress(selectedStore?.address) || "123 Business Street"}</p>
                        {selectedStore?.phone && <p>Phone: {selectedStore.phone}</p>}
                        {selectedStore?.email && <p>Email: {selectedStore.email}</p>}
                        {selectedStore?.gst && <p>GSTIN: {selectedStore.gst}</p>}
                    </div>

                    <div className={styles.infoSection}>
                        <h3>Bill To</h3>
                        <div className={styles.entityName}>
                            {invoiceData.customer?.name || "Walk-in Customer"}
                        </div>
                        {invoiceData.customer?.email && (
                            <p>Email: {invoiceData.customer.email}</p>
                        )}
                        {invoiceData.customer?.phone && (
                            <p>Phone: {invoiceData.customer.phone}</p>
                        )}
                        {invoiceData.customer?.gst && <p>GSTIN: {invoiceData.customer.gst}</p>}
                        {invoiceData.customer?.address && (
                            <p>{formatAddress(invoiceData.customer.address)}</p>
                        )}
                    </div>
                </div>

                {/* Table Selection */}
                <div className={styles.tableContainer}>
                    <table className={styles.modernTable}>
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
                            {rows.map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => {
                                const rowKey =
                                    item.id ||
                                    item._id ||
                                    item.variant?.id ||
                                    item.variantId ||
                                    item.product?.id ||
                                    item.product?._id ||
                                    "invoice-item";
                                return (
                                    <tr key={`${rowKey}-${index}`}>
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
                                );
                            })}
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

                {/* Totals Section */}
                <div className={styles.totalsArea}>
                    <div className={styles.totalsBox}>
                        <div className={styles.totalRow}>
                            <span>Item Total:</span>
                            <span>{fmt(grossTotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <span>Discount:</span>
                                <span style={{ color: "#e74c3c" }}>-{fmt(totalDiscount)}</span>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.totalRow}>
                                <span>GST:</span>
                                <span>{fmt(totalGst)}</span>
                            </div>
                        )}
                        <div className={`${styles.totalRow} ${styles.grandTotalRow}`}>
                            <span>TOTAL:</span>
                            <span>{fmt(totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for your business!</p>
                    <p>
                        This is a computer-generated invoice and does not require a
                        signature.
                    </p>
                    <p>
                        Generated on{" "}
                        {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY [at] HH:mm")}
                    </p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default ModernTemplate;
