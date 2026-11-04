"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Download,
  FileText,
  Loader2,
  Plus,
  Printer,
  Receipt,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Badge, Button, Modal } from "@dragorbit/ui";
import { ConfiguredInvoiceTemplate } from "../template/ConfiguredInvoiceTemplate.jsx";
import { normalizeInvoiceForTemplate } from "../utils/normalizeInvoiceForTemplate.js";
import { saveInvoicePDF, printInvoice } from "../utils/invoicePdfPrint.js";

const REGULAR_TEMPLATES = [
  {
    value: "modern",
    label: "Modern",
    badge: "A4",
    description: "Clean contemporary layout",
    preview: "/images/templates/modern-preview.png",
  },
  {
    value: "sale",
    label: "Sale",
    badge: "A4",
    description: "Compact summary with payment details",
    preview: "/images/templates/sale-preview.svg",
  },
  {
    value: "sale-tax-breakdown",
    label: "Sale Tax Breakdown",
    badge: "A4",
    description: "Split tax breakdown sections",
    preview: "/images/templates/sale-tax-breakdown-preview.svg",
  },
  {
    value: "sale-tax-summary",
    label: "Sale Tax Summary",
    badge: "A4",
    description: "CGST and SGST split summary",
    preview: "/images/templates/sale-tax-summary-preview.svg",
  },
  {
    value: "transport-tax-invoice",
    label: "Transport Tax",
    badge: "A4",
    description: "With transport & delivery details",
    preview: "/images/templates/transport-tax-invoice-preview.svg",
  },
  {
    value: "classic",
    label: "Classic",
    badge: "A4",
    description: "Traditional structured invoice",
    preview: "/images/templates/classic-preview.png",
  },
  {
    value: "vintage",
    label: "Vintage",
    badge: "A4",
    description: "Retro classic aesthetic",
    preview: "/images/templates/vintage-preview.png",
  },
  {
    value: "tax-invoice",
    label: "Tax Invoice",
    badge: "A4",
    description: "Bordered detailed tax invoice",
    preview: "/images/templates/tax-invoice-preview.svg",
  },
  {
    value: "minimal",
    label: "Minimal",
    badge: "A4",
    description: "Simple and minimal",
    preview: "/images/templates/minimal-preview.png",
  },
  {
    value: "aero",
    label: "Aero",
    badge: "A4",
    description: "Clean modern design",
    preview: "/images/templates/aero-preview.png",
  },
  {
    value: "professional",
    label: "Professional",
    badge: "A4",
    description: "Business format with signatures",
    preview: "/images/templates/professional-preview.png",
  },
];

const THERMAL_TEMPLATES = [
  {
    value: "thermal-classic",
    label: "Thermal Classic",
    badge: "80mm",
    description: "Classic 80mm thermal receipt",
    preview: "/images/templates/thermal-classic-preview.png",
  },
  {
    value: "thermal-modern",
    label: "Thermal Modern",
    badge: "80mm",
    description: "Modern 80mm thermal receipt",
    preview: "/images/templates/thermal-modern-preview.png",
  },
  {
    value: "thermal-compact",
    label: "Thermal Compact",
    badge: "58mm",
    description: "Compact 58mm thermal receipt",
    preview: "/images/templates/thermal-compact-preview.png",
  },
  {
    value: "thermal-bold",
    label: "Thermal Bold",
    badge: "80mm",
    description: "Bold 80mm thermal receipt",
    preview: "/images/templates/thermal-bold-preview.png",
  },
  {
    value: "thermal-minimal",
    label: "Thermal Minimal",
    badge: "80mm",
    description: "Minimal 80mm thermal receipt",
    preview: "/images/templates/thermal-minimal-preview.png",
  },
  {
    value: "thermal-tax-invoice",
    label: "Thermal Tax Invoice",
    badge: "80mm",
    description: "Receipt with item tax details",
    preview: "/images/templates/thermal-tax-invoice-preview.svg",
  },
];

