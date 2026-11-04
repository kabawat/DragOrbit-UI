"use client";
import { Button, Input } from "@dragorbit/ui";
import { Search, Grid3X3, List, Plus } from "lucide-react";
export function PaymentListHeaderView({ model }) {
  const {
    t,
    searchValue,
    onSearchChange,
    searchRef,
    viewMode,
    onViewModeChange,
    canCreate,
    onCreate,
    filters,
    syncStatus,
  } = model;
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <Input
          ref={searchRef}
          value={searchValue}
          onChange={onSearchChange}
          placeholder={t("payments.searchPlaceholder")}
          leftIcon={Search}
        />
        {filters}
      </div>
      <div className="flex gap-3 items-center">
        {syncStatus}
        <div className="flex bg-[rgb(var(--color-bg-secondary))] rounded-lg">
          <Button
            variant={viewMode === "table" ? "primary" : "ghost"}
            onClick={() => onViewModeChange("table")}
            leftIcon={List}
          >
            {t("common.tableView")}
          </Button>
          <Button
            variant={viewMode === "card" ? "primary" : "ghost"}
            onClick={() => onViewModeChange("card")}
            leftIcon={Grid3X3}
          >
            {t("common.cardView")}
          </Button>
        </div>
        {canCreate && (
          <Button leftIcon={Plus} onClick={onCreate}>
            {t("payments.createPayment")}
          </Button>
        )}
      </div>
    </div>
  );
}
