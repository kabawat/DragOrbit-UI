"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const StructuredTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.modernInvoice} >
                {/* Header - Invoice Title and Number/Date */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 data-invoice-header>INVOICE</h1>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.invoiceDetail}>
                            Invoice #: <span>{invoiceData.invoiceNumber}</span>
                        </div>
                        <div className={styles.invoiceDetail}>
                            Date:{" "}
                            <span>
                                {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Company and Customer Address Info */}
                <div className={styles.addressInfo}>
                    <div className={styles.addressBlock}>
                        <h3>Billed From</h3>
                        <p style={{ fontWeight: 600 }}>
                            {selectedStore?.storeName || "Your Premium Store"}
                        </p>
                        <p>{selectedStore?.address || "456 Modern Avenue"}</p>
                        <p>
                            {selectedStore?.phone && <span>Phone: {selectedStore.phone}</span>}
                        </p>
                        <p>
                            {selectedStore?.email && <span>Email: {selectedStore.email}</span>}
                        </p>
                    </div>

                    <div className={styles.addressBlock}>
                        <h3>Billed To</h3>
                        <p style={{ fontWeight: 600 }}>
                            {invoiceData.customer?.name || "Walk-in Customer"}
                        </p>
                        {invoiceData.customer?.address && (
                            <p>{invoiceData.customer.address}</p>
                        )}
                        {invoiceData.customer?.phone && (
                            <p>Phone: {invoiceData.customer.phone}</p>
                        )}
                        {invoiceData.customer?.email && (
                            <p>Email: {invoiceData.customer.email}</p>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.structedTable}>
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
                                        <span className={styles.productDetail}>
                                            {item.product?.name || "Unknown Product"}
                                        </span>
                                        {item.product?.sku && (
                                            <span className={styles.productSku} style={{ fontSize: "11px", color: "#666", display: "block" }}>
                                                SKU: {item.product.sku}
                                            </span>
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

                {/* Totals Section */}
                <div className={styles.totalsSummary}>
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
                                <div className={styles.totalLabel}>GST:</div>
                                <div className={styles.amount}>
                                    {fmt(totalGst)}
                                </div>
                            </div>
                        )}
                        <div className={`${styles.row} ${styles.finalRow}`}>
                            <div className={styles.finalLabel}>Grand Total:</div>
                            <div className={styles.finalAmount}>
                                {fmt(totalAmount)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.termsNotes}>
                        <h4>Payment Terms & Notes</h4>
                        <p>
                            Payment is due within 7 days of the invoice date. Thank you for
                            choosing our services!
                        </p>
                        <p style={{ marginTop: "10px" }}>
                            Generated on{" "}
                            {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY [at] HH:mm")}
                        </p>
                    </div>
                    <div className={styles.signature}>Authorized Signature</div>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default StructuredTemplate;
