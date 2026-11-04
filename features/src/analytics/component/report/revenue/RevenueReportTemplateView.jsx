"use client";
export function RevenueReportTemplateView({ model }) {
  const {
    styles,
    ReportHeader,
    selectedStore,
    analyticsData,
    SummarySection,
    summaryCards,
    PerformanceSection,
    performanceCards,
    DetailsSection,
    tableColumns,
    tableData,
    ReportFooter,
  } = model;
  return (
    <div className={`${styles.report} analytics-report`}>
      <ReportHeader
        title="REVENUE ANALYTICS"
        selectedStore={selectedStore}
        lastSyncedAt={analyticsData?.lastSyncedAt}
      />

      <SummarySection cards={summaryCards} />

      <PerformanceSection
        title="Today's Performance"
        cards={performanceCards}
      />

      <DetailsSection
        title="Financial Breakdown"
        columns={tableColumns}
        data={tableData}
      />

      <ReportFooter reportType="revenue analytics" />
    </div>
  );
}
