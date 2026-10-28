"use client";
export function StoreSettingsView({ model }) {
  const {
    StoreHeader,
    stores,
    isLoading,
    handleAddStore,
    canAddStore,
    storeLimit,
    StoreList,
    selectedStore,
    handleEditStore,
    handleDeleteStore,
    StoreAddDrawer,
    isAddDrawerOpen,
    setIsAddDrawerOpen,
    handleAddSuccess,
    showError,
    StoreEditDrawer,
    isEditDrawerOpen,
    editingStore,
    setIsEditDrawerOpen,
    setEditingStore,
    handleEditSuccess,
    showSuccess,
    StoreDeleteModal,
    isDeleteModalOpen,
    storeToDelete,
    setIsDeleteModalOpen,
    setStoreToDelete,
    handleDeleteSuccess,
  } = model;
  return (
    <div className="space-y-6">
      <StoreHeader
        storesCount={stores?.length}
        isLoading={isLoading}
        onAddStore={handleAddStore}
      />

      <StoreList
        stores={stores}
        isLoading={isLoading}
        selectedStore={selectedStore}
        onAddStore={handleAddStore}
        canAddStore={canAddStore}
        storeLimit={storeLimit}
        onEditStore={handleEditStore}
        onDeleteStore={handleDeleteStore}
      />

      <StoreAddDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSuccess={handleAddSuccess}
        onError={showError}
      />

      <StoreEditDrawer
        isOpen={isEditDrawerOpen}
        editingStore={editingStore}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setEditingStore(null);
        }}
        onSuccess={handleEditSuccess}
        onError={showError}
        showSuccess={showSuccess}
      />

      <StoreDeleteModal
        isOpen={isDeleteModalOpen}
        storeToDelete={storeToDelete}
        stores={stores}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStoreToDelete(null);
        }}
        onSuccess={handleDeleteSuccess}
        onError={showError}
      />
    </div>
  );
}
