"use client";

import InvoiceContainer from "../../InvoiceContainer";
import { useInvoicePrintContext } from "../../InvoicePrintSettingsContext.jsx";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import { computeB2CTotals, getItemRows } from "../../b2cHelpers.js";
import { signatureToImage } from "../../signatureToImage.js";
import styles from "./style.module.scss";

const addressText = (value) => typeof value === "string" ? value : value && typeof value === "object"
  ? [value.line1, value.line2, value.city, value.state, value.pincode, value.country].filter(Boolean).join(", ")
  : "";
const dateText = (value, format = "DD-MM-YYYY") => value ? formatInvoiceDate(value, format) : "—";
const money = (value, settings) => `₹${(Number(value) || 0).toLocaleString("en-IN", {
  minimumFractionDigits: settings.showAmountDecimals ? 2 : 0,
  maximumFractionDigits: settings.showAmountDecimals ? 2 : 0,
})}`;

function amountWords(value) {
  const oneToNineteen = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const underThousand = (number) => {
    if (number < 20) return oneToNineteen[number];
    if (number < 100) return `${tens[Math.floor(number / 10)]}${number % 10 ? ` ${oneToNineteen[number % 10]}` : ""}`;
    return `${oneToNineteen[Math.floor(number / 100)]} Hundred${number % 100 ? ` ${underThousand(number % 100)}` : ""}`;
  };
  let amount = Math.max(0, Math.floor(Number(value) || 0));
  if (!amount) return "Zero Rupees Only";
  const words = [];
  for (const [size, label] of [[10000000, "Crore"], [100000, "Lakh"], [1000, "Thousand"], [1, ""]]) {
    const part = Math.floor(amount / size);
    if (part) words.push(`${underThousand(part)}${label ? ` ${label}` : ""}`);
    amount %= size;
  }
  return `${words.join(" ")} Rupees Only`;
}

function getTaxLines(items) {
  return items.flatMap((item, index) => {
    const gst = item.gst || {};
    const rate = Number(gst.rate ?? item.gstRate ?? 0);
    if (!rate) return [];
    const tax = Number(gst.amount ?? gst.breakdown?.total ?? item.calculatedGst ?? 0);
    const base = Number(item.total ?? item.price ?? 0) * Number(item.quantity || 1);
    const interState = String(gst.taxType || gst.type || item.taxType || "").toUpperCase() === "IGST";
    const parts = interState
      ? [{ label: "IGST", rate, amount: tax }]
      : [{ label: "SGST", rate: rate / 2, amount: Number(gst.breakdown?.sgst ?? tax / 2) }, { label: "CGST", rate: rate / 2, amount: Number(gst.breakdown?.cgst ?? tax / 2) }];
    return parts.map((part) => ({ ...part, base, key: `${item.id || item._id || index}-${part.label}` }));
  });
}

function BrandBlock({ store, logo, centered = false, leftLogo = false }) {
  const { settings = {} } = useInvoicePrintContext() || {};
  return <header className={`${styles.brandBlock} ${centered ? styles.brandCentered : ""} ${leftLogo ? styles.brandLogoLeft : ""}`}>
    {settings.showLogo && logo && <img data-invoice-logo src={logo} alt="Store logo" className={styles.logo} />}
    <div className={styles.storeDetails}>
      {settings.showCompanyName && <b className={styles.storeName}>{store.storeName || store.name || "Your Store"}</b>}
      {settings.showAddress && addressText(store.address) && <span>{addressText(store.address)}</span>}
      {settings.showPhone && store.phone && <span>Ph. no.: {store.phone}</span>}
      {settings.showEmail && store.email && <span>Email: {store.email}</span>}
      {settings.showGstin && (store.gstin || store.gst) && <span>GSTIN: {store.gstin || store.gst}</span>}
    </div>
  </header>;
}

function PartyInfo({ invoice, customer, style, shipping = true }) {
  return <div className={style}>
    <div className={styles.party}><b>Bill To:</b><strong>{customer.name || invoice.customerName || "Walk-in Customer"}</strong>{addressText(customer.address) && <span>{addressText(customer.address)}</span>}{(customer.phone || customer.mobile) && <span>Contact No.: {customer.phone || customer.mobile}</span>}{customer.email && <span>{customer.email}</span>}</div>
    {shipping && <div className={styles.party}><b>Shipping To</b><span>{addressText(invoice.shippingAddress || invoice.shipTo || invoice.deliveryAddress) || "—"}</span></div>}
  </div>;
}

