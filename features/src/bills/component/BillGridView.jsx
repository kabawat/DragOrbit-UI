"use client";
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
          <div className="col-span-full flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[rgb(var(--color-primary))]"></div>
              <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                Loading more bills...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
