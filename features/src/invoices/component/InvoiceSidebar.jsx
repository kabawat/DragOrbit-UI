"use client";
import { memo } from "react";
import {
  Calculator,
  Plus,
  Receipt,
  Save,
  Tag,
  UserPlus,
  Users,
} from "lucide-react";
import { Button, Card, Input, Select } from "@dragorbit/ui";
import { calculateInvoiceGST } from "../utils/invoiceCalculations.utils.js";

const fmt = (v) => Number(v || 0).toFixed(2);

export const InvoiceSidebar = ({
  t = (k) => k,
  formData,
  handleCustomerChange,
  handleDiscountChange,
  customers = [],
  customersLoading = false,
  invoiceLoading = false,
  handleSubmit,
  onCancel,
  onAddNewCustomer,
  isEditMode = false,
  supplierHasGst = true,
  showActions = false,
}) => {
  const mappedItems = (formData.items || []).map((item) => ({
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 1,
    gstRate: Number(item.gstRate || item.gst?.rate) || 0,
    isInclusive:
      item.isInclusive !== undefined
        ? item.isInclusive
        : (item.gst?.isInclusive ?? false),
  }));

  const gstSummary = calculateInvoiceGST({
    items: mappedItems,
    totalDiscount: Number(formData.totalDiscount) || 0,
    discountMode: formData.discountMode || "POST_TOTAL",
    supplierHasGst,
  });

  const totalQuantity = (formData.items || []).reduce(
    (sum, item) => sum + (parseInt(item.quantity, 10) || 0),
    0
  );

  const hasAnyGST =
    gstSummary.gst.total > 0 ||
    (formData.items || []).some(
      (item) => Number(item.gstRate || item.gst?.rate) > 0
    );

  const onCustomerSelect = (val) => {
    if (val === "add-new-customer") {
      onAddNewCustomer?.();
    } else {
      handleCustomerChange?.(val);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Customer Selection Card ── */}
      <Card
        padding="none"
        className="!border-[rgb(var(--color-border-primary))]/30 overflow-hidden"
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] flex items-center gap-2">
              <Users className="w-4 h-4 text-[rgb(var(--color-primary))]" />
              {t("invoice.customerDetails") || "Customer Details"}
            </h4>
            {onAddNewCustomer && (
              <button
                type="button"
                onClick={onAddNewCustomer}
                className="inline-flex items-center gap-1 text-xs font-medium text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t("invoice.addNew") || "Add New"}</span>
              </button>
            )}
          </div>

          <Select
            size="sm"
            searchable={true}
            value={formData.customer || ""}
            onChange={onCustomerSelect}
            options={customers}
            placeholder={t("invoice.selectCustomer") || "Select Customer"}
            loading={customersLoading}
            leftIcon={Users}
          />
        </div>
      </Card>

      {/* ── Invoice Summary Card ── */}
      <Card
        padding="none"
        className="!border-[rgb(var(--color-border-primary))]/30 overflow-hidden"
      >
        <div className="p-4 space-y-4">
          <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] flex items-center gap-2 pb-2 border-b border-[rgb(var(--color-border-primary))]/20">
            <Receipt className="w-4 h-4 text-[rgb(var(--color-primary))]" />
            {t("invoice.invoiceSummary") || "Invoice Summary"}
          </h4>

          {/* Total Discount Input */}
          <div>
            <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
              {t("invoice.totalDiscount") || "Total Discount"} (₹)
              <span className="text-[rgb(var(--color-text-secondary))]/60 font-normal ml-1">
                ({t("common.optional") || "optional"})
              </span>
            </label>
            <Input
              type="number"
              value={formData.totalDiscount || ""}
              onChange={(val) => {
                const num = val === "" ? 0 : parseFloat(val);
                handleDiscountChange?.(isNaN(num) ? 0 : num);
              }}
              min="0"
              step="0.01"
              leftIcon={Calculator}
              size="sm"
              placeholder={t("invoice.enterDiscount") || "0.00"}
            />
          </div>

          {/* Breakdown Items */}
          <div className="space-y-2.5 text-sm">
            {gstSummary.originalTotal > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[rgb(var(--color-text-secondary))]">
                  {t("invoice.grossTotal") || "Gross Total"}:
                </span>
                <span className="font-medium text-[rgb(var(--color-text-primary))]">
                  ₹{fmt(gstSummary.originalTotal)}
                </span>
              </div>
            )}

            {Number(formData.totalDiscount) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[rgb(var(--color-text-secondary))] flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-green-500" />
                  {t("invoice.discount") || "Discount"}:
                </span>
                <span className="font-semibold text-green-500">
                  - ₹{fmt(formData.totalDiscount)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-[rgb(var(--color-text-secondary))]">
                {t("invoice.netTaxable") || "Net Taxable"}:
              </span>
              <span className="font-medium text-[rgb(var(--color-text-primary))]">
                ₹{fmt(gstSummary.subtotal)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[rgb(var(--color-text-secondary))]">
                {t("invoice.totalQuantity") || "Total Quantity"}:
              </span>
              <span className="font-medium text-[rgb(var(--color-text-primary))]">
                {totalQuantity}
              </span>
            </div>

            {hasAnyGST && (
              <div className="flex justify-between items-center">
                <span className="text-[rgb(var(--color-text-secondary))]">
                  {t("invoice.totalGST") || "Total GST"}:
                </span>
                <span className="font-medium text-[rgb(var(--color-text-primary))]">
                  ₹{fmt(gstSummary.gst.total)}
                </span>
              </div>
            )}

            {/* Grand Total */}
            <div className="border-t border-[rgb(var(--color-border-primary))]/30 pt-3 mt-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[rgb(var(--color-text-primary))] font-semibold text-base">
                  {t("invoice.total") || "Total Amount"}:
                </span>
                <span className="font-bold text-xl sm:text-2xl text-[rgb(var(--color-primary))]">
                  ₹{fmt(gstSummary.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Optional inline action buttons */}
          {showActions && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                className="w-full flex-1 justify-center"
                onClick={handleSubmit}
                loading={invoiceLoading}
                leftIcon={isEditMode ? Save : Plus}
                disabled={formData.items.length === 0}
              >
                {isEditMode
                  ? t("invoice.updateInvoice") || "Update Invoice"
                  : t("invoice.createInvoiceButton") || "Create Invoice"}
              </Button>

              <Button
                variant="outline"
                className="w-full flex-1 justify-center"
                onClick={onCancel}
                disabled={invoiceLoading}
              >
                {t("common.cancel") || "Cancel"}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default memo(InvoiceSidebar);
