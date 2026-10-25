"use client";
import { addInvoiceDays, formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const PrismTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.prismInvoice} >
                {/* Header Section */}
                <div className={styles.header}>
                    <div>
                        <h1>INVOICE</h1>
                    </div>
                    <div className={styles.storeDetails}>
                        <h2>{selectedStore?.storeName || "PRISM TECHNOLOGIES"}</h2>
                        <p>{selectedStore?.address || "555 Innovation Park"}</p>
                        <p>
                            {selectedStore?.phone && <span>{selectedStore.phone} | </span>}
                            {selectedStore?.email && <span>{selectedStore.email}</span>}
                        </p>
                    </div>
                </div>

                {/* Info Bar */}
                <div className={styles.infoBar}>
                    <span>
                        Invoice No: <strong>{invoiceData.invoiceNumber}</strong>
                    </span>
                    <span>
                        Issue Date:{" "}
                        <strong>
                            {formatInvoiceDate(invoiceData.createdAt, "DD-MMM-YYYY")}
                        </strong>
                    </span>
                    <span>
                        Due Date:{" "}
                        <strong>
                            {formatInvoiceDate(addInvoiceDays(invoiceData.createdAt, 30), "DD-MMM-YYYY")}
                        </strong>
                    </span>
                </div>

                {/* Billing Details Section */}
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
                    <div className={styles.detailsBlock} style={{ textAlign: "right" }}>
                        <div className={styles.label}>Issued By</div>
                        <div className={styles.value}>
                            {selectedStore?.storeName || "PRISM TECHNOLOGIES"}
                        </div>
                        <p>Prepared by: Accounts Dept.</p>
                        {invoiceData.paymentMode && (
                            <p>Payment: {invoiceData.paymentMode}</p>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.prismTable}>
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
                                    <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(lineAmount)}</td>
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

                {/* Totals Section */}
                <div className={styles.totalsContainer}>
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
                    </div>
                </div>

                {/* Final Total Block */}
                <div className={styles.finalTotalBlock}>
                    <span>TOTAL AMOUNT DUE:</span>
                    <span>{fmt(totalAmount)}</span>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>
                        Thank you for choosing{" "}
                        {selectedStore?.storeName || "Prism Technologies"}.
                    </p>
                    <p>Generated on {formatInvoiceDate(undefined, "YYYY-MM-DD HH:mm:ss")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default PrismTemplate;
