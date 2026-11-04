export function getProductId(product) {
  if (!product) return null;
  if (typeof product === "string") return product;
  return product.id ?? product._id ?? null;
}

export function pickDefaultVariant(variants = []) {
  if (!Array.isArray(variants) || variants.length === 0) return null;
  const preferred = variants.find((v) => v?.isDefault === true);
  if (preferred) return preferred;
  return [...variants].sort(
    (a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0)
  )[0];
}

export function variantOptionLabel(variant) {
  if (!variant) return "";
  if (variant.displayName) return String(variant.displayName).trim();
  if (Array.isArray(variant.options) && variant.options.length > 0) {
    return variant.options
      .map((o) => o?.value)
      .filter(Boolean)
      .join(" / ");
  }
  if (variant.attributes && typeof variant.attributes === "object") {
    const vals = Object.values(variant.attributes).filter(Boolean);
    if (vals.length > 0) return vals.join(" / ");
  }
  if (variant.name && variant.name !== "Default") return String(variant.name).trim();
  return String(variant.sku || "").trim();
}

export function resolveProductUnitPrice(product) {
  if (!product) return 0;
  const candidates = [
    product.sellingPrice,
    product.mrp,
    product.price,
    product.basePrice,
    product.pricing?.sellingPrice,
    product.pricing?.mrp,
  ];
  for (const val of candidates) {
    const num = Number(val);
    if (!isNaN(num) && num > 0) return num;
  }
  return 0;
}

export function resolveVariantId(product, explicitVariantId = null) {
  if (explicitVariantId) return String(explicitVariantId);
  if (product?.matchedVariantId) return String(product.matchedVariantId);
  if (product?.variantId) return String(product.variantId);

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  if (variants.length === 0) {
    return product?.defaultVariantId ? String(product.defaultVariantId) : null;
  }

  const preferred = pickDefaultVariant(variants);
  const id = preferred?.id ?? preferred?._id ?? product?.defaultVariantId ?? null;
  return id ? String(id) : null;
}

export function findVariantOnProduct(product, variantId) {
  if (!product) return null;
  const variants = Array.isArray(product.variants) ? product.variants : [];
  if (variants.length === 0) return null;
  if (!variantId) {
    return pickDefaultVariant(variants) || variants[0] || null;
  }
  const found = variants.find(
    (v) => String(v?.id ?? v?._id ?? "") === String(variantId)
  );
  if (found) return found;
  if (variants.length === 1) return variants[0];
  return null;
}

export function buildLineFromProduct(
  product,
  quantity,
  variantId,
  customPrice = null
) {
  const variant = findVariantOnProduct(product, variantId);
  const priceSource = variant
    ? {
        ...product,
        sellingPrice: variant.sellingPrice ?? product.sellingPrice,
        mrp: variant.mrp ?? product.mrp,
        uom: variant.uom ?? product.uom,
        gstInfo: {
          ...(product.gstInfo || {}),
          ...(variant.gstInfo || {}),
        },
        pricing: {
          ...(product.pricing || {}),
          sellingPrice: variant.sellingPrice,
          mrp: variant.mrp,
          uom: variant.uom,
        },
      }
    : product;

  const defaultPrice = resolveProductUnitPrice(priceSource);
  const productPrice =
    customPrice !== null && !isNaN(customPrice)
      ? Number(customPrice)
      : defaultPrice;

  const gstRate =
    priceSource.gstInfo?.gstRate ?? product.gstInfo?.gstRate ?? 0;
  const isInclusive =
    product.gstInfo?.isGstIncluded ??
    priceSource.gstInfo?.isGstIncluded ??
    false;
  const uom = variant?.uom || product.uom || "Unit";
  const optionLabel = variantOptionLabel(variant);
  const productName = optionLabel
    ? `${product.name || ""} — ${optionLabel}`.trim()
    : product.name || "";

  return {
    product: getProductId(product),
    variant: variantId || null,
    productName,
    sku: variant?.sku ?? product.sku ?? "",
    quantity,
    price: productPrice,
    total: productPrice * quantity,
    gstRate,
    isInclusive,
    uom,
  };
}

export function addProductToInvoiceItems(
  items,
  product,
  quantityToAdd = 1,
  options = {}
) {
  const productId = getProductId(product);
  if (!productId) return { items, added: false };

  const quantity = parseInt(quantityToAdd, 10) || 1;
  const variantId = resolveVariantId(product, options.variantId ?? null);
  const customPrice =
    options.price !== undefined &&
    options.price !== null &&
    options.price !== "" &&
    !isNaN(options.price)
      ? Number(options.price)
      : null;

  const existingItemIndex = items.findIndex((item) => {
    const itemVariant = item.variant ? String(item.variant) : "";
    return (
      String(item.product) === String(productId) &&
      itemVariant === (variantId || "")
    );
  });

  if (existingItemIndex !== -1) {
    const updatedItems = [...items];
    const existingItem = updatedItems[existingItemIndex];
    const newQuantity = existingItem.quantity + quantity;
    const unitPrice =
      customPrice !== null
        ? customPrice
        : (existingItem.price ?? resolveProductUnitPrice(product));

    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: newQuantity,
      price: unitPrice,
      total: unitPrice * newQuantity,
      variant: existingItem.variant ?? variantId ?? null,
    };
    return { items: updatedItems, added: true };
  }

  const newItem = buildLineFromProduct(
    product,
    quantity,
    variantId,
    customPrice
  );
  return { items: [...items, newItem], added: true };
}
