/**
 * Product Form Model & Unified Payload Builder
 * Shared across Web (Store) and Desktop platforms.
 * Handles single product (1 default variant) and multi-variant product creation.
 */

import { getInitialVariantFormData } from "../../variants/model/variantForm.js";

export const DEFAULT_CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹) - Indian Rupee" },
  { value: "USD", label: "USD ($) - US Dollar" },
  { value: "EUR", label: "EUR (€) - Euro" },
  { value: "GBP", label: "GBP (£) - British Pound" },
  { value: "AED", label: "AED (د.إ) - UAE Dirham" },
];

export const DEFAULT_UOM_OPTIONS = [
  { value: "PCS", label: "PCS - Pieces" },
  { value: "UNIT", label: "UNIT - Units" },
  { value: "KG", label: "KG - Kilograms" },
  { value: "GRAM", label: "GRAM - Grams" },
  { value: "MG", label: "MG - Milligrams" },
  { value: "LITER", label: "LITER - Liters" },
  { value: "ML", label: "ML - Milliliters" },
  { value: "METER", label: "METER - Meters" },
  { value: "CM", label: "CM - Centimeters" },
  { value: "INCH", label: "INCH - Inches" },
  { value: "FEET", label: "FEET - Feet" },
  { value: "BOX", label: "BOX - Boxes" },
  { value: "PACK", label: "PACK - Packs" },
  { value: "PAIR", label: "PAIR - Pairs" },
  { value: "SET", label: "SET - Sets" },
  { value: "DOZEN", label: "DOZEN - Dozen" },
  { value: "CARTON", label: "CARTON - Cartons" },
  { value: "BUNDLE", label: "BUNDLE - Bundles" },
];

