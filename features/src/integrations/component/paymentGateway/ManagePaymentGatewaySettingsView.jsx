"use client";
export function ManagePaymentGatewaySettingsView({ model }) {
  const {
    GatewayHeader,
    gateways,
    isGatewayLoading,
    handleAddGateway,
    canCreate,
    GatewayList,
    stores,
    handleEditGateway,
    handleDeleteGateway,
    canEdit,
    canDelete,
    GatewayAddDrawer,
    isAddDrawerOpen,
    storeId,
    setIsAddDrawerOpen,
    handleMutationSuccess,
    showError,
    GatewayEditDrawer,
    isEditDrawerOpen,
    editingGateway,
    setIsEditDrawerOpen,
    setEditingGateway,
    GatewayDeleteModal,
    isDeleteModalOpen,
    gatewayToDelete,
    setIsDeleteModalOpen,
    setGatewayToDelete,
  } = model;
  return (
    <div className="space-y-6">
      <GatewayHeader
        gatewayCount={gateways.length}
        isLoading={isGatewayLoading}
        onAddGateway={handleAddGateway}
        canCreate={canCreate}
      />
      <GatewayList
        gateways={gateways}
        stores={stores}
        isLoading={isGatewayLoading}
        onAddGateway={handleAddGateway}
        onEditGateway={handleEditGateway}
        onDeleteGateway={handleDeleteGateway}
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      {canCreate && (
        <GatewayAddDrawer
          isOpen={isAddDrawerOpen}
          storeId={storeId}
          stores={stores}
          onClose={() => setIsAddDrawerOpen(false)}
          onSuccess={handleMutationSuccess}
          onError={showError}
        />
      )}

      {canEdit && (
        <GatewayEditDrawer
          isOpen={isEditDrawerOpen}
          storeId={storeId}
          editingGateway={editingGateway}
          stores={stores}
          onClose={() => {
            setIsEditDrawerOpen(false);
            setEditingGateway(null);
          }}
          onSuccess={handleMutationSuccess}
          onError={showError}
        />
      )}

      {canDelete && (
        <GatewayDeleteModal
          isOpen={isDeleteModalOpen}
          gatewayToDelete={gatewayToDelete}
          storeId={storeId}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setGatewayToDelete(null);
          }}
          onSuccess={handleMutationSuccess}
          onError={showError}
        />
      )}
    </div>
  );
}
