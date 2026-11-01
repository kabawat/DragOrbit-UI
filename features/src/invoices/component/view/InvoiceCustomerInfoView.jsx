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
  const phone =
    customer?.phone || customer?.mobile || invoiceData?.customerPhone || "N/A";
  const email =
    customer?.email || invoiceData?.customerEmail || "N/A";
  const gstin =
    customer?.gstNumber || customer?.gstin || invoiceData?.customerGst || null;
  const isWalkIn =
    !customer || (!customer.name && !customer.phone && !customer.email);

  return (
    <div className="w-full px-5 sm:px-6 py-4 border-b border-[rgb(var(--color-border-primary))]/30 bg-[rgb(var(--color-bg-secondary))]/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 min-w-0">
        {/* Left: Customer Identity */}
        <div className="min-w-0 flex-1 flex items-start gap-3">
          <div className="p-2 bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] rounded-lg hidden sm:flex items-center justify-center shrink-0 mt-0.5">
            <User className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[rgb(var(--color-text-primary))] truncate max-w-full">
                {customerName}
              </h2>
              {isWalkIn && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] border border-[rgb(var(--color-border-primary))]/40 shrink-0">
                  Walk-In
                </span>
              )}
            </div>
            <p
              className="text-xs text-[rgb(var(--color-text-secondary))] font-medium truncate max-w-md"
              title={customerAddress}
            >
              {customerAddress}
            </p>
          </div>
        </div>

        {/* Right: Contact & Identity Grid (responsive, never overflows) */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-[rgb(var(--color-border-primary))]/20 min-w-0 shrink-0">
          {/* Phone */}
          <div className="min-w-0 flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-tertiary))] shrink-0">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider">
                Phone
              </p>
              <p
                className="text-xs font-semibold text-[rgb(var(--color-text-primary))] truncate max-w-[120px] sm:max-w-[150px]"
                title={phone}
              >
                {phone}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="min-w-0 flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-tertiary))] shrink-0">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider">
                Email
              </p>
              <p
                className="text-xs font-semibold text-[rgb(var(--color-text-primary))] lowercase truncate max-w-[140px] sm:max-w-[180px]"
                title={email}
              >
                {email}
              </p>
            </div>
          </div>

          {/* GSTIN */}
          {gstin && (
            <div className="min-w-0 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider">
                  GSTIN
                </p>
                <p
                  className="text-xs font-bold text-[rgb(var(--color-primary))] font-mono tracking-wide truncate max-w-[140px]"
                  title={gstin}
                >
                  {gstin}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceCustomerInfoView;
