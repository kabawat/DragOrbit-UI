"use client";
import { Calculator, Package, Truck } from "lucide-react";
export function OpeningQuantitySectionPresentation({ model }) {
  const {
    Input,
    t,
    formData,
    handleFieldChange,
    errors,
    Select,
    suppliersLoading,
    supplierOptions,
    showExpiryDate,
    openingValue,
  } = model;
  return (
    <>
      {/* Opening Quantity Information */}
      <div className="mb-8">
        {/* Opening Quantity and Purchase Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Opening Quantity */}
          <div>
            <Input
              type="number"
              label={t("products.openingQuantity")}
              placeholder="0"
              value={formData.openingStock?.quantity || ""}
              onChange={(value) =>
                handleFieldChange("openingStock.quantity", value)
              }
              error={errors.quantity}
              errorMessage={errors.quantity}
              leftIcon={Package}
              min={0}
              step={1}
              precision={0}
              className="transition-all duration-200 group-hover:shadow-sm"
            />
          </div>

          {/* Opening Purchase Price */}
          <div>
            <Input
              type="number"
              label={t("products.openingPurchasePrice")}
              placeholder="0.00"
              value={formData.openingStock?.purchasePrice || ""}
              onChange={(value) =>
                handleFieldChange("openingStock.purchasePrice", value)
              }
              error={errors.purchasePrice}
              errorMessage={errors.purchasePrice}
              leftIcon={() => (
                <span className="text-[rgb(var(--color-text-tertiary))] font-bold text-md">
                  ₹
                </span>
              )}
              min={0}
              step={0.01}
              precision={2}
              className="transition-all duration-200 group-hover:shadow-sm"
            />
          </div>
        </div>

        <div className="mb-6 relative">
          <Select
            label={t("products.supplier")}
            placeholder={
              suppliersLoading
                ? t("products.loadingSuppliers")
                : t("products.selectSupplier")
            }
            value={formData.openingStock?.supplier || ""}
            onChange={(value) =>
              handleFieldChange("openingStock.supplier", value)
            }
            error={errors.supplier}
            errorMessage={errors.supplier}
            leftIcon={Truck}
            searchable={true}
            options={supplierOptions}
            disabled={suppliersLoading}
          />
        </div>

        {/* Expiry Date - only when store/category has hasExpiryDate */}
        {showExpiryDate && (
          <div className="mb-6">
            <Input
              label={t("products.expiryDate")}
              type="date"
              placeholder="Select expiry date (optional)"
              value={formData.openingStock?.expiryDate || ""}
              onChange={(value) =>
                handleFieldChange("openingStock.expiryDate", value)
              }
              error={errors.expiryDate}
              errorMessage={errors.expiryDate}
            />
          </div>
        )}

        {/* Opening Stock Summary */}
        {formData.openingStock?.quantity ||
        formData.openingStock?.purchasePrice ? (
          <div className="p-6 bg-gradient-to-r from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-tertiary))] rounded-xl border border-[rgb(var(--color-border-primary))]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-[rgb(var(--color-primary))]" />
                {t("products.openingStockSummary")}
              </h4>
              <div className="text-xs text-[rgb(var(--color-text-tertiary))] bg-[rgb(var(--color-bg-primary))] px-2 py-1 rounded-full">
                {t("products.livePreview")}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Opening Quantity */}
              <div className="flex justify-between items-center p-3 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]">
                <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                  {t("products.openingQuantity")}:
                </span>
                <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                  {formData.openingStock?.quantity || 0} {formData.uom || "PCS"}
                </span>
              </div>

              {/* Purchase Price */}
              <div className="flex justify-between items-center p-3 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]">
                <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                  {t("products.purchasePrice")}:
                </span>
                <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                  ₹
                  {parseFloat(
                    formData.openingStock?.purchasePrice || 0,
                  ).toFixed(2)}
                </span>
              </div>

              {/* Total Value */}
              <div className="flex justify-between items-center p-3 rounded-lg border border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]">
                <span className="text-sm font-medium text-white">
                  {t("products.totalValue")}:
                </span>
                <span className="text-sm font-bold text-white">
                  ₹{openingValue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-4 p-3 bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))]">
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                💡 {t("products.openingStockInfo")}
              </p>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
