"use client";
import {
  BarChart3,
  Eye,
  Image as ImageIcon,
  IndianRupee,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
export function ProductInfoModalPresentation({ model }) {
  const { t, onClose } = model;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-[9999]">
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto border border-[rgb(var(--color-border-primary))] shadow-lg">
        <div className="relative mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[rgb(var(--color-primary))]/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                {t("products.whyAddProductDetails")}
              </h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                {t("products.completeInfoHelpsSales")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-0 right-0 w-8 h-8 bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded-full flex items-center justify-center transition-colors border border-[rgb(var(--color-border-primary))]"
          >
            <X className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Sales Benefits */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[rgb(var(--color-success))]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-[rgb(var(--color-success))]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("products.boostSales")}
              </h4>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("products.boostSalesDescription")}
              </p>
            </div>
          </div>

          {/* Customer Experience */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[rgb(var(--color-primary))]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-[rgb(var(--color-primary))]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("products.betterCustomerExperience")}
              </h4>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("products.betterCustomerExperienceDescription")}
              </p>
            </div>
          </div>

          {/* Inventory Management */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[rgb(var(--color-warning))]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-[rgb(var(--color-warning))]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("products.inventoryTracking")}
              </h4>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("products.inventoryTrackingDescription")}
              </p>
            </div>
          </div>

          {/* SEO Benefits */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[rgb(var(--color-primary))]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-[rgb(var(--color-primary))]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("products.seoOptimization")}
              </h4>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("products.seoOptimizationDescription")}
              </p>
            </div>
          </div>

          {/* Order Management */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[rgb(var(--color-secondary))]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-4 h-4 text-[rgb(var(--color-secondary))]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("products.orderProcessing")}
              </h4>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("products.orderProcessingDescription")}
              </p>
            </div>
          </div>

          {/* Business Growth */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[rgb(var(--color-success))]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-[rgb(var(--color-success))]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {t("products.businessGrowth")}
              </h4>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("products.businessGrowthDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Section Information */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-4">
            {t("products.formSectionsGuide")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="p-3 bg-[rgb(var(--color-bg-secondary))]/20 rounded-lg border border-[rgb(var(--color-border-primary))]/30">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                <h5 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {t("products.basicInformation")}
                </h5>
              </div>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("products.basicInformationSubtitle")}
              </p>
            </div>

            {/* Media & Images */}
            <div className="p-3 bg-[rgb(var(--color-bg-secondary))]/20 rounded-lg border border-[rgb(var(--color-border-primary))]/30">
              <div className="flex items-center space-x-2 mb-2">
                <ImageIcon className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                <h5 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {t("products.media")}
                </h5>
              </div>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("products.mediaDescription")}
              </p>
            </div>

            {/* Pricing & GST */}
            <div className="p-3 bg-[rgb(var(--color-bg-secondary))]/20 rounded-lg border border-[rgb(var(--color-border-primary))]/30">
              <div className="flex items-center space-x-2 mb-2">
                <IndianRupee className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                <h5 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {t("products.pricingInformation")}
                </h5>
              </div>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("products.pricingInformationSubtitle")}
              </p>
            </div>

            {/* Catalog information */}
            <div className="p-3 bg-[rgb(var(--color-bg-secondary))]/20 rounded-lg border border-[rgb(var(--color-border-primary))]/30">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                <h5 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {t("products.catalogInformation")}
                </h5>
              </div>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {t("products.catalogInformationDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
