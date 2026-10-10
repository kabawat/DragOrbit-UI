"use client";
import React from "react";
import { Crown } from "lucide-react";
import { createPortal } from "react-dom";

export const SidebarFlyout = ({
	hoveredItem,
	onMouseEnter,
	onMouseLeave,
	onClose,
	pathname = "",
	onNavigate,
	isItemLocked = () => false,
}) => {
	if (!hoveredItem || typeof document === "undefined") return null;

	return createPortal(
		<div
			className="fixed z-[200] w-auto whitespace-nowrap bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-xl shadow-xl overflow-hidden"
			style={{
				...(hoveredItem.anchorBottom !== null
					? { bottom: hoveredItem.anchorBottom } // bottom items → flyout opens upward
					: { top: hoveredItem.rect.top }), // top items → flyout opens downward
				left: hoveredItem.rect.right + 8,
				maxWidth: "calc(100vw - 80px)",
				maxHeight: "calc(100vh - 16px)",
				overflowY: "auto",
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
			onFocus={onMouseEnter}
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget)) onMouseLeave();
			}}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{/* Flyout Header */}
			<div className="px-3 py-2.5 border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]">
				<span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">
					{hoveredItem.item.name}
				</span>
			</div>

			{/* Flyout Links */}
			<div className="p-1.5 space-y-0.5">
				{hoveredItem.item.subMenuItems ? (
					// Submenu items
					hoveredItem.item.subMenuItems.map((subItem, index) => {
						const SubIcon = subItem.icon;
						const isSubActive =
							pathname === subItem.href ||
							pathname.startsWith(`${subItem.href}/`);
						const prevGroup = hoveredItem.item.subMenuItems[index - 1]?.group;
						const showGroupHeader =
							subItem.group && subItem.group !== prevGroup;
						return (
							<div key={`${subItem.href}-${subItem.name}`}>
								{showGroupHeader && (
									<div
										className={`px-3 pt-2 pb-1 text-[0.625rem] font-bold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))] ${
											index === 0 ? "pt-1" : ""
										}`}
									>
										{subItem.group}
									</div>
								)}
								<a
									href={subItem.href}
									onClick={(e) => {
										if (onNavigate) {
											e.preventDefault();
											onNavigate(subItem);
										}
										onClose();
									}}
									className={`group relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-150 ${
										isSubActive
											? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]"
											: "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))]"
									}`}
								>
									<SubIcon
										className={`w-4 h-4 flex-shrink-0 ${
											isSubActive
												? "text-[rgb(var(--color-primary))]"
												: "text-[rgb(var(--color-text-tertiary))]"
										}`}
									/>
									<span className="text-sm font-medium flex-1">
										{subItem.name}
									</span>

									{isItemLocked(subItem) && (
										<Crown size={12} className="text-[#f59e0b]" />
									)}
									{isSubActive && (
										<div className="ml-auto w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-primary))]" />
									)}
								</a>
							</div>
						);
					})
				) : (
					// Simple item (e.g. Dashboard) — single link
					<a
						href={hoveredItem.item.href}
						onClick={(e) => {
							if (onNavigate) {
								e.preventDefault();
								onNavigate(hoveredItem.item);
							}
							onClose();
						}}
						className={`group relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-150 ${
							pathname === hoveredItem.item.href
								? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]"
								: "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))]"
						}`}
					>
						<span className="text-sm font-medium flex-1">
							{hoveredItem.item.name}
						</span>
						{pathname === hoveredItem.item.href && (
							<div className="ml-auto w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-primary))]" />
						)}
					</a>
				)}
			</div>
		</div>,
		document.body,
	);
};
