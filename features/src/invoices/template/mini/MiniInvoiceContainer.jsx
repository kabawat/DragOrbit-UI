import { createElement, useContext } from "react";
import { PaperDocument } from "@dragorbit/ui";
import { ResponsiveInvoiceDocument } from "../../component/view/ResponsiveInvoiceDocument.jsx";
import { InvoicePrintSettingsContext, getDefaultPrintSettings } from "../InvoicePrintSettingsContext.jsx";
import { InvoicePrintExtras } from "../InvoicePrintExtras.jsx";
import { placeInvoiceExtrasBeforeFooter } from "../placeInvoiceExtras.jsx";
import styles from "./style.module.scss";

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
  const selectedPaperWidth = settings.paperSize || pageWidth;
  const sizeRule = `${selectedPaperWidth} auto`;
  const pageWidthPx = Number.parseFloat(selectedPaperWidth) * (96 / 25.4);
  const textSizes = { "very-small": "10px", small: "11px", medium: "12px", large: "14px", "extra-large": "16px" };
  const companyFontSizes = { "very-small": "11px", small: "12px", medium: "14px", large: "16px", "extra-large": "19px" };
  const extras = includeExtras ? createElement(InvoicePrintExtras) : null;
  const invoiceContent = extras
    ? placeInvoiceExtrasBeforeFooter(children, extras).children
    : children;

  return (
    <>
      <style>{`@media print { @page { size: ${sizeRule}; margin: 0 !important; } body, html { width: ${selectedPaperWidth} !important; min-width: ${selectedPaperWidth} !important; margin: 0 !important; padding: 0 !important; }
        .invoice-print-document[data-fit-preview="true"] { display: block !important; width: auto !important; height: auto !important; overflow: visible !important; }
        .invoice-print-document[data-fit-preview="true"] .invoice-responsive-viewport { display: block !important; height: auto !important; overflow: visible !important; } }
        .invoice-print-document #mini-invoice-container p, .invoice-print-document #mini-invoice-container td, .invoice-print-document #mini-invoice-container th, .invoice-print-document #mini-invoice-container small, .invoice-print-document #mini-invoice-container span { font-size: var(--invoice-text-size) !important; }
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
        <ResponsiveInvoiceDocument pageWidth={pageWidthPx} fitHeight={fitPreview}>
          <PaperDocument
            id="mini-invoice-container"
            className={`${styles.miniInvoicePage} ${className}`}
            style={{ ...style, width: selectedPaperWidth, maxWidth: selectedPaperWidth }}
          >
            <div className={styles.miniContent}>{invoiceContent}</div>
          </PaperDocument>
        </ResponsiveInvoiceDocument>
      </div>
    </>
  );
}
