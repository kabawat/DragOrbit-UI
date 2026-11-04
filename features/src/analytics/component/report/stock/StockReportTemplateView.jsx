"use client";
export function StockReportTemplateView({ model }) {
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
      <ReportHeader title="STOCK ANALYTICS" selectedStore={selectedStore} />

      <SummarySection cards={summaryCards} />

      <DetailsSection
        title="Stock Breakdown"
        columns={tableColumns}
        data={tableData}
      />

      <ReportFooter reportType="stock analytics" />
    </div>
  );
}
