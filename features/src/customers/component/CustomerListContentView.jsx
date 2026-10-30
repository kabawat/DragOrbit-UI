"use client";
import { SideDrawer } from "@dragorbit/ui";
import { Users } from "lucide-react";
/** Host model supplies state/actions; this component owns the shared markup. */
export function CustomerListContentView({ model }) {
  const {
    viewMode,
    CustomerTable,
    visibleCustomers,
    scrollFooter,
    isLoading,
    canEdit,
    setEditCustomerId,
    canDelete,
    deleteModalRef,
    goToDetails,
    canManageKhata,
    goToKhata,
    canQuickKhataEntry,
    openQuickKhataEntry,
    onSendReminder,
    canRemind,
    CustomerCard,
    t,
    pagination,
    CustomerDeleteModal,
    KhataQuickEntry,
    quickEntryTarget,
    setQuickEntryTarget,
    storeId,
    refreshCustomers,
    editCustomerId,
    EditCustomer,
    scrollRootRef,
    footerInsideTable,
  } = model;
  return (
    <>
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.6)] overflow-hidden">
        <div ref={scrollRootRef}>
          {viewMode === "table" ? (
            <div className="h-auto">
              <CustomerTable
                customers={visibleCustomers}
                scrollFooter={footerInsideTable ? scrollFooter : undefined}
                loading={isLoading && visibleCustomers.length === 0}
                onEdit={canEdit ? setEditCustomerId : undefined}
                onDelete={
                  canDelete
                    ? (id) => deleteModalRef.current?.open(id)
                    : undefined
                }
                onViewDetails={goToDetails}
                onManageKhata={canManageKhata ? goToKhata : undefined}
                onQuickKhataEntry={
                  canQuickKhataEntry ? openQuickKhataEntry : undefined
                }
                onSendReminder={canRemind ? onSendReminder : undefined}
                canEdit={canEdit}
                canDelete={canDelete}
                canManageKhata={canManageKhata}
                canQuickKhataEntry={canQuickKhataEntry}
                canRemind={canRemind}
              />
            </div>
          ) : (
            <div className="h-auto">
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.localId || customer.id}
                    customer={customer}
                    onEdit={canEdit ? setEditCustomerId : undefined}
                    onDelete={
                      canDelete
                        ? (id) => deleteModalRef.current?.open(id)
                        : undefined
                    }
                    onViewDetails={goToDetails}
                    onManageKhata={canManageKhata ? goToKhata : undefined}
                    onQuickKhataEntry={
                      canQuickKhataEntry ? openQuickKhataEntry : undefined
                    }
                    onSendReminder={canRemind ? onSendReminder : undefined}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canManageKhata={canManageKhata}
                    canQuickKhataEntry={canQuickKhataEntry}
                    canRemind={canRemind}
                  />
                ))}
              </div>
            </div>
          )}

          {(viewMode !== "table" || !footerInsideTable) && scrollFooter}
        </div>

        {/* Footer */}
        <div className="bg-[rgb(var(--color-bg-tertiary))] border-t border-[rgb(var(--color-border-primary))] px-6 py-4">
          <div className="text-sm text-[rgb(var(--color-text-secondary))]">
            {t("common.showing") || "Showing"}
            <span className="font-semibold text-[rgb(var(--color-text-primary))]">
              {visibleCustomers.length}
            </span>
            {t("customers.title").toLowerCase()}
            {pagination.hasNextPage && (
              <span className="ml-2 text-xs text-[rgb(var(--color-primary))]">
                • {t("common.scrollToLoadMore") || "Scroll down to load more"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delete modal — fully self-contained via ref */}
      <CustomerDeleteModal ref={deleteModalRef} />

      <KhataQuickEntry
        open={Boolean(quickEntryTarget)}
        onClose={() => setQuickEntryTarget(null)}
        storeId={storeId}
        customerId={quickEntryTarget?.customerId}
        customerName={quickEntryTarget?.customerName}
        customerAccountId={quickEntryTarget?.customerAccountId}
        onSuccess={refreshCustomers}
      />

      {/* Edit Customer Drawer */}
      <SideDrawer
        isOpen={!!editCustomerId}
        onClose={() => setEditCustomerId(null)}
        title={t("customers.editCustomer") || "Edit Customer"}
        icon={Users}
        width="w-full md:w-2/3 lg:w-1/2"
      >
        <div className="p-6 h-full">
          {editCustomerId && (
            <EditCustomer
              customerId={editCustomerId}
              onSuccess={() => setEditCustomerId(null)}
              onCancel={() => setEditCustomerId(null)}
              showCancelButton={true}
              mode="drawer"
            />
          )}
        </div>
      </SideDrawer>
    </>
  );
}
