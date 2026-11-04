"use client";

function readPagination(result) {
  if (result?.pagination && typeof result.pagination === "object") {
    return result.pagination;
  }
  const dataPagination = result?.data?.pagination;
  return dataPagination && typeof dataPagination === "object"
    ? dataPagination
    : {};
}

function formatAmount(value) {
  if (value === null || value === undefined || value === "") return "—";
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function displayStatus(value) {
  if (typeof value !== "string" || !value.trim()) return "—";
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function findInvoiceResult(toolResults) {
  if (!Array.isArray(toolResults)) return null;
  return [...toolResults]
    .reverse()
    .find(
      (result) => result?.tool === "list_invoices" && result?.success === true
    );
}

export function ChatInvoiceResults({ toolResults }) {
  const result = findInvoiceResult(toolResults);
  if (!result) return null;

  const invoices = Array.isArray(result.data?.invoices)
    ? result.data.invoices.filter(
        (invoice) => invoice && typeof invoice === "object"
      )
    : [];
  if (invoices.length === 0) {
    return (
      <section
        aria-label="Invoice results"
        className="w-full rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] px-3 py-2.5 text-[12px] text-[rgb(var(--color-text-secondary))]"
      >
        No invoices found for this request.
      </section>
    );
  }

  const pagination = readPagination(result);
  const hasMore = pagination.hasMore ?? pagination.has_more ?? false;
  const total =
    result.totalCount ??
    result.total_count ??
    pagination.totalCount ??
    pagination.total_count;
  const totalIsKnown = Number.isInteger(total) && total >= invoices.length;
  const hasCursor = Boolean(pagination.nextCursor ?? pagination.next_cursor);

  return (
    <section
      aria-label="Invoice results"
      className="w-full overflow-hidden rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]"
    >
      <div className="flex items-center justify-between gap-2 border-b border-[rgb(var(--color-border-primary))] px-3 py-2">
        <h4 className="text-[12px] font-semibold text-[rgb(var(--color-text-primary))]">
          Invoices
        </h4>
        <span className="text-[11px] text-[rgb(var(--color-text-secondary))]">
          {invoices.length} shown
        </span>
      </div>
      <div className="divide-y divide-[rgb(var(--color-border-primary))]">
        {invoices.map((invoice, index) => {
          const invoiceNumber = invoice.invoiceNumber || "—";
          const key = invoice.id || invoiceNumber || `invoice-${index}`;
          const fields = [
            ["Customer", invoice.customer?.name || "Walk-in Customer"],
            ["Date", invoice.invoiceDate || "—"],
            ["Amount", formatAmount(invoice.totalAmount)],
            ["Payment", displayStatus(invoice.paymentStatus)],
            ["Invoice status", displayStatus(invoice.invoiceStatus)],
            [
              "Items",
              Number.isInteger(invoice.itemCount) ? invoice.itemCount : "—",
            ],
          ];

          return (
            <article
              aria-label={`Invoice ${invoiceNumber}`}
              className="px-3 py-2.5 text-[rgb(var(--color-text-primary))]"
              key={key}
            >
              <h5 className="break-all text-[11px] font-semibold">
                {invoiceNumber}
              </h5>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                {fields.map(([label, value]) => (
                  <div className="min-w-0" key={label}>
                    <dt className="text-[rgb(var(--color-text-secondary))]">
                      {label}
                    </dt>
                    <dd className="break-words font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>
      {hasMore && (
        <p className="border-t border-[rgb(var(--color-border-primary))] px-3 py-2 text-[11px] text-[rgb(var(--color-text-secondary))]">
          {`Showing ${invoices.length}${totalIsKnown ? ` of ${total}` : ""} invoices. More are available${hasCursor ? "; ask DragAI to continue." : ", but no continuation cursor was provided."}`}
        </p>
      )}
    </section>
  );
}

export default ChatInvoiceResults;
