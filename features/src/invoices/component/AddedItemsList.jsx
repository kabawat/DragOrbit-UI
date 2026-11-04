"use client";
import { Input, Tooltip as SharedTooltip } from "@dragorbit/ui";
import { IndianRupee, Minus, Plus, Trash2 } from "lucide-react";

const money = (value) => `₹${(Number(value) || 0).toFixed(2)}`;

/** Compact, responsive invoice line list shared by Store FE and Desktop. */
export function AddedItemsList({
  items = [],
  products = [],
  t = (k) => k,
  onRemove,
  onUpdateQuantity,
  onUpdatePrice,
}) {
  if (!items.length) return null;

  return (
    <section className="flex flex-1 flex-col overflow-hidden w-full max-w-full">
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
          {t("invoice.addedItems") || "Added Items"} ({items.length})
        </h4>
        <span className="text-xs text-[rgb(var(--color-text-secondary))] hidden sm:inline">
          {t("invoice.editableTip") || "Quantity & price can be edited directly"}
        </span>
      </div>

      {/* Main container */}
      <div className="min-h-0 flex-1 w-full max-w-full overflow-y-auto rounded-lg border border-[rgb(var(--color-border-primary))]/30 bg-[rgb(var(--color-bg-primary))]">
        {/* ── Desktop & Tablet View (>= 640px) - Original 7-Column Table ── */}
        <div className="hidden sm:block w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[rgb(var(--color-bg-primary))]">
              <tr className="border-b border-[rgb(var(--color-border-primary))]/50 text-xs font-medium uppercase text-[rgb(var(--color-text-secondary))]">
                <th className="w-12 whitespace-nowrap px-2.5 py-2.5">SR NO</th>
                <th className="px-2.5 py-2.5">{t("invoice.product") || "Product"}</th>
                <th className="whitespace-nowrap px-2.5 py-2.5 text-center min-w-[130px]">
                  {t("invoice.quantity") || "Quantity"}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2.5 text-right min-w-[110px]">
                  {t("invoice.price") || "Price"}
                </th>
                <th className="whitespace-nowrap px-2.5 py-2.5 text-right">GST</th>
                <th className="whitespace-nowrap px-2.5 py-2.5 text-right">{t("invoice.total") || "Total"}</th>
                <th className="w-10 px-1 py-2.5 text-center" aria-label={t("invoice.removeItem")} />
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border-primary))]/30">
              {items.map((item, index) => {
                const product = products.find(
                  (p) => String(p.id) === String(item.product)
                );
                const name = item.productName || product?.name || "N/A";
                const key = `${item.product || "item"}:${item.variant || ""}:${item.id || "line"}:${index}`;

                return (
                  <tr
                    key={key}
                    className="group hover:bg-[rgb(var(--color-bg-secondary))]/30 transition-colors text-sm"
                  >
                    <td className="whitespace-nowrap px-2.5 py-2.5 text-[rgb(var(--color-text-secondary))] font-mono text-xs">
                      {index + 1}
                    </td>
                    <td className="px-2.5 py-2.5">
                      <div className="whitespace-normal break-words font-medium text-[rgb(var(--color-text-primary))]">
                        {name}
                      </div>
                      {item.sku ? (
                        <div className="whitespace-normal break-all text-xs text-[rgb(var(--color-text-secondary))]">
                          SKU: {item.sku}
                        </div>
                      ) : null}
                    </td>

                    {/* Quantity with +/- and Custom Input */}
                    <td className="whitespace-nowrap px-2.5 py-2 text-center">
                      {onUpdateQuantity ? (
                        <div className="inline-flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                index,
                                Math.max(1, (parseInt(item.quantity, 10) || 1) - 1)
                              )
                            }
                            disabled={Number(item.quantity) <= 1}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[rgb(var(--color-border-primary))]/60 text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <div className="w-16">
                            <Input
                              type="number"
                              min="1"
                              size="sm"
                              value={item.quantity ?? 1}
                              onChange={(val) => onUpdateQuantity(index, val)}
                              className="!h-7 text-center font-semibold !text-xs !py-0.5"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                index,
                                (parseInt(item.quantity, 10) || 0) + 1
                              )
                            }
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[rgb(var(--color-border-primary))]/60 text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors"
                            title="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          {item.uom && (
                            <span className="ml-1 text-[11px] text-[rgb(var(--color-text-secondary))]">
                              {item.uom}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[rgb(var(--color-text-secondary))]">
                          {item.quantity} {item.uom || ""}
                        </span>
                      )}
                    </td>

                    {/* Price with Custom Input */}
                    <td className="whitespace-nowrap px-2.5 py-2 text-right">
                      {onUpdatePrice ? (
                        <div className="inline-block w-24">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            size="sm"
                            value={item.price ?? ""}
                            onChange={(val) => onUpdatePrice(index, val)}
                            leftIcon={IndianRupee}
                            className="!h-7 text-right font-medium !text-xs !py-0.5"
                          />
                        </div>
                      ) : (
                        <span className="text-[rgb(var(--color-text-secondary))]">
                          {money(item.price)}
                        </span>
                      )}
                    </td>

                    {/* GST Column */}
                    <td className="whitespace-nowrap px-2.5 py-2.5 text-right text-[rgb(var(--color-text-secondary))] text-xs">
                      {Number(item.gstRate) > 0 ? `${item.gstRate}%` : "-"}
                      {item.isInclusive ? (
                        <span className="block text-[10px] text-[rgb(var(--color-text-tertiary))]">
                          incl.
                        </span>
                      ) : null}
                    </td>

                    {/* Total Column */}
                    <td className="whitespace-nowrap px-2.5 py-2.5 text-right font-semibold text-[rgb(var(--color-text-primary))]">
                      {money(item.total)}
                    </td>

                    {/* Remove Action */}
                    <td className="px-1 py-2 text-center">
                      <SharedTooltip content={t("invoice.removeItem") || "Remove item"}>
                        <button
                          type="button"
                          onClick={() => onRemove(index)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[rgb(var(--color-danger))] opacity-75 sm:opacity-0 transition-opacity hover:bg-[rgb(var(--color-danger))]/10 group-hover:opacity-100 focus-visible:opacity-100"
                          aria-label={t("invoice.removeItem")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </SharedTooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Small Screen View (< 640px) - Total & GST Moved Below Product ── */}
        <div className="sm:hidden divide-y divide-[rgb(var(--color-border-primary))]/20 w-full">
          {items.map((item, index) => {
            const product = products.find(
              (p) => String(p.id) === String(item.product)
            );
            const name = item.productName || product?.name || "N/A";
            const key = `mobile:${item.product || "item"}:${item.variant || ""}:${item.id || "line"}:${index}`;

            return (
              <div key={key} className="p-3 flex flex-col gap-2.5 w-full">
                {/* Product Info & Remove */}
                <div className="flex items-start justify-between gap-2 w-full">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className="font-mono text-xs text-[rgb(var(--color-text-secondary))] bg-[rgb(var(--color-bg-secondary))] px-1.5 py-0.5 rounded flex-shrink-0">
                      #{index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-sm text-[rgb(var(--color-text-primary))] break-words">
                        {name}
                      </h5>
                      {item.sku ? (
                        <div className="text-xs text-[rgb(var(--color-text-secondary))] break-all">
                          SKU: {item.sku}
                        </div>
                      ) : null}

                      {/* On small screen size: Total and GST moved below Product */}
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                        <span className="font-semibold text-[rgb(var(--color-text-primary))] text-sm">
                          Total: {money(item.total)}
                        </span>
                        <span className="text-[rgb(var(--color-border-primary))]">•</span>
                        <span className="text-[rgb(var(--color-text-secondary))]">
                          GST: {Number(item.gstRate) > 0 ? `${item.gstRate}%` : "0%"}
                          {item.isInclusive ? " (incl.)" : ""}
                        </span>
                        {item.uom && (
                          <>
                            <span className="text-[rgb(var(--color-border-primary))]">•</span>
                            <span className="text-[rgb(var(--color-text-secondary))]">
                              {item.uom}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-1.5 text-[rgb(var(--color-danger))] hover:bg-[rgb(var(--color-danger))]/10 rounded-lg transition-colors flex-shrink-0"
                    aria-label={t("invoice.removeItem")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Quantity and Price Inputs Wrapped Side-by-Side */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[rgb(var(--color-border-primary))]/20 items-end w-full">
                  {/* Quantity with +/- and Custom Input */}
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-[rgb(var(--color-text-secondary))] mb-1">
                      {t("invoice.quantity") || "Quantity"}
                    </span>
                    {onUpdateQuantity ? (
                      <div className="flex items-center gap-1 w-full">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(
                              index,
                              Math.max(1, (parseInt(item.quantity, 10) || 1) - 1)
                            )
                          }
                          disabled={Number(item.quantity) <= 1}
                          className="w-7 h-8 flex items-center justify-center rounded-lg border border-[rgb(var(--color-border-primary))]/60 text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] disabled:opacity-30 disabled:pointer-events-none flex-shrink-0 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <Input
                            type="number"
                            min="1"
                            size="sm"
                            value={item.quantity ?? 1}
                            onChange={(val) => onUpdateQuantity(index, val)}
                            className="!h-8 text-center font-semibold !text-xs !py-0.5"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(
                              index,
                              (parseInt(item.quantity, 10) || 0) + 1
                            )
                          }
                          className="w-7 h-8 flex items-center justify-center rounded-lg border border-[rgb(var(--color-border-primary))]/60 text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex-shrink-0 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                        {item.quantity} {item.uom || ""}
                      </span>
                    )}
                  </div>

                  {/* Price with Custom Input */}
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-[rgb(var(--color-text-secondary))] mb-1">
                      {t("invoice.price") || "Price"} (₹)
                    </span>
                    {onUpdatePrice ? (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        size="sm"
                        value={item.price ?? ""}
                        onChange={(val) => onUpdatePrice(index, val)}
                        leftIcon={IndianRupee}
                        className="!h-8 text-right font-medium !text-xs !py-0.5"
                      />
                    ) : (
                      <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
                        {money(item.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
