"use client";
import { useState } from "react";
import { Package, Search } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";

/** Shared presentation; hosts supply data and platform-bound list adapters. */
export function SalesOrdersScreen({
  t,
  orders,
  isLoading,
  error,
  permissionsLoading,
  canCreate,
  canEdit,
  canDelete,
  SalesOrderListHeader,
  SalesOrderListContent,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderSourceFilter, setOrderSourceFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="overflow-hidden">
      <div className="max-w-8xl mx-auto">
        <SalesOrderListHeader
          canCreate={canCreate}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          orderSourceFilter={orderSourceFilter}
          setOrderSourceFilter={setOrderSourceFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <div className="px-5">
          {/* Loading State Wrapper */}
          {(isLoading || permissionsLoading) &&
            orders.length === 0 &&
            !error && <PageLoader />}

          {/* Completely Empty State Fallback */}
          {!isLoading && orders.length === 0 && (
            <EmptyState
              className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
              title={t("common.noResults")}
              description={
                searchValue || statusFilter !== "all"
                  ? t("salesOrder.noResultsDescription")
                  : t("salesOrder.emptyDescription")
              }
              icon={searchValue || statusFilter !== "all" ? Search : Package}
            />
          )}

          {/* Hydrated Container Mapping */}
          {orders.length > 0 && (
            <SalesOrderListContent
              canCreate={canCreate}
              canEdit={canEdit}
              canDelete={canDelete}
              searchValue={searchValue}
              statusFilter={statusFilter}
              orderSourceFilter={orderSourceFilter}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default SalesOrdersScreen;
