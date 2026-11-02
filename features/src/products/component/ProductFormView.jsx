"use client";

import { Eye, Image as ImageIcon, IndianRupee, Package } from "lucide-react";
import { BasicInfoSectionView } from "./BasicInfoSectionView.jsx";
import { PricingGSTSectionView } from "./PricingGSTSectionView.jsx";
import { SortableSectionPresentation } from "./SortableSectionView.jsx";
import { VariantsSectionView } from "./VariantsSectionView.jsx";

const defaultT = (key, fallback) => fallback || key;

export function ProductFormView({
  formData = {},
  onChange = () => {},
  fieldErrors = {},
  variants = [],
  onVariantsChange = () => {},
  hasVariants = false,
  onHasVariantsChange = () => {},
  showVariants = true,
  storeId = null,
  productId = null,
  className = "",
  apiCategories = [],
  apiBrands = [],
  categoriesLoading = false,
  brandsLoading = false,
  onAddCategoryClick,
  onAddBrandClick,
  onInfoClick,
  onUploadVariantImages,
  mediaSlot = null,
  additionalDetailsSlot = null,
  currencyOptions,
  uomOptions,
  hasStoreGst = false,
  t = defaultT,
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* 2-Column Responsive Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column (Primary Details & Pricing) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Basic Info Section */}
          <SortableSectionPresentation
            model={{
              id: "basic",
              title: t("products.basicInformation", "Basic Information"),
              subtitle: t(
                "products.basicInformationSubtitle",
                "Product title, category, brand, UOM, and GST"
              ),
              Icon: Package,
              onInfoClick: onInfoClick || (() => {}),
              t,
              glassStyles: {
                card: "backdrop-blur-sm bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]",
                header: "border-b border-[rgb(var(--color-border-primary)/0.6)]",
                body: "",
                icon: "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]",
                dragHandle: "text-gray-400 hover:text-gray-600",
                title: "text-[rgb(var(--color-text-primary))]",
                description: "text-[rgb(var(--color-text-secondary))]",
              },
              children: (
                <BasicInfoSectionView
                  formData={formData}
                  onChange={onChange}
                  errors={fieldErrors}
                  onAddCategoryClick={onAddCategoryClick}
                  onAddBrandClick={onAddBrandClick}
                  apiCategories={apiCategories}
                  apiBrands={apiBrands}
                  categoriesLoading={categoriesLoading}
                  brandsLoading={brandsLoading}
                  hasVariants={hasVariants}
                  onHasVariantsChange={onHasVariantsChange}
                  currencyOptions={currencyOptions}
                  uomOptions={uomOptions}
                  hasStoreGst={hasStoreGst}
                  t={t}
                />
              ),
            }}
          />

          {/* Pricing & GST Section */}
          <SortableSectionPresentation
            model={{
              id: "pricing-gst",
              title: t("products.pricingAndInventory", "Pricing & Inventory"),
              subtitle: t(
                "products.pricingAndInventorySubtitle",
                "MRP, selling price, purchase price, SKU, barcode, and stock"
              ),
              Icon: IndianRupee,
              onInfoClick: onInfoClick || (() => {}),
              t,
              glassStyles: {
                card: "backdrop-blur-sm bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]",
                header: "border-b border-[rgb(var(--color-border-primary)/0.6)]",
                body: "",
                icon: "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]",
                dragHandle: "text-gray-400 hover:text-gray-600",
                title: "text-[rgb(var(--color-text-primary))]",
                description: "text-[rgb(var(--color-text-secondary))]",
              },
              children: (
                <PricingGSTSectionView
                  formData={formData}
                  onChange={onChange}
                  errors={fieldErrors}
                  hasVariants={hasVariants}
                  t={t}
                />
              ),
            }}
          />
        </div>

        {/* Right Column (Media & Catalog Info) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Media Section Slot */}
          {mediaSlot && (
            <SortableSectionPresentation
              model={{
                id: "media",
                title: t("products.media", "Media & Images"),
                subtitle: t(
                  "products.mediaSubtitle",
                  "Upload product photos and media for your catalog"
                ),
                Icon: ImageIcon,
                onInfoClick: onInfoClick || (() => {}),
                t,
                glassStyles: {
                  card: "backdrop-blur-sm bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]",
                  header: "border-b border-[rgb(var(--color-border-primary)/0.6)]",
                  body: "",
                  icon: "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]",
                  dragHandle: "text-gray-400 hover:text-gray-600",
                  title: "text-[rgb(var(--color-text-primary))]",
                  description: "text-[rgb(var(--color-text-secondary))]",
                },
                children: mediaSlot,
              }}
            />
          )}

          {/* Catalog & Additional Details Slot */}
          {additionalDetailsSlot && (
            <SortableSectionPresentation
              model={{
                id: "content",
                title: t("products.catalogInformation", "Digital Catalog Details"),
                subtitle: t(
                  "products.catalogInformationSubtitle",
                  "Online store visibility, description, and specifications"
                ),
                Icon: Eye,
                onInfoClick: onInfoClick || (() => {}),
                t,
                glassStyles: {
                  card: "backdrop-blur-sm bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]",
                  header: "border-b border-[rgb(var(--color-border-primary)/0.6)]",
                  body: "",
                  icon: "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]",
                  dragHandle: "text-gray-400 hover:text-gray-600",
                  title: "text-[rgb(var(--color-text-primary))]",
                  description: "text-[rgb(var(--color-text-secondary))]",
                },
                children: additionalDetailsSlot,
              }}
            />
          )}
        </div>

        {/* Full-Width Bottom: Variants Creator Section */}
        {showVariants && hasVariants && (
          <div className="lg:col-span-12 pt-2">
            <VariantsSectionView
              variants={variants}
              onChange={onVariantsChange}
              hasVariants={hasVariants}
              onHasVariantsChange={onHasVariantsChange}
              baseFormData={formData}
              onUploadImages={onUploadVariantImages}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductFormView;
