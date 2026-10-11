"use client";
export function PersonalInfoCardView({ model }) {
  const { Icon, label, getValueClasses, value } = model;
  return (
    <div className="p-4 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/60">
      <div className="flex items-center gap-2 mb-1">
        {Icon ? (
          <Icon className="w-4 h-4 text-[rgb(var(--color-text-tertiary))]" />
        ) : (
          <span className="w-4 h-4 rounded-full bg-[rgb(var(--color-border-primary))]/60" />
        )}
        <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-tertiary))]">
          {label}
        </p>
      </div>
      <p className={getValueClasses()}>{value || "-"}</p>
    </div>
  );
}
