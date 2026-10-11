"use client";
import { Select, Toggle } from "@dragorbit/ui";
export function AccountPreferencesSectionView({ model }) {
  const {
    t,
    settings,
    onChange,
    languageOptions,
    timezoneOptions,
    dateFormatOptions,
    currencyOptions,
  } = model;
  return (
    <div className="bg-[rgb(var(--color-bg-primary))]/20 backdrop-blur-md rounded-lg border border-[rgb(var(--color-border-primary))]/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
          {t("settings.accountPreferences")}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label={t("settings.language")}
          value={settings.language}
          onChange={(value) => onChange("language", value)}
          options={languageOptions}
          placeholder={t("settings.selectLanguage")}
          size="md"
        />

        <Select
          label={t("settings.timezone")}
          value={settings.timezone}
          onChange={(value) => onChange("timezone", value)}
          options={timezoneOptions}
          placeholder={t("settings.selectTimezone")}
          size="md"
        />

        <Select
          label={t("settings.dateFormat")}
          value={settings.dateFormat}
          onChange={(value) => onChange("dateFormat", value)}
          options={dateFormatOptions}
          placeholder={t("settings.selectDateFormat")}
          size="md"
        />

        <Select
          label={t("settings.currency")}
          value={settings.currency}
          onChange={(value) => onChange("currency", value)}
          options={currencyOptions}
          placeholder={t("settings.selectCurrency")}
          size="md"
        />
      </div>

      <div className="mt-6 pt-6 border-t border-[rgb(var(--color-border-primary))]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {t("settings.autoSave")}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-secondary))]">
              {t("settings.autoSaveDescription")}
            </p>
          </div>
          <Toggle
            checked={settings.autoSave}
            onChange={() => onChange("autoSave", !settings.autoSave)}
          />
        </div>
      </div>
    </div>
  );
}
