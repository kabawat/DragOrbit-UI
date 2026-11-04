"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const ProfessionalBlueTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.blueInvoice} >
                {/* Header Grid Section */}
                <div className={styles.headerGrid}>
                    {/* Store Info - Left */}
                    <div className={styles.storeInfo}>
                        <h2>{selectedStore?.storeName || "Corporate Solutions Inc."}</h2>
                        <p>{selectedStore?.address || "123 Business Park, Metro City"}</p>
                        <p>
                            {selectedStore?.phone && <span>Ph: {selectedStore.phone} | </span>}
                            {selectedStore?.email && <span>Email: {selectedStore.email}</span>}
                        </p>
                    </div>

                    {/* Invoice Details - Right */}
                    <div className={styles.invoiceDetails}>
                        <h1 data-invoice-header>INVOICE</h1>
                        <div className={styles.detailRow}>
                            {/* <div className={styles.detailLabel}>Invoice #</div> */}
                            <div className={styles.invoiceNumberValue}>
                                {invoiceData.invoiceNumber}
                            </div>
                        </div>
                        <div className={styles.detailRow}>
                            <div className={styles.detailLabel}>Date Issued</div>
                            <div>
                                {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bill To Section */}
                <div className={styles.billTo}>
                    <div className={styles.billToTitle}>Bill To</div>
                    <p className={styles.billToName}>
                        {invoiceData.customer?.name || "Valued Client Name"}
                    </p>
                    {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                    {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                    {invoiceData.customer?.address && <p>{invoiceData.customer.address}</p>}
                </div>

                {/* Table Selection */}
                <div className={styles.tableContainer}>
                    <table className={styles.blueTable}>
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
                                            {item.product?.name || "Service Rendered"}
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
                                    <td className={styles.tableTotalCell} style={{ textAlign: "right" }}>
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
                                <td className={styles.tableTotalCell} style={{ textAlign: "right" }}>
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

                {/* Totals Section */}
                <div className={styles.totalsArea}>
                    <div className={styles.totalsTable}>
                        <div className={styles.row}>
                            <div className={styles.totalLabel}>Item Total:</div>
                            <div className={styles.amount}>
                                {fmt(grossTotal)}
                            </div>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.row}>
                                <div className={styles.totalLabel}>Total Discount:</div>
                                <div className={styles.amount} style={{ color: "#e74c3c" }}>
                                    -{fmt(totalDiscount)}
                                </div>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.row}>
                                <div className={styles.totalLabel}>Total Tax (GST):</div>
                                <div className={styles.amount}>
                                    {fmt(totalGst)}
                                </div>
                            </div>
                        )}
                        <div className={`${styles.row} ${styles.finalRow}`}>
                            <div className={styles.totalLabel}>AMOUNT DUE:</div>
                            <div className={`${styles.amount} ${styles.finalAmount}`}>
                                {fmt(totalAmount)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for choosing us. Please pay within 30 days.</p>
                    <p>Generated on {formatInvoiceDate(undefined, "YYYY-MM-DD HH:mm:ss")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default ProfessionalBlueTemplate;
