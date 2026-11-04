"use client";
import { EmptyState } from "@dragorbit/ui";
import { SearchX } from "lucide-react";
export function StaffEmptyStateView({ model }) {
  const { onClearSearch } = model;
  return (
    <EmptyState
      title="No staff found"
      description="No staff members match your search criteria. Try adjusting your filters or search term."
      icon={SearchX}
      type="empty"
      actionButton={{
        label: "Clear Search",
        onClick: onClearSearch,
        variant: "outline",
      }}
    />
  );
}
