import { calculateInvoiceGST } from "./invoiceCalculations.utils.js";

export function buildInvoiceDraftPayload(formData, storeId) {
  const validItems = (formData.items ?? []).filter(
    (item) => item.product && Number(item.quantity) > 0
  );

  const gstSummary = calculateInvoiceGST({
    items: validItems.map((item) => ({
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      gstRate: Number(item.gstRate || item.gst?.rate) || 0,
      isInclusive:
        item.isInclusive !== undefined
          ? item.isInclusive
          : (item.gst?.isInclusive ?? false),
    })),
    totalDiscount: Number(formData.totalDiscount) || 0,
    discountMode: formData.discountMode || "POST_TOTAL",
    supplierHasGst: true,
  });

  const customer = formData.customer || null;
  const hasCustomer = Boolean(customer && String(customer).trim());

  return {
    customer,
    isWalkin: formData.isWalkin ?? !hasCustomer,
    items: validItems.map((item) => {
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price) > 0 ? Number(item.price) : 0;
      return {
        product: item.product,
        ...(item.variant ? { variant: item.variant } : {}),
        quantity,
        productName: item.productName || "Item",
        price,
        total: Number(item.total) > 0 ? Number(item.total) : price * quantity,
        profit: 0,
        gstRate: Number(item.gstRate) || 0,
        isInclusive: Boolean(item.isInclusive),
        uom: item.uom || "Unit",
        ...(item.gstRate != null
          ? {
              gst: {
                rate: Number(item.gstRate) || 0,
                isInclusive: Boolean(item.isInclusive),
              },
            }
          : item.gst
          ? { gst: item.gst }
          : {}),
      };
    }),
    store: storeId,
    totalDiscount: Number(formData.totalDiscount) || 0,
    discountMode: formData.discountMode || "POST_TOTAL",
    orderSource: formData.orderSource || "POS",
    subtotal: gstSummary.subtotal,
    totalAmount: gstSummary.totalAmount,
    totalProfit: 0,
    gstAmount: gstSummary.gst.total,
    gst: {
      amount: gstSummary.gst.total,
      total: gstSummary.gst.total,
    },
    invoiceStatus: "DRAFT",
    status: "DRAFT",
  };
}
