"use client";
import { memo } from "react";
import { Building2, Calculator, FileText, Receipt } from "lucide-react";
import { Button, Card, Input, Select, Textarea } from "@dragorbit/ui";
import { calculateBillSummary } from "../utils/billUtils.js";

export const BillSidebar = (props) => {
  const model = props.model || props;
  const {
    t = (k) => k,
    formData = { items: [] },
    setShowAddSupplierDrawer = () => {},
    handleInputChange = () => {},
    suppliersLoading = false,
    suppliers = [],
    errors = {},
    purchaseOrdersLoading = false,
    purchaseOrders = [],
    handleSubmit = () => {},
    isCreating = false,
    isEditing = false,
    AddSupplierDrawer = null,
    showAddSupplierDrawer = false,
    handleAddSupplierSuccess = () => {},
    showSubmitButton = false,
  } = model;

  const summary = calculateBillSummary(formData.items);

  const supplierOptions = [
    {
      value: "",
      label: suppliersLoading
        ? t("errors.loading") || "Loading suppliers..."
        : t("errors.selectSupplier") || "Select Supplier",
    },
    ...suppliers
      .filter((s) => s && (s.name || s.supplierName))
      .map((supplier) => ({
        value: supplier.id || supplier._id,
        label: supplier.name || supplier.supplierName,
      })),
    {
      value: "add-new-supplier",
      label: `+ ${t("errors.addNewSupplier") || "Add New Supplier"}`,
      isAddOption: true,
    },
  ];

  const poOptions = [
    {
      value: "",
      label: purchaseOrdersLoading
        ? t("errors.loading") || "Loading purchase orders..."
        : t("errors.selectPurchaseOrder") || "Select Purchase Order (Optional)",
    },
    ...purchaseOrders
      .filter((po) => po && (po.poNumber || po.purchaseOrderNumber || po.id || po._id))
      .map((po) => ({
        value: String(po.id || po._id),
        label:
          po.poNumber ||
          po.purchaseOrderNumber ||
          `PO-${po.id || po._id}`,
      })),
    {
      value: "add-new-purchase-order",
      label: `+ ${t("errors.addNewPurchaseOrder") || "Add New Purchase Order"}`,
      isAddOption: true,
    },
  ];

  return (
    <>
      <div className="flex flex-col h-full space-y-4">
        {/* Bill Details Card */}
        <Card>
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-[rgb(var(--color-primary))]" />
              {t("bills.billDetails") || "Bill Details"}
            </h3>

            {/* Supplier Select */}
            <div>
              <label className="block text-xs font-semibold text-[rgb(var(--color-text-primary))] mb-1.5">
                {t("bills.selectSupplierLabel") || "Supplier"} *
              </label>
              <Select
                value={formData.supplier}
                onChange={(value) => {
                  if (value === "add-new-supplier") {
                    setShowAddSupplierDrawer(true);
                    return;
                  }
                  handleInputChange("supplier", value);
                }}
                options={supplierOptions}
                error={errors.supplier}
                disabled={suppliersLoading}
                leftIcon={Building2}
                searchable={true}
                size="md"
                multiple={false}
                placeholder={t("bills.selectSupplierLabel") || "Select Supplier"}
              />
            </div>

            {/* Purchase Order Select */}
            <div>
              <label className="block text-xs font-semibold text-[rgb(var(--color-text-primary))] mb-1.5">
                {t("bills.purchaseOrderOptional") || "Purchase Order (Optional)"}
              </label>
              <Select
                value={formData.purchaseOrder}
                onChange={(value) => {
                  if (value === "add-new-purchase-order") {
                    handleInputChange("purchaseOrder", "add-new-purchase-order");
                    return;
                  }
                  handleInputChange("purchaseOrder", value);
                }}
                options={poOptions}
                error={errors.purchaseOrder}
                disabled={purchaseOrdersLoading}
                searchable={true}
                leftIcon={FileText}
                size="md"
                multiple={false}
                placeholder={t("bills.purchaseOrderOptional") || "Select Purchase Order"}
              />
            </div>

            {/* Payment Due Date */}
            <div>
              <label className="block text-xs font-semibold text-[rgb(var(--color-text-primary))] mb-1.5">
                {t("bills.paymentDueDate") || "Payment Due Date"}
              </label>
              <Input
                type="date"
                value={formData.dueDate || ""}
                onChange={(value) => handleInputChange("dueDate", value)}
                error={errors.dueDate}
                size="md"
              />
            </div>
          </div>
        </Card>

        {/* Bill Summary Card */}
        <Card>
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] flex items-center">
              <Calculator className="w-4 h-4 mr-2 text-[rgb(var(--color-primary))]" />
              {t("bills.summary") || "Bill Summary"}
            </h3>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between text-[rgb(var(--color-text-secondary))]">
                <span>{t("common.items") || "Total Items"}</span>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                  {summary.itemsCount}
                </span>
              </div>
              <div className="flex justify-between text-[rgb(var(--color-text-secondary))]">
                <span>{t("bills.totalUnits") || "Total Units"}</span>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                  {summary.totalUnits}
                </span>
              </div>
              <div className="border-t border-[rgb(var(--color-border-primary))]/30 pt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                  {t("common.total") || "Grand Total"}
                </span>
                <span className="text-base font-bold text-[rgb(var(--color-primary))]">
                  ₹{summary.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Info & Inventory Settings */}
        <Card>
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] flex items-center">
              <Receipt className="w-4 h-4 mr-2 text-[rgb(var(--color-primary))]" />
              {t("bills.additionalInfo") || "Additional Details"}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[rgb(var(--color-text-primary))] mb-1.5">
                {t("bills.notes") || "Notes / Remarks"}
              </label>
              <Textarea
                value={formData.notes || ""}
                onChange={(value) => handleInputChange("notes", value)}
                placeholder={
                  t("bills.addAdditionalNotes") || "Add any specific instructions or notes..."
                }
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="border-t border-[rgb(var(--color-border-primary))]/30 pt-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 accent-[rgb(var(--color-primary))] rounded cursor-pointer"
                  checked={formData.goodsReceived !== false}
                  onChange={(e) =>
                    handleInputChange("goodsReceived", e.target.checked)
                  }
                />
                <div>
                  <span className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                    {t("bills.stockInGoods") || "Stock In Goods Immediately"}
                  </span>
                  <p className="text-[11px] text-[rgb(var(--color-text-secondary))] mt-0.5">
                    {t("bills.stockInGoodsDescription") ||
                      "Automatically increment product inventory stock upon bill confirmation."}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </Card>

        {/* Optional Action Button */}
        {showSubmitButton && (
          <Card>
            <div className="p-4">
              <Button
                onClick={() => handleSubmit()}
                disabled={isCreating || formData.items.length === 0}
                loading={isCreating}
                className="w-full justify-center"
                leftIcon={FileText}
              >
                {isEditing
                  ? t("bills.updateBill") || "Update Bill"
                  : t("bills.createBill") || "Create Bill"}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add Supplier Drawer Slot */}
      {AddSupplierDrawer && (
        <AddSupplierDrawer
          isOpen={showAddSupplierDrawer}
          onClose={() => setShowAddSupplierDrawer(false)}
          onSuccess={handleAddSupplierSuccess}
        />
      )}
    </>
  );
};

export default memo(BillSidebar);
