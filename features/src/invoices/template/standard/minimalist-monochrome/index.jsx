"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const MinimalistMonochromeTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);

    const rows = getItemRows(items);

    return (
        <InvoiceContainer>
            <div className={styles.monoInvoice} >
                {/* Header Section */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 data-invoice-header>INVOICE</h1>
                        <p>{selectedStore?.storeName || "Minimalist Design Co."}</p>
                        <p>{selectedStore?.address || "789 White Space, Zen City"}</p>
                        {selectedStore?.phone && <p>{selectedStore.phone}</p>}
                    </div>

                    <div className={styles.headerRight}>
                        <div className={styles.title}>Invoice #</div>
                        <div className={styles.invoiceNumberValue}>
                            {invoiceData.invoiceNumber}
                        </div>
                    </div>
                </div>

                {/* Bill To & Date Block */}
                <div className={styles.addressBlock}>
                    {/* Bill To Details */}
                    <div className={styles.addressDetails}>
                        <div className={styles.blockTitle}>Bill To</div>
                        <p className={styles.customerName}>
                            {invoiceData.customer?.name || "Client"}
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

                    {/* Date Details */}
                    <div className={styles.addressDetails}>
                        <div className={styles.blockTitle} style={{ textAlign: "right" }}>
                            Date Issued
                        </div>
                        <p className={styles.dateIssued}>
                            {formatInvoiceDate(invoiceData.createdAt, "DD MMMM YYYY")}
                        </p>
                    </div>
                </div>

                {/* Table Selection */}
                <div className={styles.tableContainer}>
                    <table className={styles.monoTable}>
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
                                            {item.product?.name || "Item"}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>{qty}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: "#888" }}>
                                        {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "-"}
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: 500 }}>{fmt(lineAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className={styles.tableFooterRow}>
                                <td><strong>Totals</strong></td>
                                <td style={{ textAlign: "center" }}><strong>{tableTotalQty}</strong></td>
                                <td style={{ textAlign: "right" }}><strong>{fmt(grossTotal)}</strong></td>
                                <td style={{ textAlign: "right", color: "#888" }}>
                                    <strong>{tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "-"}</strong>
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 500 }}><strong>{fmt(tableTotalAmount)}</strong></td>
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
                <div className={styles.totalsTable}>
                    <div className={styles.totalRow}>
                        <div className={styles.totalLabel}>Item Total</div>
                        <div className={styles.amount}>{fmt(grossTotal)}</div>
                    </div>
                    {totalDiscount > 0 && (
                        <div className={styles.totalRow}>
                            <div className={styles.totalLabel}>Discount</div>
                            <div className={styles.amount} style={{ color: "#888" }}>
                                -{fmt(totalDiscount)}
                            </div>
                        </div>
                    )}
                    {hasAnyGst && (
                        <div className={styles.totalRow}>
                            <div className={styles.totalLabel}>Tax (GST)</div>
                            <div className={styles.amount}>{fmt(totalGst)}</div>
                        </div>
                    )}
                    <div className={styles.finalRow}>
                        <div className={styles.totalLabel}>TOTAL</div>
                        <div className={styles.finalAmount}>{fmt(totalAmount)}</div>
                    </div>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default MinimalistMonochromeTemplate;
