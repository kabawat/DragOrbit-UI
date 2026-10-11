"use client";
import { Calendar, Download } from "lucide-react";
import {
  Button,
  Checkbox,
  DateRangeFilter,
  Select,
  SideDrawer,
} from "@dragorbit/ui";
export function SupplierDownloadDrawerPresentation({ model }) {
  const {
    isOpen,
    handleClose,
    t,
    selectedDownloadPeriod,
    handleDownloadPeriodChange,
    downloadFormat,
    setDownloadFormat,
    sortOrder,
    setSortOrder,
    handleSelectAll,
    handleDeselectAll,
    availableFields,
    selectedFields,
    handleFieldToggle,
    customStartDate,
    customEndDate,
    setCustomStartDate,
    setCustomEndDate,
    getCustomDateRangePreview,
    getDateRangePreview,
    handleDownload,
    isDownloading,
  } = model;
  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={t("suppliers.downloadSuppliers")}
      icon={Download}
      description={t("suppliers.selectTimePeriodToDownload")}
      width="w-full md:w-[500px] lg:w-[600px]"
    >
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
              {t("suppliers.selectTimePeriod")}
            </label>
            <Select
              placeholder={t("suppliers.selectATimePeriod")}
              options={[
                { label: t("suppliers.last1Month"), value: "1month" },
                { label: t("suppliers.last3Months"), value: "3months" },
                { label: t("suppliers.last6Months"), value: "6months" },
                { label: t("suppliers.last12Months"), value: "12months" },
                { label: t("suppliers.customRange"), value: "custom" },
              ]}
              value={selectedDownloadPeriod}
              onChange={handleDownloadPeriodChange}
              clearable={false}
            />
          </div>

          {selectedDownloadPeriod && (
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
                {t("suppliers.downloadFormat")}
              </label>
              <Select
                placeholder={t("suppliers.selectFormat")}
                options={[
                  { label: t("suppliers.csv"), value: "csv" },
                  { label: t("suppliers.excelXlsx"), value: "xlsx" },
                  { label: t("suppliers.pdf"), value: "pdf" },
                ]}
                value={downloadFormat}
                onChange={setDownloadFormat}
                clearable={false}
              />
            </div>
          )}

          {selectedDownloadPeriod && (
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
                {t("suppliers.sortOrder")}
              </label>
              <Select
                placeholder={t("suppliers.selectSortOrder")}
                options={[
                  { label: t("suppliers.nameAscending"), value: "nameAsc" },
                  { label: t("suppliers.nameDescending"), value: "nameDesc" },
                  { label: t("suppliers.dateAscending"), value: "dateAsc" },
                  { label: t("suppliers.dateDescending"), value: "dateDesc" },
                ]}
                value={sortOrder}
                onChange={setSortOrder}
                clearable={false}
              />
            </div>
          )}

          {selectedDownloadPeriod && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {t("suppliers.selectFields")}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs font-medium px-2 py-1 rounded text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:bg-opacity-10 transition-colors duration-200"
                  >
                    {t("suppliers.selectAll")}
                  </button>
                  <span className="text-[rgb(var(--color-text-secondary))] text-xs">
                    |
                  </span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-xs font-medium px-2 py-1 rounded text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:bg-opacity-10 transition-colors duration-200"
                  >
                    {t("suppliers.deselectAll")}
                  </button>
                </div>
              </div>
              <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-2">
                  {availableFields.map((field) => {
                    const isChecked = selectedFields.includes(field.key);
                    return (
                      <div
                        key={field.key}
                        className={`rounded-lg transition-all duration-200 `}
                      >
                        <div className="[&>div]:!items-center [&>div]:!space-x-2.5">
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleFieldToggle(field.key)}
                            label={field.label}
                            id={`field-${field.key}`}
                            className={
                              isChecked
                                ? "[&_label]:!text-[rgb(var(--color-primary))] [&_label]:!font-medium"
                                : ""
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  {t("suppliers.selectedFieldsCount", {
                    count: selectedFields.length,
                  })}
                </p>
                {selectedFields.length === availableFields.length && (
                  <span className="text-xs text-[rgb(var(--color-primary))] font-medium">
                    {t("suppliers.allFieldsSelected")}
                  </span>
                )}
              </div>
            </div>
          )}

          {selectedDownloadPeriod === "custom" && (
            <DateRangeFilter
              startDate={customStartDate}
              endDate={customEndDate}
              onChange={({ startDate: nextStart, endDate: nextEnd }) => {
                setCustomStartDate(nextStart);
                setCustomEndDate(nextEnd);
              }}
            />
          )}

          {selectedDownloadPeriod &&
            (() => {
              let dateRange = null;
              if (selectedDownloadPeriod === "custom") {
                dateRange = getCustomDateRangePreview();
              } else {
                dateRange = getDateRangePreview(selectedDownloadPeriod);
              }

              return dateRange ? (
                <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                    <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide">
                      {t("suppliers.dateRange")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
                        {t("suppliers.from")}
                      </div>
                      <div className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                        {dateRange.start}
                      </div>
                    </div>
                    <div className="space-y-1 border-l border-[rgb(var(--color-border-primary))] pl-4">
                      <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-1">
                        {t("suppliers.to")}
                      </div>
                      <div className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                        {dateRange.end}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

          {selectedDownloadPeriod && (
            <div className="pt-2 flex justify-start">
              <Button
                variant="primary"
                onClick={handleDownload}
                disabled={
                  isDownloading ||
                  (selectedDownloadPeriod === "custom" &&
                    (!customStartDate || !customEndDate))
                }
                loading={isDownloading}
              >
                {isDownloading
                  ? t("suppliers.downloading")
                  : t("suppliers.downloadButton")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </SideDrawer>
  );
}
