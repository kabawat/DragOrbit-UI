"use client";

import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { normalizeInvoiceForTemplate, unwrapInvoice } from "./normalizeInvoiceForTemplate.js";
import { ConfiguredInvoiceTemplate } from "../template/ConfiguredInvoiceTemplate.jsx";

/**
 * Universal method to save/download an invoice as an A4 PDF.
 * - Always generates Standard A4 PDF (even if a thermal template is passed or selected).
 * - Avoids browser UI or modal scaling conflicts using an isolated off-screen sandbox.
 * - Multi-page aware with seamless pagination.
 */
export async function saveInvoicePDF({
  invoiceData,
  templateKey,
  selectedStore = null,
  signatures = [],
  settings = null,
  fileName = null,
  paperSize = "A4",
}) {
  if (typeof window === "undefined") return;

  const raw = unwrapInvoice(invoiceData);
  const normalized = normalizeInvoiceForTemplate(raw);
  if (!normalized) {
    throw new Error("Invalid invoice data provided for PDF generation");
  }

  // PDF is strictly for Standard (A4/A5) format, NOT Thermal.
  // If thermal is passed, fallback to user's saved regular template or "modern".
  let effectiveTemplateKey = templateKey;
  if (!effectiveTemplateKey || effectiveTemplateKey.startsWith("thermal-")) {
    try {
      const saved = localStorage.getItem("invoice-template");
      if (saved && !saved.startsWith("thermal-")) {
        effectiveTemplateKey = saved;
      } else {
        effectiveTemplateKey = "modern";
      }
    } catch {
      effectiveTemplateKey = "modern";
    }
  }

  // Dynamically load html2canvas and jsPDF
  const html2canvasModule = await import("html2canvas");
  const html2canvas = html2canvasModule?.default || html2canvasModule;
  const jsPDFModule = await import("jspdf");
  const jsPDF = jsPDFModule?.default || jsPDFModule?.jsPDF || jsPDFModule;

  // Create an off-screen isolated sandbox container
  const sandbox = document.createElement("div");
  const sandboxId = `invoice-pdf-sandbox-${Date.now()}`;
  sandbox.id = sandboxId;
  sandbox.style.position = "fixed";
  sandbox.style.left = "-9999px";
  sandbox.style.top = "0";
  sandbox.style.width = paperSize === "A5" ? "559px" : "794px";
  sandbox.style.minHeight = paperSize === "A5" ? "794px" : "1123px";
  sandbox.style.background = "#ffffff";
  sandbox.style.color = "#000000";
  sandbox.style.zIndex = "-9999";
  sandbox.style.overflow = "visible";
  document.body.appendChild(sandbox);

  let root = null;
  try {
    root = createRoot(sandbox);
    root.render(
      createElement(ConfiguredInvoiceTemplate, {
        templateKey: effectiveTemplateKey,
        invoiceData: normalized,
        selectedStore,
        signatures,
        settings,
        fitPreview: false,
      })
    );

    // Wait for React to render and fonts/images to settle
    await new Promise((resolve) => setTimeout(resolve, 350));

    const invoiceTarget =
      sandbox.querySelector("#invoice-container") ||
      sandbox.firstElementChild ||
      sandbox;

    const canvasWidth = paperSize === "A5" ? 559 : 794;
    const canvasHeight = Math.max(invoiceTarget.scrollHeight || 1123, 1123);

    const canvas = await html2canvas(invoiceTarget, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: canvasWidth,
      height: canvasHeight,
      windowWidth: canvasWidth,
      windowHeight: canvasHeight,
      onclone: (clonedDoc) => {
        // Strip any unsupported transform or color functions
        const clonedTarget = clonedDoc.getElementById(sandboxId);
        if (clonedTarget) {
          clonedTarget.style.position = "static";
          clonedTarget.style.left = "0";
        }
      },
    });

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: paperSize.toLowerCase(),
    });

    const contentWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pixelsPerPage = Math.floor((pageHeight * canvas.width) / contentWidth);

    for (let top = 0; top < canvas.height; top += pixelsPerPage) {
      const sliceHeight = Math.min(pixelsPerPage, canvas.height - top);
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = sliceHeight;
      const ctx = slice.getContext("2d");
      if (!ctx) break;

      ctx.drawImage(
        canvas,
        0,
        top,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      );

      if (top > 0) pdf.addPage();
      pdf.addImage(
        slice.toDataURL("image/png", 1.0),
        "PNG",
        0,
        0,
        contentWidth,
        (sliceHeight * contentWidth) / canvas.width
      );
    }

    const invNo = (
      normalized.invoiceNumber ||
      normalized.number ||
      normalized.invoiceNo ||
      normalized.id ||
      "invoice"
    ).replace(/[^a-zA-Z0-9-_]/g, "_");

    const finalFileName = fileName || `invoice-${invNo}.pdf`;
    pdf.save(finalFileName);
  } finally {
    if (root) {
      try {
        root.unmount();
      } catch {
        // ignore unmount errors
      }
    }
    if (sandbox?.parentNode) {
      sandbox.remove();
    }
  }
}

/**
 * Universal method to print an invoice document.
 * - Prints in an isolated hidden iframe with exact paper margins.
 * - Preserves complete color fidelity, custom fonts, and styling.
 * - Completely avoids modal UI, buttons, and page clipping issues.
 */
export function printInvoice({
  targetElement = null,
  isThermal = false,
  paperSize = "A4",
  title = "Invoice",
} = {}) {
  if (typeof window === "undefined") return;

  const element =
    targetElement ||
    (isThermal
      ? document.getElementById("mini-invoice-container")
      : document.getElementById("invoice-container") || document.getElementById("invoice-area"));

  if (!element) {
    window.print();
    return;
  }

  // Create isolated hidden print iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  // Clone all styles from main document
  const styles = Array.from(
    document.querySelectorAll("link[rel='stylesheet'], style")
  )
    .map((el) => el.outerHTML)
    .join("\n");

  const printSize = isThermal ? "80mm auto" : `${paperSize} portrait`;
  const maxWidth = isThermal ? "80mm" : "210mm";

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${styles}
        <style>
          @page {
            size: ${printSize};
            margin: 0 !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .invoice-print-document,
          #invoice-container,
          #mini-invoice-container {
            width: 100% !important;
            max-width: ${maxWidth} !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
          }
          .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  iframeDoc.close();

  // Trigger print once iframe is loaded
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.remove();
        }
      }, 2000);
    }
  }, 350);
}
