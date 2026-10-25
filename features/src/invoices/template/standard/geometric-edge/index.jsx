"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const GeometricEdgeTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.geometricInvoice} >
                {/* Header Section */}
                <div className={styles.header}>
                    <h1>INVOICE</h1>
                    <div className={styles.metaInfo}>
                        <p>
                            Invoice No:{" "}
                            <span className={styles.valueBold}>
                                {invoiceData.invoiceNumber}
                            </span>
                        </p>
                        <p>
                            Date:{" "}
                            <span className={styles.valueBold}>
                                {formatInvoiceDate(invoiceData.createdAt, "MMM DD, YYYY")}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className={styles.infoSection}>
                    {/* Store/Biller Info */}
                    <div className={styles.infoBox}>
                        <div className={styles.label}>Billed By</div>
                        <span className={styles.storeName}>
                            {selectedStore?.storeName || "Geometric Billing Corp"}
                        </span>
                        <p className={styles.storeInfoText}>
                            {selectedStore?.address || "123 Structure Road, Business Park"}
                        </p>
                        <p className={styles.storeInfoText}>
                            {selectedStore?.phone && <span>Ph: {selectedStore.phone} | </span>}
                            {selectedStore?.email && <span>Email: {selectedStore.email}</span>}
                        </p>
                    </div>

                    {/* Customer/Bill To Info */}
                    <div className={styles.infoBox}>
                        <div className={styles.label}>Bill To</div>
                        <p className={styles.valueBold}>
                            {invoiceData.customer?.name || "Walk-in Customer"}
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
                    <table className={styles.geometricTable}>
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
                                            {item.product?.name || "Unnamed Item"}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>{qty}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: "#c0392b" }}>
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
                                <td style={{ textAlign: "right", color: "#c0392b" }}>
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
                <div className={styles.totalsSection}>
                    <div className={styles.totalsTable}>
                        <div className={styles.totalRow}>
                            <div className={styles.totalLabel}>Item Total:</div>
                            <div className={styles.amount}>{fmt(grossTotal)}</div>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <div className={styles.totalLabel}>Discount:</div>
                                <div className={styles.amount} style={{ color: "#c0392b" }}>
                                    -{fmt(totalDiscount)}
                                </div>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.totalRow}>
                                <div className={styles.totalLabel}>Tax (GST):</div>
                                <div className={styles.amount}>{fmt(totalGst)}</div>
                            </div>
                        )}
                        <div className={styles.finalRow}>
                            <div className={styles.finalLabel}>TOTAL DUE:</div>
                            <div className={styles.finalAmount}>{fmt(totalAmount)}</div>
                        </div>
                    </div>
                </div>

                {/* Footer & Signature */}
                <div className={styles.footer}>
                    <p>
                        Thank you for choosing Geometric Billing. All amounts are in INR.
                    </p>
                    <div className={styles.signatureLine}>Authorized Signature</div>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default GeometricEdgeTemplate;
