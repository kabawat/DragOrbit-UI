import { createElement, useContext } from "react";
import { PaperDocument } from "@dragorbit/ui";
import { ResponsiveInvoiceDocument } from "../../component/view/ResponsiveInvoiceDocument.jsx";
import { InvoicePrintSettingsContext, getDefaultPrintSettings } from "../InvoicePrintSettingsContext.jsx";
import { InvoiceAcknowledgement, InvoicePrintExtras } from "../InvoicePrintExtras.jsx";
import { placeInvoiceExtrasBeforeFooter } from "../placeInvoiceExtras.jsx";
import styles from "./style.module.scss";
import { addItemDetailsToTables, hideThankYouCopy } from "../InvoiceContainer.jsx";

export default function MiniInvoiceContainer({
  children,
  className = "",
  style = {},
  pageWidth = "80mm",
  includeExtras = true,
}) {
  const printContext = useContext(InvoicePrintSettingsContext);
  const fitPreview = Boolean(printContext?.fitPreview);
  const settings = printContext?.settings || getDefaultPrintSettings("thermal");
  const itemContent = settings.showDescription || settings.showMrp || settings.showTaxDetails || settings.showReceivedAmount || settings.showBalanceAmount || settings.showCustomerBalance || settings.showPaymentMode || settings.showAmountInWords
    ? addItemDetailsToTables(children, printContext?.invoiceData?.items || [], settings, { done: false, invoiceData: printContext?.invoiceData })
    : children;
  const configuredContent = includeExtras ? hideThankYouCopy(itemContent) : itemContent;
  const selectedPaperWidth = settings.paperSize || pageWidth;
  const sizeRule = `${selectedPaperWidth} auto`;
  const pageWidthPx = Number.parseFloat(selectedPaperWidth) * (96 / 25.4);
  const textSizes = { "very-small": "10px", small: "11px", medium: "12px", large: "14px", "extra-large": "16px" };
  const companyFontSizes = { "very-small": "11px", small: "12px", medium: "14px", large: "16px", "extra-large": "19px" };
  const extras = includeExtras ? createElement(InvoicePrintExtras) : null;
  const acknowledgement = includeExtras ? createElement(InvoiceAcknowledgement) : null;
  const invoiceContent = extras
    ? placeInvoiceExtrasBeforeFooter(configuredContent, extras, acknowledgement).children
    : configuredContent;

  return (
    <>
      <style>{`@media print { @page { size: ${sizeRule}; margin: 0 !important; } body, html { width: ${selectedPaperWidth} !important; min-width: ${selectedPaperWidth} !important; margin: 0 !important; padding: 0 !important; }
        .invoice-print-document[data-fit-preview="true"] { display: block !important; width: auto !important; height: auto !important; overflow: visible !important; }
        .invoice-print-document[data-fit-preview="true"] .invoice-responsive-viewport { display: block !important; height: auto !important; overflow: visible !important; } }
        .invoice-print-document #mini-invoice-container p, .invoice-print-document #mini-invoice-container td, .invoice-print-document #mini-invoice-container th, .invoice-print-document #mini-invoice-container small, .invoice-print-document #mini-invoice-container span { font-size: var(--invoice-text-size) !important; }
        .invoice-print-document #mini-invoice-container [data-invoice-item-description] { display: block !important; margin-top: 1mm !important; font-size: 8px !important; font-weight: 400 !important; line-height: 1.25 !important; white-space: normal !important; }
        .invoice-print-document #mini-invoice-container [data-invoice-item-mrp] { display: block !important; margin-top: 1mm !important; font-size: 8px !important; font-weight: 400 !important; line-height: 1.25 !important; }
        .invoice-print-document #mini-invoice-container [data-invoice-summary-row] td { background: transparent !important; background-color: transparent !important; box-shadow: none !important; }
        .invoice-print-document #mini-invoice-container [data-invoice-summary-row] td > span { width: 100%; margin-left: auto; }
        .invoice-print-document #mini-invoice-container [class*="storeName"], .invoice-print-document #mini-invoice-container [class*="companyName"] { font-size: var(--invoice-company-size) !important; }
        .invoice-print-document[data-show-header="false"] #mini-invoice-container [data-invoice-header] { display: none !important; }
        .invoice-print-document[data-show-logo="false"] #mini-invoice-container [data-invoice-logo] { display: none !important; }
        .invoice-print-document[data-show-total-values="false"] #mini-invoice-container table tfoot { display: none !important; }`}</style>
      <div
        className={`invoice-print-document ${fitPreview ? "flex h-full w-full items-center justify-center overflow-hidden" : ""}`}
        data-show-header={settings.showHeader}
        data-show-logo={settings.showLogo}
        data-show-total-values={settings.showTotalValues}
        data-paper-size={selectedPaperWidth}
        data-fit-preview={fitPreview}
        style={{
          "--invoice-text-size": textSizes[settings.textSize] || textSizes.medium,
          "--invoice-company-size": companyFontSizes[settings.companyNameSize] || companyFontSizes.medium,
        }}
      >
        {fitPreview ? (
          <ResponsiveInvoiceDocument pageWidth={pageWidthPx} fitHeight={fitPreview}>
            <PaperDocument
              id="mini-invoice-container"
              className={`${styles.miniInvoicePage} ${className}`}
              style={{ width: "100%", maxWidth: selectedPaperWidth, ...style }}
            >
              <div className={styles.miniContent}>{invoiceContent}</div>
            </PaperDocument>
          </ResponsiveInvoiceDocument>
        ) : (
          <PaperDocument
            id="mini-invoice-container"
            className={`${styles.miniInvoicePage} ${className}`}
            style={{ width: "100%", maxWidth: selectedPaperWidth, ...style }}
          >
            <div className={styles.miniContent}>{invoiceContent}</div>
          </PaperDocument>
        )}
      </div>
    </>
  );
}
