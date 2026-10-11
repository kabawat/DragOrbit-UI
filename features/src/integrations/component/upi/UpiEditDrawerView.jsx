"use client";
import { Save } from "lucide-react";
import { Button, Input, Modal, MultiSelect, Toggle } from "@dragorbit/ui";
export function UpiEditDrawerView({ model }) {
  const {
    isOpen,
    handleCancel,
    t,
    isSaving,
    form,
    setForm,
    errors,
    setErrors,
    storeOptions,
    handleSave,
  } = model;
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={`${t("settings.upi.edit")} UPI`}
      size="md"
      closeOnOverlayClick={!isSaving}
      closeOnEscape={!isSaving}
      className="!shadow-none"
    >
      <div className="space-y-4">
        <p className="text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
          {t("settings.upi.manageUpiDescription")}
        </p>
        <Input
          label={t("settings.upi.upiId")}
          placeholder="merchant@paytm"
          value={form.upiId}
          onChange={(val) => {
            setForm((p) => ({ ...p, upiId: val ?? "" }));
            if (errors.upiId) setErrors((p) => ({ ...p, upiId: null }));
          }}
          error={!!errors.upiId}
          errorMessage={errors.upiId}
        />
        <Input
          label={t("settings.upi.labelOptional")}
          placeholder="Primary, Backup..."
          value={form.label}
          onChange={(val) => setForm((p) => ({ ...p, label: val ?? "" }))}
        />
        <MultiSelect
          label={t("settings.upi.assignToStores")}
          placeholder={t("settings.upi.selectStores")}
          options={storeOptions}
          value={form.storeIds?.map((id) => String(id)) || []}
          onChange={(vals) => setForm((p) => ({ ...p, storeIds: vals || [] }))}
          error={!!errors.storeIds}
          errorMessage={errors.storeIds}
          clearable={false}
        />
        <Toggle
          label={t("settings.upi.setAsDefault")}
          checked={form.isDefault}
          onChange={(checked) => setForm((p) => ({ ...p, isDefault: checked }))}
        />
        <div className="flex justify-end gap-3 border-t border-[rgb(var(--color-border-primary))]/60 pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            leftIcon={Save}
            onClick={handleSave}
            isLoading={isSaving}
          >
            {isSaving ? "Saving..." : t("common.save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
