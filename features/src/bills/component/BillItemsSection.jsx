"use client";
import { memo } from "react";
import { Package, Plus } from "lucide-react";
import { Button, Card, EmptyState, Input, Select } from "@dragorbit/ui";
import { AddedBillItemsList } from "./AddedBillItemsList.jsx";
import { resolveProductPurchasePrice } from "../utils/billUtils.js";

export const BillItemsSection = (props) => {
  // Support both { model } pattern and direct props
  const model = props.model || props;
  const {
    t = (k) => k,
    selectedProduct = "",
    setSelectedProduct = () => {},
    products = [],
    setSelectedPrice = () => {},
    productsLoading = false,
    selectedQuantity = 1,
    setSelectedQuantity = () => {},
    selectedPrice = 0,
    handleAddItem = () => {},
    formData = { items: [] },
    handleRemoveItem = () => {},
    handleUpdateItem = () => {},
  } = model;

  const handleProductSelect = (value) => {
    setSelectedProduct(value);
    if (!value) {
      setSelectedPrice(0);
      return;
    }
    const product = products.find((p) => (p.id || p._id) === value);
    if (product) {
      const price = resolveProductPurchasePrice(product);
      setSelectedPrice(price);
    }
  };

  const handleInlineQuantityChange = (index, deltaOrValue) => {
    const item = formData.items[index];
    if (!item) return;

    let newQty;
    if (typeof deltaOrValue === "number" && (deltaOrValue === 1 || deltaOrValue === -1)) {
      newQty = Math.max(1, (parseInt(item.quantity, 10) || 1) + deltaOrValue);
    } else {
      newQty = Math.max(1, parseInt(deltaOrValue, 10) || 1);
    }

    if (handleUpdateItem) {
      handleUpdateItem(index, { quantity: newQty });
    }
  };

  const handleInlinePriceChange = (index, newPrice) => {
    const parsed = Math.max(0, parseFloat(newPrice) || 0);
    if (handleUpdateItem) {
      handleUpdateItem(index, { purchasePrice: parsed });
    }
  };

  const productOptions = [
    {
      value: "",
      label: productsLoading
        ? t("errors.loading") || "Loading products..."
        : t("errors.selectProduct") || "Select Product",
    },
    ...products
      .filter((p) => p && (p.name || p.productName))
      .map((product) => {
        const id = product.id || product._id;
        const name = product.name || product.productName;
        const pPrice = resolveProductPurchasePrice(product);
        return {
          value: id,
          label: pPrice > 0 ? `${name} (₹${pPrice.toFixed(2)})` : name,
        };
      }),
  ];

  const totalUnits = (formData.items || []).reduce(
    (sum, it) => sum + (parseInt(it.quantity, 10) || 0),
    0
  );

  return (
    <Card
      padding="none"
      className="!border-[rgb(var(--color-border-primary))]/30 h-full flex flex-col overflow-hidden"
    >
      <div className="p-4 flex flex-col h-full overflow-hidden">
        {/* Add Item Section */}
        <div className="mb-4 flex-shrink-0 bg-[rgb(var(--color-bg-secondary))]/40 p-3 sm:p-4 rounded-xl border border-[rgb(var(--color-border-primary))]/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-[rgb(var(--color-text-primary))] mb-1.5">
                {t("errors.selectProduct") || "Select Product"} *
              </label>
              <Select
                size="sm"
                searchable={true}
                value={selectedProduct}
                onChange={handleProductSelect}
                options={productOptions}
                leftIcon={Package}
                disabled={productsLoading}
                placeholder={t("bills.searchOrSelectProduct") || "Select Product..."}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[rgb(var(--color-text-primary))] mb-1.5">
                {t("common.quantity") || "Quantity"} *
              </label>
              <Input
                type="number"
                value={selectedQuantity}
                onChange={(value) => setSelectedQuantity(value)}
                min="1"
                step="1"
                placeholder="1"
                size="sm"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-[rgb(var(--color-text-primary))] mb-1.5">
                {t("bills.purchasePrice") || t("common.price") || "Purchase Price (₹)"} *
              </label>
              <Input
                type="number"
                value={selectedPrice}
                onChange={(value) => setSelectedPrice(value)}
                min="0"
                step="0.01"
                placeholder="0.00"
                size="sm"
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="w-full justify-center h-[34px]"
                onClick={handleAddItem}
                leftIcon={Plus}
                disabled={!selectedProduct}
              >
                {t("common.add") || "Add"}
              </Button>
            </div>
          </div>
        </div>

        {/* Items List */}
        {formData.items && formData.items.length > 0 ? (
          <div className="mt-2 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] flex items-center gap-2">
                <span>{t("common.items") || "Items"}</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] font-medium">
                  {formData.items.length}
                </span>
              </h4>
              <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("bills.totalUnits") || "Total Units"}:{" "}
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                  {totalUnits}
                </span>
              </span>
            </div>

            <AddedBillItemsList
              items={formData.items}
              products={products}
              t={t}
              onQuantityChange={handleInlineQuantityChange}
              onPriceChange={handleInlinePriceChange}
              onRemoveItem={handleRemoveItem}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[220px]">
            <EmptyState
              icon={Package}
              title={t("bills.noItemsTile") || "No items added"}
              description={
                t("bills.noItemsdisc") ||
                "Select a product, adjust quantity and price, and click Add."
              }
              size="md"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default memo(BillItemsSection);
