"use client";
import {
  Moon,
  Sun,
  Check,
  RotateCcw,
  Layout,
  Palette,
  Monitor,
} from "lucide-react";
import { DragAiIcon } from "@dragorbit/ui";
export function AppearanceSettingsView({ model }) {
  const {
    t,
    resetAppearance,
    currentVariant,
    handleToggleVariant,
    themeCategories,
    setActiveCategory,
    activeCategory,
    themes,
    currentTheme,
    changeTheme,
    TrendingUp,
  } = model;
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between group">
        <div>
          <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] flex items-center gap-2">
            <Palette className="w-6 h-6 text-[rgb(var(--color-primary))]" />
            {t("settings.appearance")}
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
            {t("settings.appearanceDescription")}
          </p>
        </div>
        <button
          onClick={resetAppearance}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] bg-[rgb(var(--color-bg-primary))]/40 hover:bg-[rgb(var(--color-primary))]/10 rounded-lg border border-[rgb(var(--color-border-primary))]/50 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t("settings.resetToDefaults")}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configs */}
        <div className="xl:col-span-8 space-y-8">
          {/* Theme Mode Selection */}
          <section className="bg-[rgb(var(--color-bg-primary))]/30 backdrop-blur-md rounded-2xl border border-[rgb(var(--color-border-primary))]/50 p-6 overflow-hidden relative">
            <div className="flex items-center gap-2 mb-6">
              <Monitor className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">
                {t("settings.interfaceMode")}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Mode Card */}
              <button
                onClick={() =>
                  currentVariant !== "light" && handleToggleVariant()
                }
                className={`relative px-4 py-4 rounded-xl border-2 transition-all duration-300 group ${
                  currentVariant === "light"
                    ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 ring-4 ring-[rgb(var(--color-primary))]/10"
                    : "border-[rgb(var(--color-border-primary))]/40 hover:border-[rgb(var(--color-primary))]/40 bg-[rgb(var(--color-bg-primary))]/20"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      currentVariant === "light"
                        ? "bg-amber-500 text-white scale-110"
                        : "bg-amber-500/20 text-amber-500 group-hover:bg-amber-500/30 group-hover:scale-105"
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p
                      className={`font-semibold ${currentVariant === "light" ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-primary))]"}`}
                    >
                      {t("settings.lightMode")}
                    </p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                      {t("settings.lightModeDescription")}
                    </p>
                  </div>
                </div>
                {currentVariant === "light" && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[rgb(var(--color-primary))] rounded-full flex items-center justify-center animate-in zoom-in">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>

              {/* Dark Mode Card */}
              <button
                onClick={() =>
                  currentVariant !== "dark" && handleToggleVariant()
                }
                className={`relative px-4 py-4 rounded-xl border-2 transition-all duration-300 group ${
                  currentVariant === "dark"
                    ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 ring-4 ring-[rgb(var(--color-primary))]/10"
                    : "border-[rgb(var(--color-border-primary))]/40 hover:border-[rgb(var(--color-primary))]/40 bg-[rgb(var(--color-bg-primary))]/20"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      currentVariant === "dark"
                        ? "bg-indigo-600 text-white scale-110"
                        : "bg-indigo-600/20 text-indigo-600 group-hover:bg-indigo-600/30 group-hover:scale-105"
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p
                      className={`font-semibold ${currentVariant === "dark" ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-primary))]"}`}
                    >
                      {t("settings.darkMode")}
                    </p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                      {t("settings.darkModeDescription")}
                    </p>
                  </div>
                </div>
                {currentVariant === "dark" && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[rgb(var(--color-primary))] rounded-full flex items-center justify-center animate-in zoom-in">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            </div>
          </section>

          {/* Color Themes Section */}
          <section className="bg-[rgb(var(--color-bg-primary))]/30 backdrop-blur-md rounded-2xl border border-[rgb(var(--color-border-primary))]/50 p-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <DragAiIcon className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" aria-hidden="true" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">
                  {t("settings.accentThemes")}
                </h3>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1 bg-[rgb(var(--color-bg-primary))]/50 p-1 rounded-xl border border-[rgb(var(--color-border-primary))]/30">
                {Object.keys(themeCategories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                      activeCategory === cat
                        ? "bg-[rgb(var(--color-primary))] text-white"
                        : "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-primary))]/10 hover:text-[rgb(var(--color-primary))]"
                    }`}
                  >
                    {t(`settings.${cat}Category`)}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300"
              key={activeCategory}
            >
              {themeCategories[activeCategory].map((themeKey) => {
                const theme = themes[themeKey];
                const isSelected = currentTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => changeTheme(themeKey)}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      isSelected
                        ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 ring-4 ring-[rgb(var(--color-primary))]/10"
                        : "border-[rgb(var(--color-border-primary))]/40 hover:border-[rgb(var(--color-primary))]/40 bg-[rgb(var(--color-bg-primary))]/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor:
                            theme.colors[
                              currentVariant === "dark" ? "dark" : "light"
                            ].primary || theme.colors.light.primary,
                        }}
                      >
                        <Palette className="w-5 h-5 text-white/90" />
                      </div>
                      <div>
                        <p
                          className={`text-sm font-bold ${isSelected ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-primary))]"}`}
                        >
                          {t(`settings.themes.${themeKey}.name`) || theme.name}
                        </p>
                        <p className="text-[0.625rem] text-[rgb(var(--color-text-secondary))] truncate uppercase tracking-widest font-bold opacity-70">
                          {t(`settings.${activeCategory}Category`)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))] line-clamp-2 leading-relaxed">
                      {t(`settings.themes.${themeKey}.description`) ||
                        theme.description}
                    </p>

                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-[rgb(var(--color-primary))] rounded-full flex items-center justify-center border-2 border-[rgb(var(--color-bg-primary))] animate-in zoom-in">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Dynamic Preview */}
        <div className="xl:col-span-4 sticky top-6">
          <section className="bg-[rgb(var(--color-bg-primary))]/30 backdrop-blur-md rounded-2xl border border-[rgb(var(--color-border-primary))]/50 p-6 overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <Layout className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">
                {t("settings.livePreview")}
              </h3>
            </div>

            {/* Mock Dashboard Card */}
            <div className="rounded-xl border border-[rgb(var(--color-border-primary))]/60 overflow-hidden relative bg-[rgb(var(--color-bg-secondary))] transition-colors duration-500">
              <div className="h-12 bg-[rgb(var(--color-bg-primary))]/80 border-b border-[rgb(var(--color-border-primary))]/40 px-4 flex items-center justify-between">
                <div className="w-24 h-2 bg-[rgb(var(--color-text-tertiary))]/30 rounded-full" />
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-[rgb(var(--color-primary))]/20 rounded-full" />
                  <div className="w-4 h-4 bg-[rgb(var(--color-text-tertiary))]/20 rounded-full" />
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgb(var(--color-primary))] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="w-2/3 h-2 bg-[rgb(var(--color-text-secondary))]/20 rounded-full" />
                    <div className="w-1/2 h-4 bg-[rgb(var(--color-text-primary))]/10 rounded-lg" />
                  </div>
                </div>

                <div className="h-24 bg-[rgb(var(--color-primary))]/5 rounded-xl border border-[rgb(var(--color-primary))]/20 flex flex-col justify-end p-3 gap-2">
                  <div className="flex items-end gap-1 h-full">
                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[rgb(var(--color-primary))] rounded-t-sm opacity-60 hover:opacity-100 transition-opacity"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 bg-[rgb(var(--color-primary))] text-white text-[0.625rem] font-bold rounded-lg flex items-center justify-center">
                    {t("settings.mainButton")}
                  </div>
                  <div className="h-10 bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-secondary))] text-[0.625rem] font-bold rounded-lg flex items-center justify-center">
                    {t("settings.secondaryButton")}
                  </div>
                </div>
              </div>

              {/* Overlay Badge */}
              <div className="absolute top-14 right-4 animate-bounce">
                <div className="bg-emerald-500 text-white text-[0.5rem] font-bold px-2 py-1 rounded-full">
                  {t("settings.activeNow")}
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-[rgb(var(--color-primary))]/5 rounded-xl border border-[rgb(var(--color-primary))]/10">
              <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed italic text-center">
                "{t("settings.appearanceNote")}"
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
