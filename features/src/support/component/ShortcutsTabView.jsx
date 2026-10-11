"use client";
import { Keyboard, Zap } from "lucide-react";
export function ShortcutsTabView({ model }) {
  const {
    t,
    leftCards,
    ShortcutCard,
    expandedCards,
    toggleCard,
    rightCards,
    shortcutCategories,
  } = model;
  return (
    <div className="space-y-8 max-h-full overflow-y-auto pr-2 pb-10">
      {/* Pro Tip Banner */}
      <div className="bg-gradient-to-r from-[rgb(var(--color-primary))]/10 via-[rgb(var(--color-primary))]/5 to-transparent border border-[rgb(var(--color-primary))]/20 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 bg-[rgb(var(--color-bg-primary))] rounded-xl flex items-center justify-center text-[rgb(var(--color-primary))] flex-shrink-0 animate-pulse">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h4 className="text-[rgb(var(--color-text-primary))] font-bold text-lg mb-1">
              {t("suggestions.shortcuts.ui.masterWorkflow") ||
                "Master the Workflow"}
            </h4>
            <p className="text-[rgb(var(--color-text-secondary))] text-sm leading-relaxed max-w-3xl">
              {t("suggestions.shortcuts.ui.workflowDescription") ||
                "DragBizz Pro supports deep keyboard integration. Every shortcut is designed to keep your hands on the keyboard and your business moving faster. Start with Shift+N for new entries or Alt+H to go home."}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop: two columns */}
      <div className="hidden xl:flex gap-8 items-start">
        <div className="flex-1 flex flex-col gap-8">
          {leftCards.map(({ cat, idx }) => (
            <ShortcutCard
              key={idx}
              category={cat}
              isOpen={expandedCards[idx]}
              onToggle={() => toggleCard(idx)}
            />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-8">
          {rightCards.map(({ cat, idx }) => (
            <ShortcutCard
              key={idx}
              category={cat}
              isOpen={expandedCards[idx]}
              onToggle={() => toggleCard(idx)}
            />
          ))}
        </div>
      </div>

      {/* Mobile: single column */}
      <div className="flex xl:hidden flex-col gap-8">
        {shortcutCategories.map((cat, idx) => (
          <ShortcutCard
            key={idx}
            category={cat}
            isOpen={expandedCards[idx]}
            onToggle={() => toggleCard(idx)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-full text-xs text-[rgb(var(--color-text-tertiary))] font-medium">
          <Keyboard className="w-3.5 h-3.5" />
          {t("suggestions.shortcuts.ui.proTip") ||
            "Pro tip: Use these shortcuts to work up to 2x faster."}
        </div>
      </div>
    </div>
  );
}
