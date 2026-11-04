"use client";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IndianRupee, Package, Plus } from "lucide-react";
import { Button, Card, EmptyState, Input, Select } from "@dragorbit/ui";
import { AddedItemsList } from "./AddedItemsList.jsx";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner.js";
import {
  addProductToInvoiceItems,
  getProductId,
  pickDefaultVariant,
  variantOptionLabel,
} from "../utils/addProductToInvoiceItems.js";

function getInvoiceVariants(product) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  return variants.filter(
    (variant) => String(variant?.status || "ACTIVE").toUpperCase() !== "DELETED"
  );
}

function getVariantProductId(variant) {
  if (!variant) return "";
  const product =
    variant.product ??
    variant.productId ??
    variant.product_id ??
    variant.productDetails;
  if (typeof product === "string") return product;
  return product?.id ?? product?._id ?? "";
}

function formatVariantOption(variant) {
  if (!variant) return "";
  const label = variantOptionLabel(variant) || "Default";
  const sku = variant.sku ? ` · ${variant.sku}` : "";
  const price = Number(variant.sellingPrice);
  const priceLabel = Number.isFinite(price) ? ` — ₹${price}` : "";
  return `${label}${sku}${priceLabel}`;
}

export const InvoiceItemsSection = ({
  t = (k) => k,
  products = [],
  availableProductIds,
  formData,
  setFormData,
  showError = () => {},
  lookupProductByCode,
  onProductResolved,
  fetchVariants,
  storeId,
}) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedVariantData, setSelectedVariantData] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [variantRows, setVariantRows] = useState([]);
  const [variantSearch, setVariantSearch] = useState("");
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variantsLoadingMore, setVariantsLoadingMore] = useState(false);
  const [variantsHasMore, setVariantsHasMore] = useState(false);

  const variantRequestIdRef = useRef(0);
  const variantCursorRef = useRef(null);
  const variantLoadingRef = useRef(false);
  const scanInFlightRef = useRef(false);

  // ── Paginated Server Variant Loading (Store-FE) ────────────────────────────
  const loadVariantPage = useCallback(
    async ({ search = "", cursor = null, append = false, requestId }) => {
      if (!fetchVariants || (append && variantLoadingRef.current)) return;
      variantLoadingRef.current = true;
      if (append) {
        setVariantsLoadingMore(true);
      } else {
        setVariantsLoading(true);
      }
      try {
        const response = await fetchVariants({
          store: storeId,
          limit: 30,
          ...(search ? { search } : {}),
          ...(cursor != null ? { nextCursor: cursor } : {}),
        });
        if (requestId !== variantRequestIdRef.current) return;

        const body = response?.data ?? response;
        const data = body?.data ?? body;
        const rawRows = Array.isArray(data)
          ? data
          : Array.isArray(data?.variants)
          ? data.variants
          : [];
        const rows = rawRows.filter(
          (variant) =>
            String(variant?.status || "ACTIVE").toUpperCase() !== "DELETED"
        );

        const pagination =
          body?.meta?.pagination ??
          body?.pagination ??
          response?.pagination ??
          null;
        const nextCursor = pagination?.hasNextPage
          ? pagination.nextCursor ?? null
          : null;
        variantCursorRef.current = nextCursor;
        setVariantsHasMore(Boolean(nextCursor));
        setVariantRows((current) => {
          const combined = append ? [...current, ...rows] : rows;
          const seen = new Set();
          return combined.filter((variant) => {
            const id = String(variant?.id ?? variant?._id ?? "");
            if (!id || seen.has(id)) return false;
            seen.add(id);
            return true;
          });
        });
      } catch {
        if (requestId === variantRequestIdRef.current) {
          setVariantsHasMore(false);
        }
      } finally {
        variantLoadingRef.current = false;
        if (append) {
          setVariantsLoadingMore(false);
        } else {
          setVariantsLoading(false);
        }
      }
    },
    [fetchVariants, storeId]
  );

  useEffect(() => {
    if (!fetchVariants || !storeId) return;
    const reqId = ++variantRequestIdRef.current;
    loadVariantPage({
      search: variantSearch,
      cursor: null,
      append: false,
      requestId: reqId,
    });
  }, [fetchVariants, storeId, variantSearch, loadVariantPage]);

  const loadMoreVariants = useCallback(() => {
    if (!variantsHasMore || variantsLoading || variantsLoadingMore) return;
    const reqId = ++variantRequestIdRef.current;
    loadVariantPage({
      search: variantSearch,
      cursor: variantCursorRef.current,
      append: true,
      requestId: reqId,
    });
  }, [
    variantsHasMore,
    variantsLoading,
    variantsLoadingMore,
    variantSearch,
    loadVariantPage,
  ]);

  // ── Maps for Fast Product / Variant Lookups ────────────────────────────────
  const productsById = useMemo(() => {
    const map = new Map();
    (products || []).forEach((product) => {
      const id = getProductId(product);
      if (id) map.set(String(id), product);
    });
    return map;
  }, [products]);

  const variantsById = useMemo(() => {
    const map = new Map();
    (products || []).forEach((product) => {
      (product.variants || []).forEach((variant) => {
        const id = variant?.id ?? variant?._id;
        if (id) map.set(String(id), variant);
      });
    });
    variantRows.forEach((variant) => {
      const id = variant?.id ?? variant?._id;
      if (id) map.set(String(id), variant);
    });
    return map;
  }, [products, variantRows]);

  const serverVariantOptions = useMemo(() => {
    return variantRows.flatMap((variant) => {
      const productId = getVariantProductId(variant);
      const variantId = String(variant?.id ?? variant?._id ?? "");
      if (!productId && !variantId) return [];

      const prod = variant?.product ?? variant?.productDetails;
      const productObj =
        (typeof prod === "object" && prod !== null ? prod : null) ||
        productsById.get(String(productId));
      const productName =
        productObj?.name || variant.productName || "Item";
      const optionLabel = formatVariantOption(variant);
      return [
        {
          value: `${productId}::${variantId}`,
          label: `${productName} — ${optionLabel}`,
          key: `server:${productId}:${variantId}`,
        },
      ];
    });
  }, [variantRows, productsById]);

  const localProductOptions = useMemo(() => {
    return (products || [])
      .filter((product) => {
        const id = getProductId(product);
        if (!id) return false;
        const isService =
          String(
            product.productType || product.type || ""
          ).toUpperCase() === "SERVICE";
        if (availableProductIds) {
          return isService || availableProductIds.has(String(id));
        }
        return true;
      })
      .flatMap((product) => {
        const productId = getProductId(product);
        const variants = getInvoiceVariants(product);

        if (variants.length === 0) {
          const price = product.sellingPrice ?? product.mrp ?? 0;
          return [
            {
              value: `${productId}::`,
              label: `${product.name} — ₹${price}`,
              key: `prod:${productId}`,
            },
          ];
        }

        return variants.map((variant, index) => {
          const variantId = variant?.id ?? variant?._id ?? "";
          const optionLabel = formatVariantOption(variant);
          return {
            value: `${productId}::${variantId}`,
            label: `${product.name} — ${optionLabel}`,
            key: `var:${productId}:${variantId || index}`,
          };
        });
      });
  }, [products, availableProductIds]);

  // ── Robust Product Resolution with Fallbacks ──────────────────────────────
  const selectedProductObj = useMemo(() => {
    if (!selectedProduct) return null;

    // 1. Direct check in products map (works for desktop and resolved products)
    const directProduct = productsById.get(String(selectedProduct));
    if (directProduct) return directProduct;

    // 2. Fallback: check selectedVariantData or variantsById or variantRows
    const matchedVariant =
      selectedVariantData ||
      (selectedVariant ? variantsById.get(String(selectedVariant)) : null) ||
      variantRows.find((v) => {
        const vId = String(v?.id ?? v?._id ?? "");
        if (selectedVariant && vId === String(selectedVariant)) return true;
        const prodId = getVariantProductId(v);
        return prodId && String(prodId) === String(selectedProduct);
      }) ||
      null;

    if (matchedVariant) {
      const relatedProduct =
        matchedVariant.product ?? matchedVariant.productDetails;
      const relatedObj =
        typeof relatedProduct === "object" && relatedProduct !== null
          ? relatedProduct
          : null;
      const name =
        relatedObj?.name ||
        matchedVariant.productName ||
        matchedVariant.name ||
        "Item";
      const gstInfo =
        matchedVariant.gstInfo ||
        relatedObj?.gstInfo ||
        {};
      const hsnCode =
        matchedVariant.hsnCode ||
        relatedObj?.hsnCode ||
        "";
      const productType =
        relatedObj?.productType ||
        relatedObj?.type ||
        matchedVariant.productType ||
        "STANDARD";

      return {
        id: String(selectedProduct),
        _id: String(selectedProduct),
        name,
        gstInfo,
        hsnCode,
        productType,
        sellingPrice: matchedVariant.sellingPrice ?? relatedObj?.sellingPrice,
        mrp: matchedVariant.mrp ?? relatedObj?.mrp,
        sku: matchedVariant.sku ?? relatedObj?.sku ?? "",
        uom: matchedVariant.uom ?? relatedObj?.uom ?? "Unit",
        variants: [matchedVariant],
      };
    }

    return null;
  }, [
    selectedProduct,
    productsById,
    selectedVariantData,
    selectedVariant,
    variantsById,
    variantRows,
  ]);

  const selectedVariantObj = useMemo(() => {
    if (!selectedVariant) return selectedVariantData || null;
    return (
      selectedVariantData ||
      variantsById.get(String(selectedVariant)) ||
      variantRows.find(
        (v) => String(v?.id ?? v?._id ?? "") === String(selectedVariant)
      ) ||
      (selectedProductObj?.variants || []).find(
        (v) => String(v?.id ?? v?._id ?? "") === String(selectedVariant)
      ) ||
      null
    );
  }, [
    selectedVariant,
    selectedVariantData,
    variantsById,
    variantRows,
    selectedProductObj,
  ]);

  const itemOptions = useMemo(() => {
    let list = [];
    if (serverVariantOptions.length > 0) {
      list = [...serverVariantOptions];
      // Append services from products if any
      const services = (products || [])
        .filter(
          (product) =>
            String(product.productType || product.type || "").toUpperCase() ===
            "SERVICE"
        )
        .map((product) => ({
          value: `${getProductId(product)}::`,
          label: `${product.name} — ${formatVariantOption(product) || "Service"}`,
          key: `service:${getProductId(product)}`,
        }));
      list.push(...services);
    } else {
      list = localProductOptions;
    }

    // Ensure currently selected item is present in options list
    if (selectedProduct) {
      const selectedValue = `${selectedProduct}::${selectedVariant || ""}`;
      if (!list.some((opt) => opt.value === selectedValue)) {
        const prodName =
          selectedProductObj?.name ||
          selectedVariantData?.product?.name ||
          selectedVariantData?.productName ||
          "Selected Item";
        const label = selectedVariantData
          ? `${prodName} — ${formatVariantOption(selectedVariantData)}`
          : prodName;
        list = [
          {
            value: selectedValue,
            label,
            key: `selected:${selectedValue}`,
          },
          ...list,
        ];
      }
    }

    return [
      { value: "", label: t("invoice.selectItem") || "Select Item" },
      ...list,
    ];
  }, [
    serverVariantOptions,
    localProductOptions,
    products,
    selectedProduct,
    selectedVariant,
    selectedProductObj,
    selectedVariantData,
    t,
  ]);

  const appendProduct = useCallback(
    (product, quantityToAdd = 1, variantId = null, customPrice = null) => {
      const pId = getProductId(product);
      if (!pId) return false;

      setFormData((prev) => {
        const result = addProductToInvoiceItems(
          prev.items,
          product,
          quantityToAdd,
          {
            variantId: variantId || undefined,
            price: customPrice,
          }
        );
        return {
          ...prev,
          items: result.items,
        };
      });
      return true;
    },
    [setFormData]
  );

  // ── Barcode Scanning Handler ───────────────────────────────────────────────
  const handleScan = useCallback(
    async (code) => {
      if (scanInFlightRef.current || !lookupProductByCode) return;
      scanInFlightRef.current = true;
      try {
        const resolved = await lookupProductByCode(code);
        if (!resolved) {
          showError(
            t("invoice.barcodeProductNotFound", { code }) ||
              `Product not found for barcode: ${code}`
          );
          return;
        }
        onProductResolved?.(resolved);
        const matchedVariantId =
          resolved.matchedVariantId ||
          resolved.variantId ||
          resolved.variants?.[0]?.id ||
          resolved.variants?.[0]?._id ||
          null;
        appendProduct(resolved, 1, matchedVariantId);
      } finally {
        scanInFlightRef.current = false;
      }
    },
    [
      lookupProductByCode,
      showError,
      t,
      onProductResolved,
      appendProduct,
    ]
  );

  useBarcodeScanner({
    onScan: handleScan,
    enabled: Boolean(lookupProductByCode),
  });

  const handleProductChange = useCallback(
    (value) => {
      const [productId, variantId = ""] = String(value || "").split("::");
      setSelectedProduct(productId);
      setSelectedVariant(variantId);

      const variantData =
        (variantId ? variantsById.get(String(variantId)) : null) ||
        variantRows.find(
          (v) => String(v?.id ?? v?._id ?? "") === String(variantId)
        ) ||
        null;
      setSelectedVariantData(variantData);

      if (variantData) {
        const p = variantData.sellingPrice ?? variantData.mrp;
        setSelectedPrice(
          p !== undefined && p !== null && !isNaN(p) ? String(p) : ""
        );
      } else {
        const prod = productsById.get(String(productId));
        if (prod) {
          const p = prod.sellingPrice ?? prod.mrp;
          setSelectedPrice(
            p !== undefined && p !== null && !isNaN(p) ? String(p) : ""
          );
        } else {
          setSelectedPrice("");
        }
      }
    },
    [variantsById, variantRows, productsById]
  );

  const handleAddItem = useCallback(() => {
    if (!selectedProduct) {
      showError(t("invoice.pleaseSelectProduct") || "Please select a product");
      return;
    }

    const product = selectedProductObj;
    if (!product) {
      showError(t("invoice.productNotFound") || "Product not found");
      return;
    }

    const isService =
      String(
        product.productType || product.type || ""
      ).toUpperCase() === "SERVICE";
    const variants = getInvoiceVariants(product);

    if (!selectedVariant && !isService && variants.length > 1) {
      showError(t("invoice.pleaseSelectVariant") || "Please select a variant");
      return;
    }

    const quantityToAdd = parseInt(selectedQuantity, 10) || 1;
    const priceToAdd =
      selectedPrice !== "" && !isNaN(selectedPrice)
        ? Number(selectedPrice)
        : null;

    const variantIdToPass =
      selectedVariant ||
      selectedVariantObj?.id ||
      selectedVariantObj?._id ||
      null;

    const productWithVariant = selectedVariantObj
      ? {
          ...product,
          variants: [
            ...variants.filter(
              (v) =>
                String(v?.id ?? v?._id ?? "") !==
                String(selectedVariantObj?.id ?? selectedVariantObj?._id ?? "")
            ),
            selectedVariantObj,
          ],
        }
      : product;

    if (
      appendProduct(
        productWithVariant,
        quantityToAdd,
        variantIdToPass,
        priceToAdd
      )
    ) {
      // Notify parent to add product to its list so cache is preserved
      onProductResolved?.(productWithVariant);

      setSelectedProduct("");
      setSelectedVariant("");
      setSelectedVariantData(null);
      setSelectedQuantity(1);
      setSelectedPrice("");
    }
  }, [
    selectedProduct,
    selectedProductObj,
    selectedVariant,
    selectedVariantObj,
    selectedQuantity,
    selectedPrice,
    appendProduct,
    onProductResolved,
    showError,
    t,
  ]);

  const handleRemoveItem = useCallback(
    (index) => {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    },
    [setFormData]
  );

  const handleUpdateQuantity = useCallback(
    (index, newQty) => {
      setFormData((prev) => {
        const items = [...prev.items];
        const item = items[index];
        if (!item) return prev;
        const qty =
          newQty === "" ? "" : Math.max(1, parseInt(newQty, 10) || 1);
        const price = Number(item.price) || 0;
        items[index] = {
          ...item,
          quantity: qty,
          total: (typeof qty === "number" ? qty : 0) * price,
        };
        return { ...prev, items };
      });
    },
    [setFormData]
  );

  const handleUpdatePrice = useCallback(
    (index, newPrice) => {
      setFormData((prev) => {
        const items = [...prev.items];
        const item = items[index];
        if (!item) return prev;
        const price =
          newPrice === "" ? "" : Math.max(0, parseFloat(newPrice) || 0);
        const qty = Number(item.quantity) || 1;
        items[index] = {
          ...item,
          price: price,
          total: (typeof price === "number" ? price : 0) * qty,
        };
        return { ...prev, items };
      });
    },
    [setFormData]
  );

  return (
    <Card
      padding="none"
      className="!border-[rgb(var(--color-border-primary))]/30 h-full flex flex-col overflow-hidden w-full max-w-full"
    >
      <div className="p-3 sm:p-4 flex flex-col h-full overflow-hidden w-full max-w-full">
        {/* Item Selection Row */}
        <div className="mb-4 flex-shrink-0 w-full">
          <div className="grid grid-cols-12 gap-3 items-end w-full">
            {/* Product & Variant Select */}
            <div className="col-span-12 lg:col-span-5 min-w-0">
              <span className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("invoice.items") || "Items"} *
              </span>
              <Select
                size="sm"
                searchable={true}
                serverSearch={Boolean(fetchVariants)}
                onSearchChange={fetchVariants ? setVariantSearch : undefined}
                onListEnd={fetchVariants ? loadMoreVariants : undefined}
                loading={variantsLoading}
                loadingMore={variantsLoadingMore}
                hasMore={variantsHasMore}
                value={
                  selectedProduct
                    ? `${selectedProduct}::${selectedVariant}`
                    : ""
                }
                onChange={handleProductChange}
                options={itemOptions}
                leftIcon={Package}
              />
            </div>

            {/* Quantity Input */}
            <div className="col-span-6 sm:col-span-3 lg:col-span-2 min-w-0">
              <span className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("invoice.quantity") || "Quantity"} *
              </span>
              <Input
                type="number"
                data-ignore-barcode-scanner="true"
                value={selectedQuantity}
                onChange={(value) => setSelectedQuantity(value)}
                min="1"
                placeholder="1"
                leftIcon={Package}
                size="sm"
              />
            </div>

            {/* Price Input (Editable) */}
            <div className="col-span-6 sm:col-span-3 lg:col-span-2 min-w-0">
              <span className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("invoice.price") || "Price"} (₹) *
              </span>
              <Input
                type="number"
                data-ignore-barcode-scanner="true"
                value={selectedPrice}
                onChange={(value) => setSelectedPrice(value)}
                min="0"
                step="0.01"
                placeholder="0.00"
                leftIcon={IndianRupee}
                size="sm"
              />
            </div>

            {/* Add Item Button (Full width in column, no gap) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 min-w-0">
              <Button
                type="button"
                variant="primary"
                onClick={handleAddItem}
                leftIcon={Plus}
                size="sm"
                className="w-full justify-center h-9 font-medium"
                disabled={!selectedProduct}
              >
                {t("invoice.addItem") || "Add Item"}
              </Button>
            </div>
          </div>
        </div>

        {/* Added Items List */}
        {formData.items.length > 0 ? (
          <div className="mt-2 flex-1 flex flex-col min-h-[16rem] lg:min-h-0 w-full max-w-full overflow-hidden">
            <AddedItemsList
              items={formData.items}
              products={products}
              t={t}
              onRemove={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdatePrice={handleUpdatePrice}
            />
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title={t("invoice.noItemsTile") || "No Items Added"}
            description={
              t("invoice.noItemsdisc") ||
              "Search and select products above or scan barcodes to build your invoice."
            }
          />
        )}
      </div>
    </Card>
  );
};

export default memo(InvoiceItemsSection);
