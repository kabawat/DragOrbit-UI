"use client";
import { Copy, Eye, Package, Trash2, TrendingUp } from "lucide-react";
export function InventoryCardView({ model }) {
  const {
    selected,
    className,
    props,
    onSelect,
    inventory,
    themeConfig,
    imageError,
    Image,
    setImageError,
    menuRef,
    IconButton,
    handleMenuToggle,
    openMenuId,
    handleMenuAction,
    t,
    canEdit,
    canCreate,
    canDelete,
    getStatusBadge,
    profitMargin,
    getPaymentStatusBadge,
    totalValue,
  } = model;
  return (
    <div
      className={`w-full max-sm mx-auto rounded-xl border border-[rgb(var(--color-border-primary))] shadow-lg hover:shadow-xl transition-all duration-300 ease-out group overflow-hidden ${selected ? "ring-2 ring-blue-500" : ""} ${className}`}
      {...props}
    >
      {/* Checkbox */}
      {onSelect && (
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(inventory.id, e.target.checked)}
            className="w-4 h-4 rounded focus:ring-blue-500"
            style={{
              color: themeConfig.primary,
              borderColor: themeConfig.border,
              backgroundColor: themeConfig.background,
            }}
          />
        </div>
      )}

      {/* Product Image with Gradient Overlay */}
      <div className="w-full h-32 sm:h-36 md:h-40 bg-gradient-to-br relative">
        <div className="w-full h-full overflow-hidden rounded-t-xl">
          {inventory.product?.image && !imageError ? (
            <Image
              src={inventory.product.image}
              alt={inventory.product.name}
              fill
              className="object-cover transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: themeConfig.textSecondary }}
            >
              <Package
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                style={{ color: themeConfig.textSecondary }}
              />
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-xl"></div>

        {/* Action Menu */}
        <div className="absolute top-4 right-4 z-10">
          <div className="relative" ref={menuRef}>
            <IconButton onClick={() => handleMenuToggle(inventory.id)} />

            {/* Popup Menu */}
            {openMenuId === inventory.id && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-[9999]">
                <button
                  onClick={() => handleMenuAction(inventory.id, "view")}
                  className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-3 transition-colors duration-200 cursor-pointer focus:outline-none focus:bg-[rgb(var(--color-bg-secondary))]"
                >
                  <Eye className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                  {t("common.viewDetails")}
                </button>
                {canEdit && (
                  <button
                    onClick={() => handleMenuAction(inventory.id, "stock-in")}
                    className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-500/10 flex items-center gap-3 transition-colors duration-200 cursor-pointer focus:outline-none focus:bg-green-500/10"
                  >
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    {t("inventory.addStock")}
                  </button>
                )}
                {canCreate && (
                  <button
                    onClick={() => handleMenuAction(inventory.id, "duplicate")}
                    className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-3 transition-colors duration-200 cursor-pointer focus:outline-none focus:bg-[rgb(var(--color-bg-secondary))]"
                  >
                    <Copy className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                    {t("common.duplicate")}
                  </button>
                )}
                <div className="border-t border-[rgb(var(--color-border-primary))] my-1"></div>
                {canDelete && (
                  <button
                    onClick={() => handleMenuAction(inventory.id, "delete")}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-500/10 flex items-center gap-3 transition-colors duration-200 cursor-pointer focus:outline-none focus:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    {t("common.delete")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
          {getStatusBadge(inventory)}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4">
        {/* Product Name */}
        <div>
          <h3
            className="font-bold text-md sm:text-xl mb-1"
            style={{ color: themeConfig.text }}
          >
            {inventory.product?.name || t("products.unknownProduct")}
          </h3>
          <p
            className="text-xs sm:text-sm font-medium"
            style={{ color: themeConfig.textSecondary }}
          >
            {inventory.product?.brand || t("products.unknownBrand")}
          </p>
        </div>

        {/* Category */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <span
            className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "#8b5cf6",
              color: "white",
            }}
          >
            {inventory.product?.category || t("products.noCategory")}
          </span>
        </div>

        {/* Stock Info */}
        <div className="grid grid-cols-2 gap-4">
          <div
            className="text-xs sm:text-sm"
            style={{ color: themeConfig.textSecondary }}
          >
            <span className="font-medium">
              {t("inventory.availableStock")}:
            </span>{" "}
            {inventory.stockSummary?.availableQuantity || 0}
          </div>
          <div
            className="text-xs sm:text-sm"
            style={{ color: themeConfig.textSecondary }}
          >
            <span className="font-medium">{t("common.total")}:</span>{" "}
            {inventory.stockSummary?.totalQuantity || 0}
          </div>
        </div>

        {/* Batches Info */}
        <div className="grid grid-cols-2 gap-4">
          <div
            className="text-xs sm:text-sm"
            style={{ color: themeConfig.textSecondary }}
          >
            <span className="font-medium">{t("inventory.batches")}:</span>{" "}
            {inventory.batchSummary?.totalBatches || 0}
          </div>
          <div
            className="text-xs sm:text-sm"
            style={{ color: themeConfig.textSecondary }}
          >
            <span className="font-medium">{t("common.active")}:</span>{" "}
            {inventory.batchSummary?.activeBatches || 0}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="rounded-lg p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-1.5 md:space-y-2 bg-gradient-to-r from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))]">
          <div className="flex items-center justify-between">
            <span
              className="text-xs sm:text-sm"
              style={{ color: themeConfig.textSecondary }}
            >
              {t("products.sellingPrice")}
            </span>
            <span
              className="text-sm sm:text-base md:text-lg font-bold"
              style={{ color: themeConfig.text }}
            >
              ₹
              {inventory.pricingSummary?.averageSellingPrice?.toLocaleString() ||
                "0"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className="text-xs sm:text-sm"
              style={{ color: themeConfig.textSecondary }}
            >
              {t("products.costPrice")}
            </span>
            <span
              className="text-xs sm:text-sm"
              style={{ color: themeConfig.textSecondary }}
            >
              ₹
              {inventory.pricingSummary?.averagePurchasePrice?.toLocaleString() ||
                "0"}
            </span>
          </div>
          {profitMargin > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-green-500 font-medium">
                {t("inventory.profitMargin")}
              </span>
              <span className="text-xs sm:text-sm text-green-500 font-medium">
                {profitMargin.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* Payment Status */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs sm:text-sm"
            style={{ color: themeConfig.textSecondary }}
          >
            {t("invoice.paymentStatus")}:
          </span>
          {getPaymentStatusBadge(inventory.paymentSummary?.paymentStatus)}
        </div>

        {/* Total Value */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs sm:text-sm"
            style={{ color: themeConfig.textSecondary }}
          >
            {t("inventory.totalValue")}:
          </span>
          <span className="text-sm font-bold text-green-600">
            ₹{totalValue.toLocaleString()}
          </span>
        </div>

        {/* Last Updated */}
        <div
          className="text-xs text-center pt-1.5 border-t"
          style={{
            color: themeConfig.textSecondary,
            borderColor: themeConfig.border,
          }}
        >
          {t("common.lastUpdated")}:{" "}
          {inventory.lastUpdated
            ? new Date(inventory.lastUpdated).toLocaleDateString()
            : t("common.notAvailable")}
        </div>
      </div>
    </div>
  );
}
