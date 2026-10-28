import { Settings2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@dragorbit/ui";
import { ConfiguredInvoiceTemplate } from "./ConfiguredInvoiceTemplate.jsx";
import { TEMPLATE_OPTIONS } from "./index.js";
import { PRINT_SETTING_OPTIONS, readPrintSettings, writePrintSettings } from "./printSettings.js";

const PREVIEW_INVOICE = {
  invoiceNumber: "INV-2026-001", createdAt: "2026-10-26T10:30:00.000Z", status: "RELEASED", paymentStatus: "PAID",
  customer: { name: "Sample Customer", email: "customer@example.com", phone: "+91 98765 43210", address: "12 Market Road, Ahmedabad, Gujarat", currentBalance: 1250 },
  items: [
    { product: { id: "preview-item-1", name: "Everyday Cotton Shirt", sku: "DB-101" }, productName: "Everyday Cotton Shirt", description: "Soft cotton, regular fit", quantity: 2, price: 850, mrp: 999, discountedPrice: 850, discount: 0, gst: { rate: 5 } },
    { product: { id: "preview-item-2", name: "Classic Denim Jeans", sku: "DB-205" }, productName: "Classic Denim Jeans", description: "Classic blue denim", quantity: 1, price: 1600, mrp: 1899, discountedPrice: 1600, discount: 0, gst: { rate: 12 } },
  ], subtotal: 3300, gstAmount: 165, totalDiscount: 0, totalAmount: 3465, amountPaid: 2000, balanceDue: 1465,
  paymentMode: "UPI", payments: [{ id: "preview-payment-1", amount: 2000, mode: "UPI", createdAt: "2026-10-26T10:30:00.000Z" }],
  termsAndConditions: "Returns are accepted within 7 days with the original invoice.",
};
const TEMPLATE_SELECTIONS_STORAGE_KEY = "invoice-template-selections";
const GROUPS = [
  { id: "regular", label: "Regular", templates: TEMPLATE_OPTIONS.filter(({ value }) => !value.startsWith("thermal-")) },
  { id: "thermal", label: "Thermal", templates: TEMPLATE_OPTIONS.filter(({ value }) => value.startsWith("thermal-")) },
];
const SIZE_OPTIONS = ["very-small", "small", "medium", "large", "extra-large"];
const PRIMARY_COLORS = ["#2563eb", "#0f766e", "#059669", "#65a30d", "#ca8a04", "#ea580c", "#dc2626", "#e11d48", "#c026d3", "#7c3aed", "#4f46e5", "#334155"];
const controlClass = "mt-1 w-full rounded-md border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-2 py-2 text-sm text-[rgb(var(--color-text-primary))]";
const getGroup = (key) => key?.startsWith("thermal-") ? "thermal" : "regular";
const getDefault = (group) => TEMPLATE_OPTIONS.find(({ value }) => value === (group === "thermal" ? "thermal-classic" : "modern"))?.value || GROUPS.find(({ id }) => id === group)?.templates[0]?.value;
const addressText = (value) => typeof value === "string" ? value : value && typeof value === "object"
  ? [value.line1, value.line2, value.city, value.state, value.pincode, value.country].filter(Boolean).join(", ")
  : "";
function readSelections(selected) {
  const result = { regular: getDefault("regular"), thermal: getDefault("thermal") };
  if (typeof window !== "undefined") try {
    const saved = JSON.parse(window.localStorage.getItem(TEMPLATE_SELECTIONS_STORAGE_KEY) || "{}");
    for (const group of GROUPS) if (group.templates.some(({ value }) => value === saved[group.id])) result[group.id] = saved[group.id];
  } catch { /* use defaults */ }
  if (selected && result[getGroup(selected)] === getDefault(getGroup(selected))) result[getGroup(selected)] = selected;
  return result;
}
function ThermalTemplateThumbnail({ template }) {
  const accents = { "thermal-classic": "#334155", "thermal-modern": "#2563eb", "thermal-compact": "#0891b2", "thermal-minimal": "#64748b", "thermal-bold": "#111827" };
  const accent = accents[template.value] || "#334155";
  return <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice"><rect width="240" height="120" fill="#e9edf2"/><path d="M75 5h90v110l-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4V5Z" fill="#fff"/><text x="120" y="35" textAnchor="middle" fill={accent} fontSize="7" fontWeight="700">DRAGBIZZ</text><text x="120" y="45" textAnchor="middle" fill="#64748b" fontSize="5">INVOICE</text><path d="M85 51h70M85 56h70M85 61h70M85 66h70M85 76h34M135 76h20M85 82h34M135 82h20" stroke="#94a3b8" strokeWidth="2"/><path d="M85 91h70" stroke={accent} strokeWidth="2"/></svg>;
}

export function InvoiceTemplateSettingsView({ selectedTemplate, onSelect, selectedStore, signatures = [], t, signatureSettingsUrl }) {
  const previousTemplate = useRef(selectedTemplate);
  const [settingsByPrinter, setSettingsByPrinter] = useState(() => readPrintSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(() => readPrintSettings().regular.primaryColor);
  const [customColorPending, setCustomColorPending] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [groupSelections, setGroupSelections] = useState(() => readSelections(selectedTemplate));
  const [activeGroup, setActiveGroup] = useState(getGroup(selectedTemplate) || "regular");
  const isThermal = activeGroup === "thermal";
  const activeSettings = settingsByPrinter[activeGroup];
  const companyDetails = selectedStore?.companyDetails || {};
  const editableFields = {
    showCompanyName: { setting: "companyName", label: "Company name", type: "text", value: selectedStore?.storeName || selectedStore?.name || companyDetails.companyName, placeholder: "Enter company name" },
    showAddress: { setting: "addressOverride", label: "Address", type: "text", value: addressText(selectedStore?.address || selectedStore?.storeAddress || selectedStore?.companyAddress || companyDetails.address), placeholder: "Enter invoice address" },
    showEmail: { setting: "emailOverride", label: "Email", type: "email", value: selectedStore?.email || selectedStore?.storeEmail || selectedStore?.companyEmail || companyDetails.email, placeholder: "Enter invoice email" },
    showPhone: { setting: "phoneOverride", label: "Phone number", type: "tel", value: selectedStore?.phone || selectedStore?.mobile || selectedStore?.storePhone || companyDetails.phone, placeholder: "Enter invoice phone number" },
    showGstin: { setting: "gstinOverride", label: "GSTIN", type: "text", value: selectedStore?.gstin || selectedStore?.gst || selectedStore?.gstNumber || companyDetails.gstin, placeholder: "Enter GSTIN" },
  };

  useEffect(() => {
    if (previousTemplate.current === selectedTemplate) return;
    previousTemplate.current = selectedTemplate;
    const group = getGroup(selectedTemplate);
    setActiveGroup(group);
    setGroupSelections((current) => {
      const next = { ...current, [group]: selectedTemplate };
      try { window.localStorage.setItem(TEMPLATE_SELECTIONS_STORAGE_KEY, JSON.stringify(next)); } catch { /* selection remains active */ }
      return next;
    });
  }, [selectedTemplate]);

  const updateSetting = useCallback((key, value) => setSettingsByPrinter((current) => {
    const updated = { ...current, [activeGroup]: { ...current[activeGroup], [key]: value } };
    writePrintSettings(updated);
    return updated;
  }), [activeGroup]);
  useEffect(() => {
    if (!customColorPending) return undefined;
    const timer = window.setTimeout(() => {
      updateSetting("primaryColor", customColor);
      setCustomColorPending(false);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [customColor, customColorPending, updateSetting]);

  const selectPrimaryColor = (color) => {
    setCustomColorPending(false);
    setCustomColor(color);
    updateSetting("primaryColor", color);
  };
  const settingsPanel = settingsOpen ? <div className="absolute inset-0 z-20 overflow-y-auto rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-3 shadow-xl sm:p-4 max-md:fixed max-md:inset-x-2 max-md:top-20 max-md:bottom-4 max-md:z-50">
    <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Printer Settings</h2><p className="text-xs text-[rgb(var(--color-text-secondary))]">{isThermal ? "Thermal" : "Regular"}</p></div><button type="button" onClick={() => setSettingsOpen(false)} aria-label={t("common.close") || "Close"} className="rounded-md p-2 hover:bg-[rgb(var(--color-bg-tertiary))]"><X className="h-4 w-4"/></button></div>
    {!isThermal && <div className="mb-4">
      <p className="mb-2 text-xs font-medium text-[rgb(var(--color-text-secondary))]">Primary color</p>
      <div className="grid grid-cols-6 gap-2">
        {PRIMARY_COLORS.map((color) => <button key={color} type="button" onClick={() => selectPrimaryColor(color)} aria-label={`Select ${color} primary color`} aria-pressed={activeSettings.primaryColor.toLowerCase() === color} className={`h-7 w-7 rounded-full border border-black/10 transition-transform hover:scale-110 ${activeSettings.primaryColor.toLowerCase() === color ? "ring-2 ring-[rgb(var(--color-primary))] ring-offset-2" : ""}`} style={{ backgroundColor: color }} />)}
        <label title="Custom color" className={`relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[rgb(var(--color-border-primary))] text-sm font-semibold text-white ring-offset-2 ${!PRIMARY_COLORS.includes(activeSettings.primaryColor.toLowerCase()) ? "ring-2 ring-[rgb(var(--color-primary))] ring-offset-2" : ""}`} style={{ backgroundColor: customColor }}>
          <span aria-hidden="true" className="drop-shadow">+</span><span className="sr-only">Custom</span>
          <input type="color" value={customColor} aria-label="Choose custom primary color" onChange={(e) => { setCustomColor(e.target.value); setCustomColorPending(true); }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        </label>
      </div>
      <p className="mt-2 text-[11px] text-[rgb(var(--color-text-secondary))]">{activeSettings.primaryColor.toUpperCase()} · Custom color preview updates when you pause.</p>
    </div>}
    <div className="mb-4 grid grid-cols-2 gap-2"><label className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Paper size<select className={controlClass} value={activeSettings.paperSize} onChange={(e) => updateSetting("paperSize", e.target.value)}>{(isThermal ? ["80mm", "58mm"] : ["A4", "A5"]).map((size) => <option key={size}>{size}</option>)}</select></label><label className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Text size<select className={controlClass} value={activeSettings.textSize} onChange={(e) => updateSetting("textSize", e.target.value)}>{SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size.replace("-", " ").replace(/^./, (c) => c.toUpperCase())}</option>)}</select></label></div>
    <label className="mb-4 block text-xs font-medium text-[rgb(var(--color-text-secondary))]">Company name size<select className={controlClass} value={activeSettings.companyNameSize} onChange={(e) => updateSetting("companyNameSize", e.target.value)}>{SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size.replace("-", " ").replace(/^./, (c) => c.toUpperCase())}</option>)}</select></label>
    <div className="space-y-1 border-t border-[rgb(var(--color-border-primary))] pt-3">{PRINT_SETTING_OPTIONS.map(([key, label]) => {
      const field = editableFields[key];
      const canEdit = field && (key === "showCompanyName" || !String(field.value || "").trim());
      const isEditing = editingField === key;
      return <div key={key} className="rounded-md px-1 py-1.5 text-xs hover:bg-[rgb(var(--color-bg-secondary))]">
        <div className="flex items-center justify-between gap-2">
          <label className="flex min-w-0 cursor-pointer items-center gap-2 text-[rgb(var(--color-text-primary))]"><input type="checkbox" checked={Boolean(activeSettings[key])} onChange={(e) => updateSetting(key, e.target.checked)} className="accent-[rgb(var(--color-primary))]"/>{label}</label>
          <div className="flex shrink-0 items-center gap-2">
            {canEdit && <button type="button" onClick={() => setEditingField(isEditing ? null : key)} className="text-[rgb(var(--color-primary))] underline underline-offset-2">{isEditing ? "Hide" : "Edit"}</button>}
            {key === "showSignature" && signatureSettingsUrl && <a href={signatureSettingsUrl} className="text-[rgb(var(--color-primary))] underline underline-offset-2">Change signature</a>}
          </div>
        </div>
        {field && isEditing && <div className="mt-2 pl-6"><Input type={field.type} label={field.label} placeholder={field.placeholder} value={activeSettings[field.setting] || ""} onChange={(value) => updateSetting(field.setting, value)} size="sm" /></div>}
      </div>;
    })}</div>
    {activeSettings.showAcknowledgement && <label className="mt-3 block text-xs font-medium text-[rgb(var(--color-text-secondary))]">Acknowledgement text<textarea className={controlClass} rows={2} value={activeSettings.acknowledgementText} onChange={(e) => updateSetting("acknowledgementText", e.target.value)}/></label>}
  </div> : null;

  return <div className="flex h-full min-h-0 flex-col overflow-hidden">
    <style>{`.invoice-template-preview #invoice-container, .invoice-template-preview #mini-invoice-container { border: 1px solid #d1d5db; box-shadow: 0 6px 24px rgba(15, 23, 42, .14); }`}</style>
    <div className="mb-3 flex shrink-0 items-center gap-2 border-b border-[rgb(var(--color-border-primary))]">
      <div className="flex items-center gap-1">
        {GROUPS.map((group) => <button key={group.id} type="button" aria-pressed={activeGroup === group.id} onClick={() => { setActiveGroup(group.id); const key = groupSelections[group.id] || getDefault(group.id); if (key !== selectedTemplate) onSelect(key); }} className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${activeGroup === group.id ? "border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))]" : "border-transparent text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"}`}>{group.label}</button>)}
      </div>
      <button type="button" onClick={() => setSettingsOpen((open) => !open)} aria-pressed={settingsOpen} aria-label="Printer settings" title="Printer settings" className={`ml-auto mb-1 rounded-lg p-2 ${settingsOpen ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))]"}`}><Settings2 className="h-4 w-4"/></button>
    </div>
    <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-2 md:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.5fr)] md:grid-rows-1 md:gap-3">
      <aside className="relative flex h-[82px] min-h-0 min-w-0 flex-col overflow-hidden md:h-full">
        <div className="min-h-0 flex-1 touch-pan-x overscroll-x-contain overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-x-hidden md:overflow-y-auto md:pr-1">
          <div className="flex w-max gap-2 md:grid md:w-full md:grid-cols-2">
            {(GROUPS.find(({ id }) => id === activeGroup)?.templates || []).map((template) => {
              const selected = selectedTemplate === template.value;
              return <button key={template.value} type="button" aria-pressed={selected} onClick={() => onSelect(template.value)} className={`group w-[92px] shrink-0 overflow-hidden rounded-lg border text-left md:w-auto ${selected ? "border-[rgb(var(--color-primary))] ring-2 ring-[rgb(var(--color-primary))]/30" : "border-[rgb(var(--color-border-primary))]/70 hover:border-[rgb(var(--color-primary))]/50"}`}>
                <span className="relative block aspect-[2/1] overflow-hidden bg-[rgb(var(--color-bg-tertiary))]">{template.value.startsWith("thermal-") ? <ThermalTemplateThumbnail template={template}/> : <img src={template.preview} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}/>}</span>
                <span className="block truncate px-1.5 py-1 text-[10px] font-medium leading-tight text-[rgb(var(--color-text-primary))] md:px-2 md:py-1.5 md:text-xs">{template.label}</span>
              </button>;
            })}
          </div>
        </div>
        {settingsPanel}
      </aside>
      <section className="invoice-template-preview flex min-h-0 min-w-0 items-center justify-center overflow-hidden bg-[#f3f4f6] p-2 sm:p-3">
        <div className="h-full w-full min-h-0 min-w-0 overflow-hidden">
          <ConfiguredInvoiceTemplate templateKey={selectedTemplate} invoiceData={PREVIEW_INVOICE} selectedStore={selectedStore} signatures={signatures} settings={activeSettings} signatureSettingsUrl={signatureSettingsUrl} fitPreview preview />
        </div>
      </section>
    </div>
  </div>;
}
