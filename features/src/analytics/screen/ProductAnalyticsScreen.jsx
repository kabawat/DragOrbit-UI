"use client";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button, Card } from "@dragorbit/ui";
export function ProductAnalyticsScreen({ model }) {
  const {
    analytics,
    ProductsReportTemplate,
    selectedStore,
    sensors,
    handleMetricsDragEnd,
    metrics,
    SortableMetricCard,
    handleCardsDragEnd,
    cards,
    SortableCard,
    ProductsChart,
    formatNumber,
    exportMenuRef,
    setShowExportMenu,
    showExportMenu,
    handleDownloadPDF,
    handleDownloadXLSX,
    getProductsXLSXConfig,
  } = model;
  return (
    <>
      <div
        id="products-report-area"
        className="absolute -left-[9999px] -top-[9999px] w-[850px]"
      >
        {analytics && (
          <ProductsReportTemplate
            analyticsData={analytics}
            selectedStore={selectedStore}
          />
        )}
      </div>

      <div className="flex h-screen bg-[rgb(var(--color-bg-secondary))] relative">
        <div className="flex-1 p-6 overflow-y-auto">
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
                            <ProductsChart
                              type={card.id === "chart1" ? "bar" : "area"}
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
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 border-[var(--color-border-primary-light)] text-center">
                              <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                Total Products
                              </p>
                              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                {formatNumber(analytics.totals.totalProducts)}
                              </p>
                            </div>
                            <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 border-[var(--color-border-primary-light)] text-center">
                              <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                Active Products
                              </p>
                              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                {formatNumber(analytics.totals.activeProducts)}
                              </p>
                            </div>
                            <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 border-[var(--color-border-primary-light)] text-center">
                              <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                Inactive Products
                              </p>
                              <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                                {formatNumber(
                                  analytics.totals.inactiveProducts,
                                )}
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
        </div>
      </div>

      <div className="no-print fixed bottom-6 right-6 z-50" ref={exportMenuRef}>
        <div className="relative">
          <Button
            variant="primary"
            leftIcon={Download}
            rightIcon={ChevronDown}
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={!analytics}
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
                    "products-analytics-report",
                    getProductsXLSXConfig(),
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
