"use client";
export function SalesReportTemplateView({ model }) {
  const {
    styles,
    ReportHeader,
    selectedStore,
    SummarySection,
    summaryCards,
    DetailsSection,
    todayPerformanceCards,
    tableColumns,
    tableData,
    ReportFooter,
  } = model;
  return (
    <div className={`${styles.report} analytics-report`}>
      <ReportHeader title="SALES ANALYTICS" selectedStore={selectedStore} />

      <SummarySection cards={summaryCards} />

      <DetailsSection title="Today's Performance">
        <SummarySection cards={todayPerformanceCards} />
      </DetailsSection>

      <DetailsSection
        title="Invoice Breakdown"
        columns={tableColumns}
        data={tableData}
      />

      <ReportFooter reportType="sales analytics" />
    </div>
  );
}
