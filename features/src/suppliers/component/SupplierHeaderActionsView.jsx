"use client";
import { Download, Grid3X3, List, Plus, Search } from "lucide-react";
import { Button, Input, Select } from "@dragorbit/ui";
export function SupplierHeaderActionsPresentation({ model }) {
  const {
    t,
    searchValue,
    onSearchChange,
    accountStatus,
    onAccountStatusChange,
    riskLevel,
    onRiskLevelChange,
    isActive,
    onIsActiveChange,
    suppliersCount,
    onViewModeChange,
    viewMode,
    onDownloadClick,
    onAddSupplierClick,
  } = model;
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center lg:flex-row gap-4 mb-0">
        {/* Search (always visible) */}
        <div className="w-100">
          <Input
            type="text"
            placeholder={`${t("common.search")} ${t("suppliers.title").toLowerCase()}...`}
            value={searchValue}
            onChange={onSearchChange}
            leftIcon={Search}
            className="w-100"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="min-w-[160px]">
            <Select
              placeholder="Account Status"
              value={accountStatus}
              onChange={onAccountStatusChange}
              options={[
                { value: "", label: "All statuses" },
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
                { value: "SUSPENDED", label: "Suspended" },
              ]}
              clearable
            />
          </div>
          <div className="min-w-[150px]">
            <Select
              placeholder="Risk Level"
              value={riskLevel}
              onChange={onRiskLevelChange}
              options={[
                { value: "", label: "All risk levels" },
                { value: "LOW", label: "Low" },
                { value: "MEDIUM", label: "Medium" },
                { value: "HIGH", label: "High" },
              ]}
              clearable
            />
          </div>
          <div className="min-w-[140px]">
            <Select
              placeholder="Status"
              value={isActive}
              onChange={onIsActiveChange}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              clearable
            />
          </div>
          {/* View Toggle (hide when no data) */}
          {suppliersCount > 0 && (
            <div className="flex bg-[rgb(var(--color-bg-secondary))] rounded-lg">
              <button
                onClick={() => onViewModeChange("table")}
                className={`px-3 cursor-pointer py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "table"
                    ? "bg-[rgb(var(--color-primary))] text-white"
                    : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                }`}
              >
                <List className="w-4 h-4" />
                {t("common.tableView")}
              </button>
              <button
                onClick={() => onViewModeChange("card")}
                className={`px-3 cursor-pointer py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "card"
                    ? "bg-[rgb(var(--color-primary))] text-white"
                    : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                {t("common.cardView")}
              </button>
            </div>
          )}
          <Button
            variant="secondary"
            onClick={onDownloadClick}
            leftIcon={Download}
          >
            {t("common.download")}
          </Button>
          <Button
            variant="primary"
            onClick={onAddSupplierClick}
            leftIcon={Plus}
          >
            {t("suppliers.addSupplier")}
          </Button>
        </div>
      </div>
    </div>
  );
}
