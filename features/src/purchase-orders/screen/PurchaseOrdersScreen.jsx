"use client";
import { FileText, Plus } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";
export function PurchaseOrdersScreen({ model }) {
  const {
    PurchaseOrderListHeader,
    searchValue,
    setSearchValue,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isLoading,
    permissionsLoading,
    purchaseOrders,
    error,
    t,
    canCreate,
    PurchaseOrderListContent,
    onCreate,
  } = model;
  return (
    <div className="overflow-hidden">
      <div className="max-w-8xl mx-auto w-full">
        <PurchaseOrderListHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <div className="px-5">
          {error && !(isLoading || permissionsLoading) && purchaseOrders.length === 0 && <EmptyState fullHeight type="error" title={t("common.error")} description={typeof error === "string" ? error : error.message} />}

          {(isLoading || permissionsLoading) &&
            purchaseOrders.length === 0 &&
            !error && <PageLoader />}
          {!(isLoading || permissionsLoading) &&
            purchaseOrders.length === 0 && !error && (
              <EmptyState
                fullHeight
                className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
                icon={FileText}
                title={t("purchaseOrders.noPurchaseOrders")}
                description={
                  searchValue
                    ? t("purchaseOrders.noResultsDescription")
                    : t("purchaseOrders.emptyDescription")
                }
                actionButton={
                  !searchValue && canCreate
                    ? {
                        label: t("purchaseOrders.createPO"),
                        onClick: () => onCreate(),
                        icon: Plus,
                      }
                    : null
                }
              />
            )}
          {purchaseOrders.length > 0 && (
            <PurchaseOrderListContent
              searchValue={searchValue}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
