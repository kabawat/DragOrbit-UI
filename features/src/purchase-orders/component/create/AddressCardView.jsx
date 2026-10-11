"use client";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Button, Card, Input, Toggle } from "@dragorbit/ui";
export function CreateAddressCardPresentation({ model }) {
  const {
    t,
    showBillingAddress,
    addAddress,
    showShippingAddress,
    formData,
    handleSameAsStoreToggle,
    hasStoreAddress,
    removeAddress,
    handleAddressFieldChange,
  } = model;
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg flex border border-[rgb(var(--color-border-primary))] items-center justify-center mr-3 bg-[rgb(var(--color-primary))]/10">
            <MapPin className="w-5 h-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
              {t("purchaseOrders.billingShippingAddresses")}
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {t("purchaseOrders.addBillingShippingInfo")}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {!showBillingAddress && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => addAddress("billing")}
                leftIcon={Plus}
              >
                {t("purchaseOrders.addBillingAddress")}
              </Button>
            )}
            {!showShippingAddress && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => addAddress("shipping")}
                leftIcon={Plus}
              >
                {t("purchaseOrders.addShippingAddress")}
              </Button>
            )}
          </div>

          {showBillingAddress && (
            <div className="border border-[rgb(var(--color-border-primary))]/40 rounded-lg p-4 space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <h3 className="text-md font-semibold text-[rgb(var(--color-text-primary))]">
                    {t("purchaseOrders.billingAddress")}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
                    <span>{t("purchaseOrders.sameAsStoreAddress")}</span>
                    <Toggle
                      size="sm"
                      checked={!!formData.billingAddress?.sameAsStore}
                      onChange={(value) =>
                        handleSameAsStoreToggle("billing", value)
                      }
                      disabled={!hasStoreAddress}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddress("billing")}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label={t("purchaseOrders.addressLine1")}
                  placeholder={t("purchaseOrders.enterAddressLine1")}
                  value={formData.billingAddress?.addressLine1 || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("billing", "addressLine1", value)
                  }
                  className="md:col-span-2"
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.addressLine2")}
                  placeholder={t("purchaseOrders.apartmentSuiteEtc")}
                  value={formData.billingAddress?.addressLine2 || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("billing", "addressLine2", value)
                  }
                  className="md:col-span-2"
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.city")}
                  placeholder={t("purchaseOrders.enterCity")}
                  value={formData.billingAddress?.city || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("billing", "city", value)
                  }
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.state")}
                  placeholder={t("purchaseOrders.enterState")}
                  value={formData.billingAddress?.state || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("billing", "state", value)
                  }
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.pincode")}
                  placeholder={t("purchaseOrders.enterPincode")}
                  value={formData.billingAddress?.pincode || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("billing", "pincode", value)
                  }
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.country")}
                  placeholder={t("purchaseOrders.enterCountry")}
                  value={formData.billingAddress?.country || "India"}
                  onChange={(value) =>
                    handleAddressFieldChange("billing", "country", value)
                  }
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.phoneNumber")}
                  placeholder={t("purchaseOrders.contactNumber")}
                  value={formData.billingAddress?.phone || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("billing", "phone", value)
                  }
                  size="sm"
                />
              </div>
            </div>
          )}

          {showShippingAddress && (
            <div className="border border-[rgb(var(--color-border-primary))]/40 rounded-lg p-4 space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <h3 className="text-md font-semibold text-[rgb(var(--color-text-primary))]">
                    {t("purchaseOrders.shippingAddress")}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
                    <span>{t("purchaseOrders.sameAsStoreAddress")}</span>
                    <Toggle
                      size="sm"
                      checked={!!formData.shippingAddress?.sameAsStore}
                      onChange={(value) =>
                        handleSameAsStoreToggle("shipping", value)
                      }
                      disabled={!hasStoreAddress}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddress("shipping")}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label={t("purchaseOrders.addressLine1")}
                  placeholder={t("purchaseOrders.enterAddressLine1")}
                  value={formData.shippingAddress?.addressLine1 || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("shipping", "addressLine1", value)
                  }
                  className="md:col-span-2"
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.addressLine2")}
                  placeholder={t("purchaseOrders.apartmentSuiteEtc")}
                  value={formData.shippingAddress?.addressLine2 || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("shipping", "addressLine2", value)
                  }
                  className="md:col-span-2"
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.city")}
                  placeholder={t("purchaseOrders.enterCity")}
                  value={formData.shippingAddress?.city || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("shipping", "city", value)
                  }
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.state")}
                  placeholder={t("purchaseOrders.enterState")}
                  value={formData.shippingAddress?.state || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("shipping", "state", value)
                  }
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.pincode")}
                  placeholder={t("purchaseOrders.enterPincode")}
                  value={formData.shippingAddress?.pincode || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("shipping", "pincode", value)
                  }
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.country")}
                  placeholder={t("purchaseOrders.enterCountry")}
                  value={formData.shippingAddress?.country || "India"}
                  onChange={(value) =>
                    handleAddressFieldChange("shipping", "country", value)
                  }
                  size="sm"
                />
                <Input
                  type="text"
                  label={t("purchaseOrders.phoneNumber")}
                  placeholder={t("purchaseOrders.contactNumber")}
                  value={formData.shippingAddress?.phone || ""}
                  onChange={(value) =>
                    handleAddressFieldChange("shipping", "phone", value)
                  }
                  size="sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
