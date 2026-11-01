"use client";

import { Badge } from "@dragorbit/ui";
import { Package } from "lucide-react";

function defaultFormatCurrency(val) {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function BillItemsListView({
  items = [],
  itemsSummary,
  gstBreakdown,
  formatCurrency = defaultFormatCurrency,
  title = "Bill Line Items",
}) {
  if (!items || items.length === 0) return null;

  const cgst = Number(gstBreakdown?.cgst || 0);
  const sgst = Number(gstBreakdown?.sgst || 0);
  const igst = Number(gstBreakdown?.igst || 0);
  const utgst = Number(gstBreakdown?.utgst || 0);
  const cess = Number(gstBreakdown?.cess || 0);
  const totalGst = Number(gstBreakdown?.total || itemsSummary?.gstAmount || 0);
  const showGstBreakdown =
    cgst > 0 || sgst > 0 || igst > 0 || utgst > 0 || cess > 0;

  const taxableAmount =
    itemsSummary?.subtotal || itemsSummary?.taxableAmount || 0;
  const grandTotal = itemsSummary?.totalValue || itemsSummary?.totalAmount || 0;

  return (
    <div className="bg-white dark:bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]/60 overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-[rgb(var(--color-border-primary))]/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] rounded-lg flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[rgb(var(--color-text-primary))]">
              {title}
            </h2>
          </div>
        </div>
        <div>
          <Badge variant="secondary">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </Badge>
        </div>
      </div>

      {/* Responsive Line Items List (Card/Row view matching Create Invoice/Bill) */}
      <div className="divide-y divide-[rgb(var(--color-border-primary))]/20 w-full">
        {items.map((item, index) => {
          const productName =
            item.productName ||
            item.name ||
            item.product?.name ||
            "Unnamed Product";
          const hsnCode = item.hsnCode || item.hsn || "";
          const qty = item.quantity || item.qty || 0;
          const unitPrice = Number(
            item.unitPrice ?? item.purchasePrice ?? item.price ?? 0
          );
          const gstRate = item.gstRate ?? item.gst?.rate ?? 0;
          const itemTotal =
            item.totalAmount ||
            item.total ||
            item.calculatedTotal ||
            qty * unitPrice;
          const uom = item.uom || item.product?.uom || "";
          const sku = item.sku || item.product?.sku || "";

          return (
            <div
              key={`${item.product || item._id || index}-${index}`}
              className="p-4 sm:p-5 hover:bg-[rgb(var(--color-bg-secondary))]/30 transition-colors w-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 w-full">
                {/* Left side: #SR badge + Product Name + SKU / HSN + UOM */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="font-mono text-xs font-bold text-[rgb(var(--color-text-secondary))] bg-[rgb(var(--color-bg-secondary))] px-2 py-1 rounded-md shrink-0 mt-0.5">
                    #{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-[rgb(var(--color-text-primary))] break-words">
                        {productName}
                      </h4>
                      {uom && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] rounded">
                          {uom}
                        </span>
                      )}
                    </div>
                    {(sku || (hsnCode && hsnCode !== "-")) && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[rgb(var(--color-text-tertiary))] font-mono">
                        {sku && (
                          <span>
                            SKU:{" "}
                            <span className="text-[rgb(var(--color-text-secondary))]">
                              {sku}
                            </span>
                          </span>
                        )}
                        {hsnCode && hsnCode !== "-" && (
                          <span>
                            HSN:{" "}
                            <span className="text-[rgb(var(--color-text-secondary))]">
                              {hsnCode}
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Responsive metrics row / grid (Qty, Price, GST, Line Total) */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgb(var(--color-border-primary))]/20 shrink-0">
                  {/* Quantity */}
                  <div className="text-left sm:text-center min-w-[60px]">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))] mb-0.5">
                      Qty
                    </span>
                    <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                      {qty}
                      {uom ? (
                        <span className="text-xs font-normal text-[rgb(var(--color-text-tertiary))] ml-1">
                          {uom}
                        </span>
                      ) : null}
                    </span>
                  </div>

                  {/* Unit Price */}
                  <div className="text-left sm:text-right min-w-[80px]">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))] mb-0.5">
                      Unit Price
                    </span>
                    <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                      {formatCurrency(unitPrice)}
                    </span>
                  </div>

                  {/* GST */}
                  <div className="text-left sm:text-center min-w-[65px]">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))] mb-0.5">
                      GST
                    </span>
                    <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                      {gstRate ? `${gstRate}%` : "0%"}
                    </span>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[95px] pl-2 sm:pl-4 border-l sm:border-l border-[rgb(var(--color-border-primary))]/30">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))] mb-0.5">
                      Amount
                    </span>
                    <span className="text-base font-black text-[rgb(var(--color-text-primary))]">
                      {formatCurrency(itemTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start gap-8 border-t border-[rgb(var(--color-border-primary))]/30">
        {/* Left: GST Summary Breakdown */}
        <div className="w-full md:w-1/2">
          {showGstBreakdown ? (
            <div className="space-y-3">
              <h4 className="text-[0.625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-widest">
                Inward GST Summary
              </h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 py-1">
                {cgst > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[rgb(var(--color-text-secondary))]">
                      CGST:
                    </span>
                    <span className="text-[rgb(var(--color-text-primary))] font-bold">
                      {formatCurrency(cgst)}
                    </span>
                  </div>
                )}
                {sgst > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[rgb(var(--color-text-secondary))]">
                      SGST:
                    </span>
                    <span className="text-[rgb(var(--color-text-primary))] font-bold">
                      {formatCurrency(sgst)}
                    </span>
                  </div>
                )}
                {igst > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[rgb(var(--color-text-secondary))]">
                      IGST:
                    </span>
                    <span className="text-[rgb(var(--color-text-primary))] font-bold">
                      {formatCurrency(igst)}
                    </span>
                  </div>
                )}
                {utgst > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[rgb(var(--color-text-secondary))]">
                      UTGST:
                    </span>
                    <span className="text-[rgb(var(--color-text-primary))] font-bold">
                      {formatCurrency(utgst)}
                    </span>
                  </div>
                )}
                {cess > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[rgb(var(--color-text-secondary))]">
                      Cess:
                    </span>
                    <span className="text-[rgb(var(--color-text-primary))] font-bold">
                      {formatCurrency(cess)}
                    </span>
                  </div>
                )}
                <div className="col-span-2 pt-2 border-t border-[rgb(var(--color-border-primary))]/20 flex justify-between items-center">
                  <span className="text-[0.625rem] font-bold text-[rgb(var(--color-primary))] uppercase">
                    Total Tax (ITC)
                  </span>
                  <span className="text-sm text-[rgb(var(--color-primary))] font-black">
                    {formatCurrency(totalGst)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] italic">
              All prices shown are compliant with inward tax regulations.
            </div>
          )}
        </div>

        {/* Right: Totals Section */}
        <div className="w-full md:w-1/3 py-2 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[rgb(var(--color-text-tertiary))] uppercase">
              Taxable Value:
            </span>
            <span className="font-bold text-[rgb(var(--color-text-primary))]">
              {formatCurrency(taxableAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[rgb(var(--color-text-tertiary))] uppercase">
              Total GST:
            </span>
            <span className="font-bold text-[rgb(var(--color-primary))]">
              {formatCurrency(totalGst)}
            </span>
          </div>

          <div className="pt-3 border-t border-[rgb(var(--color-border-primary))]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[rgb(var(--color-text-primary))] uppercase tracking-tight">
                Grand Total
              </span>
              <div className="text-xl font-black text-[rgb(var(--color-primary))] tracking-tight">
                {formatCurrency(grandTotal)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillItemsListView;
