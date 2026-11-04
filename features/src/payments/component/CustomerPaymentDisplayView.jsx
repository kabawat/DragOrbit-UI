"use client";
import { Globe, Loader2 } from "lucide-react";
export function CustomerPaymentDisplayPresentation({ model }) {
  const {
    formatAmount,
    amount,
    checkoutState,
    t,
    checkoutError,
    handlePayWithRazorpay,
    isOnline,
  } = model;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-in fade-in duration-300">
      <Globe className="w-16 h-16 text-[rgb(var(--color-primary))] mb-6" />
      <p className="text-3xl font-bold text-[rgb(var(--color-primary))] tabular-nums mb-4">
        {formatAmount(amount)}
      </p>
      {checkoutState === "processing" ? (
        <>
          <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--color-primary))] mb-3" />
          <p className="text-lg text-[rgb(var(--color-text-primary))]">
            {t("invoice.customerPayment.openingPaymentGateway")}
          </p>
        </>
      ) : checkoutState === "failed" ? (
        <>
          <p className="text-lg text-[rgb(var(--color-text-primary))] mb-2">
            {checkoutError || t("invoice.customerPayment.paymentFailed")}
          </p>
          <button
            type="button"
            onClick={handlePayWithRazorpay}
            className="mt-3 rounded-full bg-[rgb(var(--color-primary))] px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            {t("invoice.collectPayment.payWithRazorpay")}
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-lg text-[rgb(var(--color-text-primary))]">
            {!isOnline
              ? t("invoice.customerPayment.offlineOnlineRequired")
              : t("invoice.customerPayment.openingPaymentGateway")}
          </p>
          <button
            type="button"
            onClick={handlePayWithRazorpay}
            className="rounded-full bg-[rgb(var(--color-primary))] px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            {t("invoice.collectPayment.payWithRazorpay")}
          </button>
        </div>
      )}
    </div>
  );
}
