"use client";
import { Button, Input, Select } from "@dragorbit/ui";
import {
  Columns2,
  Download,
  Grid3X3,
  List,
  Plus,
  Search,
  Upload,
} from "lucide-react";
export function ProductListHeaderView({ model }) {
  const {
    searchInputRef,
    t,
    searchValue,
    setSearchValue,
    showInCatalog,
    setShowInCatalog,
    getCatalogOptions,
    category,
    setCategory,
    categoryOptions,
    categoriesLoading,
    sortBy,
    setSortBy,
    getSortOptions,
    handleViewModeChange,
    viewMode,
    canSeeDownload,
    setShowDownloadDrawer,
    canCreate,
    setShowBulkUploadDrawer,
    showBulkUploadDrawer,
    ProductBulkUpload,
    handleBulkUploadSuccess,
    showDownloadDrawer,
    ProductDownloadDrawer,
    onCreate,
    syncStatus,
  } = model;
  return (
    <div className="px-5 py-2">
      <div className="flex justify-between items-center lg:flex-row gap-4 mb-0">
        {/* Search - only in table/card view */}
        {viewMode !== "split" ? (
          <div className="flex">
            <Input
              type="text"
              ref={searchInputRef}
              placeholder={`${t("common.search")} ${t("products.title").toLowerCase()}...`}
              value={searchValue}
              onChange={setSearchValue}
              leftIcon={Search}
              className="w-100"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">
              {t("products.title", "Products")}
            </span>
          </div>
        )}

        {/* Filters + Actions */}
        <div className="flex gap-3 items-center ml-auto">
          <div className="min-w-[140px]">
            <Select
              placeholder={t("products.visibility")}
              value={showInCatalog}
              onChange={setShowInCatalog}
              options={getCatalogOptions(t)}
              searchable={false}
            />
          </div>

          <div className="min-w-[160px]">
            <Select
              placeholder={t("products.category")}
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              searchable={true}
              disabled={categoriesLoading}
              clearable
            />
          </div>

          <div className="min-w-[160px]">
            <Select
              placeholder={t("common.sortBy")}
              value={sortBy}
              onChange={setSortBy}
              options={getSortOptions(t)}
              clearable={true}
            />
          </div>

          {syncStatus}

          {/* View toggle */}
          <div className="flex bg-[rgb(var(--color-bg-secondary))] rounded-lg p-0.5 border border-[rgb(var(--color-border-primary))]/50">
            <button
              type="button"
              onClick={() => handleViewModeChange("split")}
              className={`p-2 cursor-pointer rounded-md text-sm font-medium transition-colors flex items-center justify-center ${viewMode === "split"
                ? "bg-[rgb(var(--color-primary))] text-white shadow-xs"
                : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                }`}
              title={t("common.splitView", "Split / Detail View")}
            >
              <Columns2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange("table")}
              className={`p-2 cursor-pointer rounded-md text-sm font-medium transition-colors flex items-center justify-center ${viewMode === "table"
                ? "bg-[rgb(var(--color-primary))] text-white shadow-xs"
                : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                }`}
              title={t("common.tableView", "Table View")}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange("card")}
              className={`p-2 cursor-pointer rounded-md text-sm font-medium transition-colors flex items-center justify-center ${viewMode === "card"
                ? "bg-[rgb(var(--color-primary))] text-white shadow-xs"
                : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                }`}
              title={t("common.cardView", "Card View")}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {canSeeDownload && (
            <Button
              variant="secondary"
              onClick={() => setShowDownloadDrawer(true)}
              leftIcon={Download}
            >
              {t("products.download", "Download")}
            </Button>
          )}

          {canCreate && (
            <Button
              variant="secondary"
              onClick={() => setShowBulkUploadDrawer(true)}
              leftIcon={Upload}
            >
              {t("products.bulkUpload", "Bulk Upload")}
            </Button>
          )}
          {canCreate && (
            <Button variant="primary" onClick={onCreate} leftIcon={Plus}>
              {t("products.addProduct")}
            </Button>
          )}
        </div>
      </div>

      {showBulkUploadDrawer && (
        <ProductBulkUpload
          isOpen={showBulkUploadDrawer}
          onClose={() => setShowBulkUploadDrawer(false)}
          onSuccess={handleBulkUploadSuccess}
        />
      )}

      {showDownloadDrawer && (
        <ProductDownloadDrawer
          isOpen={showDownloadDrawer}
          onClose={() => setShowDownloadDrawer(false)}
          searchValue={searchValue}
          sortBy={sortBy}
          showInCatalog={showInCatalog}
          category={category}
        />
      )}
    </div>
  );
}
