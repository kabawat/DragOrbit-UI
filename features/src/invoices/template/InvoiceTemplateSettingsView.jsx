import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getTemplateComponent } from "./registry.js";
import { TEMPLATE_OPTIONS } from "./index.js";

const PREVIEW_INVOICE = {
  invoiceNumber: "INV-2026-001",
  createdAt: "2026-10-26T10:30:00.000Z",
  status: "RELEASED",
  paymentStatus: "PAID",
  customer: {
    name: "Sample Customer",
    email: "customer@example.com",
    phone: "+91 98765 43210",
    address: "12 Market Road, Ahmedabad, Gujarat",
  },
  items: [
    {
      product: { id: "preview-item-1", name: "Everyday Cotton Shirt", sku: "DB-101" },
      productName: "Everyday Cotton Shirt",
      quantity: 2,
      price: 850,
      discountedPrice: 850,
      discount: 0,
      gst: { rate: 5 },
    },
    {
      product: { id: "preview-item-2", name: "Classic Denim Jeans", sku: "DB-205" },
      productName: "Classic Denim Jeans",
      quantity: 1,
      price: 1600,
      discountedPrice: 1600,
      discount: 0,
      gst: { rate: 12 },
    },
  ],
  subtotal: 3300,
  gstAmount: 165,
  totalDiscount: 0,
  totalAmount: 3465,
  amountPaid: 3465,
  balanceDue: 0,
};

const A4_PREVIEW_SIZE = { width: 794, height: 1123 };
const THERMAL_PREVIEW_SIZE = { width: 360, height: 680 };
const THERMAL_ACCENTS = {
  "thermal-classic": "#334155",
  "thermal-modern": "#2563eb",
  "thermal-compact": "#0891b2",
  "thermal-minimal": "#64748b",
  "thermal-bold": "#111827",
};
const TEMPLATE_SELECTIONS_STORAGE_KEY = "invoice-template-selections";

function getTemplateGroup(templateKey) {
  return templateKey?.startsWith("thermal-") ? "thermal" : "regular";
}

function getDefaultTemplate(group) {
  const preferred = group === "thermal" ? "thermal-classic" : "modern";
  return (
    TEMPLATE_OPTIONS.find((template) => template.value === preferred)?.value ||
    TEMPLATE_OPTIONS.find((template) => getTemplateGroup(template.value) === group)?.value
  );
}

function readTemplateSelections(selectedTemplate) {
  const defaults = {
    regular: getDefaultTemplate("regular"),
    thermal: getDefaultTemplate("thermal"),
  };

  if (typeof window === "undefined") return defaults;

  try {
    const saved = JSON.parse(
      window.localStorage.getItem(TEMPLATE_SELECTIONS_STORAGE_KEY) || "{}",
    );
    for (const group of ["regular", "thermal"]) {
      const savedTemplate = saved[group];
      const isValid = TEMPLATE_OPTIONS.some(
        (template) =>
          template.value === savedTemplate && getTemplateGroup(savedTemplate) === group,
      );
      if (isValid) defaults[group] = savedTemplate;
    }
  } catch {
    // Ignore invalid or unavailable local storage and use the defaults.
  }

  const selectedGroup = getTemplateGroup(selectedTemplate);
  if (
    selectedTemplate &&
    defaults[selectedGroup] === getDefaultTemplate(selectedGroup) &&
    TEMPLATE_OPTIONS.some((template) => template.value === selectedTemplate)
  ) {
    defaults[selectedGroup] = selectedTemplate;
  }

  return defaults;
}

function ThermalTemplateThumbnail({ template }) {
  const accent = THERMAL_ACCENTS[template.value] || "#334155";

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 240 120"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="240" height="120" fill="#e9edf2" />
      <path d="M75 5h90v110l-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4V5Z" fill="#fff" />
      <circle cx="120" cy="20" r="7" fill={accent} opacity=".16" />
      <text x="120" y="35" textAnchor="middle" fill={accent} fontSize="7" fontWeight="700">DRAGBIZZ</text>
      <text x="120" y="45" textAnchor="middle" fill="#64748b" fontSize="5">INVOICE</text>
      <path d="M85 51h70M85 56h70M85 61h70M85 66h70" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M85 76h34M135 76h20M85 82h34M135 82h20" stroke="#94a3b8" strokeWidth="2" />
      <path d="M85 91h70" stroke={accent} strokeWidth="2" />
      <path d="M120 98h35" stroke="#334155" strokeWidth="3" />
    </svg>
  );
}

