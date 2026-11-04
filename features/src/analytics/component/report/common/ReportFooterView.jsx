"use client";
export function ReportFooterView({ model }) {
  const { styles, t, reportType, moment } = model;
  return (
    <div className={styles.footer}>
      <p>{t("common.automatedReportGenerated", { reportType })}</p>
      <p>
        {t("common.reportGeneratedOn")} {moment().format("DD/MM/YYYY HH:mm:ss")}
      </p>
    </div>
  );
}
