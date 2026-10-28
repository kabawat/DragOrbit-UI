"use client";
import { Bell, Check } from "lucide-react";
import { Tooltip as SharedTooltip } from "../tooltip/Tooltip";
import { translateLabel } from "./translateLabel";
import { usePopover } from "./usePopover";
export function NotificationBell({
  notifications = [],
  unreadCount = 0,
  onMarkAllRead,
  onNotificationClick,
  getAppearance = () => ({}),
  t = (key) => key,
}) {
  const { open, setOpen, ref, triggerRef, id } = usePopover();
  return (
    <div className="relative" ref={ref}>
      <button
        aria-label={translateLabel(t, "notifications.title", "Notifications")}
        aria-expanded={open}
        aria-controls={id}
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group cursor-pointer active:scale-95 ${
          open
            ? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]"
            : "bg-[rgb(var(--color-bg-tertiary))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))]"
        }`}
      >
        <Bell
          className={`w-[18px] h-[18px] ${open ? "scale-110" : "group-hover:rotate-12"}`}
        />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[rgb(var(--color-danger))] text-white text-[0.625rem] font-bold rounded-full border-2 border-[rgb(var(--color-bg-primary))] flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id={id}
          className="absolute right-0 top-full mt-3 w-96 max-w-[calc(100vw-2rem)] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/50 rounded-xl shadow-sm overflow-hidden z-[9999]"
        >
          <div className="p-4 border-b border-[rgb(var(--color-border-primary))]/50 flex items-center justify-between bg-gradient-to-r from-[rgb(var(--color-bg-secondary))]/50 to-transparent">
            <div>
              <h3 className="font-bold text-sm text-[rgb(var(--color-text-primary))]">
                {translateLabel(t, "notifications.title", "Notifications")}
              </h3>
              <p className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] mt-0.5">
                {translateLabel(
                  t,
                  "notifications.unreadCount",
                  `You have ${unreadCount} unread messages`,
                  { count: unreadCount }
                )}
              </p>
            </div>
            <SharedTooltip content={translateLabel(
                t,
                "notifications.markAllRead",
                "Mark all as read"
              )}><button aria-label={translateLabel(
                t,
                "notifications.markAllRead",
                "Mark all as read"
              )}
              type="button"
              onClick={onMarkAllRead}
              className="p-1.5 hover:bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-primary))] rounded-lg transition-colors cursor-pointer"

            >
              <Check className="w-4 h-4" />
            </button></SharedTooltip>
          </div>

          <div className="max-h-[350px] overflow-y-auto scrollbar-hide py-1">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const config = getAppearance(notification);
                return (
                  <button
                    type="button"
                    key={notification.id}
                    onClick={() => {
                      onNotificationClick?.(notification);
                      setOpen(false);
                    }}
                    className={`group relative w-full text-left px-4 py-3 flex gap-3 transition-all duration-200 hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer ${notification.unread ? "bg-[rgb(var(--color-primary))]/5" : ""}`}
                  >
                    {notification.unread && (
                      <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-[rgb(var(--color-primary))] rounded-r-full" />
                    )}
                    <div
                      className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${
                        notification.unread
                          ? "bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/50"
                          : "bg-[rgb(var(--color-bg-tertiary))]"
                      }`}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[0.8125rem] leading-snug ${
                          notification.unread
                            ? "font-semibold text-[rgb(var(--color-text-primary))]"
                            : "text-[rgb(var(--color-text-secondary))]"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] font-medium uppercase tracking-wider">
                          {notification.time}
                        </span>
                        {notification.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-primary))] animate-pulse" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-10 px-4 text-center">
                <Bell className="w-6 h-6 text-[rgb(var(--color-text-tertiary))] mx-auto mb-2" />
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  {translateLabel(
                    t,
                    "notifications.noNotifications",
                    "No notifications yet"
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
