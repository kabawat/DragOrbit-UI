"use client";
import React from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
export const SidebarHeader = ({
	title,
	logo,
	isCollapsed = false,
	onToggle,
	expandLabel = "Expand sidebar",
	collapseLabel = "Collapse sidebar",
}) => {
	return (
		<>
			{/* Logo Section */}
			<div className="px-4 py-4 border-b border-[rgb(var(--color-border-primary))]">
				<div className="flex items-center justify-center">
					<div className="flex items-center space-x-2">
						<div className="w-6 h-6 bg-[rgb(var(--color-primary))] rounded-lg flex items-center justify-center">
							{logo || <ShoppingCart className="w-4 h-4 text-white" />}
						</div>
						{!isCollapsed && (
							<span className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
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
					className="absolute cursor-pointer w-7 h-7 rounded-full border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors flex items-center justify-center shadow-sm translate-x-3 -translate-y-3"
					aria-label={isCollapsed ? expandLabel : collapseLabel}
				>
					{isCollapsed ? (
						<ChevronRight className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
					) : (
						<ChevronLeft className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
					)}
				</button>
			</div>
		</>
	);
};
