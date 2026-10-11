/**
 * Match a scanned barcode or SKU against a product list (exact match preferred).
 */
export function findProductByScanCode(products, code) {
  const normalized = String(code || "").trim();
  if (!normalized || !Array.isArray(products)) return null;

  const lower = normalized.toLowerCase();

  return (
    products.find((p) => {
      const barcode = String(p.barcode || "").trim();
      const sku = String(p.sku || "").trim();
      if (barcode && barcode === normalized) return true;
      if (sku && sku.toLowerCase() === lower) return true;
      if (barcode && barcode.toLowerCase() === lower) return true;
      return false;
    }) || null
  );
}

export function getProductId(product) {
  return product?.id || product?._id || null;
}
