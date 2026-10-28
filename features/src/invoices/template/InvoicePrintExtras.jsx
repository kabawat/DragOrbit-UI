import { useInvoicePrintContext } from "./InvoicePrintSettingsContext.jsx";
import { formatInvoiceDate } from "./formatInvoiceDate.js";
import { signatureToImage } from "./signatureToImage.js";
import styles from "./InvoicePrintExtras.module.scss";

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const TEENS = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function underHundred(value) {
  if (value < 10) return ONES[value];
  if (value < 20) return TEENS[value - 10];
  return `${TENS[Math.floor(value / 10)]}${value % 10 ? ` ${ONES[value % 10]}` : ""}`;
}

function wholeNumberInWords(value) {
  let amount = Math.max(0, Math.floor(Number(value) || 0));
  if (!amount) return "Zero Rupees Only";
  const groups = [[10000000, "Crore"], [100000, "Lakh"], [1000, "Thousand"], [100, "Hundred"]];
  const words = [];
  for (const [size, label] of groups) {
    const count = Math.floor(amount / size);
    if (count) {
      words.push(`${count < 100 ? underHundred(count) : `${underHundred(Math.floor(count / 100))} Hundred ${underHundred(count % 100)}`}`.trim(), label);
      amount %= size;
    }
  }
  if (amount) words.push(underHundred(amount));
  return words.join(" ");
}

export function amountInWords(value) {
  const amount = Math.max(0, Number(value) || 0);
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  const rupeeWords = rupees ? wholeNumberInWords(rupees) : "Zero";
  const paiseWords = paise ? ` and ${wholeNumberInWords(paise)} Paise` : "";
  return `${rupeeWords} Rupees${paiseWords} Only`;
}

function formatAmount(value, decimals) {
  return `₹${(Number(value) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  })}`;
}

function getTaxBreakdown(items) {
  const totals = new Map();
  items.forEach((item, index) => {
    const gst = item.gst || {};
    const rate = Number(gst.rate ?? item.gstRate ?? item.taxRate ?? item.gstInfo?.rate ?? 0);
    if (!rate) return;
    const breakdown = gst.breakdown || {};
    const amount = Number(breakdown.total ?? gst.amount ?? item.calculatedGst ?? item.gstAmount ?? (Number(item.price || 0) * Number(item.quantity || 0) * rate) / 100);
    const isIgst = ["IGST", "INTERSTATE"].includes(String(gst.taxType || gst.type || item.taxType || "").toUpperCase());
    const parts = isIgst
      ? [["IGST", Number(gst.igstRate ?? rate), Number(breakdown.igst ?? amount)]]
      : [["CGST", Number(gst.cgstRate ?? breakdown.cgstRate ?? rate / 2), Number(breakdown.cgst ?? amount / 2)], ["SGST", Number(gst.sgstRate ?? breakdown.sgstRate ?? rate / 2), Number(breakdown.sgst ?? amount / 2)]];
    parts.forEach(([name, taxRate, taxAmount]) => {
      const key = `${name}-${taxRate}`;
      const current = totals.get(key) || { id: key, name, rate: taxRate, amount: 0 };
      current.amount += taxAmount;
      totals.set(key, current);
    });
  });
  return [...totals.values()];
}

