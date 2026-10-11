"use client";
import { Input } from "@dragorbit/ui";
export function GatewayCredentialFieldsView({ model }) {
  const {
    config,
    gatewayType,
    t,
    isMaskedCredentialField,
    isEdit,
    values,
    handleFieldChange,
    errors,
  } = model;
  return (
    <div className="space-y-4">
      {config.fields.map((field) => {
        const labelKey = `settings.paymentGateway.fields.${gatewayType}.${field.key}`;
        const label = t(labelKey, field.key);
        const placeholder = isMaskedCredentialField(field)
          ? isEdit
            ? t("settings.paymentGateway.leaveBlankToKeep")
            : field.secret
              ? t("settings.paymentGateway.enterSecret")
              : t("settings.paymentGateway.enterValue")
          : undefined;

        return (
          <Input
            key={field.key}
            label={
              field.optional
                ? `${label} (${t("settings.paymentGateway.optional")})`
                : label
            }
            type={isMaskedCredentialField(field) ? "password" : "text"}
            placeholder={placeholder}
            value={values[field.key] ?? ""}
            onChange={(val) => handleFieldChange(field.key, val)}
            error={!!errors[field.key]}
            errorMessage={errors[field.key]}
            autoComplete="off"
          />
        );
      })}
    </div>
  );
}
