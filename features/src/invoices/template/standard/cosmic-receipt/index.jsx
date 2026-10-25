"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const CosmicReceiptTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    return (
        <InvoiceContainer>
            <div className={styles.cosmicInvoice}>
                {/* Header */}
                <div className={styles.header}>
                    <h1>RECEIPT</h1>
                    <div className={styles.storeInfo}>
                        <p><span className={styles.storeName}>{selectedStore?.storeName || "Cosmic Systems Ltd."}</span></p>
                        <p>
                            {selectedStore?.address && <span>{selectedStore.address} | </span>}
                            {selectedStore?.phone && <span>Ph: {selectedStore.phone}</span>}
                            {selectedStore?.gst && <span> | GSTIN: {selectedStore.gst}</span>}
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className={styles.infoSection}>
                    <div className={styles.infoBlock}>
                        <div className={styles.label}>Transaction Meta</div>
                        <p>Invoice #: <span className={styles.valueBold}>{invoiceData.invoiceNumber}</span></p>
                        <p>Date: <span className={styles.valueBold}>{formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</span></p>
                    </div>
                    <div className={styles.infoBlock} style={{ textAlign: "right" }}>
                        <div className={styles.label}>Billed To</div>
                        <p className={styles.valueBold}>{invoiceData.customer?.name || "Walk-in Customer"}</p>
                        {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                    </div>
                </div>

                {/* B2C Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.cosmicTable}>
                        <thead>
                            <tr>
                                <td style={{ width: "40%", textAlign: "left" }}>Product</td>
                                <td style={{ width: "12%", textAlign: "center" }}>Qty</td>
                                <td style={{ width: "16%", textAlign: "right" }}>Unit Price</td>
                                <td style={{ width: "14%", textAlign: "right" }}>Discount</td>
                                <td style={{ width: "18%", textAlign: "right" }}>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {getItemRows(items).map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => (
                                <tr key={index}>
                                    <td><div className={styles.productName}>{item.product?.name || item.productName || "Product"}</div></td>
                                    <td style={{ textAlign: "center" }}>{qty}{item.uom ? ` ${item.uom}` : ""}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: lineDiscount > 0 ? "#ff5252" : "#aaa" }}>
                                        {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "—"}
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(lineAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className={styles.tableFooterRow}>
                                <td style={{ textAlign: "left", fontWeight: 700 }}>Total</td>
                                <td style={{ textAlign: "center", fontWeight: 700 }}>{tableTotalQty}</td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(grossTotal)}</td>
                                <td style={{ textAlign: "right", fontWeight: 700, color: tableTotalDiscount > 0 ? "#ff5252" : "inherit" }}>
                                    {tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "—"}
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(tableTotalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* B2C Totals */}
                <div className={styles.totalsSection}>
                    <div className={styles.totalRow}>
                        <div className={styles.rowLabel}>Item Total:</div>
                        <div className={styles.amount}>{fmt(grossTotal)}</div>
                    </div>
                    {totalDiscount > 0 && (
                        <div className={styles.totalRow}>
                            <div className={styles.rowLabel}>Discount (-):</div>
                            <div className={styles.amount} style={{ color: "#ff5252" }}>-{fmt(totalDiscount)}</div>
                        </div>
                    )}
                    {totalGst > 0 && (
                        <div className={styles.totalRow}>
                            <div className={styles.rowLabel}>{allInclusive ? "GST (included):" : "GST (+):"}</div>
                            <div className={styles.amount}>{fmt(totalGst)}</div>
                        </div>
                    )}
                    <div className={styles.finalRow}>
                        <div className={styles.finalLabel}>AMOUNT DUE:</div>
                        <div className={styles.finalAmount}>{fmt(totalAmount)}</div>
                    </div>
                    {hasAnyGst && <div className={styles.gstNote}>{allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}</div>}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for your transaction.</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default CosmicReceiptTemplate;
