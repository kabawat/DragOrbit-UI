"use client";
export function CustomerFormPresentation({ model }) {
  const {
    BasicInfo,
    formData,
    handleInputChange,
    fieldErrors,
    t,
    CompanyDetails,
    gstVerification,
    AddressSection,
  } = model;
  return (
    <div className="space-y-4 sm:space-y-6">
      <BasicInfo
        formData={formData}
        onChange={handleInputChange}
        fieldErrors={fieldErrors}
        t={t}
      />

      <CompanyDetails
        formData={formData}
        onChange={handleInputChange}
        fieldErrors={fieldErrors}
        gstVerification={gstVerification}
        t={t}
      />

      <AddressSection
        formData={formData}
        onChange={handleInputChange}
        fieldErrors={fieldErrors}
        t={t}
      />
    </div>
  );
}
