"use client";

import {
  Barcode,
  Copy,
  Hash,
  Image as ImageIcon,
  IndianRupee,
  Layers,
  Loader2,
  Package,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Button, Input } from "@dragorbit/ui";
import {
  calculateSavings,
  createEmptyVariant,
  generateAutoSku,
} from "../model/productForm.js";

const defaultT = (key, fallback) => fallback || key;

export function VariantsSectionView({
  variants = [],
  onChange = () => {},
  hasVariants = false,
  onHasVariantsChange = () => {},
  baseFormData = {},
  disabled = false,
  onUploadImages,
  t = defaultT,
}) {
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null);

  const handleUploadFiles = async (variantIndex, files) => {
    if (!files || files.length === 0) return;
    setUploadingVariantIndex(variantIndex);

    try {
      if (typeof onUploadImages === "function") {
        const uploadedUrls = await onUploadImages(files, variantIndex);
        if (Array.isArray(uploadedUrls) && uploadedUrls.length > 0) {
          const updated = [...variants];
          const existingImages = Array.isArray(updated[variantIndex]?.images)
            ? updated[variantIndex].images
            : [];
          updated[variantIndex] = {
            ...updated[variantIndex],
            images: [...existingImages, ...uploadedUrls],
          };
          onChange(updated);
        }
      } else {
        // Fallback: create object URLs for offline or desktop preview
        const localUrls = Array.from(files).map((f) => URL.createObjectURL(f));
        const updated = [...variants];
        const existingImages = Array.isArray(updated[variantIndex]?.images)
          ? updated[variantIndex].images
          : [];
        updated[variantIndex] = {
          ...updated[variantIndex],
          images: [...existingImages, ...localUrls],
        };
        onChange(updated);
      }
    } catch (err) {
      console.error("Variant image upload failed:", err);
    } finally {
      setUploadingVariantIndex(null);
    }
  };

  const handleRemoveVariantImage = (variantIndex, imageIndex) => {
    const updated = [...variants];
    const existingImages = Array.isArray(updated[variantIndex]?.images)
      ? [...updated[variantIndex].images]
      : [];
    existingImages.splice(imageIndex, 1);
    updated[variantIndex] = {
      ...updated[variantIndex],
      images: existingImages,
    };
    onChange(updated);
  };

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

  const handleOptionChange = (variantIndex, optionIndex, key, val) => {
    const updated = [...variants];
    const currentOptions = [...(updated[variantIndex].options || [])];
    currentOptions[optionIndex] = {
      ...currentOptions[optionIndex],
      [key]: val,
    };
    updated[variantIndex] = {
      ...updated[variantIndex],
      options: currentOptions,
    };

    const autoDisplayName = currentOptions
      .map((o) => o.value?.trim())
      .filter(Boolean)
      .join(" / ");
    if (
      autoDisplayName &&
      (!updated[variantIndex].displayName || updated[variantIndex]._autoNamed)
    ) {
      updated[variantIndex].displayName = autoDisplayName;
      updated[variantIndex]._autoNamed = true;
    }

    onChange(updated);
  };

  const handleAddOption = (variantIndex) => {
    const updated = [...variants];
    const currentOptions = [...(updated[variantIndex].options || [])];
    currentOptions.push({
      id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: "",
      value: "",
    });
    updated[variantIndex] = {
      ...updated[variantIndex],
      options: currentOptions,
    };
    onChange(updated);
  };

  const handleRemoveOption = (variantIndex, optionIndex) => {
    const updated = [...variants];
    const currentOptions = [...(updated[variantIndex].options || [])];
    currentOptions.splice(optionIndex, 1);
    updated[variantIndex] = {
      ...updated[variantIndex],
      options: currentOptions,
    };
    onChange(updated);
  };

  const handleAutoSku = (variantIndex) => {
    const target = variants[variantIndex];
    const baseName =
      target?.displayName || baseFormData?.name || `VAR-${variantIndex + 2}`;
    const autoSku = generateAutoSku(baseName);
    handleVariantFieldChange(variantIndex, "sku", autoSku);
  };

  if (!hasVariants) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[rgb(var(--color-text-primary))]">
              {t("products.additionalVariants", "Additional Variants (अतिरिक्त वेरिएंट्स)")}
            </h3>
            <p className="text-xs text-[rgb(var(--color-text-secondary))]">
              {t(
                "products.additionalVariantsSubtitle",
                "Variant #1 is configured above in Primary Details. Add Variant #2, #3, etc. below."
              )}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleAddAnotherVariant}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t("products.addAnotherVariant", "+ Add Another Variant")}</span>
        </Button>
      </div>

      {/* Variant Cards List */}
      <div className="space-y-4">
        {variants.map((v, idx) => {
          const variantNumber = idx + 2;
          const savings = calculateSavings(
            v.mrp || baseFormData.mrp,
            v.sellingPrice || baseFormData.sellingPrice
          );

          return (
            <div
              key={v.id || idx}
              className="relative p-4 sm:p-5 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] shadow-xs space-y-4 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[rgb(var(--color-border-primary)/0.6)]">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {t("products.variantBadge", `Variant #${variantNumber}`)}
                  </span>
                  <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))] truncate max-w-xs sm:max-w-md">
                    {v.displayName || t("products.unnamedVariant", "Unnamed Variant")}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDuplicateVariant(idx)}
                    title={t("products.duplicateVariant", "Duplicate Variant")}
                    className="p-1.5 rounded-lg text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    title={t("products.removeVariant", "Remove Variant")}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Row 1: Variant Title / Name & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label={t(
                      "products.variantDisplayName",
                      `Variant #${variantNumber} Name (वेरिएंट का नाम)`
                    )}
                    placeholder={
                      baseFormData.name
                        ? `${baseFormData.name} - Variant ${variantNumber}`
                        : t("products.enterVariantName", "e.g. Red, XL, 128GB")
                    }
                    value={v.displayName || ""}
                    onChange={(val) => {
                      handleVariantFieldChange(idx, {
                        displayName: val,
                        _autoNamed: false,
                      });
                    }}
                    leftIcon={Package}
                    required
                    className="text-sm font-medium"
                  />
                </div>

                <div>
                  <span className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
                    {t("products.status", "Status")}
                  </span>
                  <select
                    value={v.status || "ACTIVE"}
                    onChange={(e) =>
                      handleVariantFieldChange(idx, "status", e.target.value)
                    }
                    className="w-full h-10 px-3 text-xs font-medium rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">{t("products.active", "Active")}</option>
                    <option value="INACTIVE">{t("products.inactive", "Inactive")}</option>
                    <option value="DRAFT">{t("products.draft", "Draft")}</option>
                  </select>
                </div>
              </div>

              {/* Options tags (Size, Color, etc.) */}
              <div className="p-3 rounded-lg bg-[rgb(var(--color-bg-secondary)/0.4)] border border-[rgb(var(--color-border-primary)/0.6)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                    <Tag className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t("products.variantAttributes", "Attributes (e.g. Color, Size)")}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddOption(idx)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t("products.addAttribute", "+ Add Attribute")}</span>
                  </button>
                </div>

                {(!v.options || v.options.length === 0) && (
                  <p className="text-[11px] text-[rgb(var(--color-text-tertiary))] italic">
                    {t(
                      "products.noAttributesHint",
                      "No custom attributes added yet. Click '+ Add Attribute' to specify Color, Size, etc."
                    )}
                  </p>
                )}

                {v.options?.map((opt, optIdx) => (
                  <div key={opt.id || optIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={t("products.attributeName", "Name (e.g. Color)")}
                      value={opt.name || ""}
                      onChange={(e) =>
                        handleOptionChange(idx, optIdx, "name", e.target.value)
                      }
                      className="w-1/3 h-8 px-2.5 text-xs rounded-md border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]"
                    />
                    <input
                      type="text"
                      placeholder={t("products.attributeValue", "Value (e.g. Blue)")}
                      value={opt.value || ""}
                      onChange={(e) =>
                        handleOptionChange(idx, optIdx, "value", e.target.value)
                      }
                      className="flex-1 h-8 px-2.5 text-xs rounded-md border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx, optIdx)}
                      className="p-1 rounded text-gray-400 hover:text-rose-500 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Row 2: MRP & Selling Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <Input
                    type="number"
                    label={t("products.mrp", "MRP (Maximum Retail Price)")}
                    placeholder={
                      baseFormData.mrp
                        ? String(baseFormData.mrp)
                        : t("products.enterAmount", "0.00")
                    }
                    value={v.mrp || ""}
                    onChange={(val) => handleVariantFieldChange(idx, "mrp", val)}
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
                    placeholder={
                      baseFormData.sellingPrice
                        ? String(baseFormData.sellingPrice)
                        : t("products.enterAmount", "0.00")
                    }
                    value={v.sellingPrice || ""}
                    onChange={(val) =>
                      handleVariantFieldChange(idx, "sellingPrice", val)
                    }
                    required
                    leftIcon={IndianRupee}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>

              {/* Row 3: SKU & Barcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
                      {t("products.sku", "SKU (Item Code)")}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAutoSku(idx)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{t("products.autoSku", "Auto SKU")}</span>
                    </button>
                  </div>
                  <Input
                    placeholder={t("products.enterSku", "e.g. PRD-V2-1001")}
                    value={v.sku || ""}
                    onChange={(val) =>
                      handleVariantFieldChange(
                        idx,
                        "sku",
                        (val || "").toUpperCase()
                      )
                    }
                    leftIcon={Hash}
                  />
                </div>

                <div>
                  <span className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
                    {t("products.barcode", "Barcode / UPC / EAN")}
                  </span>
                  <Input
                    placeholder={t("products.enterBarcode", "Scan or enter barcode")}
                    value={v.barcode || ""}
                    onChange={(val) =>
                      handleVariantFieldChange(idx, "barcode", val)
                    }
                    leftIcon={Barcode}
                  />
                </div>
              </div>

              {/* Row 4: Initial Stock & Conditional Purchase Price (Only when stock is added) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <Input
                    type="number"
                    label={t("products.openingStock", "Initial Stock (Quantity)")}
                    placeholder="0"
                    value={
                      v.stock !== undefined && v.stock !== null ? v.stock : ""
                    }
                    onChange={(val) =>
                      handleVariantFieldChange(idx, "stock", val)
                    }
                    leftIcon={Package}
                    min={0}
                  />
                </div>

                {v.stock !== undefined &&
                  v.stock !== "" &&
                  Number(v.stock) > 0 && (
                    <div>
                      <Input
                        type="number"
                        label={t("products.purchasePrice", "Purchase / Cost Price")}
                        placeholder={t("products.enterAmount", "0.00")}
                        value={v.basePrice || v.purchasePrice || ""}
                        onChange={(val) => {
                          handleVariantFieldChange(idx, {
                            basePrice: val,
                            purchasePrice: val,
                          });
                        }}
                        leftIcon={IndianRupee}
                        min={0}
                        step={0.01}
                      />
                    </div>
                  )}
              </div>

              {/* Variant Images Gallery */}
              <div className="space-y-2 pt-2 border-t border-[rgb(var(--color-border-primary)/0.4)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
                    {t("products.variantPhotos", "Variant Photos")}
                  </span>
                  <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>{t("products.uploadPhotos", "+ Upload Photos")}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadFiles(idx, e.target.files)}
                      disabled={uploadingVariantIndex === idx}
                    />
                  </label>
                </div>

                {uploadingVariantIndex === idx && (
                  <div className="flex items-center gap-2 py-2 text-xs text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("products.uploadingPhotos", "Uploading photos...")}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {v.images?.map((img, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="relative group w-14 h-14 rounded-lg overflow-hidden border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]"
                    >
                      <img
                        src={typeof img === "string" ? img : img?.url}
                        alt={`Variant ${variantNumber} photo ${imgIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantImage(idx, imgIdx)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title={t("products.removePhoto", "Remove")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {(!v.images || v.images.length === 0) &&
                    uploadingVariantIndex !== idx && (
                      <p className="text-[11px] text-[rgb(var(--color-text-tertiary))] italic">
                        {t(
                          "products.noVariantPhotos",
                          "No photos uploaded yet for this variant (will fallback to product cover image if left empty)."
                        )}
                      </p>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom "+ Add Another Variant" button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleAddAnotherVariant}
          disabled={disabled}
          className="w-full py-2.5 rounded-xl border border-dashed border-[rgb(var(--color-primary)/0.4)] hover:border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary)/0.03)] hover:bg-[rgb(var(--color-primary)/0.08)] text-[rgb(var(--color-primary))] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t("products.addAnotherVariant", "+ Add Another Variant")}</span>
        </button>
      </div>
    </div>
  );
}

export default VariantsSectionView;
