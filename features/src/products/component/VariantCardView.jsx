"use client";

import {
  Barcode,
  Copy,
  Hash,
  IndianRupee,
  Loader2,
  Package,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@dragorbit/ui";
import { calculateSavings, generateAutoSku } from "../model/productForm.js";

const defaultT = (key, fallback) => fallback || key;

export function VariantCardView({
  variantNumber = 1,
  data = {},
  baseProductName = "",
  errors = {},
  canRemove = false,
  onFieldChange = () => {},
  onDuplicate,
  onRemove,
  onUploadImages,
  t = defaultT,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  const getInitialSuffix = () => {
    if (data.variantSuffix !== undefined && data.variantSuffix !== null) {
      return String(data.variantSuffix);
    }
    const disp = String(data.displayName || "").trim();
    const base = String(baseProductName || "").trim();
    if (!disp) return "";
    if (!base) return disp;
    if (disp.toLowerCase().startsWith(base.toLowerCase())) {
      const remainder = disp.slice(base.length);
      if (remainder.startsWith(" - ")) return remainder.slice(3);
      if (remainder.startsWith(" + ")) return remainder.slice(3);
      if (remainder.startsWith(" ")) return remainder.slice(1);
      if (remainder.startsWith("-") || remainder.startsWith("+")) {
        return remainder.slice(1).trimStart();
      }
      return remainder.trimStart();
    }
    return disp;
  };

  const [suffix, setSuffix] = useState(getInitialSuffix);

  useEffect(() => {
    setSuffix(getInitialSuffix());
  }, [data.displayName, baseProductName]);

  const handleSuffixChange = (e) => {
    const val = e.target.value;
    setSuffix(val);

    const base = String(baseProductName || "").trim();
    let fullDisplayName = "";
    if (base && val.trim()) {
      fullDisplayName = `${base} ${val.trim()}`;
    } else if (base) {
      fullDisplayName = base;
    } else {
      fullDisplayName = val.trim();
    }

    onFieldChange("displayName", fullDisplayName);
    onFieldChange("variantSuffix", val);
  };

  const savings = useMemo(() => {
    return calculateSavings(data.mrp, data.sellingPrice);
  }, [data.mrp, data.sellingPrice]);

  const handleAutoSku = () => {
    const sku = generateAutoSku(data.displayName || baseProductName);
    onFieldChange("sku", sku);
  };

  const handleAddOption = () => {
    const current = Array.isArray(data.options) ? [...data.options] : [];
    const newOption = {
      id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: "",
      value: "",
    };
    onFieldChange("options", [...current, newOption]);
  };

  const handleOptionChange = (optIdx, field, value) => {
    const current = Array.isArray(data.options) ? [...data.options] : [];
    if (!current[optIdx]) return;
    current[optIdx] = {
      ...current[optIdx],
      [field]: value,
    };
    onFieldChange("options", current);
  };

  const handleRemoveOption = (optIdx) => {
    const current = Array.isArray(data.options) ? [...data.options] : [];
    current.splice(optIdx, 1);
    onFieldChange("options", current);
  };

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      if (onUploadImages) {
        const uploaded = await onUploadImages(files);
        if (uploaded && uploaded.length > 0) {
          const existing = Array.isArray(data.images) ? data.images : [];
          onFieldChange("images", [...existing, ...uploaded]);
        }
      } else {
        const local = Array.from(files).map((f) => URL.createObjectURL(f));
        const existing = Array.isArray(data.images) ? data.images : [];
        onFieldChange("images", [...existing, ...local]);
      }
    } catch (err) {
      console.error("Variant image upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (imgIdx) => {
    const existing = Array.isArray(data.images) ? [...data.images] : [];
    existing.splice(imgIdx, 1);
    onFieldChange("images", existing);
  };

  return (
    <div className="relative p-4 sm:p-5 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] shadow-xs space-y-4 transition-all">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[rgb(var(--color-border-primary)/0.6)]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
            Variant {variantNumber}
          </span>
          {data.displayName ? (
            <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))] truncate max-w-xs sm:max-w-md">
              - {data.displayName}
            </span>
          ) : baseProductName ? (
            <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))] truncate max-w-xs sm:max-w-md">
              - {baseProductName}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              title={t("products.duplicateVariant", "Duplicate Variant")}
              className="p-1.5 rounded-lg text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}

          {canRemove && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              title={t("products.removeVariant", "Remove Variant")}
              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Variant Title / Name & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="sm:col-span-2">
          <span className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
            {t("products.variantDisplayName", "Variant Display Name")}{" "}
            <span className="text-rose-500">*</span>
          </span>

          <div
            onClick={() => inputRef.current?.focus()}
            className={`tag-input-container relative flex items-center w-full h-10 px-3 rounded-lg transition-all duration-200 cursor-text ${
              errors.displayName ? "!border-red-500 !bg-red-50" : ""
            }`}
            style={{
              border: errors.displayName
                ? "1px solid #ef4444"
                : "1px solid rgb(var(--color-border-primary))",
              backgroundColor: errors.displayName
                ? "#fef2f2"
                : "rgb(var(--color-bg-primary))",
            }}
          >
            {/* Left Icon */}
            <Package className="w-4 h-4 text-[rgb(var(--color-text-tertiary))] shrink-0 mr-2 pointer-events-none" />

            {/* Non-editable Product Name Prefix */}
            {baseProductName ? (
              <span
                className="text-xs sm:text-sm font-semibold text-[rgb(var(--color-text-primary))] shrink-0 truncate max-w-[50%] select-none pointer-events-none mr-1.5"
                title={`${t("products.productName", "Product Name")}: ${baseProductName}`}
              >
                {baseProductName}
              </span>
            ) : null}

            {/* Editable Variant Name Suffix Input */}
            <input
              ref={inputRef}
              type="text"
              placeholder={
                baseProductName
                  ? t("products.enterVariantSuffix", "Enter variant suffix (e.g. 64GB, Red)")
                  : t("products.enterVariantName", "e.g. Red, XL, 128GB")
              }
              value={suffix}
              onChange={handleSuffixChange}
              className="flex-1 min-w-0 h-full bg-transparent text-xs sm:text-sm font-medium text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] border-0 !border-none outline-none focus:outline-none focus:ring-0 focus:shadow-none !shadow-none p-0 m-0"
              style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
                backgroundColor: "transparent",
                WebkitAppearance: "none",
              }}
            />
          </div>

          {errors.displayName && (
            <p className="mt-1 text-xs text-rose-500">{errors.displayName}</p>
          )}
        </div>

        <div>
          <span className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
            {t("products.status", "Status")}
          </span>
          <select
            value={data.status || "ACTIVE"}
            onChange={(e) => onFieldChange("status", e.target.value)}
            className="w-full h-10 px-3 text-xs font-medium rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] focus:outline-none"
          >
            <option value="ACTIVE">{t("products.active", "Active")}</option>
            <option value="INACTIVE">{t("products.inactive", "Inactive")}</option>
            <option value="DRAFT">{t("products.draft", "Draft")}</option>
          </select>
        </div>
      </div>

      {/* Row 2: MRP & Selling Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <Input
            type="number"
            label={t("products.mrp", "MRP")}
            placeholder="0.00"
            value={data.mrp !== undefined && data.mrp !== null ? String(data.mrp) : ""}
            onChange={(val) => onFieldChange("mrp", val)}
            required
            leftIcon={IndianRupee}
            min={0}
            step={0.01}
            error={errors.mrp}
            errorMessage={errors.mrp}
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
            placeholder="0.00"
            value={data.sellingPrice !== undefined && data.sellingPrice !== null ? String(data.sellingPrice) : ""}
            onChange={(val) => onFieldChange("sellingPrice", val)}
            required
            leftIcon={IndianRupee}
            min={0}
            step={0.01}
            error={errors.sellingPrice}
            errorMessage={errors.sellingPrice}
          />
        </div>
      </div>

      {/* Row 3: SKU & Barcode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
              {t("products.sku", "SKU")}
            </span>
            <button
              type="button"
              onClick={handleAutoSku}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{t("products.autoSku", "Auto Sku")}</span>
            </button>
          </div>
          <Input
            placeholder={t("products.enterSku", `e.g. PRD-V${variantNumber}-1001`)}
            value={data.sku || ""}
            onChange={(val) => onFieldChange("sku", (val || "").toUpperCase())}
            leftIcon={Hash}
            error={errors.sku}
            errorMessage={errors.sku}
          />
        </div>

        <div>
          <span className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
            {t("products.barcode", "Barcode")}
          </span>
          <Input
            placeholder={t("products.enterBarcode", "Scan or enter barcode")}
            value={data.barcode || ""}
            onChange={(val) => onFieldChange("barcode", val)}
            leftIcon={Barcode}
            error={errors.barcode}
            errorMessage={errors.barcode}
          />
        </div>
      </div>

      {/* Row 4: Initial Stock & Purchase Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <Input
            type="number"
            label={t("products.openingStock", "Opening Stock")}
            placeholder="0"
            value={
              typeof data.openingStock === "object" && data.openingStock !== null
                ? String(data.openingStock.quantity || "")
                : data.openingStock !== undefined && data.openingStock !== null && data.openingStock !== ""
                  ? String(data.openingStock)
                  : data.stock !== undefined && data.stock !== null
                    ? String(data.stock)
                    : ""
            }
            onChange={(val) => {
              onFieldChange("stock", val);
              onFieldChange("openingStock", val);
            }}
            leftIcon={Package}
            min={0}
            error={errors.stock || errors.openingStock}
            errorMessage={errors.stock || errors.openingStock}
          />
        </div>

        <div>
          <Input
            type="number"
            label={t("products.purchasePrice", "Purchase Price")}
            placeholder="0.00"
            value={
              data.basePrice !== undefined && data.basePrice !== null && data.basePrice !== ""
                ? String(data.basePrice)
                : data.purchasePrice !== undefined && data.purchasePrice !== null && data.purchasePrice !== ""
                  ? String(data.purchasePrice)
                  : ""
            }
            onChange={(val) => {
              onFieldChange("purchasePrice", val);
              onFieldChange("basePrice", val);
            }}
            leftIcon={IndianRupee}
            min={0}
            step={0.01}
            error={errors.purchasePrice || errors.basePrice}
            errorMessage={errors.purchasePrice || errors.basePrice}
          />
        </div>
      </div>

      {/* Row 5: Variant Attributes */}
      <div className="p-3 rounded-lg bg-[rgb(var(--color-bg-secondary)/0.4)] border border-[rgb(var(--color-border-primary)/0.6)] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[rgb(var(--color-text-primary))]">
            <Tag className="w-3.5 h-3.5 text-blue-500" />
            <span>{t("products.variantAttributes", "Variant Attributes")}</span>
          </div>
          <button
            type="button"
            onClick={handleAddOption}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>{t("products.addAttribute", "+ Add Attribute")}</span>
          </button>
        </div>

        {(!data.options || data.options.length === 0) && (
          <p className="text-[11px] text-[rgb(var(--color-text-tertiary))] italic">
            {t(
              "products.noAttributesHint",
              "No custom attributes added yet. Click '+ Add Attribute' to specify Color, Size, etc."
            )}
          </p>
        )}

        {data.options?.map((opt, optIdx) => (
          <div key={opt.id || optIdx} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t("products.attributeName", "Name (e.g. Color)")}
              value={opt.name || ""}
              onChange={(e) => handleOptionChange(optIdx, "name", e.target.value)}
              className="w-1/3 h-8 px-2.5 text-xs rounded-md border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]"
            />
            <input
              type="text"
              placeholder={t("products.attributeValue", "Value (e.g. Blue)")}
              value={opt.value || ""}
              onChange={(e) => handleOptionChange(optIdx, "value", e.target.value)}
              className="flex-1 h-8 px-2.5 text-xs rounded-md border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]"
            />
            <button
              type="button"
              onClick={() => handleRemoveOption(optIdx)}
              className="p-1 rounded text-gray-400 hover:text-rose-500 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Row 6: Variant Photos */}
      <div className="space-y-2 pt-2 border-t border-[rgb(var(--color-border-primary)/0.4)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
            {t("products.variantPhotos", "Variant Photos")}
          </span>
          <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer">
            <Upload className="w-3 h-3" />
            <span>{t("products.uploadPhotos", "Upload Photos")}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUploadFiles(e.target.files)}
              disabled={isUploading}
            />
          </label>
        </div>

        {isUploading && (
          <div className="flex items-center gap-2 py-2 text-xs text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t("products.uploadingPhotos", "Uploading photos...")}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {data.images?.map((img, imgIdx) => (
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
                onClick={() => handleRemoveImage(imgIdx)}
                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title={t("products.removePhoto", "Remove")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {(!data.images || data.images.length === 0) && !isUploading && (
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
}

export default VariantCardView;
