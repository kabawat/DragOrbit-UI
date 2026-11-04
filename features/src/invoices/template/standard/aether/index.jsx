"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows, formatAddress } from "../../b2cHelpers.js";
import { useInvoicePrintContext, getDefaultPrintSettings } from "../../InvoicePrintSettingsContext.jsx";
import { amountInWords } from "../../InvoicePrintExtras.jsx";
import { signatureToImage } from "../../signatureToImage.js";

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
            : [
                ["CGST", Number(gst.cgstRate ?? breakdown.cgstRate ?? rate / 2), Number(breakdown.cgst ?? amount / 2)],
                ["SGST", Number(gst.sgstRate ?? breakdown.sgstRate ?? rate / 2), Number(breakdown.sgst ?? amount / 2)],
            ];
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

const AetherTemplate = ({ invoiceData, selectedStore }) => {
    const printContext = useInvoicePrintContext();
    const { settings = getDefaultPrintSettings("regular") } = printContext || {};
    const signatureSrc = signatureToImage(printContext?.signature);
    const logoValue = selectedStore?.logo || selectedStore?.logoUrl;
    const logoSrc = typeof logoValue === "string" ? logoValue : logoValue?.url || logoValue?.secure_url;
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
    } = computeB2CTotals(invoiceData);
    const taxBreakdown = getTaxBreakdown(items);
    const payments = Array.isArray(invoiceData?.payments) ? invoiceData.payments : [];
    const amountReceived = Number(invoiceData.amountPaid ?? invoiceData.receivedAmount ?? invoiceData.paidAmount ?? invoiceData.amountReceived ?? payments.reduce((sum, payment) => sum + Number(payment.amount ?? payment.receivedAmount ?? 0), 0));
    const balanceAmount = Number(invoiceData.balanceDue ?? invoiceData.balanceAmount ?? totalAmount - amountReceived);
    const customerBalance = invoiceData.customer?.currentBalance ?? invoiceData.customer?.balance ?? invoiceData.customerBalance;
    const paymentMode = invoiceData.paymentMode || invoiceData.paymentMethod;
    const rawTerms = invoiceData.termsAndConditions || invoiceData.notes;
    const terms = typeof rawTerms === "string" ? rawTerms : rawTerms?.text || rawTerms?.content || "";

    return (
        <InvoiceContainer
            style={{ padding: 0 }}
            includeSummaryFields={false}
            includeSignature={false}
            includeTerms={false}
        >
            <div className={styles.aetherInvoice}>
                {/* Store and customer details */}
                <div className={styles.leftPanel}>
                    {settings.showLogo !== false && logoSrc && <div className={styles.logoWrap}><img data-invoice-logo className={styles.logo} src={logoSrc} alt={`${selectedStore?.storeName || "Store"} logo`} /></div>}
                    <div className={styles.storeInfo}>
                        {settings.showCompanyName !== false && <h2 className={styles.storeName}>{settings.companyName || selectedStore?.storeName || "Your Store"}</h2>}
                        {settings.showAddress !== false && formatAddress(selectedStore?.address) && <p>{formatAddress(selectedStore.address)}</p>}
                        {settings.showPhone !== false && selectedStore?.phone && <p>{selectedStore.phone}</p>}
                        {settings.showEmail !== false && selectedStore?.email && <p>{selectedStore.email}</p>}
                        {settings.showGstin !== false && (selectedStore?.gstin || selectedStore?.gst) && <p>GSTIN: {selectedStore.gstin || selectedStore.gst}</p>}
                    </div>
                    <div className={styles.customerInfo}>
                        <div className={styles.leftSectionTitle}>Bill To</div>
                        <strong>{invoiceData.customer?.name || "Walk-in Customer"}</strong>
                        {formatAddress(invoiceData.customer?.address) && <p>{formatAddress(invoiceData.customer.address)}</p>}
                        {invoiceData.customer?.phone && <p>{invoiceData.customer.phone}</p>}
                        {invoiceData.customer?.email && <p>{invoiceData.customer.email}</p>}
                        {settings.showGstin !== false && (invoiceData.customer?.gstin || invoiceData.customer?.gst) && <p>GSTIN: {invoiceData.customer.gstin || invoiceData.customer.gst}</p>}
                    </div>
                    {settings.showTerms && terms && (
                        <div className={styles.termsInfo}>
                            <div className={styles.leftSectionTitle}>Terms &amp; Conditions</div>
                            <p>{terms}</p>
                        </div>
                    )}
                    <div>
                        <p style={{ fontSize: "10px", marginTop: "40px", opacity: 0.7 }}>
                            © {formatInvoiceDate(undefined, "YYYY")} {selectedStore?.storeName || "Your Store"}
                        </p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className={styles.rightPanel}>
                    {/* Header */}
                    <div className={styles.header} data-invoice-plain-bg>
                        <div>
                            <h1 data-invoice-header className={styles.title}>INVOICE</h1>
                            <div className={styles.date}>{formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p className={styles.invoiceNumber}>
                                Invoice No: <strong>{invoiceData.invoiceNumber}</strong>
                            </p>
                            {settings.showPaymentMode && paymentMode && (
                                <p className={styles.paymentMode}>Payment: {paymentMode}</p>
                            )}
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
                        <div className={styles.taxBreakdown}>
                            {settings.showTaxDetails && taxBreakdown.length > 0 && (
                                <>
                                    <strong>GST Details</strong>
                                    {taxBreakdown.map((line, index) => (
                                        <div className={styles.taxRow} key={`${line.name}-${line.rate}-${index}`}>
                                            <span>{line.name} @ {line.rate}%</span>
                                            <span>{formatMoney(line.amount, settings.showAmountDecimals)}</span>
                                        </div>
                                    ))}
                                </>
                            )}
                            {totalGst > 0 && (
                                <div className={styles.taxRow}>
                                    <strong>GST</strong>
                                    <strong>{formatMoney(totalGst, settings.showAmountDecimals)}</strong>
                                </div>
                            )}
                        </div>
                        <div className={styles.summary} data-invoice-plain-bg>
                            <div className={styles.totalRow} data-invoice-plain-bg>
                                <div className={styles.totalLabel}>Item Total:</div>
                                <div className={styles.totalAmount}>{fmt(grossTotal)}</div>
                            </div>
                            {totalDiscount > 0 && (
                                <div className={styles.totalRow} data-invoice-plain-bg>
                                    <div className={styles.totalLabel}>Discount (-):</div>
                                    <div className={styles.totalAmount} style={{ color: "#e74c3c" }}>-{fmt(totalDiscount)}</div>
                                </div>
                            )}
                            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                                <div className={styles.totalLabel}>Total Payable:</div>
                                <div className={styles.totalAmount}>{fmt(totalAmount)}</div>
                            </div>
                            {settings.showReceivedAmount && (
                                <div className={styles.totalRow} data-invoice-plain-bg>
                                    <div className={styles.totalLabel}>Amount Received:</div>
                                    <div className={styles.totalAmount}>{formatMoney(amountReceived, settings.showAmountDecimals)}</div>
                                </div>
                            )}
                            {settings.showBalanceAmount && (
                                <div className={styles.totalRow} data-invoice-plain-bg>
                                    <div className={styles.totalLabel}>Balance Amount:</div>
                                    <div className={styles.totalAmount}>{formatMoney(balanceAmount, settings.showAmountDecimals)}</div>
                                </div>
                            )}
                            {settings.showCustomerBalance && customerBalance != null && (
                                <div className={styles.totalRow} data-invoice-plain-bg>
                                    <div className={styles.totalLabel}>Customer Current Balance:</div>
                                    <div className={styles.totalAmount}>{formatMoney(customerBalance, settings.showAmountDecimals)}</div>
                                </div>
                            )}
                            {settings.showAmountInWords && (
                                <div className={styles.amountWords} data-invoice-plain-bg>
                                    <strong>Amount in Words:</strong>
                                    <span>{amountInWords(totalAmount)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {settings.showSignature && (
                        <div className={styles.signatureBlock}>
                            {signatureSrc && <img src={signatureSrc} alt="Saved signature" />}
                            <span>Authorized signature</span>
                        </div>
                    )}

                    {/* Footer */}
                    <div className={styles.footer}>
                        <p>Thank you for your business!</p>
                        <p>Generated on {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY [at] HH:mm")}</p>
                    </div>
                </div>
            </div>
            <div className={styles.extrasSlot} data-invoice-extras-slot />
        </InvoiceContainer>
    );
};

export default AetherTemplate;
