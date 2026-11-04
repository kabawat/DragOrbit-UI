/** Match barcode/SKU on product or nested variants. */
export function findProductByScanCode(products, code) {
  const normalized = String(code || "").trim();
  if (!normalized || !Array.isArray(products)) return null;

  const lower = normalized.toLowerCase();

  const codeMatches = (barcode, sku) => {
    const b = String(barcode || "").trim();
    const s = String(sku || "").trim();
    if (b && b === normalized) return true;
    if (s && s.toLowerCase() === lower) return true;
    if (b && b.toLowerCase() === lower) return true;
    return false;
  };

  for (const product of products) {
    const variants = Array.isArray(product?.variants) ? product.variants : [];
    for (const variant of variants) {
      if (codeMatches(variant?.barcode, variant?.sku)) {
        const variantId = variant.id ?? variant._id ?? null;
        return {
          ...product,
          matchedVariantId: variantId,
          variantId,
          sku: variant.sku ?? product.sku,
          barcode: variant.barcode ?? product.barcode,
          sellingPrice: variant.sellingPrice ?? product.sellingPrice,
        };
      }
    }

    if (codeMatches(product?.barcode, product?.sku)) {
      return product;
    }
  }

  return null;
}

export function getProductId(product) {
  return product?.id || product?._id || null;
}
