"use client";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import {
  Download,
  IndianRupee,
  Receipt,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Button, Card, Select } from "@dragorbit/ui";
export function GstAnalyticsScreen({ model }) {
  const {
    period,
    setPeriod,
    handleSync,
    isSyncing,
    openTallyExport,
    t,
    setShowExportDrawer,
    isLoading,
    sensors,
    handleMetricsDragEnd,
    metrics,
    formatCurrency,
    netPosition,
    outward,
    inward,
    SortableMetricCard,
    handleCardsDragEnd,
    cards,
    SortableCard,
    StatRow,
    GstHealthScoreWidget,
    healthScore,
    isLoadingHealthScore,
    GstMismatchList,
    mismatches,
    isLoadingMismatches,
    GstExportDrawer,
    showExportDrawer,
    handleExport,
    TallyExportDrawer,
    showTallyExportDrawer,
    setShowTallyExportDrawer,
    handleTallyExport,
  } = model;
  return (
    <div className="flex h-screen bg-[rgb(var(--color-bg-secondary))] relative">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-24">
              <Select
                options={[2023, 2024, 2025, 2026].map((y) => ({
                  label: String(y),
                  value: String(y),
                }))}
                value={String(period.year)}
                onChange={(val) =>
                  setPeriod((p) => ({ ...p, year: parseInt(val, 10) }))
                }
                placeholder="Year"
                clearable={false}
              />
            </div>
            <div className="w-40">
              <Select
                options={[
                  { label: "All months", value: "" },
                  ...Array.from({ length: 12 }, (_, i) => ({
                    label: new Date(2000, i).toLocaleString("default", {
                      month: "long",
                    }),
                    value: String(i + 1),
                  })),
                ]}
                value={period.month}
                onChange={(val) => setPeriod((p) => ({ ...p, month: val }))}
                placeholder="Month"
                clearable={false}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {period.month && (
              <Button
                variant="secondary"
                onClick={handleSync}
                size="sm"
                isLoading={isSyncing}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 mr-2 ${isSyncing ? "animate-spin" : ""}`}
                />
                Sync Data
              </Button>
            )}
            <Button variant="secondary" onClick={openTallyExport} size="sm">
              <Download className="w-3.5 h-3.5 mr-2" />
              {t("integrations.exportTally")}
            </Button>
            <Button
              variant="primary"
              leftIcon={Download}
              onClick={() => setShowExportDrawer(true)}
              size="sm"
            >
              {t("gst.exportForCA") || "Export for CA"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-[rgb(var(--color-text-tertiary))]">
              Loading analytics data...
            </p>
          </div>
        ) : (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleMetricsDragEnd}
            >
              <SortableContext
                items={metrics.map((m) => m.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {metrics.map((metric) => {
                    const valueMap = {
                      netGst: formatCurrency(Math.abs(netPosition.totalGst)),
                      totalGst: formatCurrency(Math.abs(outward.totalGst)),
                      totalItc: formatCurrency(Math.abs(inward.totalItc)),
                      taxableValue: formatCurrency(
                        Math.abs(outward.taxableAmount),
                      ),
                    };
                    const subtextMap = {
                      netGst:
                        (netPosition.totalGst || 0) < 0
                          ? "Tax Credit Available"
                          : "Tax Payable",
                      totalGst: `${outward.invoiceCount ?? 0} invoices`,
                      totalItc: `${inward.billCount ?? 0} bills`,
                      taxableValue: "Total Sales Base",
                    };
                    return (
                      <SortableMetricCard
                        key={metric.id}
                        id={metric.id}
                        title={t(metric.titleKey) || metric.titleKey}
                        value={valueMap[metric.id]}
                        subtext={subtextMap[metric.id]}
                        icon={metric.icon}
                        iconColor={metric.iconColor}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCardsDragEnd}
            >
              <SortableContext
                items={cards.map((c) => c.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                  {cards.map((card) => (
                    <SortableCard key={card.id} id={card.id}>
                      {card.id === "outwardSupplies" && (
                        <Card className="border-[var(--color-border-primary-light)] overflow-hidden bg-[rgb(var(--color-bg-primary))]">
                          <div className="p-0">
                            <div className="p-4 bg-[rgb(var(--color-bg-secondary))]/30 border-b border-[var(--color-border-primary-light)] flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                                  <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                                    {card.title}
                                  </h3>
                                  <p className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider font-semibold">
                                    GSTR-1 Section
                                  </p>
                                </div>
                              </div>
                              <span className="text-[0.625rem] font-bold px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md border border-green-500/20">
                                Invoices ({outward.invoiceCount || 0})
                              </span>
                            </div>
                            <div className="p-5 space-y-1">
                              <StatRow
                                label={t("gst.taxableValue")}
                                value={formatCurrency(outward.taxableAmount)}
                                icon={Receipt}
                              />
                              <div className="grid grid-cols-2 gap-3 py-3">
                                <div className="p-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-xl border border-[var(--color-border-primary-light)]">
                                  <p className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] uppercase font-bold mb-1">
                                    {t("gst.b2bSales")}
                                  </p>
                                  <p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                                    {formatCurrency(outward.b2bTaxable)}
                                  </p>
                                </div>
                                <div className="p-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-xl border border-[var(--color-border-primary-light)]">
                                  <p className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] uppercase font-bold mb-1">
                                    {t("gst.b2cSales")}
                                  </p>
                                  <p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                                    {formatCurrency(outward.b2cTaxable)}
                                  </p>
                                </div>
                              </div>
                              <div className="pt-2 space-y-1">
                                <p className="text-[0.625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase mb-2 tracking-wide">
                                  GST Distribution
                                </p>
                                <StatRow
                                  label={t("gst.cgst")}
                                  value={formatCurrency(outward.cgst)}
                                  color="text-green-600 dark:text-green-400"
                                />
                                <StatRow
                                  label={t("gst.sgst")}
                                  value={formatCurrency(outward.sgst)}
                                  color="text-green-600 dark:text-green-400"
                                />
                                <StatRow
                                  label={t("gst.igst")}
                                  value={formatCurrency(outward.igst)}
                                  color="text-green-600 dark:text-green-400"
                                />
                                {(outward.utgst > 0 || outward.cess > 0) && (
                                  <>
                                    {outward.utgst > 0 && (
                                      <StatRow
                                        label={t("gst.utgst")}
                                        value={formatCurrency(outward.utgst)}
                                        color="text-green-600 dark:text-green-400"
                                      />
                                    )}
                                    {outward.cess > 0 && (
                                      <StatRow
                                        label={t("gst.cess")}
                                        value={formatCurrency(outward.cess)}
                                        color="text-green-600 dark:text-green-400"
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                              {outward.totalItemsWithGst > 0 && (
                                <div className="mt-4 p-2 bg-[rgb(var(--color-bg-secondary))]/30 rounded-lg flex items-center justify-between">
                                  <span className="text-[0.625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase">
                                    {t("gst.hsnCoverage")}
                                  </span>
                                  <span className="text-xs font-bold text-[rgb(var(--color-text-primary))]">
                                    {Math.round(
                                      (outward.itemsWithHsn /
                                        outward.totalItemsWithGst) *
                                        100,
                                    )}
                                    %
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-4 bg-[rgb(var(--color-primary))]/5 border-t border-[var(--color-border-primary-light)] flex justify-between items-center group hover:bg-[rgb(var(--color-primary))]/10 transition-colors cursor-default">
                              <span className="text-sm font-bold text-[rgb(var(--color-text-secondary))]">
                                {t("gst.totalOutputTax")}
                              </span>
                              <span className="text-lg font-black text-green-600 dark:text-green-400 tabular-nums">
                                {formatCurrency(outward.totalGst)}
                              </span>
                            </div>
                          </div>
                        </Card>
                      )}
                      {card.id === "inwardSupplies" && (
                        <Card className="border-[var(--color-border-primary-light)] overflow-hidden bg-[rgb(var(--color-bg-primary))]">
                          <div className="p-0">
                            <div className="p-4 bg-[rgb(var(--color-bg-secondary))]/30 border-b border-[var(--color-border-primary-light)] flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                  <IndianRupee className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                                    {card.title}
                                  </h3>
                                  <p className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider font-semibold">
                                    GSTR-2B Section
                                  </p>
                                </div>
                              </div>
                              <span className="text-[0.625rem] font-bold px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md border border-blue-500/20">
                                Bills ({inward.billCount || 0})
                              </span>
                            </div>
                            <div className="p-5 space-y-1">
                              <StatRow
                                label={t("gst.taxableValueInward")}
                                value={formatCurrency(inward.taxableAmount)}
                                icon={Receipt}
                              />
                              <div className="grid grid-cols-2 gap-3 py-3">
                                <div className="p-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-xl border border-[var(--color-border-primary-light)]">
                                  <p className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] uppercase font-bold mb-1">
                                    {t("gst.itcEligible")}
                                  </p>
                                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(inward.b2bTaxable)}
                                  </p>
                                </div>
                                <div className="p-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-xl border border-[var(--color-border-primary-light)]">
                                  <p className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] uppercase font-bold mb-1">
                                    {t("gst.nonItcPurchase")}
                                  </p>
                                  <p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                                    {formatCurrency(inward.b2cTaxable)}
                                  </p>
                                </div>
                              </div>
                              <div className="pt-2 space-y-1">
                                <p className="text-[0.625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase mb-2 tracking-wide">
                                  ITC Breakdown
                                </p>
                                <StatRow
                                  label={t("gst.cgstInward")}
                                  value={formatCurrency(inward.cgst)}
                                  color="text-blue-600 dark:text-blue-400"
                                />
                                <StatRow
                                  label={t("gst.sgstInward")}
                                  value={formatCurrency(inward.sgst)}
                                  color="text-blue-600 dark:text-blue-400"
                                />
                                <StatRow
                                  label={t("gst.igstInward")}
                                  value={formatCurrency(inward.igst)}
                                  color="text-blue-600 dark:text-blue-400"
                                />
                                {(inward.utgst > 0 || inward.cess > 0) && (
                                  <>
                                    {inward.utgst > 0 && (
                                      <StatRow
                                        label={t("gst.utgstInward")}
                                        value={formatCurrency(inward.utgst)}
                                        color="text-blue-600 dark:text-blue-400"
                                      />
                                    )}
                                    {inward.cess > 0 && (
                                      <StatRow
                                        label={t("gst.cess")}
                                        value={formatCurrency(inward.cess)}
                                        color="text-blue-600 dark:text-blue-400"
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                              {inward.totalItemsWithGst > 0 && (
                                <div className="mt-4 p-2 bg-[rgb(var(--color-bg-secondary))]/30 rounded-lg flex items-center justify-between">
                                  <span className="text-[0.625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase">
                                    {t("gst.compliance")}
                                  </span>
                                  <span className="text-xs font-bold text-[rgb(var(--color-text-primary))]">
                                    {Math.round(
                                      (inward.itemsWithHsn /
                                        inward.totalItemsWithGst) *
                                        100,
                                    )}
                                    % HSN
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-4 bg-[rgb(var(--color-primary))]/5 border-t border-[var(--color-border-primary-light)] flex justify-between items-center group hover:bg-[rgb(var(--color-primary))]/10 transition-colors cursor-default">
                              <span className="text-sm font-bold text-[rgb(var(--color-text-secondary))]">
                                {t("gst.totalItc")}
                              </span>
                              <span className="text-lg font-black text-blue-600 dark:text-blue-400 tabular-nums">
                                {formatCurrency(inward.totalItc)}
                              </span>
                            </div>
                          </div>
                        </Card>
                      )}
                    </SortableCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-10">
              <div className="lg:col-span-1">
                <GstHealthScoreWidget
                  healthScore={healthScore}
                  isLoading={isLoadingHealthScore}
                />
              </div>
              <div className="lg:col-span-3">
                <GstMismatchList
                  mismatches={mismatches?.mismatches ?? []}
                  isLoading={isLoadingMismatches}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <GstExportDrawer
        isOpen={showExportDrawer}
        onClose={() => setShowExportDrawer(false)}
        onExport={handleExport}
        isLoading={isLoading}
      />
      <TallyExportDrawer
        isOpen={showTallyExportDrawer}
        onClose={() => setShowTallyExportDrawer(false)}
        onExport={handleTallyExport}
        isLoading={isLoading}
      />
    </div>
  );
}
