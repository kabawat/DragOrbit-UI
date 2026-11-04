"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";
import { useInvoicePrintContext } from "../../InvoicePrintSettingsContext.jsx";
import { amountInWords } from "../../InvoicePrintExtras.jsx";

function getTaxBreakdown(items) {
    const totals = new Map();
    for (const item of items) {
        const gst = item.gst || {};
        const rate = Number(gst.rate ?? item.gstRate ?? 0);
        if (!rate) continue;
        const breakdown = gst.breakdown || {};
        const amount = Number(breakdown.total ?? gst.amount ?? item.calculatedGst ?? (Number(item.price || 0) * Number(item.quantity || 0) * rate) / 100);
        const isIgst = ["IGST", "INTERSTATE"].includes(String(gst.taxType || gst.type || item.taxType || "").toUpperCase());
        const parts = isIgst
            ? [["IGST", Number(gst.igstRate ?? rate), Number(breakdown.igst ?? amount)]]
            : [["CGST", Number(gst.cgstRate ?? breakdown.cgstRate ?? rate / 2), Number(breakdown.cgst ?? amount / 2)], ["SGST", Number(gst.sgstRate ?? breakdown.sgstRate ?? rate / 2), Number(breakdown.sgst ?? amount / 2)]];
        for (const [name, taxRate, taxAmount] of parts) {
            const key = `${name}-${taxRate}`;
            const current = totals.get(key) || { name, rate: taxRate, amount: 0 };
            current.amount += taxAmount;
            totals.set(key, current);
        }
    }
    return [...totals.values()];
}

