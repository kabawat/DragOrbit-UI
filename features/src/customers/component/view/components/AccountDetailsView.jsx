"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  IndianRupee,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";

export function ViewComponentsAccountDetailsPresentation({ model }) {
  const { account, moment } = model;
  if (!account) return null;

  const totalAmount = Number(account.totalAmount || 0);
  const totalPaid = Number(account.totalPaid || 0);
  const totalDue = Number(account.totalDue || 0);
  const totalInvoices = Number(account.totalInvoices || 0);
  const totalItems = Number(account.totalItemsPurchased || 0);
  const totalProfit = Number(account.totalProfit || 0);
  const isDue = totalDue > 0;

  const formatCurrency = (val) =>
    "₹" +
    Number(val || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

  return (
    <div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[rgb(var(--color-text-primary))]">
            Account & Financial Overview
          </h2>
          <p className="text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
            Purchase history and payment summaries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Amount */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
              Total Amount
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base sm:text-xl font-bold text-[rgb(var(--color-text-primary))] truncate">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        {/* Total Paid */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Total Paid
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 truncate">
            {formatCurrency(totalPaid)}
          </p>
        </div>

        {/* Total Due */}
        <div
          className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between ${
            isDue
              ? "border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/5"
              : "border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/20"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                isDue
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-[rgb(var(--color-text-secondary))]"
              }`}
            >
              Total Due
            </span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isDue
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  : "bg-gray-500/10 text-gray-400"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p
            className={`text-base sm:text-xl font-bold truncate ${
              isDue
                ? "text-amber-600 dark:text-amber-400"
                : "text-[rgb(var(--color-text-primary))]"
            }`}
          >
            {formatCurrency(totalDue)}
          </p>
        </div>

        {/* Total Invoices */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
              Total Invoices
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base sm:text-xl font-bold text-[rgb(var(--color-text-primary))]">
            {totalInvoices}
          </p>
        </div>

        {/* Items Purchased */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
              Items Purchased
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base sm:text-xl font-bold text-[rgb(var(--color-text-primary))]">
            {totalItems}
          </p>
        </div>

        {/* Total Profit */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
              Total Profit
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 truncate">
            {formatCurrency(totalProfit)}
          </p>
        </div>

        {/* Account Status */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
              Account Status
            </span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                account.accountStatus === "ACTIVE"
                  ? "bg-emerald-500 ring-4 ring-emerald-500/20"
                  : account.accountStatus === "BLOCKED"
                  ? "bg-red-500 ring-4 ring-red-500/20"
                  : "bg-gray-400 ring-4 ring-gray-400/20"
              }`}
            />
          </div>
          <p
            className={`text-base sm:text-lg font-bold capitalize ${
              account.accountStatus === "ACTIVE"
                ? "text-emerald-600 dark:text-emerald-400"
                : account.accountStatus === "BLOCKED"
                ? "text-red-600 dark:text-red-400"
                : "text-[rgb(var(--color-text-primary))]"
            }`}
          >
            {account.accountStatus?.toLowerCase() || "active"}
          </p>
        </div>

        {/* Joined Date */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
              Customer Since
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-[rgb(var(--color-text-primary))]">
            {account.joinedAt && moment
              ? moment(account.joinedAt).format("DD MMM YYYY")
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Extra Return / Net profit if any */}
      {(account.totalReturns > 0 || account.netProfit !== undefined) && (
        <div className="pt-4 border-t border-[rgb(var(--color-border-primary))]/40 grid grid-cols-2 gap-4">
          {account.totalReturns > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                Total Returns
              </p>
              <p className="text-base font-bold text-[rgb(var(--color-text-primary))]">
                {account.totalReturns}
              </p>
            </div>
          )}
          {account.netProfit !== undefined && (
            <div>
              <p className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                Net Profit
              </p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(account.netProfit)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
