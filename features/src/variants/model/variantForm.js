/**
 * Variant form helpers — aligned with POST/PUT /retailer/variant API.
 */

export function getInitialVariantFormData(storeId = "") {
	return {
		store: storeId,
		product: "",
		displayName: "",
		sku: "",
		barcode: "",
		options: [],
		mrp: "",
		sellingPrice: "",
		discount: "",
		uom: "PCS",
		gstInfo: {
			hsnCode: "",
		},
		status: "ACTIVE",
		isDefault: false,
		sortOrder: 0,
		showInCatalog: true,
		weight: "",
		dimensions: {
			length: "",
			width: "",
			height: "",
			unit: "cm",
		},
		images: [],
	};
}

export function normalizeVariantRecord(variant = {}) {
	const productId =
		typeof variant.product === "object"
			? (variant.product?.id ?? variant.product?._id ?? "")
			: (variant.product ?? "");

	const productName =
		typeof variant.product === "object" ? (variant.product?.name ?? "") : "";

	return {
		...getInitialVariantFormData(variant.store ?? ""),
		id: variant.id ?? variant._id ?? null,
		product: productId,
		productName,
		displayName: variant.displayName ?? "",
		sku: variant.sku ?? "",
		barcode: variant.barcode ?? "",
		options: Array.isArray(variant.options)
			? variant.options.map((o) => ({
				name: o?.name ?? "",
				value: o?.value ?? "",
			}))
			: [],
		mrp: variant.mrp ?? "",
		sellingPrice: variant.sellingPrice ?? "",
		discount: variant.discount ?? "",
		uom: variant.uom || "PCS",
		gstInfo: {
			hsnCode: variant.gstInfo?.hsnCode ?? "",
		},
		status: variant.status || "ACTIVE",
		isDefault: variant.isDefault === true,
		sortOrder: variant.sortOrder ?? 0,
		showInCatalog: variant.showInCatalog !== false,
		weight: variant.weight ?? "",
		dimensions: {
			length: variant.dimensions?.length ?? "",
			width: variant.dimensions?.width ?? "",
			height: variant.dimensions?.height ?? "",
			unit: variant.dimensions?.unit || "cm",
		},
		images: Array.isArray(variant.images) ? variant.images : [],
		price: variant.price,
		gstAmount: variant.gstAmount,
	};
}

export function validateVariantForm(formData, { requireProduct = true } = {}) {
	const errors = {};

	if (requireProduct && !formData.product) {
		errors.product = "Product is required";
	}

	if (formData.mrp === "" || formData.mrp == null) {
		errors.mrp = "MRP is required";
	} else if (
		Number.isNaN(parseFloat(formData.mrp)) ||
		parseFloat(formData.mrp) < 0
	) {
		errors.mrp = "MRP must be a non-negative number";
	}

	if (formData.sellingPrice === "" || formData.sellingPrice == null) {
		errors.sellingPrice = "Selling price is required";
	} else if (
		Number.isNaN(parseFloat(formData.sellingPrice)) ||
		parseFloat(formData.sellingPrice) < 0
	) {
		errors.sellingPrice = "Selling price must be a non-negative number";
	}

	const mrp = parseFloat(formData.mrp);
	const sellingPrice = parseFloat(formData.sellingPrice);
	if (!Number.isNaN(mrp) && !Number.isNaN(sellingPrice) && sellingPrice > mrp) {
		errors.sellingPrice = "Selling price cannot exceed MRP";
	}

	return errors;
}

function toOptionalNumber(value) {
	if (value === "" || value == null) return undefined;
	const n = parseFloat(value);
	return Number.isNaN(n) ? undefined : n;
}

function toOptionalInt(value) {
	if (value === "" || value == null) return undefined;
	const n = parseInt(value, 10);
	return Number.isNaN(n) ? undefined : n;
}

/**
 * Build API create/update body from form state.
 */
export function buildVariantPayload(formData, { includeProduct = true } = {}) {
	const payload = {
		displayName: formData.displayName?.trim() || undefined,
		sku: formData.sku?.trim() || undefined,
		barcode: formData.barcode?.trim() || undefined,
		mrp: parseFloat(formData.mrp),
		sellingPrice: parseFloat(formData.sellingPrice),
		uom: formData.uom || "PCS",
		status: formData.status || "ACTIVE",
		isDefault: formData.isDefault === true,
		showInCatalog: formData.showInCatalog !== false,
	};

	if (includeProduct && formData.product) {
		payload.product = formData.product;
	}

	const discount = toOptionalNumber(formData.discount);
	if (discount != null) payload.discount = discount;

	const sortOrder = toOptionalInt(formData.sortOrder);
	if (sortOrder != null) payload.sortOrder = sortOrder;

	const weight = toOptionalNumber(formData.weight);
	if (weight != null) payload.weight = weight;

	const options = (formData.options || [])
		.filter((o) => o?.name?.trim() && o?.value?.trim())
		.map((o) => ({ name: o.name.trim(), value: o.value.trim() }));
	if (options.length) payload.options = options;

	const hsnCode = formData.gstInfo?.hsnCode?.trim();
	if (hsnCode) {
		payload.gstInfo = { hsnCode };
	}

	const length = toOptionalNumber(formData.dimensions?.length);
	const width = toOptionalNumber(formData.dimensions?.width);
	const height = toOptionalNumber(formData.dimensions?.height);
	if (length != null || width != null || height != null) {
		payload.dimensions = {
			length: length ?? 0,
			width: width ?? 0,
			height: height ?? 0,
			unit: formData.dimensions?.unit || "cm",
		};
	}

	return payload;
}

