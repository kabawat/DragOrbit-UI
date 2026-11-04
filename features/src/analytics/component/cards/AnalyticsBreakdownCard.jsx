"use client";
import { Card } from "@dragorbit/ui";

const BreakdownItem = ({
  label,
  value,
  subValue,
  colorClass = "text-[rgb(var(--color-text-primary))]",
}) => (
  <div className="bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg p-4 border border-[rgb(var(--color-border-primary))]/30 text-center transition-all duration-200 hover:bg-[rgb(var(--color-bg-secondary))] flex flex-col justify-center min-h-[100px]">
    <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-2 uppercase tracking-wide font-medium">
      {label}
    </p>
    <p className={`text-xl font-bold ${colorClass} truncate`}>{value}</p>
    {subValue && (
      <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1 truncate">
        {subValue}
      </p>
    )}
  </div>
);

const AnalyticsBreakdownCard = ({ title, items = [] }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4 truncate">
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <BreakdownItem
              key={idx}
              label={item.label}
              value={item.value}
              subValue={item.subValue}
              colorClass={item.colorClass}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsBreakdownCard;
