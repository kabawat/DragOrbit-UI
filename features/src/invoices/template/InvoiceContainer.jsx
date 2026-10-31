import { Children, Fragment, cloneElement, createElement, isValidElement, useContext } from "react";
import { PaperDocument } from "@dragorbit/ui";
import { ResponsiveInvoiceDocument } from "../component/view/ResponsiveInvoiceDocument.jsx";
import { InvoicePrintSettingsContext, getDefaultPrintSettings } from "./InvoicePrintSettingsContext.jsx";
import { InvoiceAcknowledgement, InvoicePrintExtras } from "./InvoicePrintExtras.jsx";
import extraStyles from "./InvoicePrintExtras.module.scss";
import { placeInvoiceExtrasBeforeFooter } from "./placeInvoiceExtras.jsx";
import styles from "./style.module.scss";

function getNodeText(node) {
	if (Array.isArray(node)) return node.map(getNodeText).join("");
	if (!isValidElement(node)) return typeof node === "string" || typeof node === "number" ? String(node) : "";
	return getNodeText(node.props?.children);
}

function hasLogoImage(node) {
	if (Array.isArray(node)) return node.some(hasLogoImage);
	if (!isValidElement(node)) return false;
	if (node.props?.["data-invoice-logo"] || /logo/i.test(String(node.props?.className || ""))) return true;
	return hasLogoImage(node.props?.children);
}

function PreviewStoreFallback({ content, store, settings }) {
	const text = getNodeText(content).toLowerCase();
	const address = typeof store?.address === "string" ? store.address : [store?.address?.line1, store?.address?.line2, store?.address?.city, store?.address?.state, store?.address?.pincode].filter(Boolean).join(", ");
	const fields = [
		settings.showCompanyName && store?.storeName && !text.includes(String(store.storeName).toLowerCase()) && store.storeName,
		settings.showAddress && address && !text.includes(address.toLowerCase()) && address,
		settings.showPhone && store?.phone && !text.includes(String(store.phone).toLowerCase()) && `Phone: ${store.phone}`,
		settings.showEmail && store?.email && !text.includes(String(store.email).toLowerCase()) && `Email: ${store.email}`,
		settings.showGstin && (store?.gstin || store?.gst) && !text.includes(String(store.gstin || store.gst).toLowerCase()) && `GSTIN: ${store.gstin || store.gst}`,
	].filter(Boolean);
	const image = store?.logo || store?.logoUrl;
	const logo = typeof image === "string" ? image : image?.url || image?.secure_url;
	const showLogo = settings.showLogo && !hasLogoImage(content);
	if (!showLogo && !fields.length) return null;
	return <div className={extraStyles.previewStoreFallback}>
		{showLogo && logo && <img src={logo} alt="Company logo" />}
		<div>{fields.map((value, index) => <span key={`${index}-${value}`}>{value}</span>)}</div>
	</div>;
}

function getTableHeaderCells(tableChildren) {
	const thead = tableChildren.find((child) => isValidElement(child) && child.type === "thead");
	if (!thead) return [];
	const headerRow = Children.toArray(thead.props.children).find((child) => isValidElement(child) && child.type === "tr");
	return headerRow ? Children.toArray(headerRow.props.children) : [];
}

