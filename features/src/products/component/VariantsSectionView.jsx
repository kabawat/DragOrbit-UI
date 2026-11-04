"use client";

import { Plus } from "lucide-react";
import { useCallback } from "react";
import { createEmptyVariant } from "../model/productForm.js";
import { VariantCardView } from "./VariantCardView.jsx";

const defaultT = (key, fallback) => fallback || key;

export function VariantsSectionView({
  variants = [],
  onChange = () => {},
  hasVariants = false,
  baseFormData = {},
  disabled = false,
  onUploadImages,
  variant1Card = null,
  t = defaultT,
}) {
  const handleAddAnotherVariant = useCallback(() => {
    const nextIndex = variants.length + 1;
    const newVariant = createEmptyVariant(nextIndex, baseFormData);
    onChange([...variants, newVariant]);
  }, [variants, baseFormData, onChange]);

  const handleDuplicateVariant = (indexToDuplicate) => {
    const source = variants[indexToDuplicate];
    if (!source) return;

    const duplicated = {
      ...source,
      id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      displayName: source.displayName ? `${source.displayName} (Copy)` : "",
      images: [...(source.images || [])],
      sku: source.sku ? `${source.sku}-COPY` : "",
      barcode: "",
      isDefault: false,
      options: (source.options || []).map((opt) => ({
        ...opt,
        id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      })),
    };

    const nextVariants = [...variants];
    nextVariants.splice(indexToDuplicate + 1, 0, duplicated);
    onChange(nextVariants);
  };

  const handleRemoveVariant = (indexToRemove) => {
    const filtered = variants.filter((_, idx) => idx !== indexToRemove);
    onChange(filtered);
  };

  const handleVariantFieldChange = (index, field, value) => {
    const updated = [...variants];
    if (typeof field === "object" && field !== null) {
      updated[index] = {
        ...updated[index],
        ...field,
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    onChange(updated);
  };

  if (!hasVariants) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Variant Cards List - Vertically stacked */}
      <div className="space-y-4">
        {/* Variant 1 Card */}
        {variant1Card && (
          <div className="w-full">
            {variant1Card}
          </div>
        )}

        {/* Subsequent Variant Cards */}
        {variants.map((v, idx) => (
          <div key={v.id || idx} className="w-full">
            <VariantCardView
              variantNumber={idx + 2}
              data={v}
              baseProductName={baseFormData.name || baseFormData.productName || ""}
              canRemove={true}
              onFieldChange={(field, val) =>
                handleVariantFieldChange(idx, field, val)
              }
              onDuplicate={() => handleDuplicateVariant(idx)}
              onRemove={() => handleRemoveVariant(idx)}
              onUploadImages={
                onUploadImages
                  ? (files) => onUploadImages(files, idx)
                  : undefined
              }
              disabled={disabled}
              t={t}
            />
          </div>
        ))}
      </div>

      {/* Bottom "+ Add Another Variant" text button - ALWAYS at the bottom */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handleAddAnotherVariant}
          disabled={disabled || variants.length >= 4}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t("products.addAnotherVariant", "Add Another Variant")}</span>
        </button>
        <span className="text-xs text-[rgb(var(--color-text-tertiary))]">
          {variants.length + (variant1Card ? 1 : 0)} / 5 {t("products.variants", "Variants")}
        </span>
      </div>
    </div>
  );
}

export default VariantsSectionView;
