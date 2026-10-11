"use client";
import { Grid3X3, List, Plus, RotateCcw, Search } from "lucide-react";
import { Button, Input, DateRangeFilter } from "@dragorbit/ui";
export function PurchaseOrderListHeaderView({ model }) {
  const {
    searchInputRef,
    t,
    searchValue,
    setSearchValue,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    hasActiveFilters,
    handleClearFilters,
    handleViewModeChange,
    viewMode,
    canCreate,
    onCreate,
    syncStatus,
  } = model;
  return (
    <>
      {syncStatus}
      <div className="p-5">
        <div className="flex justify-between items-center lg:flex-row gap-4 mb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="text"
              ref={searchInputRef}
              placeholder={`${t("common.search")} ${t("purchaseOrders.title").toLowerCase()}...`}
              value={searchValue}
              onChange={setSearchValue}
              leftIcon={Search}
              className="w-100"
            />
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onChange={({ startDate: nextStart, endDate: nextEnd }) => {
                setStartDate(nextStart);
                setEndDate(nextEnd);
              }}
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="h-10 px-3 text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {t("common.clearFilters")}
              </Button>
            )}
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex bg-[rgb(var(--color-bg-secondary))] rounded-lg">
              <button
                onClick={() => handleViewModeChange("table")}
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
                onClick={() => handleViewModeChange("card")}
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

            {canCreate && (
              <Button
                variant="primary"
                leftIcon={Plus}
                onClick={() => onCreate()}
              >
                {t("purchaseOrders.createPO")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
