"use client";
export function DailySalesReportTemplateView({ model }) {
  const {
    hideGst,
    selectedStore,
    formatCurrency,
    todayRevenue,
    formatNumber,
    invoiceToday,
    recentTransactions,
  } = model;
  return (
    <div
      id="daily-sales-report-area"
      className="bg-white text-gray-900 p-6 w-[800px]"
    >
      <div className="border-b pb-4 mb-4">
        <h1 className="text-xl font-bold">
          {hideGst ? "DAILY SALES" : "DAILY SALES SUMMARY"}
        </h1>
        <p className="text-sm text-gray-600">
          {selectedStore?.storeName || "Store"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <span className="text-gray-500">Today&apos;s sales: </span>
          <strong>{formatCurrency(todayRevenue.revenue)}</strong>
        </div>
        <div>
          <span className="text-gray-500">Bills: </span>
          <strong>{formatNumber(todayRevenue.sales)}</strong>
        </div>
        {!hideGst ? (
          <div>
            <span className="text-gray-500">Profit: </span>
            <strong>{formatCurrency(todayRevenue.profit)}</strong>
          </div>
        ) : null}
        <div>
          <span className="text-gray-500">Released: </span>
          <strong>{formatNumber(invoiceToday.releasedInvoices)}</strong>
        </div>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 text-left">Invoice</th>
            <th className="border px-3 py-2 text-right">Amount</th>
            <th className="border px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentTransactions.slice(0, 10).map((row) => (
            <tr key={row.invoiceId || row.invoiceNumber}>
              <td className="border px-3 py-2">{row.invoiceNumber || "—"}</td>
              <td className="border px-3 py-2 text-right">
                {formatCurrency(row.totalAmount)}
              </td>
              <td className="border px-3 py-2">{row.paymentStatus || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