function ThermalTemplateThumbnail({ template }) {
  const accents = {
    "thermal-classic": "#334155",
    "thermal-modern": "#2563eb",
    "thermal-compact": "#0891b2",
    "thermal-minimal": "#64748b",
    "thermal-bold": "#111827",
    "thermal-tax-invoice": "#059669",
  };
  const accent = accents[template.value] || "#334155";
  return (
    <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice">
      <rect width="240" height="120" fill="#f1f5f9" />
      <path
        d="M72 4h96v112l-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4V4Z"
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth="1"
      />
      <text x="120" y="30" textAnchor="middle" fill={accent} fontSize="8" fontWeight="800" letterSpacing="0.5">
        DRAGBIZZ
      </text>
      <text x="120" y="42" textAnchor="middle" fill="#64748b" fontSize="5.5" fontWeight="600">
        RECEIPT
      </text>
      <path d="M84 50h72M84 56h72M84 62h72M84 68h72M84 76h34M134 76h22M84 83h34M134 83h22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <path d="M84 92h72" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function TemplateCardThumbnail({ template, isThermal }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (isThermal) {
    return <ThermalTemplateThumbnail template={template} />;
  }

  if (imgFailed || !template.preview) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-2 text-slate-400">
        <FileText className="w-5 h-5 mb-1 text-slate-400" />
        <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider truncate max-w-full">
          {template.label}
        </span>
      </div>
    );
  }

  return (
    <img
      src={template.preview}
      alt={template.label}
      loading="lazy"
      onError={() => setImgFailed(true)}
      className="w-full h-full object-cover object-top"
    />
  );
}

