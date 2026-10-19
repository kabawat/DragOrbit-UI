"use client";
import { TableSkeleton } from "@dragorbit/ui";
import {
  Calendar,
  CreditCard,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
} from "lucide-react";
export function PaymentGridView({ model }) {
  const {
    payments,
    getStatusBadge,
    getPaymentMethodBadge,
    t,
    getPaymentTypeBadge,
    selectedPayments,
    handlePaymentSelect,
    menuRefs,
    handleMenuToggle,
    openMenuId,
    handleMenuAction,
    canEdit,
    canDelete,
    formatDate,
    formatCurrency,
    isLoadingMore,
    onRoute0,
    onRoute1,
  } = model;
  return (
    <div className="overflow-auto min-h-[calc(100vh-400px)] p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {payments.map((payment) => {
          const paymentId = payment._id || payment.id;
          const statusBadge = getStatusBadge(
            payment.paymentStatus || payment.status,
          );
          const methodBadge = getPaymentMethodBadge(payment.paymentMethod, t);
          const typeBadge = getPaymentTypeBadge(payment.paymentType, t);
          const StatusIcon = statusBadge.icon;

          return (
            <div
              key={paymentId}
              className="w-full max-w-sm mx-auto rounded-xl border border-[rgb(var(--color-border-primary))] transition-all duration-300 ease-out group overflow-hidden"
            >
              {/* Checkbox */}
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedPayments.includes(paymentId)}
                  onChange={() => handlePaymentSelect(paymentId)}
                  className="w-4 h-4 rounded focus:ring-blue-500"
                />
              </div>

              {/* Payment Header with Gradient Background */}
              <div className="w-full h-32 sm:h-36 md:h-40 bg-gradient-to-br from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-primary))]/20 relative">
                <div className="w-full h-full flex items-center justify-center">
                  <CreditCard className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[rgb(var(--color-primary))]" />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-xl"></div>

                {/* Action Menu */}
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className="relative"
                    ref={(el) => (menuRefs.current[paymentId] = el)}
                  >
                    <button
                      onClick={() => handleMenuToggle(paymentId)}
                      className="p-2 bg-white/90 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 rounded-lg transition-colors duration-200 group/btn cursor-pointer shadow-sm"
                      title="More Actions"
                    >
                      <MoreVertical className="w-4 h-4 text-[rgb(var(--color-text-secondary))] group-hover/btn:text-[rgb(var(--color-primary))]" />
                    </button>

                    {/* Popup Menu */}
                    {openMenuId === paymentId && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-50">
                        <button
                          onClick={() => handleMenuAction(paymentId, "view")}
                          className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-3 transition-colors duration-200 cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                          {t("common.viewDetails")}
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleMenuAction(paymentId, "edit")}
                            className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-3 transition-colors duration-200 cursor-pointer"
                          >
                            <Edit className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                            {t("common.edit")}
                          </button>
                        )}
                        {canDelete && (
                          <>
                            <div className="border-t border-[rgb(var(--color-border-primary))] my-1"></div>
                            <button
                              onClick={() =>
                                handleMenuAction(paymentId, "delete")
                              }
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-500/10 flex items-center gap-3 transition-colors duration-200 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                              {t("common.delete")}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4">
                {/* Payment Info */}
                <div>
                  <div
                    onClick={() => onRoute0(paymentId)}
                    className="font-bold text-md sm:text-lg xl:text-lg mb-1 text-[rgb(var(--color-primary))] block line-clamp-1 cursor-pointer"
                  >
                    {payment.paymentNumber}
                  </div>
                  {payment.supplier?._id || payment.supplier?.id ? (
                    <div
                      onClick={() =>
                        onRoute1(payment.supplier._id || payment.supplier.id)
                      }
                      className="text-xs sm:text-sm font-medium text-[rgb(var(--color-primary))] block cursor-pointer"
                    >
                      {payment.supplier.name}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                      {payment.supplier?.name || "N/A"}
                    </p>
                  )}
                </div>

                {/* Status, Type and Method Badges */}
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <span
                    className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium border"
                    style={statusBadge.style}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusBadge.text}
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium border"
                    style={typeBadge.style}
                  >
                    {typeBadge.text}
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium border"
                    style={methodBadge.style}
                  >
                    {methodBadge.text}
                  </span>
                </div>

                {/* Payment Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(payment.paymentDate)}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
                    <span className="font-medium">Amount:</span>
                  </div>
                  <div className="text-lg sm:text-lg xl:text-lg font-bold text-[rgb(var(--color-text-primary))]">
                    {formatCurrency(payment.totalAmount || payment.amount)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isLoadingMore && (
        <TableSkeleton compact rows={2} />
      )}
    </div>
  );
}
