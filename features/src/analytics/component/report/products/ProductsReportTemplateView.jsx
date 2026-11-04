"use client";
export function ProductsReportTemplateView({ model }) {
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
      <ReportHeader title="PRODUCTS ANALYTICS" selectedStore={selectedStore} />

      <SummarySection cards={summaryCards} />

      <DetailsSection
        title="Products Breakdown"
        columns={tableColumns}
        data={tableData}
      />

      <ReportFooter reportType="products analytics" />
    </div>
  );
}
