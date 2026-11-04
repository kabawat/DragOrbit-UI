"use client";
export function SummarySectionView({ model }) {
  const { styles, cards, SummaryCard } = model;
  return (
    <div className={styles.summary}>
      {cards.map((card, index) => (
        <SummaryCard
          key={index}
          title={card.title}
          value={card.value}
          change={card.change}
          changeType={card.changeType}
        />
      ))}
    </div>
  );
}
