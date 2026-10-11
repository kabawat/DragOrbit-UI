"use client";
import { Building2, FileText, Receipt } from "lucide-react";
import { Button, Card, Input, Select, Textarea } from "@dragorbit/ui";
export function CreateBillSidebarPresentation({ model }) {
  const {
    t,
    formData,
    setShowAddSupplierDrawer,
    handleInputChange,
    suppliersLoading,
    suppliers,
    errors,
    purchaseOrdersLoading,
    purchaseOrders,
    handleSubmit,
    isCreating,
    isEditing,
    AddSupplierDrawer,
    showAddSupplierDrawer,
    handleAddSupplierSuccess,
  } = model;
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto ps-3 min-h-0">
          <div className="space-y-4">
            {/* Bill Details Card */}
            <Card>
              <div className="p-4 space-y-4">
                <h3 className="text-md font-semibold text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  {t("bills.billDetails")}
                </h3>
                <div>
                  <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    {t("bills.selectSupplierLabel")}
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
                    options={[
                      {
                        value: "",
                        label: suppliersLoading
                          ? t("errors.loading")
                          : t("errors.selectSupplier"),
                      },
                      ...suppliers
                        .filter(
                          (supplier) => supplier.name || supplier.supplierName,
                        )
                        .map((supplier) => ({
                          value: supplier.id || supplier._id,
                          label: supplier.name || supplier.supplierName,
                        })),
                      {
                        value: "add-new-supplier",
                        label: t("errors.addNewSupplier"),
                        isAddOption: true,
                      },
                    ]}
                    error={errors.supplier}
                    disabled={suppliersLoading}
                    leftIcon={Building2}
                    searchable={true}
                    size="md"
                    multiple={false}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    {t("bills.purchaseOrderOptional")}
                  </label>
                  <Select
                    value={formData.purchaseOrder}
                    onChange={(value) =>
                      handleInputChange("purchaseOrder", value)
                    }
                    options={[
                      {
                        value: "",
                        label: purchaseOrdersLoading
                          ? t("errors.loading")
                          : t("errors.selectPurchaseOrder"),
                      },
                      ...purchaseOrders
                        .filter((po) => po.poNumber || po.purchaseOrderNumber)
                        .map((po) => ({
                          value: String(po.id || po._id),
                          label:
                            po.poNumber ||
                            po.purchaseOrderNumber ||
                            `PO-${po.id || po._id}`,
                        })),
                      {
                        value: "add-new-purchase-order",
                        label: t("errors.addNewPurchaseOrder"),
                        isAddOption: true,
                      },
                    ]}
                    error={errors.purchaseOrder}
                    disabled={purchaseOrdersLoading}
                    searchable={true}
                    leftIcon={FileText}
                    size="md"
                    multiple={false}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    {t("bills.paymentDueDate")}
                  </label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(value) => handleInputChange("dueDate", value)}
                    error={errors.dueDate}
                  />
                </div>
              </div>
            </Card>

            {/* Settings & Notes Card */}
            <Card>
              <div className="p-4 space-y-4">
                <h3 className="text-md font-semibold text-[rgb(var(--color-text-primary))] flex items-center">
                  <Receipt className="w-4 h-4 mr-2" />
                  {t("bills.additionalInfo")}
                </h3>

                <div>
                  <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    {t("bills.notes")}
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(value) => handleInputChange("notes", value)}
                    placeholder={t("bills.addAdditionalNotes")}
                    rows={3}
                    maxLength={500}
                  />
                </div>

                <div className="border-t border-[rgb(var(--color-border-primary))] pt-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[rgb(var(--color-primary))] rounded"
                      checked={formData.goodsReceived}
                      onChange={(e) =>
                        handleInputChange("goodsReceived", e.target.checked)
                      }
                    />
                    <div>
                      <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                        {t("bills.stockInGoods")}
                      </span>
                      <p className="text-[0.625rem] text-[rgb(var(--color-text-secondary))] mt-1">
                        {t("bills.stockInGoodsDescription")}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </Card>

            {/* Actions Card */}
            <Card>
              <div className="p-4 space-y-3">
                <Button
                  onClick={() => handleSubmit()}
                  disabled={isCreating}
                  loading={isCreating}
                  className="w-full"
                  leftIcon={FileText}
                >
                  {isEditing ? t("bills.updateBill") : t("bills.createBill")}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Supplier Drawer */}
      <AddSupplierDrawer
        isOpen={showAddSupplierDrawer}
        onClose={() => setShowAddSupplierDrawer(false)}
        onSuccess={handleAddSupplierSuccess}
      />
    </>
  );
}
