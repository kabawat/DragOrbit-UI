"use client";
import { Calculator, Hash, Info, Package } from "lucide-react";
export function PricingGSTSectionPresentation({ model }) {
  const {
    Input,
    t,
    formData,
    handleFieldChange,
    errors,
    Select,
    CURRENCY_OPTIONS,
    UOM_OPTIONS,
    hasStoreGst,
    savings,
    gstRateLabel,
    gstAmount,
    totalPrice,
  } = model;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="number"
          label={t("products.mrp")}
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
        />
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
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label={t("products.currency")}
          options={CURRENCY_OPTIONS}
          value={formData.currency || "INR"}
          onChange={(value) => handleFieldChange("currency", value)}
          error={errors.currency}
          errorMessage={errors.currency}
          required
          disabled
          searchable
          placeholder={t("products.selectCurrency")}
        />
        <Select
          label={t("products.unitOfMeasure")}
          options={UOM_OPTIONS}
          value={formData.uom || "PCS"}
          onChange={(value) => handleFieldChange("uom", value)}
          error={errors.uom}
          errorMessage={errors.uom}
          required
          leftIcon={Package}
          searchable
          placeholder={t("products.selectUnitOfMeasure")}
        />
        <Input
          label={t("products.hsnCode")}
          placeholder={t("products.enterHsnCode")}
          value={formData.gstInfo?.hsnCode || ""}
          onChange={(value) => handleFieldChange("gstInfo.hsnCode", value)}
          error={errors.hsnCode}
          errorMessage={errors.hsnCode}
          required={hasStoreGst}
          leftIcon={Hash}
          maxLength={8}
        />
      </div>

      {hasStoreGst ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
            {t("products.gstPricingMethod")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                formData.gstInfo?.isGstIncluded === false
                  ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary)/0.06)]"
                  : "border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] hover:border-[rgb(var(--color-primary)/0.4)]"
              }`}
            >
              <input
                type="radio"
                name="gstIncluded"
                value="excluded"
                checked={formData.gstInfo?.isGstIncluded === false}
                onChange={() =>
                  handleFieldChange("gstInfo.isGstIncluded", false)
                }
                className="w-4 h-4 text-[rgb(var(--color-primary))] border-[rgb(var(--color-border-primary))] focus:ring-[rgb(var(--color-primary))]"
              />
              <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                {t("products.gstExcluded")}
              </span>
            </label>

            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                formData.gstInfo?.isGstIncluded === true
                  ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary)/0.06)]"
                  : "border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] hover:border-[rgb(var(--color-primary)/0.4)]"
              }`}
            >
              <input
                type="radio"
                name="gstIncluded"
                value="included"
                checked={formData.gstInfo?.isGstIncluded === true}
                onChange={() =>
                  handleFieldChange("gstInfo.isGstIncluded", true)
                }
                className="w-4 h-4 text-[rgb(var(--color-primary))] border-[rgb(var(--color-border-primary))] focus:ring-[rgb(var(--color-primary))]"
              />
              <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                {t("products.gstIncluded")}
              </span>
            </label>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[rgb(var(--color-text-secondary))] flex items-start gap-2 rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] p-3">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{t("products.noGstInfoMessage")}</span>
        </p>
      )}

      <div className="p-5 sm:p-6 rounded-lg border border-[rgb(var(--color-border-primary))] bg-gradient-to-r from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-tertiary))]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-[rgb(var(--color-text-primary))] flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[rgb(var(--color-primary))]" />
            {t("products.priceSummary")}
          </h4>
          <span className="text-xs text-[rgb(var(--color-text-tertiary))] bg-[rgb(var(--color-bg-primary))] px-2 py-1 rounded-full">
            {t("products.livePreview")}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <div className="p-3 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]">
            <span className="text-[0.6875rem] font-medium text-[rgb(var(--color-text-secondary))] block mb-1">
              {t("products.mrp")}
            </span>
            <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              ₹{(parseFloat(formData.mrp) || 0).toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg border border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]">
            <span className="text-[0.6875rem] font-medium text-white/80 block mb-1">
              {t("products.sellingPrice")}
            </span>
            <span className="text-sm font-bold text-white">
              ₹{(parseFloat(formData.sellingPrice) || 0).toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]">
            <span className="text-[0.6875rem] font-medium text-[rgb(var(--color-text-secondary))] block mb-1">
              {t("products.youSave")}
            </span>
            <span className="text-sm font-semibold text-[rgb(var(--color-primary))]">
              ₹{savings.amount.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]">
            <span className="text-[0.6875rem] font-medium text-[rgb(var(--color-text-secondary))] block mb-1">
              {t("products.discount")}
            </span>
            <span className="text-sm font-semibold text-green-600">
              {savings.percentage}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          <div className="p-3 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]">
            <span className="text-[0.6875rem] font-medium text-[rgb(var(--color-text-secondary))] block mb-1">
              {t("products.hsnCode")}
            </span>
            <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))] truncate block">
              {formData.gstInfo?.hsnCode || "—"}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]">
            <span className="text-[0.6875rem] font-medium text-[rgb(var(--color-text-secondary))] block mb-1">
              {t("products.gstStatus")}
            </span>
            <span
              className={`text-sm font-semibold ${
                formData.gstInfo?.isGstIncluded
                  ? "text-green-600"
                  : "text-blue-600"
              }`}
            >
              {formData.gstInfo?.isGstIncluded
                ? t("products.included")
                : t("products.excluded")}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] col-span-2 sm:col-span-1">
            <span className="text-[0.6875rem] font-medium text-[rgb(var(--color-text-secondary))] block mb-1">
              {t("products.gstRate")}
            </span>
            <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              {gstRateLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex justify-between items-center py-2.5 px-3.5 rounded-lg bg-[rgb(var(--color-primary))] text-white">
            <span className="text-sm font-medium opacity-90">
              {t("products.gstAmount")}
            </span>
            <span className="text-base font-bold">₹{gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-3.5 rounded-lg bg-green-500 text-white">
            <span className="text-sm font-medium opacity-90">
              {t("products.totalPrice")}
            </span>
            <span className="text-base font-bold">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
