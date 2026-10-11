"use client";
export function PaymentListContentView({ model }) {
  const {
    payments,
    isFetchingMore,
    viewMode,
    scrollRef,
    PaymentTable,
    handleMenuAction,
    canEdit,
    canDelete,
    PaymentGrid,
    selectedPayments,
    handlePaymentSelect,
    menuRefs,
    openMenuId,
    handleMenuToggle,
    pagination,
    t,
    DeletePaymentModal,
    showDeleteModal,
    setShowDeleteModal,
    paymentToDelete,
    confirmDelete,
    sentinelRef,
    tableProps,
  } = model;
  return (
    <>
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.6)] overflow-hidden">
        <div className="h-[calc(100vh-210px)] overflow-y-auto" ref={scrollRef}>
          {viewMode === "table" ? (
            <PaymentTable
              {...tableProps}
              payments={payments}
              isLoadingMore={isFetchingMore}
              handleMenuAction={handleMenuAction}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ) : (
            <PaymentGrid
              payments={payments}
              isLoadingMore={isFetchingMore}
              selectedPayments={selectedPayments}
              handlePaymentSelect={handlePaymentSelect}
              menuRefs={menuRefs}
              openMenuId={openMenuId}
              handleMenuToggle={handleMenuToggle}
              handleMenuAction={handleMenuAction}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          )}
          {pagination?.hasNextPage && sentinelRef && (
            <div ref={sentinelRef} className="h-4 w-full" />
          )}
        </div>

        {/* Footer */}
        <div className="bg-[rgb(var(--color-bg-tertiary))] border-t border-[rgb(var(--color-border-primary))] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[rgb(var(--color-text-secondary))]">
              {pagination?.hasNextPage ? (
                <>
                  Showing{" "}
                  <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                    {payments.length}
                  </span>{" "}
                  payments
                  <span className="ml-2 text-xs text-[rgb(var(--color-primary))]">
                    • Scroll down to load more
                  </span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                    {t("payments.showingPayments", {
                      count: payments.length,
                    })}
                  </span>
                  <span className="ml-2 text-xs text-[rgb(var(--color-text-tertiary))]">
                    • {t("payments.noMore")}
                  </span>
                </>
              )}
            </div>
            <div className="text-sm text-[rgb(var(--color-text-secondary))]" />
          </div>
        </div>
      </div>
      <DeletePaymentModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        paymentToDelete={paymentToDelete}
        onConfirmDelete={confirmDelete}
      />
    </>
  );
}
