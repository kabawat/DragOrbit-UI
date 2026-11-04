"use client";
export function CustomersReportTemplateView({ model }) {
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
      <ReportHeader title="CUSTOMERS ANALYTICS" selectedStore={selectedStore} />

      <SummarySection cards={summaryCards} />

      <DetailsSection
        title="Customer Growth Breakdown"
        columns={tableColumns}
        data={tableData}
      />

      <ReportFooter reportType="customers analytics" />
    </div>
  );
}
