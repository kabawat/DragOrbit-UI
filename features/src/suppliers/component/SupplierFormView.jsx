"use client";
import {
  Building,
  Building2,
  Hash,
  Mail,
  Phone,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@dragorbit/ui";
export function SupplierFormPresentation({ model }) {
  const {
    mode,
    formData,
    handleInputChange,
    fieldErrors,
    isGstVerified,
    isVerifyingGst,
    handleVerifyGst,
  } = model;
  return (
    <div
      className={
        mode === "drawer"
          ? "space-y-6"
          : "grid grid-cols-1 lg:grid-cols-3 gap-8"
      }
    >
      {/* Left Side - Form */}
      <div
        className={mode === "drawer" ? "space-y-6" : "lg:col-span-2 space-y-6"}
      >
        {/* Basic Information Section */}
        <div className="bg-[rgb(var(--color-bg-primary))]/20 backdrop-blur-md rounded-lg  p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Supplier Name */}
            <Input
              type="text"
              label="Supplier Name"
              placeholder="Enter supplier name"
              value={formData.name || ""}
              onChange={(value) => handleInputChange("name", value)}
              error={!!fieldErrors.name}
              errorMessage={fieldErrors.name}
              helperText="Enter the full name of the supplier"
              required
              leftIcon={Building}
            />

            {/* GST Number */}
            <Input
              type="text"
              label="GST Number"
              placeholder="Enter GST number"
              value={formData.gstNumber || ""}
              onChange={(value) => {
                handleInputChange("gstNumber", value.toUpperCase());
                // Also clear gstDetail if GST number changes
                if (formData.gstDetail) {
                  handleInputChange("gstDetail", "");
                }
              }}
              onBlur={() => {
                if (
                  formData.gstNumber?.length === 15 &&
                  !isGstVerified &&
                  !isVerifyingGst
                ) {
                  handleVerifyGst(formData.gstNumber);
                }
              }}
              error={!!fieldErrors.gstNumber}
              errorMessage={fieldErrors.gstNumber}
              helperText="Enter the GST registration number (optional)"
              leftIcon={Hash}
              rightElement={
                formData.gstNumber?.length >= 15 && (
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleVerifyGst(formData.gstNumber)}
                    disabled={isVerifyingGst || isGstVerified}
                    className={`p-1.5 rounded-md transition-all disabled:opacity-70 ${
                      isGstVerified
                        ? "bg-green-500 text-white shadow-sm"
                        : "bg-[rgb(var(--color-primary))] text-white hover:brightness-110"
                    }`}
                    title={isGstVerified ? "Verified" : "Verify GST"}
                  >
                    {isVerifyingGst ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isGstVerified ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                  </button>
                )
              }
            />

            {/* Agency */}
            <Input
              type="text"
              label="Agency"
              placeholder="Enter agency name"
              value={formData.agency || ""}
              onChange={(value) => handleInputChange("agency", value)}
              error={!!fieldErrors.agency}
              errorMessage={fieldErrors.agency}
              helperText="Enter the agency or company name"
              required
              leftIcon={Building2}
            />

            {/* Phone Number */}
            <Input
              type="tel"
              label="Phone Number"
              placeholder="Enter phone number"
              value={formData.phone || ""}
              onChange={(value) => handleInputChange("phone", value)}
              error={!!fieldErrors.phone}
              errorMessage={fieldErrors.phone}
              helperText="Enter the supplier's phone number (optional if email provided)"
              leftIcon={Phone}
            />

            {/* Email Address */}
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter email address"
              value={formData.email || ""}
              onChange={(value) => handleInputChange("email", value)}
              error={!!fieldErrors.email}
              errorMessage={fieldErrors.email}
              helperText="Enter the supplier's email address (optional if phone provided)"
              leftIcon={Mail}
            />
          </div>
        </div>
      </div>

      {mode !== "drawer" && (
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[rgb(var(--color-primary))]/5 to-[rgb(var(--color-primary))]/10 backdrop-blur-md rounded-lg border border-[rgb(var(--color-primary))]/20 p-6 shadow-sm sticky top-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-[rgb(var(--color-primary))]/20 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-[rgb(var(--color-primary))]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                  Why Add Supplier Details?
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  Complete information helps in better business management
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm">📞</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    Easy Communication
                  </h4>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                    Quick contact for orders, inquiries, and business
                    discussions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm">📦</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    Order Management
                  </h4>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                    Track orders, deliveries, and manage inventory efficiently
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 text-sm">💰</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    Payment Tracking
                  </h4>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                    Manage payments, invoices, and financial transactions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm">📊</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    Business Analytics
                  </h4>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                    Analyze supplier performance and optimize procurement
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 text-sm">🤝</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    Relationship Management
                  </h4>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                    Build strong business relationships and partnerships
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[rgb(var(--color-bg-primary))]/20 rounded-lg border border-[rgb(var(--color-border-primary))]/30">
              <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
                💡 Pro Tips
              </h4>
              <ul className="text-xs text-[rgb(var(--color-text-secondary))] space-y-1">
                <li>• Always verify phone numbers for urgent communications</li>
                <li>• Email helps in sending purchase orders and invoices</li>
                <li>• Complete details improve business credibility</li>
                <li>• Regular communication builds strong partnerships</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
