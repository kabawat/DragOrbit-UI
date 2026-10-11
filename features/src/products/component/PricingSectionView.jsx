"use client";
import { Package } from "lucide-react";
export function PricingSectionPresentation({ model }) {
  const {
    Input,
    t,
    formData,
    handleFieldChange,
    errors,
    Select,
    currencyOptions,
    uomOptions,
  } = model;
  return (
    <>
      {/* Price Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MRP */}
        <div>
          <Input
            type="number"
            label={t("products.mrpMaximumRetailPrice")}
            placeholder={t("products.enterAmount")}
            value={formData.mrp || ""}
            onChange={(value) => handleFieldChange("mrp", value)}
            error={errors.mrp}
            errorMessage={errors.mrp}
            required
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

        {/* Selling Price */}
        <div>
          <Input
            type="number"
            label={t("products.sellingPrice")}
            placeholder={t("products.enterAmount")}
            value={formData.sellingPrice || ""}
            onChange={(value) => handleFieldChange("sellingPrice", value)}
            error={errors.sellingPrice}
            errorMessage={errors.sellingPrice}
            required
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

      {/* Currency and UOM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <Select
          label={t("products.currency")}
          options={currencyOptions}
          value={formData.currency || "INR"}
          onChange={(value) => handleFieldChange("currency", value)}
          error={errors.currency}
          errorMessage={errors.currency}
          required
          searchable
          placeholder={t("products.selectCurrency")}
        />
        <Select
          label={t("products.unitOfMeasure")}
          options={uomOptions}
          value={formData.uom || "PCS"}
          onChange={(value) => handleFieldChange("uom", value)}
          error={errors.uom}
          errorMessage={errors.uom}
          required
          leftIcon={Package}
          searchable
          placeholder={t("products.selectUnitOfMeasure")}
        />
      </div>

      {/* Price Summary - Always Visible */}
      <div className="mt-8 p-6 bg-gradient-to-r from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-tertiary))] rounded-xl border border-[rgb(var(--color-border-primary))] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] flex items-center">
            <span className="text-[rgb(var(--color-primary))] font-bold text-xl mr-2">
              ₹
            </span>
            {t("products.priceSummary")}
          </h4>
          <div className="text-xs text-[rgb(var(--color-text-tertiary))] bg-[rgb(var(--color-bg-primary))] px-2 py-1 rounded-full">
            {t("products.livePreview")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Prices */}
          <div className="space-y-3">
            {formData.mrp ? (
              <div className="flex justify-between items-center p-3 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]">
                <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                  {t("products.mrp")}:
                </span>
                <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                  ₹{parseFloat(formData.mrp).toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center p-3 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] opacity-50">
                <span className="text-sm font-medium text-[rgb(var(--color-text-tertiary))]">
                  {t("products.mrp")}:
                </span>
                <span className="text-sm font-semibold text-[rgb(var(--color-text-tertiary))]">
                  ₹0.00
                </span>
              </div>
            )}

            {formData.sellingPrice ? (
              <div className="flex justify-between items-center p-3 rounded-lg border border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]">
                <span className="text-sm font-medium text-white">
                  {t("products.sellingPrice")}:
                </span>
                <span className="text-sm font-bold text-white">
                  ₹{parseFloat(formData.sellingPrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center p-3 rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] opacity-50">
                <span className="text-sm font-medium text-[rgb(var(--color-text-tertiary))]">
                  {t("products.sellingPrice")}:
                </span>
                <span className="text-sm font-bold text-[rgb(var(--color-text-tertiary))]">
                  ₹0.00
                </span>
              </div>
            )}
          </div>

          {/* Right Column - Savings */}
          <div className="space-y-3">
            {formData.mrp &&
            formData.sellingPrice &&
            parseFloat(formData.mrp) > parseFloat(formData.sellingPrice) ? (
              <div className="flex justify-between items-center p-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {t("products.youSave")}:
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  ₹
                  {(
                    parseFloat(formData.mrp) - parseFloat(formData.sellingPrice)
                  ).toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center p-3 bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))] opacity-50">
                <span className="text-sm font-medium text-[rgb(var(--color-text-tertiary))]">
                  {t("products.youSave")}:
                </span>
                <span className="text-sm font-semibold text-[rgb(var(--color-text-tertiary))]">
                  ₹0.00
                </span>
              </div>
            )}

            {formData.mrp &&
            formData.sellingPrice &&
            parseFloat(formData.mrp) > parseFloat(formData.sellingPrice) ? (
              <div className="flex justify-between items-center p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {t("products.discount")}:
                </span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {Math.round(
                    ((parseFloat(formData.mrp) -
                      parseFloat(formData.sellingPrice)) /
                      parseFloat(formData.mrp)) *
                      100,
                  )}
                  %
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center p-3 bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))] opacity-50">
                <span className="text-sm font-medium text-[rgb(var(--color-text-tertiary))]">
                  {t("products.discount")}:
                </span>
                <span className="text-sm font-semibold text-[rgb(var(--color-text-tertiary))]">
                  0%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
