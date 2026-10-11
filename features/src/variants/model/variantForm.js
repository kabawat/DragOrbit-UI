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

/**
 * Persist uploaded image URLs against a newly created variant.
 * Call after createVariant succeeds while form still holds storage URLs.
 */
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
