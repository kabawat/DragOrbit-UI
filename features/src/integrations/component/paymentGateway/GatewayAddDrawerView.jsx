"use client";
import { Check, CheckCircle2, Plus, Save } from "lucide-react";
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

  const currentGatewayName = t(
    `settings.paymentGateway.types.${form.gatewayType}`,
    form.gatewayType,
  );

  return (
    <FormDrawer
      isOpen={isOpen}
      onClose={handleCancel}
      title={
        showingWebhookSetup
          ? `${currentGatewayName} ${t("settings.paymentGateway.webhookSetupTitle")}`
          : t("settings.paymentGateway.addGateway")
      }
      icon={showingWebhookSetup ? CheckCircle2 : Plus}
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
      saveIcon={showingWebhookSetup ? Check : Save}
      saveVariant="primary"
    >
      <div className="space-y-4">
        {showingWebhookSetup ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {t("settings.paymentGateway.addedSuccess")}
                </h4>
                <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">
                  {t("settings.paymentGateway.webhookSetupPrompt")}
                </p>
              </div>
            </div>

            <GatewayWebhookSetup
              webhookSetup={createdWebhookSetup}
              gatewayType={form.gatewayType}
              showSecret
              hideInnerTitle
            />
          </div>
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
            {gatewaySupportsWebhookSetup(form.gatewayType) && (
              <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
                {t("settings.paymentGateway.webhookSecretAutoGenerateHint")}
              </p>
            )}
          </>
        )}
      </div>
    </FormDrawer>
  );
}
