"use client";
import { FileText } from "lucide-react";
import { Badge } from "@dragorbit/ui";
export function ViewInvoiceSummaryCardPresentation({ model }) {
  const {
    invoiceData,
    getStatusColor,
    getPaymentStatusColor,
    t,
    calculatedSubtotal,
    calculatedGstAmount,
  } = model;
  return (
    <div className="bg-[rgb(var(--color-bg-primary))] rounded-lg border border-[rgb(var(--color-border-primary))] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[rgb(var(--color-primary))]/10 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
              {invoiceData.invoiceNumber}
            </h3>
            <div className="flex space-x-1">
              <Badge
                size="xs"
                className={`${getStatusColor(invoiceData?.invoiceStatus)} text-[0.625rem] px-2 py-0`}
              >
                {invoiceData?.invoiceStatus}
              </Badge>
              <Badge
                size="xs"
                className={`${getPaymentStatusColor(invoiceData.paymentStatus)} text-[0.625rem] px-2 py-0`}
              >
                {invoiceData.paymentStatus}
              </Badge>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-[rgb(var(--color-primary))]">
            ₹{invoiceData.totalAmount?.toLocaleString()}
          </div>
          <div className="text-xs text-[rgb(var(--color-text-secondary))]">
            {t("common.total")}
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-[rgb(var(--color-border-primary))]">
        <div className="flex justify-between text-sm">
          <span className="text-[rgb(var(--color-text-secondary))]">
            {t("invoices.customer")}:
          </span>
          <span className="font-medium text-[rgb(var(--color-text-primary))] truncate max-w-24">
            {invoiceData.customer?.name || t("invoices.walkInCustomer")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[rgb(var(--color-text-secondary))]">
            {t("invoices.subtotal")}:
          </span>
          <span className="font-medium text-[rgb(var(--color-text-primary))]">
            ₹{calculatedSubtotal?.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col text-sm">
          <div className="flex justify-between">
            <span className="text-[rgb(var(--color-text-secondary))]">
              {t("invoices.gst")}:
            </span>
            <span className="font-medium text-[rgb(var(--color-text-primary))]">
              ₹{calculatedGstAmount?.toLocaleString() || "0"}
            </span>
          </div>
          {/* Detailed GST Breakdown */}
          {invoiceData.gst?.breakdown && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-[rgb(var(--color-border-primary))] pl-3 opacity-80">
              {invoiceData.gst.breakdown.cgst > 0 && (
                <div className="flex justify-between text-[0.6875rem]">
                  <span className="text-[rgb(var(--color-text-secondary))]">
                    CGST:
                  </span>
                  <span className="text-[rgb(var(--color-text-primary))]">
                    ₹{invoiceData.gst.breakdown.cgst.toLocaleString()}
                  </span>
                </div>
              )}
              {invoiceData.gst.breakdown.sgst > 0 && (
                <div className="flex justify-between text-[0.6875rem]">
                  <span className="text-[rgb(var(--color-text-secondary))]">
                    SGST:
                  </span>
                  <span className="text-[rgb(var(--color-text-primary))]">
                    ₹{invoiceData.gst.breakdown.sgst.toLocaleString()}
                  </span>
                </div>
              )}
              {invoiceData.gst.breakdown.igst > 0 && (
                <div className="flex justify-between text-[0.6875rem]">
                  <span className="text-[rgb(var(--color-text-secondary))]">
                    IGST:
                  </span>
                  <span className="text-[rgb(var(--color-text-primary))]">
                    ₹{invoiceData.gst.breakdown.igst.toLocaleString()}
                  </span>
                </div>
              )}
              {invoiceData.gst.breakdown.utgst > 0 && (
                <div className="flex justify-between text-[0.6875rem]">
                  <span className="text-[rgb(var(--color-text-secondary))]">
                    UTGST:
                  </span>
                  <span className="text-[rgb(var(--color-text-primary))]">
                    ₹{invoiceData.gst.breakdown.utgst.toLocaleString()}
                  </span>
                </div>
              )}
              {invoiceData.gst.breakdown.cess > 0 && (
                <div className="flex justify-between text-[0.6875rem]">
                  <span className="text-[rgb(var(--color-text-secondary))]">
                    Cess:
                  </span>
                  <span className="text-[rgb(var(--color-text-primary))]">
                    ₹{invoiceData.gst.breakdown.cess.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {invoiceData.totalDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[rgb(var(--color-text-secondary))]">
              {t("invoices.discount")}:
            </span>
            <span className="font-medium text-[rgb(var(--color-danger))]">
              -₹{invoiceData.totalDiscount?.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-[rgb(var(--color-text-secondary))]">
            {t("invoices.items")}:
          </span>
          <span className="font-medium text-[rgb(var(--color-text-primary))]">
            {invoiceData.items?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
