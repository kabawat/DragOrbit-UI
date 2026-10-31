"use client";

import { Hash, IndianRupee, Package } from "lucide-react";

function defaultFormatCurrency(val) {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function InvoiceBatchesView({ batches, formatCurrency = defaultFormatCurrency }) {
  if (!batches || batches.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]/60 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[rgb(var(--color-text-primary))]">
            Product Batches
          </h2>
          <p className="text-xs text-[rgb(var(--color-text-secondary))]">
            Stock batches allocated for this invoice
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {batches.map((batch, index) => (
          <div
            key={batch._id || index}
            className="border border-[rgb(var(--color-border-primary))]/40 bg-[rgb(var(--color-bg-secondary))]/10 rounded-lg p-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-[0.625rem] font-bold uppercase text-[rgb(var(--color-text-tertiary))] tracking-wider">
                  Batch Number
                </span>
                <div className="flex items-center space-x-2 text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                  <Hash className="w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))]" />
                  <span>{batch.batchNo || "N/A"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[0.625rem] font-bold uppercase text-[rgb(var(--color-text-tertiary))] tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center space-x-2 text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                  <Package className="w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))]" />
                  <span>{batch.quantity || "N/A"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[0.625rem] font-bold uppercase text-[rgb(var(--color-text-tertiary))] tracking-wider">
                  Unit Price
                </span>
                <div className="flex items-center space-x-2 text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                  <IndianRupee className="w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))]" />
                  <span>{formatCurrency(batch.price ?? batch.purchasePrice ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvoiceBatchesView;
