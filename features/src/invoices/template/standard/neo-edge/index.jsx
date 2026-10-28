"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const NeoEdgeTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.neoedgeInvoice} >
                {/* Header */}
                <div className={styles.header}>
                    <h1 data-invoice-header>INVOICE</h1>
                    <div className={styles.storeInfo}>
                        <strong>{selectedStore?.storeName || "NeoEdge Solutions"}</strong>{" "}
                        | {selectedStore?.address || "G-45, Business Park, New Delhi"}
                        <br />
                        {selectedStore?.phone && <span>Ph: {selectedStore.phone} | </span>}
                        {selectedStore?.email && <span>Email: {selectedStore.email}</span>}
                    </div>
                </div>

                {/* Info Section */}
                <div className={styles.infoSection}>
                    <div className={styles.card}>
                        <div className={styles.title}>Invoice Details</div>
                        <p>
                            Invoice #: <b>{invoiceData.invoiceNumber}</b>
                        </p>
                        <p>
                            Date:{" "}
                            <b>{formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</b>
                        </p>
                        {invoiceData.paymentMode && (
                            <p>Payment: <b>{invoiceData.paymentMode}</b></p>
                        )}
                    </div>
                    <div className={styles.card}>
                        <div className={styles.title}>Customer</div>
                        <p>
                            <b>{invoiceData.customer?.name || "Walk-in Customer"}</b>
                        </p>
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

                {/* Table Selection */}
                <div className={styles.tableContainer}>
                    <table className={styles.neoedgeTable}>
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
                                    <td>{item.product?.name || "Unnamed Item"}</td>
                                    <td style={{ textAlign: "center" }}>{qty}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: "#dc2626" }}>
                                        {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "-"}
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(lineAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className={styles.tableFooterRow}>
                                <td><strong>Totals</strong></td>
                                <td style={{ textAlign: "center" }}><strong>{tableTotalQty}</strong></td>
                                <td style={{ textAlign: "right" }}><strong>{fmt(grossTotal)}</strong></td>
                                <td style={{ textAlign: "right", color: "#dc2626" }}>
                                    <strong>{tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "-"}</strong>
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 600 }}><strong>{fmt(tableTotalAmount)}</strong></td>
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
                <div className={styles.totalsSection}>
                    <div className={styles.totalCard}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Item Total:</span>
                            <span className={styles.amount}>{fmt(grossTotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>Discount:</span>
                                <span className={styles.amount} style={{ color: "#dc2626" }}>
                                    -{fmt(totalDiscount)}
                                </span>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>Tax (GST):</span>
                                <span className={styles.amount}>{fmt(totalGst)}</span>
                            </div>
                        )}
                        <div className={styles.finalRow}>
                            <span className={styles.finalLabel}>Total Due:</span>
                            <span className={styles.finalAmount}>{fmt(totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for your business — NeoEdge Billing Systems</p>
                    <p>Generated on {formatInvoiceDate(undefined, "YYYY-MM-DD HH:mm:ss")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default NeoEdgeTemplate;
