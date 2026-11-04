"use client";
import { Building2, Calendar, FileText, Mail, Phone } from "lucide-react";
import { ActionMenu, SendMenu } from "@dragorbit/ui";
export function PurchaseOrderCardView({ model }) {
  const {
    purchaseOrder,
    onMenuAction,
    openMenuId,
    onMenuToggle,
    menuRefs,
    actions,
    enableSendMenu,
    getShareUrl,
    formatCurrency,
    formatDate,
    showToast,
    onViewDetails,
    normalizedData,
    statusConfig,
    StatusIcon,
    t,
  } = model;
  return (
    <div className="w-full max-w-sm mx-auto rounded-xl border border-[rgb(var(--color-border-primary))] transition-all duration-300 ease-out group overflow-hidden">
      {/* PO Header with Gradient Background */}
      <div className="w-full h-32 sm:h-36 md:h-40 bg-gradient-to-br from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-primary))]/20 relative">
        <div className="w-full h-full flex items-center justify-center">
          <FileText className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[rgb(var(--color-primary))]" />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-xl"></div>

        {/* Action Menu */}
        <div className="absolute top-4 right-4 z-10">
          <ActionMenu
            item={purchaseOrder}
            onAction={onMenuAction}
            menuId={purchaseOrder._id || purchaseOrder.id}
            isOpen={openMenuId === (purchaseOrder._id || purchaseOrder.id)}
            onToggle={onMenuToggle}
            menuRef={(el) =>
              (menuRefs.current[purchaseOrder._id || purchaseOrder.id] = el)
            }
            actions={actions}
            buttonClassName="bg-white/90 hover:bg-white shadow-sm"
          />
        </div>

        {/* Send Menu */}
        {enableSendMenu && (
          <div className="absolute top-4 right-16 z-10">
            <SendMenu
              item={purchaseOrder}
              onShare={(_type, _item) => {}}
              getShareUrl={getShareUrl}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              showToast={showToast}
              buttonClassName="bg-white/90 hover:bg-white"
            />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4">
        {/* PO Info */}
        <div>
          <h3
            className="font-bold text-md sm:text-lg xl:text-lg mb-1 text-[rgb(var(--color-primary))] line-clamp-1 cursor-pointer hover:underline decoration-2 underline-offset-4"
            onClick={() =>
              onViewDetails(normalizedData._id || normalizedData.id)
            }
          >
            {normalizedData.billNumber}
          </h3>
          <div className="flex items-start">
            <Building2 className="w-4 h-4 text-[rgb(var(--color-text-tertiary))] mr-2 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                {normalizedData.supplier?.name || "N/A"}
              </p>
              {(normalizedData.supplier?.phone ||
                normalizedData.supplier?.email) && (
                <div className="text-xs mt-0.5 flex items-center gap-1.5">
                  {normalizedData.supplier?.phone ? (
                    <>
                      <Phone className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                      <span className="text-[rgb(var(--color-text-secondary))]">
                        {normalizedData.supplier.phone}
                      </span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" />
                      <span className="text-[rgb(var(--color-text-secondary))]">
                        {normalizedData.supplier?.email}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium border ${statusConfig.variant === "success" ? "bg-green-500/10 text-green-600 border-green-500/20" : statusConfig.variant === "danger" ? "bg-red-500/10 text-red-600 border-red-500/20" : statusConfig.variant === "primary" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-gray-500/10 text-gray-600 border-gray-500/20"}`}
          >
            <StatusIcon className="w-3 h-3 mr-1 currentColor" />
            {statusConfig.text}
          </span>
        </div>

        {/* PO Details */}
        <div className="space-y-2">
          <div className="flex items-center text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
            <Calendar className="w-4 h-4 mr-2 text-[rgb(var(--color-text-tertiary))]" />
            <span>
              {t("purchaseOrders.poDate")}:
              {formatDate(normalizedData.billDate)}
            </span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
            <Calendar className="w-4 h-4 mr-2 text-[rgb(var(--color-text-tertiary))]" />
            <span>
              {t("purchaseOrders.expectedDelivery")}:
              {formatDate(normalizedData.dueDate)}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
              <span className="font-medium">
                {t("purchaseOrders.advancePaid")}:
              </span>
            </div>
            <div className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
              {formatCurrency(normalizedData.advanceAmount)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
              <span className="font-medium">
                {t("purchaseOrders.itemsReceived")}:
              </span>
            </div>
            <div className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
              {normalizedData.receivedQuantity}/{normalizedData.totalQuantity}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
