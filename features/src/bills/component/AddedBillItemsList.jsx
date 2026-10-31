"use client";
import { memo } from "react";
import { Minus, Package, Plus, Trash2 } from "lucide-react";
import { Tooltip as SharedTooltip } from "@dragorbit/ui";

export const AddedBillItemsList = ({
  items = [],
  products = [],
  t = (k) => k,
  onQuantityChange = () => {},
  onPriceChange = () => {},
  onRemoveItem = () => {},
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2.5 pr-1 min-h-0 custom-scrollbar">
      {items.map((item, index) => {
        const product = products.find(
          (p) => (p.id || p._id) === item.product
        );
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.purchasePrice) || 0;
        const itemTotal = qty * price;
        const uom = item.uom || product?.uom || product?.pricing?.uom || "PCS";

        return (
          <div
            key={item.product ? `${item.product}_${index}` : index}
            className="group rounded-xl p-3.5 bg-[rgb(var(--color-bg-secondary))]/50 hover:bg-[rgb(var(--color-bg-secondary))]/80 border border-[rgb(var(--color-border-primary))]/20 transition-all flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Product Info */}
              <div className="sm:col-span-5 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex items-center justify-center shrink-0">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))] truncate">
                      {item.productName ||
                        product?.name ||
                        product?.productName ||
                        "Product"}
                    </p>
                    <span className="text-[11px] text-[rgb(var(--color-text-secondary))] uppercase tracking-wider font-medium">
                      {uom}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="sm:col-span-3">
                <label className="block text-[10px] uppercase font-semibold text-[rgb(var(--color-text-secondary))] mb-1">
                  {t("common.quantity") || "Qty"}
                </label>
                <div className="inline-flex items-center border border-[rgb(var(--color-border-primary))]/60 rounded-lg overflow-hidden bg-[rgb(var(--color-bg-primary))]">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(index, -1)}
                    className="w-7 h-7 flex items-center justify-center text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onQuantityChange(index, e.target.value)}
                    className="w-12 h-7 text-center text-xs font-semibold text-[rgb(var(--color-text-primary))] bg-transparent border-x border-[rgb(var(--color-border-primary))]/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => onQuantityChange(index, 1)}
                    className="w-7 h-7 flex items-center justify-center text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Price Input */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-semibold text-[rgb(var(--color-text-secondary))] mb-1">
                  {t("common.price") || "Price"}
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[rgb(var(--color-text-secondary))]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.purchasePrice}
                    onChange={(e) => onPriceChange(index, e.target.value)}
                    className="w-full h-7 pl-5 pr-2 text-xs font-medium text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/60 rounded-lg focus:outline-none focus:border-[rgb(var(--color-primary))]"
                  />
                </div>
              </div>

              {/* Total */}
              <div className="sm:col-span-2 text-right sm:pr-2">
                <label className="block text-[10px] uppercase font-semibold text-[rgb(var(--color-text-secondary))] mb-1">
                  {t("common.total") || "Total"}
                </label>
                <p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                  ₹{itemTotal.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Remove Action */}
            <SharedTooltip content={t("common.remove") || "Remove item"}>
              <button
                type="button"
                onClick={() => onRemoveItem(index)}
                className="opacity-60 group-hover:opacity-100 flex items-center justify-center w-8 h-8 cursor-pointer text-[rgb(var(--color-danger))] hover:bg-[rgb(var(--color-danger))]/10 rounded-lg transition-all shrink-0"
                aria-label={t("common.remove") || "Remove"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </SharedTooltip>
          </div>
        );
      })}
    </div>
  );
};

export default memo(AddedBillItemsList);
