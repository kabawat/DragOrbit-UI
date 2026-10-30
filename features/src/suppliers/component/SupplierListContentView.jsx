"use client";
import { TableSkeleton } from "@dragorbit/ui";
export function SupplierListContentView({ model }) {
  const {
    viewMode,
    SupplierTable,
    suppliers,
    canEdit,
    handleEditSupplier,
    canDelete,
    handleDeleteSupplier,
    handleViewSupplier,
    handlePrintSupplier,
    isLoading,
    t,
    SupplierCard,
    setSelectedSupplierIds,
    selectedSupplierIds,
    pagination,
    sentinelRef,
    isFetchingMore,
    DeleteSupplierModal,
    showDeleteModal,
    setShowDeleteModal,
    setSupplierToDelete,
    supplierToDelete,
    handleConfirmDelete,
    isDeleting,
    EditSupplierDrawer,
    showEditSupplierDrawer,
    setShowEditSupplierDrawer,
    setEditingSupplierId,
    editingSupplierId,
    handleSupplierSuccess,
    scrollRootRef,
  } = model;
  return (
    <>
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.6)] overflow-hidden">
        <div ref={scrollRootRef}>
          {viewMode === "table" ? (
            <div className="h-full">
              <SupplierTable
                suppliers={suppliers}
                onEdit={canEdit ? handleEditSupplier : undefined}
                onDelete={canDelete ? handleDeleteSupplier : undefined}
                onViewDetails={handleViewSupplier}
                onPrint={handlePrintSupplier}
                loading={isLoading && suppliers.length === 0}
                emptyMessage={t("suppliers.noSuppliers")}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>
          ) : (
            <div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {suppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id || supplier._id}
                    supplier={supplier}
                    onEdit={canEdit ? handleEditSupplier : undefined}
                    onDelete={canDelete ? handleDeleteSupplier : undefined}
                    onViewDetails={handleViewSupplier}
                    onPrint={handlePrintSupplier}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onSelect={(id, checked) => {
                      setSelectedSupplierIds((prev) =>
                        checked
                          ? [...new Set([...prev, id])]
                          : prev.filter((x) => x !== id),
                      );
                    }}
                    selected={selectedSupplierIds.includes(
                      supplier.id || supplier._id,
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {pagination.hasNextPage && (
            <div ref={sentinelRef} className="h-4 w-full" />
          )}

          {isFetchingMore && suppliers.length > 0 && (
            <TableSkeleton compact rows={2} />
          )}
        </div>

        {/* Footer */}
        <div className="bg-[rgb(var(--color-bg-tertiary))] border-t border-[rgb(var(--color-border-primary))] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[rgb(var(--color-text-secondary))]">
              {pagination.hasNextPage ? (
                <>
                  Showing
                  <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                    {suppliers.length}
                  </span>
                  suppliers
                  <span className="ml-2 text-xs text-[rgb(var(--color-primary))]">
                    • Scroll down to load more
                  </span>
                </>
              ) : (
                <>
                  Showing
                  <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                    {suppliers.length}
                  </span>
                  suppliers
                  <span className="ml-2 text-xs text-[rgb(var(--color-text-tertiary))]">
                    • No more suppliers
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteSupplierModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSupplierToDelete(null);
        }}
        supplierToDelete={supplierToDelete}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <EditSupplierDrawer
        isOpen={showEditSupplierDrawer}
        onClose={() => {
          setShowEditSupplierDrawer(false);
          setEditingSupplierId(null);
        }}
        supplierId={editingSupplierId}
        onSuccess={handleSupplierSuccess}
      />
    </>
  );
}
