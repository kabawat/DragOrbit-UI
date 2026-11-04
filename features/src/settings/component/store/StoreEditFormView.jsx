"use client";
import { Input, Select, Tooltip as SharedTooltip, Toggle } from "@dragorbit/ui";
import {
  Building2,
  CheckCircle,
  Hash,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
} from "lucide-react";
export function StoreEditFormView({ model }) {
  const {
    t,
    form,
    errors,
    handleInputChange,
    isGstVerified,
    isVerifyingGst,
    onVerifyGst,
    storeCategories,
    handleAddressChange,
  } = model;
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Business & GST Verification Section (Entry Point) */}
      <section className="bg-[rgb(var(--color-primary))]/5 border border-[rgb(var(--color-primary))]/20 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[rgb(var(--color-primary))] uppercase tracking-wider flex items-center">
            <Building2 className="w-4 h-4 mr-2" />
            {t("settings.businessInformation") || "Business Details"}
          </h3>
          {form.gst?.length >= 15 && !errors.gst && (
            <span className="text-[0.625rem] bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] px-2 py-0.5 rounded-full font-semibold animate-pulse">
              GST Ready to Verify
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label={t("settings.gstNumberOptional") || "GST Number (Optional)"}
            name="gst"
            type="text"
            value={form.gst || ""}
            onChange={(value) => handleInputChange("gst", value)}
            onBlur={() => {
              if (
                form.gst?.length === 15 &&
                !isGstVerified &&
                !isVerifyingGst
              ) {
                onVerifyGst();
              }
            }}
            placeholder="e.g. 07AAKCS5515R1ZN"
            leftIcon={Building2}
            error={errors.gst}
            errorMessage={errors.gst}
            rightElement={
              form.gst?.length >= 15 && (
                <SharedTooltip content={isGstVerified ? "Verified" : "Verify GST"}><button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={onVerifyGst}
                  disabled={isVerifyingGst || isGstVerified}
                  className={`p-1.5 rounded-md transition-all disabled:opacity-70 ${
                    isGstVerified
                      ? "bg-green-500 text-white shadow-sm"
                      : "bg-[rgb(var(--color-primary))] text-white hover:brightness-110"
                  }`}

                >
                  {isVerifyingGst ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isGstVerified ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </button></SharedTooltip>
              )
            }
          />

          <Input
            label={t("settings.panNumberOptional") || "PAN Number (Optional)"}
            name="pan"
            type="text"
            value={form.pan || ""}
            onChange={(value) => handleInputChange("pan", value)}
            placeholder="ABCDE1234F"
            leftIcon={Hash}
            error={errors.pan}
            errorMessage={errors.pan}
          />
        </div>

        <p className="text-[0.6875rem] text-[rgb(var(--color-text-tertiary))] italic">
          Tip: Enter GST and click Verify to automatically pre-fill store name
          and address.
        </p>
      </section>

      {/* 2. Store Basics Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-[rgb(var(--color-border-primary))]/50">
          <Store className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            {t("settings.generalInformation") || "Store Basics"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label={t("settings.storeName") || "Store Name"}
            name="name"
            type="text"
            value={form.name || ""}
            onChange={(value) => handleInputChange("name", value)}
            placeholder={t("settings.enterStoreName") || "Your Store Name"}
            leftIcon={Store}
            error={errors.name}
            errorMessage={errors.name}
            required
          />

          <Select
            label={t("settings.storeCategoryOptional") || "Business Category"}
            name="category"
            value={form.category || ""}
            onChange={(value) => handleInputChange("category", value)}
            options={storeCategories}
            placeholder={
              t("settings.selectStoreCategory") || "Select a category"
            }
            searchable={true}
          />

          <Input
            label={t("settings.phoneNumber") || "Contact Number"}
            name="phone"
            type="tel"
            value={form.phone || ""}
            onChange={(value) => handleInputChange("phone", value)}
            placeholder={t("settings.enterPhoneNumber") || "10-digit mobile"}
            leftIcon={Phone}
            error={errors.phone}
            errorMessage={errors.phone}
            required
          />

          <Input
            label={t("settings.emailOptional") || "Email (Optional)"}
            name="email"
            type="email"
            value={form.email || ""}
            onChange={(value) => handleInputChange("email", value)}
            placeholder={t("settings.enterEmailAddress") || "store@example.com"}
            leftIcon={Mail}
            error={errors.email}
            errorMessage={errors.email}
          />
        </div>
      </section>

      {/* 3. Location Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-[rgb(var(--color-border-primary))]/50">
          <MapPin className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            {t("settings.addressInformation") || "Location Details"}
          </h3>
        </div>

        <div className="space-y-5">
          <Input
            label={
              t("settings.streetAddressOptional") || "Full Address / Street"
            }
            name="address.street"
            type="text"
            value={form.address?.street || form.address?.line1 || ""}
            onChange={(value) => handleAddressChange("street", value)}
            placeholder={
              t("settings.enterStreetAddress") || "Building name, Road, Area"
            }
            leftIcon={MapPin}
            error={errors["address.street"] || errors["address.line1"]}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label={t("settings.city") || "City"}
              name="address.city"
              type="text"
              value={form.address?.city || ""}
              onChange={(value) => handleAddressChange("city", value)}
              placeholder="e.g. Delhi"
              error={errors["address.city"]}
              required
            />

            <Input
              label={t("settings.stateOptional") || "State"}
              name="address.state"
              type="text"
              value={form.address?.state || ""}
              onChange={(value) => handleAddressChange("state", value)}
              placeholder="e.g. DL"
            />

            <Input
              label={t("settings.pincodeOptional") || "Pincode"}
              name="address.pincode"
              type="text"
              value={form.address?.pincode || ""}
              onChange={(value) => handleAddressChange("pincode", value)}
              placeholder="110001"
              maxLength={6}
            />

            <Input
              label={t("settings.landmarkOptional") || "Landmark"}
              name="address.landmark"
              type="text"
              value={form.address?.landmark || ""}
              onChange={(value) => handleAddressChange("landmark", value)}
              placeholder="Opp. Metro station"
            />
          </div>
        </div>
      </section>
      {/* 4. Additional Settings */}
      <section className="bg-[rgb(var(--color-bg-secondary))] dark:bg-[rgb(var(--color-bg-secondary))]/10 p-5 rounded-2xl border border-[rgb(var(--color-border-primary))]/50">
        <Toggle
          label={
            t("settings.productsRequireExpiryDate") ||
            "Products require expiry date"
          }
          checked={form.hasExpiryDate || false}
          onChange={(checked) => handleInputChange("hasExpiryDate", checked)}
          helperText={
            t("settings.productsRequireExpiryDateHint") ||
            "Enable this for Grocery, Food or Pharmacy stores."
          }
        />
      </section>
    </div>
  );
}
