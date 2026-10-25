import { CheckCircle, FileText } from "lucide-react";
import { TEMPLATE_OPTIONS } from "./index.js";

export function InvoiceTemplateSettingsView({ selectedTemplate, onSelect, t }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
      <header className="flex shrink-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--color-primary))]/25 bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
          <FileText className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
            {t("invoice.templateSettings")}
          </h2>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            {t("invoice.selectTemplateDescription")}
          </p>
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TEMPLATE_OPTIONS.map((template) => {
            const selected = selectedTemplate === template.value;
            return (
              <button
                key={template.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(template.value)}
                className={`relative overflow-hidden rounded-xl border text-left transition-colors ${selected ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10 ring-1 ring-[rgb(var(--color-primary))]/20" : "border-[rgb(var(--color-border-primary))]/70 bg-[rgb(var(--color-bg-primary))] hover:border-[rgb(var(--color-primary))]/50"}`}
              >
                {selected && <CheckCircle className="absolute right-2 top-2 z-10 h-6 w-6 rounded-full bg-[rgb(var(--color-primary))] text-white" />}
                <img
                  src={template.preview}
                  alt={template.label}
                  className="h-36 w-full bg-[rgb(var(--color-bg-tertiary))] object-cover"
                  onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
                />
                <div className="p-3">
                  <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{template.label}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-[rgb(var(--color-text-secondary))]">{template.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