export function unwrapVariantList(data) {
	if (Array.isArray(data)) return data;
	if (Array.isArray(data?.data)) return data.data;
	if (Array.isArray(data?.variants)) return data.variants;
	return [];
}

export function unwrapVariantRecord(data) {
	if (!data) return null;
	if (data.id || data._id) return data;
	if (data.data && (data.data.id || data.data._id)) return data.data;
	if (Array.isArray(data.data)) return data.data[0] ?? null;
	if (Array.isArray(data)) return data[0] ?? null;
	return data;
}

/** Normalize GET /retailer/product/image list into formData.images shape. */
export function mapImageRecords(payload) {
	const list = Array.isArray(payload)
		? payload
		: Array.isArray(payload?.data)
			? payload.data
			: Array.isArray(payload?.images)
				? payload.images
				: [];

	return list
		.map((img) => ({
			id: img.id ?? img._id ?? undefined,
			url: typeof img === "string" ? img : img.url,
			isPrimary: img.isPrimary === true,
		}))
		.filter((img) => Boolean(img.url));
}

/** Extract public URLs from formData.images (strings, File.uploadedUrl, or {url}). */
export function extractImageUrls(images = []) {
	return images
		.map((img) => {
			if (typeof img === "string") return img.trim() || null;
			if (img instanceof File) return img.uploadedUrl || null;
			return img?.url || img?.uploadedUrl || null;
		})
		.filter(Boolean);
}

export async function syncVariantImagesAfterCreate({
	variantId,
	images,
	storeId,
	saveProductImage,
}) {
	if (!variantId || !storeId || typeof saveProductImage !== "function") return;
	const urls = extractImageUrls(images);
	for (let i = 0; i < urls.length; i++) {
		await saveProductImage({
			entityId: variantId,
			entityType: "Variant",
			url: urls[i],
			store: storeId,
			isPrimary: i === 0,
		});
	}
}

export function variantDisplayLabel(variant) {
	if (!variant) return "—";
	return (
		variant.displayName ||
		variant.sku ||
		variant.product?.name ||
		variant.productName ||
		"Variant"
	);
}

export const MAX_VARIANTS_PER_BATCH = 5;

export function computeDiscount(mrp, sellingPrice, fallbackDiscount) {
	const numMrp = Number(mrp);
	const numSp = Number(sellingPrice);
	if (
		Number.isFinite(numMrp) &&
		Number.isFinite(numSp) &&
		numMrp > 0 &&
		numSp <= numMrp
	) {
		const rawDiscount = ((numMrp - numSp) / numMrp) * 100;
		return Number(rawDiscount.toFixed(2));
	}
	const numFallback = Number(fallbackDiscount);
	return Number.isFinite(numFallback) ? numFallback : 0;
}

export function createEmptyBatchVariant(index = 0, defaultValues = {}) {
	const baseSku = defaultValues.sku ? `${defaultValues.sku}-V${index + 1}` : "";
	return {
		id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
		displayName: "",
		sku: baseSku,
		barcode: "",
		mrp: defaultValues.mrp ?? "",
		sellingPrice: defaultValues.sellingPrice ?? "",
		discount: defaultValues.discount ?? "",
		stock: "",
		purchasePrice: "",
		supplierId: defaultValues.supplierId || "",
		status: "ACTIVE",
		showInCatalog: true,
		sortOrder: index,
		options: [],
		images: [],
	};
}

