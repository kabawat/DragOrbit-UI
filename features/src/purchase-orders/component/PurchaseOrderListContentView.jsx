"use client";
import { TableSkeleton } from "@dragorbit/ui";
import { ToastContainer } from "@dragorbit/ui";
export function PurchaseOrderListContentView({ model }) {
  const {
    scrollRef,
    viewMode,
    PurchaseOrderTable,
    normalizedPOs,
    handleDelete,
    isLoading,
    purchaseOrders,
    t,
    handleMenuAction,
    formatCurrency,
    formatDate,
    showToast,
    canView,
    canEdit,
    canDelete,
    PurchaseOrderGrid,
    openMenuId,
    handleMenuToggle,
    menuRefs,
    pagination,
    sentinelRef,
    isFetchingMore,
    PurchaseOrderDeleteConfirmModal,
    showDeleteModal,
    setShowDeleteModal,
    confirmDelete,
    poToDelete,
    isDeleting,
    CreateBillDrawer,
    showCreateBillDrawer,
    setShowCreateBillDrawer,
    setSelectedPOForBill,
    selectedPOForBill,
    AdvancePaymentDrawer,
    showAdvancePaymentDrawer,
    setShowAdvancePaymentDrawer,
    setSelectedPOForPayment,
    selectedPOForPayment,
    storeId,
    dispatch,
    getPOs,
    toasts,
    removeToast,
    onRoute0,
    onRoute1,
    onRoute2,
    onRoute3,
    scrollRootRef,
  } = model;
  return (
    <>
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.6)] overflow-hidden">
        <div ref={scrollRootRef || scrollRef}>
          {viewMode === "table" ? (
            <div className="h-full">
              <PurchaseOrderTable
                bills={normalizedPOs}
                onEdit={(id) => onRoute0(id)}
                onDelete={handleDelete}
                onViewDetails={(id) => onRoute1(id)}
                loading={isLoading && purchaseOrders.length === 0}
                emptyMessage={t("purchaseOrders.noPurchaseOrders")}
                onMenuAction={handleMenuAction}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                enableSendMenu={true}
                showToast={showToast}
                canRead={canView}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>
          ) : (
            <div>
              <PurchaseOrderGrid
                purchaseOrders={normalizedPOs}
                onEdit={(id) => onRoute2(id)}
                onDelete={handleDelete}
                onViewDetails={(id) => onRoute3(id)}
                openMenuId={openMenuId}
                onMenuToggle={handleMenuToggle}
                onMenuAction={handleMenuAction}
                menuRefs={menuRefs}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                enableSendMenu={true}
                showToast={showToast}
                canRead={canView}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>
          )}

          {/* Sentinel — IntersectionObserver triggers load more */}
          {pagination.hasNextPage && (
            <div ref={sentinelRef} className="h-4 w-full" />
          )}

          {/* Infinite scroll loading indicator */}
          {isFetchingMore && (
            <TableSkeleton compact rows={2} />
          )}
        </div>

        {/* Footer */}
        <div className="bg-[rgb(var(--color-bg-tertiary))] border-t border-[rgb(var(--color-border-primary))] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[rgb(var(--color-text-secondary))]">
              {pagination.hasNextPage ? (
                <>
                  Showing{" "}
                  <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                    {normalizedPOs.length}
                  </span>{" "}
                  {normalizedPOs.length === 1 ? "purchase order" : "purchase orders"}
                  <span className="ml-2 text-xs text-[rgb(var(--color-primary))]">
                    • Scroll down to load more
                  </span>
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                    {normalizedPOs.length}
                  </span>{" "}
                  {normalizedPOs.length === 1 ? "purchase order" : "purchase orders"}
                  <span className="ml-2 text-xs text-[rgb(var(--color-text-tertiary))]">
                    • No more purchase orders
                  </span>
                </>
              )}
            </div>
            <div className="text-sm text-[rgb(var(--color-text-secondary))]" />
          </div>
        </div>
      </div>

      {/* Drawers and Modals */}
      <PurchaseOrderDeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        billToDelete={poToDelete}
        formatCurrency={formatCurrency}
        isDeleting={isDeleting}
      />

      <CreateBillDrawer
        isOpen={showCreateBillDrawer}
        onClose={() => {
          setShowCreateBillDrawer(false);
          setSelectedPOForBill(null);
        }}
        purchaseOrder={selectedPOForBill}
        onSuccess={() => {}}
      />

      <AdvancePaymentDrawer
        isOpen={showAdvancePaymentDrawer}
        onClose={() => {
          setShowAdvancePaymentDrawer(false);
          setSelectedPOForPayment(null);
        }}
        purchaseOrder={selectedPOForPayment}
        onSuccess={() => {
          if (storeId) {
            dispatch(
              getPOs({
                store: storeId,
                limit: 20,
                cursor: null,
                isFreshLoad: true,
              }),
            );
          }
        }}
      />

      {Array.isArray(toasts) && (
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      )}
    </>
  );
}
