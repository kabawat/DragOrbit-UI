"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const FlexviewTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.flexviewInvoice} >
                {/* Header */}
                <div className={styles.header}>
                    <h1 data-invoice-header>INVOICE</h1>
                    <div className={styles.storeInfo}>
                        <p style={{ fontWeight: "600" }}>
                            {selectedStore?.storeName || "Flexview Builders"}
                        </p>
                        <p>{selectedStore?.address || "Sunset Avenue, Mumbai"}</p>
                        <p>
                            {selectedStore?.phone && <span>{selectedStore.phone} | </span>}
                            {selectedStore?.email && <span>{selectedStore.email}</span>}
                        </p>
                    </div>
                </div>

                {/* Info Section */}
                <div className={styles.infoSection}>
                    <div className={styles.infoBlock}>
                        <h3>Bill To</h3>
                        <p><strong>{invoiceData.customer?.name || "Walk-in Customer"}</strong></p>
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                        {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                        {invoiceData.customer?.address && <p>{invoiceData.customer.address}</p>}
                    </div>
                    <div className={styles.infoBlock} style={{ textAlign: "right" }}>
                        <h3>Invoice Details</h3>
                        <p>
                            <b>Invoice #:</b> {invoiceData.invoiceNumber}
                        </p>
                        <p>
                            <b>Date:</b>{" "}
                            {formatInvoiceDate(invoiceData.createdAt, "MMM DD, YYYY")}
                        </p>
                        {invoiceData.paymentMode && (
                            <p><b>Payment:</b> {invoiceData.paymentMode}</p>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.flexviewTable}>
                        <thead>
                            <tr>
                                <td className="font-bold" style={{ width: "50%" }}>Product</td>
                                <td className="font-bold" style={{ width: "5%", textAlign: "center" }}>Qty</td>
                                <td className="font-bold" style={{ width: "15%", textAlign: "right" }}>Unit Price</td>
                                <td className="font-bold" style={{ width: "15%", textAlign: "right" }}>Discount</td>
                                <td className="font-bold" style={{ width: "15%", textAlign: "right" }}>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => (
                                <tr key={index}>
                                    <td>{item.product?.name || "Unnamed Item"}</td>
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
                <div className={styles.totalsSection}>
                    <div className={styles.totalsBox}>
                        <div className={styles.totalRow}>
                            <div className={styles.label}>Item Total</div>
                            <div className={styles.amount}>{fmt(grossTotal)}</div>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <div className={styles.label}>Discount</div>
                                <div className={styles.amount} style={{ color: "#e74c3c" }}>
                                    -{fmt(totalDiscount)}
                                </div>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.totalRow}>
                                <div className={styles.label}>GST</div>
                                <div className={styles.amount}>{fmt(totalGst)}</div>
                            </div>
                        )}
                        <div className={styles.grandTotal}>
                            <div className={styles.label}>Total Due</div>
                            <div className={styles.amount}>{fmt(totalAmount)}</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for choosing Flexview Builders!</p>
                    <p>Generated on {formatInvoiceDate(undefined, "YYYY-MM-DD HH:mm:ss")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default FlexviewTemplate;
