"use client";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button, Card } from "@dragorbit/ui";
export function ExpenseAnalyticsScreen({ model }) {
  const {
    analytics,
    ExpensesReportTemplate,
    selectedStore,
    isLoading,
    t,
    sensors,
    handleMetricsDragEnd,
    metrics,
    SortableMetricCard,
    setAmountCards,
    amountCards,
    SortableCard,
    handleCardsDragEnd,
    cards,
    categoryData,
    paymentMethodData,
    formatCurrency,
    formatNumber,
    amounts,
    counts,
    exportMenuRef,
    setShowExportMenu,
    showExportMenu,
    handleDownloadPDF,
    handleDownloadXLSX,
    getExpensesXLSXConfig,
  } = model;
  return (
    <>
      <div
        id="expenses-report-area"
        className="absolute -left-[9999px] -top-[9999px] w-[850px]"
      >
        {analytics && (
          <ExpensesReportTemplate
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
                {t("expenses.analytics.loading")}
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
                onDragEnd={(e) => {
                  const { active, over } = e;
                  if (active.id !== over.id) {
                    setAmountCards((items) => {
                      const oldIndex = items.findIndex(
                        (i) => i.id === active.id,
                      );
                      const newIndex = items.findIndex((i) => i.id === over.id);
                      return arrayMove(items, oldIndex, newIndex);
                    });
                  }
                }}
              >
                <SortableContext
                  items={amountCards.map((c) => c.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {amountCards.map((card) => (
                      <SortableCard key={card.id} id={card.id}>
                        <Card>
                          <div className="p-4 text-center">
                            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
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
                              <div className="space-y-3">
                                {Object.entries(
                                  card.id === "chart1"
                                    ? categoryData
                                    : paymentMethodData,
                                ).map(([key, data]) => (
                                  <div
                                    key={key}
                                    className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-3 border-[var(--color-border-primary-light)]"
                                  >
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                                        {key}
                                      </span>
                                      <span
                                        className={`text-sm font-semibold ${card.id === "chart1" ? "text-purple-600 dark:text-purple-400" : "text-indigo-600 dark:text-indigo-400"}`}
                                      >
                                        {formatCurrency(data.amount)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-[rgb(var(--color-text-secondary))]">
                                      <span>
                                        {formatNumber(data.count)}
                                        {t("common.expenses").toLowerCase()}
                                      </span>
                                      <span>
                                        {amounts.totalAmount > 0
                                          ? (
                                              (data.amount /
                                                amounts.totalAmount) *
                                              100
                                            ).toFixed(1)
                                          : 0}
                                        %
                                      </span>
                                    </div>
                                  </div>
                                ))}
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
                                <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                  <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                    {t("expenses.analytics.paidAmount")}
                                  </p>
                                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(amounts.paidAmount)}
                                  </p>
                                  <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                                    {formatNumber(counts.paidExpenses)}
                                    {t("common.expenses").toLowerCase()}
                                  </p>
                                </div>
                                <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                  <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                    {t("expenses.analytics.pendingAmount")}
                                  </p>
                                  <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                                    {formatCurrency(amounts.pendingAmount)}
                                  </p>
                                  <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                                    {formatNumber(counts.pendingExpenses)}
                                    {t("common.expenses").toLowerCase()}
                                  </p>
                                </div>
                                <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 text-center">
                                  <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2">
                                    {t("expenses.analytics.todayAmount")}
                                  </p>
                                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(amounts.todayAmount)}
                                  </p>
                                  <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                                    {formatNumber(counts.todayExpenses)}
                                    {t("common.expenses").toLowerCase()}
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
            {t("expenses.analytics.downloadReport")}
          </Button>

          {showExportMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-50">
              <button
                onClick={() => {
                  handleDownloadPDF(analytics);
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]"
              >
                <FileText className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                {t("expenses.analytics.downloadAsPDF")}
              </button>
              <button
                onClick={() => {
                  handleDownloadXLSX(
                    analytics,
                    selectedStore,
                    "expenses-analytics-report",
                    getExpensesXLSXConfig(),
                  );
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]"
              >
                <FileSpreadsheet className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                {t("expenses.analytics.downloadAsXLSX")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
