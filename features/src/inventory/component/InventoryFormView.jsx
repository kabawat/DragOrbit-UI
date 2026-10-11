"use client";
export function InventoryFormPresentation({ model }) {
  const {
    className,
    InventoryDetailsSection,
    formData,
    handleFormDataChange,
    fieldErrors,
  } = model;
  return (
    <div className={`space-y-6 px-2 ${className}`}>
      <InventoryDetailsSection
        formData={formData}
        onChange={handleFormDataChange}
        errors={fieldErrors}
      />
    </div>
  );
}
