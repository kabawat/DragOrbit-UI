"use client";
export function DetailsSectionView({ model }) {
  const { styles, title, children, columns, data, ReportTable } = model;
  return (
    <div className={styles.details}>
      <h3>{title}</h3>
      {children ||
        (columns && data && <ReportTable columns={columns} data={data} />)}
    </div>
  );
}
