"use client";
import { Award, Star } from "lucide-react";
import { DragAiIcon } from "@dragorbit/ui";
export function StatusSectionPresentation({ model }) {
  const { Toggle, t, formData, handleFieldChange } = model;
  return (
    <>
      {/* Status & Visibility Toggle */}
      <div className="mb-6">
        <Toggle
          label={t("products.configureStatusVisibility")}
          checked={formData.statusInfo?.isEnabled || false}
          onChange={(checked) => {
            const updatedStatusInfo = {
              ...formData.statusInfo,
              isEnabled: checked,
            };
            handleFieldChange("statusInfo", updatedStatusInfo);
          }}
        />
      </div>

      {/* Status Fields - Only show if enabled */}
      {formData.statusInfo?.isEnabled && (
        <>
          {/* Catalog Visibility */}
          <div className="mb-6">
            <Toggle
              label={t("products.showInCatalogLabel")}
              checked={formData.showInCatalog !== false}
              onChange={(checked) =>
                handleFieldChange("showInCatalog", checked)
              }
            />
          </div>

          {/* Product Flags */}
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {t("products.productFlags")}
            </h4>

            <div className="space-y-4">
              <Toggle
                label={t("products.featuredProduct")}
                checked={formData.featured || false}
                onChange={(checked) => handleFieldChange("featured", checked)}
              />

              <Toggle
                label={t("products.bestSeller")}
                checked={formData.bestSeller || false}
                onChange={(checked) => handleFieldChange("bestSeller", checked)}
              />

              <Toggle
                label={t("products.newArrival")}
                checked={formData.newArrival || false}
                onChange={(checked) => handleFieldChange("newArrival", checked)}
              />
            </div>
          </div>

          {/* Status Summary */}
          <div className="p-4 bg-[rgb(var(--color-bg-secondary))] rounded-lg border border-[rgb(var(--color-border-primary))]">
            <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">
              {t("products.productStatusSummary")}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[rgb(var(--color-text-secondary))]">
                  {t("products.showInCatalogLabel")}:
                </span>
                <span className="font-medium text-[rgb(var(--color-text-primary))]">
                  {formData.showInCatalog !== false
                    ? t("products.catalogVisibilityShow")
                    : t("products.hidden")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[rgb(var(--color-text-secondary))]">
                  {t("products.flags")}:
                </span>
                <div className="flex space-x-2">
                  {formData.featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <Star className="w-3 h-3 mr-1" />
                      {t("products.featured")}
                    </span>
                  )}
                  {formData.bestSeller && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Award className="w-3 h-3 mr-1" />
                      {t("products.bestSeller")}
                    </span>
                  )}
                  {formData.newArrival && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <DragAiIcon className="w-3 h-3 mr-1" aria-hidden="true" />
                      {t("products.newArrival")}
                    </span>
                  )}
                  {!formData.featured &&
                    !formData.bestSeller &&
                    !formData.newArrival && (
                      <span className="text-[rgb(var(--color-text-tertiary))]">
                        {t("products.none")}
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