function formatInvoiceMoney(value, decimals) {
	const digits = decimals ? 2 : 0;
	return `₹${(Number(value) || 0).toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

function addDescriptionsToTable(table, items, settings, state) {
	const tableChildren = Children.toArray(table.props.children);
	const headerElements = getTableHeaderCells(tableChildren);
	let headers = headerElements.map(getNodeText);
	const descriptionColumn = headers.findIndex((header) => /item|description|product|name/i.test(header));
	if (descriptionColumn < 0) return table;
	const gstColumn = headers.findIndex((header) => /^(gst|tax)(?:\b|\s|\()/i.test(header.trim()));
	const hasTaxColumns = headers.some((header) => /gst|tax/i.test(header));
	const tbodyIndex = tableChildren.findIndex((child) => isValidElement(child) && child.type === "tbody");
	if (tbodyIndex < 0) return table;
	const addGstColumn = gstColumn < 0 && !hasTaxColumns && settings.showTaxDetails;
	const columnCount = headerElements.length + (addGstColumn ? 1 : 0);
	const nextHeaders = addGstColumn ? [...headerElements, createElement("th", { key: "invoice-gst-heading" }, "GST")] : headerElements;
	if (addGstColumn) {
		const theadIndex = tableChildren.findIndex((child) => isValidElement(child) && child.type === "thead");
		const thead = tableChildren[theadIndex];
		const headRows = Children.toArray(thead.props.children);
		const firstRowIndex = headRows.findIndex((child) => isValidElement(child) && child.type === "tr");
		if (firstRowIndex >= 0) headRows[firstRowIndex] = cloneElement(headRows[firstRowIndex], {}, nextHeaders);
		tableChildren[theadIndex] = cloneElement(thead, {}, headRows);
		headers = nextHeaders.map(getNodeText);
	}

	const tbody = tableChildren[tbodyIndex];
	const bodyRows = Children.toArray(tbody.props.children);
	const itemRows = bodyRows.filter((row) => isValidElement(row) && row.type === "tr");
	if (itemRows.length < items.length || !items.length) return table;

	let itemIndex = 0;
	const nextRows = bodyRows.map((row) => {
		if (!isValidElement(row) || row.type !== "tr") return row;
		const index = itemIndex++;
		if (index >= items.length) return row;
		const item = items[index];
		const description = item?.description || item?.product?.description;
		const mrp = settings.showMrp ? (item?.mrp ?? item?.variant?.mrp) : null;
		const details = [];
		if (description && settings.showDescription) details.push({ key: "invoice-item-description", text: description, description: true });
		if (mrp !== null && mrp !== undefined && mrp !== "") details.push({ key: "invoice-item-mrp", text: `MRP: ₹${Number(mrp).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` });

		const cells = Children.toArray(row.props.children);
		const cellIndex = descriptionColumn >= 0 ? descriptionColumn : 0;
		const cell = cells[cellIndex];
		if (isValidElement(cell) && (cell.type === "td" || cell.type === "th")) {
			const existingText = getNodeText(cell.props.children);
			const missingDetails = details.filter((detail) => detail.description
				? !existingText.includes(detail.text)
				: !/\bMRP\s*:/i.test(existingText));
			if (missingDetails.length) cells[cellIndex] = cloneElement(cell, {}, createElement(Fragment, null,
				Children.toArray(cell.props.children),
				...missingDetails.map((detail) => createElement("small", { key: detail.key, className: extraStyles.itemDescription, ...(detail.description ? { "data-invoice-item-description": true } : { "data-invoice-item-mrp": true }) }, detail.text)),
			));
		}
		if (addGstColumn || gstColumn >= 0) {
			const gst = item?.gst || {};
			const rate = Number(gst.rate ?? gst.gstRate ?? item?.gstRate ?? item?.taxRate ?? item?.gstPercentage ?? item?.gstInfo?.rate ?? item?.gstInfo?.gstRate ?? 0);
			const qty = Number(item?.quantity ?? item?.qty ?? 1);
			const taxable = Number(item?.taxableAmount ?? item?.subtotal ?? item?.price ?? 0) * (item?.taxableAmount || item?.subtotal ? 1 : qty);
			const amount = Number(gst.amount ?? gst.breakdown?.total ?? item?.calculatedGst ?? item?.gstAmount ?? (taxable * rate / 100));
			const gstValue = settings.showTaxDetails && rate > 0 ? `${rate}% · ${formatInvoiceMoney(amount, settings.showAmountDecimals)}` : "—";
			if (addGstColumn) cells.push(createElement("td", { key: "invoice-item-gst" }, gstValue));
			else {
				const currentGstCell = cells[gstColumn];
				if (isValidElement(currentGstCell) && (currentGstCell.type === "td" || currentGstCell.type === "th") && settings.showTaxDetails && rate > 0 && !/%.*₹/.test(getNodeText(currentGstCell.props.children))) {
					cells[gstColumn] = cloneElement(currentGstCell, {}, gstValue);
				}
			}
		}
		return cloneElement(row, {}, cells);
	});

	tableChildren[tbodyIndex] = cloneElement(tbody, {}, nextRows);
	return cloneElement(table, {}, tableChildren);
}

export function addItemDetailsToTables(node, items, settings, state = { done: false, invoiceData: null }) {
	const visit = (current) => {
		if (Array.isArray(current)) return Children.toArray(current).map(visit);
		if (!isValidElement(current)) return current;
		if (!state.done && current.type === "table") {
			const table = addDescriptionsToTable(current, items, settings, state);
			if (table !== current) {
				state.done = true;
				return table;
			}
		}
		if (!current.props?.children) return current;
		return cloneElement(current, {}, visit(current.props.children));
	};
	return visit(node);
}

export function hideThankYouCopy(node) {
	if (Array.isArray(node)) return Children.toArray(node).map(hideThankYouCopy);
	if (!isValidElement(node)) return node;
	const childText = node.props?.children;
	const text = typeof childText === "string" ? childText.trim() : "";
	const renderedText = getNodeText(node).trim();
	const isCopyLine = /^(thank you|thanks for|please visit again|generated on|this is a system-generated invoice)/i;
	if ((text && isCopyLine.test(text)) || ((node.type === "p" || node.type === "small") && isCopyLine.test(renderedText))) return null;
	if (!node.props?.children) return node;
	return cloneElement(node, {}, hideThankYouCopy(node.props.children));
}

function mixColorWithWhite(hexColor, percentage) {
	let hex = String(hexColor || "#2563eb").replace("#", "").trim();
	if (hex.length === 3) {
		hex = hex.split("").map((c) => c + c).join("");
	}
	if (hex.length !== 6) return percentage > 0.3 ? "#93c5fd" : "#eff6ff";
	const r = parseInt(hex.substring(0, 2), 16) || 0;
	const g = parseInt(hex.substring(2, 4), 16) || 0;
	const b = parseInt(hex.substring(4, 6), 16) || 0;
	const mixedR = Math.round(r * percentage + 255 * (1 - percentage));
	const mixedG = Math.round(g * percentage + 255 * (1 - percentage));
	const mixedB = Math.round(b * percentage + 255 * (1 - percentage));
	const toHex = (c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0");
	return "#" + toHex(mixedR) + toHex(mixedG) + toHex(mixedB);
}

const InvoiceContainer = ({ children, className = "", style = {}, includeSignature = true, includeExtras = true, includeSummaryFields = true, includeItemDescriptions = true, includeTerms = true, includePaymentMode = true }) => {
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
		width: "100%",
		maxWidth: paperWidth,
		minHeight: paperHeight,
		"--invoice-primary-color": primaryColor,
		"--invoice-primary-text": primaryText,
		"--invoice-text-size": fontSizes[settings.textSize] || fontSizes.medium,
		"--invoice-company-size": companyFontSizes[settings.companyNameSize] || companyFontSizes.medium,
	};
	const extras = includeExtras
		? createElement(InvoicePrintExtras, { includeSignature, includeSummaryFields, includeTerms, includePaymentMode })
		: null;
	const acknowledgement = createElement(InvoiceAcknowledgement);
	const describedContent = includeItemDescriptions && (settings.showDescription || settings.showMrp || settings.showTaxDetails || settings.showReceivedAmount || settings.showBalanceAmount || settings.showCustomerBalance || settings.showPaymentMode || settings.showAmountInWords)
		? addItemDetailsToTables(children, printContext?.invoiceData?.items || [], settings, { done: false, invoiceData: printContext?.invoiceData })
		: children;
	const configuredContent = includeExtras ? hideThankYouCopy(describedContent) : describedContent;
	const invoiceContent = extras || acknowledgement
		? placeInvoiceExtrasBeforeFooter(configuredContent, extras, acknowledgement).children
		: configuredContent;

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
				.invoice-print-document #invoice-container [data-invoice-item-description] { display: block !important; margin-top: 2px !important; color: #64748b !important; font-size: 9px !important; font-weight: 400 !important; line-height: 1.25 !important; }
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
				.invoice-print-document #invoice-container [data-invoice-summary-row] td {
					background: transparent !important;
					background-color: transparent !important;
					box-shadow: none !important;
				}
				.invoice-print-document #invoice-container [data-invoice-summary-row] td > span { width: min(100%, 320px); margin-left: auto; }
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
					"--invoice-primary-tint": mixColorWithWhite(primaryColor, 0.1),
					"--invoice-primary-border": mixColorWithWhite(primaryColor, 0.45),
				}}
			>
					{fitPreview ? (
					<ResponsiveInvoiceDocument pageWidth={pageWidth} fitHeight={fitPreview}>
						<PaperDocument id="invoice-container" className={`${styles.invoicePage} ${className}`} style={documentStyle}>
							{printContext?.preview && <PreviewStoreFallback content={invoiceContent} store={printContext.selectedStore} settings={settings} />}
							{invoiceContent}
						</PaperDocument>
					</ResponsiveInvoiceDocument>
				) : (
					<PaperDocument id="invoice-container" className={`${styles.invoicePage} ${className}`} style={documentStyle}>
						{printContext?.preview && <PreviewStoreFallback content={invoiceContent} store={printContext.selectedStore} settings={settings} />}
						{invoiceContent}
					</PaperDocument>
				)}
			</div>
		</>
	);
};

export default InvoiceContainer;
