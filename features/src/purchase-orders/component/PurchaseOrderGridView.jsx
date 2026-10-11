"use client";
export function PurchaseOrderGridPresentation({ model }) {
  const {
    purchaseOrders,
    PurchaseOrderCard,
    onEdit,
    onDelete,
    onViewDetails,
    openMenuId,
    onMenuToggle,
    onMenuAction,
    menuRefs,
    formatCurrency,
    formatDate,
    enableSendMenu,
    getShareUrl,
    showToast,
    canRead,
    canEdit,
    canDelete,
    isLoadingMore,
    t,
  } = model;
  return (
    <div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {purchaseOrders.map((purchaseOrder) => (
          <PurchaseOrderCard
            key={
              purchaseOrder._id || purchaseOrder.id || purchaseOrder.billNumber
            }
            purchaseOrder={purchaseOrder}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
            openMenuId={openMenuId}
            onMenuToggle={onMenuToggle}
            onMenuAction={onMenuAction}
            menuRefs={menuRefs}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            enableSendMenu={enableSendMenu}
            getShareUrl={getShareUrl}
            showToast={showToast}
            canRead={canRead}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        ))}

        {/* Infinite scroll loading */}
        {isLoadingMore && (
          <div className="col-span-full flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[rgb(var(--color-primary))]"></div>
              <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                {t("purchaseOrders.loadingMore")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
