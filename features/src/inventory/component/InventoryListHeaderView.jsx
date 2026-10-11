"use client";
import { Grid3X3, List, Plus, Search, Package } from "lucide-react";
import { Button, Input, SideDrawer } from "@dragorbit/ui";
export function InventoryListHeaderView({ model }) {
  const {
    t,
    searchValue,
    setSearchValue,
    searchInputRef,
    handleViewModeChange,
    viewMode,
    canCreate,
    setShowInventoryDrawer,
    showInventoryDrawer,
    CreateInventory,
    handleInventorySuccess,
    onCreate,
    syncStatus,
  } = model;
  return (
    <>
      {syncStatus}
      <div className="p-5">
        <div className="flex justify-between items-center lg:flex-row gap-4 mb-0">
          <div className="w-100 flex">
            <Input
              type="text"
              placeholder={`${t("common.search")} ${t("inventory.title").toLowerCase()}...`}
              value={searchValue}
              onChange={setSearchValue}
              ref={searchInputRef}
              leftIcon={Search}
              className="w-100"
            />
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex bg-[rgb(var(--color-bg-secondary))] rounded-lg">
              <button
                onClick={() => handleViewModeChange("table")}
                className={`px-3 cursor-pointer py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "table"
                    ? "bg-[rgb(var(--color-primary))] text-white"
                    : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                }`}
              >
                <List className="w-4 h-4" />
                {t("common.tableView")}
              </button>
              <button
                onClick={() => handleViewModeChange("card")}
                className={`px-3 cursor-pointer py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "card"
                    ? "bg-[rgb(var(--color-primary))] text-white"
                    : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                {t("common.cardView")}
              </button>
            </div>

            {canCreate && (
              <Button variant="primary" onClick={onCreate} leftIcon={Plus}>
                {t("inventory.addStock", { defaultValue: "Add Stock" })}
              </Button>
            )}
          </div>
        </div>

        {/* Create Inventory Drawer */}
        {showInventoryDrawer && (
          <SideDrawer
            isOpen={showInventoryDrawer}
            onClose={() => setShowInventoryDrawer(false)}
            title={t("inventory.addNewInventory", {
              defaultValue: "Add New Stock",
            })}
            icon={Package}
            width="w-full md:w-1/2 lg:w-2/3 xl:w-1/3"
          >
            <div className="p-6 h-full">
              <CreateInventory
                onSuccess={handleInventorySuccess}
                onCancel={() => setShowInventoryDrawer(false)}
                showCancelButton={true}
                mode="drawer"
              />
            </div>
          </SideDrawer>
        )}
      </div>
    </>
  );
}
