"use client";

import { AlertTriangle, FileText, Info } from "lucide-react";

export function InvoiceNotesView({
  notes,
  terms,
  cancellationReason,
}) {
  const hasNotes = Boolean(notes && String(notes).trim());
  const hasTerms = Boolean(terms && String(terms).trim());
  const hasCancellation = Boolean(cancellationReason && String(cancellationReason).trim());

  if (!hasNotes && !hasTerms && !hasCancellation) return null;

  return (
    <div className="space-y-4">
      {hasCancellation && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-5 flex items-start gap-3">
          <div className="p-2 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-rose-700 dark:text-rose-300 uppercase tracking-tight">
              Cancellation Reason
            </h3>
            <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
              {cancellationReason}
            </p>
          </div>
        </div>
      )}

      {(hasNotes || hasTerms) && (
        <div className="bg-white dark:bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]/60 p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[rgb(var(--color-text-primary))]">
                Notes & Terms
              </h2>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                Customer instructions and policy details
              </p>
            </div>
          </div>

          {hasNotes && (
            <div className="space-y-1.5">
              <span className="text-[0.625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider">
                Invoice Notes
              </span>
              <div className="p-3.5 bg-[rgb(var(--color-bg-secondary))]/50 rounded-lg border border-[rgb(var(--color-border-primary))]/20 text-xs text-[rgb(var(--color-text-primary))] leading-relaxed whitespace-pre-wrap">
                {notes}
              </div>
            </div>
          )}

          {hasTerms && (
            <div className="space-y-1.5">
              <span className="text-[0.625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider">
                Terms & Conditions
              </span>
              <div className="p-3.5 bg-[rgb(var(--color-bg-secondary))]/30 rounded-lg border border-[rgb(var(--color-border-primary))]/20 text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed whitespace-pre-wrap">
                {terms}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InvoiceNotesView;
