"use client";
import { BarChart3, Zap, AlertCircle } from "lucide-react";
import { Badge, Button, Modal } from "@dragorbit/ui";
import { Loader2 } from "lucide-react";
export function PlanLimitsScreen({ model }) {
  const {
    t,
    isKhataFree,
    isLoading,
    subscriptionData,
    onUpgrade,
    stats,
    setSelectedFeature,
    ManagementShortcuts,
    selectedFeature,
  } = model;
  return (
    <div className="p-5 h-[calc(100vh-64px)] box-border overflow-hidden flex flex-col">
      <div className="max-w-8xl mx-auto flex-1 min-h-0 w-full flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 overflow-hidden">
          {/* Main Resource Monitor (3/4) */}
          <div className="lg:col-span-3 flex flex-col min-h-0 gap-4 overflow-hidden">
            <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.4)] overflow-hidden shadow-none flex flex-col flex-1 min-h-0">
              <div className="flex-shrink-0 p-6 pb-2">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
                      {t("limits.resourceMonitor.title")}
                    </h2>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                      {isKhataFree
                        ? t("subscription.khataFree.description")
                        : t("limits.resourceMonitor.description")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-green-600">
                      {t("limits.resourceMonitor.activeMonitoring")}
                    </span>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex-1 min-h-0 flex items-center justify-center">
                  <Loader2
                    size={32}
                    className="animate-spin text-[rgb(var(--color-primary))]"
                  />
                </div>
              ) : !subscriptionData ? (
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 bg-[rgb(var(--color-primary))]/10 rounded-full flex items-center justify-center mb-6">
                    <Zap className="w-12 h-12 text-[rgb(var(--color-primary))]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-3">
                    No Active Plan
                  </h3>
                  <p className="text-[rgb(var(--color-text-secondary))] mb-8 max-w-md mx-auto">
                    You currently don't have an active subscription package.
                    Upgrade your plan to manage features and enjoy premium
                    benefits.
                  </p>
                  <Button
                    variant="primary"
                    className="px-8 py-3 rounded-xl font-semibold tracking-wide"
                    onClick={onUpgrade}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-1">
                    {stats.map((stat, idx) => {
                      const Icon = stat.icon;
                      const isUnlimited =
                        stat.limit === Infinity || stat.limit === null;
                      const isNotIncluded =
                        stat.limit === 0 && stat.usageType !== "UNLIMITED";
                      const percentage =
                        isUnlimited || isNotIncluded
                          ? 0
                          : (stat.used / stat.limit) * 100;
                      const isAtRisk = !isNotIncluded && percentage > 80;

                      return (
                        <div
                          key={idx}
                          className="group relative overflow-hidden transition-all duration-300 hover:bg-[rgb(var(--color-bg-secondary))] rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-6 border-b border-[rgb(var(--color-border-primary))]/30 last:border-0 shadow-none"
                        >
                          <div className="flex items-center gap-4 w-full md:w-[220px] flex-shrink-0">
                            <span className="text-xs font-medium text-[rgb(var(--color-text-tertiary))] w-4">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-none"
                              style={{
                                backgroundColor: `${stat.color}15`,
                                color: stat.color,
                              }}
                            >
                              <Icon size={20} className="stroke-[2]" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <h3 className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate">
                                {stat.name}
                              </h3>
                              <span className="text-xs text-[rgb(var(--color-text-tertiary))] capitalize">
                                {stat.usageType?.replace("_", " ")}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col gap-2">
                            <div className="flex justify-between items-end">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
                                    {isNotIncluded
                                      ? "—"
                                      : stat.used.toLocaleString()}
                                  </span>
                                  {!isUnlimited && !isNotIncluded && (
                                    <span className="text-sm text-[rgb(var(--color-text-tertiary))]">
                                      / {stat.limit.toLocaleString()}
                                    </span>
                                  )}
                                  <span className="text-xs font-medium text-[rgb(var(--color-primary))] mb-0.5">
                                    {t("limits.stats.consumed")}
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`text-xs font-medium ${isAtRisk ? "text-red-500" : "text-[rgb(var(--color-text-tertiary))]"}`}
                              >
                                {isUnlimited
                                  ? t("limits.stats.unlimitedAccess")
                                  : isNotIncluded
                                    ? t("limits.stats.notIncluded")
                                    : t("limits.stats.utilizedPercentage", {
                                        percentage: percentage.toFixed(0),
                                      })}
                              </span>
                            </div>
                            {!isUnlimited && !isNotIncluded ? (
                              <div className="h-2 w-full bg-[rgb(var(--color-bg-secondary))] rounded-xl overflow-hidden p-0 border border-[rgb(var(--color-border-primary))]/30 shadow-none">
                                <div
                                  className="h-full transition-all duration-1000 ease-out relative"
                                  style={{
                                    width: `${Math.min(percentage, 100)}%`,
                                    backgroundColor: stat.color,
                                  }}
                                />
                              </div>
                            ) : isUnlimited ? (
                              <div className="flex items-center gap-2">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-[rgb(var(--color-border-primary))]/30 to-transparent" />
                                <span className="text-xs font-medium text-green-500">
                                  {t("limits.stats.unlimitedPlan")}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 opacity-60">
                                <div className="h-[1px] flex-1 bg-dashed bg-gradient-to-r from-[rgb(var(--color-border-primary))]/30 to-transparent" />
                                <span className="text-xs font-medium text-[rgb(var(--color-text-tertiary))] italic">
                                  {t("limits.stats.notIncluded")}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="w-full md:w-[100px] flex items-center justify-end gap-3">
                            {isAtRisk && (
                              <AlertCircle size={16} className="text-red-500" />
                            )}
                            <Button
                              variant="ghost"
                              size="xs"
                              className="rounded-xl px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-primary))] hover:text-white"
                              onClick={() =>
                                setSelectedFeature({ ...stat, isNotIncluded })
                              }
                            >
                              {t("limits.stats.detailsBtn")}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex-shrink-0 bg-[rgb(var(--color-bg-secondary))]/30 border-t border-[rgb(var(--color-border-primary))] p-4 px-6 md:px-10 shadow-none">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Zap size={16} className="fill-current" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                            {t("limits.autoReset.title")}
                          </h4>
                          <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                            {t("limits.autoReset.description")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Side (1/4) */}
          <div className="lg:col-span-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
            <ManagementShortcuts />
            <div className="mt-4 flex-shrink-0 p-5 rounded-lg border border-[rgb(var(--color-border-primary))] border-dashed bg-[rgb(var(--color-bg-primary))]/50 shadow-none">
              <h4 className="text-xs font-medium text-[rgb(var(--color-text-tertiary))] mb-3">
                {t("limits.updates.title")}
              </h4>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-primary))] mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-tight">
                      {t(`limits.updates.message${i}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex-shrink-0 p-6 rounded-lg bg-[rgb(var(--color-primary)/0.1)] shadow-none flex flex-col justify-center">
              <h3 className="text-lg font-medium mb-2">
                {t("limits.upgrade.title")}
              </h3>
              <p className="text-sm opacity-90 mb-6 leading-relaxed">
                {t("limits.upgrade.description")}
              </p>
              <Button
                size="sm"
                className="rounded-lg text-sm px-4 border-none w-fit shadow-none"
              >
                {t("limits.upgrade.btnText")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Feature Details Modal */}
      {selectedFeature && (
        <Modal
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title={t("limits.details.title", { feature: selectedFeature.name })}
          size="md"
        >
          <div className="space-y-5 py-1">
            {/* Status Alert if not included */}
            {selectedFeature.isNotIncluded && (
              <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600">
                <AlertCircle size={18} />
                <p className="text-xs font-medium">
                  This feature is not part of your current plan.
                </p>
              </div>
            )}{" "}
            <div className="flex items-center gap-3 p-3 bg-[rgb(var(--color-bg-secondary))] rounded-xl border border-[rgb(var(--color-border-primary))]/40">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: `${selectedFeature.color}15`,
                  color: selectedFeature.color,
                }}
              >
                <selectedFeature.icon size={20} className="stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[0.5625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.1em] mb-0.5">
                  {t("limits.details.usageTitle")}
                </h4>
                <p className="text-lg font-black text-[rgb(var(--color-text-primary))] tabular-nums leading-none">
                  {selectedFeature.isNotIncluded
                    ? "0"
                    : selectedFeature.used.toLocaleString()}
                  <span className="text-xs font-medium text-[rgb(var(--color-text-tertiary))] ml-1 opacity-60">
                    /{" "}
                    {selectedFeature.limit === Infinity
                      ? "∞"
                      : selectedFeature.limit.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-xl border border-[rgb(var(--color-border-primary))]/20 group transition-all duration-300 hover:border-[rgb(var(--color-primary))]/20">
                <p className="text-[0.5625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-1">
                  {t("limits.details.remaining")}
                </p>
                <p className="text-sm font-bold text-[rgb(var(--color-text-primary))] tabular-nums">
                  {selectedFeature.limit === Infinity
                    ? "∞"
                    : selectedFeature.isNotIncluded
                      ? "0"
                      : Math.max(
                          0,
                          selectedFeature.limit - selectedFeature.used,
                        ).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-[rgb(var(--color-bg-secondary))]/40 rounded-xl border border-[rgb(var(--color-border-primary))]/20 group transition-all duration-300 hover:border-[rgb(var(--color-primary))]/20">
                <p className="text-[0.5625rem] font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-1">
                  {t("limits.details.type")}
                </p>
                <p className="text-xs font-bold text-[rgb(var(--color-text-primary))] capitalize truncate">
                  {selectedFeature.usageType
                    ?.toLowerCase()
                    ?.replace("_", " ") || "Standard"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[rgb(var(--color-primary))/0.03] to-[rgb(var(--color-primary))/0.08] rounded-xl border border-[rgb(var(--color-primary)/0.1)]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center">
                  <BarChart3
                    size={14}
                    className="text-[rgb(var(--color-primary))]"
                  />
                </div>
                <span className="text-[0.6875rem] font-semibold text-[rgb(var(--color-text-secondary))]">
                  {t("limits.details.analytics")}
                </span>
              </div>
              <Badge
                variant={selectedFeature.hasAnalytics ? "success" : "secondary"}
                className="text-[0.5rem] font-bold uppercase tracking-wider px-2 py-0 rounded-md border-none shadow-sm"
              >
                {selectedFeature.hasAnalytics
                  ? t("limits.details.active")
                  : t("limits.details.inactive")}
              </Badge>
            </div>
            {!selectedFeature.isNotIncluded &&
              selectedFeature.limit !== Infinity && (
                <div className="pt-1">
                  <Button
                    className="w-full rounded-lg font-bold text-[0.6875rem] py-2.5 shadow-sm"
                    onClick={onUpgrade}
                  >
                    Boost Limits
                  </Button>
                </div>
              )}
            {selectedFeature.isNotIncluded && (
              <div className="pt-1">
                <Button
                  className="w-full rounded-lg font-bold text-[0.6875rem] py-2.5 shadow-sm"
                  onClick={onUpgrade}
                >
                  Unlock Feature
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
