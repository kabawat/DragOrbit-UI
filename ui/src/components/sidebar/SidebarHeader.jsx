"use client";
import {
	ChevronLeft,
	ChevronRight,
	ShoppingCart,
	Lock,
	LockOpen,
} from "lucide-react";
export const SidebarHeader = ({
	title,
	logo,
	isCollapsed = false,
	onToggle,
	expandLabel = "Expand sidebar",
	collapseLabel = "Collapse sidebar",
	toggleMode = "collapse",
	locked = false,
	lockLabel = "Keep sidebar expanded",
	unlockLabel = "Unlock sidebar",
}) => {
	return (
		<>
			{/* Logo Section */}
			<div className="overflow-hidden px-4 py-4 border-b border-[rgb(var(--color-border-primary))]">
				<div className="flex items-center justify-center">
					<div className="flex items-center space-x-2">
						<div className="w-6 h-6 bg-[rgb(var(--color-primary))] rounded-lg flex items-center justify-center">
							{logo || <ShoppingCart className="w-4 h-4 text-white" />}
						</div>
						{!isCollapsed && (
							<span className="whitespace-nowrap text-lg font-bold text-[rgb(var(--color-text-primary))]">
								{title}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Toggle Button */}
			<div className="relative flex justify-end">
				<button
					type="button"
					onClick={onToggle}
					className="absolute cursor-pointer w-7 h-7 rounded-full border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors flex items-center justify-center translate-x-3 -translate-y-3"
					aria-label={
						toggleMode === "lock"
							? locked
								? unlockLabel
								: lockLabel
							: isCollapsed
								? expandLabel
								: collapseLabel
					}
					aria-pressed={toggleMode === "lock" ? locked : undefined}
				>
					{toggleMode === "lock" ? (
						locked ? (
							<Lock
								className="w-4 h-4 text-[rgb(var(--color-primary))]"
								aria-hidden
							/>
						) : (
							<LockOpen
								className="w-4 h-4 text-[rgb(var(--color-text-secondary))]"
								aria-hidden
							/>
						)
					) : isCollapsed ? (
						<ChevronRight className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
					) : (
						<ChevronLeft className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
					)}
				</button>
			</div>
		</>
	);
};
