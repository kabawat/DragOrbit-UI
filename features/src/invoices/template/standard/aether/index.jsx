"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const AetherTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    return (
        <InvoiceContainer style={{ padding: 0 }}>
            <div className={styles.aetherInvoice}>
                {/* Left Panel - Dark Sidebar */}
                <div className={styles.leftPanel}>
                    <div className={styles.storeInfo}>
                        <h2 className={styles.storeName}>{selectedStore?.storeName || "Your Store"}</h2>
                        <p>{selectedStore?.address || ""}</p>
                        {selectedStore?.phone && <p>{selectedStore.phone}</p>}
                        {selectedStore?.email && <p>{selectedStore.email}</p>}
                        {selectedStore?.gst && <p>GSTIN: {selectedStore.gst}</p>}
                    </div>
                    <div>
                        <p style={{ fontSize: "10px", marginTop: "40px", opacity: 0.7 }}>
                            © {formatInvoiceDate(undefined, "YYYY")} {selectedStore?.storeName || "Your Store"}
                        </p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className={styles.rightPanel}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div>
                            <h1 className={styles.title}>INVOICE</h1>
                            <div className={styles.date}>{formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p className={styles.invoiceNumber}>
                                Invoice No: <strong>{invoiceData.invoiceNumber}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div className={styles.infoSection}>
                        <div className={styles.infoBlock}>
                            <div className={styles.label}>Bill To</div>
                            <div className={styles.value}>{invoiceData.customer?.name || "Walk-in Customer"}</div>
                            {invoiceData.customer?.email && <p style={{ fontSize: "12px", color: "#7f8c8d" }}>{invoiceData.customer.email}</p>}
                            {invoiceData.customer?.phone && <p style={{ fontSize: "12px", color: "#7f8c8d" }}>{invoiceData.customer.phone}</p>}
                        </div>
                        <div className={styles.infoBlock}>
                            <div className={styles.label}>Issued By</div>
                            <div className={styles.value}>{selectedStore?.storeName || "Your Store"}</div>
                            {selectedStore?.email && <p style={{ fontSize: "12px", color: "#7f8c8d" }}>{selectedStore.email}</p>}
                        </div>
                    </div>

                    {/* B2C Items Table — Discount shown below Unit Price */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <td style={{ width: "42%", textAlign: "left" }}>Product</td>
                                <td style={{ width: "12%", textAlign: "center" }}>Qty</td>
                                <td style={{ width: "28%", textAlign: "right" }}>Unit Price</td>
                                <td style={{ width: "18%", textAlign: "right" }}>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {getItemRows(items).map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => (
                                <tr key={index}>
                                    <td><div className={styles.productName}>{item.product?.name || item.productName || "Product"}</div></td>
                                    <td style={{ textAlign: "center" }}>{qty}{item.uom ? ` ${item.uom}` : ""}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <div>{fmt(unitPrice)}</div>
                                        {lineDiscount > 0 && (
                                            <div style={{ fontSize: "11px", color: "#e74c3c", marginTop: "2px" }}>
                                                Disc: -{fmt(lineDiscount)}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(lineAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className={styles.tableFooterRow}>
                                <td style={{ textAlign: "left", fontWeight: 700 }}>Total</td>
                                <td style={{ textAlign: "center", fontWeight: 700 }}>{tableTotalQty}</td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>
                                    <div>{fmt(grossTotal)}</div>
                                    {tableTotalDiscount > 0 && (
                                        <div style={{ fontSize: "11px", color: "#e74c3c", fontWeight: 400, marginTop: "2px" }}>
                                            Disc: -{fmt(tableTotalDiscount)}
                                        </div>
                                    )}
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(tableTotalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>


                    {/* B2C Totals */}
                    <div className={styles.totals}>
                        <div className={styles.totalRow}>
                            <div className={styles.totalLabel}>Item Total:</div>
                            <div className={styles.totalAmount}>{fmt(grossTotal)}</div>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <div className={styles.totalLabel}>Discount (-):</div>
                                <div className={styles.totalAmount} style={{ color: "#e74c3c" }}>-{fmt(totalDiscount)}</div>
                            </div>
                        )}
                        {totalGst > 0 && (
                            <div className={styles.totalRow}>
                                <div className={styles.totalLabel}>{allInclusive ? "GST (included):" : "GST (+):"}</div>
                                <div className={styles.totalAmount}>{fmt(totalGst)}</div>
                            </div>
                        )}
                        <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                            <div className={styles.totalLabel}>Total Payable:</div>
                            <div className={styles.totalAmount}>{fmt(totalAmount)}</div>
                        </div>
                        {hasAnyGst && (
                            <div className={styles.gstNote}>
                                {allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <p>Thank you for your business!</p>
                        <p>Generated on {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY [at] HH:mm")}</p>
                    </div>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default AetherTemplate;
