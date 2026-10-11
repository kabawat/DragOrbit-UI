"use client";
export function SummaryCardView({ model }) {
  const { styles, title, value, change, changeClassName } = model;
  return (
    <div className={styles.summaryCard}>
      <h3>{title}</h3>
      <div className={styles.value}>{value}</div>
      {change && (
        <div className={`${styles.change} ${changeClassName}`}>{change}</div>
      )}
    </div>
  );
}
