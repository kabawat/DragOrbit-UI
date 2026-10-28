"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const MatrixLedgerTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.matrixInvoice} >
                {/* Header Section */}
                <div className={styles.header}>
                    <h1 data-invoice-header>TAX INVOICE / RECEIPT</h1>
                    <div className={styles.storeInfo}>
                        <p>
                            {selectedStore?.storeName || "Matrix Ledger Systems"} |{" "}
                            {selectedStore?.address || "Data Center, Ledger Street"}
                        </p>
                        <p>
                            {selectedStore?.phone && <span>Ph: {selectedStore.phone} | </span>}
                            {selectedStore?.email && <span>Email: {selectedStore.email}</span>}
                        </p>
                    </div>
                </div>

                {/* Info Bar */}
                <div className={styles.infoBar}>
                    <div className={styles.metaBlock}>
                        <div className={styles.title}>Transaction Data</div>
                        <p>
                            Invoice #:{" "}
                            <span className={`${styles.valueBold} ${styles.invoiceNumber}`}>
                                {invoiceData.invoiceNumber}
                            </span>
                        </p>
                        <p>
                            Date Issued:{" "}
                            <span className={styles.valueBold}>
                                {formatInvoiceDate(invoiceData.createdAt, "YYYY-MM-DD")}
                            </span>
                        </p>
                    </div>

                    <div className={styles.metaBlock} style={{ textAlign: "right" }}>
                        <div className={styles.title}>Bill To Entity</div>
                        <p className={styles.valueBold}>
                            {invoiceData.customer?.name || "Walk-in Customer"}
                        </p>
                        {invoiceData.customer?.phone && (
                            <p>Ph: {invoiceData.customer.phone}</p>
                        )}
                        {invoiceData.customer?.email && (
                            <p>Email: {invoiceData.customer.email}</p>
                        )}
                    </div>
                </div>

                {/* Table Selection */}
                <div className={styles.tableContainer}>
                    <table className={styles.matrixTable}>
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
                                    <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(lineAmount)}</td>
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
                                <td style={{ textAlign: "right", fontWeight: 700 }}><strong>{fmt(tableTotalAmount)}</strong></td>
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
                <div className={styles.totalsTable}>
                    <div className={styles.totalRow}>
                        <div className={styles.label}>Item Total:</div>
                        <div className={styles.amount}>{fmt(grossTotal)}</div>
                    </div>
                    {totalDiscount > 0 && (
                        <div className={styles.totalRow} style={{ color: "#c0392b" }}>
                            <div className={styles.label}>DISCOUNT:</div>
                            <div className={styles.amount}>
                                -{fmt(totalDiscount)}
                            </div>
                        </div>
                    )}
                    {hasAnyGst && (
                        <div className={styles.totalRow}>
                            <div className={styles.label}>Tax (GST):</div>
                            <div className={styles.amount}>{fmt(totalGst)}</div>
                        </div>
                    )}
                    <div className={styles.finalRow}>
                        <div className={styles.finalLabel}>AMOUNT:</div>
                        <div className={styles.finalAmount}>{fmt(totalAmount)}</div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>E&OE. This transaction record is digitally generated.</p>
                    <p>Audit Stamp: {formatInvoiceDate(undefined, "YYYYMMDDHHmmss")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default MatrixLedgerTemplate;
