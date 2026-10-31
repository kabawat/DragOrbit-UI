"use client";
import { memo } from "react";
import { BillTopHeader } from "../component/create/BillTopHeader.jsx";
import { CreateBillItemsSectionPresentation } from "../component/create/BillItemsSectionView.jsx";
import { CreateBillSidebarPresentation } from "../component/create/BillSidebarView.jsx";
import { BillStickyActionsBar } from "../component/create/BillStickyActionsBar.jsx";
import { calculateBillSummary } from "../utils/billUtils.js";

export const BillFormView = ({
  t = (k) => k,
  formData = { items: [] },
  setFormData = () => {},
  errors = {},
  setErrors = () => {},
  // Products
  products = [],
  productsLoading = false,
  selectedProduct = "",
  setSelectedProduct = () => {},
  selectedQuantity = 1,
  setSelectedQuantity = () => {},
  selectedPrice = 0,
  setSelectedPrice = () => {},
  handleAddItem = () => {},
  handleRemoveItem = () => {},
  handleUpdateItem = () => {},
  // Sidebar & Suppliers
  suppliers = [],
  suppliersLoading = false,
  purchaseOrders = [],
  purchaseOrdersLoading = false,
  handleInputChange = () => {},
  // State / Mode
  isSubmitting = false,
  isEditMode = false,
  // Navigation / Actions
  onBack = () => {},
  onCreateNew = null,
  onSubmit = () => {},
  onCancel = null,
  // Slots
  supplierDrawer = null,
}) => {
  const summary = calculateBillSummary(formData.items);

  const itemsModel = {
    t,
    formData,
    setFormData,
    errors,
    setErrors,
    products,
    productsLoading,
    selectedProduct,
    setSelectedProduct,
    selectedQuantity,
    setSelectedQuantity,
    selectedPrice,
    setSelectedPrice,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
  };

  const sidebarModel = {
    t,
    formData,
    errors,
    handleInputChange,
    suppliers,
    suppliersLoading,
    purchaseOrders,
    purchaseOrdersLoading,
    isCreating: isSubmitting,
    isEditing: isEditMode,
    handleSubmit: onSubmit,
    showSubmitButton: false, // Managed by sticky bottom bar
  };

  return (
    <div className="h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)] w-full max-w-full overflow-hidden flex flex-col box-border">
      {/* Scrollable Form Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-5 custom-scrollbar">
        <div className="max-w-8xl mx-auto w-full flex flex-col min-w-0 pb-6">
          {/* Top Header Row (Back to Bills, + Create New) */}
          <BillTopHeader
            t={t}
            onBack={onBack}
            onCreateNew={onCreateNew}
            isEditMode={isEditMode}
            showCreateNew={isEditMode && Boolean(onCreateNew)}
          />

          {/* Two-Column Form Layout */}
          <div className="flex-1 w-full max-w-full min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full min-w-0">
              {/* Left Column: Items Section */}
              <div className="lg:col-span-2 flex flex-col min-h-0 w-full max-w-full min-w-0">
                <div className="flex-1 min-h-0 w-full max-w-full">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSubmit();
                    }}
                    className="h-full"
                  >
                    <CreateBillItemsSectionPresentation model={itemsModel} />
                  </form>
                </div>
              </div>

              {/* Right Column: Sidebar */}
              <div className="lg:col-span-1 w-full max-w-full min-w-0">
                <CreateBillSidebarPresentation model={sidebarModel} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permanently Fixed Bottom Actions Bar - ALWAYS visible at bottom, never moves on scroll */}
      <div className="shrink-0 w-full bg-[rgb(var(--color-bg-primary))] border-t border-[rgb(var(--color-border-primary))]/40 px-4 sm:px-6 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
        <div className="max-w-8xl mx-auto w-full">
          <BillStickyActionsBar
            t={t}
            itemsCount={summary.itemsCount}
            totalUnits={summary.totalUnits}
            grandTotal={summary.grandTotal}
            onCancel={onCancel || onBack}
            onSubmit={onSubmit}
            loading={isSubmitting}
            isEditMode={isEditMode}
            disabled={!formData.supplier || summary.itemsCount === 0}
          />
        </div>
      </div>

      {/* Supplier Drawer Slot */}
      {supplierDrawer}
    </div>
  );
};

export default memo(BillFormView);
