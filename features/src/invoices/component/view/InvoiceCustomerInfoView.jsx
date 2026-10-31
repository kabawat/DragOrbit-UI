"use client";

import { Building2, Mail, MapPin, Phone, User } from "lucide-react";

function formatCustomerAddress(customer) {
  if (!customer) return "Walk-In Customer / No registered address";
  if (typeof customer.address === "string" && customer.address.trim()) {
    return customer.address;
  }
  if (typeof customer.address === "object" && customer.address !== null) {
    const parts = [
      customer.address.line1,
      customer.address.line2,
      customer.address.street,
      customer.address.city,
      customer.address.state,
      customer.address.pincode,
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(", ");
  }
  const parts = [
    customer.city,
    customer.state,
    customer.pincode,
  ].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");

  return "Walk-In Customer / No registered address";
}

export function InvoiceCustomerInfoView({ customer, invoiceData }) {
  const customerName =
    customer?.name ||
    customer?.companyName ||
    invoiceData?.customerName ||
    "Walk-In Customer";

  const customerAddress = formatCustomerAddress(customer);
  const phone = customer?.phone || customer?.mobile || invoiceData?.customerPhone || "N/A";
  const email = customer?.email || invoiceData?.customerEmail || "N/A";
  const gstin = customer?.gstNumber || customer?.gstin || invoiceData?.customerGst || null;
  const isWalkIn = !customer || (!customer.name && !customer.phone && !customer.email);

  return (
    <div className="w-full px-6 py-4 border-b border-[rgb(var(--color-border-primary))]/30 bg-[rgb(var(--color-bg-secondary))]/5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12">
        {/* Left: Customer Identity */}
        <div className="min-w-0 flex-1 flex items-start gap-4">
          <div className="w-1.5 h-10 bg-[rgb(var(--color-primary))]/30 rounded-full mt-1 hidden sm:block shrink-0" />
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[rgb(var(--color-text-primary))] truncate">
                {customerName}
              </h2>
              {isWalkIn && (
                <span className="text-[0.625rem] font-semibold px-2 py-0.5 rounded bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] border border-[rgb(var(--color-border-primary))]/40">
                  Walk-In
                </span>
              )}
            </div>
            <p className="text-xs text-[rgb(var(--color-text-secondary))] font-medium line-clamp-1 max-w-xl">
              {customerAddress}
            </p>
          </div>
        </div>

        {/* Right: Contact & Identity Grid */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <p className="text-[0.5625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-widest">
                Phone
              </p>
              <p className="text-xs font-bold text-[rgb(var(--color-text-primary))]">
                {phone}
              </p>
            </div>
            <div className="h-6 w-px bg-[rgb(var(--color-border-primary))]/40 hidden sm:block" />
          </div>

          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <p className="text-[0.5625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-widest">
                Email
              </p>
              <p className="text-xs font-bold text-[rgb(var(--color-text-primary))] lowercase">
                {email}
              </p>
            </div>
            <div className="h-6 w-px bg-[rgb(var(--color-border-primary))]/40 hidden sm:block" />
          </div>

          {gstin && (
            <div className="space-y-0.5">
              <p className="text-[0.5625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-widest">
                GSTIN
              </p>
              <p className="text-xs font-black text-[rgb(var(--color-primary))] tracking-wide">
                {gstin}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceCustomerInfoView;
