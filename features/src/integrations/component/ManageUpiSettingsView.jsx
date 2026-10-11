"use client";
export function ManageUpiSettingsView({ model }) {
  const {
    UpiHeader,
    upiIds,
    isUpiLoading,
    handleAddUpi,
    UpiList,
    stores,
    handleEditUpi,
    handleDeleteUpi,
    UpiAddDrawer,
    isAddDrawerOpen,
    storeId,
    setIsAddDrawerOpen,
    handleMutationSuccess,
    showError,
    UpiEditDrawer,
    isEditDrawerOpen,
    editingUpi,
    setIsEditDrawerOpen,
    setEditingUpi,
    UpiDeleteModal,
    isDeleteModalOpen,
    upiToDelete,
    setIsDeleteModalOpen,
    setUpiToDelete,
  } = model;
  return (
    <div className="space-y-6">
      <UpiHeader
        upiCount={upiIds.length}
        isLoading={isUpiLoading}
        onAddUpi={handleAddUpi}
      />
      <UpiList
        upiIds={upiIds}
        stores={stores}
        isLoading={isUpiLoading}
        onAddUpi={handleAddUpi}
        onEditUpi={handleEditUpi}
        onDeleteUpi={handleDeleteUpi}
      />

      <UpiAddDrawer
        isOpen={isAddDrawerOpen}
        storeId={storeId}
        stores={stores}
        onClose={() => setIsAddDrawerOpen(false)}
        onSuccess={handleMutationSuccess}
        onError={showError}
      />

      <UpiEditDrawer
        isOpen={isEditDrawerOpen}
        storeId={storeId}
        editingUpi={editingUpi}
        stores={stores}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setEditingUpi(null);
        }}
        onSuccess={handleMutationSuccess}
        onError={showError}
      />

      <UpiDeleteModal
        isOpen={isDeleteModalOpen}
        upiToDelete={upiToDelete}
        storeId={storeId}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUpiToDelete(null);
        }}
        onSuccess={handleMutationSuccess}
        onError={showError}
      />
    </div>
  );
}
