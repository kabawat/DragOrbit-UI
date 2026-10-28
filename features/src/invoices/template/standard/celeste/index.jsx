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

const CelesteTemplate = ({ invoiceData, selectedStore }) => {
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
            <div className={styles.celesteInvoice}>
                <div className={styles.header} data-invoice-plain-bg>
                    <div><h1 data-invoice-header>INVOICE</h1>
                    <p>
                        Invoice No: <strong>{invoiceData.invoiceNumber}</strong> | Date:{" "}
                        {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}
                    </p>
                    </div>
                </div>

                {/* Billed To / Issued By */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoBlock}>
                        <div className={styles.label}>Billed To</div>
                        <div className={styles.value}>{invoiceData.customer?.name || "Walk-in Customer"}</div>
                        {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                    </div>
                    <div className={styles.infoBlock}>
                        <div className={styles.label}>Issued By</div>
                        <div className={styles.issuerHeading}>{settings.showCompanyName !== false && <div className={styles.value}>{settings.companyName || selectedStore?.storeName || "Your Store Name"}</div>}{settings.showLogo !== false && logoSrc && <img data-invoice-logo className={styles.issuerLogo} src={logoSrc} alt={`${selectedStore?.storeName || "Store"} logo`} />}</div>
                        {settings.showAddress !== false && selectedStore?.address && <p>{selectedStore.address}</p>}
                        {settings.showPhone !== false && selectedStore?.phone && <p>Ph: {selectedStore.phone}</p>}
                        {settings.showEmail !== false && selectedStore?.email && <p>{selectedStore.email}</p>}
                        {settings.showGstin !== false && (selectedStore?.gstin || selectedStore?.gst) && <p>GSTIN: {selectedStore.gstin || selectedStore.gst}</p>}
                        {settings.showPaymentMode && paymentMode && <p>Payment: {paymentMode}</p>}
                    </div>
                </div>

                {/* B2C Items Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.celesteTable}>
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
                                    <td style={{ textAlign: "right", color: lineDiscount > 0 ? "#ff4d4f" : "#aaa" }}>
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
                                <td style={{ textAlign: "right", fontWeight: 700, color: tableTotalDiscount > 0 ? "#ff4d4f" : "inherit" }}>
                                    {tableTotalDiscount > 0 ? `-${fmt(tableTotalDiscount)}` : "—"}
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{formatMoney(totalGst, settings.showAmountDecimals)}</td>
                                <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(tableTotalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* B2C Totals */}
                <div className={styles.totalsContainer}>
                        <div className={styles.taxBreakdown}>
                            {settings.showTaxDetails && taxBreakdown.length > 0 && <><strong>GST Details</strong>{taxBreakdown.map((line, index) => <div className={styles.taxRow} key={`${line.name}-${line.rate}-${index}`} data-invoice-plain-bg><span>{line.name} @ {line.rate}%</span><span>{formatMoney(line.amount, settings.showAmountDecimals)}</span></div>)}</>}
                        </div>
                    <div className={styles.totals}>
                            <div className={styles.totalRow} data-invoice-plain-bg>
                            <div className={styles.totalLabel}>Item Total:</div>
                            <div className={styles.amount}>{fmt(grossTotal)}</div>
                        </div>
                        {totalDiscount > 0 && (
                                <div className={styles.totalRow} data-invoice-plain-bg>
                                <div className={styles.totalLabel}>Discount (-):</div>
                                <div className={styles.amount} style={{ color: "#ff4d4f" }}>-{fmt(totalDiscount)}</div>
                            </div>
                        )}
                        {totalGst > 0 && (
                                <div className={styles.totalRow} data-invoice-plain-bg>
                                <div className={styles.totalLabel}>{allInclusive ? "GST (included):" : "GST (+):"}</div>
                                <div className={styles.amount}>{fmt(totalGst)}</div>
                            </div>
                        )}
                            <div className={`${styles.totalRow} ${styles.finalRow}`} data-invoice-plain-bg>
                            <div className={styles.finalLabel}>TOTAL DUE:</div>
                            <div className={styles.finalAmount}>{fmt(totalAmount)}</div>
                        </div>
                            {settings.showReceivedAmount && <div className={styles.totalRow} data-invoice-plain-bg><span className={styles.totalLabel}>Amount received:</span><span className={styles.amount}>{formatMoney(amountReceived, settings.showAmountDecimals)}</span></div>}
                            {settings.showBalanceAmount && <div className={styles.totalRow} data-invoice-plain-bg><span className={styles.totalLabel}>Balance amount:</span><span className={styles.amount}>{formatMoney(balanceAmount, settings.showAmountDecimals)}</span></div>}
                            {settings.showCustomerBalance && customerBalance != null && <div className={styles.totalRow} data-invoice-plain-bg><span className={styles.totalLabel}>Customer current balance:</span><span className={styles.amount}>{formatMoney(customerBalance, settings.showAmountDecimals)}</span></div>}
                            {settings.showAmountInWords && <div className={styles.amountWords} data-invoice-plain-bg><strong>Amount in words:</strong><span>{amountInWords(totalAmount)}</span></div>}
                        {hasAnyGst && <div className={styles.gstNote}>{allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}</div>}
                    </div>
                </div>

            </div>
        </InvoiceContainer>
    );
};

export default CelesteTemplate;
