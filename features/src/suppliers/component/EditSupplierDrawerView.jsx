"use client";
import { TableSkeleton } from "@dragorbit/ui";
import { Building2, Save } from "lucide-react";
import { Button, SideDrawer } from "@dragorbit/ui";
export function EditSupplierDrawerPresentation({ model }) {
  const {
    isOpen,
    onClose,
    t,
    fetching,
    SupplierForm,
    formData,
    handleFormDataChange,
    fieldErrors,
    gstVerification,
    handleSave,
    loading,
  } = model;
  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={t("suppliers.editSupplier")}
      icon={Building2}
      description={t("suppliers.editSupplierDescription")}
      width="w-full md:w-2/3 lg:w-1/2"
    >
      <div className="p-3 sm:p-4 md:p-6 h-full">
        {fetching ? (
          <TableSkeleton className="col-span-full" compact rows={3} />
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 min-h-0 pb-4">
              <SupplierForm
                formData={formData}
                onChange={handleFormDataChange}
                fieldErrors={fieldErrors}
                mode="drawer"
                gstVerification={gstVerification}
              />
            </div>

            <div className="flex-shrink-0 bg-[rgb(var(--color-bg-primary))] border-t border-[rgb(var(--color-border-primary))] p-3 sm:p-4 -mx-3 sm:-mx-4 md:-mx-6 -mb-3 sm:-mb-4 md:-mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2 sm:gap-3">
              <Button
                variant="success"
                onClick={handleSave}
                disabled={loading}
                loading={loading}
                leftIcon={Save}
                className="w-full sm:w-auto"
                size="sm"
              >
                {t("suppliers.updateSupplier")}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto"
                size="sm"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </SideDrawer>
  );
}
