"use client";
export function StoreSettingsView({ model }) {
  const {
    StoreHeader,
    stores,
    isLoading,
    handleAddStore,
    StoreList,
    selectedStore,
    handleEditStore,
    handleDeleteStore,
    handleShowCatalog,
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
    CatalogQRModal,
    isCatalogModalOpen,
    setIsCatalogModalOpen,
    setActiveStore,
    activeStore,
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
        onEditStore={handleEditStore}
        onDeleteStore={handleDeleteStore}
        onShowCatalog={handleShowCatalog}
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

      <CatalogQRModal
        isOpen={isCatalogModalOpen}
        onClose={() => {
          setIsCatalogModalOpen(false);
          setActiveStore(null);
        }}
        store={activeStore}
      />
    </div>
  );
}