function formatMoney(value, showDecimals = true) {
    const digits = showDecimals ? 2 : 0;
    return `₹${(Number(value) || 0).toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

const AuroraTemplate = ({ invoiceData, selectedStore }) => {
    const settings = useInvoicePrintContext()?.settings || {};
    const logoValue = selectedStore?.logo || selectedStore?.logoUrl;
    const logoSrc = typeof logoValue === "string" ? logoValue : logoValue?.url || logoValue?.secure_url;
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);
    const taxBreakdown = getTaxBreakdown(items);
    const payments = Array.isArray(invoiceData?.payments) ? invoiceData.payments : [];
    const amountReceived = Number(invoiceData.amountPaid ?? invoiceData.receivedAmount ?? invoiceData.paidAmount ?? invoiceData.amountReceived ?? payments.reduce((sum, payment) => sum + Number(payment.amount ?? payment.receivedAmount ?? 0), 0));
    const balanceAmount = Number(invoiceData.balanceDue ?? invoiceData.balanceAmount ?? totalAmount - amountReceived);
    const customerBalance = invoiceData.customer?.currentBalance ?? invoiceData.customer?.balance ?? invoiceData.customerBalance;
    const paymentMode = invoiceData.paymentMode || invoiceData.paymentMethod;

    return (
        <InvoiceContainer includeSummaryFields={false} includePaymentMode={false}>
            <div className={styles.auroraInvoice}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerIdentity}>
                        <div>
                        <h1 data-invoice-header>INVOICE</h1>
                        {settings.showCompanyName !== false && <p>{selectedStore?.storeName || "Your Store"}</p>}
                        {settings.showGstin !== false && (selectedStore?.gst || selectedStore?.gstin) && <p style={{ fontSize: "11px" }}>GSTIN: {selectedStore.gstin || selectedStore.gst}</p>}
                        </div>
                        {settings.showLogo !== false && logoSrc && <img data-invoice-logo className={styles.storeLogo} src={logoSrc} alt={`${selectedStore?.storeName || "Store"} logo`} />}
                    </div>
                    <div className={styles.headerRight}>
                        <p>Invoice No: <strong>{invoiceData.invoiceNumber}</strong></p>
                        <p>Date: {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</p>
                        {settings.showPaymentMode && paymentMode && <p>Payment: {paymentMode}</p>}
                    </div>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoBox}>
                            <h4>Bill To</h4>
                            <p>{invoiceData.customer?.name || "Walk-in Customer"}</p>
                            {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                            {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                        </div>
                        <div className={styles.infoBox}>
                            <h4>From</h4>
                            <p>{selectedStore?.storeName || "Your Store"}</p>
                            {selectedStore?.email && <p>{selectedStore.email}</p>}
                            {selectedStore?.phone && <p>{selectedStore.phone}</p>}
                        </div>
                    </div>

                    {/* B2C Items Table */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                            <td style={{ width: "34%", textAlign: "left" }}>Product</td>
                            <td style={{ width: "10%", textAlign: "center" }}>Qty</td>
                            <td style={{ width: "15%", textAlign: "right" }}>Unit Price</td>
                            <td style={{ width: "12%", textAlign: "right" }}>Discount</td>
                            <td style={{ width: "14%", textAlign: "right" }}>GST</td>
                            <td style={{ width: "15%", textAlign: "right" }}>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {getItemRows(items).map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => (
                                <tr key={index}>
                                    <td><div className={styles.productName}>{item.product?.name || item.productName || "Product"}</div></td>
                                    <td style={{ textAlign: "center" }}>{qty}{item.uom ? ` ${item.uom}` : ""}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: lineDiscount > 0 ? "#ef4444" : "#aaa" }}>
                                        {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "—"}
                                    </td>
                                    <td style={{ textAlign: "right" }}>—</td>
                                    <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(lineAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className={styles.tableFooterRow} data-invoice-plain-bg>
                                <td style={{ textAlign: "left", fontWeight: 700 }}>Total</td>
                                <td style={{ textAlign: "center", fontWeight: 700 }}>{tableTotalQty}</td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(grossTotal)}</td>
                                <td style={{ textAlign: "right", fontWeight: 700, color: tableTotalDiscount > 0 ? "#ef4444" : "inherit" }}>
                                    {tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "—"}
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{formatMoney(totalGst, settings.showAmountDecimals)}</td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(tableTotalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* B2C Totals */}
                    <div className={styles.totalsSection}>
                        <div className={styles.taxBreakdown}>
                            {settings.showTaxDetails && taxBreakdown.length > 0 && <><strong>GST Details</strong>{taxBreakdown.map((line, index) => <div className={styles.taxRow} key={`${line.name}-${line.rate}-${index}`} data-invoice-plain-bg><span>{line.name} @ {line.rate}%</span><span>{formatMoney(line.amount, settings.showAmountDecimals)}</span></div>)}</>}
                        </div>
                        <div className={styles.totals}>
                            <div className={styles.totalRow} data-invoice-plain-bg>
                                <span className={styles.totalLabel}>Item Total:</span>
                                <span className={styles.totalAmount}>{fmt(grossTotal)}</span>
                            </div>
                            {totalDiscount > 0 && (
                                <div className={styles.totalRow} data-invoice-plain-bg>
                                    <span className={styles.totalLabel}>Discount (-):</span>
                                    <span className={styles.totalAmount} style={{ color: "#ef4444" }}>-{fmt(totalDiscount)}</span>
                                </div>
                            )}
                            {totalGst > 0 && (
                                <div className={styles.totalRow} data-invoice-plain-bg>
                                    <span className={styles.totalLabel}>{allInclusive ? "GST (included):" : "GST (+):"}</span>
                                    <span className={styles.totalAmount}>{fmt(totalGst)}</span>
                                </div>
                            )}
                            <div className={`${styles.totalRow} ${styles.finalTotal}`} data-invoice-plain-bg>
                                <span className={styles.totalLabel}>Total Payable:</span>
                                <span className={styles.totalAmount}>{fmt(totalAmount)}</span>
                            </div>
                            {settings.showReceivedAmount && <div className={styles.totalRow} data-invoice-plain-bg><span className={styles.totalLabel}>Amount received:</span><span className={styles.totalAmount}>{formatMoney(amountReceived, settings.showAmountDecimals)}</span></div>}
                            {settings.showBalanceAmount && <div className={styles.totalRow} data-invoice-plain-bg><span className={styles.totalLabel}>Balance amount:</span><span className={styles.totalAmount}>{formatMoney(balanceAmount, settings.showAmountDecimals)}</span></div>}
                            {settings.showCustomerBalance && customerBalance != null && <div className={styles.totalRow} data-invoice-plain-bg><span className={styles.totalLabel}>Customer current balance:</span><span className={styles.totalAmount}>{formatMoney(customerBalance, settings.showAmountDecimals)}</span></div>}
                            {settings.showAmountInWords && <div className={styles.amountWords} data-invoice-plain-bg><strong>Amount in words:</strong><span>{amountInWords(totalAmount)}</span></div>}
                            {hasAnyGst && <div className={styles.gstNote}>{allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}</div>}
                        </div>
                    </div>
                </div>

            </div>
        </InvoiceContainer>
    );
};

export default AuroraTemplate;
