"use client";
import { CreditCard } from "lucide-react";
import { Button, Input, Select } from "@dragorbit/ui";
export function UpdatePaymentStatusModalPresentation({ model }) {
  const {
    t,
    invoiceNumber,
    paymentStatus,
    handlePaymentStatusChange,
    paidAmount,
    handlePaidAmountChange,
    totalAmount,
    errors,
    onClose,
    loading,
    handleConfirm,
  } = model;
  return (
    <div className="fixed inset-0 backdrop-blur-[1px] bg-black/10 flex items-center justify-center z-[9999]">
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg p-6 max-w-md w-full mx-4 border border-[rgb(var(--color-border-primary))]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-[rgb(var(--color-primary))]/10 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
              {t("invoice.updatePaymentStatus")}
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {t("invoice.changePaymentStatusDescription")}
            </p>
          </div>
        </div>

        <p className="text-[rgb(var(--color-text-primary))] mb-4">
          {t("invoice.invoice")}: <strong>{invoiceNumber}</strong>
        </p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-2">
            {t("invoice.paymentStatus")}
          </label>
          <Select
            value={paymentStatus}
            onChange={handlePaymentStatusChange}
            options={[
              { value: "PAID", label: t("invoice.paid") },
              { value: "UNPAID", label: t("invoice.unpaid") },
              { value: "PARTIAL", label: t("invoice.partialPayment") },
            ]}
            placeholder={t("invoice.selectPaymentStatus")}
          />
        </div>

        {(paymentStatus === "PARTIAL" || paymentStatus === "PAID") && (
          <div className="mb-6">
            <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-2">
              {t("invoice.paidAmount")} {t("common.optional")}
            </label>
            <Input
              type="number"
              value={paidAmount}
              onChange={(value) => handlePaidAmountChange(value)}
              placeholder={
                paymentStatus === "PARTIAL"
                  ? t("invoice.enterPaidAmount", {
                      max: totalAmount?.toLocaleString() || 0,
                    })
                  : t("invoice.enterPaidAmountDefault", {
                      amount: totalAmount?.toLocaleString() || 0,
                    })
              }
              min="0"
              max={paymentStatus === "PARTIAL" ? totalAmount : undefined}
              step="0.01"
              className={errors.paidAmount ? "border-red-500" : ""}
            />
            {errors.paidAmount && (
              <p className="text-red-500 text-xs mt-1">{errors.paidAmount}</p>
            )}
            <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
              {t("invoice.totalInvoiceAmount")}: ₹
              {totalAmount?.toLocaleString() || 0}
              {paymentStatus === "PARTIAL" &&
                ` • ${t("invoice.leaveEmptyForZero")}`}
              {paymentStatus === "PAID" &&
                ` • ${t("invoice.leaveEmptyForFullPayment")}`}
            </p>
            {paymentStatus === "PAID" &&
              paidAmount &&
              parseFloat(paidAmount) > 0 &&
              parseFloat(paidAmount) < totalAmount && (
                <div className="mt-3 p-3 bg-[rgb(var(--color-warning))]/10 border border-[rgb(var(--color-warning))]/20 rounded-md">
                  <p className="text-xs text-[rgb(var(--color-warning))] font-medium">
                    {t("invoice.settlementDiscountWarning", {
                      amount: (
                        totalAmount - parseFloat(paidAmount)
                      ).toLocaleString(),
                    })}
                  </p>
                </div>
              )}
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            disabled={loading}
            loading={loading}
          >
            {loading ? t("common.updating") : t("invoice.updatePaymentStatus")}
          </Button>
        </div>
      </div>
    </div>
  );
}
