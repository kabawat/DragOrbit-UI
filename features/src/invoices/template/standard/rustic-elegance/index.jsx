"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const RusticEleganceTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.rusticInvoice} >
                {/* Header Section */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 data-invoice-header>INVOICE</h1>
                        <p style={{ fontSize: 13, color: "#a1887f" }}>
                            {selectedStore?.storeName || "The Artisan Collective"}
                        </p>
                    </div>
                    <div className={styles.storeInfo}>
                        <p>{selectedStore?.address || "88 Serene Road, Old Town"}</p>
                        <p>
                            {selectedStore?.phone && <span>{selectedStore.phone} | </span>}
                            {selectedStore?.email && <span>{selectedStore.email}</span>}
                        </p>
                    </div>
                </div>

                {/* Info Section */}
                <div className={styles.infoRow}>
                    {/* Bill To Details */}
                    <div className={styles.block}>
                        <div className={styles.title}>Billed To</div>
                        <p className={styles.valueBold}>
                            {invoiceData.customer?.name || "Esteemed Patron"}
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

                    {/* Invoice Details */}
                    <div className={styles.block} style={{ textAlign: "right" }}>
                        <div className={styles.title}>Invoice Details</div>
                        <p>
                            Invoice #:{" "}
                            <span className={styles.invoiceNumberValue}>
                                {invoiceData.invoiceNumber}
                            </span>
                        </p>
                        <p>
                            Date Issued:{" "}
                            <span className={styles.valueBold}>
                                {formatInvoiceDate(invoiceData.createdAt, "DD MMM, YYYY")}
                            </span>
                        </p>
                        <p>
                            Due Date:{" "}
                            <span className={styles.valueBold}>Upon Receipt</span>
                        </p>
                    </div>
                </div>

                {/* Table Selection */}
                <div className={styles.tableContainer}>
                    <table className={styles.rusticTable}>
                        <thead>
                            <tr>
                                <td className="font-bold" style={{ width: "35%" }}>Item Description</td>
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
                                            {item.product?.name || "Handcrafted Item"}
                                        </div>
                                        {item.product?.sku && (
                                            <div style={{ fontSize: "11px", color: "#a1887f" }}>SKU: {item.product.sku}</div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{qty}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
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
                                <div className={styles.amount} style={{ color: "#2e7d32" }}>
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
                        <div className={`${styles.row} ${styles.grandTotalRow}`}>
                            <div className={styles.finalLabel}>AMOUNT DUE</div>
                            <div className={styles.finalAmount}>
                                {fmt(totalAmount)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for supporting our work. We value your business.</p>
                    <p>Generated on {formatInvoiceDate(undefined, "YYYY-MM-DD HH:mm:ss")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default RusticEleganceTemplate;
