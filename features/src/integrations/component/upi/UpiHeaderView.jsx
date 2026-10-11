"use client";
import { Plus } from "lucide-react";
import { Button } from "@dragorbit/ui";
export function UpiHeaderView({ model }) {
  const { t, isLoading, upiCount, onAddUpi } = model;
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold leading-6 text-[rgb(var(--color-text-primary))]">
          {t("settings.upi.manageUpi")}
        </h2>
        <p className="mt-0.5 text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
          {isLoading ? t("common.loading") : `${upiCount} UPI ID(s) registered`}
        </p>
      </div>
      <Button variant="primary" size="sm" leftIcon={Plus} onClick={onAddUpi}>
        {t("settings.upi.addNewUpi")}
      </Button>
    </div>
  );
}
