"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const VintageTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.vintageInvoice} >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.storeDetails}>
                        <div className={styles.storeName}>
                            {selectedStore?.storeName || "Your Store"}
                        </div>
                        <p>
                            {selectedStore?.address || "123 Market Road, City 12345"} <br />
                            {selectedStore?.phone && <span>Phone: {selectedStore.phone}</span>} <br />
                            {selectedStore?.email && <span>Email: {selectedStore.email}</span>}
                        </p>
                    </div>
                    <div className={styles.invoiceTitleBox}>
                        <h1 data-invoice-header>INVOICE</h1>
                        <p>{invoiceData.invoiceNumber}</p>
                        <p>{formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY")}</p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoBox}>
                        <h3>Bill To</h3>
                        <p>
                            <strong>
                                {invoiceData.customer?.name || "Walk-in Customer"}
                            </strong>
                        </p>
                        {invoiceData.customer?.address && (
                            <p>{invoiceData.customer.address}</p>
                        )}
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                        {invoiceData.customer?.email && (
                            <p>Email: {invoiceData.customer.email}</p>
                        )}
                    </div>
                    <div className={styles.infoBox}>
                        <h3>Payment Info</h3>
                        <p>
                            <strong>Payment Mode:</strong> {invoiceData.paymentMode || "Cash"}
                        </p>
                        <p>
                            <strong>Invoice Date:</strong>
                            {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}
                        </p>
                        <p>
                            <strong>Status:</strong> {invoiceData.status || "Paid"}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.vintageTable}>
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
                                        <span className={styles.productName}>
                                            {item.product?.name || "Product"}
                                        </span>
                                        {item.product?.sku && (
                                            <div style={{ fontSize: "11px", color: "#6d4c41", fontStyle: "italic" }}>SKU: {item.product.sku}</div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{qty}</td>
                                    <td style={{ textAlign: "right" }}>
                                        {fmt(unitPrice)}
                                    </td>
                                    <td style={{ textAlign: "right", color: "#2e7d32" }}>
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
                                <td style={{ textAlign: "right", color: "#2e7d32" }}>
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
                <div className={styles.totalsArea}>
                    <div className={styles.totalsBox}>
                        <div className={styles.row}>
                            <span>Item Total:</span>
                            <span>{fmt(grossTotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.row}>
                                <span>Discount:</span>
                                <span style={{ color: "#2e7d32" }}>-{fmt(totalDiscount)}</span>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.row}>
                                <span>GST:</span>
                                <span>{fmt(totalGst)}</span>
                            </div>
                        )}
                        <div className={`${styles.row} ${styles.grandTotalRow}`}>
                            <span>Total:</span>
                            <span>{fmt(totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for your business!</p>
                    <p>
                        This is a system-generated invoice. Generated on
                        {formatInvoiceDate(invoiceData.createdAt, "MM/DD/YYYY")}
                    </p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default VintageTemplate;
