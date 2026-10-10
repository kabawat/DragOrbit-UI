"use client";

import { MoreVertical } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ComponentType, KeyboardEvent } from "react";

export type TableRowAction = {
  id: string;
  label: string;
  onClick: () => void;
  icon?: ComponentType<{ className?: string }>;
  hidden?: boolean;
  disabled?: boolean;
  tone?: "default" | "danger" | "success";
};

export function TableRowActions({ actions, label = "Row actions" }: { actions: readonly TableRowAction[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();
  const items = actions.filter(action => !action.hidden);
  const close = (restoreFocus = false) => { setOpen(false); if (restoreFocus) trigger.current?.focus(); };

  useLayoutEffect(() => {
    if (!open || !trigger.current || !menu.current) return;
    const anchor = trigger.current.getBoundingClientRect();
    const bounds = menu.current.getBoundingClientRect();
    const top = anchor.bottom + 4 + bounds.height <= window.innerHeight - 8 ? anchor.bottom + 4 : Math.max(8, anchor.top - bounds.height - 4);
    setPosition({ left: Math.max(8, Math.min(anchor.right - bounds.width, window.innerWidth - bounds.width - 8)), top });
    menu.current.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { const target = event.target as Node; if (!menu.current?.contains(target) && !trigger.current?.contains(target)) setOpen(false); };
    const dismiss = () => setOpen(false);
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); setOpen(false); trigger.current?.focus(); } };
    const scroll = (event: Event) => { if (event.target instanceof Node && menu.current?.contains(event.target)) return; dismiss(); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", dismiss);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); window.removeEventListener("scroll", scroll, true); window.removeEventListener("resize", dismiss); };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && buttons.length) {
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }
    if (event.key === "Tab") { event.preventDefault(); close(true); }
  }

  if (!items.length) return null;
  return <><button ref={trigger} type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(value => !value)} className="p-2 hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))]"><MoreVertical className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" aria-hidden="true" /></button>
    {open && createPortal(<div ref={menu} id={id} role="menu" aria-label={label} onKeyDown={onKeyDown} style={position} className="fixed z-[10051] w-48 max-w-[calc(100vw-16px)] max-h-[calc(100vh-16px)] overflow-auto bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1">{items.map(action => {
      const Icon = action.icon;
      const tone = action.tone === "danger" ? "text-red-600 hover:bg-red-500/10 focus:bg-red-500/10" : action.tone === "success" ? "text-emerald-600 hover:bg-emerald-500/10 focus:bg-emerald-500/10" : "text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] focus:bg-[rgb(var(--color-bg-secondary))]";
      return <button key={action.id} type="button" role="menuitem" tabIndex={-1} disabled={action.disabled} onClick={() => { close(true); action.onClick(); }} className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${tone}`}>{Icon && <Icon className="w-4 h-4" />}{action.label}</button>;
    })}</div>, document.body)}</>;
}
