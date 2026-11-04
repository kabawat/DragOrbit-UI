"use client";
import { Card } from "@dragorbit/ui";

const AnalyticsChartCard = ({
  ComingSoonChart,
  title,
  children,
  height = "h-64",
  emptyMessage = "Chart data will be displayed here",
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4 truncate">
          {title}
        </h3>
        <div
          className={`${height} bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg border border-[rgb(var(--color-border-primary))]/30 overflow-hidden relative`}
        >
          {children ? children : <ComingSoonChart />}
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsChartCard;
