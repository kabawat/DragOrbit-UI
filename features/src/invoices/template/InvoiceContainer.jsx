import { createElement, useContext } from "react";
import { PaperDocument } from "@dragorbit/ui";
import { ResponsiveInvoiceDocument } from "../component/view/ResponsiveInvoiceDocument.jsx";
import { InvoicePrintSettingsContext, getDefaultPrintSettings } from "./InvoicePrintSettingsContext.jsx";
import { InvoicePrintExtras } from "./InvoicePrintExtras.jsx";
import { placeInvoiceExtrasBeforeFooter } from "./placeInvoiceExtras.jsx";
import styles from "./style.module.scss";

const InvoiceContainer = ({ children, className = "", style = {}, includeSignature = true, includeExtras = true, includeSummaryFields = true, includeItemDescriptions = true, includeTerms = true }) => {
	const printContext = useContext(InvoicePrintSettingsContext);
	const fitPreview = Boolean(printContext?.fitPreview);
	const settings = printContext?.settings || getDefaultPrintSettings("regular");
	const isA5 = settings.paperSize === "A5";
	const paperWidth = isA5 ? "148mm" : "210mm";
	const paperHeight = isA5 ? "210mm" : "297mm";
	const pageWidth = isA5 ? 559 : 794;
	const fontSizes = { "very-small": "10px", small: "12px", medium: "14px", large: "17px", "extra-large": "20px" };
	const companyFontSizes = { "very-small": "12px", small: "14px", medium: "17px", large: "21px", "extra-large": "25px" };
	const primaryColor = settings.primaryColor || "#2563eb";
	const luminance = (Number.parseInt(primaryColor.slice(1, 3), 16) * 299 + Number.parseInt(primaryColor.slice(3, 5), 16) * 587 + Number.parseInt(primaryColor.slice(5, 7), 16) * 114) / 1000;
	const primaryText = luminance >= 150 ? "#111827" : "#ffffff";
	const documentStyle = {
		...style,
		width: paperWidth,
		minHeight: paperHeight,
		"--invoice-primary-color": primaryColor,
		"--invoice-primary-text": primaryText,
		"--invoice-text-size": fontSizes[settings.textSize] || fontSizes.medium,
		"--invoice-company-size": companyFontSizes[settings.companyNameSize] || companyFontSizes.medium,
	};
	const extras = includeExtras
		? createElement(InvoicePrintExtras, { includeSignature, includeSummaryFields, includeItemDescriptions, includeTerms })
		: null;
	const invoiceContent = extras
		? placeInvoiceExtrasBeforeFooter(children, extras).children
		: children;

	return (
		<>
			<style>{`
        @media print {
          @page {
            size: ${settings.paperSize || "A4"} portrait;
            margin: 0 !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
				.invoice-print-document #invoice-container table thead th,
				.invoice-print-document #invoice-container table thead td,
				.invoice-print-document #invoice-container [class*="header"] {
					background: var(--invoice-primary-color) !important;
					color: var(--invoice-primary-text) !important;
					border-color: var(--invoice-primary-color) !important;
				}
				.invoice-print-document #invoice-container [class*="header"] * {
					color: var(--invoice-primary-text) !important;
				}
				.invoice-print-document #invoice-container [class*="accent"],
				.invoice-print-document #invoice-container [class*="brand"],
				.invoice-print-document #invoice-container [class*="highlight"],
				.invoice-print-document #invoice-container [class*="label"],
				.invoice-print-document #invoice-container [class*="title"],
				.invoice-print-document #invoice-container [class*="valueBold"],
				.invoice-print-document #invoice-container [class*="storeName"],
				.invoice-print-document #invoice-container [class*="companyName"],
				.invoice-print-document #invoice-container [class*="invoiceNumber"],
				.invoice-print-document #invoice-container [class*="invoiceNo"],
				.invoice-print-document #invoice-container [class*="totalLabel"],
				.invoice-print-document #invoice-container [class*="totalValue"] {
					color: var(--invoice-primary-color) !important;
				}
				.invoice-print-document #invoice-container [class*="section"],
				.invoice-print-document #invoice-container [class*="table"] {
					border-color: var(--invoice-primary-border) !important;
				}
				.invoice-print-document #invoice-container [class*="finalRow"],
				.invoice-print-document #invoice-container [class*="finalTotal"],
				.invoice-print-document #invoice-container [class*="totalRow"],
				.invoice-print-document #invoice-container [class*="tableFooter"],
				.invoice-print-document #invoice-container [class*="summary"] {
					background-color: var(--invoice-primary-tint) !important;
					border-color: var(--invoice-primary-color) !important;
				}
				.invoice-print-document #invoice-container [class*="final"] *,
				.invoice-print-document #invoice-container [class*="totalRow"] *,
				.invoice-print-document #invoice-container [class*="tableFooter"] *,
				.invoice-print-document #invoice-container [class*="summary"] * {
					color: var(--invoice-primary-color) !important;
				}
				.invoice-print-document #invoice-container [class*="storeName"],
				.invoice-print-document #invoice-container [class*="companyName"] {
					font-size: var(--invoice-company-size) !important;
				}
				.invoice-print-document #invoice-container p,
				.invoice-print-document #invoice-container td,
				.invoice-print-document #invoice-container th,
				.invoice-print-document #invoice-container li,
				.invoice-print-document #invoice-container small,
				.invoice-print-document #invoice-container span {
					font-size: var(--invoice-text-size) !important;
				}
				.invoice-print-document #invoice-container[class*="aeroDocument"] p,
				.invoice-print-document #invoice-container[class*="aeroDocument"] td,
				.invoice-print-document #invoice-container[class*="aeroDocument"] th,
				.invoice-print-document #invoice-container[class*="aeroDocument"] li,
				.invoice-print-document #invoice-container[class*="aeroDocument"] span {
					font-size: min(var(--invoice-text-size), 18px) !important;
				}
				.invoice-print-document #invoice-container[class*="aeroDocument"] [class*="merchantName"] { font-size: min(var(--invoice-company-size), 18px) !important; }
				.invoice-print-document #invoice-container[class*="aeroDocument"] [class*="invoiceTitle"] { font-size: 14px !important; }
				.invoice-print-document #invoice-container[class*="aeroDocument"] [class*="itemDescription"] { display: block !important; margin-top: 2px !important; color: #64748b !important; font-size: 9px !important; font-weight: 400 !important; line-height: 1.25 !important; }
				.invoice-print-document #invoice-container[class*="aeroDocument"] [class*="totalsBox"],
				.invoice-print-document #invoice-container[class*="aeroDocument"] [class*="totalRow"],
				.invoice-print-document #invoice-container[class*="aeroDocument"] [class*="grandTotal"] {
					background: transparent !important;
					background-color: transparent !important;
					box-shadow: none !important;
				}
				.invoice-print-document #invoice-container [data-invoice-plain-bg] {
					background: transparent !important;
					background-color: transparent !important;
					box-shadow: none !important;
				}
				.invoice-print-document[data-show-header="false"] #invoice-container [data-invoice-header] { display: none !important; }
				.invoice-print-document[data-show-logo="false"] #invoice-container [data-invoice-logo] { display: none !important; }
				.invoice-print-document[data-show-total-values="false"] #invoice-container table tfoot { display: none !important; }
				.invoice-print-document[data-paper-size="A5"] #invoice-container { width: 148mm !important; min-height: 210mm !important; }
				@media print {
					.invoice-print-document[data-fit-preview="true"] { display: block !important; width: auto !important; height: auto !important; overflow: visible !important; }
					.invoice-print-document[data-fit-preview="true"] .invoice-responsive-viewport { display: block !important; height: auto !important; overflow: visible !important; }
				}
      `}</style>
			<div
				className={`invoice-print-document ${fitPreview ? "flex h-full w-full items-center justify-center overflow-hidden" : ""}`}
				data-show-header={settings.showHeader}
				data-show-logo={settings.showLogo}
				data-show-total-values={settings.showTotalValues}
				data-paper-size={settings.paperSize}
				data-fit-preview={fitPreview}
				style={{
					"--invoice-primary-color": primaryColor,
					"--invoice-primary-text": primaryText,
					"--invoice-primary-tint": `color-mix(in srgb, ${primaryColor} 10%, white)`,
					"--invoice-primary-border": `color-mix(in srgb, ${primaryColor} 45%, white)`,
				}}
			>
					<ResponsiveInvoiceDocument pageWidth={pageWidth} fitHeight={fitPreview}>
					<PaperDocument id="invoice-container" className={`${styles.invoicePage} ${className}`} style={documentStyle}>
						{invoiceContent}
					</PaperDocument>
				</ResponsiveInvoiceDocument>
			</div>
		</>
	);
};

export default InvoiceContainer;
