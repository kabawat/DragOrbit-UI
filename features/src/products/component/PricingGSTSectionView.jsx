"use client";

import {
  Barcode,
  Hash,
  IndianRupee,
  Package,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";
import { Input } from "@dragorbit/ui";
import { calculateSavings, generateAutoSku } from "../model/productForm.js";
import { VariantCardView } from "./VariantCardView.jsx";

const defaultT = (key, fallback) => fallback || key;

export function PricingGSTSectionView({
  formData = {},
  onChange = () => {},
  errors = {},
  hasVariants = false,
  onUploadImages,
  onDuplicate,
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

  // When product has multiple variants, Variant 1 uses the unified VariantCardView
  if (hasVariants) {
    return (
      <VariantCardView
        variantNumber={1}
        data={{
          ...formData,
          displayName:
            formData.displayName !== undefined
              ? formData.displayName
              : "",
          images:
            Array.isArray(formData.variantImages) && formData.variantImages.length > 0
              ? formData.variantImages
              : formData.images || [],
        }}
        baseProductName={formData.name || formData.productName || ""}
        errors={errors}
        canRemove={false}
        onFieldChange={(field, val) => {
          if (field === "images") {
            handleFieldChange("variantImages", val);
          } else {
            handleFieldChange(field, val);
          }
        }}
        onDuplicate={onDuplicate}
        onUploadImages={onUploadImages}
        t={t}
      />
    );
  }

  // When product does NOT have variants, render simple Pricing & Inventory form (Image 3)
  return (
    <div className="space-y-3.5">
      {/* Row 1: MRP & Selling Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <Input
            type="number"
            label={t("products.mrp", "MRP")}
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
              {t("products.sku", "SKU")}
            </span>
            <button
              type="button"
              onClick={handleAutoGenerateSku}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{t("products.autoSku", "Auto Sku")}</span>
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
            {t("products.barcode", "Barcode")}
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

      {/* Row 3: Initial Stock & Purchase Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <Input
            type="number"
            label={t("products.openingStock", "Opening Stock")}
            placeholder="0"
            value={
              typeof formData.openingStock === "object" && formData.openingStock !== null
                ? String(formData.openingStock.quantity || "")
                : formData.openingStock !== undefined && formData.openingStock !== null && formData.openingStock !== ""
                  ? String(formData.openingStock)
                  : formData.stock !== undefined && formData.stock !== null
                    ? String(formData.stock)
                    : ""
            }
            onChange={(val) => {
              handleFieldChange("stock", val);
              handleFieldChange("openingStock", val);
            }}
            error={errors.stock || errors.openingStock}
            errorMessage={errors.stock || errors.openingStock}
            leftIcon={Package}
            min={0}
          />
        </div>

        <div>
          <Input
            type="number"
            label={t("products.purchasePrice", "Purchase Price")}
            placeholder={t("products.enterAmount", "0.00")}
            value={
              formData.basePrice !== undefined &&
              formData.basePrice !== null &&
              formData.basePrice !== ""
                ? formData.basePrice
                : formData.purchasePrice || ""
            }
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
      </div>
    </div>
  );
}

// Backward compatibility export
export { PricingGSTSectionView as PricingGSTSectionPresentation };
export default PricingGSTSectionView;