export function InvoicePrintExtras({ includeSignature = true, includeSummaryFields = true, includeTerms = true, includePaymentMode = true }) {
  const context = useInvoicePrintContext();
  if (!context) return null;

  const { settings, invoiceData, signature } = context;
  const signatureSrc = signatureToImage(signature);
  const items = invoiceData?.items || [];
  const payments = Array.isArray(invoiceData?.payments) ? invoiceData.payments : Array.isArray(invoiceData?.paymentDetails) ? invoiceData.paymentDetails : Array.isArray(invoiceData?.receivedDetails) ? invoiceData.receivedDetails : [];
  const paidAmount = invoiceData?.amountPaid ?? invoiceData?.receivedAmount ?? invoiceData?.paidAmount ?? invoiceData?.amountReceived ?? payments.reduce((sum, payment) => sum + Number(payment.amount ?? payment.receivedAmount ?? 0), 0);
  const balanceAmount = invoiceData?.balanceDue ?? invoiceData?.balanceAmount ?? (Number(invoiceData?.totalAmount) - Number(paidAmount || 0));
  const customerBalance = invoiceData?.customer?.currentBalance ?? invoiceData?.customer?.balance ?? invoiceData?.customerBalance;
  const taxBreakdown = includeSummaryFields && settings.showTaxDetails ? getTaxBreakdown(items) : [];
  const summaryRows = [];
  const addSummaryRow = (enabled, label, value) => {
    if (enabled && value !== undefined && value !== null && value !== "") summaryRows.push({ label, value });
  };
  if (includeSummaryFields) {
    addSummaryRow(settings.showReceivedAmount, "Amount received", formatAmount(paidAmount, settings.showAmountDecimals));
    addSummaryRow(settings.showBalanceAmount, "Balance amount", formatAmount(balanceAmount, settings.showAmountDecimals));
    addSummaryRow(settings.showCustomerBalance, "Customer current balance", formatAmount(customerBalance, settings.showAmountDecimals));
    addSummaryRow(settings.showAmountInWords, "Amount in words", amountInWords(invoiceData?.totalAmount));
    addSummaryRow(includePaymentMode && settings.showPaymentMode, "Payment mode", invoiceData?.paymentMode || invoiceData?.paymentMethod);
  }
  const rawTerms = invoiceData?.termsAndConditions || invoiceData?.notes;
  const terms = typeof rawTerms === "string" ? rawTerms : rawTerms?.text || rawTerms?.content || "";
  const showSignature = includeSignature && settings.showSignature;
  const showThankYou = settings.showThankYou !== false;
  const generatedOn = formatInvoiceDate(invoiceData?.createdAt, "DD MMM YYYY [at] HH:mm");
  const showGeneratedOn = true;
  const showSummary = taxBreakdown.length > 0 || summaryRows.length > 0;
  const showFooter = showSummary || (includeTerms && settings.showTerms && terms) || showSignature || showThankYou || showGeneratedOn;
  if (!showFooter) return null;

  return (
    <section className={styles.extras} data-invoice-extras-root>
      {showSummary && <div data-invoice-plain-bg className={`${styles.summaryLayout} ${context.group === "thermal" ? styles.thermalGrid : ""}`}>
        <div className={styles.block}>
          {taxBreakdown.length > 0 && <><strong>Tax details</strong><div className={styles.taxTable}>
            {taxBreakdown.map((line) => <div key={line.id} className={styles.taxRow}><span>{line.name} @ {line.rate}%</span><strong>{formatAmount(line.amount, settings.showAmountDecimals)}</strong></div>)}
          </div></>}
        </div>
        <div className={styles.grid}>
          {summaryRows.map(({ label, value }) => <div key={label} className={styles.row}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
      </div>}
      {showSignature && <div className={styles.signatureBlock}>
        {signatureSrc && <img className={styles.savedSignature} src={signatureSrc} alt="Saved signature" />}
        <span className={styles.signatureLine}>Authorized signature</span>
      </div>}
      {includeTerms && settings.showTerms && terms && <div className={styles.block}><strong>Terms and conditions</strong><p>{terms}</p></div>}
      {showThankYou && <p className={styles.thankYou}>Thank you for your business!</p>}
      {showGeneratedOn && <p className={styles.generatedOn}>Generated on {generatedOn}</p>}
    </section>
  );
}

export function InvoiceAcknowledgement() {
  const context = useInvoicePrintContext();
  if (!context?.settings?.showAcknowledgement) return null;

  const { settings, invoiceData } = context;
  const items = invoiceData?.items || [];
  const payments = Array.isArray(invoiceData?.payments)
    ? invoiceData.payments
    : Array.isArray(invoiceData?.paymentDetails)
      ? invoiceData.paymentDetails
      : Array.isArray(invoiceData?.receivedDetails)
        ? invoiceData.receivedDetails
        : [];
  const paidAmount = invoiceData?.amountPaid ?? invoiceData?.receivedAmount ?? invoiceData?.paidAmount ?? invoiceData?.amountReceived ?? payments.reduce((sum, payment) => sum + Number(payment.amount ?? payment.receivedAmount ?? 0), 0);
  const balanceAmount = invoiceData?.balanceDue ?? invoiceData?.balanceAmount ?? (Number(invoiceData?.totalAmount) - Number(paidAmount || 0));
  const acknowledgementDetails = [
    invoiceData?.invoiceNumber && `Invoice ${invoiceData.invoiceNumber}`,
    invoiceData?.customer?.name && invoiceData.customer.name,
    invoiceData?.createdAt && new Date(invoiceData.createdAt).toLocaleDateString(),
  ].filter(Boolean).join(" · ");

  return (
    <div className={`${styles.acknowledgement} ${context.group === "thermal" ? styles.thermalAcknowledgement : ""}`}>
      <div className={styles.acknowledgementLayout}>
        <div className={styles.acknowledgementCopy}>
          <strong>Payment acknowledgement</strong>
          {acknowledgementDetails && <span>{acknowledgementDetails}</span>}
          <div className={styles.acknowledgementAmounts}>
            <span><b>Items</b> {items.length}</span>
            <span><b>Total</b> {formatAmount(invoiceData?.totalAmount, settings.showAmountDecimals)}</span>
            {settings.showReceivedAmount && <span><b>Received</b> {formatAmount(paidAmount, settings.showAmountDecimals)}</span>}
            {settings.showBalanceAmount && <span><b>Balance</b> {formatAmount(balanceAmount, settings.showAmountDecimals)}</span>}
          </div>
          <p>{settings.acknowledgementText}</p>
        </div>
        <div className={styles.acknowledgementSign}>
          <span>Received by</span>
          <span className={styles.acknowledgementSignLine} />
          <span>Date: ______________</span>
        </div>
      </div>
    </div>
  );
}
