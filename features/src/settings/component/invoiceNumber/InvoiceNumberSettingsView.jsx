"use client";
import { Badge, Button, SideDrawer } from "@dragorbit/ui";
import { Check, Eye, FileText, Hash, Loader2, Save } from "lucide-react";
import { useState } from "react";
export function InvoiceNumberSettingsView({ model }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    t,
    templates,
    form,
    savedTemplateId,
    updateField,
    selectedTemplate,
    previewing,
    preview,
    templateTokens,
    TOKEN_STYLES,
    hasUnsavedChanges,
    saving,
    handleSave,
  } = model;
  const previewPanel = (
    <section className="rounded-2xl border border-[rgb(var(--color-border-primary))]/50 bg-[rgb(var(--color-bg-primary))] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--color-text-tertiary))]">
            {t("invoiceNumber.livePreview")}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
              {t("invoiceNumber.previewLabel")}
            </h3>
            <Badge variant="primary" size="xs">{selectedTemplate?.name}</Badge>
          </div>
        </div>
        {previewing && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
      </div>
      <div className="mt-4 rounded-xl border border-[rgb(var(--color-border-primary))]/50 bg-[rgb(var(--color-bg-secondary))] px-4 py-5">
        <p className="overflow-x-auto whitespace-nowrap font-mono text-lg font-bold tracking-wide text-[rgb(var(--color-primary))]">
          {preview || t("invoiceNumber.preview")}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[rgb(var(--color-border-primary))]/40 pt-3">
        {templateTokens.map((token) => (
          <span key={token} className="inline-flex items-center gap-2 text-xs font-medium text-[rgb(var(--color-text-secondary))]">
            <span className={`h-1.5 w-1.5 rounded-full ${TOKEN_STYLES[token] || "bg-[rgb(var(--color-primary))]"}`} />
            {token.replaceAll("_", " ")}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-[rgb(var(--color-text-tertiary))]">{t("invoiceNumber.previewHint")}</p>
    </section>
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-5 overflow-hidden">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--color-primary))]/25 bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
          <Hash className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{t("invoiceNumber.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("invoiceNumber.description")}
          </p>
        </div>
        </div>
        {templates.length > 0 && (
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsPreviewOpen(true)} leftIcon={Eye}>
              {t("invoiceNumber.livePreview")}
            </Button>
            <Button type="button" onClick={(event) => { event.preventDefault(); handleSave(event); }} disabled={!hasUnsavedChanges || saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="ml-2">{t("invoiceNumber.save")}</span>
            </Button>
          </div>
        )}
      </div>

      {templates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-primary))]/30 p-10 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("invoiceNumber.noTemplates")}
          </p>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-hidden">
            <section className="h-full min-h-0 overflow-hidden">
              <div className="grid h-full content-start grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((item) => {
                  const isSelected =
                    String(item.id) === String(form.templateId);
                  const isCurrent = String(item.id) === String(savedTemplateId);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => updateField("templateId", item.id)}
                      className={`relative flex min-h-44 flex-col overflow-hidden rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]/40 ${
                        isSelected
                          ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10"
                          : "border-[rgb(var(--color-border-primary))]/80 bg-[rgb(var(--color-bg-primary))] hover:border-[rgb(var(--color-primary))]/40 hover:bg-[rgb(var(--color-bg-secondary))]/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold leading-5 text-[rgb(var(--color-text-primary))]">
                            {item.name}
                          </span>
                          {isCurrent && (
                            <Badge variant="primary" size="xs">
                              {t("invoiceNumber.currentFormat")}
                            </Badge>
                          )}
                          {item.isDefault && !isCurrent && (
                            <Badge variant="outline" size="xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))] text-white"
                              : "border-[rgb(var(--color-text-tertiary))] bg-[rgb(var(--color-bg-primary))]"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </span>
                      </div>
                      <p className="mt-2 min-h-10 line-clamp-2 text-xs leading-5 text-[rgb(var(--color-text-secondary))]">
                        {item.description}
                      </p>
                      <div
                        className={`mt-auto rounded-lg border px-3 py-2.5 font-mono text-xs font-bold text-[rgb(var(--color-text-primary))] ${
                          isSelected
                            ? "border-[rgb(var(--color-primary))]/25 bg-[rgb(var(--color-primary))]/10"
                            : "border-[rgb(var(--color-border-primary))]/50 bg-[rgb(var(--color-bg-secondary))]"
                        }`}
                      >
                        {item.example}
                      </div>
                      <div className="mt-2 flex min-w-0 items-center gap-2">
                        <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))]">
                          Pattern
                        </span>
                        <code className="truncate text-[10px] text-[rgb(var(--color-text-secondary))]">
                          {item.template}
                        </code>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </>
      )}
      <SideDrawer isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title={t("invoiceNumber.livePreview")} icon={FileText} width="w-full md:w-2/3 lg:w-1/2">
        <div className="h-full overflow-y-auto p-5">{previewPanel}</div>
      </SideDrawer>
    </div>
  );
}
