import { useMemo } from "react";
import { calculateInvoiceGST } from "../utils/invoiceCalculations.utils.js";

export function useInvoiceCalculations({
  items = [],
  totalDiscount = 0,
  discountMode = "POST_TOTAL",
  supplierHasGst = true,
}) {
  const gstSummary = useMemo(() => {
    if (!items || items.length === 0) {
      return {
        subtotal: 0,
        gst: { total: 0 },
        totalDiscount: 0,
        totalAmount: 0,
        originalTotal: 0,
      };
    }

    const mapped = items.map((item) => ({
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      gstRate: Number(item.gstRate || item.gst?.rate) || 0,
      isInclusive:
        item.isInclusive !== undefined
          ? item.isInclusive
          : (item.gst?.isInclusive ?? false),
    }));

    return calculateInvoiceGST({
      items: mapped,
      totalDiscount: Number(totalDiscount) || 0,
      discountMode: discountMode || "POST_TOTAL",
      supplierHasGst,
    });
  }, [items, totalDiscount, discountMode, supplierHasGst]);

  const totalQuantity = useMemo(() => {
    return (items || []).reduce(
      (sum, item) => sum + (parseInt(item.quantity, 10) || 0),
      0
    );
  }, [items]);

  const grandTotal = gstSummary.totalAmount || 0;

  return {
    gstSummary,
    grandTotal,
    totalQuantity,
  };
}

export default useInvoiceCalculations;
