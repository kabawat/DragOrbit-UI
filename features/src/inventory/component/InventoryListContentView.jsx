"use client";
export function InventoryListContentView({ model }) {
  const {
    StockInDrawer,
    viewMode,
    InventoryTable,
    inventories,
    handleViewStock,
    handleDeleteStock,
    handleDuplicate,
    handleStockIn,
    isLoading,
    t,
    canEdit,
    canDelete,
    canCreate,
    InventoryCard,
    pagination,
    sentinelRef,
    isFetchingMore,
    DeleteInventoryModal,
    showDeleteModal,
    handleDeleteClose,
    inventoryToDelete,
    handleDeleteSuccess,
    showStockInDrawer,
    handleCloseStockInDrawer,
    stockInItem,
    handleStockInSuccess,
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
            <div className="h-auto">
              <InventoryTable
                inventories={inventories}
                onViewDetails={handleViewStock}
                onDelete={handleDeleteStock}
                onDuplicate={handleDuplicate}
                onStockIn={handleStockIn}
                loading={isLoading}
                emptyMessage={t("common.noData")}
                canEdit={canEdit}
                canDelete={canDelete}
                canCreate={canCreate}
              />
            </div>
          ) : (
            <div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {inventories.map((inventory) => (
                  <InventoryCard
                    key={inventory.id || inventory._id}
                    inventory={inventory}
                    onViewDetails={handleViewStock}
                    onDelete={handleDeleteStock}
                    onDuplicate={handleDuplicate}
                    onStockIn={handleStockIn}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canCreate={canCreate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sentinel — IntersectionObserver triggers load more */}
          {pagination.hasNextPage && (
            <div ref={sentinelRef} className="h-4 w-full" />
          )}

          {/* Infinite scroll loading */}
          {(isFetchingMore || isLoading) && inventories.length > 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[rgb(var(--color-primary))]" />
                <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                  {t("common.loadingMore") || "Loading more..."}
                </span>
              </div>
            </div>
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
                    {inventories.length}
                  </span>{" "}
                  stock items
                  <span className="ml-2 text-xs text-[rgb(var(--color-primary))]">
                    • Scroll down to load more
                  </span>
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                    {inventories.length}
                  </span>{" "}
                  stock items
                  <span className="ml-2 text-xs text-[rgb(var(--color-text-tertiary))]">
                    • No more stock items
                  </span>
                </>
              )}
            </div>
            <div className="text-sm text-[rgb(var(--color-text-secondary))]" />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteInventoryModal
        isOpen={showDeleteModal}
        onClose={handleDeleteClose}
        inventoryToDelete={inventoryToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Stock In Drawer */}
      <StockInDrawer
        isOpen={showStockInDrawer}
        onClose={handleCloseStockInDrawer}
        item={stockInItem}
        onSuccess={handleStockInSuccess}
        type="inventory"
      />
    </>
  );
}
