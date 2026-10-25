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
      <div className="max-w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-[11px]">
          <thead className="text-[rgb(var(--color-text-secondary))]">
            <tr>
              <th className="px-3 py-2 font-medium">Invoice</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Payment</th>
              <th className="px-3 py-2 font-medium">Invoice status</th>
              <th className="px-3 py-2 text-right font-medium">Items</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => {
              const key =
                invoice.id || invoice.invoiceNumber || `invoice-${index}`;
              return (
                <tr
                  className="border-t border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-primary))]"
                  key={key}
                >
                  <td className="max-w-40 break-all px-3 py-2 font-medium">
                    {invoice.invoiceNumber || "—"}
                  </td>
                  <td className="max-w-36 break-words px-3 py-2">
                    {invoice.customer?.name || "Walk-in Customer"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {invoice.invoiceDate || "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    {formatAmount(invoice.totalAmount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {displayStatus(invoice.paymentStatus)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {displayStatus(invoice.invoiceStatus)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {Number.isInteger(invoice.itemCount)
                      ? invoice.itemCount
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
