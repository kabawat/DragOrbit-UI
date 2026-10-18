"use client";

/**
 * Slash-command picker shown above the chat composer.
 * No box-shadow — border only.
 */
export default function ChatSlashMenu({
	items,
	activeIndex,
	onSelect,
	onHover,
	t,
}) {
	if (!items?.length) return null;

	return (
		<div
			className="mb-2 max-h-64 overflow-y-auto rounded-2xl border border-[rgb(var(--color-border-primary))]/70 bg-[rgb(var(--color-bg-primary))]"
			role="listbox"
		>
			{items.map((item, index) => {
				const active = index === activeIndex;
				return (
					<button
						aria-selected={active}
						className={`flex w-full cursor-pointer items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
							active
								? "bg-[rgb(var(--color-bg-secondary))]"
								: "hover:bg-[rgb(var(--color-bg-secondary))]/70"
						}`}
						key={item.id}
						onClick={() => onSelect(item)}
						onMouseEnter={() => onHover?.(index)}
						role="option"
						type="button"
					>
						<span className="w-[7.5rem] shrink-0 truncate text-[13px] font-semibold text-[rgb(var(--color-text-primary))]">
							{item.command}
						</span>
						<span className="min-w-0 flex-1 truncate text-[12.5px] text-[rgb(var(--color-text-secondary))]">
							{t(item.labelKey)}
						</span>
						<span className="shrink-0 rounded-md bg-[rgb(var(--color-bg-secondary))] px-2 py-0.5 text-[10px] font-medium text-[rgb(var(--color-text-secondary))]">
							{t(item.categoryKey)}
						</span>
					</button>
				);
			})}
		</div>
	);
}
