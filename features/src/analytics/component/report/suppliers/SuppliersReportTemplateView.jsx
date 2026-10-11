"use client";
export function SuppliersReportTemplateView({ model }) {
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
      <ReportHeader title="SUPPLIERS ANALYTICS" selectedStore={selectedStore} />

      <SummarySection cards={summaryCards} />

      <DetailsSection
        title="Suppliers Breakdown"
        columns={tableColumns}
        data={tableData}
      />

      <ReportFooter reportType="suppliers analytics" />
    </div>
  );
}
