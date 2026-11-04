"use client";

import { useState } from "react";
import { Check, Copy, Mail, MapPin, Phone, StickyNote, User } from "lucide-react";

export function ViewComponentsCustomerBasicInfoPresentation({ model }) {
  const { t, customerData = {}, CustomerSourceBadge } = model;
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    if (!text || typeof window === "undefined" || !navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const name = customerData.name || t("common.na") || "Customer";
  const initials = (name.replace(/[^a-zA-Z0-9 ]/g, "").trim().split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("") || "C").toUpperCase();

  return (
    <div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] p-5 sm:p-6 shadow-xs">
      {/* Top Customer Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgb(var(--color-border-primary))]/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary))]/80 text-white font-bold text-xl sm:text-2xl flex items-center justify-center shadow-md shadow-[rgb(var(--color-primary))]/20 shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text-primary))] truncate">
                {name}
              </h1>
              {CustomerSourceBadge && customerData.source && (
                <CustomerSourceBadge source={customerData.source} />
              )}
            </div>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-text-secondary))] mt-0.5">
              {t("customers.customerInformation") || "Customer Profile & Details"}
            </p>
          </div>
        </div>
      </div>

      {/* Contact & Profile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-6">
        {/* Phone */}
        <div className="p-4 rounded-xl border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/30 flex items-center justify-between gap-3 group hover:border-[rgb(var(--color-primary))]/40 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                {t("customers.customerPhone") || "Phone"}
              </p>
              {customerData.phone ? (
                <a
                  href={`tel:${customerData.phone}`}
                  className="text-sm font-semibold text-[rgb(var(--color-text-primary))] hover:text-[rgb(var(--color-primary))] transition-colors block truncate"
                >
                  {customerData.phone}
                </a>
              ) : (
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  {t("common.na") || "Not provided"}
                </p>
              )}
            </div>
          </div>
          {customerData.phone && (
            <button
              type="button"
              onClick={() => handleCopy(customerData.phone, "phone")}
              className="p-1.5 rounded-lg text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors shrink-0"
              title="Copy phone"
            >
              {copiedField === "phone" ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              )}
            </button>
          )}
        </div>

        {/* Email */}
        <div className="p-4 rounded-xl border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/30 flex items-center justify-between gap-3 group hover:border-[rgb(var(--color-primary))]/40 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                {t("customers.customerEmail") || "Email"}
              </p>
              {customerData.email ? (
                <a
                  href={`mailto:${customerData.email}`}
                  title={customerData.email}
                  className="text-sm font-semibold text-[rgb(var(--color-text-primary))] hover:text-[rgb(var(--color-primary))] transition-colors block truncate"
                >
                  {customerData.email}
                </a>
              ) : (
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  {t("common.na") || "Not provided"}
                </p>
              )}
            </div>
          </div>
          {customerData.email && (
            <button
              type="button"
              onClick={() => handleCopy(customerData.email, "email")}
              className="p-1.5 rounded-lg text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors shrink-0"
              title="Copy email"
            >
              {copiedField === "email" ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              )}
            </button>
          )}
        </div>

        {/* Source */}
        <div className="p-4 rounded-xl border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-1">
              {t("customers.source") || "Source"}
            </p>
            {CustomerSourceBadge && customerData.source ? (
              <CustomerSourceBadge source={customerData.source} />
            ) : (
              <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))] capitalize">
                {customerData.source || "Direct"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Optional Note */}
      {customerData.note && (
        <div className="mt-4 p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 flex items-start gap-3">
          <StickyNote className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
              {t("customers.note") || "Note"}
            </p>
            <p className="text-sm text-[rgb(var(--color-text-primary))] whitespace-pre-wrap break-words leading-relaxed">
              {customerData.note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
