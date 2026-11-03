"use client";

import { Badge, Button } from "@dragorbit/ui";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  IndianRupee,
  MoreVertical,
  Package,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Tag,
  Trash2,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function extractProductRecord(raw) {
  if (!raw) return null;
  let data = raw;
  if (data.data !== undefined) {
    data = data.data;
  }
  if (data && typeof data === "object" && data.data !== undefined) {
    data = data.data;
  }
  if (Array.isArray(data)) {
    return data[0] || null;
  }
  return data || null;
}

function formatDateTime(dateVal, momentFn) {
  if (!dateVal) return "N/A";
  if (momentFn && typeof momentFn === "function") {
    try {
      return momentFn(dateVal).format("DD MMM YYYY");
    } catch {
      // fallback to native Date
    }
  }
  try {
    const d = new Date(dateVal);
    if (Number.isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateVal);
  }
}

function buildCompleteProduct(detailed, preview) {
  if (!detailed && !preview) return null;
  const base = preview || {};
  const full = detailed || {};

  const pricing = full.pricing || {};
  const gstInfo = full.gstInfo || {};

  // Variant list
  const variants =
    Array.isArray(full.variants) && full.variants.length > 0
      ? full.variants
      : Array.isArray(base.variants)
        ? base.variants
        : [];
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
  const hasMultipleVariants =
    full.hasMultipleVariants !== undefined
      ? Boolean(full.hasMultipleVariants)
      : base.hasMultipleVariants !== undefined
        ? Boolean(base.hasMultipleVariants)
        : variants.length > 1;

  const totalVariantsStock =
    variants.length > 0
      ? variants.reduce(
          (sum, v) =>
            sum +
            Number(
              v.stock ??
                v.inventory?.availableQuantity ??
                v.inventory?.totalQuantity ??
                v.stockQuantity ??
                0
            ),
          0
        )
      : undefined;

  // Multi-variant pricing ranges
  const variantPrices = variants
    .map((v) => Number(v.sellingPrice))
    .filter((p) => !isNaN(p) && p > 0);
  const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
  const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : minPrice;

  const variantMrps = variants
    .map((v) => Number(v.mrp))
    .filter((m) => !isNaN(m) && m > 0);
  const minMrp = variantMrps.length > 0 ? Math.min(...variantMrps) : 0;
  const maxMrp = variantMrps.length > 0 ? Math.max(...variantMrps) : minMrp;

  const variantCosts = variants
    .map((v) => Number(v.stock?.purchasePrice ?? v.purchasePrice ?? v.basePrice ?? 0))
    .filter((c) => !isNaN(c) && c > 0);
  const minCost = variantCosts.length > 0 ? Math.min(...variantCosts) : 0;
  const maxCost = variantCosts.length > 0 ? Math.max(...variantCosts) : minCost;

  let sellingPrice, mrp, basePrice, stock, sku, barcode;

  if (hasMultipleVariants) {
    sellingPrice = minPrice;
    mrp = maxMrp;
    basePrice = minCost;
    stock = totalVariantsStock !== undefined ? totalVariantsStock : (Number(full.stock) || 0);
    sku = "Multiple SKUs";
    barcode = "";
  } else {
    // Single / Default Product: use default variant details
    sellingPrice =
      (full.sellingPrice !== undefined && full.sellingPrice !== "" && Number(full.sellingPrice) > 0 ? full.sellingPrice : undefined) ??
      (pricing.sellingPrice !== undefined && pricing.sellingPrice !== "" && Number(pricing.sellingPrice) > 0 ? pricing.sellingPrice : undefined) ??
      (defaultVariant?.sellingPrice !== undefined && defaultVariant?.sellingPrice !== "" && Number(defaultVariant?.sellingPrice) > 0 ? defaultVariant?.sellingPrice : undefined) ??
      (base.sellingPrice !== undefined && base.sellingPrice !== "" && Number(base.sellingPrice) > 0 ? base.sellingPrice : undefined) ??
      0;

    mrp =
      (full.mrp !== undefined && full.mrp !== "" && Number(full.mrp) > 0 ? full.mrp : undefined) ??
      (pricing.mrp !== undefined && pricing.mrp !== "" && Number(pricing.mrp) > 0 ? pricing.mrp : undefined) ??
      (defaultVariant?.mrp !== undefined && defaultVariant?.mrp !== "" && Number(defaultVariant?.mrp) > 0 ? defaultVariant?.mrp : undefined) ??
      (base.mrp !== undefined && base.mrp !== "" && Number(base.mrp) > 0 ? base.mrp : undefined) ??
      0;

    basePrice =
      (full.basePrice !== undefined && full.basePrice !== "" && Number(full.basePrice) > 0 ? full.basePrice : undefined) ??
      (full.purchasePrice !== undefined && full.purchasePrice !== "" && Number(full.purchasePrice) > 0 ? full.purchasePrice : undefined) ??
      (defaultVariant?.stock?.purchasePrice !== undefined && Number(defaultVariant?.stock?.purchasePrice) > 0 ? defaultVariant?.stock?.purchasePrice : undefined) ??
      (defaultVariant?.purchasePrice !== undefined && Number(defaultVariant?.purchasePrice) > 0 ? defaultVariant?.purchasePrice : undefined) ??
      (defaultVariant?.basePrice !== undefined && Number(defaultVariant?.basePrice) > 0 ? defaultVariant?.basePrice : undefined) ??
      (base.basePrice !== undefined && Number(base.basePrice) > 0 ? base.basePrice : undefined) ??
      0;

    stock =
      (full.stock !== undefined && full.stock !== "" && Number(full.stock) > 0 ? Number(full.stock) : undefined) ??
      (defaultVariant?.stock?.stock !== undefined ? Number(defaultVariant.stock.stock) : undefined) ??
      (defaultVariant?.stock !== undefined && Number(defaultVariant.stock) > 0 ? Number(defaultVariant.stock) : undefined) ??
      (defaultVariant?.inventory?.availableQuantity !== undefined ? Number(defaultVariant.inventory.availableQuantity) : undefined) ??
      (base.stock !== undefined ? Number(base.stock) : undefined) ??
      0;

    sku = full.sku || defaultVariant?.sku || base.sku || "";
    barcode = full.barcode || defaultVariant?.barcode || base.barcode || "";
  }

  const uom = full.uom || pricing.uom || defaultVariant?.uom || base.uom || "PCS";
  const discount = full.discount ?? pricing.discount ?? defaultVariant?.discount ?? base.discount ?? 0;
  const hsnCode = full.hsnCode || full.hsn || gstInfo.hsnCode || base.hsnCode || base.hsn || "";
  const gstRate = full.gstRate ?? full.taxRate ?? full.gst ?? gstInfo.gstRate ?? base.gstRate ?? base.taxRate ?? base.gst ?? 0;
  const isGstIncluded = full.isTaxInclusive ?? full.isGstIncluded ?? gstInfo.isGstIncluded ?? base.isGstIncluded ?? base.isTaxInclusive ?? false;

  return {
    ...base,
    ...full,
    id: full.id || full._id || base.id || base._id,
    name: full.name || base.name || "",
    brand: full.brand || base.brand || "",
    category: full.category || base.category || null,
    hasMultipleVariants,
    priceRange: { min: minPrice, max: maxPrice },
    mrpRange: { min: minMrp, max: maxMrp },
    costRange: { min: minCost, max: maxCost },
    sellingPrice,
    mrp,
    basePrice,
    purchasePrice: basePrice,
    stock,
    sku,
    barcode,
    uom,
    discount,
    hsnCode,
    hsn: hsnCode,
    gstRate,
    taxRate: gstRate,
    isGstIncluded,
    isTaxInclusive: isGstIncluded,
    variants: hasMultipleVariants ? variants : [],
    timestamps: full.timestamps || base.timestamps,
    createdAt: full.createdAt || full.timestamps?.createdAt || base.createdAt,
    updatedAt: full.updatedAt || full.timestamps?.updatedAt || base.updatedAt,
  };
}

