"use client";

import MiniInvoiceContainer from "../MiniInvoiceContainer";
import { useInvoicePrintContext } from "../../InvoicePrintSettingsContext.jsx";
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import { computeB2CTotals, getItemRows } from "../../b2cHelpers.js";
import { signatureToImage } from "../../signatureToImage.js";
import styles from "./style.module.scss";

const money = (amount, settings) => `₹${(Number(amount) || 0).toLocaleString("en-IN", {
  minimumFractionDigits: settings.showAmountDecimals ? 2 : 0,
  maximumFractionDigits: settings.showAmountDecimals ? 2 : 0,
})}`;
const date = (value, format = "DD/MM/YYYY") => value ? formatInvoiceDate(value, format) : "—";
const displayAddress = (value) => typeof value === "string" ? value : value && typeof value === "object"
  ? [value.line1, value.line2, value.city, value.state, value.pincode].filter(Boolean).join(", ")
  : "";

function TaxInvoice({ invoiceData = {}, selectedStore = {} }) {
  const context = useInvoicePrintContext();
  const settings = context?.settings || {};
  const customer = invoiceData.customer || {};
  const { items, tableTotalQty, tableTotalAmount, totalDiscount, totalGst, totalAmount, grossTotal } = computeB2CTotals(invoiceData);
  const itemRows = getItemRows(items);
  const paid = Number(invoiceData.amountPaid ?? invoiceData.receivedAmount ?? invoiceData.paidAmount ?? invoiceData.amountReceived ?? 0);
  const balance = Number(invoiceData.balanceDue ?? invoiceData.balanceAmount ?? totalAmount - paid);
  const signatureSrc = signatureToImage(context?.signature);
  const logoValue = selectedStore.logo || selectedStore.logoUrl;
  const logo = typeof logoValue === "string" ? logoValue : logoValue?.url || logoValue?.secure_url;
  const subTotal = Number(invoiceData.subtotal ?? invoiceData.subTotal ?? grossTotal);
  const fixedDiscount = Number(invoiceData.fixedDiscount ?? invoiceData.discountAmount ?? invoiceData.discount ?? 0);
  const discountPercent = Number(invoiceData.discountPercentage ?? invoiceData.discountRate ?? invoiceData.discountPercent ?? 0);
  const percentageDiscount = Number(invoiceData.percentageDiscountAmount ?? invoiceData.discountPercentageAmount ?? (discountPercent ? subTotal * discountPercent / 100 : 0));
  const overallDiscount = Number(invoiceData.totalDiscount ?? (fixedDiscount + percentageDiscount || totalDiscount));
  const invoiceTitle = "Tax Invoice";
  const quantity = (item) => {
    const qty = Number(item.quantity) || 0;
    const free = Number(item.freeQuantity ?? item.bonusQuantity ?? item.freeQty ?? 0);
    const unit = item.uom || item.unit || "";
    return `${qty}${free ? ` + ${free}` : ""}${unit ? ` ${unit}` : ""}`;
  };
  const itemTax = (item) => Number(item.gst?.amount ?? item.gst?.breakdown?.total ?? item.calculatedGst ?? 0);
  const itemTaxRate = (item) => Number(item.gst?.rate ?? item.gstRate ?? 0);
  const getDiscount = (item) => Number(item.discountAmount ?? item.discount ?? 0);

  return <MiniInvoiceContainer className={styles.page} includeExtras={false}>
    <article className={styles.receipt}>
      <header className={styles.storeHeader}>
        {settings.showLogo && logo && <img data-invoice-logo className={styles.logo} src={logo} alt="Store logo" />}
        {settings.showCompanyName && <strong className={styles.storeName}>{selectedStore.storeName || selectedStore.name || "Your Store"}</strong>}
        {settings.showAddress && displayAddress(selectedStore.address) && <span>{displayAddress(selectedStore.address)}</span>}
        {settings.showPhone && selectedStore.phone && <span>Ph.No.: {selectedStore.phone}</span>}
        {settings.showEmail && selectedStore.email && <span>Email: {selectedStore.email}</span>}
        {settings.showGstin && (selectedStore.gstin || selectedStore.gst) && <span>GSTIN: {selectedStore.gstin || selectedStore.gst}</span>}
      </header>

      <h1 data-invoice-header className={styles.title}>{invoiceTitle}</h1>

      <section className={styles.invoiceInfo}>
        <div className={styles.customerInfo}>
          <b>{customer.name || invoiceData.customerName || "Walk-in Customer"}</b>
          {(customer.phone || customer.mobile) && <span>Ph. No.: {customer.phone || customer.mobile}</span>}
          {settings.showEmail && customer.email && <span>Email: {customer.email}</span>}
          <b>Bill To:</b>
          {displayAddress(customer.address) && <span>{displayAddress(customer.address)}</span>}
          {(customer.phone || customer.mobile) && <span>Contact No.: {customer.phone || customer.mobile}</span>}
          {settings.showGstin && customer.gstin && <span>GSTIN: {customer.gstin}</span>}
          {(invoiceData.placeOfSupply || customer.state) && <span>Place of Supply: {invoiceData.placeOfSupply || customer.state}</span>}
        </div>
        <div className={styles.invoiceMeta}>
          <span>Date: {date(invoiceData.createdAt || invoiceData.date)}</span>
          <span>Invoice No.: {invoiceData.invoiceNumber || "—"}</span>
          {invoiceData.dueDate && <span>Due Date: {date(invoiceData.dueDate)}</span>}
        </div>
      </section>

      <table className={styles.itemsTable}>
        <thead><tr><th>#</th><th>Name</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
        <tbody>{itemRows.map(({ index, item, unitPrice, lineAmount }) => {
          const tax = itemTax(item);
          const rate = itemTaxRate(item);
          const description = item.description || item.product?.description;
          const hsn = item.hsn || item.hsnCode || item.product?.hsn || item.product?.hsnCode;
          const discount = getDiscount(item);
          return <tr key={item.id || item._id || index}>
            <td>{index + 1}</td>
            <td className={styles.itemName}>
              <b>{item.product?.name || item.productName || item.name || "Item"}</b>
              {settings.showDescription && description && <i>{description}</i>}
              {(settings.showTaxDetails || hsn || item.mrp || item.expiryDate) && <small>{settings.showTaxDetails && hsn && `HSN: ${hsn}`}{settings.showTaxDetails && rate > 0 && `, GST: ${rate}%`}{item.mrp != null && `, MRP: ${money(item.mrp, settings)}`}{item.batchNo && `, Batch No.: ${item.batchNo}`}{item.modelNo && `, Model No.: ${item.modelNo}`}{item.expiryDate && `, Exp. Date: ${date(item.expiryDate, "M/D")}`}</small>}
            </td>
            <td>{quantity(item)}</td>
            <td>{money(unitPrice, settings)}</td>
            <td>{money(lineAmount + tax, settings)}{discount > 0 && settings.showTaxDetails && <small className={styles.discountHint}>−{money(discount, settings)}</small>}</td>
          </tr>;
        })}</tbody>
        <tfoot><tr><td colSpan="2"><b>Total</b></td><td><b>{tableTotalQty}</b></td><td /><td><b>{money(tableTotalAmount + totalGst, settings)}</b></td></tr></tfoot>
      </table>

      <section className={styles.totals}>
        <div className={styles.totalRow}><span>Sub Total</span><b>{money(subTotal, settings)}</b></div>
        {fixedDiscount > 0 && <div className={styles.totalRow}><span>Disc.</span><b>−{money(fixedDiscount, settings)}</b></div>}
        {discountPercent > 0 && <div className={styles.totalRow}><span>Disc. ({discountPercent}%)</span><b>−{money(percentageDiscount, settings)}</b></div>}
        {settings.showTaxDetails && totalGst > 0 && <div className={styles.totalRow}><span>Tax</span><b>{money(totalGst, settings)}</b></div>}
        {overallDiscount > 0 && <div className={styles.totalRow}><span>Total Disc.</span><b>−{money(overallDiscount, settings)}</b></div>}
        <div className={`${styles.totalRow} ${styles.grandTotal}`}><strong>Total</strong><strong>{money(totalAmount, settings)}</strong></div>
        {settings.showReceivedAmount && <div className={styles.totalRow}><span>Received</span><b>{money(paid, settings)}</b></div>}
        {settings.showBalanceAmount && <div className={styles.totalRow}><span>Balance</span><b>{money(balance, settings)}</b></div>}
        {settings.showPaymentMode && (invoiceData.paymentMode || invoiceData.paymentMethod) && <div className={styles.totalRow}><span>Payment Mode</span><b>{invoiceData.paymentMode || invoiceData.paymentMethod}</b></div>}
        {settings.showCustomerBalance && customer.currentBalance != null && <div className={styles.totalRow}><span>Customer Balance</span><b>{money(customer.currentBalance, settings)}</b></div>}
      </section>

      {(settings.showSignature || settings.showTerms || settings.showAcknowledgement || balance > 0) && <footer className={styles.footer}>
        {settings.showSignature && signatureSrc && <img className={styles.signature} src={signatureSrc} alt="Saved signature" />}
        {settings.showTerms && invoiceData.termsAndConditions && <p>{typeof invoiceData.termsAndConditions === "string" ? invoiceData.termsAndConditions : invoiceData.termsAndConditions.text}</p>}
        {balance > 0 && <b>Balance to be paid{invoiceData.dueDate ? ` by ${date(invoiceData.dueDate)}` : " in 3 days"}</b>}
        {settings.showAcknowledgement && <p>{settings.acknowledgementText}</p>}
      </footer>}
    </article>
  </MiniInvoiceContainer>;
}

export default TaxInvoice;
