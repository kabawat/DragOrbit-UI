import { useCallback, useState } from "react";
import { saveInvoicePDF, printInvoice } from "../utils/invoicePdfPrint.js";

/**
 * Universal headless hook for printing and downloading invoice PDFs.
 * Works seamlessly across Web, Desktop, POS and Print Preview.
 */
export function useInvoicePrint(options = {}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = useCallback(
    (printOptions = {}) => {
      try {
        setIsPrinting(true);
        const target =
          printOptions?.targetElement ||
          document.getElementById("invoice-container") ||
          document.getElementById("invoice-area") ||
          document.getElementById("mini-invoice-container");

        const inv = printOptions?.invoiceData || options?.invoiceData;
        const invNo = inv?.invoiceNumber || inv?.number || inv?.invoiceNo;

        printInvoice({
          targetElement: target,
          isThermal: Boolean(options?.isThermal || printOptions?.isThermal),
          paperSize: options?.paperSize || printOptions?.paperSize || "A4",
          title: invNo ? `Invoice #${invNo}` : "Invoice",
        });
      } catch (err) {
        console.error("Invoice print failed:", err);
        options?.onError?.(err) || printOptions?.onError?.(err);
        try {
          window.print();
        } catch {
          // ignore
        }
      } finally {
        setIsPrinting(false);
      }
    },
    [options]
  );

  const handleDownloadPDF = useCallback(
    async (invoiceData, invoiceId, downloadOptions = {}) => {
      const data = invoiceData || options?.invoiceData;
      if (!data) return;

      setIsDownloading(true);
      try {
        const templateKey =
          downloadOptions?.selectedTemplate ||
          downloadOptions?.templateKey ||
          options?.selectedTemplate ||
          options?.templateKey ||
          "modern";

        const selectedStore =
          downloadOptions?.selectedStore ||
          options?.selectedStore ||
          null;

        const signatures =
          downloadOptions?.signatures ||
          options?.signatures ||
          [];

        const paperSize =
          downloadOptions?.paperSize ||
          options?.paperSize ||
          "A4";

        await saveInvoicePDF({
          invoiceData: data,
          templateKey,
          selectedStore,
          signatures,
          paperSize,
          fileName: `invoice-${data?.invoiceNumber || invoiceId || "document"}.pdf`,
        });
      } catch (err) {
        console.error("Invoice PDF download failed:", err);
        options?.onError?.(err) || downloadOptions?.onError?.(err);
      } finally {
        setIsDownloading(false);
      }
    },
    [options]
  );

  return { handlePrint, handleDownloadPDF, isDownloading, isPrinting };
}

export default useInvoicePrint;
