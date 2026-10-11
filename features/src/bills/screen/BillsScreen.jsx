"use client";
import { FileText, Plus } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";
export function BillsScreen({ model }) {
  const {
    BillListHeader,
    searchValue,
    setSearchValue,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isLoading,
    permissionsLoading,
    bills,
    error,
    t,
    canCreate,
    BillListContent,
    onCreate,
  } = model;
  return (
    <div className="overflow-hidden">
      <div className="max-w-8xl mx-auto">
        <BillListHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <div className="px-5">
          {(isLoading || permissionsLoading) &&
            bills.length === 0 &&
            !error && <PageLoader />}
          {!(isLoading || permissionsLoading) &&
            bills.length === 0 &&
            !error && (
              <EmptyState
                className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
                icon={FileText}
                title={t("bills.noBills")}
                description={
                  searchValue
                    ? t("bills.noResultsDescription")
                    : t("bills.emptyDescription")
                }
                actionButton={
                  !searchValue && canCreate
                    ? {
                        label: t("bills.createBill"),
                        onClick: () => onCreate(),
                        icon: Plus,
                      }
                    : null
                }
              />
            )}
          {bills.length > 0 && (
            <BillListContent
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
