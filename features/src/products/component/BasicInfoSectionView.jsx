"use client";

import { Hash, Loader2, Package, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { Input, Select } from "@dragorbit/ui";
import {
  DEFAULT_CURRENCY_OPTIONS,
  DEFAULT_UOM_OPTIONS,
} from "../model/productForm.js";

const defaultT = (key, fallback) => fallback || key;

export function BasicInfoSectionView({
  formData = {},
  onChange = () => {},
  errors = {},
  onAddCategoryClick,
  onAddBrandClick,
  apiCategories = [],
  apiBrands = [],
  categoriesLoading = false,
  brandsLoading = false,
  hasVariants = false,
  onHasVariantsChange = () => {},
  currencyOptions = DEFAULT_CURRENCY_OPTIONS,
  uomOptions = DEFAULT_UOM_OPTIONS,
  hasStoreGst = false,
  onUploadImages,
  t = defaultT,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const images = Array.isArray(formData.images) ? formData.images : [];

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      if (onUploadImages) {
        const uploaded = await onUploadImages(files);
        if (uploaded && uploaded.length > 0) {
          const existing = Array.isArray(formData.images) ? formData.images : [];
          handleFieldChange("images", [...existing, ...uploaded]);
        }
      } else {
        const local = Array.from(files).map((f) => URL.createObjectURL(f));
        const existing = Array.isArray(formData.images) ? formData.images : [];
        handleFieldChange("images", [...existing, ...local]);
      }
    } catch (err) {
      console.error("Product image upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (imgIdx) => {
    const existing = Array.isArray(formData.images) ? [...formData.images] : [];
    existing.splice(imgIdx, 1);
    handleFieldChange("images", existing);
  };
  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  const handleCategoryChange = (value) => {
    if (value === "add-new-category") {
      onAddCategoryClick?.();
    } else {
      handleFieldChange("category", value);
    }
  };

  const handleBrandChange = (value) => {
    if (value === "add-new-brand") {
      onAddBrandClick?.();
    } else {
      handleFieldChange("brandId", value);
    }
  };

  const allCategories = [
    ...apiCategories,
    {
      value: "add-new-category",
      label: `+ ${t("products.addNewCategory", "Add New Category")}`,
      isAddOption: true,
    },
  ];

  const allBrands = [
    ...apiBrands,
    {
      value: "add-new-brand",
      label: `+ ${t("products.addNewBrand", "Add New Brand")}`,
      isAddOption: true,
    },
  ];

  return (
    <div className="space-y-3.5">
      {/* Product Name (Full Width) */}
      <div>
        <Input
          label={t("products.productName", "Product Name")}
          placeholder={t(
            "products.enterProductName",
            "Enter product title / name"
          )}
          value={formData.name || ""}
          onChange={(value) => handleFieldChange("name", value)}
          error={errors.name}
          errorMessage={errors.name}
          required
          leftIcon={Package}
          className="text-sm font-medium"
        />

        {/* Checkbox: This product has multiple variants */}
        <div className="mt-2.5 flex items-center gap-2">
          <input
            id="product-has-multiple-variants"
            type="checkbox"
            checked={Boolean(hasVariants)}
            onChange={(e) => onHasVariantsChange?.(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
          />
          <label
            htmlFor="product-has-multiple-variants"
            className="text-xs font-medium text-[rgb(var(--color-text-primary))] cursor-pointer select-none"
          >
            {t(
              "products.hasMultipleVariants",
              "This product has multiple variants (इस प्रोडक्ट के कई वेरिएंट हैं)"
            )}
          </label>
        </div>
      </div>

      {/* Category and Brand Side-by-Side with Quick Add Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
              {t("products.category", "Category")}{" "}
              <span className="text-rose-500">*</span>
            </span>
            {onAddCategoryClick && (
              <button
                type="button"
                onClick={onAddCategoryClick}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>{t("products.addNewCategoryShort", "+ New")}</span>
              </button>
            )}
          </div>
          <Select
            placeholder={
              categoriesLoading
                ? t("products.loadingCategories", "Loading categories...")
                : t("products.selectCategory", "Select product category")
            }
            value={formData.category || ""}
            onChange={handleCategoryChange}
            error={errors.category}
            errorMessage={errors.category}
            searchable={true}
            options={allCategories}
            required
            disabled={categoriesLoading}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
              {t("products.brand", "Brand")}
            </span>
            {onAddBrandClick && (
              <button
                type="button"
                onClick={onAddBrandClick}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>{t("products.addNewBrandShort", "+ New")}</span>
              </button>
            )}
          </div>
          <Select
            placeholder={
              brandsLoading
                ? t("products.loadingBrands", "Loading brands...")
                : t("products.selectBrand", "Select product brand")
            }
            value={formData.brandId || ""}
            onChange={handleBrandChange}
            error={errors.brandId}
            errorMessage={errors.brandId}
            searchable={true}
            options={allBrands}
            disabled={brandsLoading}
          />
        </div>
      </div>

      {/* Currency & Unit of Measure (Shared across all variants) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <span className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
            {t("products.currency", "Currency")}{" "}
            <span className="text-rose-500">*</span>
          </span>
          <Select
            placeholder={t("products.selectCurrency", "Select Currency")}
            options={currencyOptions}
            value={formData.currency || "INR"}
            onChange={(val) => handleFieldChange("currency", val)}
            error={errors.currency}
            errorMessage={errors.currency}
            required
            searchable
          />
        </div>

        <div>
          <span className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">
            {t("products.unitOfMeasure", "Unit of Measure (UOM)")}{" "}
            <span className="text-rose-500">*</span>
          </span>
          <Select
            placeholder={t("products.selectUom", "Select Unit of Measure")}
            options={uomOptions}
            value={formData.uom || "PCS"}
            onChange={(val) => handleFieldChange("uom", val)}
            error={errors.uom}
            errorMessage={errors.uom}
            required
            searchable
          />
        </div>
      </div>

      {/* HSN Code & GST Tax Inclusive Toggle (Shared across all variants) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 items-end">
        <div>
          <Input
            label={t("products.hsnCode", "HSN Code")}
            placeholder={t("products.enterHsnCode", "e.g. 2634643")}
            value={formData.gstInfo?.hsnCode || ""}
            onChange={(val) => handleFieldChange("gstInfo.hsnCode", val)}
            error={errors["gstInfo.hsnCode"] || errors.hsnCode}
            errorMessage={errors["gstInfo.hsnCode"] || errors.hsnCode}
            required={hasStoreGst}
            leftIcon={Hash}
            maxLength={8}
          />
        </div>

        <div className="p-2.5 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary)/0.3)] flex items-center justify-between">
          <div>
            <span className="block text-xs font-semibold text-[rgb(var(--color-text-primary))]">
              {t("products.isGstIncluded", "Tax Inclusive Pricing")}
            </span>
            <span className="block text-[11px] text-[rgb(var(--color-text-secondary))]">
              {t("products.isGstIncludedHint", "Selling price includes GST")}
            </span>
          </div>
          <input
            type="checkbox"
            checked={formData.gstInfo?.isGstIncluded !== false}
            onChange={(e) =>
              handleFieldChange("gstInfo.isGstIncluded", e.target.checked)
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Product Images (Compact, variant-style below HSN & GST) */}
      <div className="space-y-2 pt-3 border-t border-[rgb(var(--color-border-primary)/0.6)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
              {t("products.productImages", "Product Images")}
            </span>
            {images.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))] rounded-full">
                {images.length}
              </span>
            )}
          </div>
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
          <div className="flex items-center gap-2 py-1 text-xs text-blue-600">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{t("products.uploadingPhotos", "Uploading photos...")}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {images.map((img, imgIdx) => (
            <div
              key={imgIdx}
              className="relative group w-14 h-14 rounded-lg overflow-hidden border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]"
            >
              <img
                src={typeof img === "string" ? img : img?.url}
                alt={`Product photo ${imgIdx + 1}`}
                className="w-full h-full object-cover"
              />
              {imgIdx === 0 && (
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 font-medium leading-tight">
                  Cover
                </span>
              )}
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

          {images.length === 0 && !isUploading && (
            <p className="text-[11px] text-[rgb(var(--color-text-tertiary))] italic">
              {t("products.noImagesUploaded", "No images uploaded yet")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BasicInfoSectionView;
