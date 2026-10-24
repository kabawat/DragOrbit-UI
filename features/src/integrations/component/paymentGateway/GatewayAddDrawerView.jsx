"use client";
import { Plus, Save } from "lucide-react";
import { Input, MultiSelect, Select, Toggle } from "@dragorbit/ui";

export function GatewayAddDrawerView({ model }) {
  const {
    FormDrawer,
    isOpen,
    handleCancel,
    showingWebhookSetup,
    t,
    handleSave,
    isCreating,
    GatewayWebhookSetup,
    createdWebhookSetup,
    liveWebhookSetup,
    gatewayTypeOptions,
    form,
    handleGatewayTypeChange,
    errors,
    setForm,
    modeOptions,
    storeOptions,
    GatewayCredentialFields,
    gatewaySupportsWebhookSetup,
  } = model;

  return (
    <FormDrawer
      isOpen={isOpen}
      onClose={handleCancel}
      title={
        showingWebhookSetup
          ? t("settings.paymentGateway.webhookSetupTitle")
          : t("settings.paymentGateway.addGateway")
      }
      icon={Plus}
      description={
        showingWebhookSetup
          ? t("settings.paymentGateway.webhookSetupDescription")
          : t("settings.paymentGateway.manageDescription")
      }
      width="w-full md:w-[480px] lg:w-[520px]"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel={
        showingWebhookSetup
          ? t("settings.paymentGateway.webhookSetupDone")
          : isCreating
            ? "Adding..."
            : t("settings.paymentGateway.addGateway")
      }
      cancelLabel={showingWebhookSetup ? undefined : t("common.cancel")}
      isSaving={isCreating}
      saveIcon={Save}
      saveVariant="primary"
    >
      <div className="space-y-4">
        {showingWebhookSetup ? (
          <GatewayWebhookSetup
            webhookSetup={createdWebhookSetup}
            gatewayType={form.gatewayType}
            showSecret
          />
        ) : (
          <>
            <Select
              label={t("settings.paymentGateway.gatewayType")}
              options={gatewayTypeOptions}
              value={form.gatewayType}
              onChange={handleGatewayTypeChange}
              error={!!errors.gatewayType}
              errorMessage={errors.gatewayType}
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
              onChange={(vals) =>
                setForm((p) => ({ ...p, storeIds: vals || [] }))
              }
              error={!!errors.storeIds}
              errorMessage={errors.storeIds}
              clearable={false}
            />
            <Toggle
              label={t("settings.paymentGateway.setAsDefault")}
              checked={form.isDefault}
              onChange={(checked) =>
                setForm((p) => ({ ...p, isDefault: checked }))
              }
            />
            <GatewayCredentialFields
              gatewayType={form.gatewayType}
              values={form.credentials}
              errors={errors}
              onChange={(credentials) =>
                setForm((p) => ({ ...p, credentials }))
              }
            />
            {liveWebhookSetup && (
              <GatewayWebhookSetup
                webhookSetup={liveWebhookSetup}
                gatewayType={form.gatewayType}
                isLiveSetup
                compact
              />
            )}
          </>
        )}
      </div>
    </FormDrawer>
  );
}
