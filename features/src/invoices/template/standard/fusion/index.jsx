"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const FusionTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.fusionInvoice} >
                {/* Header Section */}
                <div className={styles.headerSection}>
                    <div className={styles.brandingBlock}>
                        <h2>{selectedStore?.storeName || "FUSION INC."}</h2>
                        <p>{selectedStore?.address || "101 Tech Center, City"}</p>
                        {selectedStore?.phone && <p>{selectedStore.phone}</p>}
                        {selectedStore?.email && <p>{selectedStore.email}</p>}
                    </div>
                    <div className={styles.invoiceInfo}>
                        <h1 data-invoice-header>INVOICE</h1>
                        <div>
                            <span style={{ color: "#bdc3c7" }}>No:</span>
                            <span className={styles.tag}>{invoiceData.invoiceNumber}</span>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <span style={{ color: "#bdc3c7" }}>Date:</span>
                            <span className={styles.tag}>
                                {formatInvoiceDate(invoiceData.createdAt, "DD-MMM-YYYY")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className={styles.detailsSection}>
                    <div className={styles.detailsBlock}>
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
                    <div className={styles.detailsBlock}>
                        <div className={styles.label}>Issued By</div>
                        <div className={styles.value}>
                            {selectedStore?.storeName || "FUSION INC."}
                        </div>
                        {invoiceData.paymentMode && (
                            <p>Payment Mode: <b>{invoiceData.paymentMode}</b></p>
                        )}
                        <p>Reference: {invoiceData.invoiceNumber}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.fusionTable}>
                        <thead>
                            <tr>
                                <td className="font-bold" style={{ width: "35%" }}>Product</td>
                                <td className="font-bold" style={{ width: "5%", textAlign: "center" }}>Qty</td>
                                <td className="font-bold" style={{ width: "20%", textAlign: "right" }}>Unit Price</td>
                                <td className="font-bold" style={{ width: "20%", textAlign: "right" }}>Discount</td>
                                <td className="font-bold" style={{ width: "20%", textAlign: "right" }}>Total</td>
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
                                            <div className={styles.productSku}>
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

                {/* Totals Section */}
                <div className={styles.totalsContainer}>
                    <div className={styles.totals}>
                        <div className={styles.totalRow}>
                            <div className={styles.rowLabel}>Item Total:</div>
                            <div className={styles.amount}>{fmt(grossTotal)}</div>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <div className={styles.rowLabel}>Discount:</div>
                                <div className={styles.amount} style={{ color: "#e74c3c" }}>
                                    -{fmt(totalDiscount)}
                                </div>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.totalRow}>
                                <div className={styles.rowLabel}>GST:</div>
                                <div className={styles.amount}>{fmt(totalGst)}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Final Total Bar */}
                <div className={styles.finalBar}>
                    <span>TOTAL AMOUNT DUE:</span>
                    <span>{fmt(totalAmount)}</span>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>
                        Thank you for your business. We look forward to serving you again!
                    </p>
                    <p>Generated on {formatInvoiceDate(undefined, "YYYY-MM-DD HH:mm:ss")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default FusionTemplate;
