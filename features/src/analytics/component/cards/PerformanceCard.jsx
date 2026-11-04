"use client";
import { Card } from "@dragorbit/ui";

const PerformanceCard = ({
  title,
  value,
  label,
  icon: Icon,
  color = "text-[rgb(var(--color-primary))]",
}) => {
  return (
    <Card className="bg-[rgb(var(--color-bg-primary))] border-l-4 border-l-[rgb(var(--color-primary))] h-full transition-all duration-200 hover:shadow-md">
      <div className="p-5 flex items-center gap-4">
        <div
          className={`p-3 rounded-full bg-[rgb(var(--color-bg-secondary))] ${color}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="text-xl font-bold text-[rgb(var(--color-text-primary))] mt-0.5 truncate">
            {value}
          </p>
          <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5 truncate">
            {label}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceCard;
