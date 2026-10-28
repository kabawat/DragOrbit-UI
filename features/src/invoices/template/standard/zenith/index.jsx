"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const ZenithTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.zenithInvoice} >
                {/* Left Sidebar */}
                <div className={styles.sidebar}>
                    <div>
                        <h2>{selectedStore?.storeName || "Your Store"}</h2>
                        <p>{selectedStore?.address || "123 Business Avenue"}</p>
                        {selectedStore?.phone && <p>{selectedStore.phone}</p>}
                        {selectedStore?.email && <p>{selectedStore.email}</p>}
                    </div>

                    <div>
                        <p style={{ fontSize: "11px", opacity: 0.9, marginTop: "40px" }}>
                            © {formatInvoiceDate(undefined, "YYYY")}{" "}
                            {selectedStore?.storeName || "Your Store"}
                        </p>
                    </div>
                </div>

                {/* Right Main */}
                <div className={styles.main}>
                    <div className={styles.header}>
                        <h1 data-invoice-header>INVOICE</h1>
                        <div className={styles.headerRight}>
                            <p>
                                Invoice No: <strong>{invoiceData.invoiceNumber}</strong>
                            </p>
                            <p>
                                Date: {formatInvoiceDate(invoiceData.createdAt, "MMM DD, YYYY")}
                            </p>
                        </div>
                    </div>

                    <div className={styles.infoGrid}>
                        <div className={styles.card}>
                            <h4>Bill To</h4>
                            <p>{invoiceData.customer?.name || "Walk-in Customer"}</p>
                            {invoiceData.customer?.phone && (
                                <p>{invoiceData.customer.phone}</p>
                            )}
                            {invoiceData.customer?.email && (
                                <p>{invoiceData.customer.email}</p>
                            )}
                            {invoiceData.customer?.address && (
                                <p>{invoiceData.customer.address}</p>
                            )}
                        </div>

                        <div className={styles.card}>
                            <h4>From</h4>
                            <p>{selectedStore?.storeName || "Your Store"}</p>
                            <p>{selectedStore?.email}</p>
                            <p>{selectedStore?.phone}</p>
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.zenithTable}>
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
                                            <div className={styles.productName}>{item.product?.name}</div>
                                            {item.product?.sku && (
                                                <div className={styles.productSku} style={{ fontSize: "11px", color: "#666" }}>
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
                                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                                        <strong>{fmt(tableTotalAmount)}</strong>
                                    </td>
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

                    <div className={styles.totalsArea}>
                        <div className={styles.totalsBox}>
                            <div className={styles.totalsRow}>
                                <span className={styles.totalsLabel}>Item Total:</span>
                                <span className={styles.totalsValue}>
                                    {fmt(grossTotal)}
                                </span>
                            </div>
                            {totalDiscount > 0 && (
                                <div className={styles.totalsRow}>
                                    <span className={styles.totalsLabel}>Discount:</span>
                                    <span className={styles.totalsValue} style={{ color: "#e74c3c" }}>
                                        -{fmt(totalDiscount)}
                                    </span>
                                </div>
                            )}
                            {hasAnyGst && (
                                <div className={styles.totalsRow}>
                                    <span className={styles.totalsLabel}>GST:</span>
                                    <span className={styles.totalsValue}>
                                        {fmt(totalGst)}
                                    </span>
                                </div>
                            )}
                            <div className={`${styles.totalsRow} ${styles.finalTotalRow}`}>
                                <span className={styles.totalsLabel}>Total:</span>
                                <span className={styles.totalsValue}>
                                    {fmt(totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <p>Thank you for choosing us!</p>
                        <p>
                            Generated on{" "}
                            {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY [at] HH:mm")}
                        </p>
                        <p>
                            This invoice is system-generated and does not require a signature.
                        </p>
                    </div>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default ZenithTemplate;
