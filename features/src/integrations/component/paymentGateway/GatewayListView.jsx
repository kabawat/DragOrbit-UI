"use client";
import { CreditCard, Edit2, Plus, Trash2 } from "lucide-react";
export function GatewayListView({ model }) {
  const {
    gateways,
    t,
    canEdit,
    onEditGateway,
    canDelete,
    onDeleteGateway,
    getMaskedIdentifier,
    getStoreNames,
    canCreate,
    onAddGateway,
  } = model;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gateways.map((gateway) => {
        const id = gateway.id;
        const secretsCount =
          gateway.credentials?.secretsConfigured?.length ?? 0;
        return (
          <div
            key={id}
            className="bg-[rgb(var(--color-bg-primary))]/20 rounded-lg border border-[rgb(var(--color-border-primary))]/70 p-6 relative flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                <div className="w-10 h-10 bg-[rgb(var(--color-primary))]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))]">
                  {gateway.gatewayType}
                </span>
                <span
                  className={`text-[0.625rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                    gateway.mode === "LIVE"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {gateway.mode === "LIVE"
                    ? t("settings.paymentGateway.modeLive")
                    : t("settings.paymentGateway.modeTest")}
                </span>
                {gateway.isDefault && (
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex-shrink-0">
                    {t("settings.paymentGateway.defaultBadge")}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {canEdit && (
                  <button
                    onClick={() => onEditGateway?.(gateway)}
                    className="w-8 h-8 flex items-center justify-center bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded-lg transition-colors cursor-pointer"
                    title={t("settings.paymentGateway.edit")}
                  >
                    <Edit2 className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDeleteGateway?.(gateway)}
                    className="w-8 h-8 flex items-center justify-center bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded-lg transition-colors cursor-pointer"
                    title={t("settings.paymentGateway.delete")}
                  >
                    <Trash2 className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-1">
              {gateway.label || gateway.gatewayType}
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-3 font-mono break-all">
              {getMaskedIdentifier(gateway)}
            </p>

            <div className="space-y-1 mb-4">
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                <span className="font-medium text-[rgb(var(--color-text-primary))]">
                  {t("settings.paymentGateway.accessibleByStores")}:
                </span>{" "}
                {getStoreNames(gateway.storeIds)}
              </p>
              {secretsCount > 0 && (
                <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
                  {t("settings.paymentGateway.secretsConfigured", {
                    count: secretsCount,
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {canCreate && (
        <button
          type="button"
          onClick={onAddGateway}
          className="bg-[rgb(var(--color-bg-primary))]/20 rounded-lg border border-dashed border-[rgb(var(--color-border-primary))]/70 p-6 relative flex flex-col items-center justify-center h-full min-h-[220px] hover:border-[rgb(var(--color-primary))]/60 hover:bg-[rgb(var(--color-primary))]/5 transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 mb-4 rounded-full bg-[rgb(var(--color-primary))]/10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-[rgb(var(--color-primary))]" />
          </div>
          <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-1">
            {t("settings.paymentGateway.addGateway")}
          </h3>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] text-center max-w-[220px]">
            {t("settings.paymentGateway.addAnotherGateway")}
          </p>
        </button>
      )}
    </div>
  );
}
