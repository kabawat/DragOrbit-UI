import { useInvoicePrintContext } from "./InvoicePrintSettingsContext.jsx";
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

export function InvoicePrintExtras({ includeSignature = true, includeSummaryFields = true, includeItemDescriptions = true, includeTerms = true }) {
  const context = useInvoicePrintContext();
  if (!context) return null;

  const { settings, invoiceData, signature } = context;
  const signatureSrc = signatureToImage(signature);
  const rows = [];
  const items = invoiceData?.items || [];
  const breakdown = invoiceData?.gst?.breakdown || {};
  const payments = Array.isArray(invoiceData?.payments)
    ? invoiceData.payments
    : Array.isArray(invoiceData?.paymentDetails)
      ? invoiceData.paymentDetails
      : Array.isArray(invoiceData?.receivedDetails)
        ? invoiceData.receivedDetails
        : [];
  const paidAmount = invoiceData?.amountPaid ?? invoiceData?.receivedAmount ?? invoiceData?.paidAmount ?? invoiceData?.amountReceived ?? payments.reduce((sum, payment) => sum + Number(payment.amount ?? payment.receivedAmount ?? 0), 0);
  const balanceAmount = invoiceData?.balanceDue ?? invoiceData?.balanceAmount ?? (Number(invoiceData?.totalAmount) - Number(paidAmount || 0));
  const customerBalance = invoiceData?.customer?.currentBalance ?? invoiceData?.customer?.balance ?? invoiceData?.customerBalance;
  const add = (enabled, label, value) => {
    if (enabled && value !== undefined && value !== null && value !== "") {
      rows.push(<div key={label} className={styles.row}><span>{label}</span><strong>{value}</strong></div>);
    }
  };

  if (includeSummaryFields) {
    add(settings.showReceivedAmount, "Amount received", formatAmount(paidAmount, settings.showAmountDecimals));
    add(settings.showBalanceAmount, "Balance amount", formatAmount(balanceAmount, settings.showAmountDecimals));
    add(settings.showCustomerBalance, "Customer current balance", formatAmount(customerBalance, settings.showAmountDecimals));
    add(settings.showTaxDetails && Number(breakdown.cgst) > 0, "CGST", formatAmount(breakdown.cgst, settings.showAmountDecimals));
    add(settings.showTaxDetails && Number(breakdown.sgst) > 0, "SGST", formatAmount(breakdown.sgst, settings.showAmountDecimals));
    add(settings.showTaxDetails && Number(breakdown.igst) > 0, "IGST", formatAmount(breakdown.igst, settings.showAmountDecimals));
    add(settings.showAmountInWords, "Amount in words", amountInWords(invoiceData?.totalAmount));
  }
  if (includeSummaryFields) add(settings.showPaymentMode, "Payment mode", invoiceData?.paymentMode || invoiceData?.paymentMethod);

  const taxLines = includeSummaryFields && settings.showTaxDetails ? items.flatMap((item, index) => {
    const gst = item.gst || {};
    const rate = Number(gst.rate ?? item.gstRate ?? 0);
    if (!rate) return [];
    const breakdown = gst.breakdown || {};
    const inclusive = Boolean(gst.isInclusive ?? item.isInclusive);
    const itemBase = Number(item.total ?? Number(item.price || 0) * Number(item.quantity || 0));
    const kind = String(gst.taxType || gst.type || item.taxType || "").toUpperCase();
    const isInterstate = kind === "IGST" || kind === "INTERSTATE";
    const cgstRate = Number(gst.cgstRate ?? breakdown.cgstRate ?? (isInterstate ? 0 : rate / 2));
    const sgstRate = Number(gst.sgstRate ?? breakdown.sgstRate ?? (isInterstate ? 0 : rate / 2));
    const igstRate = Number(gst.igstRate ?? breakdown.igstRate ?? (isInterstate ? rate : 0));
    const gstAmount = Number(breakdown.total ?? item.calculatedGst ?? (inclusive ? itemBase * rate / (100 + rate) : itemBase * rate / 100));
    const cgstAmount = Number(breakdown.cgst ?? (cgstRate ? gstAmount / 2 : 0));
    const sgstAmount = Number(breakdown.sgst ?? (sgstRate ? gstAmount / 2 : 0));
    const igstAmount = Number(breakdown.igst ?? (igstRate ? gstAmount : 0));
    return [{
      id: item.id || item._id || index,
      name: item.product?.name || item.productName || item.name || `Item ${index + 1}`,
      cgstRate,
      sgstRate,
      igstRate,
      cgstAmount,
      sgstAmount,
      igstAmount,
    }];
  }) : [];
  const describedItems = includeItemDescriptions && settings.showDescription ? items.filter((item) => item.description || item.product?.description) : [];
  const rawTerms = invoiceData?.termsAndConditions || invoiceData?.notes;
  const terms = typeof rawTerms === "string" ? rawTerms : rawTerms?.text || rawTerms?.content || "";
  const showSignature = includeSignature && settings.showSignature;
  const acknowledgementDetails = [
    invoiceData?.invoiceNumber && `Invoice ${invoiceData.invoiceNumber}`,
    invoiceData?.customer?.name && invoiceData.customer.name,
    invoiceData?.createdAt && new Date(invoiceData.createdAt).toLocaleDateString(),
  ].filter(Boolean).join(" · ");
  const showFooter = rows.length || taxLines.length || describedItems.length || (includeTerms && settings.showTerms && terms) || showSignature || settings.showAcknowledgement;
  if (!showFooter) return null;

  return (
    <section className={styles.extras}>
      {rows.length > 0 && <div className={`${styles.grid} ${context.group === "thermal" ? styles.thermalGrid : ""}`}>{rows}</div>}
      {taxLines.length > 0 && (
        <div className={styles.block}>
          <strong>Tax details by item</strong>
          <div className={styles.taxTable}>
            {taxLines.map((line, index) => (
              <div key={index} className={styles.taxRow}>
                <strong>{line.name}</strong>
                <span>
                  {line.cgstRate > 0 && `CGST ${line.cgstRate}% · ${formatAmount(line.cgstAmount, settings.showAmountDecimals)}`}
                  {line.sgstRate > 0 && ` SGST ${line.sgstRate}% · ${formatAmount(line.sgstAmount, settings.showAmountDecimals)}`}
                  {line.igstRate > 0 && ` IGST ${line.igstRate}% · ${formatAmount(line.igstAmount, settings.showAmountDecimals)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {describedItems.length > 0 && (
        <div className={styles.block}>
          <strong>Item descriptions</strong>
          {describedItems.map((item, index) => (
            <p key={index}>
              <b>{item.product?.name || item.productName || item.name || `Item ${index + 1}`}:</b>{" "}
              {item.description || item.product?.description}
            </p>
          ))}
        </div>
      )}
      {includeTerms && settings.showTerms && terms && <div className={styles.block}><strong>Terms and conditions</strong><p>{terms}</p></div>}
      {showSignature && <div className={styles.signatureBlock}>
        {signatureSrc && <img className={styles.savedSignature} src={signatureSrc} alt="Saved signature" />}
        <span className={styles.signatureLine}>Authorized signature</span>
      </div>}
      {settings.showAcknowledgement && (
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
      )}
    </section>
  );
}
