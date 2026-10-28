"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const PillarProTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.pillarInvoice} >
                {/* Header Section */}
                <div className={styles.header}>
                    <h1 data-invoice-header>INVOICE</h1>
                    <div className={styles.storeInfo}>
                        <span className={styles.storeName}>
                            {selectedStore?.storeName || "Pillar Pro Solutions"}
                        </span>
                        <p>{selectedStore?.address || "321 Executive Center"}</p>
                        <p>
                            {selectedStore?.phone && <span>{selectedStore.phone} | </span>}
                            {selectedStore?.email && <span>{selectedStore.email}</span>}
                        </p>
                    </div>
                </div>

                {/* Detail Columns */}
                <div className={styles.detailColumns}>
                    {/* Invoice Meta */}
                    <div className={styles.metaBlock}>
                        <div className={styles.title}>Invoice Details</div>
                        <p>
                            #{" "}
                            <span className={styles.valueBold}>
                                {invoiceData.invoiceNumber}
                            </span>
                        </p>
                        <p>
                            Issued:{" "}
                            <span className={styles.valueBold}>
                                {formatInvoiceDate(invoiceData.createdAt, "MMM DD, YYYY")}
                            </span>
                        </p>
                    </div>

                    {/* Bill To */}
                    <div className={styles.metaBlock}>
                        <div className={styles.title}>Bill To</div>
                        <p className={styles.customerName}>
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

                    {/* Payment Terms */}
                    <div className={styles.metaBlock} style={{ textAlign: "right" }}>
                        <div className={styles.title}>Terms</div>
                        {invoiceData.paymentMode && (
                            <p>
                                Payment: <span className={styles.valueBold}>{invoiceData.paymentMode}</span>
                            </p>
                        )}
                        <p>
                            Due: <span className={styles.valueBold}>Due on Receipt</span>
                        </p>
                    </div>
                </div>

                {/* Table Selection */}
                <div className={styles.tableContainer}>
                    <table className={styles.pillarTable}>
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
                                            <div style={{ fontSize: "11px", color: "#777" }}>SKU: {item.product.sku}</div>
                                        )}
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
                <div className={styles.totalsArea}>
                    <div className={styles.totalsTable}>
                        <div className={styles.totalRow}>
                            <div className={styles.label}>Item Total:</div>
                            <div className={styles.amount}>
                                {fmt(grossTotal)}
                            </div>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <div className={styles.label}>Discount:</div>
                                <div className={styles.amount} style={{ color: "#c0392b" }}>
                                    -{fmt(totalDiscount)}
                                </div>
                            </div>
                        )}
                        {hasAnyGst && (
                            <div className={styles.totalRow}>
                                <div className={styles.label}>Tax (GST):</div>
                                <div className={styles.amount}>
                                    {fmt(totalGst)}
                                </div>
                            </div>
                        )}
                        <div className={styles.finalGrandRow}>
                            <div className={styles.finalLabel}>AMOUNT DUE:</div>
                            <div className={styles.finalAmount}>
                                {fmt(totalAmount)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>
                        Thank you for your order. Please remit payment by the due date.
                    </p>
                    <p>Generated on {formatInvoiceDate(undefined, "YYYY-MM-DD HH:mm:ss")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default PillarProTemplate;
