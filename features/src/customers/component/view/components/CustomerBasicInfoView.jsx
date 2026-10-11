"use client";
import { Mail, Phone, StickyNote, User, MapPin } from "lucide-react";
export function ViewComponentsCustomerBasicInfoPresentation({ model }) {
  const { t, customerData, CustomerSourceBadge } = model;
  return (
    <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[rgb(var(--color-primary))]/20 to-[rgb(var(--color-primary))]/10 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
              {t("customers.customerInformation")}
            </h2>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {t("customers.enterBasicDetails")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="relative p-4 bg-gradient-to-br from-[rgb(var(--color-primary))]/15 to-[rgb(var(--color-primary))]/10 dark:from-[rgb(var(--color-primary))]/5 dark:to-[rgb(var(--color-primary))]/3 rounded-xl overflow-hidden">
          <User className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-[rgb(var(--color-primary))]/35 dark:!text-[rgb(var(--color-primary))] dark:opacity-40" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              {t("customers.customerName")}
            </p>
            <p className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
              {customerData.name || t("common.na")}
            </p>
          </div>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-blue-50/15 to-blue-100/10 dark:from-blue-900/5 dark:to-blue-800/3 rounded-xl overflow-hidden">
          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-blue-500/35 dark:!text-blue-400 dark:opacity-40" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              {t("customers.customerPhone")}
            </p>
            <p className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
              {customerData.phone || t("common.na")}
            </p>
          </div>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-purple-50/15 to-purple-100/10 dark:from-purple-900/5 dark:to-purple-800/3 rounded-xl overflow-hidden">
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-purple-500/35 dark:!text-purple-400 dark:opacity-40" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              {t("customers.customerEmail")}
            </p>
            <p className="text-base font-semibold text-[rgb(var(--color-text-primary))] break-all">
              {customerData.email || t("common.na")}
            </p>
          </div>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-teal-50/15 to-teal-100/10 dark:from-teal-900/5 dark:to-teal-800/3 rounded-xl overflow-hidden">
          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-teal-500/35 dark:!text-teal-400 dark:opacity-40" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-2">
              {t("customers.source")}
            </p>
            <CustomerSourceBadge source={customerData.source} />
          </div>
        </div>
      </div>

      {customerData.note && (
        <div className="mt-4 relative p-4 bg-gradient-to-br from-amber-50/15 to-amber-100/10 dark:from-amber-900/5 dark:to-amber-800/3 rounded-xl overflow-hidden">
          <StickyNote className="absolute right-4 top-4 w-10 h-10 text-amber-500/35 dark:!text-amber-400 dark:opacity-40" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
              {t("customers.note")}
            </p>
            <p className="text-sm text-[rgb(var(--color-text-primary))] whitespace-pre-wrap break-words">
              {customerData.note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
