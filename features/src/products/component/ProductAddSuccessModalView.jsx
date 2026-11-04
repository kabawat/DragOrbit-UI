"use client";
import { ArrowRight, CheckCircle, Plus } from "lucide-react";
import { Button, DragAiIcon } from "@dragorbit/ui";
export function ProductAddSuccessModalPresentation({ model }) {
  const {
    isVisible,
    showContent,
    defaultTitle,
    t,
    productName,
    defaultDescription,
    onContinue,
    defaultContinueText,
    onAddMore,
    defaultAddMoreText,
  } = model;
  return (
    <div
      className={`fixed inset-0 backdrop-blur-[1px] bg-black/10 flex items-start pt-6 justify-center z-[9999] transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-gradient-to-br from-[rgb(var(--color-bg-primary))] to-[rgb(var(--color-bg-secondary))] rounded-2xl border border-[rgb(var(--color-border-primary))] shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-500 ${
          showContent
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Animated Background */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-green-300 rounded-full animate-ping delay-1000"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative px-8 py-8">
          {/* Success Icon with Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <CheckCircle className="w-10 h-10 text-white animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2">
                <DragAiIcon className="w-6 h-6 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="absolute -bottom-1 -left-1">
                <div className="w-4 h-4 bg-green-300 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold text-[rgb(var(--color-text-primary))] mb-3 animate-fade-in">
              {defaultTitle}
            </h2>
            <p className="text-[rgb(var(--color-text-secondary))] text-md mb-2">
              {t("products.productAddedToStore", {
                productName: `"${productName}"`,
                action: defaultTitle.includes("Added")
                  ? t("products.addedTo")
                  : t("products.updatedIn"),
              })}
            </p>
            <p className="text-sm text-[rgb(var(--color-text-tertiary))]">
              {defaultDescription}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={onContinue}
              className="flex-1 h-12 text-md font-semibold bg-[rgb(var(--color-primary))] text-white"
              leftIcon={ArrowRight}
            >
              {defaultContinueText}
            </Button>

            <Button
              variant="outline"
              onClick={onAddMore}
              className="flex-1 h-12 text-md font-semibold border-2 border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-primary))]"
              leftIcon={Plus}
            >
              {defaultAddMoreText}
            </Button>
          </div>

          {/* Footer Message */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[rgb(var(--color-text-tertiary))] flex items-center justify-center gap-1">
              <span className="w-1 h-1 bg-[rgb(var(--color-text-tertiary))] rounded-full"></span>
              {t("products.manageProductsFromDashboard")}
              <span className="w-1 h-1 bg-[rgb(var(--color-text-tertiary))] rounded-full"></span>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 border-2 border-green-200 rounded-full animate-spin"></div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="w-6 h-6 border border-emerald-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
