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
  return (
    <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))] p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-full flex items-center justify-center">
          <Wallet className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
            Account Details
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            Customer purchase and payment information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative p-4 bg-gradient-to-br from-blue-50/15 to-blue-100/10 dark:from-blue-900/5 dark:to-blue-800/3 rounded-xl overflow-hidden">
          <IndianRupee className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-blue-500/35 dark:!text-blue-400 dark:opacity-40" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              Total Amount
            </p>
            <p className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
              ₹
              {account.totalAmount?.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              }) || "0.00"}
            </p>
          </div>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-purple-50/15 to-purple-100/10 dark:from-purple-900/5 dark:to-purple-800/3 rounded-xl overflow-hidden">
          <Receipt
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-purple-500/35 dark:!text-purple-400"
            style={{ opacity: "0.4" }}
          />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              Total Invoices
            </p>
            <p className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
              {account.totalInvoices || 0}
            </p>
          </div>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-indigo-50/15 to-indigo-100/10 dark:from-indigo-900/5 dark:to-indigo-800/3 rounded-xl overflow-hidden">
          <ShoppingCart className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-indigo-500/35 dark:!text-indigo-400 dark:opacity-40" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              Items Purchased
            </p>
            <p className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
              {account.totalItemsPurchased || 0}
            </p>
          </div>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-green-50/15 to-green-100/10 dark:from-green-900/5 dark:to-green-800/3 rounded-xl overflow-hidden">
          <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-green-500/35 dark:!text-green-400 dark:opacity-40" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              Total Profit
            </p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              ₹
              {account.totalProfit?.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              }) || "0.00"}
            </p>
          </div>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-emerald-50/15 to-emerald-100/10 dark:from-emerald-900/5 dark:to-emerald-800/3 rounded-xl overflow-hidden">
          <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-emerald-500/35 dark:text-emerald-400/40" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              Total Paid
            </p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ₹
              {account.totalPaid?.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              }) || "0.00"}
            </p>
          </div>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-orange-50/15 to-orange-100/10 dark:from-orange-900/5 dark:to-orange-800/3 rounded-xl overflow-hidden">
          <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-orange-500/35 dark:!text-orange-400 dark:opacity-40" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              Total Due
            </p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              ₹
              {account.totalDue?.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              }) || "0.00"}
            </p>
          </div>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-gray-50/15 to-gray-100/10 dark:from-gray-900/5 dark:to-gray-800/3 rounded-xl overflow-hidden">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
            <div
              className={`w-8 h-8 rounded-full ${account.accountStatus === "ACTIVE" ? "bg-green-500/35 dark:!bg-green-400 dark:opacity-40" : account.accountStatus === "BLOCKED" ? "bg-red-500/35 dark:!bg-red-400 dark:opacity-40" : "bg-gray-500/35 dark:!bg-gray-400 dark:opacity-40"}`}
            ></div>
          </div>
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              Account Status
            </p>
            <p
              className={`text-lg font-bold ${account.accountStatus === "ACTIVE" ? "text-green-600 dark:text-green-400" : account.accountStatus === "BLOCKED" ? "text-red-600 dark:text-red-400" : "text-[rgb(var(--color-text-primary))]"}`}
            >
              {account.accountStatus || "ACTIVE"}
            </p>
          </div>
        </div>

        {account.joinedAt && (
          <div className="relative p-4 bg-gradient-to-br from-teal-50/15 to-teal-100/10 dark:from-teal-900/5 dark:to-teal-800/3 rounded-xl overflow-hidden">
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-teal-500/35 dark:!text-teal-400 dark:opacity-40" />
            <div className="relative z-10">
              <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
                Joined At
              </p>
              <p className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
                {moment(account.joinedAt).format("DD MMM YYYY")}
              </p>
            </div>
          </div>
        )}
      </div>

      {(account.totalReturns > 0 || account.netProfit !== undefined) && (
        <div className="mt-6 pt-6 border-t border-[rgb(var(--color-border-primary))]">
          <h3 className="text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-4">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {account.totalReturns > 0 && (
              <div>
                <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-2">
                  Total Returns
                </p>
                <p className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
                  {account.totalReturns || 0}
                </p>
              </div>
            )}
            {account.netProfit !== undefined && (
              <div>
                <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-2">
                  Net Profit
                </p>
                <p className="text-base font-semibold text-green-600 dark:text-green-400">
                  ₹
                  {account.netProfit?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  }) || "0.00"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
