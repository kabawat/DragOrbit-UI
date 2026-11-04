import { calculateGST } from "./invoiceCalculations.utils.js";

/**
 * Unwrap invoice data in case it is wrapped in an API response
 * like { success: true, data: { ... } } or an array [ { ... } ].
 */
export function unwrapInvoice(raw) {
  if (!raw) return null;
  let current = raw;
  if (Array.isArray(current) && current.length > 0) {
    current = current[0];
  }
  while (
    current &&
    typeof current === "object" &&
    current.data &&
    (typeof current.data === "object" || Array.isArray(current.data)) &&
    !current.items &&
    !current.invoiceNumber &&
    !current.totalAmount
  ) {
    current = Array.isArray(current.data) ? current.data[0] : current.data;
  }
  if (current?.data?.items || current?.data?.invoiceNumber) {
    current = current.data;
  }
  return current;
}

/**
 * Normalize an item so all invoice templates can seamlessly render it,
 * regardless of whether the product name is in item.productName, item.name, or item.product.name.
 */
function normalizeInvoiceItem(item) {
  if (!item) return item;
  const quantity = Number(item.quantity ?? item.qty ?? 1);
  const unitPrice = Number(
    item.price ??
      item.unitPrice ??
      item.sellingPrice ??
      item.rate ??
      item.discountedPrice ??
      item.product?.sellingPrice ??
      item.product?.price ??
      0
  );
  const productName =
    item.productName ||
    (typeof item.product === "object" ? item.product?.name : null) ||
    item.name ||
    item.title ||
    "Item";

  const sku = item.sku || (typeof item.product === "object" ? item.product?.sku : "") || item.variant?.sku || "";

  const productObj =
    typeof item.product === "object" && item.product !== null
      ? {
          ...item.product,
          name: item.product.name || productName,
          sku: item.product.sku || sku,
          sellingPrice: item.product.sellingPrice ?? unitPrice,
        }
      : {
          id: item.product || item.productId || item._id,
          name: productName,
          sku,
          sellingPrice: unitPrice,
        };

  return {
    ...item,
    quantity,
    price: unitPrice,
    unitPrice,
    productName,
    product: productObj,
    sku,
    total: item.total ?? unitPrice * quantity,
    discountedPrice: item.discountedPrice ?? unitPrice,
  };
}

export const calculateGstAmount = (invoice) => {
  if (!invoice) return 0;
  if (invoice.gst?.amount !== undefined) return invoice.gst.amount;
  if (invoice.gstAmount !== undefined) return invoice.gstAmount;
  if (!invoice?.items?.length) return 0;

  let totalGst = 0;
  invoice.items.forEach((item) => {
    const gstRate = item.gst?.rate ?? item.gstRate ?? 0;
    const itemGstAmount = item.gst?.breakdown?.total ?? item.calculatedGst ?? 0;

    if (itemGstAmount > 0) {
      totalGst += itemGstAmount;
    } else if (gstRate > 0) {
      const result = calculateGST({
        amount: item.price || 0,
        isIncluded: item.gst?.isInclusive ?? true,
        rate: gstRate,
        quantity: item.quantity || 1,
      });
      totalGst += result.gstAmount;
    }
  });
  return Math.round(totalGst * 100) / 100;
};

export const getItemsWithGst = (invoice) => {
  const rawItems = invoice?.items || invoice?.invoiceItems || invoice?.products || [];
  if (!rawItems.length) return [];

  return rawItems.map((rawItem) => {
    const item = normalizeInvoiceItem(rawItem);
    const gstRate = item.gst?.rate ?? item.gstRate ?? 0;
    const isInclusive = item.gst?.isInclusive ?? item.isInclusive ?? true;
    const backendGstAmount = item.gst?.breakdown?.total ?? item.gstAmount;

    if (backendGstAmount !== undefined && backendGstAmount !== null) {
      return {
        ...item,
        gstRate,
        calculatedGst: Number(backendGstAmount) || 0,
        calculatedSubtotal: item.total || (item.price * item.quantity),
        calculatedTotal: (item.total || (item.price * item.quantity)) + (isInclusive ? 0 : Number(backendGstAmount) || 0),
      };
    }

    const result = calculateGST({
      amount: item.price || 0,
      isIncluded: isInclusive,
      rate: gstRate,
      quantity: item.quantity || 1,
    });
    return {
      ...item,
      gstRate,
      calculatedGst: result.gstAmount,
      calculatedSubtotal: result.price,
      calculatedTotal: result.total,
    };
  });
};

export const calculateSubtotal = (invoice, calculatedGstAmount, itemsWithGst) => {
  if (!invoice) return 0;
  if (invoice.subtotal !== undefined && invoice.subtotal !== null) return invoice.subtotal;
  if (calculatedGstAmount > 0 && invoice.totalAmount) {
    return Math.round((invoice.totalAmount - calculatedGstAmount) * 100) / 100;
  }
  return itemsWithGst.reduce((sum, item) => sum + (item.calculatedSubtotal || 0), 0);
};

export function normalizeInvoiceForTemplate(rawInvoiceData) {
  if (!rawInvoiceData) return null;
  const invoiceData = unwrapInvoice(rawInvoiceData);
  if (!invoiceData) return null;

  const gst = calculateGstAmount(invoiceData);
  const items = getItemsWithGst(invoiceData);
  const subtotal = calculateSubtotal(invoiceData, gst, items);

  return {
    ...invoiceData,
    invoiceNumber: invoiceData.invoiceNumber || invoiceData.number || invoiceData.invoiceNo || "",
    customer: typeof invoiceData.customer === "object" && invoiceData.customer !== null
      ? invoiceData.customer
      : invoiceData.customerName
      ? { name: invoiceData.customerName, phone: invoiceData.customerPhone, email: invoiceData.customerEmail }
      : null,
    items: items.length > 0 ? items : (invoiceData.items || []).map(normalizeInvoiceItem),
    subtotal: subtotal > 0 ? subtotal : invoiceData.subtotal,
    gstAmount: gst > 0 ? gst : invoiceData.gstAmount,
  };
}
