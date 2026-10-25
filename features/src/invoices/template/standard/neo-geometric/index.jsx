"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const NeoGeometricTemplate = ({ invoiceData = {}, selectedStore = {} }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.neoInvoice} >
                {/* Header Section */}
                <div className={styles.header}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>N</div>
                        <div>
                            <div className={styles.storeTitle}>
                                {selectedStore?.storeName || "NeoGeometric"}
                            </div>
                            <div className={styles.tagline}>
                                {selectedStore?.tagline || "Precision Invoice Design"}
                            </div>
                        </div>
                    </div>

                    <div className={styles.meta}>
                        Invoice
                        <strong>{invoiceData.invoiceNumber || "—"}</strong>
                        <div>{formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</div>
                    </div>
                </div>

                {/* Body Section */}
                <div className={styles.grid}>
                    <div>
                        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                            <div className={styles.card}>
                                <div className={styles.title}>From</div>
                                <div className={styles.val}>
                                    {selectedStore?.storeName || "NeoGeometric Billing"}
                                </div>
                                <div className={styles.sub}>
                                    {selectedStore?.address || "Suite 100, Central Avenue"}
                                </div>
                                {selectedStore?.phone && (
                                    <div className={styles.sub}>Phone: {selectedStore.phone}</div>
                                )}
                                {selectedStore?.email && (
                                    <div className={styles.sub}>Email: {selectedStore.email}</div>
                                )}
                            </div>

                            <div className={styles.card}>
                                <div className={styles.title}>Bill To</div>
                                <div className={styles.val}>
                                    {invoiceData.customer?.name || "Walk-in Customer"}
                                </div>
                                {invoiceData.customer?.email && (
                                    <div className={styles.sub}>{invoiceData.customer.email}</div>
                                )}
                                {invoiceData.customer?.phone && (
                                    <div className={styles.sub}>
                                        Phone: {invoiceData.customer.phone}
                                    </div>
                                )}
                                {invoiceData.customer?.address && (
                                    <div className={styles.sub}>{invoiceData.customer.address}</div>
                                )}
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.title}>Items</div>
                            <div className={styles.itemsContainer}>
                                <table className={styles.itemsTable}>
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
                                                    <div style={{ fontWeight: 600 }}>
                                                        {item.product?.name || "Unnamed Item"}
                                                    </div>
                                                    {item.product?.sku && (
                                                        <div className={styles.sub}>SKU: {item.product.sku}</div>
                                                    )}
                                                </td>
                                                <td style={{ textAlign: "center" }}>{qty}</td>
                                                <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                                <td style={{ textAlign: "right", color: "#e74c3c" }}>
                                                    {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "-"}
                                                </td>
                                                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(lineAmount)}</td>
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
                            </div>
                        </div>
                    </div>

                    {/* Right Column Summary */}
                    <div className={`${styles.card} ${styles.summary}`}>
                        <div className={styles.title}>Summary</div>

                        {/* GST Note */}
                        {hasAnyGst && (
                            <p className={styles.gstNote}>
                                * Prices are GST {allInclusive ? "inclusive" : "exclusive"}
                            </p>
                        )}

                        <div className={styles.row}>
                            <div>Item Total</div>
                            <div className={styles.totalVal}>{fmt(grossTotal)}</div>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.row}>
                                <div>Discount</div>
                                <div className={styles.totalVal} style={{ color: "#e74c3c" }}>
                                    -{fmt(totalDiscount)}
                                </div>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.row}>
                                <div>Tax (GST)</div>
                                <div className={styles.totalVal}>{fmt(totalGst)}</div>
                            </div>
                        )}
                        <div className={styles.grand}>
                            <div>Amount Due</div>
                            <div>{fmt(totalAmount)}</div>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <div className={styles.title}>Payment Information</div>
                            <div className={styles.sub}>
                                Mode: {invoiceData.paymentMode || "Not specified"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className={styles.footer}>
                    <div>Generated on {formatInvoiceDate(invoiceData.createdAt, "YYYY-MM-DD HH:mm:ss")}</div>
                    <div>
                        © {new Date().getFullYear()} {selectedStore?.storeName || "NeoGeometric"}
                    </div>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default NeoGeometricTemplate;
