import { Tooltip as SharedTooltip } from "@dragorbit/ui";
import { Trash2 } from "lucide-react";

const money = (value) => `₹${(Number(value) || 0).toFixed(2)}`;

/** Compact, responsive invoice line list shared by Store FE and Desktop. */
export function AddedItemsList({ items = [], products = [], t, onRemove }) {
  if (!items.length) return null;

  return (
    <section className="flex min-h-[12rem] flex-1 flex-col overflow-hidden">
      <h4 className="mb-2 flex-shrink-0 text-sm font-medium text-[rgb(var(--color-text-primary))]">
        {t("invoice.addedItems")} ({items.length})
      </h4>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[rgb(var(--color-bg-primary))]">
            <tr className="border-b border-[rgb(var(--color-border-primary))]/50 text-xs font-medium uppercase text-[rgb(var(--color-text-secondary))]">
              <th className="w-12 whitespace-nowrap px-2 py-2">SR NO</th>
              <th className="px-2 py-2">{t("invoice.product")}</th>
              <th className="whitespace-nowrap px-2 py-2 text-right">{t("invoice.quantity")}</th>
              <th className="whitespace-nowrap px-2 py-2 text-right">{t("invoice.price")}</th>
              <th className="whitespace-nowrap px-2 py-2 text-right">GST</th>
              <th className="whitespace-nowrap px-2 py-2 text-right">{t("invoice.total")}</th>
              <th className="w-10 px-1 py-2" aria-label={t("invoice.removeItem")} />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const product = products.find(
                (p) => String(p.id) === String(item.product),
              );
              const name = item.productName || product?.name || "N/A";
              const key = `${item.product || "item"}:${item.variant || ""}:${item.id || "line"}:${index}`;

              return (
                <tr
                  key={key}
                  className="group border-b border-[rgb(var(--color-border-primary))]/40 text-sm"
                >
                  <td className="whitespace-nowrap px-2 py-2.5 text-[rgb(var(--color-text-secondary))]">
                    {index + 1}
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="whitespace-normal break-words font-normal text-[rgb(var(--color-text-primary))]">
                      {name}
                    </div>
                    {item.sku ? (
                      <div className="whitespace-normal break-all text-xs text-[rgb(var(--color-text-secondary))]">
                        SKU: {item.sku}
                      </div>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right text-[rgb(var(--color-text-secondary))]">
                    {item.quantity} {item.uom || ""}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right text-[rgb(var(--color-text-secondary))]">
                    {money(item.price)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right text-[rgb(var(--color-text-secondary))]">
                    {Number(item.gstRate) > 0 ? `${item.gstRate}%` : "-"}
                    {item.isInclusive ? " incl." : ""}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right font-medium text-[rgb(var(--color-text-primary))]">
                    {money(item.total)}
                  </td>
                  <td className="px-1 py-2 text-center">
                    <SharedTooltip content={t("invoice.removeItem")}><button
                      type="button"
                      onClick={() => onRemove(index)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[rgb(var(--color-danger))] opacity-0 transition-opacity hover:bg-[rgb(var(--color-danger))]/10 group-hover:opacity-100 focus-visible:opacity-100"

                      aria-label={t("invoice.removeItem")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button></SharedTooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
