"use client";
import { CreditCard, Plus } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";
export function PaymentsScreen({ model }) {
  const {
    permissionsLoading = false,
    t,
    payments,
    isLoading,
    error,
    searchValue,
    canCreate,
    onCreate,
    header,
    content,
  } = model;
  return (
    <div className="overflow-hidden">
      <div className="max-w-8xl mx-auto">
        {header}
        <div className="px-5">
          {error && !(isLoading || permissionsLoading) && payments.length === 0 && <EmptyState fullHeight type="error" title={t("common.error")} description={typeof error === "string" ? error : error.message} />}

          {(isLoading || permissionsLoading) &&
            payments.length === 0 &&
            !error && <PageLoader />}
          {!isLoading && !permissionsLoading && payments.length === 0 && !error && (
            <EmptyState
                fullHeight
              className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
              icon={CreditCard}
              title={t("payments.noPayments")}
              description={
                error
                  ? String(error)
                  : searchValue
                    ? t("payments.noResultsDescription")
                    : t("payments.emptyDescription")
              }
              type={error ? "error" : "empty"}
              actionButton={
                !searchValue && !error && canCreate
                  ? {
                      label: t("payments.createPayment"),
                      onClick: onCreate,
                      icon: Plus,
                    }
                  : null
              }
            />
          )}{" "}
          {payments.length > 0 && content}
        </div>
      </div>
    </div>
  );
}