export function buildBatchVariantsPayload({
	store = "",
	product = "",
	variants = [],
} = {}) {
	const resolvedProductId =
		typeof product === "object"
			? (product?.id ?? product?._id ?? "")
			: String(product || "").trim();

	const resolvedStoreId =
		typeof store === "object"
			? (store?.storeId ?? store?.id ?? store?._id ?? "")
			: String(store || "").trim();

	const mappedVariants = (Array.isArray(variants) ? variants : [])
		.slice(0, MAX_VARIANTS_PER_BATCH)
		.map((v, idx) => {
			const mrp = parseFloat(v.mrp) || 0;
			const sellingPrice = parseFloat(v.sellingPrice) || 0;
			const discount = computeDiscount(mrp, sellingPrice, v.discount);

			const rawSku = String(v.sku || "").trim();
			const sku = rawSku ? rawSku.toUpperCase() : undefined;
			const rawBarcode = String(v.barcode || "").trim();
			const barcode = rawBarcode || undefined;

			const rawStock = v.stockQuantity ?? v.stock?.stock ?? v.stock;
			const stockNum =
				rawStock !== "" && rawStock != null ? Number(rawStock) : 0;

			const purchasePrice =
				v.stock?.purchasePrice != null && v.stock?.purchasePrice !== ""
					? Number(v.stock.purchasePrice)
					: v.purchasePrice != null && v.purchasePrice !== ""
						? Number(v.purchasePrice)
						: v.basePrice != null && v.basePrice !== ""
							? Number(v.basePrice)
							: 0;

			const supplier =
				v.stock?.supplier ??
				v.supplierId ??
				v.supplier ??
				null;

			const stockObject =
				stockNum > 0
					? {
						stock: stockNum,
						purchasePrice: purchasePrice >= 0 ? purchasePrice : 0,
						...(supplier ? { supplier } : {}),
					}
					: null;

			const variantItem = {
				displayName: String(v.displayName || "").trim(),
				mrp,
				sellingPrice,
				showInCatalog: v.showInCatalog !== false,
				sortOrder: idx,
				status: v.status || "ACTIVE",
				discount,
				stock: stockObject,
			};

			if (sku) variantItem.sku = sku;
			if (barcode) variantItem.barcode = barcode;

			const options = (v.options || [])
				.filter((o) => o?.name?.trim() && o?.value?.trim())
				.map((o) => ({ name: o.name.trim(), value: o.value.trim() }));
			if (options.length > 0) {
				variantItem.options = options;
			}

			if (Array.isArray(v.images) && v.images.length > 0) {
				variantItem.images = v.images
					.map((img) => (typeof img === "string" ? img : img?.url))
					.filter(Boolean);
			}

			return variantItem;
		});

	return {
		store: resolvedStoreId,
		product: resolvedProductId,
		variants: mappedVariants,
	};
}

export function validateBatchVariants({ product = "", variants = [] } = {}) {
	const errors = {};
	const variantErrors = [];

	const resolvedProductId =
		typeof product === "object"
			? (product?.id ?? product?._id ?? "")
			: String(product || "").trim();

	if (!resolvedProductId) {
		errors.product = "Product is required";
	}

	if (!Array.isArray(variants) || variants.length === 0) {
		errors.variants = "At least 1 variant is required";
		return { isValid: false, errors, variantErrors };
	}

	if (variants.length > MAX_VARIANTS_PER_BATCH) {
		errors.variants = `Maximum ${MAX_VARIANTS_PER_BATCH} variants can be created at a time`;
	}

	const seenSkus = new Set();
	const seenBarcodes = new Set();

	variants.forEach((v, idx) => {
		const vErr = {};

		if (!v.displayName?.trim()) {
			vErr.displayName = "Variant Name is required";
		}

		if (v.mrp === "" || v.mrp == null) {
			vErr.mrp = "MRP is required";
		} else if (Number.isNaN(parseFloat(v.mrp)) || parseFloat(v.mrp) < 0) {
			vErr.mrp = "MRP must be a non-negative number";
		}

		if (v.sellingPrice === "" || v.sellingPrice == null) {
			vErr.sellingPrice = "Selling price is required";
		} else if (
			Number.isNaN(parseFloat(v.sellingPrice)) ||
			parseFloat(v.sellingPrice) < 0
		) {
			vErr.sellingPrice = "Selling price must be a non-negative number";
		}

		const mrp = parseFloat(v.mrp);
		const sp = parseFloat(v.sellingPrice);
		if (!Number.isNaN(mrp) && !Number.isNaN(sp) && sp > mrp) {
			vErr.sellingPrice = "Selling price cannot exceed MRP";
		}

		const sku = String(v.sku || "").trim().toUpperCase();
		if (sku) {
			if (seenSkus.has(sku)) {
				vErr.sku = `Duplicate SKU "${sku}" within batch`;
			} else {
				seenSkus.add(sku);
			}
		}

		const barcode = String(v.barcode || "").trim();
		if (barcode) {
			if (seenBarcodes.has(barcode)) {
				vErr.barcode = `Duplicate Barcode "${barcode}" within batch`;
			} else {
				seenBarcodes.add(barcode);
			}
		}

		variantErrors.push(vErr);
		if (Object.keys(vErr).length > 0) {
			errors[`variant_${idx}`] = vErr;
		}
	});

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
		variantErrors,
	};
}