export const InvoicePrintModal = ({
  open = false,
  invoiceId,
  invoice = null,
  fetchInvoice = null,
  selectedStore = null,
  signatures = [],
  onClose,
  onCreateNew,
  t = (k) => k,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [invoiceData, setInvoiceData] = useState(invoice || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Scaling & Zoom state
  const [autoFit, setAutoFit] = useState(true);
  const [scale, setScale] = useState(1);
  const [isMeasured, setIsMeasured] = useState(false);

  const viewportRef = useRef(null);
  const paperRef = useRef(null);

  const isThermal = Boolean(selectedTemplate?.startsWith("thermal-"));
  const templatesList = isThermal ? THERMAL_TEMPLATES : REGULAR_TEMPLATES;

  // Compute paper target dimensions synchronously based on active template
  const targetPaperDims = useMemo(() => {
    if (isThermal) {
      const w = selectedTemplate === "thermal-compact" ? 220 : 302;
      return { width: w, minHeight: 480, isThermal: true };
    }
    return { width: 794, minHeight: 1123, isThermal: false };
  }, [isThermal, selectedTemplate]);

  // Load saved template preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("invoice-template");
      if (saved) {
        setSelectedTemplate(saved);
      }
    } catch {
      // storage unavailable
    }
  }, []);

  // Fetch invoice data if not provided directly
  useEffect(() => {
    if (!open) {
      setInvoiceData(null);
      setError(null);
      setAutoFit(true);
      setIsMeasured(false);
      return;
    }

    if (invoice) {
      setInvoiceData(invoice);
      setError(null);
      return;
    }

    if (!invoiceId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        let data = null;
        if (typeof fetchInvoice === "function") {
          data = await fetchInvoice(invoiceId);
        }
        if (!isMounted) return;

        if (data) {
          const unwrapped =
            data?.data && (data.data.items || data.data.invoiceNumber || !data.items)
              ? data.data
              : Array.isArray(data)
              ? data[0]
              : data;
          setInvoiceData(unwrapped);
        } else {
          setError(t("invoice.notFoundTitle") || "Failed to load invoice details");
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || t("invoice.notFoundTitle") || "Failed to load invoice");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [open, invoiceId, invoice, fetchInvoice, t]);

  // Normalize invoice data for templates
  const normalizedData = useMemo(() => {
    if (!invoiceData) return null;
    return normalizeInvoiceForTemplate(invoiceData);
  }, [invoiceData]);

  // Measure and compute scale to fit screen smoothly without jump/flash
  const computeFitScale = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const padX = 40;
    const padY = 40;
    const availW = Math.max(viewport.clientWidth - padX, 100);
    const availH = Math.max(viewport.clientHeight - padY, 100);

    const docW = targetPaperDims.width;
    let docH = targetPaperDims.minHeight;

    if (paperRef.current) {
      const invoiceEl =
        paperRef.current.querySelector("#mini-invoice-container") ||
        paperRef.current.querySelector("#invoice-container") ||
        paperRef.current;
      if (invoiceEl?.scrollHeight) {
        docH = Math.max(invoiceEl.scrollHeight, docH);
      }
    }

    const fitScale = Math.min(availW / docW, availH / docH);
    const boundedScale = Math.max(0.15, Math.min(fitScale, isThermal ? 1.3 : 1.1));

    if (autoFit) {
      setScale(boundedScale);
    }
    setIsMeasured(true);
  }, [autoFit, targetPaperDims, isThermal]);

  // Re-measure whenever template, autoFit or normalizedData changes
  useLayoutEffect(() => {
    if (!open || !normalizedData) return;
    computeFitScale();
  }, [open, normalizedData, targetPaperDims, computeFitScale]);

  // ResizeObserver on the viewport container
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        computeFitScale();
      });
      observer.observe(viewport);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [computeFitScale]);

  const handleTemplateSelect = useCallback((templateKey) => {
    setSelectedTemplate(templateKey);
    setAutoFit(true);
    try {
      localStorage.setItem("invoice-template", templateKey);
    } catch {
      // storage unavailable
    }
  }, []);

  const handleGroupChange = useCallback(
    (group) => {
      if (group === "thermal" && !isThermal) {
        handleTemplateSelect("thermal-classic");
      } else if (group === "regular" && isThermal) {
        handleTemplateSelect("modern");
      }
    },
    [isThermal, handleTemplateSelect]
  );

  const handleZoomIn = useCallback(() => {
    setAutoFit(false);
    setScale((prev) => Math.min(2.0, Number((prev + 0.1).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setAutoFit(false);
    setScale((prev) => Math.max(0.2, Number((prev - 0.1).toFixed(2))));
  }, []);

  const handleResetZoom = useCallback(() => {
    setAutoFit(true);
    computeFitScale();
  }, [computeFitScale]);

  const handlePrint = useCallback(() => {
    const target =
      paperRef.current?.querySelector("#mini-invoice-container") ||
      paperRef.current?.querySelector("#invoice-container") ||
      paperRef.current;

    printInvoice({
      targetElement: target,
      isThermal,
      paperSize: "A4",
      title: invoiceData?.invoiceNumber
        ? `Invoice #${invoiceData.invoiceNumber}`
        : "Invoice",
    });
  }, [isThermal, invoiceData]);

  const handleDownloadPDF = useCallback(async () => {
    if (!invoiceData) return;
    setIsDownloading(true);

    try {
      await saveInvoicePDF({
        invoiceData,
        templateKey: selectedTemplate,
        selectedStore,
        signatures,
        paperSize: "A4",
      });
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [invoiceData, selectedTemplate, selectedStore, signatures]);

  if (!open) return null;

  const currentTemplateObj = templatesList.find((item) => item.value === selectedTemplate);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseButton={false}
      ariaLabel={t("invoice.printInvoice") || "Print Invoice"}
      overlayClassName="pos-invoice-print-modal dragorbit-invoice-print-modal"
      className="!w-[96vw] !max-w-7xl !h-[92vh] !max-h-[92vh] !p-0 !overflow-hidden !shadow-2xl !rounded-2xl !border !border-[rgb(var(--color-border-primary))]"
      bodyClassName="!p-0 !h-full !flex !flex-col !overflow-hidden"
    >
      {/* Dynamic print-override styles */}
      <style>{`
        @media print {
          body:has(.dragorbit-invoice-print-modal) > :not(.dragorbit-invoice-print-modal) {
            display: none !important;
          }
          .dragorbit-invoice-print-modal,
          .dragorbit-invoice-print-modal .dragorbit-modal-panel,
          .dragorbit-invoice-print-modal .dragorbit-modal-content {
            position: static !important;
            display: block !important;
            width: auto !important;
            max-width: none !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            transform: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
          }
          .dragorbit-invoice-print-modal .no-print {
            display: none !important;
          }
          .dragorbit-invoice-print-modal #invoice-area {
            position: static !important;
            transform: none !important;
            width: 100% !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* ── Top Header Row ──────────────────────────────────────────────── */}
      <header className="no-print shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[rgb(var(--color-primary))]/10 flex items-center justify-center shrink-0 text-[rgb(var(--color-primary))]">
            <Printer className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[rgb(var(--color-text-primary))] truncate">
                {invoiceData?.invoiceNumber
                  ? `${t("invoice.invoice") || "Invoice"} #${invoiceData.invoiceNumber}`
                  : t("invoice.printInvoice") || "Invoice Print Preview"}
              </h2>
              {invoiceData?.invoiceStatus && (
                <Badge
                  variant={invoiceData.invoiceStatus === "RELEASED" ? "success" : "default"}
                  size="xs"
                >
                  {invoiceData.invoiceStatus}
                </Badge>
              )}
            </div>
            {invoiceData?.customer?.name && (
              <p className="text-xs text-[rgb(var(--color-text-secondary))] truncate">
                {t("invoice.customer") || "Customer"}: {invoiceData.customer.name}
              </p>
            )}
          </div>
        </div>

        {/* Center/Right Controls: Zoom Controls & Close Button */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))]/60 rounded-xl p-0.5 text-xs text-[rgb(var(--color-text-secondary))]">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-primary))] rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className={`px-2 py-1 font-medium rounded-lg transition-colors ${
                autoFit
                  ? "bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))] font-semibold"
                  : "hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-primary))]"
              }`}
              title="Fit to screen without scrolling"
            >
              {autoFit ? "Auto Fit" : `${Math.round(scale * 100)}%`}
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-primary))] rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors"
            aria-label={t("common.close") || "Close"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Main Layout: Left Templates Sidebar + Right Live Scaled Canvas ─ */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: Visual Template Selection */}
        <aside className="no-print w-full md:w-80 lg:w-96 shrink-0 border-b md:border-b-0 md:border-r border-[rgb(var(--color-border-primary))] flex flex-col bg-[rgb(var(--color-bg-secondary))]/40">
          {/* Format Tabs (Regular A4 vs Thermal Receipt) */}
          <div className="p-3 border-b border-[rgb(var(--color-border-primary))]/60">
            <div className="grid grid-cols-2 p-1 bg-[rgb(var(--color-bg-tertiary))] rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => handleGroupChange("regular")}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  !isThermal
                    ? "bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] shadow-sm font-semibold"
                    : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Standard (A4)</span>
              </button>

              <button
                type="button"
                onClick={() => handleGroupChange("thermal")}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  isThermal
                    ? "bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] shadow-sm font-semibold"
                    : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Thermal (POS)</span>
              </button>
            </div>
          </div>

          {/* Visual Template Cards Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 custom-scrollbar">
            <div className="flex items-center justify-between px-1 mb-2">
              <p className="text-[11px] font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                {isThermal ? "Thermal Receipt Layouts" : "A4 / A5 Layouts"}
              </p>
              <span className="text-[11px] text-[rgb(var(--color-text-secondary))]">
                {templatesList.length} templates
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {templatesList.map((tpl) => {
                const isSelected = selectedTemplate === tpl.value;
                return (
                  <button
                    key={tpl.value}
                    type="button"
                    onClick={() => handleTemplateSelect(tpl.value)}
                    className={`group text-left rounded-xl border overflow-hidden transition-all flex flex-col bg-[rgb(var(--color-bg-primary))] ${
                      isSelected
                        ? "border-[rgb(var(--color-primary))] ring-2 ring-[rgb(var(--color-primary))]/30 shadow-md"
                        : "border-[rgb(var(--color-border-primary))]/70 hover:border-[rgb(var(--color-primary))]/50 hover:shadow-xs"
                    }`}
                  >
                    {/* Thumbnail Image Header */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-[rgb(var(--color-border-primary))]/40">
                      <TemplateCardThumbnail template={tpl} isThermal={isThermal} />

                      {/* Top Badges */}
                      <div className="absolute top-1.5 left-1.5 z-10">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs shadow-xs">
                          {tpl.badge}
                        </span>
                      </div>

                      {/* Selection Checkmark Bubble */}
                      <div className="absolute top-1.5 right-1.5 z-10">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform ${
                            isSelected
                              ? "bg-[rgb(var(--color-primary))] text-white shadow-xs scale-100"
                              : "bg-white/80 dark:bg-black/50 text-transparent border border-black/10 scale-90 opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      </div>
                    </div>

                    {/* Card Title & Info */}
                    <div className="p-2 min-w-0">
                      <div className="font-semibold text-xs text-[rgb(var(--color-text-primary))] truncate">
                        {tpl.label}
                      </div>
                      {tpl.description && (
                        <p className="text-[10px] text-[rgb(var(--color-text-secondary))] truncate mt-0.5 leading-tight">
                          {tpl.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Canvas: Scaled Zero-Scroll Preview Area */}
        <section
          ref={viewportRef}
          className={`flex-1 min-h-0 w-full h-full flex ${
            autoFit
              ? "items-center justify-center overflow-hidden"
              : "items-start justify-center overflow-auto"
          } p-3 sm:p-5 bg-slate-100 dark:bg-slate-900/60 custom-scrollbar select-none relative`}
        >
          {loading && (
            <div className="no-print flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--color-primary))]" />
              <p className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                {t("invoice.loadingPreview") || "Preparing invoice preview..."}
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="no-print text-center py-12 max-w-sm">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={onClose}
              >
                {t("common.close") || "Close"}
              </Button>
            </div>
          )}

          {!loading && !error && normalizedData && (
            <div
              data-invoice-scaled-frame="true"
              style={{
                width: `${targetPaperDims.width * scale}px`,
                height: `${targetPaperDims.minHeight * scale}px`,
                position: "relative",
                opacity: isMeasured ? 1 : 0,
                transition: "opacity 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out",
              }}
              className="flex items-center justify-center shadow-2xl rounded-sm bg-white"
            >
              <div
                ref={paperRef}
                id="invoice-area"
                data-invoice-scaled-paper="true"
                style={{
                  width: `${targetPaperDims.width}px`,
                  minHeight: `${targetPaperDims.minHeight}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                className="bg-white text-black"
              >
                <ConfiguredInvoiceTemplate
                  templateKey={selectedTemplate}
                  invoiceData={normalizedData}
                  selectedStore={selectedStore}
                  signatures={signatures}
                  fitPreview={false}
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── Footer: Action Buttons ──────────────────────────────────────── */}
      <footer className="no-print shrink-0 border-t border-[rgb(var(--color-border-primary))] px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[rgb(var(--color-bg-primary))] z-20">
        <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
          <span className="font-semibold text-[rgb(var(--color-text-primary))]">
            {currentTemplateObj?.label || selectedTemplate}
          </span>
          <span>•</span>
          <span>{isThermal ? "Thermal Receipt" : "A4 Page"}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-green-600 dark:text-green-400 font-medium">
            Live preview updated
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            {t("common.cancel") || "Cancel"}
          </Button>

          {onCreateNew && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={() => {
                onClose?.();
                onCreateNew();
              }}
            >
              {t("invoice.createNew") || "New Invoice"}
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={Download}
            loading={isDownloading}
            disabled={loading || Boolean(error)}
            onClick={handleDownloadPDF}
          >
            {t("invoice.downloadPDF") || "Download PDF"}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            leftIcon={Printer}
            disabled={loading || Boolean(error)}
            onClick={handlePrint}
          >
            {t("invoice.printInvoice") || "Print Invoice"}
          </Button>
        </div>
      </footer>
    </Modal>
  );
};

export default memo(InvoicePrintModal);
