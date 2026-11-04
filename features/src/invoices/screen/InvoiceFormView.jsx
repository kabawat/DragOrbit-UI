"use client";
import { memo } from "react";
import { InvoiceTopHeader } from "../component/InvoiceTopHeader.jsx";
import { InvoiceItemsSection } from "../component/InvoiceItemsSection.jsx";
import { InvoiceSidebar } from "../component/InvoiceSidebar.jsx";
import { InvoiceStickyActionsBar } from "../component/InvoiceStickyActionsBar.jsx";
import { DiscardInvoiceModal } from "../component/DiscardInvoiceModal.jsx";

export const InvoiceFormView = ({
  t = (k) => k,
  formData,
  setFormData,
  products = [],
  availableProductIds,
  customers = [],
  customersLoading = false,
  invoiceLoading = false,
  isEditMode = false,
  isDraftSaved = false,
  isDirty = true,
  grandTotal = 0,
  storeId,
  // Navigation / Actions
  onBack,
  onCreateNew,
  onSubmit,
  onRelease,
  onCancel,
  // Customer & Discount Handlers
  onCustomerChange,
  onDiscountChange,
  onAddNewCustomer,
  // Scanner / Search
  lookupProductByCode,
  onProductResolved,
  fetchVariants,
  showError = () => {},
  // Discard Modal
  showDiscardModal = false,
  onCloseDiscardModal,
  onConfirmDiscard,
  onSaveDraft,
  isSavingDraft = false,
  // Modal / Drawer slots
  customerDrawer = null,
  paymentModal = null,
}) => {
  return (
    <div className="h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)] w-full max-w-full overflow-hidden flex flex-col box-border">
      {/* Scrollable Form Content (Top Header, Item Selection, Added Items, Sidebar) */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-5 custom-scrollbar">
        <div className="max-w-8xl mx-auto w-full flex flex-col min-w-0 pb-6">
          {/* Top Header Row (Back to Invoices, + Create New) */}
          <InvoiceTopHeader
            t={t}
            onBack={onBack}
            onCreateNew={onCreateNew}
            isEditMode={isEditMode}
          />

          {/* Two-Column Form Layout */}
          <div className="flex-1 w-full max-w-full min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full min-w-0">
              {/* Left Column: Items Section */}
              <div className="lg:col-span-2 flex flex-col min-h-0 w-full max-w-full min-w-0">
                <div className="flex-1 min-h-0 w-full max-w-full">
                  <form onSubmit={onSubmit} className="h-full">
                    <InvoiceItemsSection
                      t={t}
                      products={products}
                      availableProductIds={availableProductIds}
                      formData={formData}
                      setFormData={setFormData}
                      showError={showError}
                      lookupProductByCode={lookupProductByCode}
                      onProductResolved={onProductResolved}
                      fetchVariants={fetchVariants}
                      storeId={storeId}
                    />
                  </form>
                </div>
              </div>

              {/* Right Column: Sidebar */}
              <div className="lg:col-span-1 w-full max-w-full min-w-0">
                <InvoiceSidebar
                  t={t}
                  formData={formData}
                  handleCustomerChange={onCustomerChange}
                  handleDiscountChange={onDiscountChange}
                  customers={customers}
                  customersLoading={customersLoading}
                  invoiceLoading={invoiceLoading}
                  onAddNewCustomer={onAddNewCustomer}
                  isEditMode={isEditMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permanently Fixed Bottom Actions Bar - ALWAYS visible at bottom, never scrolls or moves */}
      <div className="shrink-0 w-full bg-[rgb(var(--color-bg-primary))] border-t border-[rgb(var(--color-border-primary))]/40 px-4 sm:px-6 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
        <div className="max-w-8xl mx-auto w-full">
          <InvoiceStickyActionsBar
            t={t}
            itemsCount={formData.items?.length || 0}
            grandTotal={grandTotal}
            onCancel={onCancel || onBack}
            onSubmit={onSubmit}
            onRelease={onRelease}
            loading={invoiceLoading}
            isEditMode={isEditMode}
            isDraftSaved={isDraftSaved}
            isDirty={isDirty}
          />
        </div>
      </div>

      {/* Discard Confirmation Modal */}
      <DiscardInvoiceModal
        isOpen={showDiscardModal}
        onClose={onCloseDiscardModal}
        onDiscard={onConfirmDiscard}
        onSaveDraft={onSaveDraft}
        isSaving={isSavingDraft}
        isEdit={isEditMode}
        t={t}
      />

      {/* Customer Drawer Slot */}
      {customerDrawer}

      {/* Payment Confirm Modal Slot */}
      {paymentModal}
    </div>
  );
};

export default memo(InvoiceFormView);
