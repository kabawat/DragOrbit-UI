"use client";
import { memo } from "react";
import { Package, Plus, Trash2, Minus } from "lucide-react";
import { Button, Card, EmptyState, Input, Select, Tooltip as SharedTooltip } from "@dragorbit/ui";
import { resolveProductPurchasePrice } from "../../utils/billUtils.js";

export function CreateBillItemsSectionPresentation(props) {
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
                  {formData.items.reduce(
                    (sum, it) => sum + (parseInt(it.quantity, 10) || 0),
                    0
                  )}
                </span>
              </span>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2.5 pr-1 min-h-0 custom-scrollbar">
              {formData.items.map((item, index) => {
                const product = products.find(
                  (p) => (p.id || p._id) === item.product
                );
                const itemTotal =
                  (parseFloat(item.quantity) || 0) *
                  (parseFloat(item.purchasePrice) || 0);
                const uom = item.uom || product?.uom || "PCS";

                return (
                  <div
                    key={item.product || index}
                    className="group rounded-xl p-3.5 bg-[rgb(var(--color-bg-secondary))]/50 hover:bg-[rgb(var(--color-bg-secondary))]/80 border border-[rgb(var(--color-border-primary))]/20 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      {/* Product Name & UOM */}
                      <div className="sm:col-span-5 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex items-center justify-center shrink-0">
                            <Package className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))] truncate">
                              {item.productName ||
                                product?.name ||
                                product?.productName ||
                                "Product"}
                            </p>
                            <span className="text-[11px] text-[rgb(var(--color-text-secondary))] uppercase tracking-wider font-medium">
                              {uom}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase font-semibold text-[rgb(var(--color-text-secondary))] mb-1">
                          {t("common.quantity") || "Qty"}
                        </label>
                        <div className="inline-flex items-center border border-[rgb(var(--color-border-primary))]/60 rounded-lg overflow-hidden bg-[rgb(var(--color-bg-primary))]">
                          <button
                            type="button"
                            onClick={() => handleInlineQuantityChange(index, -1)}
                            className="w-7 h-7 flex items-center justify-center text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleInlineQuantityChange(index, e.target.value)
                            }
                            className="w-12 h-7 text-center text-xs font-semibold text-[rgb(var(--color-text-primary))] bg-transparent border-x border-[rgb(var(--color-border-primary))]/40 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleInlineQuantityChange(index, 1)}
                            className="w-7 h-7 flex items-center justify-center text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price Input */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-semibold text-[rgb(var(--color-text-secondary))] mb-1">
                          {t("common.price") || "Price"}
                        </label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[rgb(var(--color-text-secondary))]">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.purchasePrice}
                            onChange={(e) =>
                              handleInlinePriceChange(index, e.target.value)
                            }
                            className="w-full h-7 pl-5 pr-2 text-xs font-medium text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/60 rounded-lg focus:outline-none focus:border-[rgb(var(--color-primary))]"
                          />
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="sm:col-span-2 text-right sm:pr-2">
                        <label className="block text-[10px] uppercase font-semibold text-[rgb(var(--color-text-secondary))] mb-1">
                          {t("common.total") || "Total"}
                        </label>
                        <p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                          ₹{itemTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <SharedTooltip content={t("common.remove") || "Remove item"}>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="opacity-60 group-hover:opacity-100 flex items-center justify-center w-8 h-8 cursor-pointer text-[rgb(var(--color-danger))] hover:bg-[rgb(var(--color-danger))]/10 rounded-lg transition-all shrink-0"
                        aria-label={t("common.remove") || "Remove"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </SharedTooltip>
                  </div>
                );
              })}
            </div>
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
}

export const BillItemsSectionView = memo(CreateBillItemsSectionPresentation);
export default BillItemsSectionView;
