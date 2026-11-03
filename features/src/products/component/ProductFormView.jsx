"use client";

import { Eye, IndianRupee, Package } from "lucide-react";
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
      {/* 2-Column Responsive Layout: Exactly 50% - 50% on desktop (lg+), 1 Column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start">
        {/* Left Column (50%): Basic Info Section (Sticky on desktop) */}
        <div className="w-full min-w-0 lg:sticky lg:top-4">
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
                  onUploadImages={onUploadVariantImages}
                  t={t}
                />
              ),
            }}
          />
        </div>

        {/* Right Column (50%): Pricing & Inventory OR Variants */}
        <div className="w-full min-w-0">
          {!hasVariants ? (
            /* Single Product: Pricing & Inventory Section */
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
                    hasVariants={false}
                    t={t}
                  />
                ),
              }}
            />
          ) : (
            /* Multi-Variant Mode: Variants List (Vertically stacked in 50% column) */
            <VariantsSectionView
              variants={variants}
              onChange={onVariantsChange}
              hasVariants={hasVariants}
              onHasVariantsChange={onHasVariantsChange}
              baseFormData={formData}
              onUploadImages={onUploadVariantImages}
              variant1Card={
                <PricingGSTSectionView
                  formData={formData}
                  onChange={onChange}
                  errors={fieldErrors}
                  hasVariants={true}
                  onUploadImages={onUploadVariantImages}
                  onDuplicate={() => {
                    const nextIndex = variants.length + 1;
                    const duplicated = {
                      id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                      displayName: formData.displayName ? `${formData.displayName} (Copy)` : "",
                      mrp: formData.mrp || "",
                      sellingPrice: formData.sellingPrice || "",
                      sku: formData.sku ? `${formData.sku}-COPY` : "",
                      barcode: "",
                      stock: formData.stock !== undefined && formData.stock !== null ? formData.stock : "",
                      purchasePrice: formData.purchasePrice || formData.basePrice || "",
                      basePrice: formData.basePrice || formData.purchasePrice || "",
                      status: formData.status || "ACTIVE",
                      options: (formData.options || []).map((opt) => ({
                        ...opt,
                        id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                      })),
                      images: [...(formData.variantImages || formData.images || [])],
                    };
                    onVariantsChange([...variants, duplicated]);
                  }}
                  t={t}
                />
              }
              t={t}
            />
          )}
        </div>
      </div>

      {/* Catalog & Additional Details Slot (Full Width) */}
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
  );
}

export default ProductFormView;