export function ProductMasterDetailView({
  initialProductId = null,
  products = [],
  rawProducts = [],
  isLoading = false,
  isFetchingMore = false,
  pagination = {},
  sentinelRef = null,
  canEdit = false,
  canDelete = false,
  onStockIn,
  onEdit,
  onDelete,
  onViewDetails,
  onViewVariants,
  onCreate,
  onSelectProduct,
  storeId = "",
  selectedStore = null,
  t = (key, fallback) => fallback || key,
  moment: momentProp = null,
  onFetchDetails = null,
  productService = null,
  onDownloadPDF = null,
  PrintTemplate = null,
  containerHeight = "calc(100vh - 195px)",
  // Modals
  StockInDrawer = null,
  showStockInDrawer = false,
  handleCloseStockInDrawer = null,
  productForStockIn = null,
  handleStockInSuccess = null,
  ProductDeleteConfirmModal = null,
  productToDelete = null,
  handleDeleteClose = null,
  handleDeleteSuccess = null,
  ProductDeleteSuccessModal = null,
  showDeleteSuccessModal = false,
  setShowDeleteSuccessModal = null,
  deletedProductName = "",
  ProductErrorModal = null,
  showErrorModal = false,
  setShowErrorModal = null,
  errorDetails = null,
}) {
  // State
  const [selectedProductId, setSelectedProductId] = useState(
    initialProductId || products[0]?.id || null
  );
  const [localSearch, setLocalSearch] = useState("");
  const [productData, setProductData] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [openRowMenuId, setOpenRowMenuId] = useState(null);
  const [showMobileDetail, setShowMobileDetail] = useState(
    Boolean(initialProductId)
  );

  // Navigate to variants page / view variant
  const handleNavigateToVariants = useCallback(
    (variantId = null) => {
      if (onViewVariants) {
        onViewVariants(productData, variantId);
        return;
      }
      if (typeof window !== "undefined") {
        const isDashboard = window.location.pathname.includes("/dashboard");
        if (variantId) {
          window.location.href = isDashboard
            ? `/dashboard/variants/view/${variantId}`
            : `/variants/${variantId}`;
        } else {
          window.location.href = isDashboard
            ? "/dashboard/variants"
            : "/variants";
        }
      }
    },
    [onViewVariants, productData]
  );

  // Tracking refs
  const rowMenuRef = useRef(null);
  const lastInitialIdRef = useRef(initialProductId);
  const userSelectedRef = useRef(false);
  const productsRef = useRef(products);
  productsRef.current = products;
  const activeFetchIdRef = useRef(0);

  // Close row menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rowMenuRef.current && !rowMenuRef.current.contains(event.target)) {
        setOpenRowMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected product only when initialProductId changes externally
  useEffect(() => {
    if (initialProductId && initialProductId !== lastInitialIdRef.current) {
      lastInitialIdRef.current = initialProductId;
      setSelectedProductId(initialProductId);
      setShowMobileDetail(true);
    }
  }, [initialProductId]);

  // Initial auto-selection when products load and user has not manually selected
  useEffect(() => {
    if (!selectedProductId && products.length > 0 && !userSelectedRef.current) {
      const first = products[0];
      const defaultId = initialProductId || first?.id || first?._id;
      if (defaultId) {
        setSelectedProductId(defaultId);
        lastInitialIdRef.current = defaultId;
      }
    }
  }, [products, selectedProductId, initialProductId]);

  // If currently selected product was deleted or no longer exists, fallback to first
  useEffect(() => {
    if (selectedProductId && products.length > 0) {
      const exists = products.some(
        (p) => String(p.id || p._id) === String(selectedProductId)
      );
      if (!exists) {
        const first = products[0];
        setSelectedProductId(first?.id || first?._id);
      }
    }
  }, [products, selectedProductId]);

  // Filter list by local search query
  const filteredProducts = useMemo(() => {
    if (!localSearch.trim()) return products;
    const q = localSearch.toLowerCase().trim();
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      const brand = (p.brand || "").toLowerCase();
      const category = (p.category?.name || p.category || "").toLowerCase();
      return (
        name.includes(q) ||
        sku.includes(q) ||
        brand.includes(q) ||
        category.includes(q)
      );
    });
  }, [products, localSearch]);

  // Fetch full details & variants for the selected product (direct API call)
  const fetchProductFullDetails = useCallback(
    async (prodId) => {
      if (!prodId) return;

      const fetchId = ++activeFetchIdRef.current;
      const idStr = String(prodId);

      // Find preview from list (supports id or _id match)
      const preview = (productsRef.current || []).find(
        (p) => String(p.id || p._id) === idStr
      );

      // Reset productData so dummy / incomplete data is never shown while loading
      setProductData(null);
      setDetailsLoading(true);
      setDetailsError(null);

      // If custom fetch handler is provided
      if (onFetchDetails) {
        try {
          const detailed = await onFetchDetails(prodId);
          if (fetchId !== activeFetchIdRef.current) return;
          const product = extractProductRecord(detailed);
          if (product) {
            const complete = buildCompleteProduct(product, preview);
            setProductData(complete);
            setDetailsError(null);
          } else {
            setDetailsError(
              t("errors.failedToFetchData", {
                item: t("common.product", "Product"),
              }) || "Failed to load product details"
            );
          }
        } catch (err) {
          if (fetchId !== activeFetchIdRef.current) return;
          setDetailsError(
            err?.message ||
              t("errors.failedToFetchData", {
                item: t("common.product", "Product"),
              }) ||
              "Failed to load product details"
          );
        } finally {
          if (fetchId === activeFetchIdRef.current) {
            setDetailsLoading(false);
          }
        }
        return;
      }

      // If productService is provided
      if (productService && storeId) {
        try {
          const rawResult = await productService.getProducts({
            store: storeId,
            id: prodId,
          });
          if (fetchId !== activeFetchIdRef.current) return;

          const product = extractProductRecord(rawResult);

          if (product) {
            const complete = buildCompleteProduct(product, preview);

            setProductData(complete);
            setDetailsError(null);
          } else {
            setDetailsError(
              t("errors.failedToFetchData", {
                item: t("common.product", "Product"),
              }) || "Failed to load product details"
            );
          }
        } catch (err) {
          if (fetchId !== activeFetchIdRef.current) return;
          setDetailsError(
            err?.message ||
              t("errors.failedToFetchData", {
                item: t("common.product", "Product"),
              }) ||
              "Failed to load product details"
          );
        } finally {
          if (fetchId === activeFetchIdRef.current) {
            setDetailsLoading(false);
          }
        }
        return;
      }

      setDetailsLoading(false);
    },
    [onFetchDetails, productService, storeId, t]
  );

  const fetchProductFullDetailsRef = useRef(fetchProductFullDetails);
  fetchProductFullDetailsRef.current = fetchProductFullDetails;

  // Trigger details fetch ONLY when selectedProductId actually changes
  useEffect(() => {
    if (selectedProductId) {
      fetchProductFullDetailsRef.current(selectedProductId);
    }
  }, [selectedProductId]);

  // Handle user selecting a product from list
  const handleSelectProduct = (product) => {
    const prodId = product.id ?? product._id;
    if (!prodId) return;
    userSelectedRef.current = true;
    lastInitialIdRef.current = prodId;
    setSelectedProductId(prodId);
    setShowMobileDetail(true);
    onSelectProduct?.(product);
  };

  // Helper status badges
  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "out_of_stock") {
      return (
        <Badge variant="danger" size="sm">
          <XCircle className="w-3 h-3 mr-1 inline" />
          {t("products.outOfStock", "Out of Stock")}
        </Badge>
      );
    }
    if (s === "published" || s === "active") {
      return (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3 h-3 mr-1 inline" />
          {t("common.active", "Active")}
        </Badge>
      );
    }
    if (s === "inactive" || s === "draft") {
      return (
        <Badge variant="secondary" size="sm">
          <Clock className="w-3 h-3 mr-1 inline" />
          {status || t("common.draft", "Draft")}
        </Badge>
      );
    }
    return (
      <Badge variant="warning" size="sm">
        <AlertTriangle className="w-3 h-3 mr-1 inline" />
        {status || t("common.archived", "Archived")}
      </Badge>
    );
  };

  const getCatalogVisibilityBadge = (showInCatalog) => {
    if (showInCatalog !== false) {
      return (
        <Badge variant="success" size="sm">
          <Eye className="w-3 h-3 mr-1 inline" />
          {t("products.inCatalog", "In Digital Shop")}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" size="sm">
        <XCircle className="w-3 h-3 mr-1 inline" />
        {t("products.hidden", "Hidden")}
      </Badge>
    );
  };

  // Stock status pill for left list
  const renderStockPill = (stock) => {
    const count = Number(stock || 0);
    if (count === 0) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
          0 {t("products.units", "units")}
        </span>
      );
    }
    if (count < 10) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
          {count} {t("products.units", "units")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
        {count} {t("products.units", "units")}
      </span>
    );
  };

  const currentStock = Number(productData?.stock || 0);
  const stockValue =
    productData?.hasMultipleVariants &&
    Array.isArray(productData?.variants) &&
    productData.variants.length > 0
      ? productData.variants.reduce((sum, v) => {
          const vStock = Number(
            v.stock ??
              v.inventory?.availableQuantity ??
              v.inventory?.totalQuantity ??
              v.stockQuantity ??
              0
          );
          const vPrice = Number(
            v.stock?.purchasePrice ??
              v.purchasePrice ??
              v.basePrice ??
              v.sellingPrice ??
              0
          );
          return sum + vStock * vPrice;
        }, 0)
      : currentStock *
        Number(
          productData?.basePrice ||
            productData?.purchasePrice ||
            productData?.sellingPrice ||
            0
        );

  return (
    <>
      {/* Hidden printable template for PDF export */}
      {PrintTemplate && productData && (
        <div
          id="product-details-report-area"
          className="hidden"
          data-variant="light"
          data-theme="default"
        >
          <PrintTemplate
            productData={productData}
            selectedStore={selectedStore}
          />
        </div>
      )}

      {/* Main Split Master-Detail Container */}
      <div
        className="w-full flex flex-col md:flex-row border border-[rgb(var(--color-border-primary))] rounded-xl bg-[rgb(var(--color-bg-primary))] overflow-hidden shadow-sm transition-all"
        style={{ height: containerHeight, minHeight: "560px" }}
      >
        {/* ========================================================= */}
        {/* LEFT COLUMN: PRODUCTS LIST               */}
        {/* ========================================================= */}
        <div
          className={`w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col border-r border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] transition-all ${
            showMobileDetail ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Top Search & Add Product Bar */}
          <div className="p-3 border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[rgb(var(--color-text-secondary))] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={`${t("common.search", "Search")}...`}
                className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-secondary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))]"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List Column Header (Vyapar inspired: ITEM | QUANTITY) */}
          <div className="px-4 py-2.5 bg-[rgb(var(--color-bg-secondary))]/60 border-b border-[rgb(var(--color-border-primary))] flex justify-between items-center text-[11px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span>{t("products.product", "Item")}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-primary))] font-mono">
                {filteredProducts.length}
              </span>
            </div>
            <div className="text-right">
              <span>{t("products.stock", "Stock / Price")}</span>
            </div>
          </div>

          {/* Scrollable Products List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[rgb(var(--color-border-primary))]/40">
            {isLoading && products.length === 0 ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[rgb(var(--color-bg-secondary))]/50 animate-pulse flex justify-between"
                  >
                    <div className="space-y-2 w-3/5">
                      <div className="h-3.5 bg-[rgb(var(--color-border-primary))] rounded w-4/5" />
                      <div className="h-2.5 bg-[rgb(var(--color-border-primary))]/60 rounded w-1/2" />
                    </div>
                    <div className="h-4 bg-[rgb(var(--color-border-primary))] rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-[rgb(var(--color-text-secondary))] flex flex-col items-center justify-center h-full">
                <Package className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm font-medium">
                  {localSearch
                    ? t(
                        "products.noResultsDescription",
                        "No products match your search."
                      )
                    : t("products.noProducts", "No products found")}
                </p>
                {canEdit && !localSearch && onCreate && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3"
                    onClick={onCreate}
                    leftIcon={Plus}
                  >
                    {t("products.addProduct", "Add Product")}
                  </Button>
                )}
              </div>
            ) : (
              filteredProducts.map((prod) => {
                const prodId = prod.id ?? prod._id;
                const isSelected = String(prodId) === String(selectedProductId);
                const categoryLabel =
                  prod.category?.name ||
                  (Array.isArray(prod.category)
                    ? prod.category.join(", ")
                    : typeof prod.category === "string"
                      ? prod.category
                      : "") ||
                  prod.categoryLabel ||
                  "";
                const variantsCount =
                  prod.variantsCount ??
                  prod.variants_count ??
                  (Array.isArray(prod.variants) ? prod.variants.length : 0);

                return (
                  <div
                    key={prodId}
                    className={`relative flex items-center justify-between transition-all duration-150 group select-none ${
                      isSelected
                        ? "bg-[rgb(var(--color-primary))]/10 dark:bg-[rgb(var(--color-primary))]/20 border-l-4 border-l-[rgb(var(--color-primary))] shadow-sm"
                        : "hover:bg-[rgb(var(--color-bg-secondary))] border-l-4 border-l-transparent"
                    }`}
                  >
                    {/* Clickable item body */}
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(prod)}
                      className="flex-1 min-w-0 px-3 py-2.5 pr-1 text-left flex items-start justify-between gap-2.5 cursor-pointer focus:outline-none"
                    >
                      {/* Left: Name + Brand/Category + SKU */}
                      <div className="min-w-0 flex-1">
                        <h4
                          className={`text-sm truncate transition-colors ${
                            isSelected
                              ? "font-bold text-[rgb(var(--color-primary))]"
                              : "font-medium text-[rgb(var(--color-text-primary))] group-hover:text-[rgb(var(--color-primary))]"
                          }`}
                        >
                          {prod.name}
                        </h4>

                        <div className="flex items-center gap-1.5 mt-1 text-xs text-[rgb(var(--color-text-secondary))] truncate">
                          {prod.brand && (
                            <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                              {prod.brand}
                            </span>
                          )}
                          {prod.brand && categoryLabel && <span>•</span>}
                          {categoryLabel && (
                            <span className="truncate">{categoryLabel}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {getStatusBadge(prod.status)}
                          {prod.hasMultipleVariants !== false &&
                            Number(variantsCount) > 1 && (
                              <Badge
                                variant="secondary"
                                size="sm"
                                className="font-medium"
                              >
                                <Tag className="w-3 h-3 mr-1 inline" />
                                {variantsCount}{" "}
                                {t("products.variants", "Variants")}
                              </Badge>
                            )}
                          {prod.showInCatalog !== false ? (
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"
                              title={t("products.inCatalog", "In Digital Shop")}
                            />
                          ) : (
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"
                              title={t("products.hidden", "Hidden")}
                            />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* 3-dots action menu */}
                    <div
                      className="relative pr-2.5 flex-shrink-0"
                      ref={openRowMenuId === prodId ? rowMenuRef : null}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenRowMenuId(
                            openRowMenuId === prodId ? null : prodId
                          );
                        }}
                        className="p-1 rounded hover:bg-[rgb(var(--color-border-primary))]/40 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {openRowMenuId === prodId && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-xl border border-[rgb(var(--color-border-primary))] py-1 z-50">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenRowMenuId(null);
                              handleSelectProduct(prod);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs font-medium text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[rgb(var(--color-text-secondary))]" />
                            {t("common.viewDetails", "View Details")}
                          </button>

                          {canEdit && onStockIn && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenRowMenuId(null);
                                onStockIn?.(prodId);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer"
                            >
                              <ArrowDownToLine className="w-3 h-3.5" />
                              {t("products.stockIn", "Stock In")}
                            </button>
                          )}

                          {canEdit && onEdit && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenRowMenuId(null);
                                onEdit?.(prodId);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs font-medium text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5 text-[rgb(var(--color-text-secondary))]" />
                              {t("common.edit", "Edit")}
                            </button>
                          )}

                          {canDelete && onDelete && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenRowMenuId(null);
                                onDelete?.(
                                  prodId || prod.id || prod._id || prod
                                );
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {t("common.delete", "Delete")}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Sentinel for infinite scroll */}
            {pagination?.hasNextPage && sentinelRef && (
              <div
                ref={sentinelRef}
                className="h-6 w-full flex items-center justify-center p-2"
              >
                {isFetchingMore && (
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
                    <div className="w-3.5 h-3.5 border-2 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin" />
                    <span>
                      {t("common.loadingMore", "Loading more products...")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: PRODUCT DETAILS VIEW                        */}
        {/* ========================================================= */}
        <div
          className={`flex-1 flex flex-col min-w-0 bg-[rgb(var(--color-bg-primary))] overflow-hidden ${
            showMobileDetail ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Mobile Back Button */}
          <div className="md:hidden p-3 border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMobileDetail(false)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[rgb(var(--color-primary))]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {t("products.backToProducts", "Back to Product List")}
              </span>
            </button>
          </div>

          {!selectedProductId ? (
            /* Empty state when no product is selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[rgb(var(--color-text-secondary))]">
              <Package className="w-16 h-16 mb-4 opacity-30 text-[rgb(var(--color-primary))]" />
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-1">
                {t("products.selectProduct", "Select a Product")}
              </h3>
              <p className="text-sm max-w-sm mb-6">
                {t(
                  "products.selectProductDesc",
                  "Choose a product from the list on the left to view all its details, stock metrics, pricing, and actions."
                )}
              </p>
              {canEdit && onCreate && (
                <Button variant="primary" onClick={onCreate} leftIcon={Plus}>
                  {t("products.addProduct", "Add Product")}
                </Button>
              )}
            </div>
          ) : detailsLoading ? (
            /* Loading skeleton */
            <div className="flex-1 p-3.5 sm:p-4 space-y-3 overflow-y-auto">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-[rgb(var(--color-border-primary))] rounded w-1/3" />
                <div className="h-3 bg-[rgb(var(--color-border-primary))]/60 rounded w-1/4" />
                <div className="grid grid-cols-4 gap-2.5 mt-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-14 bg-[rgb(var(--color-bg-secondary))] rounded-md"
                    />
                  ))}
                </div>
                <div className="h-48 bg-[rgb(var(--color-bg-secondary))] rounded-lg mt-6" />
              </div>
            </div>
          ) : detailsError ? (
            /* Error state */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                {detailsError}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProductFullDetails(selectedProductId)}
              >
                {t("common.tryAgain", "Try Again")}
              </Button>
            </div>
          ) : productData ? (
            /* Full Product Details Content */
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Product Top Header Bar */}
              <div className="px-4 py-3 sm:px-5 sm:py-3 border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text-primary))] tracking-tight truncate">
                      {productData.name}
                    </h2>
                    {productData.brand && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40 font-medium">
                        {productData.brand}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {getStatusBadge(productData.status)}
                    {(productData.category?.name || productData.category) && (
                      <Badge
                        variant="purple"
                        size="xs"
                        className="flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {productData.category?.name || productData.category}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                  {productData.hasMultipleVariants && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleNavigateToVariants()}
                      leftIcon={Eye}
                      className="text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                    >
                      {t("products.viewVariants", "View Variants")}
                    </Button>
                  )}

                  {canEdit && onStockIn && (
                    <Button
                      size="xs"
                      onClick={() =>
                        onStockIn(productData.id || productData._id)
                      }
                      leftIcon={ArrowDownToLine}
                      className="text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    >
                      {t("products.stockIn", "Stock In")}
                    </Button>
                  )}

                  {canEdit && onEdit && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onEdit(productData.id || productData._id)}
                      leftIcon={Edit}
                      style={{ borderWidth: 1 }}
                    >
                      {t("common.edit", "Edit")}
                    </Button>
                  )}

                  {onDownloadPDF && (
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={onDownloadPDF}
                      leftIcon={Download}
                    >
                      {t("common.downloadPdf", "PDF")}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      if (selectedProductId) {
                        fetchProductFullDetailsRef.current(selectedProductId);
                      }
                    }}
                    leftIcon={RefreshCw}
                    className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                    title={t("common.refresh", "Refresh details")}
                  >
                    {t("common.refresh", "Refresh")}
                  </Button>

                  {canDelete && onDelete && (
                    <Button
                      size="xs"
                      onClick={() =>
                        onDelete(
                          productData?.id ||
                            productData?._id ||
                            selectedProductId ||
                            productData
                        )
                      }
                      leftIcon={Trash2}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {t("common.delete", "Delete")}
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowMobileDetail(false)}
                    className="md:hidden p-1.5 rounded-lg text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick KPI Bar */}
              <div
                className={`px-4 py-2 sm:px-5 sm:py-2.5 bg-[rgb(var(--color-bg-secondary))]/50 border-b border-[rgb(var(--color-border-primary))] grid gap-2 sm:gap-2.5 flex-shrink-0 ${
                  productData.hasMultipleVariants
                    ? "grid-cols-2 sm:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-4"
                }`}
              >
                {!productData.hasMultipleVariants ? (
                  <>
                    {/* Selling Price (single product only) */}
                    <div className="p-2 px-2.5 rounded-md bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/60">
                      <span className="text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider block">
                        {t("products.sellingPrice", "Sale Price")}
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block truncate">
                        {productData.sellingPrice
                          ? `₹${Number(productData.sellingPrice).toLocaleString("en-IN")}`
                          : "₹0.00"}
                      </span>
                    </div>

                    {/* Base Price / MRP (single product only) */}
                    <div className="p-2 px-2.5 rounded-md bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/60">
                      <span className="text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider block">
                        {t("products.mrp", "Purchase / MRP")}
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-[rgb(var(--color-text-primary))] font-mono mt-0.5 block truncate">
                        {productData.mrp
                          ? `₹${Number(productData.mrp).toLocaleString("en-IN")}`
                          : productData.basePrice
                            ? `₹${Number(productData.basePrice).toLocaleString("en-IN")}`
                            : "₹0.00"}
                      </span>
                    </div>
                  </>
                ) : (
                  /* Total Variants metric for multi-variant products */
                  <div className="p-2 px-2.5 rounded-md bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/60">
                    <span className="text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider block">
                      {t("products.variants", "Variants")}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-0.5 block truncate">
                      {productData.variants?.length || 0}{" "}
                      {t("products.variants", "Variants")}
                    </span>
                  </div>
                )}

                {/* Stock Quantity */}
                <div className="p-2 px-2.5 rounded-md bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/60">
                  <span className="text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider block">
                    {t("products.stockQuantity", "Stock Quantity")}
                  </span>
                  <span
                    className={`text-sm sm:text-base font-extrabold font-mono mt-0.5 block truncate ${
                      currentStock === 0
                        ? "text-rose-600 dark:text-rose-400"
                        : currentStock < 10
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {currentStock} {t("products.units", "units")}
                  </span>
                </div>

                {/* Stock Value */}
                <div className="p-2 px-2.5 rounded-md bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/60">
                  <span className="text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider block">
                    {t("products.stockValue", "Stock Value")}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-[rgb(var(--color-text-primary))] font-mono mt-0.5 block truncate">
                    ₹{stockValue.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Scrollable Detailed Sections */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 space-y-3 sm:space-y-3.5">
                {/* 1. Basic Product Information Card */}
                <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))] p-3.5 sm:p-4 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-[rgb(var(--color-primary))]/20 to-[rgb(var(--color-primary))]/10 rounded-md flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                        {t(
                          "products.productInformation",
                          "Product Information"
                        )}
                      </h3>
                      <p className="text-[11px] text-[rgb(var(--color-text-secondary))]">
                        {t("products.basicDetails", "Basic product details")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                    {/* Name */}
                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                        {t("products.productName", "Product Name")}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text-primary))] truncate">
                        {productData.name || t("common.na", "N/A")}
                      </p>
                    </div>

                    {/* Brand */}
                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                        {t("products.brand", "Brand")}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text-primary))] truncate">
                        {productData.brand || t("common.na", "N/A")}
                      </p>
                    </div>

                    {/* Category */}
                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                        {t("products.category", "Category")}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text-primary))] truncate">
                        {productData.category?.name ||
                          productData.category ||
                          t("common.na", "N/A")}
                      </p>
                    </div>

                    {/* SKU */}
                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                        {t("products.sku", "SKU")}
                      </p>
                      <p className="text-xs sm:text-sm font-bold font-mono text-[rgb(var(--color-text-primary))] truncate">
                        {productData.hasMultipleVariants
                          ? t("products.multipleSkus", "Multiple SKUs")
                          : (productData.sku || t("common.na", "N/A"))}
                      </p>
                    </div>

                    {/* Barcode */}
                    {!productData.hasMultipleVariants && productData.barcode && (
                      <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                        <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                          {t("products.barcode", "Barcode")}
                        </p>
                        <p className="text-xs sm:text-sm font-bold font-mono text-[rgb(var(--color-text-primary))] truncate">
                          {productData.barcode}
                        </p>
                      </div>
                    )}

                    {/* Unit of Measure */}
                    {productData.uom && (
                      <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                        <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                          {t("products.unitOfMeasure", "Unit of Measure")}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text-primary))] truncate">
                          {productData.uom}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Pricing Information Card (ONLY for single product) */}
                {!productData.hasMultipleVariants && (
                  <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))] p-3.5 sm:p-4 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-md flex items-center justify-center shrink-0">
                        <IndianRupee className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                          {t(
                            "products.pricingInformation",
                            "Pricing Information"
                          )}
                        </h3>
                        <p className="text-[11px] text-[rgb(var(--color-text-secondary))]">
                          {t(
                            "products.pricingDetails",
                            "Cost, pricing and margin breakdown"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
                      {/* Selling Price */}
                      <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                        <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                          {t("products.sellingPrice", "Selling Price")}
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                          {productData.sellingPrice
                            ? `₹${Number(productData.sellingPrice).toLocaleString("en-IN")}`
                            : "₹0.00"}
                        </p>
                      </div>

                      {/* MRP */}
                      <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                        <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                          {t("products.mrp", "MRP")}
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-[rgb(var(--color-text-primary))] font-mono">
                          {productData.mrp
                            ? `₹${Number(productData.mrp).toLocaleString("en-IN")}`
                            : "₹0.00"}
                        </p>
                      </div>

                      {/* Purchase Price */}
                      <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                        <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                          {t("products.purchasePrice", "Purchase Price")}
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-[rgb(var(--color-text-primary))] font-mono">
                          {productData.basePrice || productData.purchasePrice
                            ? `₹${Number(productData.basePrice || productData.purchasePrice).toLocaleString("en-IN")}`
                            : "₹0.00"}
                        </p>
                      </div>

                      {/* Profit Margin */}
                      <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                        <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                          {t("products.margin", "Profit Margin")}
                        </p>
                        {(() => {
                          const cost = Number(
                            productData.basePrice ||
                              productData.purchasePrice ||
                              0
                          );
                          const sale = Number(productData.sellingPrice || 0);
                          if (cost > 0 && sale > 0) {
                            const margin = (((sale - cost) / sale) * 100).toFixed(
                              1
                            );
                            const isProfit = Number(margin) >= 0;
                            return (
                              <p
                                className={`text-sm sm:text-base font-extrabold font-mono ${
                                  isProfit
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {isProfit ? `+${margin}%` : `${margin}%`}
                              </p>
                            );
                          }
                          return (
                            <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text-secondary))]">
                              {t("common.na", "N/A")}
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Inventory & Stock Status Card */}
                <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))] p-3.5 sm:p-4 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-md flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                        {t(
                          "products.inventoryInformation",
                          "Inventory & Stock"
                        )}
                      </h3>
                      <p className="text-[11px] text-[rgb(var(--color-text-secondary))]">
                        {t(
                          "products.stockDetails",
                          "Current stock levels and tracking"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                    {/* Current Stock */}
                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                        {t("products.currentStock", "Current Stock")}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-base sm:text-lg font-extrabold font-mono ${
                            currentStock === 0
                              ? "text-rose-600 dark:text-rose-400"
                              : currentStock < 10
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {currentStock}
                        </span>
                        <span className="text-[11px] text-[rgb(var(--color-text-secondary))]">
                          {t("products.units", "units")}
                        </span>
                      </div>
                    </div>

                    {/* Stock Value */}
                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                        {t("products.stockValue", "Total Stock Value")}
                      </p>
                      <p className="text-base sm:text-lg font-extrabold text-[rgb(var(--color-text-primary))] font-mono">
                        ₹{stockValue.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Min Alert Level */}
                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                        {t("products.minAlert", "Low Stock Alert Level")}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text-primary))] font-mono">
                        {productData.minStockLevel ||
                          productData.lowStockAlert ||
                          5}{" "}
                        {t("products.units", "units")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Variants Section (only rendered when product has multiple variants) */}
                {productData.hasMultipleVariants &&
                  Array.isArray(productData.variants) &&
                  productData.variants.length > 0 && (
                    <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))] p-3.5 sm:p-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-md flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-purple-500" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                              {t("products.variants", "Product Variants")} (
                              {productData.variants.length})
                            </h3>
                            <p className="text-[11px] text-[rgb(var(--color-text-secondary))]">
                              {t(
                                "products.variantsDescription",
                                "Sizes, colors and available options"
                              )}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleNavigateToVariants()}
                          leftIcon={Eye}
                          className="text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 self-start sm:self-auto"
                        >
                          {t(
                            "products.viewAllVariants",
                            "View / Manage Variants"
                          )}
                        </Button>
                      </div>

                      <div className="overflow-x-auto border border-[rgb(var(--color-border-primary))] rounded-lg">
                        <table className="w-full text-left text-xs divide-y divide-[rgb(var(--color-border-primary))]">
                          <thead className="bg-[rgb(var(--color-bg-secondary))]/70 uppercase tracking-wider font-semibold text-[rgb(var(--color-text-secondary))]">
                            <tr>
                              <th className="px-3 py-2 text-[11px]">
                                {t("products.variant", "Variant")}
                              </th>
                              <th className="px-3 py-2 text-[11px]">
                                {t("products.sku", "SKU")}
                              </th>
                              <th className="px-3 py-2 text-[11px]">
                                {t("products.sellingPrice", "Price")}
                              </th>
                              <th className="px-3 py-2 text-[11px]">
                                {t("products.stock", "Stock")}
                              </th>
                              <th className="px-3 py-2 text-[11px] text-right">
                                {t("common.action", "Action")}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[rgb(var(--color-border-primary))]/50">
                            {productData.variants.map((v, idx) => {
                              const variantName =
                                v.displayName ||
                                v.name ||
                                v.title ||
                                `Variant #${idx + 1}`;
                              const variantStock =
                                v.stock ??
                                v.inventory?.availableQuantity ??
                                v.inventory?.totalQuantity ??
                                v.quantity ??
                                0;
                              const variantPrice = v.sellingPrice ?? v.price;
                              return (
                                <tr
                                  key={v.id || v._id || idx}
                                  className="hover:bg-[rgb(var(--color-bg-secondary))]/40"
                                >
                                  <td className="px-3 py-2 font-medium text-[rgb(var(--color-text-primary))]">
                                    <div className="flex items-center gap-2">
                                      <span>{variantName}</span>
                                      {v.isDefault && (
                                        <Badge variant="secondary" size="xs">
                                          {t("common.default", "Default")}
                                        </Badge>
                                      )}
                                    </div>
                                    {Array.isArray(v.options) &&
                                      v.options.length > 0 && (
                                        <div className="text-[11px] text-[rgb(var(--color-text-secondary))] mt-0.5">
                                          {v.options
                                            .map((o) => `${o.name}: ${o.value}`)
                                            .join(", ")}
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-3 py-2 font-mono text-[rgb(var(--color-text-secondary))]">
                                    <div>{v.sku || "-"}</div>
                                    {v.barcode && (
                                      <div className="text-[10px] text-[rgb(var(--color-text-secondary))]/70 font-mono">
                                        {v.barcode}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                    {variantPrice !== undefined &&
                                    variantPrice !== null
                                      ? `₹${Number(variantPrice).toLocaleString("en-IN")}`
                                      : "₹0.00"}
                                    {v.mrp &&
                                      Number(v.mrp) >
                                        Number(variantPrice || 0) && (
                                        <span className="ml-1.5 text-[10px] font-normal text-[rgb(var(--color-text-secondary))] line-through">
                                          ₹
                                          {Number(v.mrp).toLocaleString(
                                            "en-IN"
                                          )}
                                        </span>
                                      )}
                                  </td>
                                  <td className="px-3 py-2">
                                    {renderStockPill(variantStock)}
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleNavigateToVariants(
                                          v.id || v._id
                                        )
                                      }
                                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 transition-colors"
                                      title={t(
                                        "products.viewVariant",
                                        "View & manage this variant"
                                      )}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>
                                        {t("common.view", "View")}
                                      </span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {/* 5. Tax & Compliance Card */}
                <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))] p-3.5 sm:p-4 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 rounded-md flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                        {t("products.taxCompliance", "Tax & Compliance")}
                      </h3>
                      <p className="text-[11px] text-[rgb(var(--color-text-secondary))]">
                        {t(
                          "products.taxDetails",
                          "GST, HSN code and statutory tax information"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                        {t("products.hsnCode", "HSN Code")}
                      </p>
                      <p className="text-xs sm:text-sm font-bold font-mono text-[rgb(var(--color-text-primary))] truncate">
                        {productData.hsn ||
                          productData.hsnCode ||
                          t("common.na", "N/A")}
                      </p>
                    </div>

                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                        {t("products.taxRate", "GST / Tax Rate")}
                      </p>
                      <p className="text-xs sm:text-sm font-bold font-mono text-[rgb(var(--color-text-primary))] truncate">
                        {productData.taxRate !== undefined &&
                        productData.taxRate !== null
                          ? `${productData.taxRate}%`
                          : productData.gstRate !== undefined
                            ? `${productData.gstRate}%`
                            : t("common.na", "N/A")}
                      </p>
                    </div>

                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-0.5">
                        {t("products.taxInclusive", "Tax Type")}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text-primary))] truncate">
                        {productData.isTaxInclusive
                          ? t("products.inclusive", "Inclusive of Tax")
                          : t("products.exclusive", "Exclusive of Tax")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. Additional Product Metadata Card */}
                <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))] p-3.5 sm:p-4 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-slate-500/20 to-slate-500/10 rounded-md flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                        {t(
                          "products.additionalInformation",
                          "Additional Information"
                        )}
                      </h3>
                      <p className="text-[11px] text-[rgb(var(--color-text-secondary))]">
                        {t("products.metadata", "Product status and metadata")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-1">
                        {t("products.status", "Status")}
                      </p>
                      {getStatusBadge(productData.status)}
                    </div>

                    <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                      <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-1">
                        {t("products.visibility", "Digital Shop Visibility")}
                      </p>
                      {getCatalogVisibilityBadge(productData.showInCatalog)}
                    </div>

                    {productData.createdAt && (
                      <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                        <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-1">
                          {t("products.createdDate", "Created Date")}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text-primary))] truncate">
                          {formatDateTime(productData.createdAt, momentProp)}
                        </p>
                      </div>
                    )}

                    {productData.updatedAt && (
                      <div className="p-2.5 px-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-md border border-[rgb(var(--color-border-primary))]/40">
                        <p className="text-[10px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-1">
                          {t("products.lastUpdated", "Last Updated")}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text-primary))] truncate">
                          {formatDateTime(productData.updatedAt, momentProp)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Stock In Drawer */}
      {StockInDrawer && (
        <StockInDrawer
          isOpen={showStockInDrawer}
          onClose={handleCloseStockInDrawer}
          product={productForStockIn}
          onSuccess={(result) => {
            if (productForStockIn) {
              const pId = productForStockIn.id || productForStockIn._id;
              if (String(selectedProductId) === String(pId)) {
                fetchProductFullDetailsRef.current(pId);
              }
            }
            handleStockInSuccess?.(result);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {ProductDeleteConfirmModal && productToDelete && (
        <ProductDeleteConfirmModal
          productToDelete={productToDelete}
          onClose={handleDeleteClose}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {/* Delete Success Modal */}
      {ProductDeleteSuccessModal && (
        <ProductDeleteSuccessModal
          isOpen={showDeleteSuccessModal}
          onClose={() => setShowDeleteSuccessModal?.(false)}
          productName={deletedProductName}
        />
      )}

      {/* Error Modal */}
      {ProductErrorModal && (
        <ProductErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal?.(false)}
          title={errorDetails?.title}
          message={errorDetails?.message}
          details={errorDetails?.details}
        />
      )}
    </>
  );
}

export default ProductMasterDetailView;
