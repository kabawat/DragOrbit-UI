"use client";
import { TableSkeleton } from "@dragorbit/ui";
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
          <TableSkeleton compact rows={2} />
        )}
      </div>
    </div>
  );
}
