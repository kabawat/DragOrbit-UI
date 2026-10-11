"use client";
import { Building, Plus } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";
export function SuppliersScreen({ model }) {
  const {
    SupplierListHeader,
    searchValue,
    setSearchValue,
    accountStatus,
    setAccountStatus,
    riskLevel,
    setRiskLevel,
    isActive,
    setIsActive,
    showAddSupplierDrawer,
    setShowAddSupplierDrawer,
    isLoading,
    permissionsLoading,
    suppliers,
    error,
    t,
    isFiltered,
    canCreate,
    SupplierListContent,
  } = model;
  return (
    <div className="overflow-hidden">
      <div className="max-w-8xl mx-auto">
        <SupplierListHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          accountStatus={accountStatus}
          setAccountStatus={setAccountStatus}
          riskLevel={riskLevel}
          setRiskLevel={setRiskLevel}
          isActive={isActive}
          setIsActive={setIsActive}
          showAddSupplierDrawer={showAddSupplierDrawer}
          setShowAddSupplierDrawer={setShowAddSupplierDrawer}
        />

        <div className="px-5">
          {(isLoading || permissionsLoading) &&
            suppliers.length === 0 &&
            !error && <PageLoader />}

          {!(isLoading || permissionsLoading) &&
            suppliers.length === 0 &&
            !error && (
              <EmptyState
                className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
                icon={Building}
                title={t("suppliers.noSuppliers")}
                description={
                  isFiltered
                    ? t("suppliers.noResultsDescription")
                    : t("suppliers.emptyDescription")
                }
                actionButton={
                  !isFiltered && canCreate
                    ? {
                        label: t("suppliers.addSupplier"),
                        onClick: () => setShowAddSupplierDrawer(true),
                        icon: Plus,
                      }
                    : null
                }
              />
            )}

          {suppliers.length > 0 && <SupplierListContent />}
        </div>
      </div>
    </div>
  );
}