function InvoiceMeta({ invoice, transport = false }) {
  const pairs = [
    ["Invoice No.", invoice.invoiceNumber || invoice.number || "—"],
    ["Date", dateText(invoice.createdAt || invoice.date, "DD-MM-YYYY, hh:mm A")],
    ["Due Date", dateText(invoice.dueDate)],
  ];
  if (transport) pairs.push(["Transport Name", invoice.transportName || invoice.transport?.name || "—"], ["Transport Id", invoice.transportId || invoice.transport?.id || "—"], ["Vehicle Number", invoice.vehicleNumber || invoice.vehicleNo || "—"], ["Delivery Date", dateText(invoice.deliveryDate)], ["Delivery Location", invoice.deliveryLocation || "—"]);
  return <div className={transport ? styles.transportMeta : styles.meta}><b>Invoice Details</b>{pairs.map(([label, value]) => <span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div>;
}

function ItemTable({ rows, totalQuantity, settings, withSplitTax = false }) {
  return <table className={`${styles.itemTable} ${withSplitTax ? styles.splitTaxTable : ""}`}>
    <thead><tr><th>#</th><th>Item name</th><th>HSC/SAC</th><th>Quantity</th><th>Price/unit</th><th>Discount</th>{withSplitTax ? <><th>CGST</th><th>SGST</th></> : <th>GST</th>}<th>Amount</th></tr></thead>
    <tbody>{rows.map(({ index, item, qty, unitPrice, lineAmount }) => {
      const discount = Number(item.discountAmount ?? item.discount ?? 0);
      const actualRate = Number(item.gst?.rate ?? item.gstRate ?? 0);
      const actualTax = Number(item.gst?.amount ?? item.gst?.breakdown?.total ?? item.calculatedGst ?? 0);
      const gstRate = settings.showTaxDetails ? actualRate : 0;
      const tax = settings.showTaxDetails ? actualTax : 0;
      const isIgst = String(item.gst?.taxType || item.taxType || "").toUpperCase() === "IGST";
      const halfTax = tax / 2;
      return <tr key={item.id || item._id || index}>
        <td>{index + 1}</td><td><b>{item.product?.name || item.productName || item.name || "Item"}</b>{settings.showDescription && (item.description || item.product?.description) && <small>{item.description || item.product.description}</small>}</td><td>{item.hsn || item.hsnCode || item.product?.hsn || item.product?.hsnCode || "—"}</td><td>{qty}{item.uom ? ` ${item.uom}` : ""}</td><td>{money(unitPrice, settings)}</td><td>{discount ? `${money(discount, settings)}${item.discountRate ? ` (${item.discountRate}%)` : ""}` : "—"}</td>
        {withSplitTax ? <><td>{!settings.showTaxDetails || isIgst ? "—" : `${money(Number(item.gst?.breakdown?.cgst ?? halfTax), settings)} (${gstRate / 2}%)`}</td><td>{!settings.showTaxDetails || isIgst ? "—" : `${money(Number(item.gst?.breakdown?.sgst ?? halfTax), settings)} (${gstRate / 2}%)`}</td></> : <td>{gstRate ? `${money(tax, settings)} (${gstRate}%)` : "—"}</td>}
        <td>{money(lineAmount + actualTax, settings)}</td>
      </tr>;
    })}</tbody>
    <tfoot><tr><td colSpan="3"><b>Total</b></td><td><b>{totalQuantity}</b></td><td /><td><b>{money(rows.reduce((sum, row) => sum + Number(row.item.discountAmount ?? row.item.discount ?? 0), 0), settings)}</b></td>{withSplitTax ? <><td /><td /></> : <td />}<td><b>{money(rows.reduce((sum, row) => sum + row.lineAmount + Number(row.item.gst?.amount ?? row.item.gst?.breakdown?.total ?? row.item.calculatedGst ?? 0), 0), settings)}</b></td></tr></tfoot>
  </table>;
}

function Totals({ invoice, totals, taxLines, settings, compact = false }) {
  const received = Number(invoice.amountPaid ?? invoice.receivedAmount ?? invoice.paidAmount ?? invoice.amountReceived ?? 0);
  const balance = Number(invoice.balanceDue ?? invoice.balanceAmount ?? totals.totalAmount - received);
  return <div className={`${styles.totals} ${compact ? styles.totalsCompact : ""}`}>
    <div className={styles.totalsHeading}>Amounts</div>
    <Summary label="Sub Total" value={money(totals.tableTotalAmount, settings)} />
    {totals.totalDiscount > 0 && <Summary label="Discount" value={money(totals.totalDiscount, settings)} />}
    {settings.showTaxDetails && (compact ? taxLines.map((line) => <Summary key={line.key} label={`${line.label} @ ${line.rate}%`} value={money(line.amount, settings)} />) : <Summary label="Tax" value={money(totals.totalGst, settings)} />)}
    <Summary label="Total" value={money(totals.totalAmount, settings)} bold />
    {settings.showReceivedAmount && <Summary label="Received" value={money(received, settings)} />}
    {settings.showBalanceAmount && <Summary label="Balance" value={money(balance, settings)} />}
    {settings.showPaymentMode && (invoice.paymentMode || invoice.paymentMethod) && <Summary label="Payment mode" value={invoice.paymentMode || invoice.paymentMethod} />}
    {settings.showCustomerBalance && invoice.customer?.currentBalance != null && <Summary label="Customer current balance" value={money(invoice.customer.currentBalance, settings)} />}
  </div>;
}

function Summary({ label, value, bold = false }) { return <div className={`${styles.summaryRow} ${bold ? styles.summaryEmphasis : ""}`}><span>{label}</span><strong>{value}</strong></div>; }

function TaxTable({ lines, settings }) {
  if (!lines.length) return null;
  return <table className={styles.taxTable}><thead><tr><th>Tax type</th><th>Taxable amount</th><th>Rate</th><th>Tax amount</th></tr></thead><tbody>{lines.map((line) => <tr key={line.key}><td>{line.label}</td><td>{money(line.base, settings)}</td><td>{line.rate}%</td><td>{money(line.amount, settings)}</td></tr>)}</tbody></table>;
}

function Signature({ store, settings, src }) {
  return <div className={styles.signature}><span>For: {store.storeName || store.name || "Your Store"}</span><div className={styles.signatureImage}>{settings.showSignature && src && <img src={src} alt="Saved signature" />}</div><b>Authorized Signatory</b></div>;
}

function SalesTemplate({ invoiceData = {}, selectedStore = {}, design }) {
  const context = useInvoicePrintContext();
  const settings = context?.settings || {};
  const store = selectedStore;
  const customer = invoiceData.customer || {};
  const source = store.logo || store.logoUrl;
  const logo = typeof source === "string" ? source : source?.url || source?.secure_url;
  const signature = signatureToImage(context?.signature);
  const totals = computeB2CTotals(invoiceData);
  const rows = getItemRows(totals.items);
  const taxLines = getTaxLines(totals.items);
  const description = invoiceData.description || invoiceData.notes || "";
  const termsValue = invoiceData.termsAndConditions;
  const terms = typeof termsValue === "string" ? termsValue : termsValue?.text || termsValue?.content || "";
  const shipment = addressText(invoiceData.shippingAddress || invoiceData.shipTo || invoiceData.deliveryAddress);

  if (design === "sale") return <InvoiceContainer className={styles.document} includeExtras={false}>
    <article className={`${styles.invoice} ${styles.sale}`}>
      <BrandBlock store={store} logo={logo} />
      <h1 data-invoice-header className={styles.saleTitle}>Sale</h1>
      <div className={styles.saleParties}><PartyInfo invoice={invoiceData} customer={customer} style={styles.partyColumns} /><InvoiceMeta invoice={invoiceData} /></div>
      {shipment && <p className={styles.shipLabel}><b>Shipping To:</b> {shipment}</p>}
      <ItemTable rows={rows} totalQuantity={totals.tableTotalQty} settings={settings} />
      <section className={styles.saleLower}><div>{settings.showDescription && <TextBlock title="Description" text={description} />}{settings.showAmountInWords && <TextBlock title="Invoice Amount in Words" text={amountWords(totals.totalAmount)} />}{settings.showTerms && <TextBlock title="Terms and Conditions" text={terms} />}</div><Totals invoice={invoiceData} totals={totals} taxLines={taxLines} settings={settings} compact /></section>
      <PaymentSignature invoice={invoiceData} store={store} settings={settings} signature={signature} />
    </article>
  </InvoiceContainer>;

  if (design === "tax-summary") return <InvoiceContainer className={styles.document} includeExtras={false}>
    <article className={`${styles.invoice} ${styles.taxSummaryDesign}`}>
      <h1 data-invoice-header className={styles.centerTitle}>Sale</h1>
      <div className={styles.framed}>
        <BrandBlock store={store} logo={logo} centered />
        <div className={styles.threeParties}><PartyInfo invoice={invoiceData} customer={customer} style={styles.partyColumns} /><InvoiceMeta invoice={invoiceData} /></div>
        <ItemTable rows={rows} totalQuantity={totals.tableTotalQty} settings={settings} withSplitTax />
        <div className={styles.taxAndTotals}><TaxTable lines={settings.showTaxDetails ? taxLines : []} settings={settings} /><Totals invoice={invoiceData} totals={totals} taxLines={taxLines} settings={settings} /></div>
        <div className={styles.bandPair}><div><b>Invoice Amount in Words</b><span>{settings.showAmountInWords ? amountWords(totals.totalAmount) : ""}</span></div><div><b>Description</b><span>{settings.showDescription ? description : ""}</span></div></div>
        <BottomDetails invoice={invoiceData} store={store} settings={settings} signature={signature} terms={terms} />
      </div>
    </article>
  </InvoiceContainer>;

  if (design === "sale-breakdown") return <InvoiceContainer className={styles.document} includeExtras={false}>
    <article className={`${styles.invoice} ${styles.taxSummaryDesign}`}>
      <h1 data-invoice-header className={styles.centerTitle}>Sale</h1>
      <div className={styles.framed}>
        <BrandBlock store={store} logo={logo} centered />
        <div className={styles.threeParties}><PartyInfo invoice={invoiceData} customer={customer} style={styles.partyColumns} /><InvoiceMeta invoice={invoiceData} /></div>
        <ItemTable rows={rows} totalQuantity={totals.tableTotalQty} settings={settings} />
        <div className={styles.breakdownTop}><div><b>Invoice Amount in Words</b><span>{settings.showAmountInWords ? amountWords(totals.totalAmount) : ""}</span></div><Totals invoice={invoiceData} totals={totals} taxLines={taxLines} settings={settings} compact /></div>
        <div className={styles.breakdownBottom}><TaxTable lines={settings.showTaxDetails ? taxLines : []} settings={settings} /><div className={styles.descriptionCell}><b>Description</b><span>{settings.showDescription ? description : ""}</span></div></div>
        <BottomDetails invoice={invoiceData} store={store} settings={settings} signature={signature} terms={terms} />
      </div>
    </article>
  </InvoiceContainer>;

  if (design === "transport-tax") {
    const billCustomer = customer;
    const poDate = dateText(invoiceData.poDate || invoiceData.purchaseOrderDate);
    const placeOfSupply = invoiceData.placeOfSupply || invoiceData.supplyState || invoiceData.state || "—";
    const transportName = invoiceData.transportName || invoiceData.transport?.name || "—";
    const vehicleNumber = invoiceData.vehicleNumber || invoiceData.vehicleNo || invoiceData.transport?.vehicleNumber || "—";
    const deliveryDate = dateText(invoiceData.deliveryDate);
    const qr = store.upiQrCode || store.qrCode || store.paymentQr;
    const qrSrc = typeof qr === "string" ? qr : qr?.url || qr?.secure_url;
    const received = Number(invoiceData.amountPaid ?? invoiceData.receivedAmount ?? invoiceData.paidAmount ?? 0);
    const balance = Number(invoiceData.balanceDue ?? invoiceData.balanceAmount ?? totals.totalAmount - received);
    const otherCharges = [
      ["CESS", invoiceData.cessAmount ?? invoiceData.cess],
      ["Shipping", invoiceData.shippingAmount ?? invoiceData.shippingCharge],
      ["Round off", invoiceData.roundOff],
    ].filter(([, amount]) => amount != null && Number(amount) !== 0);
    return <InvoiceContainer className={styles.document} includeExtras={false}>
      <article className={`${styles.invoice} ${styles.transportTaxDesign}`}>
        <div className={styles.taxHeadingRow}><h1 data-invoice-header>TAX INVOICE</h1>{settings.showLogo && logo && <img data-invoice-logo src={logo} alt="Store logo" />}</div>
        <div className={styles.sellerDetails}>
          <div><b>{settings.showCompanyName && (store.storeName || store.name || "Your Store")}</b>{settings.showAddress && <span>{addressText(store.address)}</span>}{settings.showGstin && (store.gstin || store.gst) && <span>GSTIN: {store.gstin || store.gst}</span>}</div>
          <div>{settings.showPhone && store.phone && <span>Phone: {store.phone}</span>}{settings.showEmail && store.email && <span>Email: {store.email}</span>}</div>
        </div>
        <div className={styles.transportInvoiceGrid}>
          <section><h2>Invoice No.: {invoiceData.invoiceNumber || "—"}</h2><InfoPair label="Invoice Date" value={dateText(invoiceData.createdAt || invoiceData.date)} /><InfoPair label="Invoice Time" value={dateText(invoiceData.createdAt || invoiceData.date, "hh:mm A")} /><InfoPair label="Place of Supply" value={placeOfSupply} /><InfoPair label="PO Date" value={poDate} /><InfoPair label="Due Date" value={dateText(invoiceData.dueDate)} /></section>
          <section><h2>Bill To:</h2><b>{billCustomer.name || invoiceData.customerName || "Walk-in Customer"}</b>{addressText(billCustomer.address) && <span>{addressText(billCustomer.address)}</span>}{(billCustomer.phone || billCustomer.mobile) && <InfoPair label="Contact No." value={billCustomer.phone || billCustomer.mobile} />}{billCustomer.gstin && <InfoPair label="GSTIN Number" value={billCustomer.gstin} />}{billCustomer.state && <InfoPair label="State" value={billCustomer.state} />}</section>
          <section><h2>Transportation Details:</h2><InfoPair label="Transport Name" value={transportName} /><InfoPair label="Vehicle Number" value={vehicleNumber} /><InfoPair label="Delivery Date" value={deliveryDate} /><InfoPair label="Ship To" value={shipment || "—"} /></section>
        </div>
        <ItemTable rows={rows} totalQuantity={totals.tableTotalQty} settings={settings} />
        <div className={styles.transportTaxLower}>
          <div className={styles.payWordsTerms}>
            {qrSrc && <img className={styles.taxQr} src={qrSrc} alt="Payment QR" />}
            {(store.bankName || store.bankAccountNumber || store.bankIfsc) && <div className={styles.payTo}><b>Pay To:</b>{store.bankName && <span>Bank Name: {store.bankName}</span>}{store.bankAccountNumber && <span>Bank Account No.: {store.bankAccountNumber}</span>}{store.bankIfsc && <span>Bank IFSC code: {store.bankIfsc}</span>}</div>}
            {settings.showAmountInWords && <TextBlock title="Invoice Amount in Words" text={amountWords(totals.totalAmount)} />}
            {settings.showTerms && <TextBlock title="Terms And Conditions" text={terms} />}
            {settings.showSignature && <Signature store={store} settings={settings} src={signature} />}
          </div>
          <div className={styles.transportTaxTotals}>
            <Summary label="Sub Total" value={money(totals.tableTotalAmount, settings)} />
            {totals.totalDiscount > 0 && <Summary label="Discount" value={money(totals.totalDiscount, settings)} />}
            {settings.showTaxDetails && taxLines.map((line) => <Summary key={line.key} label={`${line.label} @ ${line.rate}%`} value={money(line.amount, settings)} />)}
            {otherCharges.map(([label, amount]) => <Summary key={label} label={label} value={money(amount, settings)} />)}
            <Summary label="Total" value={money(totals.totalAmount, settings)} bold />
            {settings.showReceivedAmount && <Summary label="Received" value={money(received, settings)} />}
            {settings.showBalanceAmount && <Summary label="Balance" value={money(balance, settings)} />}
            {settings.showPaymentMode && (invoiceData.paymentMode || invoiceData.paymentMethod) && <Summary label="Payment mode" value={invoiceData.paymentMode || invoiceData.paymentMethod} />}
          </div>
        </div>
      </article>
    </InvoiceContainer>;
  }

  return <InvoiceContainer className={styles.document} includeExtras={false}>
    <article className={`${styles.invoice} ${styles.transportDesign}`}>
      <h1 data-invoice-header className={styles.centerTitle}>Sale</h1>
      <div className={styles.framed}>
        <div className={styles.transportTop}><BrandBlock store={store} logo={logo} leftLogo /><InvoiceMeta invoice={invoiceData} transport /></div>
        <div className={styles.transportBill}><PartyInfo invoice={invoiceData} customer={customer} style={styles.partyColumns} shipping={false} /><div className={styles.shipTo}><b>Ship To</b><span>{shipment || "—"}</span></div></div>
        <ItemTable rows={rows} totalQuantity={totals.tableTotalQty} settings={settings} />
        <section className={styles.transportAmounts}><div>{settings.showAmountInWords && <TextBlock title="Invoice Amount in Words" text={amountWords(totals.totalAmount)} />}{settings.showDescription && <TextBlock title="Description" text={description} />}</div><Totals invoice={invoiceData} totals={totals} taxLines={taxLines} settings={settings} /></section>
        {settings.showTaxDetails && <TaxTable lines={taxLines} settings={settings} />}
        <BottomDetails invoice={invoiceData} store={store} settings={settings} signature={signature} terms={terms} />
      </div>
    </article>
  </InvoiceContainer>;
}

function TextBlock({ title, text }) { return <div className={styles.textBlock}><b>{title}</b><p>{text || "—"}</p></div>; }
function InfoPair({ label, value }) { return <div className={styles.infoPair}><span>{label}:</span><b>{value}</b></div>; }
function PaymentSignature({ invoice, store, settings, signature }) {
  const pay = store.upiQrCode || store.qrCode || store.paymentQr;
  const paySrc = typeof pay === "string" ? pay : pay?.url || pay?.secure_url;
  return <footer className={styles.saleFooter}><div className={styles.payDetails}>{paySrc && <img src={paySrc} alt="Payment QR" />}{(store.bankName || store.bankAccountNumber || store.bankIfsc) && <div><b>Pay To:</b><span>Bank Name: {store.bankName || "—"}</span><span>Bank Account No.: {store.bankAccountNumber || "—"}</span><span>Bank IFSC code: {store.bankIfsc || "—"}</span></div>}</div><Signature store={store} settings={settings} src={signature} /></footer>;
}
function BottomDetails({ invoice, store, settings, signature, terms }) {
  const pay = store.upiQrCode || store.qrCode || store.paymentQr;
  const paySrc = typeof pay === "string" ? pay : pay?.url || pay?.secure_url;
  return <footer className={styles.bottomDetails}><div className={styles.bankDetails}><b>Bank Details</b>{paySrc && <img src={paySrc} alt="Payment QR" />}{store.bankName && <span>Bank Name: {store.bankName}</span>}{store.bankAccountNumber && <span>Bank Account No.: {store.bankAccountNumber}</span>}{store.bankIfsc && <span>Bank IFSC code: {store.bankIfsc}</span>}</div><div className={styles.termsBlock}><b>Terms and conditions</b><span>{settings.showTerms ? terms : ""}</span></div><Signature store={store} settings={settings} src={signature} /></footer>;
}

export const SaleInvoiceTemplate = (props) => <SalesTemplate {...props} design="sale" />;
export const SaleTaxSummaryTemplate = (props) => <SalesTemplate {...props} design="tax-summary" />;
export const SaleTaxBreakdownTemplate = (props) => <SalesTemplate {...props} design="sale-breakdown" />;
export const TransportSaleTemplate = (props) => <SalesTemplate {...props} design="transport" />;
export const TransportTaxInvoiceTemplate = (props) => <SalesTemplate {...props} design="transport-tax" />;
