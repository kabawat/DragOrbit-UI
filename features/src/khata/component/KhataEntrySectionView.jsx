"use client";
export function KhataEntrySectionPresentation({ model }) {
  const {
    KhataRecordTransaction,
    customerId,
    disabled,
    loading,
    error,
    recordYouGave,
    recordYouGot,
    clearError,
    autoFocusAmount,
    collectActions,
    hideHeader,
    variant,
  } = model;
  return (
    <KhataRecordTransaction
      customerId={customerId}
      disabled={disabled}
      loading={loading}
      error={error}
      onYouGave={recordYouGave}
      onYouGot={recordYouGot}
      onClearError={clearError}
      autoFocusAmount={autoFocusAmount}
      footer={collectActions}
      hideHeader={hideHeader}
      variant={variant}
    />
  );
}
