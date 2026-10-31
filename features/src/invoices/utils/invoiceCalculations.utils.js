// ─── Rounding ─────────────────────────────────────────────────────────────
export const roundTo2 = (v) =>
  Math.round((Number(v) + Number.EPSILON) * 100) / 100;

// ─── Largest Remainder Method ──────────────────────────────────────────────
export function distributeByLRM(values, total) {
  const sumValues = values.reduce((s, v) => s + v, 0);
  if (sumValues === 0 || total === 0) return values.map(() => 0);

  const shares = values.map((v) => {
    const exact = (v / sumValues) * total;
    return { exact, floor: Math.floor(exact * 100) / 100, remainder: exact % 1 };
  });

  let remaining = roundTo2(total - shares.reduce((s, sh) => s + sh.floor, 0));

  const sorted = shares
    .map((sh, i) => ({ ...sh, index: i }))
    .sort((a, b) => b.remainder - a.remainder);

  let i = 0;
  while (roundTo2(remaining) > 0) {
    sorted[i % sorted.length].floor = roundTo2(
      sorted[i % sorted.length].floor + 0.01
    );
    remaining = roundTo2(remaining - 0.01);
    i++;
  }

  const result = new Array(values.length);
  sorted.forEach((sh) => {
    result[sh.index] = sh.floor;
  });
  return result;
}

export function calculateInvoiceGST({
  items = [],
  totalDiscount = 0,
  discountMode = "POST_TOTAL",
  supplierHasGst = true,
}) {
  if (!items || items.length === 0) {
    return {
      subtotal: 0,
      gst: { total: 0 },
      totalDiscount: 0,
      totalAmount: 0,
      originalTotal: 0,
    };
  }

  const discount = Number(totalDiscount) || 0;

  let totalInclusiveValue = 0;
  let totalTaxableValue = 0;
  const itemInclusiveTotals = [];
  const itemTaxableTotals = [];

  items.forEach((item, index) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const rate = Number(item.gstRate || item.gst?.rate) || 0;
    const isInc = item.isInclusive ?? item.gst?.isInclusive ?? false;

    let itemInc = price * qty;
    let itemTax = price * qty;

    if (isInc && rate > 0) {
      itemTax = itemInc / (1 + rate / 100);
    } else if (!isInc && rate > 0) {
      itemInc = itemTax * (1 + rate / 100);
    }

    totalInclusiveValue += itemInc;
    totalTaxableValue += itemTax;
    itemInclusiveTotals[index] = itemInc;
    itemTaxableTotals[index] = itemTax;
  });

  const base =
    discountMode === "POST_TOTAL" ? itemInclusiveTotals : itemTaxableTotals;
  const integerDiscounts = distributeByLRM(base, discount);

  let aggTaxable = 0;
  let aggGst = 0;

  items.forEach((item, index) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const rate = Number(item.gstRate || item.gst?.rate) || 0;
    const isInc = item.isInclusive ?? item.gst?.isInclusive ?? false;
    const itemDisc = integerDiscounts[index] || 0;

    let calcPrice = price;
    let discountValue = 0;

    if (discountMode === "POST_TOTAL" && totalInclusiveValue > 0) {
      if (isInc) {
        calcPrice = qty > 0 ? (price * qty - itemDisc) / qty : price;
      } else {
        const preTaxDisc = rate > 0 ? itemDisc / (1 + rate / 100) : itemDisc;
        calcPrice = qty > 0 ? (price * qty - preTaxDisc) / qty : price;
      }
      calcPrice = Math.max(0, calcPrice);
      discountValue = 0;
    } else {
      calcPrice = price;
      discountValue = itemDisc;
    }

    let itemTaxable = 0;
    let itemGst = 0;

    if (isInc && rate > 0) {
      const discAmt = discountValue;
      const inclusiveDiscAmt = discAmt * (1 + rate / 100);
      const intendedInclusive = roundTo2(calcPrice * qty - inclusiveDiscAmt);

      if (supplierHasGst) {
        itemGst = roundTo2((intendedInclusive * rate) / (100 + rate));
        itemTaxable = roundTo2(intendedInclusive - itemGst);
      } else {
        itemTaxable = roundTo2(intendedInclusive);
        itemGst = 0;
      }
    } else {
      const lineTotal = calcPrice * qty;
      itemTaxable = roundTo2(Math.max(0, lineTotal - discountValue));

      if (supplierHasGst && rate > 0) {
        itemGst = roundTo2((itemTaxable * rate) / 100);
      }
    }

    aggTaxable += itemTaxable;
    aggGst += itemGst;
  });

  const subtotal = roundTo2(aggTaxable);
  const gstTotal = roundTo2(aggGst);
  const totalAmount = roundTo2(subtotal + gstTotal);
  const originalTotal = roundTo2(totalInclusiveValue);

  return {
    originalTotal,
    subtotal,
    gst: { total: gstTotal },
    totalDiscount: roundTo2(discount),
    totalAmount,
  };
}

export function calculateGST({
  amount = 0,
  isIncluded = false,
  rate = 0,
  quantity = 1,
}) {
  const qty = Math.max(0, Number(quantity) || 0);
  const price = Number(amount) || 0;
  const gstRate = Number(rate) || 0;

  let taxable;
  if (isIncluded && gstRate > 0) {
    taxable = (price * qty) / (1 + gstRate / 100);
  } else {
    taxable = price * qty;
  }

  const gst = roundTo2((taxable * gstRate) / 100);
  const unitTaxable = roundTo2(qty > 0 ? taxable / qty : 0);

  return {
    unitTaxablePrice: unitTaxable,
    price: unitTaxable,
    taxableValue: roundTo2(taxable),
    gstAmount: gst,
    total: roundTo2(taxable + gst),
  };
}
