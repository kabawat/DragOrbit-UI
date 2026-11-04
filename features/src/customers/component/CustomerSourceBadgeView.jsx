"use client";
import { Tooltip as SharedTooltip } from "@dragorbit/ui";
export function CustomerSourceBadgePresentation({ model }) {
  const {
    config,
    className,
    getCustomerSourceLabel,
    normalizedSource,
    t,
    Icon,
    showLabel,
  } = model;
  return (
    <SharedTooltip content={getCustomerSourceLabel(normalizedSource, t)}><span
      className={`inline-flex items-center gap-1 max-w-full px-2 py-0.5 rounded-full text-xs font-medium border ${config.badgeStyle} ${className}`}

    >
      <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
      {showLabel && (
        <span className="truncate">
          {getCustomerSourceLabel(normalizedSource, t)}
        </span>
      )}
    </span></SharedTooltip>
  );
}
