"use client";
export function ExpensesReportTemplateView({ model }) {
  const {
    styles,
    ReportHeader,
    selectedStore,
    SummarySection,
    summaryCards,
    DetailsSection,
    tableColumns,
    tableData,
    ReportFooter,
  } = model;
  return (
    <div className={`${styles.report} analytics-report`}>
      <ReportHeader title="EXPENSES ANALYTICS" selectedStore={selectedStore} />

      <SummarySection cards={summaryCards} />

      <DetailsSection
        title="Financial Breakdown"
        columns={tableColumns}
        data={tableData}
      />

      <ReportFooter reportType="expenses analytics" />
    </div>
  );
}
