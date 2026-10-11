"use client";
import {
  Building2,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Button, Card, Select } from "@dragorbit/ui";
export function BillAnalyticsScreen({ model }) {
  const {
    analytics,
    BillsReportTemplate,
    selectedStore,
    dateRange,
    setDateRange,
    DATE_RANGE_OPTIONS,
    supplierId,
    setSupplierId,
    suppliers,
    exportMenuRef,
    setShowExportMenu,
    showExportMenu,
    isLoading,
    handleDownloadPDF,
    handleDownloadXLSX,
    getBillsXLSXConfig,
    StatsGrid,
    metrics,
    handleMetricsDragEnd,
    amountCards,
    handleAmountCardsDragEnd,
    SortableCard,
    performanceMetrics,
    PerformanceCard,
    cards,
    handleCardsDragEnd,
    AnalyticsListCard,
    formatCurrency,
    AnalyticsChartCard,
    BillsChart,
    AnalyticsBreakdownCard,
    formatNumber,
    counts,
    amounts,
  } = model;
  return (
    <>
      <div
        id="bills-report-area"
        className="absolute -left-[9999px] -top-[9999px] w-[850px]"
      >
        {analytics && (
          <BillsReportTemplate
            analyticsData={analytics}
            selectedStore={selectedStore}
          />
        )}
      </div>

      <div className="flex h-screen bg-[rgb(var(--color-bg-secondary))] relative">
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 max-w-xs">
              <Select
                placeholder="Date Range"
                value={dateRange}
                onChange={(val) => setDateRange(val)}
                options={DATE_RANGE_OPTIONS}
                size="sm"
              />
            </div>

            <div className="flex-1 max-w-xs">
              <Select
                placeholder="Select Supplier"
                value={supplierId}
                onChange={(val) => setSupplierId(val)}
                options={[
                  { value: "all", label: "All Suppliers" },
                  ...(suppliers?.map((s) => ({
                    value: s.id || s._id,
                    label: s.name,
                  })) || []),
                ]}
                size="sm"
                searchable
              />
            </div>

            <div className="ml-auto no-print relative" ref={exportMenuRef}>
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
                <div className="absolute top-full right-0 mt-2 w-48 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-50">
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
                        "bills-analytics-report",
                        getBillsXLSXConfig(),
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
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-sm text-[rgb(var(--color-text-tertiary))]">
                Loading analytics data...
              </p>
            </div>
          ) : (
            <>
              <StatsGrid items={metrics} onItemsChange={handleMetricsDragEnd} />

              {/* Amount Cards - Single Row */}
              <StatsGrid
                items={amountCards}
                onItemsChange={handleAmountCardsDragEnd}
                columns={3}
                renderItem={(card) => (
                  <SortableCard key={card.id} id={card.id}>
                    <Card className="hover:shadow-md transition-shadow">
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                            {card.title}
                          </h3>
                          <div
                            className={`p-1.5 rounded-md bg-[rgb(var(--color-bg-secondary))] ${card.color}`}
                          >
                            <Filter className="w-4 h-4" />
                          </div>
                        </div>
                        <div>
                          <p
                            className={`text-2xl font-bold ${card.color} mb-1`}
                          >
                            {card.value}
                          </p>
                          <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                            {card.label}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </SortableCard>
                )}
              />

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {performanceMetrics.map((pm, idx) => (
                  <PerformanceCard
                    key={idx}
                    title={pm.title}
                    value={pm.value}
                    label={pm.label}
                    icon={pm.icon}
                    color={pm.color}
                  />
                ))}
              </div>

              {/* Other Cards */}
              <StatsGrid
                items={cards}
                onItemsChange={handleCardsDragEnd}
                columns={3}
                renderItem={(card) => (
                  <SortableCard key={card.id} id={card.id}>
                    {card.type === "list" && (
                      <AnalyticsListCard
                        title={card.title}
                        icon={
                          card.id === "supplierAnalysis"
                            ? Building2
                            : TrendingUp
                        }
                        items={analytics?.[card.key]}
                        formatItemValue={(item) =>
                          item.value
                            ? formatCurrency(item.value)
                            : item.percentage
                              ? `${item.percentage}%`
                              : ""
                        }
                      />
                    )}
                    {card.type === "chart" && (
                      <AnalyticsChartCard title={card.title}>
                        <BillsChart
                          type={card.id === "chart1" ? "line" : "area"}
                        />
                      </AnalyticsChartCard>
                    )}
                    {card.type === "breakdown" && (
                      <AnalyticsBreakdownCard
                        title={card.title}
                        items={[
                          {
                            label: "Paid Bills",
                            value: formatNumber(counts.paidBills),
                            subValue: formatCurrency(amounts.totalPaid),
                            colorClass: "text-green-600 dark:text-green-400",
                          },
                          {
                            label: "Pending Bills",
                            value: formatNumber(counts.pendingBills),
                            subValue: formatCurrency(amounts.totalDue),
                            colorClass: "text-yellow-600 dark:text-yellow-400",
                          },
                          {
                            label: "Overdue Bills",
                            value: formatNumber(counts.overdueBills),
                            colorClass: "text-red-600 dark:text-red-400",
                          },
                        ]}
                      />
                    )}
                  </SortableCard>
                )}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
