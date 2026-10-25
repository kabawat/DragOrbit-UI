import { PaperDocument } from "@dragorbit/ui";
import { ResponsiveInvoiceDocument } from "../../component/view/ResponsiveInvoiceDocument.jsx";
import styles from "./style.module.scss";

export default function MiniInvoiceContainer({
  children,
  className = "",
  style = {},
  pageWidth = "80mm",
}) {
  const sizeRule = pageWidth === "58mm" ? "58mm auto" : "80mm auto";
  const pageWidthPx = Number.parseFloat(pageWidth) * (96 / 25.4);

  return (
    <>
      <style>{`@media print { @page { size: ${sizeRule}; margin: 0 !important; } body, html { width: ${pageWidth} !important; min-width: ${pageWidth} !important; margin: 0 !important; padding: 0 !important; } }`}</style>
      <ResponsiveInvoiceDocument pageWidth={pageWidthPx}>
        <PaperDocument
          id="mini-invoice-container"
          className={`${styles.miniInvoicePage} ${className}`}
          style={{ ...style, width: pageWidth, maxWidth: pageWidth }}
        >
          <div className={styles.miniContent}>{children}</div>
        </PaperDocument>
      </ResponsiveInvoiceDocument>
    </>
  );
}
