"use client";
import { TableSkeleton } from "@dragorbit/ui";
export function BillGridPresentation({ model }) {
  const {
    bills,
    BillCard,
    onEdit,
    onDelete,
    onViewDetails,
    openMenuId,
    onMenuToggle,
    onMenuAction,
    menuRefs,
    formatCurrency,
    formatDate,
    isLoadingMore,
  } = model;
  return (
    <div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bills.map((bill) => (
          <BillCard
            key={bill._id || bill.id || bill.billNumber}
            bill={bill}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
            openMenuId={openMenuId}
            onMenuToggle={onMenuToggle}
            onMenuAction={onMenuAction}
            menuRefs={menuRefs}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        ))}

        {/* Infinite scroll loading */}
        {isLoadingMore && (
          <TableSkeleton compact rows={2} />
        )}
      </div>
    </div>
  );
}
