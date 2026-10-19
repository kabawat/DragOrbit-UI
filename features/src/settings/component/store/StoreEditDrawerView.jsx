"use client";
import { TableSkeleton } from "@dragorbit/ui";
import { Save, Store } from "lucide-react";
export function StoreEditDrawerView({ model }) {
  const {
    FormDrawer,
    isOpen,
    handleCancel,
    handleSave,
    isSaving,
    isLoadingStore,
    StoreEditForm,
    form,
    handleChange,
    errors,
    isVerifyingGst,
    isGstVerified,
    handleVerifyGst,
  } = model;
  return (
    <FormDrawer
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Store"
      icon={Store}
      description="Update store information"
      width="w-full md:w-2/3 lg:w-1/2"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel={isSaving ? "Saving..." : "Save Changes"}
      cancelLabel="Cancel"
      isSaving={isSaving}
      isLoading={isLoadingStore}
      saveIcon={Save}
      saveVariant="primary"
    >
      {isLoadingStore ? (
        <TableSkeleton className="col-span-full" compact rows={3} />
      ) : (
        <StoreEditForm
          form={form}
          onChange={handleChange}
          errors={errors}
          isVerifyingGst={isVerifyingGst}
          isGstVerified={isGstVerified}
          onVerifyGst={handleVerifyGst}
        />
      )}
    </FormDrawer>
  );
}
