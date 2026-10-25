"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const ProfessionalTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.professionalInvoice} >
                {/* Header */}
                <div className={styles.header}>
                    <h1>INVOICE</h1>
                    <div className={styles.subtitle}>Professional Business Document</div>
                    <div className={styles.invoiceNumberLabel}>{invoiceData.invoiceNumber}</div>
                    <div className={styles.date}>
                        Date: {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY")}
                    </div>
                </div>

                {/* Info Grid */}
                <div className={styles.infoGrid}>
                    <div className={styles.section}>
                        <h3>From</h3>
                        <div className={styles.companyName}>
                            {selectedStore?.storeName || "Your Store"}
                        </div>
                        <p>{selectedStore?.address || "123 Business Street"}</p>
                        <p>Phone: {selectedStore?.phone || "+91 9876543210"}</p>
                        <p>Email: {selectedStore?.email || "info@yourstore.com"}</p>
                    </div>

                    <div className={styles.section}>
                        <h3>Bill To</h3>
                        <div className={styles.customerName}>
                            {invoiceData.customer?.name || "Walk-in Customer"}
                        </div>
                        {invoiceData.customer?.email && (
                            <p>Email: {invoiceData.customer.email}</p>
                        )}
                        {invoiceData.customer?.phone && (
                            <p>Phone: {invoiceData.customer.phone}</p>
                        )}
                        {invoiceData.customer?.address && (
                            <p>{invoiceData.customer.address}</p>
                        )}
                    </div>
                </div>

                {/* Table Selection */}
                <div className={styles.tableContainer}>
                    <table className={styles.professionalTable}>
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
                                    <td className={styles.descriptionCell}>
                                        <div className={styles.productName}>
                                            {item.product?.name || "Unknown Product"}
                                        </div>
                                        {item.product?.sku && (
                                            <div className={styles.productSku} style={{ fontSize: "11px", color: "#666" }}>SKU: {item.product.sku}</div>
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
                        <div className={styles.totalRow} style={{ fontWeight: 700 }}>
                            <span>TOTAL AMOUNT:</span>
                            <span>{fmt(totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.signatureArea}>
                        <div className={styles.signatureBox}>
                            <div className={styles.signatureLine}></div>
                            <p>Authorized Signature</p>
                        </div>
                        <div className={styles.signatureBox}>
                            <div className={styles.signatureLine}></div>
                            <p>Customer Signature</p>
                        </div>
                    </div>
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

export default ProfessionalTemplate;
