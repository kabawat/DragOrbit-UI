"use client";
import { AlertTriangle, Bell, RotateCcw, Settings2 } from "lucide-react";
import { Button, Modal } from "@dragorbit/ui";
export function NotificationsSettingsView({ model }) {
  const {
    t,
    handleReset,
    isUpdating,
    MASTER_CHANNEL_ORDER,
    settings,
    isPushBlocked,
    channelIcons,
    setIsPushHelpOpen,
    Toggle,
    toggleChannel,
    effectivePushPermission,
    categoryIcons,
    toggleCategoryChannel,
    isPushHelpOpen,
  } = model;
  return (
    <div className="animate-fadeIn space-y-6 pb-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold leading-6 text-[rgb(var(--color-text-primary))]">
            {t("settings.notificationSettings")}
          </h2>
          <p className="mt-0.5 text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
            {t("settings.manageNotifications")}
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={isUpdating}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[rgb(var(--color-primary))]/20 px-3 py-2 text-sm font-medium leading-5 text-[rgb(var(--color-primary))] transition-colors hover:bg-[rgb(var(--color-primary))]/10 disabled:opacity-50"
        >
          <RotateCcw
            className={`w-4 h-4 ${isUpdating ? "animate-spin" : ""}`}
          />
          {t("settings.notifications.resetToDefaults")}
        </button>
      </div>

      {/* Global Channel Settings */}
      <section className="space-y-3">
        <h3 className="px-1 text-sm font-semibold leading-5 text-[rgb(var(--color-text-secondary))]">
          {t("settings.notifications.masterChannels")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MASTER_CHANNEL_ORDER.filter((channel) =>
            Object.hasOwn(settings.channels || {}, channel),
          ).map((channel) => {
            const isEnabled = settings.channels[channel];
            const hasIssue = channel === "push" && isPushBlocked;
            return (
              <div
                key={channel}
                className={`group rounded-lg border p-4 backdrop-blur-sm transition-all ${
                  hasIssue
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "bg-[rgb(var(--color-bg-primary))]/20"
                } ${
                  !hasIssue && isEnabled
                    ? "border-[rgb(var(--color-primary))]/30"
                    : !hasIssue
                      ? "border-[rgb(var(--color-border-primary))]/50"
                      : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 transition-colors ${
                        hasIssue
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : isEnabled
                            ? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]"
                            : "bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-tertiary))]"
                      }`}
                    >
                      {channelIcons[channel] || <Bell className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-sm font-medium capitalize leading-5 ${isEnabled ? "text-[rgb(var(--color-text-primary))]" : "text-[rgb(var(--color-text-secondary))]"}`}
                    >
                      {t(`settings.notifications.${channel}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasIssue && (
                      <button
                        type="button"
                        onClick={() => setIsPushHelpOpen(true)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-amber-600 transition-colors hover:bg-amber-500/10 dark:text-amber-400"
                        aria-label={t("settings.notifications.pushIssueTitle")}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </button>
                    )}
                    <Toggle
                      enabled={isEnabled}
                      onChange={() => toggleChannel(channel)}
                      disabled={isUpdating}
                    />
                  </div>
                </div>
                {channel === "push" &&
                  effectivePushPermission === "default" && (
                    <p className="mt-3 text-xs leading-relaxed text-[rgb(var(--color-text-secondary))]">
                      {t("settings.notifications.pushPermissionDefault")}
                    </p>
                  )}
                {hasIssue && (
                  <button
                    type="button"
                    onClick={() => setIsPushHelpOpen(true)}
                    className="mt-3 flex cursor-pointer items-center gap-1.5 text-left text-xs font-medium leading-4 text-amber-600 hover:underline dark:text-amber-400"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {t("settings.notifications.pushIssueAction")}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Granular Category Settings */}
      <section className="space-y-3">
        <h3 className="px-1 text-sm font-semibold leading-5 text-[rgb(var(--color-text-secondary))]">
          {t("settings.notifications.activityCategories")}
        </h3>
        <div className="space-y-4">
          {Object.entries(settings.categories || {}).map(
            ([category, categoryChannels]) => (
              <div
                key={category}
                className="rounded-lg border border-[rgb(var(--color-border-primary))]/40 bg-[rgb(var(--color-bg-primary))]/10 p-4 backdrop-blur-md"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgb(var(--color-border-primary))]/20 bg-[rgb(var(--color-bg-primary))]/40 text-[rgb(var(--color-primary))]">
                      {categoryIcons[category] || <Bell className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
                        {t(`settings.notifications.${category}`)}
                      </h4>
                      <p className="mt-0.5 text-xs leading-4 text-[rgb(var(--color-text-secondary))]">
                        {t("settings.notifications.configureCategory")}{" "}
                        {t(`settings.notifications.${category}`)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {Object.entries(categoryChannels || {}).map(
                      ([channel, isEnabled]) => {
                        const masterEnabled = settings.channels?.[channel];
                        return (
                          <div
                            key={channel}
                            className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border transition-all ${
                              isEnabled && masterEnabled
                                ? "bg-[rgb(var(--color-primary))]/5 border-[rgb(var(--color-primary))]/20"
                                : "bg-[rgb(var(--color-bg-primary))]/20 border-transparent opacity-60"
                            }`}
                          >
                            <div
                              className={`p-1 rounded-md ${isEnabled && masterEnabled ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-tertiary))]"}`}
                            >
                              {channelIcons[channel]}
                            </div>
                            <Toggle
                              size="sm"
                              enabled={isEnabled}
                              onChange={() =>
                                toggleCategoryChannel(category, channel)
                              }
                              disabled={isUpdating || !masterEnabled}
                            />
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <Modal
        isOpen={isPushHelpOpen}
        onClose={() => setIsPushHelpOpen(false)}
        title={t("settings.notifications.pushIssueTitle")}
        size="lg"
        className="!shadow-none"
      >
        <div className="space-y-4">
          <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm leading-5 text-[rgb(var(--color-text-primary))]">
              {t("settings.notifications.pushPermissionDenied")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
              {t("settings.notifications.pushIssueSolutionTitle")}
            </h4>
            <div className="mt-3 space-y-2">
              {[
                {
                  icon: Settings2,
                  title: t("settings.notifications.pushIssueStep1Title"),
                  description: t("settings.notifications.pushIssueStep1"),
                },
                {
                  icon: Bell,
                  title: t("settings.notifications.pushIssueStep2Title"),
                  description: t("settings.notifications.pushIssueStep2"),
                },
                {
                  icon: RotateCcw,
                  title: t("settings.notifications.pushIssueStep3Title"),
                  description: t("settings.notifications.pushIssueStep3"),
                },
              ].map(({ icon: StepIcon, title, description }, index) => (
                <div
                  key={title}
                  className="flex gap-3 rounded-lg border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/30 p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
                      {index + 1}. {title}
                    </p>
                    <p className="mt-0.5 text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-[rgb(var(--color-bg-secondary))]/50 px-3 py-2 text-xs leading-5 text-[rgb(var(--color-text-secondary))]">
              {t("settings.notifications.pushIssueNote")}
            </p>
          </div>
          <div className="flex justify-end border-t border-[rgb(var(--color-border-primary))]/60 pt-4">
            <Button variant="primary" onClick={() => setIsPushHelpOpen(false)}>
              {t("common.close")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
