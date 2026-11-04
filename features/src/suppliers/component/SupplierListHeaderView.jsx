"use client";
import {
  Download,
  Grid3X3,
  List,
  Plus,
  Search,
  Upload,
  Crown,
} from "lucide-react";
import { Button, Input, Select } from "@dragorbit/ui";
export function SupplierListHeaderView({ model }) {
  const {
    searchInputRef,
    t,
    searchValue,
    setSearchValue,
    accountStatus,
    setAccountStatus,
    riskLevel,
    setRiskLevel,
    isActive,
    setIsActive,
    suppliers,
    handleViewModeChange,
    viewMode,
    canCreate,
    setShowBulkUploadDrawer,
    canSeeDownload,
    handleDownloadClick,
    isReportLocked,
    setShowAddSupplierDrawer,
    AddSupplierDrawer,
    showAddSupplierDrawer,
    handleSupplierSuccess,
    SupplierDownloadDrawer,
    showDownloadDrawer,
    setShowDownloadDrawer,
    showBulkUploadDrawer,
    SupplierBulkUploadDrawer,
    syncStatus,
  } = model;
  return (
    <>
      {syncStatus}
      <div className="p-5">
        <div className="flex justify-between items-center lg:flex-row gap-4 mb-0">
          <div className="w-100">
            <Input
              type="text"
              ref={searchInputRef}
              placeholder={`${t("common.search")} ${t("suppliers.title").toLowerCase()}...`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target?.value ?? e)}
              leftIcon={Search}
              className="w-100"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="min-w-[160px]">
              <Select
                placeholder="Account Status"
                value={accountStatus}
                onChange={setAccountStatus}
                options={[
                  { value: "", label: "All statuses" },
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" },
                  { value: "SUSPENDED", label: "Suspended" },
                ]}
                clearable
              />
            </div>
            <div className="min-w-[150px]">
              <Select
                placeholder="Risk Level"
                value={riskLevel}
                onChange={setRiskLevel}
                options={[
                  { value: "", label: "All risk levels" },
                  { value: "LOW", label: "Low" },
                  { value: "MEDIUM", label: "Medium" },
                  { value: "HIGH", label: "High" },
                ]}
                clearable
              />
            </div>
            <div className="min-w-[140px]">
              <Select
                placeholder="Status"
                value={isActive}
                onChange={setIsActive}
                options={[
                  { value: "", label: "All" },
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" },
                ]}
                clearable
              />
            </div>

            {suppliers.length > 0 && (
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
            )}
            {canCreate && (
              <Button
                variant="secondary"
                onClick={() => setShowBulkUploadDrawer(true)}
                leftIcon={Upload}
              >
                {t("suppliers.bulkUpload", "Bulk Upload")}
              </Button>
            )}

            {canSeeDownload && (
              <Button
                variant="secondary"
                onClick={handleDownloadClick}
                className="flex items-center gap-2 h-9 relative"
              >
                <Download className="w-4 h-4" />
                {t("common.download")}
                {isReportLocked && (
                  <div className="absolute -top-1 -right-1 bg-[#f59e0b] text-white rounded-full p-0.5 shadow-sm">
                    <Crown size={8} className="fill-white/20" />
                  </div>
                )}
              </Button>
            )}

            {canCreate && (
              <>
                <Button
                  variant="primary"
                  onClick={() => setShowAddSupplierDrawer(true)}
                  leftIcon={Plus}
                >
                  {t("suppliers.addSupplier")}
                </Button>
              </>
            )}
          </div>
        </div>

        <AddSupplierDrawer
          isOpen={showAddSupplierDrawer}
          onClose={() => setShowAddSupplierDrawer(false)}
          onSuccess={handleSupplierSuccess}
        />

        <SupplierDownloadDrawer
          isOpen={showDownloadDrawer}
          onClose={() => setShowDownloadDrawer(false)}
        />

        {showBulkUploadDrawer && (
          <SupplierBulkUploadDrawer
            isOpen={showBulkUploadDrawer}
            onClose={() => setShowBulkUploadDrawer(false)}
            onSuccess={handleSupplierSuccess}
          />
        )}
      </div>
    </>
  );
}
