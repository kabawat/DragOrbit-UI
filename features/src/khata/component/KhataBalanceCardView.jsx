"use client";
import { Button } from "@dragorbit/ui";
import {
  AlertCircle,
  CheckCircle,
  IndianRupee,
  Receipt,
  ShoppingCart,
  Wallet,
} from "lucide-react";
export function KhataBalanceCardPresentation({ model }) {
  const {
    className,
    t,
    showRecordButton,
    onRecordTransaction,
    hasDue,
    MetricTile,
    balanceLabel,
    balanceValue,
    hasAdvance,
    formatAmount,
    totalSpent,
    totalInvoices,
    itemsBought,
  } = model;
  return (
    <div
      className={`bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))] p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-[rgb(var(--color-primary))]/20 to-[rgb(var(--color-primary))]/10 rounded-full flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--color-primary))]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
              {t("khata.quickStats")}
            </h2>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {t("khata.summaryHint")}
            </p>
          </div>
        </div>
        {showRecordButton && onRecordTransaction ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            className="shrink-0 font-semibold"
            onClick={onRecordTransaction}
            leftIcon={Receipt}
            aria-label={t("khata.recordTransaction")}
          >
            <span className="hidden min-[420px]:inline">
              {t("khata.recordTransaction")}
            </span>
            <span className="min-[420px]:hidden">{t("khata.recordShort")}</span>
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {hasDue ? (
          <MetricTile
            label={balanceLabel}
            value={balanceValue}
            icon={AlertCircle}
            gradient="from-orange-50/15 to-orange-100/10 dark:from-orange-900/5 dark:to-orange-800/3"
            iconClass="text-orange-500/35 dark:!text-orange-400 dark:opacity-40"
            valueClass="text-orange-600 dark:text-orange-400"
          />
        ) : hasAdvance ? (
          <MetricTile
            label={balanceLabel}
            value={balanceValue}
            icon={CheckCircle}
            gradient="from-emerald-50/15 to-emerald-100/10 dark:from-emerald-900/5 dark:to-emerald-800/3"
            iconClass="text-emerald-500/35 dark:text-emerald-400/40"
            valueClass="text-emerald-600 dark:text-emerald-400"
          />
        ) : (
          <MetricTile
            label={balanceLabel}
            value={balanceValue}
            icon={CheckCircle}
            gradient="from-emerald-50/15 to-emerald-100/10 dark:from-emerald-900/5 dark:to-emerald-800/3"
            iconClass="text-emerald-500/35 dark:text-emerald-400/40"
            valueClass="text-emerald-600 dark:text-emerald-400"
          />
        )}

        <MetricTile
          label={t("khata.totalSpent")}
          value={formatAmount(totalSpent)}
          icon={IndianRupee}
          gradient="from-blue-50/15 to-blue-100/10 dark:from-blue-900/5 dark:to-blue-800/3"
          iconClass="text-blue-500/35 dark:!text-blue-400 dark:opacity-40"
          valueClass="text-[rgb(var(--color-text-primary))]"
        />

        <MetricTile
          label={t("khata.invoices")}
          value={String(totalInvoices)}
          icon={Receipt}
          gradient="from-purple-50/15 to-purple-100/10 dark:from-purple-900/5 dark:to-purple-800/3"
          iconClass="text-purple-500/35 dark:!text-purple-400"
          valueClass="text-[rgb(var(--color-text-primary))]"
        />

        <MetricTile
          label={t("khata.itemsBought")}
          value={String(itemsBought)}
          icon={ShoppingCart}
          gradient="from-indigo-50/15 to-indigo-100/10 dark:from-indigo-900/5 dark:to-indigo-800/3"
          iconClass="text-indigo-500/35 dark:!text-indigo-400 dark:opacity-40"
          valueClass="text-[rgb(var(--color-text-primary))]"
        />
      </div>
    </div>
  );
}
