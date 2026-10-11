"use client";
import { Button, Input } from "@dragorbit/ui";
import { Download } from "lucide-react";
export function TallyExportDrawerView({ model }) {
  const {
    t,
    from,
    setFrom,
    to,
    setTo,
    onClose,
    handleExport,
    isLoading,
    isGenerating,
  } = model;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-lg space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {t("integrations.tallyExportTitle")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t("integrations.tallyExportDesc")}
          </p>
        </div>
        <Input
          label={t("integrations.fromDate")}
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Input
          label={t("integrations.toDate")}
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleExport} disabled={isLoading || isGenerating}>
            <Download className="w-4 h-4 mr-2" />
            {isGenerating
              ? t("integrations.exporting")
              : t("integrations.downloadXml")}
          </Button>
        </div>
      </div>
    </div>
  );
}
