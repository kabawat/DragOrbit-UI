"use client";
import { Input, MultiSelect, Select, Toggle } from "@dragorbit/ui";
import { CreditCard, Save } from "lucide-react";

export function GatewayEditDrawerView({ model }) {
  const {
    FormDrawer,
    isOpen,
    handleCancel,
    t,
    handleSave,
    isSaving,
    gatewayType,
    form,
    setForm,
    modeOptions,
    storeOptions,
    errors,
    GatewayCredentialFields,
    webhookSetupView,
    GatewayWebhookSetup,
    handleRegenerateWebhookSecret,
    isRegeneratingSecret,
  } = model;

  return (
    <FormDrawer
      isOpen={isOpen}
      onClose={handleCancel}
      title={t("settings.paymentGateway.editGateway")}
      icon={CreditCard}
      description={t("settings.paymentGateway.manageDescription")}
      width="w-full md:w-[480px] lg:w-[520px]"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel={isSaving ? "Saving..." : t("common.save")}
      cancelLabel={t("common.cancel")}
      isSaving={isSaving}
      saveIcon={Save}
      saveVariant="primary"
    >
      <div className="space-y-4">
        <Input
          label={t("settings.paymentGateway.gatewayType")}
          value={gatewayType || ""}
          disabled
          readOnly
        />
        <Input
          label={t("settings.paymentGateway.labelOptional")}
          placeholder={t("settings.paymentGateway.labelPlaceholder")}
          value={form.label}
          onChange={(val) => setForm((p) => ({ ...p, label: val ?? "" }))}
        />
        <Select
          label={t("settings.paymentGateway.mode")}
          options={modeOptions}
          value={form.mode}
          onChange={(val) => setForm((p) => ({ ...p, mode: val }))}
        />
        <MultiSelect
          label={t("settings.paymentGateway.assignToStores")}
          placeholder={t("settings.paymentGateway.selectStores")}
          options={storeOptions}
          value={form.storeIds?.map((id) => String(id)) || []}
          onChange={(vals) => setForm((p) => ({ ...p, storeIds: vals || [] }))}
          error={!!errors.storeIds}
          errorMessage={errors.storeIds}
          clearable={false}
        />
        <Toggle
          label={t("settings.paymentGateway.setAsDefault")}
          checked={form.isDefault}
          onChange={(checked) => setForm((p) => ({ ...p, isDefault: checked }))}
        />
        <GatewayCredentialFields
          gatewayType={gatewayType}
          values={form.credentials}
          errors={errors}
          onChange={(credentials) => setForm((p) => ({ ...p, credentials }))}
          isEdit
        />
        {webhookSetupView && (
          <GatewayWebhookSetup
            webhookSetup={webhookSetupView}
            gatewayType={gatewayType}
            showSecret={Boolean(webhookSetupView.webhookSecret)}
            compact
            onRegenerateSecret={
              webhookSetupView.webhookSecret
                ? undefined
                : handleRegenerateWebhookSecret
            }
            isRegenerating={isRegeneratingSecret}
          />
        )}
      </div>
    </FormDrawer>
  );
}
