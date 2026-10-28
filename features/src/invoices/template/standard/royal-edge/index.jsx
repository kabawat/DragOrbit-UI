"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const RoyalEdgeTemplate = ({ invoiceData = {}, selectedStore = {} }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.royalInvoice} >
                {/* Header Section */}
                <div className={styles.header}>
                    <div className={styles.brand}>
                        <div data-invoice-logo className={styles.logo}>R</div>
                        <div>
                            <div className={styles.storeTitle}>
                                {selectedStore?.storeName || "RoyalEdge"}
                            </div>
                            <div className={styles.tagline}>
                                {selectedStore?.tagline || "Premium Billing & Invoicing"}
                            </div>
                        </div>
                    </div>

                    <div className={styles.meta}>
                        <div className={styles.metaRow}>Invoice</div>
                        <div className={styles.metaStrong}>
                            {invoiceData.invoiceNumber || "—"}
                        </div>
                        <div className={styles.metaRow}>
                            {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}
                        </div>
                    </div>
                </div>

                {/* Body Grid */}
                <div className={styles.bodyGrid}>
                    {/* Left column: store & items */}
                    <div>
                        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                            <div style={{ flex: 1 }} className={styles.card}>
                                <div className={styles.infoTitle}>From</div>
                                <div className={styles.infoVal}>
                                    {selectedStore?.storeName || "RoyalEdge Billing"}
                                </div>
                                <div className={styles.small}>
                                    {selectedStore?.address || "Suite 100, Central Avenue"}
                                </div>
                                <div className={styles.small} style={{ marginTop: 8 }}>
                                    {selectedStore?.phone && <span>Phone: {selectedStore.phone}</span>}
                                </div>
                                <div className={styles.small}>
                                    {selectedStore?.email && <span>Email: {selectedStore.email}</span>}
                                </div>
                            </div>

                            <div style={{ flex: 1 }} className={styles.card}>
                                <div className={styles.infoTitle}>Bill To</div>
                                <div className={styles.infoVal}>
                                    {invoiceData.customer?.name || "Walk-in Customer"}
                                </div>
                                {invoiceData.customer?.email && (
                                    <div className={styles.small}>{invoiceData.customer.email}</div>
                                )}
                                {invoiceData.customer?.phone && (
                                    <div className={styles.small}>
                                        Phone: {invoiceData.customer.phone}
                                    </div>
                                )}
                                {invoiceData.customer?.address && (
                                    <div className={styles.small}>{invoiceData.customer.address}</div>
                                )}
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className={styles.card}>
                            <div className={styles.infoTitle} style={{ marginBottom: 10 }}>
                                Items
                            </div>
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
                                                {item.product?.name || "Unnamed Item"}
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
                            {/* GST Note */}
                            {hasAnyGst && (
                                <p className={styles.gstNote}>
                                    * Prices are GST {allInclusive ? "inclusive" : "exclusive"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right column: totals, notes */}
                    <div className={styles.rightStack}>
                        <div className={`${styles.card} ${styles.totals}`}>
                            <div className={styles.infoTitle}>Summary</div>
                            <div className={styles.row}>
                                <div>Item Total</div>
                                <div className={styles.val}>{fmt(grossTotal)}</div>
                            </div>
                            {totalDiscount > 0 && (
                                <div className={styles.row}>
                                    <div>Discount</div>
                                    <div className={styles.val} style={{ color: "#e74c3c" }}>
                                        -{fmt(totalDiscount)}
                                    </div>
                                </div>
                            )}
                            {hasAnyGst && (
                                <div className={styles.row}>
                                    <div>Tax (GST)</div>
                                    <div className={styles.val}>{fmt(totalGst)}</div>
                                </div>
                            )}
                            <div className={styles.grand}>
                                <div>Amount Due</div>
                                <div>{fmt(totalAmount)}</div>
                            </div>
                            <div style={{ marginTop: 12 }}>
                                <div className={styles.infoTitle}>Payment</div>
                                <div className={styles.small}>
                                    Mode: {invoiceData.paymentMode || "Not specified"}
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.infoTitle}>Notes</div>
                            <div className={styles.notes}>
                                {invoiceData.notes || "Thank you for your business. Please make payment within the agreed terms."}
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.signatureBox}`}>
                            <div>
                                <div className={styles.infoTitle}>Prepared By</div>
                                <div className={styles.small}>
                                    {selectedStore?.preparedBy || "Accounts Team"}
                                </div>
                            </div>
                            <div>
                                <div style={{ textAlign: "center", fontSize: 10, color: "#6b7280" }}>
                                    Signature
                                </div>
                                <div className={styles.signatureLine} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div>Generated on {formatInvoiceDate(invoiceData.createdAt, "YYYY-MM-DD HH:mm:ss")}</div>
                    <div className={styles.icons}>
                        <div className={styles.icon}>★</div>
                        <div className={styles.icon}>☎</div>
                        <div className={styles.icon}>✉</div>
                    </div>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default RoyalEdgeTemplate;