function toNumber(value) {
  if (value == null || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

export function normalizeSkuValue(value) {
  if (value == null) return "";
  return String(value).trim().toUpperCase();
}

export function computeDiscount(mrp, sellingPrice, fallbackDiscount) {
  const numMrp = Number(mrp);
  const numSp = Number(sellingPrice);
  if (
    Number.isFinite(numMrp) &&
    Number.isFinite(numSp) &&
    numMrp > 0 &&
    numSp <= numMrp
  ) {
    return Math.round(((numMrp - numSp) / numMrp) * 100);
  }
  const numFallback = Number(fallbackDiscount);
  return Number.isFinite(numFallback) ? numFallback : 0;
}

export function calculateSavings(mrp, sellingPrice) {
  const numMrp = parseFloat(mrp) || 0;
  const numSp = parseFloat(sellingPrice) || 0;
  if (numMrp > numSp && numSp > 0) {
    return {
      amount: (numMrp - numSp).toFixed(2),
      percentage: Math.round(((numMrp - numSp) / numMrp) * 100),
    };
  }
  return { amount: "0.00", percentage: 0 };
}

export function generateAutoSku(name = "PRD") {
  const namePart = (name || "PRD")
    .trim()
    .substring(0, 4)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${namePart || "PRD"}-${randomSuffix}`;
}

export function getInitialProductFormData(storeId = "") {
  return {
    name: "",
    category: "",
    brandId: "",
    mrp: "",
    sellingPrice: "",
    currency: "INR",
    uom: "PCS",
    sku: "",
    barcode: "",
    stock: "",
    purchasePrice: "",
    basePrice: "",
    displayName: "",
    store: storeId || "",
    images: [],
    productType: "GOODS",
    gstInfo: {
      hsnCode: "",
      isGstIncluded: true,
      gstRate: "",
    },
    content: {
      shortDescription: "",
      longDescription: "",
      tags: [],
      features: [],
      specifications: [],
    },
    status: "ACTIVE",
    showInCatalog: true,
  };
}

export function createEmptyVariant(index = 0, baseData = {}) {
  const initial = getInitialVariantFormData(baseData.store || "");
  const baseSku = baseData.sku ? `${baseData.sku}-V${index + 1}` : initial.sku;

  return {
    ...initial,
    id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    displayName: "",
    images: [],
    sku: baseSku,
    barcode: "",
    options: [],
    mrp: "",
    sellingPrice: "",
    basePrice: "",
    purchasePrice: "",
    stock: "",
    uom: baseData.uom || initial.uom,
    status: baseData.status || initial.status,
    showInCatalog: baseData.showInCatalog ?? initial.showInCatalog,
    gstInfo: {
      ...initial.gstInfo,
      hsnCode: baseData.gstInfo?.hsnCode || initial.gstInfo?.hsnCode || "",
    },
  };
}

function resolveCategoryId(category) {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category._id ?? category.id ?? "";
}

function buildGstPayload(rawGstInfo = {}) {
  const result = {};
  if (rawGstInfo.hsnCode != null && rawGstInfo.hsnCode !== "") {
    result.hsnCode = String(rawGstInfo.hsnCode).trim();
  }
  if (rawGstInfo.isGstIncluded != null) {
    result.isGstIncluded = Boolean(rawGstInfo.isGstIncluded);
  }
  if (rawGstInfo.gstRate != null && rawGstInfo.gstRate !== "") {
    result.gstRate = Number(rawGstInfo.gstRate);
  }
  return result;
}

export function validateProductForm(formData = {}, storeId = null) {
  const fields = {};

  if (!storeId && !formData.store) {
    fields.store = "Valid store is required.";
  }

  if (!formData.name?.trim()) {
    fields.name = "Product name is required.";
  }

  if (!formData.category) {
    fields.category = "Product category is required.";
  }

  if (
    formData.mrp == null ||
    formData.mrp === "" ||
    Number.isNaN(Number(formData.mrp)) ||
    Number(formData.mrp) < 0
  ) {
    fields.mrp = "MRP is required.";
  }

  if (
    formData.sellingPrice == null ||
    formData.sellingPrice === "" ||
    Number.isNaN(Number(formData.sellingPrice)) ||
    Number(formData.sellingPrice) < 0
  ) {
    fields.sellingPrice = "Selling price is required.";
  }

  const mrp = Number(formData.mrp);
  const sellingPrice = Number(formData.sellingPrice);
  if (!Number.isNaN(mrp) && !Number.isNaN(sellingPrice) && sellingPrice > mrp) {
    fields.sellingPrice = "Selling price cannot exceed MRP.";
  }

  if (formData.sku != null && String(formData.sku).trim()) {
    const sku = normalizeSkuValue(formData.sku);
    if (!/^[A-Z0-9-]+$/.test(sku)) {
      fields.sku =
        "SKU must contain only uppercase letters, numbers, and hyphens.";
    }
  }

  return {
    fields,
    isValid: Object.keys(fields).length === 0,
  };
}

export function validateVariants(variants = [], baseFormData = {}) {
  if (!Array.isArray(variants) || variants.length === 0) {
    return { isValid: true };
  }

  const baseMrp = parseFloat(baseFormData.mrp) || 0;
  const baseSp = parseFloat(baseFormData.sellingPrice) || 0;

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const vMrp = parseFloat(v.mrp) || baseMrp;
    const vSp = parseFloat(v.sellingPrice) || baseSp;

    if (vSp > vMrp && vMrp > 0) {
      return {
        isValid: false,
        error: `Variant #${i + 2} selling price cannot exceed MRP.`,
        index: i,
      };
    }
  }

  return { isValid: true };
}

/**
 * Builds the canonical unified product payload for both Store (online) and Desktop (offline/sync).
 * Seamlessly handles single product (auto-creates 1 default variant) and multi-variant product.
 */
