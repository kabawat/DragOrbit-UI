"use client";
import { Package, Plus } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";
export function InventoryScreen({ model }) {
  const {
    InventoryListHeader,
    showInventoryDrawer,
    setShowInventoryDrawer,
    canCreate,
    searchValue,
    setSearchValue,
    inventoryLoading,
    permissionsLoading,
    inventories,
    error,
    t,
    InventoryListContent,
    canEdit,
    canDelete,
    onCreate,
  } = model;
  return (
    <div className="overflow-hidden">
      <div className="max-w-8xl mx-auto w-full">
        <InventoryListHeader
          showInventoryDrawer={showInventoryDrawer}
          setShowInventoryDrawer={setShowInventoryDrawer}
          canCreate={canCreate}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

        <div className="px-5">
          {error && !(inventoryLoading || permissionsLoading) && inventories.length === 0 && <EmptyState fullHeight type="error" title={t("common.error")} description={typeof error === "string" ? error : error.message} />}

          {(inventoryLoading || permissionsLoading) &&
            inventories.length === 0 &&
            !error && <PageLoader />}

          {!(inventoryLoading || permissionsLoading) &&
            inventories.length === 0 && !error && (
              <EmptyState
                fullHeight
                className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
                icon={Package}
                title={t("inventory.noInventory")}
                description={
                  searchValue
                    ? t("inventory.noResultsDescription")
                    : t("inventory.emptyDescription")
                }
                actionButton={
                  !searchValue && canCreate
                    ? {
                        label: t("inventory.addStock"),
                        onClick: onCreate,
                        icon: Plus,
                      }
                    : null
                }
              />
            )}

          {inventories.length > 0 && (
            <InventoryListContent
              canEdit={canEdit}
              canDelete={canDelete}
              canCreate={canCreate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
