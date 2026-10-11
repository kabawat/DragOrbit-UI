"use client";
import { Plus } from "lucide-react";

// Renders key combo badges: [Ctrl] + [S]
const ShortcutKeyBadge = ({ keys = [] }) => (
  <div className="flex items-center translate-y-[1px]">
    {keys.map((key, k) => (
      <div key={k} className="flex items-center">
        <span className="px-2 py-1 min-w-[34px] text-center bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded text-[0.625rem] font-black text-[rgb(var(--color-text-primary))] uppercase group-hover:border-[rgb(var(--color-primary))]/30 transition-colors">
          {key}
        </span>
        {k < keys.length - 1 && (
          <Plus
            className="mx-1.5 w-2.5 h-2.5 text-[rgb(var(--color-text-tertiary))]"
            strokeWidth={3}
          />
        )}
      </div>
    ))}
  </div>
);

export default ShortcutKeyBadge;
