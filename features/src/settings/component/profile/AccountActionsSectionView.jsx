"use client";
export function AccountActionsSectionView({ model }) {
  const { t } = model;
  return (
    <div className="mt-6 pt-6 border-t border-[rgb(var(--color-border-primary))]">
      <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">
        {t("settings.accountActions")}
      </h4>
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 text-sm text-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))]/30 rounded-lg hover:bg-[rgb(var(--color-primary))]/10 transition-colors">
          {t("settings.changePassword")}
        </button>
        <button className="px-4 py-2 text-sm text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors">
          {t("settings.downloadAccountData")}
        </button>
      </div>
    </div>
  );
}
