"use client";

import { memo } from "react";
import InvoiceActionsView from "../component/view/InvoiceActionsView.jsx";
import InvoiceCustomerInfoView from "../component/view/InvoiceCustomerInfoView.jsx";
import InvoiceHeaderView from "../component/view/InvoiceHeaderView.jsx";
import InvoiceItemsTableView from "../component/view/InvoiceItemsTableView.jsx";
import InvoiceNotesView from "../component/view/InvoiceNotesView.jsx";

export function InvoiceDetailsScreen({
  invoiceData,
  itemsSummary,
  gstBreakdown,
  backAction,
  printableArea,
  modals,
  extraActions,
  onEditInvoice,
  onReleaseInvoice,
  onPrintInvoice,
  onDownloadPDF,
  onPrintAndSave,
  onCreateNewInvoice,
  onUpdatePaymentStatus,
  onCancelInvoice,
  onIssueCreditNote,
  formatCurrency,
  formatDate,
  formatDateTime,
  getStatusColor,
  getPaymentStatusColor,
  t,
}) {
  if (!invoiceData) return null;

  return (
    <div className="flex h-screen relative w-full overflow-hidden bg-[rgb(var(--color-bg-primary))]">
      <div className="h-screen w-full flex flex-col overflow-hidden">
        <div className="flex-1 p-4 sm:p-6 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Top Navigation Back Action */}
            {backAction && <div className="mb-4 sm:mb-6 shrink-0">{backAction}</div>}

            {/* Hidden Printable Area for window.print() and PDF generation */}
            {printableArea}

            {/* Main Responsive Grid Layout (matching Bill view) */}
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 flex-1 min-h-0"
              style={{ maxHeight: "calc(100vh - 170px)" }}
            >
              {/* Left Column (2 spans): Document Sheet & Line Items */}
              <div className="lg:col-span-2 flex flex-col overflow-y-auto pe-0 lg:pe-4 space-y-5 custom-scrollbar">
                {/* Document Main Card: Header + Customer Info */}
                <div className="bg-white dark:bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]/60 overflow-hidden">
                  <InvoiceHeaderView
                    invoiceData={invoiceData}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    getPaymentStatusColor={getPaymentStatusColor}
                  />
                  <div className="w-full">
                    <InvoiceCustomerInfoView
                      customer={invoiceData.customer}
                      invoiceData={invoiceData}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="w-full">
                  <InvoiceItemsTableView
                    items={invoiceData.items}
                    itemsSummary={itemsSummary}
                    gstBreakdown={gstBreakdown}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {/* Notes & Terms */}
                <InvoiceNotesView
                  notes={invoiceData.notes}
                  terms={invoiceData.termsAndConditions}
                  cancellationReason={invoiceData.cancellationReason}
                />
              </div>

              {/* Right Column (1 span): Actions & Financial Summary Sidebar */}
              <div className="lg:col-span-1 h-full overflow-y-auto px-1 custom-scrollbar">
                <InvoiceActionsView
                  invoiceData={invoiceData}
                  onEditInvoice={onEditInvoice}
                  onReleaseInvoice={onReleaseInvoice}
                  onPrintInvoice={onPrintInvoice}
                  onDownloadPDF={onDownloadPDF}
                  onPrintAndSave={onPrintAndSave}
                  onCreateNewInvoice={onCreateNewInvoice}
                  onUpdatePaymentStatus={onUpdatePaymentStatus}
                  onCancelInvoice={onCancelInvoice}
                  onIssueCreditNote={onIssueCreditNote}
                  extraActions={extraActions}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  formatDateTime={formatDateTime}
                  t={t}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals Slot */}
      {modals}
    </div>
  );
}

export default memo(InvoiceDetailsScreen);
