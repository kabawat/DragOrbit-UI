"use client";
import { Download } from "lucide-react";
import { Button, Input, Select, SideDrawer } from "@dragorbit/ui";
export function GstExportDrawerView({ model }) {
  const {
    isOpen,
    onClose,
    period,
    setPeriod,
    MONTH_OPTIONS,
    QUARTER_OPTIONS,
    FORMAT_OPTIONS,
    format,
    setFormat,
    handleExport,
    isLoading,
    isGenerating,
    t,
  } = model;
  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Export for CA Filing"
      width="w-full sm:w-[28rem] md:w-[32rem]"
    >
      <div className="p-3 sm:p-4 md:p-6 h-full">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 min-h-0 pb-4">
            <Input
              label="Year"
              type="number"
              value={period.year}
              onChange={(val) =>
                setPeriod((p) => ({
                  ...p,
                  year: Number(val) || new Date().getFullYear(),
                }))
              }
              min={2020}
              max={2030}
            />
            <Select
              label="Month (optional)"
              options={MONTH_OPTIONS}
              value={period.month}
              onChange={(val) => setPeriod((p) => ({ ...p, month: val }))}
              placeholder="All months"
              clearable={false}
            />
            <Select
              label="Quarter (optional)"
              options={QUARTER_OPTIONS}
              value={period.quarter}
              onChange={(val) => setPeriod((p) => ({ ...p, quarter: val }))}
              placeholder="None"
              clearable={false}
            />
            <Select
              label="Format"
              options={FORMAT_OPTIONS}
              value={format}
              onChange={setFormat}
              clearable={false}
            />
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              Year = FY start (e.g. 2024 = Apr 2024–Mar 2025). Quarters follow
              Indian FY.
            </p>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              File will be generated in your browser.
            </p>
          </div>

          <div className="flex-shrink-0 bg-[rgb(var(--color-bg-primary))] border-t border-[rgb(var(--color-border-primary))] p-3 sm:p-4 -mx-3 sm:-mx-4 md:-mx-6 -mb-3 sm:-mb-4 md:-mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2 sm:gap-3">
            <Button
              variant="primary"
              leftIcon={Download}
              onClick={handleExport}
              disabled={isLoading || isGenerating}
              loading={isLoading || isGenerating}
              className="w-full sm:w-auto"
              size="sm"
            >
              Download
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading || isGenerating}
              className="w-full sm:w-auto"
              size="sm"
            >
              {t("common.cancel")}
            </Button>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}
