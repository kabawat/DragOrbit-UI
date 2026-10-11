"use client";
import { Languages, Check } from "lucide-react";
export function LanguageSettingsView({ model }) {
  const { t, locales, changeLanguage, locale, localeNames } = model;
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">
          {t("settings.languageSettings") || "Language Settings"}
        </h2>
        <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
          {t("settings.customizeLanguage") ||
            "Choose your preferred language for the application."}
        </p>
      </div>

      <div className="bg-[rgb(var(--color-bg-primary))]/20 backdrop-blur-md rounded-lg border border-[rgb(var(--color-border-primary))]/50 p-6">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center gap-2">
          <Languages className="w-4 h-4" />
          {t("settings.chooseLanguage") || "Select Language"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => changeLanguage(loc)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                locale === loc
                  ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10"
                  : "border-[rgb(var(--color-border-primary))] hover:border-[rgb(var(--color-primary))]/50 hover:bg-[rgb(var(--color-bg-secondary))]"
              }`}
            >
              <div className="flex flex-col items-start text-left">
                <span
                  className={`text-base font-semibold ${
                    locale === loc
                      ? "text-[rgb(var(--color-primary))]"
                      : "text-[rgb(var(--color-text-primary))]"
                  }`}
                >
                  {localeNames[loc]}
                </span>
                <span className="text-xs text-[rgb(var(--color-text-secondary))] capitalize">
                  {loc === "hi-en" ? "Hindi + English mix" : loc}
                </span>
              </div>
              {locale === loc && (
                <div className="w-6 h-6 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center shadow-lg shadow-[rgb(var(--color-primary))]/20">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <p className="text-xs text-blue-500/80 leading-relaxed">
          {t("settings.languageNote") ||
            "Note: Changing the language will update the entire application interface. Some specific data provided by you (like product names) will remain in the language it was entered."}
        </p>
      </div>
    </div>
  );
}
