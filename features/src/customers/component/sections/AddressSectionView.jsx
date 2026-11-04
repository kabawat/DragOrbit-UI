"use client";
import { Trash2 } from "lucide-react";
import { Button, Input, Select } from "@dragorbit/ui";
export function SectionsAddressSectionPresentation({ model }) {
  const {
    label,
    onRemove,
    t,
    addressData,
    handleFieldChange,
    fieldErrors,
    type,
    INDIAN_STATES,
  } = model;
  return (
    <div className="border border-[rgb(var(--color-border-primary))]/30 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
          {label}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="text"
          label={t("customers.addressLine1")}
          placeholder={t("customers.enterAddressLine1")}
          value={addressData?.addressLine1 || ""}
          onChange={(value) => handleFieldChange("addressLine1", value)}
          error={!!fieldErrors[`addresses.${type}.addressLine1`]}
          errorMessage={fieldErrors[`addresses.${type}.addressLine1`]}
          className="md:col-span-2"
          size="sm"
        />
        <Input
          type="text"
          label={t("customers.city")}
          placeholder={t("customers.enterCity")}
          value={addressData?.city || ""}
          onChange={(value) => handleFieldChange("city", value)}
          error={!!fieldErrors[`addresses.${type}.city`]}
          errorMessage={fieldErrors[`addresses.${type}.city`]}
          size="sm"
        />
        <Select
          label={t("customers.state")}
          placeholder={t("customers.selectState")}
          options={INDIAN_STATES}
          value={addressData?.stateCode || ""}
          onChange={(value) => handleFieldChange("stateCode", value)}
          error={!!fieldErrors[`addresses.${type}.stateCode`]}
          errorMessage={fieldErrors[`addresses.${type}.stateCode`]}
          searchable
          clearable
          size="sm"
        />
        <Input
          type="text"
          label={t("customers.pincode")}
          placeholder={t("customers.enterPincode")}
          value={addressData?.pincode || ""}
          onChange={(value) => handleFieldChange("pincode", value)}
          error={!!fieldErrors[`addresses.${type}.pincode`]}
          errorMessage={fieldErrors[`addresses.${type}.pincode`]}
          size="sm"
        />
        <Input
          type="text"
          label={t("customers.country")}
          placeholder={t("customers.enterCountry")}
          value={addressData?.country || ""}
          onChange={(value) => handleFieldChange("country", value)}
          error={!!fieldErrors[`addresses.${type}.country`]}
          errorMessage={fieldErrors[`addresses.${type}.country`]}
          size="sm"
        />
      </div>
    </div>
  );
}
