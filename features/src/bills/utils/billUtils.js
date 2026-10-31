/**
 * Utility functions for bill pricing and calculations.
 */

/**
 * Robustly extract the purchase / base / cost price from a product record or variant.
 * Handles diverse schemas across DragBizz backend services and local caches.
 */
export function resolveProductPurchasePrice(product) {
  if (!product || typeof product !== "object") return 0;

  // 1. Direct purchase / cost / base price candidates
  const primaryCandidates = [
    product.purchasePrice,
    product.pricing?.purchasePrice,
    product.basePrice,
    product.pricing?.basePrice,
    product.costPrice,
    product.pricing?.costPrice,
    product.purchase_price,
    product.cost_price,
    product.base_price,
  ];

  for (const val of primaryCandidates) {
    if (val !== undefined && val !== null && val !== "") {
      const num = Number(val);
      if (Number.isFinite(num) && num > 0) return num;
    }
  }

  // 2. Check variants if present
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const defaultVariant =
      product.variants.find((v) => v?.isDefault === true) || product.variants[0];
    if (defaultVariant && defaultVariant !== product) {
      const variantPrice = resolveProductPurchasePrice(defaultVariant);
      if (variantPrice > 0) return variantPrice;
    }
  }

  // 3. Fallback candidates (selling price, mrp, flat price)
  const fallbackCandidates = [
    product.sellingPrice,
    product.pricing?.sellingPrice,
    product.selling_price,
    product.price,
    product.mrp,
    product.pricing?.mrp,
  ];

  for (const val of fallbackCandidates) {
    if (val !== undefined && val !== null && val !== "") {
      const num = Number(val);
      if (Number.isFinite(num) && num > 0) return num;
    }
  }

  return 0;
}

/**
 * Unwraps product list response safely from diverse API response structures.
 */
export function unwrapProductList(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.products)) return raw.products;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.products)) return raw.data.products;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

/**
 * Calculates bill item and grand totals.
 */
export function calculateBillSummary(items = []) {
  if (!Array.isArray(items)) {
    return { itemsCount: 0, totalUnits: 0, grandTotal: 0 };
  }

  let totalUnits = 0;
  let grandTotal = 0;

  for (const item of items) {
    const qty = Math.max(0, parseInt(item?.quantity, 10) || 0);
    const price = Math.max(0, parseFloat(item?.purchasePrice) || 0);
    totalUnits += qty;
    grandTotal += qty * price;
  }

  return {
    itemsCount: items.length,
    totalUnits,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}