export function InvoiceTemplateSettingsView({
  selectedTemplate,
  onSelect,
  selectedStore,
  t,
}) {
  const previewViewportRef = useRef(null);
  const previousTemplateRef = useRef(selectedTemplate);
  const [previewScale, setPreviewScale] = useState(1);
  const [groupSelections, setGroupSelections] = useState(() =>
    readTemplateSelections(selectedTemplate),
  );
  const [activeGroup, setActiveGroup] = useState("regular");
  const isThermal = selectedTemplate.startsWith("thermal-");
  const previewSize = isThermal ? THERMAL_PREVIEW_SIZE : A4_PREVIEW_SIZE;
  const Template = getTemplateComponent(selectedTemplate);
  const activeTemplate =
    TEMPLATE_OPTIONS.find((template) => template.value === selectedTemplate) ||
    TEMPLATE_OPTIONS.find((template) => template.value === "modern");

  useEffect(() => {
    if (previousTemplateRef.current === selectedTemplate) return;
    previousTemplateRef.current = selectedTemplate;
    const group = getTemplateGroup(selectedTemplate);
    setActiveGroup(group);
    setGroupSelections((current) => {
      const updated = { ...current, [group]: selectedTemplate };
      try {
        window.localStorage.setItem(
          TEMPLATE_SELECTIONS_STORAGE_KEY,
          JSON.stringify(updated),
        );
      } catch {
        // The current selection still works if storage is unavailable.
      }
      return updated;
    });
  }, [selectedTemplate]);

  useEffect(() => {
    const viewport = previewViewportRef.current;
    if (!viewport) return undefined;

    const updateScale = () => {
      const styles = window.getComputedStyle(viewport);
      const horizontalPadding =
        Number.parseFloat(styles.paddingLeft) +
        Number.parseFloat(styles.paddingRight);
      const verticalPadding =
        Number.parseFloat(styles.paddingTop) +
        Number.parseFloat(styles.paddingBottom);
      const availableWidth = Math.max(
        viewport.clientWidth - horizontalPadding,
        0,
      );
      const availableHeight = Math.max(
        viewport.clientHeight - verticalPadding,
        0,
      );
      setPreviewScale(
        Math.min(
          availableWidth / previewSize.width,
          availableHeight / previewSize.height,
          1,
        ),
      );
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [previewSize.width]);

  const templateGroups = [
    {
      id: "regular",
      label: t("invoice.regularPrinterTemplates"),
      templates: TEMPLATE_OPTIONS.filter(
        (template) => !template.value.startsWith("thermal-"),
      ),
    },
    {
      id: "thermal",
      label: t("invoice.thermalPrinterTemplates"),
      templates: TEMPLATE_OPTIONS.filter((template) =>
        template.value.startsWith("thermal-"),
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-4 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.7fr)] lg:grid-rows-1">
        <aside className="flex min-h-0 min-w-0 flex-col">
          <div className="grid shrink-0 grid-cols-2 gap-1 rounded-lg bg-[rgb(var(--color-bg-tertiary))] p-1">
            {templateGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                aria-pressed={activeGroup === group.id}
                onClick={() => {
                  setActiveGroup(group.id);
                  const template = groupSelections[group.id] || getDefaultTemplate(group.id);
                  if (template !== selectedTemplate) onSelect(template);
                }}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeGroup === group.id ? "bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] shadow-sm" : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"}`}
              >
                {group.label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 pt-3">
            {templateGroups.filter((group) => group.id === activeGroup).map((group) => (
              <section key={group.id}>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2">
                  {group.templates.map((template) => {
                    const selected = selectedTemplate === template.value;
                    return (
                      <button
                        key={template.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onSelect(template.value)}
                        className={`group min-w-0 overflow-hidden rounded-lg border text-left transition-colors ${selected ? "border-[rgb(var(--color-primary))] ring-2 ring-[rgb(var(--color-primary))]/30" : "border-[rgb(var(--color-border-primary))]/70 hover:border-[rgb(var(--color-primary))]/50"}`}
                      >
                        <span className="relative block aspect-[2/1] overflow-hidden bg-[rgb(var(--color-bg-tertiary))]">
                          <span className="absolute inset-0 grid place-items-center p-2 text-center text-xs text-[rgb(var(--color-text-secondary))]">
                            {template.label}
                          </span>
                          {template.value.startsWith("thermal-") ? (
                            <ThermalTemplateThumbnail template={template} />
                          ) : (
                            <img
                              src={template.preview}
                              alt=""
                              aria-hidden="true"
                              loading="lazy"
                              className="relative h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.visibility = "hidden";
                              }}
                            />
                          )}
                        </span>
                        <span className="block truncate px-2 py-1.5 text-xs font-medium text-[rgb(var(--color-text-primary))]">
                          {template.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-[rgb(var(--color-border-primary))]/70 bg-[rgb(var(--color-bg-secondary))]">
          <div className="flex shrink-0 items-center gap-2 border-b border-[rgb(var(--color-border-primary))]/60 px-4 py-3">
            <Eye className="h-4 w-4 text-[rgb(var(--color-primary))]" />
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                {t("invoice.templatePreview")}
              </p>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {activeTemplate?.label}
              </p>
            </div>
          </div>
          <div
            ref={previewViewportRef}
            className="grid min-h-0 flex-1 place-items-center overflow-hidden p-3 sm:p-5"
          >
            <div
              className="mx-auto my-auto shrink-0 overflow-hidden bg-white shadow-xl ring-1 ring-black/10"
              style={{
                height: `${previewSize.height * previewScale}px`,
                width: `${previewSize.width * previewScale}px`,
                maxWidth: "100%",
              }}
            >
              <div
                className="origin-top-left"
                style={{
                  width: `${previewSize.width}px`,
                  transform: `scale(${previewScale})`,
                }}
              >
                <Template invoiceData={PREVIEW_INVOICE} selectedStore={selectedStore} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
