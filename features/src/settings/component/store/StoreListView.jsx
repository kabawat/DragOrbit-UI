"use client";
import { Building2, Crown, Edit2, Plus, Trash2 } from "lucide-react";
export function StoreListView({ model }) {
  const {
    stores,
    currentStoreId,
    handleEditStore,
    handleDeleteStore,
    t,
    CopyableContactValue,
    onAddStore,
    canAddStore = true,
    storeLimit = null,
  } = model;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => {
        const storeId = store._id || store.id;
        const isCurrent = storeId === currentStoreId;
        const address = store.address || {};
        const addressParts = [
          address.line1,
          address.city,
          address.state,
          address.pincode,
        ].filter(Boolean);

        return (
          <div
            key={storeId}
            className="bg-[rgb(var(--color-bg-primary))]/20 rounded-lg border border-[rgb(var(--color-border-primary))]/70 p-6 relative flex flex-col h-full"
          >
            {/* Card Header with Icon and Actions */}
            <div className="flex items-start justify-between mb-4">
              {/* Store Icon */}
              <div className="w-10 h-10 bg-[rgb(var(--color-primary))]/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[rgb(var(--color-primary))]" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditStore(store)}
                  className="w-8 h-8 flex items-center justify-center bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                </button>
                {!isCurrent && stores.length > 1 && (
                  <button
                    onClick={() => handleDeleteStore(storeId)}
                    className="w-8 h-8 flex items-center justify-center bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                  </button>
                )}
              </div>
            </div>

            {/* Store Name */}
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-2">
              {store.name || "-"}
            </h3>

            {/* Address */}
            {addressParts.length > 0 && (
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-3">
                {addressParts.join(", ")}
              </p>
            )}

            {/* GST & PAN */}
            <div className="space-y-1 mb-3">
              {store.gst && (
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  <span className="font-medium text-[rgb(var(--color-text-primary))]">
                    {t("settings.gst")}:
                  </span>
                  {store.gst}
                </p>
              )}
              {store.pan && (
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  <span className="font-medium text-[rgb(var(--color-text-primary))]">
                    {t("settings.pan")}:
                  </span>
                  {store.pan}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-1 mb-4">
              {store.phone && (
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  <span className="font-medium text-[rgb(var(--color-text-primary))]">
                    {t("settings.phone")}:
                  </span>
                  <CopyableContactValue
                    value={store.phone}
                    className="text-sm inline"
                  />
                </p>
              )}
              {store.email && (
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  <span className="font-medium text-[rgb(var(--color-text-primary))]">
                    {t("settings.email")}:
                  </span>
                  <CopyableContactValue
                    value={store.email}
                    className="text-sm inline"
                  />
                </p>
              )}
            </div>

            {/* Current Store Badge */}
            {isCurrent && (
              <div className="mt-auto pt-4 text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.625rem] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
                  {t("settings.currentStore")}
                </span>
              </div>
            )}
          </div>
        );
      })}
      {/* Create New Store / Upgrade Card */}
      <button
        type="button"
        onClick={onAddStore}
        className={`bg-[rgb(var(--color-bg-primary))]/20 rounded-lg border border-dashed p-6 relative flex flex-col items-center justify-center h-full min-h-[220px] transition-colors cursor-pointer ${
          canAddStore
            ? "border-[rgb(var(--color-border-primary))]/70 hover:border-[rgb(var(--color-primary))]/60 hover:bg-[rgb(var(--color-primary))]/5"
            : "border-[#f59e0b]/40 hover:border-[#f59e0b]/70 hover:bg-[#f59e0b]/5"
        }`}
      >
        <div
          className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${
            canAddStore
              ? "bg-[rgb(var(--color-primary))]/10"
              : "bg-[#f59e0b]/10"
          }`}
        >
          {canAddStore ? (
            <Plus className="w-6 h-6 text-[rgb(var(--color-primary))]" />
          ) : (
            <Crown className="w-6 h-6 text-[#f59e0b]" />
          )}
        </div>
        <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-1">
          {canAddStore
            ? t("settings.createNewStore")
            : t("settings.upgradeToAddStore")}
        </h3>
        <p className="text-sm text-[rgb(var(--color-text-secondary))] text-center max-w-[220px]">
          {canAddStore
            ? t("settings.addAnotherStoreToAccount")
            : storeLimit != null
              ? t("settings.storePlanLimitReached", { limit: storeLimit })
              : t("settings.storePlanLimitReachedGeneric")}
        </p>
      </button>
    </div>
  );
}
