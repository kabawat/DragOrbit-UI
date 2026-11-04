"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

export default function SleekStreamTemplate({ invoiceData, selectedStore }) {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.sleekInvoice} id="invoice">
                <div className={styles.splitHeader}>
                    <div className={styles.metaSidebar}>
                        <h1 data-invoice-header>INVOICE</h1>
                        <div className={styles.metaDetail}>Invoice Number:</div>
                        <div className={styles.metaValue}>{invoiceData.invoiceNumber}</div>
                        <div className={styles.metaDetail}>Date Issued:</div>
                        <div className={styles.metaValue}>
                            {formatInvoiceDate(invoiceData.createdAt, "DD MMMM, YYYY")}
                        </div>
                    </div>

                    <div className={styles.storeCustomerInfo}>
                        <div className={styles.infoBlock}>
                            <div className={styles.title}>From</div>
                            <p className={styles.storeName}>{selectedStore?.storeName || "Sleek Stream Services"}</p>
                            <p className={styles.storeAddress}>{selectedStore?.address}</p>
                            {selectedStore?.phone && <p className={styles.storeAddress}>Ph: {selectedStore.phone}</p>}
                            {selectedStore?.email && <p className={styles.storeAddress}>{selectedStore.email}</p>}
                        </div>

                        <div className={styles.infoBlock}>
                            <div className={styles.title}>Bill To</div>
                            <p className={styles.valueBold}>{invoiceData.customer?.name || "Walk-in Customer"}</p>
                            {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                            {invoiceData.customer?.address && <p>{invoiceData.customer.address}</p>}
                        </div>
                    </div>
                </div>

                <div className={styles.tableArea}>
                    <table className={styles.sleekTable}>
                        <thead>
                            <tr>
                                <td className={`${styles.tableHeader} font-bold`} style={{ width: "35%" }}>Description</td>
                                <td className={`${styles.tableHeader} font-bold`} style={{ width: "5%", textAlign: "center" }}>Qty</td>
                                <td className={`${styles.tableHeader} font-bold`} style={{ width: "20%", textAlign: "right" }}>Rate</td>
                                <td className={`${styles.tableHeader} font-bold`} style={{ width: "20%", textAlign: "right" }}>Discount</td>
                                <td className={`${styles.tableHeader} font-bold`} style={{ width: "20%", textAlign: "right" }}>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => (
                                <tr key={index}>
                                    <td>
                                        <div className={styles.productName}>{item.product?.name}</div>
                                        {item.product?.sku && <div className={styles.productSku} style={{ fontSize: "11px", color: "#666" }}>SKU: {item.product.sku}</div>}
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

                <div className={styles.totalsArea}>
                    <div className={styles.totalsTable}>
                        <div className={styles.row}>
                            <div className={styles.totalLabel}>Item Total:</div>
                            <div className={styles.amount}>{fmt(grossTotal)}</div>
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
                                <div className={styles.amount}>{fmt(totalGst)}</div>
                            </div>
                        )}
                        <div className={styles.finalRow}>
                            <div className={styles.finalLabel}>AMOUNT DUE</div>
                            <div className={styles.finalAmount}>{fmt(totalAmount)}</div>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <p>Thank you for your business!</p>
                    <p style={{ opacity: 0.7, fontSize: "10px", marginTop: "8px" }}>
                        System Generated Invoice • {formatInvoiceDate(undefined, "DD/MM/YYYY HH:mm")}
                    </p>
                </div>
            </div>
        </InvoiceContainer>
    );
}
