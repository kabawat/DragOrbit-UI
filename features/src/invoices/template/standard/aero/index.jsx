"use client";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import InvoiceContainer from "../../InvoiceContainer";
import styles from "./style.module.scss";
import { fmt, computeB2CTotals, getItemRows } from "../../b2cHelpers.js";
import { useInvoicePrintContext } from "../../InvoicePrintSettingsContext.jsx";
import { signatureToImage } from "../../signatureToImage.js";
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

const AeroTemplate = ({ invoiceData, selectedStore }) => {
    const { settings = {}, preview = false, signature } = useInvoicePrintContext() || {};
    const signatureSrc = signatureToImage(signature);
    const {
        items, grossTotal, totalDiscount, totalGst, totalAmount,
        tableTotalQty, tableTotalDiscount, tableTotalAmount,
        hasAnyGst, allInclusive,
    } = computeB2CTotals(invoiceData);
    const logo = selectedStore?.logo || selectedStore?.logoUrl;
    const logoSrc = typeof logo === "string" ? logo : logo?.url || logo?.secure_url;
    const taxBreakdown = getTaxBreakdown(items);
    const payments = Array.isArray(invoiceData?.payments) ? invoiceData.payments : [];
    const amountReceived = Number(invoiceData.amountPaid ?? invoiceData.receivedAmount ?? invoiceData.paidAmount ?? invoiceData.amountReceived ?? payments.reduce((sum, payment) => sum + Number(payment.amount ?? payment.receivedAmount ?? 0), 0));
    const balanceAmount = Number(invoiceData.balanceDue ?? invoiceData.balanceAmount ?? totalAmount - amountReceived);
    const customerBalance = invoiceData.customer?.currentBalance ?? invoiceData.customer?.balance ?? invoiceData.customerBalance;
    const rawTerms = invoiceData.termsAndConditions || invoiceData.notes;
    const terms = typeof rawTerms === "string" ? rawTerms : rawTerms?.text || rawTerms?.content || "";

    return (
        <InvoiceContainer className={styles.aeroDocument} includeSignature={false} includeSummaryFields={false} includeItemDescriptions={false} includeTerms={false}>
            <div className={styles.aeroInvoice}>
                {/* Header */}
                <div className={`${styles.aeroTop} ${logoSrc ? styles.aeroTopWithLogo : ""}`}>
                    {logoSrc && <img data-invoice-logo className={styles.storeLogo} src={logoSrc} alt={`${selectedStore?.storeName || "Store"} logo`} />}
                    <div className={styles.contentRow}>
                        <div className={styles.identityRow}>
                            <div className={styles.storeBlock}>
                                {settings.showCompanyName !== false && <div className={styles.merchantName}>{selectedStore?.storeName || (preview ? "Jadev Store" : "Your Store")}</div>}
                                <div className={styles.storeDetails}>
                                    {settings.showAddress !== false && (selectedStore?.address || preview) && <span className={styles.storeAddress}>{typeof selectedStore?.address === "string" ? selectedStore.address : selectedStore?.address ? [selectedStore.address.line1, selectedStore.address.line2, selectedStore.address.city, selectedStore.address.state, selectedStore.address.pincode].filter(Boolean).join(", ") : "12 Market Road, Ahmedabad, Gujarat"}</span>}
                                    <span className={styles.storeContacts}>
                                        {settings.showEmail !== false && (selectedStore?.email || preview) && <span>Email: {selectedStore?.email || "hello@dragbizz.com"}</span>}
                                        {settings.showPhone !== false && (selectedStore?.phone || preview) && <span>Phone: {selectedStore?.phone || "+91 98765 43210"}</span>}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.invoiceMeta}>
                            {settings.showHeader !== false && <h1 data-invoice-header className={styles.invoiceTitle}>INVOICE</h1>}
                            <p>#{invoiceData.invoiceNumber} <span>·</span> {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY")}</p>
                            {settings.showGstin !== false && (selectedStore?.gstin || selectedStore?.gst || preview) && <p className={styles.storeGstin}>GSTIN: {selectedStore?.gstin || selectedStore?.gst || "24ABCDE1234F1Z5"}</p>}
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
                        {invoiceData.customer?.address && <p>{typeof invoiceData.customer.address === "string" ? invoiceData.customer.address : [invoiceData.customer.address.line1, invoiceData.customer.address.line2, invoiceData.customer.address.city, invoiceData.customer.address.state, invoiceData.customer.address.pincode].filter(Boolean).join(", ")}</p>}
                    </div>
                    <div className={styles.customerMeta}>
                        {invoiceData.shippingAddress && <><strong>Ship To</strong><span>{typeof invoiceData.shippingAddress === "string" ? invoiceData.shippingAddress : [invoiceData.shippingAddress.line1, invoiceData.shippingAddress.line2, invoiceData.shippingAddress.city, invoiceData.shippingAddress.state, invoiceData.shippingAddress.pincode].filter(Boolean).join(", ")}</span></>}
                        {settings.showPaymentMode && (invoiceData.paymentMode || invoiceData.paymentMethod) && <><strong>Payment</strong><span>{invoiceData.paymentMode || invoiceData.paymentMethod}</span></>}
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
                        {getItemRows(items).map(({ index, item, qty, unitPrice, lineDiscount, lineAmount }) => {
                            const productId = item.product?.id || item.product?._id || item.productId || item.product;
                            const variantId = item.variant?.id || item.variant?._id || item.variant;
                            const rowKey = `${productId || item.productName || "invoice-item"}:${variantId || "default"}:${item.id || item._id || "line"}:${index}`;
                            return (
                                <tr key={rowKey}>
                                    <td>
                                        <span className={styles.productName}>{item.product?.name || item.productName || "Product"}</span>
                                        {settings.showDescription && (item.description || item.product?.description) && <small className={styles.itemDescription}>{item.description || item.product.description}</small>}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{qty}{item.uom ? ` ${item.uom}` : ""}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(unitPrice)}</td>
                                    <td style={{ textAlign: "right", color: lineDiscount > 0 ? "#e74c3c" : "#aaa" }}>
                                        {lineDiscount > 0 ? `-${fmt(lineDiscount)}` : "—"}
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(lineAmount)}</td>
                                </tr>
                            );
                        })}
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
                    <div className={styles.totalNotes}>
                        {settings.showTaxDetails && taxBreakdown.length > 0 && <div className={styles.taxBreakdown}><strong>Tax Details</strong>{taxBreakdown.map((line, index) => <div key={`${line.name}:${line.rate}:${index}`}><span>{line.name} @ {line.rate}%</span><span>{formatMoney(line.amount, settings.showAmountDecimals)}</span></div>)}</div>}
                        {settings.showTerms && terms && <div className={styles.terms}><strong>Terms &amp; Conditions</strong><span>{terms}</span></div>}
                    </div>
                    <div className={styles.totalsBox} data-invoice-plain-bg>
                        <div className={styles.totalRow} data-invoice-plain-bg>
                            <span>Item Total:</span>
                            <span>{fmt(grossTotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className={styles.totalRow} data-invoice-plain-bg>
                                <span>Discount (-):</span>
                                <span style={{ color: "#e74c3c" }}>-{fmt(totalDiscount)}</span>
                            </div>
                        )}
                        {totalGst > 0 && (
                            <div className={styles.totalRow} data-invoice-plain-bg>
                                <span>{allInclusive ? "GST (included):" : "GST (+):"}</span>
                                <span>{fmt(totalGst)}</span>
                            </div>
                        )}
                        <div className={`${styles.totalRow} ${styles.grandTotal}`} data-invoice-plain-bg>
                            <span>Total Payable:</span>
                            <span>{fmt(totalAmount)}</span>
                        </div>
                        {settings.showReceivedAmount && <div className={styles.totalRow} data-invoice-plain-bg><span>Amount Received:</span><span>{formatMoney(amountReceived, settings.showAmountDecimals)}</span></div>}
                        {settings.showBalanceAmount && <div className={styles.totalRow} data-invoice-plain-bg><span>Balance Amount:</span><span>{formatMoney(balanceAmount, settings.showAmountDecimals)}</span></div>}
                        {settings.showCustomerBalance && customerBalance != null && <div className={styles.totalRow} data-invoice-plain-bg><span>Customer Current Balance:</span><span>{formatMoney(customerBalance, settings.showAmountDecimals)}</span></div>}
                        {settings.showAmountInWords && <div className={styles.amountWords} data-invoice-plain-bg><strong>Amount in Words:</strong><span>{amountInWords(totalAmount)}</span></div>}
                        {hasAnyGst && (
                            <div className={styles.gstNote}>
                                {allInclusive ? "* Prices are inclusive of GST" : "* GST is charged separately"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {settings.showSignature && <div className={styles.aeroSignature}>
                    {signatureSrc && <img src={signatureSrc} alt="Saved signature" />}
                    <span>Authorized signature</span>
                </div>}
                <div className={styles.aeroClosing}>
                    <p>Thank you for your purchase!</p>
                    <p>Generated on {formatInvoiceDate(invoiceData.createdAt, "DD MMM YYYY [at] HH:mm")}</p>
                </div>
            </div>
        </InvoiceContainer>
    );
};

export default AeroTemplate;
