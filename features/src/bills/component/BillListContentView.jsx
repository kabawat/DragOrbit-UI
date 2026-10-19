"use client";
import { TableSkeleton } from "@dragorbit/ui";
export function BillListContentView({ model }) {
  const {
    viewMode,
    BillTable,
    bills,
    canEdit,
    canDelete,
    handleDelete,
    isLoading,
    t,
    handleMenuAction,
    formatCurrency,
    formatDate,
    BillGrid,
    openMenuId,
    handleMenuToggle,
    menuRefs,
    pagination,
    sentinelRef,
    isFetchingMore,
    BillDeleteConfirmModal,
    showDeleteModal,
    setShowDeleteModal,
    confirmDelete,
    billToDelete,
    isDeleting,
    BillPaymentDrawer,
    showPaymentDrawer,
    setShowPaymentDrawer,
    setSelectedBillForPayment,
    selectedBillForPayment,
    storeId,
    dispatch,
    getBills,
    onRoute0,
    onRoute1,
    onRoute2,
    onRoute3,
    scrollRootRef,
  } = model;
  return (
    <>
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.6)] overflow-hidden">
        <div
          ref={scrollRootRef}
          className="h-[calc(100vh-210px)] overflow-y-auto"
        >
          {viewMode === "table" ? (
            <BillTable
              bills={bills}
              onEdit={canEdit ? (billId) => onRoute0(billId) : undefined}
              onDelete={canDelete ? handleDelete : undefined}
              onViewDetails={(billId) => onRoute1(billId)}
              loading={isLoading && bills.length === 0}
              emptyMessage={t("bills.noBills")}
              onMenuAction={handleMenuAction}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          ) : (
            <BillGrid
              bills={bills}
              onEdit={canEdit ? (billId) => onRoute2(billId) : undefined}
              onDelete={canDelete ? handleDelete : undefined}
              onViewDetails={(billId) => onRoute3(billId)}
              openMenuId={openMenuId}
              onMenuToggle={handleMenuToggle}
              onMenuAction={handleMenuAction}
              menuRefs={menuRefs}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
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
                    {bills.length}
                  </span>{" "}
                  bills
                  <span className="ml-2 text-xs text-[rgb(var(--color-primary))]">
                    • Scroll down to load more
                  </span>
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                    {bills.length}
                  </span>{" "}
                  bills
                  <span className="ml-2 text-xs text-[rgb(var(--color-text-tertiary))]">
                    • {t("bills.noMore")}
                  </span>
                </>
              )}
            </div>
            <div className="text-sm text-[rgb(var(--color-text-secondary))]" />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <BillDeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        billToDelete={billToDelete}
        formatCurrency={formatCurrency}
        isDeleting={isDeleting}
      />

      {/* Payment Drawer */}
      <BillPaymentDrawer
        isOpen={showPaymentDrawer}
        onClose={() => {
          setShowPaymentDrawer(false);
          setSelectedBillForPayment(null);
        }}
        bill={selectedBillForPayment}
        onSuccess={() => {
          if (storeId) {
            dispatch(
              getBills({
                store: storeId,
                limit: 20,
                cursor: null,
                isFreshLoad: true,
              }),
            );
          }
        }}
      />
    </>
  );
}
