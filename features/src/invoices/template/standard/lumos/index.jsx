"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const LumosTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.lumosInvoice} >
                {/* Header Section */}
                <div className={styles.header}>
                    <div>
                        <h1 data-invoice-header>INVOICE</h1>
                        <p style={{ fontSize: "12px", marginTop: "5px" }}>
                            Invoice No: <strong>{invoiceData.invoiceNumber}</strong>
                        </p>
                    </div>
                    <div className={styles.storeInfo}>
                        <strong>{selectedStore?.storeName || "Your Store"}</strong>
                        <p>{selectedStore?.address || "123 Business Street"}</p>
                        <p>
                            {selectedStore?.phone && <span>Ph: {selectedStore.phone}</span>}
                            {selectedStore?.email && <span> | Email: {selectedStore.email}</span>}
                        </p>
                    </div>
                </div>

                {/* Body Section */}
                <div className={styles.invoiceBody}>
                    <div className={styles.summary}>
                        <div>
                            <strong>Date:</strong>{" "}
                            {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY")}
                        </div>
                        <div>
                            <strong>Customer:</strong>{" "}
                            {invoiceData.customer?.name || "Walk-in Customer"}
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.infoBlock}>
                            <div className={styles.label}>Bill To</div>
                            <div className={styles.value}>
                                {invoiceData.customer?.name || "Walk-in Customer"}
                            </div>
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
                        <div className={styles.infoBlock} style={{ textAlign: "right" }}>
                            <div className={styles.label}>Issued By</div>
                            <div className={styles.value}>
                                {selectedStore?.storeName || "Your Store"}
                            </div>
                            {selectedStore?.email && <p>{selectedStore.email}</p>}
                            {invoiceData.paymentMode && (
                                <p>Payment: {invoiceData.paymentMode}</p>
                            )}
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className={styles.tableContainer}>
                        <table className={styles.lumosTable}>
                            <thead>
                                <tr>
                                    <td className={'font-bold'} style={{ width: "30%" }}>Product</td>
                                    <td className={'font-bold'} style={{ width: "5%", textAlign: "center" }}>Qty</td>
                                    <td className={'font-bold'} style={{ width: "20%", textAlign: "right" }}>Unit Price</td>
                                    <td className={'font-bold'} style={{ width: "20%", textAlign: "right" }}>Discount</td>
                                    <td className={'font-bold'} style={{ width: "20%", textAlign: "right" }}>Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => (
                                    <tr key={index}>
                                        <td>
                                            <div className={styles.productName}>
                                                {item.product?.name || "Unnamed Product"}
                                            </div>
                                            {item.product?.sku && (
                                                <div className={styles.productSku} style={{ fontSize: "10px", color: "#999" }}>
                                                    SKU: {item.product.sku}
                                                </div>
                                            )}
                                        </td>
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

                    {/* Totals */}
                    <div className={styles.totals}>
                        <div className={styles.totalRow}>
                            <div className={styles.label}>Item Total:</div>
                            <div className={styles.amount}>{fmt(grossTotal)}</div>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <div className={styles.label}>Discount:</div>
                                <div className={styles.amount} style={{ color: "#e74c3c" }}>
                                    -{fmt(totalDiscount)}
                                </div>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.totalRow}>
                                <div className={styles.label}>GST:</div>
                                <div className={styles.amount}>{fmt(totalGst)}</div>
                            </div>
                        )}
                        <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                            <div className={styles.label}>Total:</div>
                            <div className={styles.amount}>{fmt(totalAmount)}</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>
                        Thank you for choosing {selectedStore?.storeName || "our store"}!
                    </p>
                    <p>
                        Generated on{" "}
                        {formatInvoiceDate(invoiceData.createdAt, "MMMM DD, YYYY [at] HH:mm")}
                    </p>
                    <p>This is a system-generated invoice and requires no signature.</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default LumosTemplate;
