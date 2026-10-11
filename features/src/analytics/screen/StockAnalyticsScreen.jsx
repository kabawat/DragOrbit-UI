"use client";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button, Card } from "@dragorbit/ui";
export function StockAnalyticsScreen({ model }) {
  const {
    analytics,
    StockReportTemplate,
    selectedStore,
    isLoading,
    sensors,
    handleMetricsDragEnd,
    metrics,
    SortableMetricCard,
    handleCardsDragEnd,
    statusCards,
    cards,
    SortableCard,
    StockChart,
    formatCurrency,
    valueSummary,
    exportMenuRef,
    setShowExportMenu,
    showExportMenu,
    handleDownloadPDF,
    handleDownloadXLSX,
    getStockXLSXConfig,
  } = model;
  return (
    <>
      <div
        id="stock-report-area"
        className="absolute -left-[9999px] -top-[9999px] w-[850px]"
      >
        {analytics && (
          <StockReportTemplate
            analyticsData={analytics}
            selectedStore={selectedStore}
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
                  items={[
                    ...statusCards.map((c) => c.id),
                    ...cards.map((c) => c.id),
                  ]}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statusCards.map((card) => (
                      <SortableCard key={card.id} id={card.id}>
                        <Card>
                          <div className="p-4 text-center">
                            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">
                              {card.title}
                            </h3>
                            <p
                              className={`text-2xl font-bold ${card.color} mb-1`}
                            >
                              {card.value}
                            </p>
                            <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                              {card.label}
                            </p>
                          </div>
                        </Card>
                      </SortableCard>
                    ))}
                    {cards.map((card) => (
                      <SortableCard key={card.id} id={card.id}>
                        {card.type === "chart" && (
                          <Card>
                            <div className="p-6">
                              <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4">
                                {card.title}
                              </h3>
                              <div className="h-64 overflow-hidden">
                                <StockChart
                                  type={card.id === "chart1" ? "line" : "area"}
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                  <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                    Total Stock Value
                                  </p>
                                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(
                                      valueSummary.totalStockValue,
                                    )}
                                  </p>
                                </div>
                                <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                  <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                    Average Cost
                                  </p>
                                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(valueSummary.averageCost)}
                                  </p>
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
                  handleDownloadXLSX(
                    analytics,
                    selectedStore,
                    "stock-analytics-report",
                    getStockXLSXConfig(),
                  );
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
