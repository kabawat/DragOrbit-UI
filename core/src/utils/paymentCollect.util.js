export function resolvePaymentLinkUrl(link) {
  if (!link) return "";
  return (
    link.checkoutUrl ||
    link.gatewayShortUrl ||
    link.paymentLinkUrl ||
    link.shortUrl ||
    link.url ||
    ""
  );
}

export function resolveInvoiceDueAmount(invoice) {
  if (!invoice) return 0;
  if (invoice.dueAmount != null) {
    return Math.max(0, Number(invoice.dueAmount) || 0);
  }
  const total = Number(invoice.totalAmount) || 0;
  const paid = Number(invoice.paidAmount) || 0;
  return Math.max(0, total - paid);
}

export function canSendInvoicePaymentLink(invoice) {
  if (!invoice) return false;
  if (invoice.invoiceStatus !== "RELEASED") return false;
  if (invoice.paymentStatus === "PAID") return false;
  if (invoice.isWalkin) return false;
  if (!invoice.customer && !invoice.customerId) return false;
  return resolveInvoiceDueAmount(invoice) > 0;
}

export function buildKhataUpiNote(customerName) {
  const name = String(customerName || "Customer").trim();
  return `Pay ${name}`.slice(0, 80);
}

export function buildInvoiceUpiNote(invoice) {
  const invoiceNumber =
    invoice?.invoiceNumber ||
    invoice?.name ||
    (invoice?.id ? `INV-${invoice.id.slice(-6)}` : "Invoice");
  return `Pay ${invoiceNumber}`.slice(0, 80);
}
