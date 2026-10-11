"use client";
export function GatewayWebhookSetupView({ model }) {
  const {
    compact,
    t,
    CopyField,
    webhookSetup,
    showSecret,
    hasSecret,
    secretConfigured,
    onRegenerateSecret,
    isRegenerating,
  } = model;
  return (
    <div
      className={`rounded-lg border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/20 ${compact ? "p-3 space-y-3" : "p-4 space-y-4"}`}
    >
      <div>
        <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          {t("settings.paymentGateway.webhookSetupTitle")}
        </h4>
        <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
          {t("settings.paymentGateway.webhookSetupDescription")}
        </p>
      </div>

      <CopyField
        label={t("settings.paymentGateway.webhookUrl")}
        value={webhookSetup.url}
      />

      {showSecret && hasSecret ? (
        <CopyField
          label={t("settings.paymentGateway.webhookSecretDragbizz")}
          value={webhookSetup.webhookSecret}
        />
      ) : secretConfigured ? (
        <div className="space-y-2">
          <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
            {t("settings.paymentGateway.webhookSecretConfigured")}
          </p>
          {onRegenerateSecret ? (
            <>
              <button
                type="button"
                onClick={onRegenerateSecret}
                disabled={isRegenerating}
                className="text-xs font-medium text-[rgb(var(--color-primary))] hover:underline disabled:opacity-50 cursor-pointer"
              >
                {isRegenerating
                  ? t("settings.paymentGateway.webhookSecretGenerating")
                  : t("settings.paymentGateway.webhookSecretGetForRazorpay")}
              </button>
              <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
                {t("settings.paymentGateway.webhookSecretRegenerateHint")}
              </p>
            </>
          ) : null}
        </div>
      ) : null}

      <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
        {showSecret && hasSecret
          ? t("settings.paymentGateway.webhookSetupInstructions")
          : t("settings.paymentGateway.webhookSetupInstructionsExisting")}
      </p>
    </div>
  );
}
