"use client";

import InvoiceContainer from "../../InvoiceContainer";
import { useInvoicePrintContext } from "../../InvoicePrintSettingsContext.jsx";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import { computeB2CTotals, fmt, getItemRows } from "../../b2cHelpers.js";
import { signatureToImage } from "../../signatureToImage.js";
import styles from "./style.module.scss";

export default function TaxInvoiceTemplate({ invoiceData = {}, selectedStore = {} }) {
  const printContext = useInvoicePrintContext();
  const settings = printContext?.settings || {};
  const signatureSrc = signatureToImage(printContext?.signature);
  const { items, grossTotal, totalDiscount, totalGst, totalAmount, tableTotalQty } = computeB2CTotals(invoiceData);
  const address = selectedStore.address;
  const customer = invoiceData.customer || {};
  const received = Number(invoiceData.amountPaid ?? invoiceData.receivedAmount ?? invoiceData.paidAmount ?? 0);
  const balance = Number(invoiceData.balanceDue ?? invoiceData.balanceAmount ?? totalAmount - received);
  const date = formatInvoiceDate(invoiceData.createdAt, "DD-MM-YYYY");
  const image = selectedStore.logo || selectedStore.logoUrl;
  const logoSrc = typeof image === "string" ? image : image?.url || image?.secure_url;
  const itemDiscount = (item) => Number(item.discountAmount ?? item.discount ?? 0);
  const itemTax = (item) => Number(item.gst?.amount ?? item.calculatedGst ?? 0);

  return <InvoiceContainer className={styles.document} includeSignature={false}>
    <article className={styles.invoice}>
      <h1 data-invoice-header className={styles.title}>Tax Invoice</h1>
      <header className={styles.merchant}>
        {settings.showLogo !== false && logoSrc && <img data-invoice-logo className={styles.logo} src={logoSrc} alt="Store logo" />}
        <div className={styles.merchantInfo}>
          <h2>{selectedStore.storeName || selectedStore.name || "Your Store"}</h2>
          {address && <p>{typeof address === "string" ? address : [address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(", ")}</p>}
          {selectedStore.phone && <p>Phone: {selectedStore.phone}</p>}
          {selectedStore.email && <p>Email: {selectedStore.email}</p>}
          {(selectedStore.gstin || selectedStore.gst) && <p>GSTIN: {selectedStore.gstin || selectedStore.gst}</p>}
        </div>
      </header>
      <section className={styles.partyGrid}>
        <div><h3>Bill To:</h3><div className={styles.cellBody}><b>{customer.name || invoiceData.customerName || "Walk-in Customer"}</b>{customer.address && <p>{customer.address}</p>}{customer.phone && <p>Contact No: {customer.phone}</p>}{customer.email && <p>Email: {customer.email}</p>}</div></div>
        <div><h3>Invoice Details:</h3><div className={styles.cellBody}><p>Invoice No.: {invoiceData.invoiceNumber || "—"}</p><p>Date: {date}</p>{invoiceData.dueDate && <p>Due Date: {formatInvoiceDate(invoiceData.dueDate, "DD-MM-YYYY")}</p>}</div></div>
      </section>
      {invoiceData.shippingAddress && <section className={styles.shipTo}><h3>Ship To:</h3><p>{typeof invoiceData.shippingAddress === "string" ? invoiceData.shippingAddress : Object.values(invoiceData.shippingAddress).filter((value) => typeof value === "string" || typeof value === "number").join(", ")}</p></section>}
      <table className={styles.items}>
        <thead><tr><th>#</th><th>Item Name</th><th>HSN/SAC</th><th>Quantity</th><th>Price/Unit</th><th>Discount</th><th>GST</th><th>Amount</th></tr></thead>
        <tbody>{getItemRows(items).map(({ index, item, qty, unitPrice, lineAmount }) => <tr key={item.id || item._id || index}>
          <td>{index + 1}</td><td><b>{item.product?.name || item.productName || "Item"}</b>{settings.showDescription && (item.description || item.product?.description) && <small>{item.description || item.product.description}</small>}</td>
          <td>{item.hsn || item.hsnCode || item.product?.hsn || "—"}</td><td>{qty}{item.uom ? ` ${item.uom}` : ""}</td><td>{fmt(unitPrice)}</td><td>{itemDiscount(item) ? fmt(itemDiscount(item)) : "—"}</td><td>{item.gst?.rate ? `${item.gst.rate}% · ${fmt(itemTax(item))}` : "—"}</td><td>{fmt(lineAmount + itemTax(item) - itemDiscount(item))}</td>
        </tr>)}</tbody>
        <tfoot><tr><td colSpan="3"><b>Total</b></td><td><b>{tableTotalQty}</b></td><td colSpan="4" /></tr></tfoot>
      </table>
      <section className={styles.summaryGrid}>
        <div className={styles.taxSummary}><h3>Tax Summary</h3><table><thead><tr><th>Taxable Amount</th><th>CGST</th><th>SGST</th><th>Total Tax</th></tr></thead><tbody><tr><td>{fmt(grossTotal - totalGst)}</td><td>{fmt(Number(invoiceData.gst?.breakdown?.cgst || totalGst / 2))}</td><td>{fmt(Number(invoiceData.gst?.breakdown?.sgst || totalGst / 2))}</td><td>{fmt(totalGst)}</td></tr></tbody></table></div>
        <div className={styles.amountSummary}><SummaryRow label="Sub Total" value={fmt(grossTotal)} /><SummaryRow label="Discount" value={fmt(totalDiscount)} />{settings.showTaxDetails !== false && <SummaryRow label="Tax" value={fmt(totalGst)} bold />}<SummaryRow label="Total" value={fmt(totalAmount)} bold />{settings.showReceivedAmount && <SummaryRow label="Received" value={fmt(received)} />} {settings.showBalanceAmount && <SummaryRow label="Balance" value={fmt(balance)} bold />}</div>
      </section>
      <section className={styles.bottomGrid}>
        <div className={styles.description}><h3>Description:</h3><p>{invoiceData.description || invoiceData.notes || ""}</p></div>
        <div className={styles.terms}><h3>Terms &amp; Conditions:</h3><p>{invoiceData.termsAndConditions?.text || invoiceData.termsAndConditions || "Thank you for your business!"}</p></div>
      </section>
      <footer className={styles.footerGrid}>
        <div className={styles.bank}><h3>Bank Details:</h3><p>{selectedStore.bankName || ""}</p><p>{selectedStore.bankAccountNumber || ""}</p><p>{selectedStore.bankIfsc || ""}</p></div>
        <div className={styles.sign}><h3>For: {selectedStore.storeName || selectedStore.name || "Your Store"}</h3><div className={styles.signArea}>{settings.showSignature && signatureSrc && <img src={signatureSrc} alt="Saved signature" />}</div><div className={styles.signLabel}>Authorized Signatory</div></div>
      </footer>
    </article>
  </InvoiceContainer>;
}

function SummaryRow({ label, value, bold = false }) {
  return <div className={styles.summaryRow}><span>{label}</span><b style={{ fontWeight: bold ? 700 : 400 }}>{value}</b></div>;
}
