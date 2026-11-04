"use client";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button, Card } from "@dragorbit/ui";
export function RevenueAnalyticsScreen({ model }) {
  const {
    analytics,
    RevenueReportTemplate,
    selectedStore,
    isLoading,
    sensors,
    handleMetricsDragEnd,
    metrics,
    SortableMetricCard,
    handleCardsDragEnd,
    cards,
    SortableCard,
    RevenueChart,
    formatCurrency,
    today,
    formatNumber,
    summary,
    exportMenuRef,
    setShowExportMenu,
    showExportMenu,
    handleDownloadPDF,
    handleDownloadXLSX,
  } = model;
  return (
    <>
      <div
        id="revenue-report-area"
        className="absolute -left-[9999px] -top-[9999px] w-[850px]"
      >
        {analytics && (
          <RevenueReportTemplate
            analyticsData={analytics}
            selectedStore={selectedStore}
            hideGst={!selectedStore?.gst}
          />
        )}
      </div>

      <div className="p-5">
        <div className="max-w-8xl mx-auto">
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
                    {metrics.map((metric) => (
                      <SortableMetricCard key={metric.id} {...metric} />
                    ))}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                      <SortableCard key={card.id} id={card.id}>
                        {card.type === "chart" && (
                          <Card>
                            <div className="p-6">
                              <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4">
                                {card.title}
                              </h3>
                              <div className="h-64 overflow-hidden">
                                <RevenueChart
                                  type={card.id === "chart1" ? "area" : "line"}
                                />
                              </div>
                            </div>
                          </Card>
                        )}
                        {card.type === "breakdown" && (
                          <Card>
                            <div className="p-6">
                              <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4">
                                {card.title}
                              </h3>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                    <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                      Today Revenue
                                    </p>
                                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                      {formatCurrency(today.revenue)}
                                    </p>
                                    <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                                      {formatNumber(today.sales)} sales
                                    </p>
                                  </div>
                                  <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                    <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                      Today Profit
                                    </p>
                                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                      {formatCurrency(today.profit)}
                                    </p>
                                  </div>
                                  <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                    <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                      Total Revenue
                                    </p>
                                    <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                                      {formatCurrency(summary.totalRevenue)}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                    <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                      Total Profit
                                    </p>
                                    <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                                      {formatCurrency(summary.totalProfit)}
                                    </p>
                                  </div>
                                  <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                    <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                      Total Discount
                                    </p>
                                    <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                      {formatCurrency(summary.totalDiscount)}
                                    </p>
                                  </div>
                                  <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                    <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                      Total GST
                                    </p>
                                    <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                                      {formatCurrency(summary.totalGst)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        )}
                      </SortableCard>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          )}
        </div>
      </div>

      <div className="no-print fixed bottom-6 right-6 z-50" ref={exportMenuRef}>
        <div className="relative">
          <Button
            variant="primary"
            leftIcon={Download}
            rightIcon={ChevronDown}
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isLoading || !analytics}
          >
            Download Report
          </Button>

          {showExportMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-50">
              <button
                onClick={() => {
                  handleDownloadPDF(analytics);
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors duration-200 cursor-pointer hover:bg-[rgb(var(--color-bg-secondary))] focus:outline-none text-[rgb(var(--color-text-primary))]"
              >
                <FileText className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                Download as PDF
              </button>
              <button
                onClick={() => {
                  handleDownloadXLSX(analytics, selectedStore);
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors duration-200 cursor-pointer hover:bg-[rgb(var(--color-bg-secondary))] focus:outline-none text-[rgb(var(--color-text-primary))]"
              >
                <FileSpreadsheet className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                Download as XLSX
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
