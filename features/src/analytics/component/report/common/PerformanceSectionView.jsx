"use client";
export function PerformanceSectionView({ model }) {
  const { styles, title, cards } = model;
  return (
    <div className={styles.details}>
      <h3>{title}</h3>
      <div className={styles.performance}>
        {cards.map((card, index) => (
          <div key={index} className={styles.performanceCard}>
            <div className={styles.label}>{card.label}</div>
            <div className={styles.value}>{card.value}</div>
            {card.subValue && (
              <div className={styles.subValue}>{card.subValue}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
