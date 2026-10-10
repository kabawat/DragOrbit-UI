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
				className="flex items-center gap-2 hover:bg-[rgb(var(--color-bg-secondary))] p-1.5 rounded-lg transition-colors"
			>
				<span className="w-8 h-8 shrink-0 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] rounded-full flex items-center justify-center overflow-hidden border border-[rgb(var(--color-border-primary))]/30">
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
					<span className="block truncate text-xs font-medium text-[rgb(var(--color-text-primary))]">
						{name}
					</span>
					<span className="block truncate text-xs text-[rgb(var(--color-text-secondary))]">
						{role}
					</span>
				</span>
				<ChevronDown
					className={`w-3 h-3 text-[rgb(var(--color-text-tertiary))] ${open ? "rotate-180" : ""}`}
				/>
			</button>
			{open && (
				<div
					id={id}
					className="absolute right-0 top-full mt-2 w-44 max-w-[calc(100vw-2rem)] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg shadow-lg z-[9999] py-1"
				>
					{actions.map((action) => (
						<button
							type="button"
							key={action.id}
							disabled={action.disabled}
							onClick={() => {
								setOpen(false);
								action.onClick?.();
							}}
							className={`w-full px-3 py-1.5 text-left text-xs disabled:opacity-50 ${action.danger ? "border-t border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-danger))] hover:bg-[rgb(var(--color-danger))]/10" : "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))]"}`}
						>
							{action.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
