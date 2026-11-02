"use client";

import {
  Barcode,
  Hash,
  IndianRupee,
  Info,
  Package,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";
import { Input } from "@dragorbit/ui";
import { calculateSavings, generateAutoSku } from "../model/productForm.js";

const defaultT = (key, fallback) => fallback || key;

export function PricingGSTSectionView({
  formData = {},
  onChange = () => {},
  errors = {},
  hasVariants = false,
  t = defaultT,
}) {
  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  const handleAutoGenerateSku = () => {
    const sku = generateAutoSku(formData.name);
    handleFieldChange("sku", sku);
  };

  const savings = useMemo(() => {
    return calculateSavings(formData.mrp, formData.sellingPrice);
  }, [formData.mrp, formData.sellingPrice]);

  return (
    <div className="space-y-3.5">
      {hasVariants && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              {t(
                "products.variantsPricingNotice",
                "Variants mode active: Product title is common. Enter specific variant details (Variant Name, MRP, Price, Stock, SKU) below."
              )}
            </span>
          </div>

          <div>
            <Input
              label={t(
                "products.variantDisplayName",
                "Variant Name (वेरिएंट का नाम)"
              )}
              placeholder={
                formData.name
                  ? `${formData.name} - Variant 1`
                  : t(
                      "products.enterVariantDisplayName",
                      "Enter variant name (e.g. Red, 64GB, Size M)"
                    )
              }
              value={formData.displayName || ""}
              onChange={(val) => handleFieldChange("displayName", val)}
              error={errors.displayName}
              errorMessage={errors.displayName}
              leftIcon={Package}
              helperText={t(
                "products.variantDisplayNameHelp",
                "Specific name for this variant. Product title remains common across all variants."
              )}
              className="text-sm font-medium"
            />
          </div>
        </div>
      )}

      {/* Row 1: MRP & Selling Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <Input
            type="number"
            label={t("products.mrp", "MRP (Maximum Retail Price)")}
            placeholder={t("products.enterAmount", "0.00")}
            value={formData.mrp || ""}
            onChange={(val) => handleFieldChange("mrp", val)}
            error={errors.mrp}
            errorMessage={errors.mrp}
            required
            leftIcon={IndianRupee}
            min={0}
            step={0.01}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
              {t("products.sellingPrice", "Selling Price")}{" "}
              <span className="text-rose-500">*</span>
            </span>
            {savings.percentage > 0 && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {savings.percentage}% OFF (Save ₹{savings.amount})
              </span>
            )}
          </div>
          <Input
            type="number"
            placeholder={t("products.enterAmount", "0.00")}
            value={formData.sellingPrice || ""}
            onChange={(val) => handleFieldChange("sellingPrice", val)}
            error={errors.sellingPrice}
            errorMessage={errors.sellingPrice}
            required
            leftIcon={IndianRupee}
            min={0}
            step={0.01}
          />
        </div>
      </div>

      {/* Row 2: SKU & Barcode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
              {t("products.sku", "SKU (Item Code)")}
            </span>
            <button
              type="button"
              onClick={handleAutoGenerateSku}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{t("products.autoSku", "Auto SKU")}</span>
            </button>
          </div>
          <Input
            placeholder={t("products.enterSku", "e.g. PRD-1001")}
            value={formData.sku || ""}
            onChange={(val) =>
              handleFieldChange("sku", (val || "").toUpperCase())
            }
            error={errors.sku}
            errorMessage={errors.sku}
            leftIcon={Hash}
          />
        </div>

        <div>
          <span className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
            {t("products.barcode", "Barcode / UPC / EAN")}
          </span>
          <Input
            placeholder={t("products.enterBarcode", "Scan or enter barcode")}
            value={formData.barcode || ""}
            onChange={(val) => handleFieldChange("barcode", val)}
            error={errors.barcode}
            errorMessage={errors.barcode}
            leftIcon={Barcode}
          />
        </div>
      </div>

      {/* Row 3: Initial Stock & Conditional Purchase Price (Only when stock is added) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <Input
            type="number"
            label={t("products.openingStock", "Initial Stock (Quantity)")}
            placeholder="0"
            value={
              formData.stock !== undefined && formData.stock !== null
                ? formData.stock
                : ""
            }
            onChange={(val) => handleFieldChange("stock", val)}
            error={errors.stock}
            errorMessage={errors.stock}
            leftIcon={Package}
            min={0}
          />
        </div>

        {formData.stock !== undefined &&
          formData.stock !== "" &&
          Number(formData.stock) > 0 && (
            <div>
              <Input
                type="number"
                label={t("products.purchasePrice", "Purchase / Cost Price")}
                placeholder={t("products.enterAmount", "0.00")}
                value={formData.basePrice || formData.purchasePrice || ""}
                onChange={(val) => {
                  handleFieldChange("basePrice", val);
                  handleFieldChange("purchasePrice", val);
                }}
                error={errors.purchasePrice || errors.basePrice}
                errorMessage={errors.purchasePrice || errors.basePrice}
                leftIcon={IndianRupee}
                min={0}
                step={0.01}
              />
            </div>
          )}
      </div>
    </div>
  );
}

// Backward compatibility export
export { PricingGSTSectionView as PricingGSTSectionPresentation };
export default PricingGSTSectionView;
