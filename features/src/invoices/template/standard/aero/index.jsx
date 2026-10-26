"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";

const AeroTemplate = ({ invoiceData, selectedStore }) => {
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);
    const logo = selectedStore?.logo || selectedStore?.logoUrl;
    const logoSrc = typeof logo === "string" ? logo : logo?.url || logo?.secure_url;

    return (
        <InvoiceContainer className={styles.aeroDocument}>
            <div className={styles.aeroInvoice}>
                {/* Header */}
                <div className={`${styles.aeroTop} ${logoSrc ? styles.aeroTopWithLogo : styles.aeroTopCentered}`}>
                    {logoSrc && <img className={styles.storeLogo} src={logoSrc} alt={`${selectedStore?.storeName || "Store"} logo`} />}
                    <div className={styles.contentRow}>
                        <div className={styles.identityRow}>
                            <div className={styles.storeBlock}>
                                <h1 className={styles.invoiceTitle}>INVOICE</h1>
                                <div className={styles.merchantName}>{selectedStore?.storeName || "Your Store"}</div>
                                <div className={styles.storeDetails}>
                                    {selectedStore?.address && <p>{selectedStore.address}</p>}
                                    {selectedStore?.email && <p>Email: {selectedStore.email}</p>}
                                    {selectedStore?.phone && <p>Phone: {selectedStore.phone}</p>}
                                    {(selectedStore?.gstin || selectedStore?.gst) && <p>GSTIN: {selectedStore.gstin || selectedStore.gst}</p>}
                                </div>
                            </div>
                        </div>
                        <div className={styles.invoiceMeta}>
                            <p>#{invoiceData.invoiceNumber}</p>
                            <p>{formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</p>
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div className={styles.infoSection}>
                    <div className={styles.infoCard}>
                        <h3 className={styles.sectionTitle}>Bill To</h3>
                        <p><strong>{invoiceData.customer?.name || "Walk-in Customer"}</strong></p>
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                        {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                    </div>
                </div>

                {/* B2C Items Table */}
                <table className={styles.invoiceTable}>
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
                                <td><span className={styles.productName}>{item.product?.name || item.productName || "Product"}</span></td>
                                <td style={{ textAlign: "center" }}>{qty}{item.uom ? ` ${item.uom}` : ""}</td>
                                <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                <td style={{ textAlign: "right", color: lineDiscount > 0 ? "#e74c3c" : "#aaa" }}>
                                    {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "—"}
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(lineAmount)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className={styles.tableFooterRow}>
                            <td style={{ textAlign: "left", fontWeight: 700 }}>Total</td>
                            <td style={{ textAlign: "center", fontWeight: 700 }}>{tableTotalQty}</td>
                            <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(grossTotal)}</td>
                            <td style={{ textAlign: "right", fontWeight: 700, color: tableTotalDiscount > 0 ? "#e74c3c" : "inherit" }}>
                                {tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "—"}
                            </td>
                            <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(tableTotalAmount)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* B2C Totals */}
                <div className={styles.totals}>
                    <div className={styles.totalsBox}>
                        <div className={styles.totalRow}>
                            <span>Item Total:</span>
                            <span>{fmt(grossTotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow}>
                                <span>Discount (-):</span>
                                <span style={{ color: "#e74c3c" }}>-{fmt(totalDiscount)}</span>
                            </div>
                        )}
                        {totalGst > 0 && (
                            <div className={styles.totalRow}>
                                <span>{allInclusive ? "GST (included):" : "GST (+):"}</span>
                                <span>{fmt(totalGst)}</span>
                            </div>
                        )}
                        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                            <span>Total Payable:</span>
                            <span>{fmt(totalAmount)}</span>
                        </div>
                        {hasAnyGst && (
                            <div className={styles.gstNote}>
                                {allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>Thank you for your purchase!</p>
                    <p>Generated on {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY [at] HH:mm")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default AeroTemplate;
