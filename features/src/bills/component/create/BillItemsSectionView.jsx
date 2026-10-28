"use client";
import { Button, Card, EmptyState, Input, Select, Tooltip as SharedTooltip } from "@dragorbit/ui";
import { Package, Plus, Trash2 } from "lucide-react";
export function CreateBillItemsSectionPresentation({ model }) {
  const {
    t,
    selectedProduct,
    setSelectedProduct,
    products,
    setSelectedPrice,
    productsLoading,
    selectedQuantity,
    setSelectedQuantity,
    selectedPrice,
    handleAddItem,
    formData,
    handleRemoveItem,
  } = model;
  return (
    <Card
      padding="none"
      className="!border-[rgb(var(--color-border-primary))]/30 h-full flex flex-col overflow-hidden"
    >
      <div className="p-4 flex flex-col h-full overflow-hidden">
        <div className="mb-4 flex-shrink-0">
          {/* Add Item Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5">
              <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("errors.selectProduct")} *
              </label>
              <Select
                size="sm"
                searchable={true}
                value={selectedProduct}
                onChange={(value) => {
                  setSelectedProduct(value);
                  // Auto-fill price if product is selected
                  const product = products.find(
                    (p) => (p.id || p._id) === value,
                  );
                  if (product) {
                    setSelectedPrice(product.purchasePrice || 0);
                  }
                }}
                options={[
                  {
                    value: "",
                    label: productsLoading
                      ? t("errors.loading")
                      : t("errors.selectProduct"),
                  },
                  ...products
                    .filter((product) => product.name || product.productName)
                    .map((product) => ({
                      value: product.id || product._id,
                      label: `${product.name || product.productName}`,
                    })),
                ]}
                leftIcon={Package}
                disabled={productsLoading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("common.quantity")} *
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

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("common.price")} *
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

            <div className="md:col-span-3">
              <Button
                type="button"
                variant="primary"
                onClick={handleAddItem}
                leftIcon={Plus}
                disabled={!selectedProduct}
              >
                {t("common.add")}
              </Button>
            </div>
          </div>
        </div>

        {/* Items List */}
        {formData.items.length > 0 ? (
          <div className="mt-6 flex-1 flex flex-col min-h-0">
            <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3 flex-shrink-0">
              {t("common.items")} ({formData.items.length})
            </h4>
            <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-2 min-h-0">
              {formData.items.map((item, index) => {
                const product = products.find(
                  (p) => (p.id || p._id) === item.product,
                );
                const itemTotal =
                  (item.quantity || 0) * (item.purchasePrice || 0);

                return (
                  <div
                    key={index}
                    className="group rounded-lg p-4 bg-[rgb(var(--color-bg-tertiary))]/30 hover:bg-[rgb(var(--color-bg-tertiary))]/50 transition-colors flex-shrink-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
                            {t("common.product")}
                          </label>
                          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                            {item.productName ||
                              product?.name ||
                              product?.productName ||
                              "N/A"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
                            {t("common.quantity")}
                          </label>
                          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                            {item.quantity}
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
                            {t("common.price")}
                          </label>
                          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                            ₹{item.purchasePrice?.toFixed(2) || "0.00"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
                            {t("common.total")}
                          </label>
                          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                            ₹{itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <SharedTooltip content={t("common.remove")}><button aria-label={t("common.remove")}
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="ml-4 opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 cursor-pointer text-[rgb(var(--color-danger))] hover:bg-[rgb(var(--color-danger))]/10 rounded-lg transition-all duration-200"

                      >
                        <Trash2 className="w-4 h-4" />
                      </button></SharedTooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title={t("bills.noItemsTile")}
            description={t("bills.noItemsdisc")}
            className="h-full"
            size="md"
          />
        )}
      </div>
    </Card>
  );
}
