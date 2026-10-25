import { PaperDocument } from "@dragorbit/ui";
import styles from "./style.module.scss";

export default function MiniInvoiceContainer({
  children,
  className = "",
  style = {},
  pageWidth = "80mm",
}) {
  const sizeRule = pageWidth === "58mm" ? "58mm auto" : "80mm auto";

  return (
    <>
      <style>{`@media print { @page { size: ${sizeRule}; margin: 0 !important; } body, html { width: ${pageWidth} !important; min-width: ${pageWidth} !important; margin: 0 !important; padding: 0 !important; } }`}</style>
      <PaperDocument
        id="mini-invoice-container"
        className={`${styles.miniInvoicePage} ${className}`}
        style={{ ...style, width: pageWidth, maxWidth: pageWidth }}
      >
        <div className={styles.miniContent}>{children}</div>
      </PaperDocument>
    </>
  );
}
