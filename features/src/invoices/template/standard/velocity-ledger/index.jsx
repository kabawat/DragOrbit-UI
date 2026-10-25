"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const VelocityLedgerTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.velocityInvoice} >
                {/* Header Band */}
                <div className={styles.headerBand}>
                    <h1>TAX INVOICE</h1>
                    <div className={styles.invoiceNumberBadge}>
                        INVOICE # {invoiceData.invoiceNumber}
                    </div>
                </div>

                {/* Store Info Block (Right-aligned) */}
                <div className={styles.storeInfoArea}>
                    <div className={styles.storeName}>
                        {selectedStore?.storeName || "Velocity Solutions Corp."}
                    </div>
                    <p>
                        {selectedStore?.address || "101 Commerce Tower, Business Park"}
                    </p>
                    <p>
                        {selectedStore?.phone && <span>Ph: {selectedStore.phone} | </span>}
                        {selectedStore?.email && <span>Email: {selectedStore.email}</span>}
                    </p>
                </div>

                {/* Info Bar - Invoice Meta and Customer */}
                <div className={styles.infoContainer}>
                    {/* Invoice Details Box */}
                    <div className={styles.detailBox}>
                        <div className={styles.title}>Invoice Date & Due</div>
                        <p>
                            Issued:{" "}
                            <span className={styles.valueBold}>
                                {formatInvoiceDate(invoiceData.createdAt, "MMM DD, YYYY")}
                            </span>
                        </p>
                        <p>
                            Due: <span className={styles.valueBold}>Upon Receipt</span>
                        </p>
                    </div>

                    {/* Bill To Box */}
                    <div className={styles.detailBox}>
                        <div className={styles.title}>Bill To / Customer</div>
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
                <div className={styles.tableArea}>
                    <table className={styles.velocityTable}>
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

                {/* Totals Area */}
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

                {/* Grand Total Footer Band */}
                <div className={styles.grandTotalHighlight}>
                    <div className={styles.finalLabel}>TOTAL AMOUNT DUE:</div>
                    <div className={styles.finalAmount}>
                        {fmt(totalAmount)}
                    </div>
                </div>

                <div className={styles.electronicFooter}>
                    <p>
                        This invoice was generated electronically and is valid without a
                        signature. Thank you for your continued partnership.
                    </p>
                    <p style={{ marginTop: "5px", opacity: 0.8 }}>
                        Generated on {formatInvoiceDate(undefined, "YYYY-MM-DD HH:mm:ss")}
                    </p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default VelocityLedgerTemplate;
