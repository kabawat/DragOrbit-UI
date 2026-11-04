"use client";
import { Filter } from "lucide-react";
import { Card } from "@dragorbit/ui";

const AnalyticsListCard = ({
  title,
  icon: Icon,
  items = [],
  emptyMessage = "No data available",
  formatItemValue,
}) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center justify-between">
          <span className="truncate mr-2">{title}</span>
          {Icon && (
            <Icon className="w-4 h-4 text-[rgb(var(--color-text-tertiary))] flex-shrink-0" />
          )}
        </h3>
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-[rgb(var(--color-border-primary))]/20 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 
                    ${idx === 0 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"}`}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate">
                      {item.name || item.label}
                    </p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))] truncate">
                      {item.subtitle || `${item.count || 0} items`}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[rgb(var(--color-text-primary))] flex-shrink-0">
                  {formatItemValue
                    ? formatItemValue(item)
                    : item.value ||
                      (item.percentage ? `${item.percentage}%` : "")}
                </p>
              </div>
            ))
          ) : (
            <div className="h-32 flex flex-col items-center justify-center text-[rgb(var(--color-text-tertiary))] bg-[rgb(var(--color-bg-secondary))]/30 rounded-lg border border-dashed border-[rgb(var(--color-border-primary))]">
              <Filter className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-xs text-center px-4">{emptyMessage}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsListCard;
