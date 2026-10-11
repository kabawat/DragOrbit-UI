"use client";
import { Plus, Save } from "lucide-react";
export function StoreAddDrawerView({ model }) {
  const {
    FormDrawer,
    isOpen,
    handleCancel,
    handleSave,
    isCreating,
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
      title="Add New Store"
      icon={Plus}
      description="Create a new store for your agency"
      width="w-full md:w-2/3 lg:w-1/2"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel={isCreating ? "Creating..." : "Create Store"}
      cancelLabel="Cancel"
      isSaving={isCreating}
      saveIcon={Save}
      saveVariant="primary"
    >
      <StoreEditForm
        form={form}
        onChange={handleChange}
        errors={errors}
        isVerifyingGst={isVerifyingGst}
        isGstVerified={isGstVerified}
        onVerifyGst={handleVerifyGst}
      />
    </FormDrawer>
  );
}