export function buildUnifiedProductPayload({
  formData = {},
  variants = [],
  hasVariants = false,
} = {}) {
  const discount = computeDiscount(
    formData.mrp,
    formData.sellingPrice,
    formData.discount
  );
  const store = formData.store ?? formData.storeId;
  const categoryId = resolveCategoryId(formData.category) || formData.category || "";

  const images = (formData.images ?? [])
    .map((img) => {
      if (typeof img === "string") return img;
      if (img && typeof img === "object" && img.url) return img.url;
      if (img instanceof File && img.uploadedUrl) return img.uploadedUrl;
      return null;
    })
    .filter(Boolean);

  const gstInfo = buildGstPayload(formData.gstInfo ?? {});

  const specifications = Array.isArray(formData.specifications)
    ? formData.specifications
    : Array.isArray(formData.content?.specifications)
      ? formData.content.specifications
      : [];

  const basePrice = toNumber(
    formData.basePrice ??
      formData.purchasePrice ??
      formData.openingStock?.purchasePrice
  );

  const mrp = toNumber(formData.mrp);
  const sellingPrice = toNumber(formData.sellingPrice);
  const uom = formData.uom ?? "PCS";
  const rawSku = String(formData.sku ?? "").trim();
  const sku = rawSku ? normalizeSkuValue(rawSku) : undefined;
  const rawBarcode = String(formData.barcode ?? "").trim();
  const barcode = rawBarcode || undefined;

  let mappedVariants = [];

  if (hasVariants) {
    // 1. Primary Variant (from Section 1 Basic Info & Section 2 Pricing & Inventory)
    const primaryDisplayName =
      String(formData.displayName || "").trim() ||
      (formData.name ? `${formData.name} - Variant 1` : "Variant 1");

    const primaryVariantImages = (formData.variantImages ?? [])
      .map((img) => {
        if (typeof img === "string") return img;
        if (img && typeof img === "object" && img.url) return img.url;
        if (img instanceof File && img.uploadedUrl) return img.uploadedUrl;
        return null;
      })
      .filter(Boolean);

    const defaultImages =
      primaryVariantImages.length > 0
        ? primaryVariantImages
        : images.length > 0
          ? images
          : [];
    const defaultStockQty =
      toNumber(
        formData.stockQuantity ?? formData.stock ?? formData.openingStock?.quantity
      ) ?? 0;
    const defaultPurchasePrice =
      toNumber(
        basePrice ?? formData.purchasePrice ?? formData.openingStock?.purchasePrice
      ) ?? 0;
    const defaultSupplier =
      formData.supplierId ?? formData.openingStock?.supplier ?? null;

    const primaryCleanOptions = (formData.options || [])
      .filter((o) => o?.name?.trim() && o?.value?.trim())
      .map((o) => ({ name: o.name.trim(), value: o.value.trim() }));

    const primaryVariant = {
      displayName: primaryDisplayName,
      images: defaultImages,
      sellingPrice: sellingPrice ?? 0,
      mrp: mrp ?? 0,
      discount: discount ?? 0,
      showInCatalog: formData.showInCatalog !== false,
      sortOrder: 0,
      status: formData.status || "ACTIVE",
      ...(primaryCleanOptions.length > 0 ? { options: primaryCleanOptions } : {}),
      stock:
        defaultStockQty > 0
          ? {
              stock: defaultStockQty,
              purchasePrice: defaultPurchasePrice >= 0 ? defaultPurchasePrice : 0,
              ...(defaultSupplier ? { supplier: defaultSupplier } : {}),
            }
          : null,
    };

    if (sku) primaryVariant.sku = sku;
    if (barcode) primaryVariant.barcode = barcode;

    // 2. Additional Variants (from bottom section)
    const additionalVariants = (Array.isArray(variants) ? variants : []).map(
      (v, idx) => {
        const variantImages = (v.images ?? [])
          .map((img) => {
            if (typeof img === "string") return img;
            if (img && typeof img === "object" && img.url) return img.url;
            if (img instanceof File && img.uploadedUrl) return img.uploadedUrl;
            return null;
          })
          .filter(Boolean);

        const finalVariantImages =
          variantImages.length > 0 ? variantImages : images;

        const cleanOptions = (v.options || [])
          .filter((o) => o?.name?.trim() && o?.value?.trim())
          .map((o) => ({ name: o.name.trim(), value: o.value.trim() }));

        const autoOptionLabel = cleanOptions.map((o) => o.value).join(" / ");
        const fallbackDisplayName = autoOptionLabel
          ? `${formData.name || "Product"} - ${autoOptionLabel}`
          : `${formData.name || "Product"} - Variant ${idx + 2}`;

        const vDisplayName =
          String(v.displayName || "").trim() || fallbackDisplayName;

        const vMrp = toNumber(v.mrp) ?? 0;
        const vSellingPrice = toNumber(v.sellingPrice) ?? 0;
        const vDiscount = computeDiscount(vMrp, vSellingPrice, v.discount);

        const rawVSku = String(v.sku || "").trim();
        const vSku = rawVSku ? normalizeSkuValue(rawVSku) : undefined;
        const vBarcode = v.barcode ? String(v.barcode).trim() : undefined;

        const vStockQty =
          toNumber(
            v.stock?.stock ?? v.stock ?? v.openingStock?.quantity
          ) ?? 0;
        const vPurchasePrice =
          toNumber(
            v.stock?.purchasePrice ?? v.purchasePrice ?? v.basePrice
          ) ?? 0;
        const vSupplier =
          v.stock?.supplier ??
          v.supplierId ??
          v.supplier ??
          formData.supplierId ??
          formData.openingStock?.supplier ??
          null;

        const variantItem = {
          displayName: vDisplayName,
          images: finalVariantImages,
          sellingPrice: vSellingPrice,
          mrp: vMrp,
          discount: vDiscount,
          showInCatalog: v.showInCatalog !== false,
          sortOrder: idx + 1,
          status: v.status || "ACTIVE",
          stock:
            vStockQty > 0
              ? {
                  stock: vStockQty,
                  purchasePrice: vPurchasePrice >= 0 ? vPurchasePrice : 0,
                  ...(vSupplier ? { supplier: vSupplier } : {}),
                }
              : null,
        };

        if (vSku) variantItem.sku = vSku;
        if (vBarcode) variantItem.barcode = vBarcode;
        if (cleanOptions.length > 0) variantItem.options = cleanOptions;

        return variantItem;
      }
    );

    mappedVariants = [primaryVariant, ...additionalVariants];
  } else {
    // Single variant mode: 1 default variant with isDefault: true
    const defaultDisplayName =
      String(formData.name || "").trim() || "Product";
    const defaultImages = images.length > 0 ? images : [];
    const defaultStockQty =
      toNumber(
        formData.stockQuantity ?? formData.stock ?? formData.openingStock?.quantity
      ) ?? 0;
    const defaultPurchasePrice =
      toNumber(
        basePrice ?? formData.purchasePrice ?? formData.openingStock?.purchasePrice
      ) ?? 0;
    const defaultSupplier =
      formData.supplierId ?? formData.openingStock?.supplier ?? null;

    const singleVariant = {
      displayName: defaultDisplayName,
      images: defaultImages,
      sellingPrice: sellingPrice ?? 0,
      mrp: mrp ?? 0,
      isDefault: true,
      discount: discount ?? 0,
      showInCatalog: formData.showInCatalog !== false,
      sortOrder: 0,
      status: formData.status || "ACTIVE",
      stock:
        defaultStockQty > 0
          ? {
              stock: defaultStockQty,
              purchasePrice: defaultPurchasePrice >= 0 ? defaultPurchasePrice : 0,
              ...(defaultSupplier ? { supplier: defaultSupplier } : {}),
            }
          : null,
    };

    if (sku) singleVariant.sku = sku;
    if (barcode) singleVariant.barcode = barcode;

    mappedVariants = [singleVariant];
  }

  const payload = {
    name: formData.name || "",
    brandId: formData.brandId || null,
    categoryId,
    category: categoryId,
    store,
    productType: formData.productType || "GOODS",
    bestSeller: Boolean(formData.bestSeller),
    content: {
      shortDescription: formData.content?.shortDescription || "",
      longDescription: formData.content?.longDescription || "",
      tags: formData.content?.tags || [],
      features: formData.content?.features || [],
    },
    currency: formData.currency || "INR",
    featured: Boolean(formData.featured),
    newArrival: Boolean(formData.newArrival),
    specifications,
    status: formData.status || "ACTIVE",
    uom,
    images: images.length > 0 ? images : [],
    gstInfo,
    variants: mappedVariants,
  };

  return payload;
}

