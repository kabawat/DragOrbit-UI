"use client";
import { Plus } from "lucide-react";
import { Button } from "@dragorbit/ui";
export function GatewayHeaderView({ model }) {
  const { t, isLoading, gatewayCount, canCreate, onAddGateway } = model;
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold leading-6 text-[rgb(var(--color-text-primary))]">
          {t("settings.paymentGateway.manageGateways")}
        </h2>
        <p className="mt-0.5 text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
          {isLoading
            ? t("common.loading")
            : t("settings.paymentGateway.gatewayCount", {
                count: gatewayCount,
              })}
        </p>
      </div>
      {canCreate && (
        <Button
          variant="primary"
          size="sm"
          leftIcon={Plus}
          onClick={onAddGateway}
        >
          {t("settings.paymentGateway.addGateway")}
        </Button>
      )}
    </div>
  );
}
