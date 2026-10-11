"use client";
import { AlertTriangle } from "lucide-react";
import { Card } from "@dragorbit/ui";

const typeLabels = {
  rate_mismatch: "Rate Mismatch",
  calc_mismatch: "Calculation Mismatch",
  missing_hsn: "Missing HSN",
};

// Category-wise colors: warning=review, danger=error, primary=action needed
const typeStyles = {
  rate_mismatch:
    "bg-[rgb(var(--color-warning))]/15 text-[rgb(var(--color-warning))] border-[rgb(var(--color-warning))]/40",
  calc_mismatch:
    "bg-[rgb(var(--color-danger))]/15 text-[rgb(var(--color-danger))] border-[rgb(var(--color-danger))]/40",
  missing_hsn:
    "bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))] border-[rgb(var(--color-primary))]/40",
};

const GstMismatchList = ({ mismatches = [], isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <div className="p-6">
          <p className="text-sm text-[rgb(var(--color-text-tertiary))]">
            Loading mismatches...
          </p>
        </div>
      </Card>
    );
  }

  if (!mismatches || mismatches.length === 0) {
    return (
      <Card className="border-[var(--color-border-primary-light)]">
        <div className="p-6 text-center">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            No GST mismatches found. Your data looks compliant.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-[var(--color-border-primary-light)]">
      <div className="p-4">
        <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[rgb(var(--color-warning))]" />
          GST Mismatches ({mismatches.length})
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {mismatches.map((m, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3 rounded-lg border border-[var(--color-border-primary-light)] p-3 bg-[rgb(var(--color-bg-secondary))]/50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[rgb(var(--color-text-primary))] truncate">
                  {m.productName || "Product"}
                </p>
                <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
                  {m.invoiceNumber} - {m.message}
                </p>
              </div>
              <span
                className={`gst-mismatch-type-badge text-xs font-medium px-2 py-0.5 rounded border flex-shrink-0 ${typeStyles[m.type] || "bg-[rgb(var(--color-bg-tertiary))] text-[rgb(var(--color-text-primary))] border-[var(--color-border-primary-light)]"}`}
              >
                {typeLabels[m.type] || m.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default GstMismatchList;
