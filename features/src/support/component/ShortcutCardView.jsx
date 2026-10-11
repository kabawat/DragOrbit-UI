"use client";
import { ChevronDown } from "lucide-react";
export function ShortcutCardView({ model }) {
  const { onToggle, CategoryIcon, category, isOpen, ShortcutKeyBadge } = model;
  return (
    <div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full bg-[rgb(var(--color-bg-secondary))]/30 px-6 py-5 border-b border-[rgb(var(--color-border-primary))] flex items-center gap-4 cursor-pointer hover:bg-[rgb(var(--color-bg-secondary))]/50 transition-colors text-left"
      >
        <div className="p-2.5 bg-[rgb(var(--color-bg-primary))] rounded-xl text-[rgb(var(--color-primary))] border border-[rgb(var(--color-border-primary))]/50 flex-shrink-0">
          <CategoryIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[rgb(var(--color-text-primary))]">
            {category.title}
          </h3>
          <p className="text-xs text-[rgb(var(--color-text-tertiary))] font-medium">
            {category.description}
          </p>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-bold bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))]/20 flex-shrink-0">
          {category.items.length}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[rgb(var(--color-text-tertiary))] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Body */}
      <div
        style={{
          maxHeight: isOpen ? "9999px" : "0px",
          opacity: isOpen ? 1 : 0,
          transition: "max-height 0.35s ease, opacity 0.25s ease",
          overflow: "hidden",
        }}
      >
        <div className="divide-y divide-[rgb(var(--color-border-primary))]/50">
          {category.items.map((item, i) => (
            <div
              key={i}
              className="px-6 py-3.5 flex items-center justify-between hover:bg-[rgb(var(--color-bg-secondary))]/40 transition-colors group"
            >
              <span className="text-[rgb(var(--color-text-secondary))] text-sm font-medium">
                {item.action}
              </span>
              <ShortcutKeyBadge keys={item.keys} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
