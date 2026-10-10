"use client";
import { Check, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { usePopover } from "./usePopover";
export function StoreSelector({
	stores = [],
	selectedId,
	onChange,
	isCollapsed = false,
	busy = false,
	selectLabel = "Select store",
	unavailableLabel = "N/A",
	getId = (store) => store.id,
	getName = (store) => store.name,
	getSubtitle = () => null,
}) {
	const { open, setOpen, ref, triggerRef, id } = usePopover();
	useEffect(() => {
		if (isCollapsed) setOpen(false);
	}, [isCollapsed, setOpen]);
	const selected = stores.find(
		(store) => String(getId(store)) === String(selectedId),
	);
	if (isCollapsed || !stores.length) return null;
	return (
		<div className="p-3 border-b border-[rgb(var(--color-border-primary))]">
			<div className="relative" ref={ref}>
				<button
					type="button"
					ref={triggerRef}
					disabled={busy}
					aria-expanded={open}
					aria-controls={id}
					onClick={() => setOpen((value) => !value)}
					className="flex w-full items-center justify-between gap-2 p-2 text-left bg-[rgb(var(--color-primary))]/5 border-2 border-[rgb(var(--color-primary))]/10 rounded-lg hover:bg-[rgb(var(--color-primary))]/10 disabled:opacity-60"
				>
					<div className="min-w-0">
						<div className="truncate font-semibold text-sm text-[rgb(var(--color-text-primary))]">
							{selected ? getName(selected) : selectLabel}
						</div>
						<div className="truncate text-xs text-[rgb(var(--color-text-secondary))]">
							{selected ? getSubtitle(selected) : unavailableLabel}
						</div>
					</div>
					<ChevronDown
						className={`w-3 h-3 shrink-0 text-[rgb(var(--color-primary))] ${open ? "rotate-180" : ""}`}
					/>
				</button>
				{open && (
					<div
						id={id}
						className="absolute top-full left-0 right-0 mt-1 bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg shadow-lg z-[9999] p-1 max-h-64 overflow-y-auto custom-scrollbar"
					>
						{stores.map((store) => (
							<button
								type="button"
								key={getId(store)}
								disabled={busy}
								onClick={() => {
									setOpen(false);
									onChange?.(store);
								}}
								className="flex w-full text-left items-center justify-between gap-2 p-2 rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] disabled:opacity-60"
							>
								<div className="min-w-0">
									<div className="truncate font-medium text-sm text-[rgb(var(--color-text-primary))]">
										{getName(store)}
									</div>
									<div className="truncate text-xs text-[rgb(var(--color-text-secondary))]">
										{getSubtitle(store)}
									</div>
								</div>
								{String(getId(store)) === String(selectedId) && (
									<Check className="w-3 h-3 shrink-0 text-[rgb(var(--color-primary))]" />
								)}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
