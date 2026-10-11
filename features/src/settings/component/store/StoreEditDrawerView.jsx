"use client";
import { Loader2, Save, Store } from "lucide-react";
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
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[rgb(var(--color-primary))]" />
            <span className="text-sm text-[rgb(var(--color-text-secondary))]">
              Loading store details...
            </span>
          </div>
        </div>
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
