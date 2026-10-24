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
    gatewayType,
    isLiveSetup,
    events = [],
    instructions,
    secretNote,
  } = model;

  const gatewayName = gatewayType
    ? t(`settings.paymentGateway.types.${gatewayType}`, gatewayType)
    : "";

  const title = gatewayName
    ? `${gatewayName} ${t("settings.paymentGateway.webhookSetupTitle")}`
    : t("settings.paymentGateway.webhookSetupTitle");

  return (
    <div
      className={`rounded-lg border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/20 ${
        compact ? "p-3.5 space-y-3" : "p-4 space-y-4"
      }`}
    >
      <div>
        <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          {title}
        </h4>
        <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1 leading-relaxed">
          {instructions || t("settings.paymentGateway.webhookSetupDescription")}
        </p>
      </div>

      <CopyField
        label={t("settings.paymentGateway.webhookUrl")}
        value={webhookSetup.url}
      />

      {events && events.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
            {t("settings.paymentGateway.recommendedEvents", "Recommended Webhook Events")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {events.map((event) => (
              <span
                key={event}
                className="inline-flex items-center rounded-md bg-[rgb(var(--color-bg-secondary))] px-2 py-0.5 text-xs font-mono text-[rgb(var(--color-text-secondary))] border border-[rgb(var(--color-border-primary))]/50"
              >
                {event}
              </span>
            ))}
          </div>
        </div>
      )}

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
      ) : secretNote ? (
        <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
          {secretNote}
        </p>
      ) : null}

      {!isLiveSetup && (
        <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
          {showSecret && hasSecret
            ? t("settings.paymentGateway.webhookSetupInstructions")
            : t("settings.paymentGateway.webhookSetupInstructionsExisting")}
        </p>
      )}
    </div>
  );
}
