"use client";
import { ChevronDown, User } from "lucide-react";
import { usePopover } from "./usePopover";

export function UserProfileMenu({
  name,
  role,
  avatarUrl,
  actions = [],
  label = name || "User profile",
}) {
  const { open, setOpen, ref, triggerRef, id } = usePopover();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        ref={triggerRef}
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl transition-all duration-150 hover:bg-[rgb(var(--color-bg-secondary))] active:scale-[0.98] cursor-pointer select-none border border-transparent hover:border-[rgb(var(--color-border-primary))]/50"
      >
        <span className="w-8 h-8 shrink-0 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] rounded-full flex items-center justify-center overflow-hidden border border-[rgb(var(--color-border-primary))]/30 shadow-xs">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </span>
        <span className="hidden sm:block min-w-0 max-w-40 text-left">
          <span className="block truncate text-xs font-semibold text-[rgb(var(--color-text-primary))]">
            {name}
          </span>
          <span className="block truncate text-[11px] text-[rgb(var(--color-text-secondary))]">
            {role}
          </span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))] transition-transform duration-200 ${
            open ? "rotate-180 text-[rgb(var(--color-primary))]" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id={id}
          className="absolute right-0 top-full mt-2 w-48 max-w-[calc(100vw-2rem)] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-xl shadow-xl shadow-black/10 z-[9999] p-1.5 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150"
        >
          {actions.map((action, index) => {
            const isDanger = Boolean(action.danger);
            return (
              <div key={action.id || index}>
                {isDanger && (
                  <div className="my-1 border-t border-[rgb(var(--color-border-primary))]" />
                )}
                <button
                  type="button"
                  disabled={action.disabled}
                  onClick={() => {
                    setOpen(false);
                    action.onClick?.();
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-medium rounded-lg transition-colors duration-150 flex items-center justify-between select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                    isDanger
                      ? "text-[rgb(var(--color-danger))] hover:bg-[rgb(var(--color-danger))]/10 active:bg-[rgb(var(--color-danger))]/20"
                      : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] active:bg-[rgb(var(--color-bg-tertiary))]"
                  }`}
                >
                  <span>{action.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
