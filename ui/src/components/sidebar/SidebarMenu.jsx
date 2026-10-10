"use client";
import { useEffect, useRef, useState } from "react";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarFlyout } from "./SidebarFlyout";

export const SidebarMenu = ({
	navigationItems = [],
	bottomItems = [],
	pathname = "",
	isCollapsed = false,
	expandedMenus = {},
	onToggleMenu,
	onNavigate,
	isItemLocked,
	header,
	selector,
	className = "",
	expandedWidth = 256,
	collapsedWidth = 64,
	navigationLabel = "Main navigation",
}) => {
	const [hoveredItem, setHoveredItem] = useState(null);
	const hideTimerRef = useRef(null);
	useEffect(() => {
		setHoveredItem(null);
	}, [pathname]);

	// Close flyout when sidebar expands
	useEffect(() => {
		if (!isCollapsed) setHoveredItem(null);
	}, [isCollapsed]);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
		};
	}, []);

	// Flyout hover handlers — 100ms grace period so mouse can travel icon → flyout
	const handleMouseEnterItem = (item, e, isBottom = false) => {
		if (!isCollapsed) return;
		if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
		const rect = e.currentTarget.getBoundingClientRect();
		const anchorBottom = isBottom ? window.innerHeight - rect.bottom : null;
		setHoveredItem({ item, rect, anchorBottom });
	};

	const handleMouseLeaveItem = () => {
		if (!isCollapsed) return;
		hideTimerRef.current = setTimeout(() => setHoveredItem(null), 100);
	};

	const handleMouseEnterFlyout = () => {
		if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
	};

	const handleMouseLeaveFlyout = () => {
		hideTimerRef.current = setTimeout(() => setHoveredItem(null), 100);
	};

	return (
		<div
			className={`bg-[rgb(var(--color-bg-primary))]/80 backdrop-blur-md border-r border-[rgb(var(--color-border-primary))]/40 h-screen flex flex-col shadow-lg relative z-[150] flex-shrink-0 ${className}`}
			onKeyDown={(e) => {
				if (e.key === "Escape") setHoveredItem(null);
			}}
			style={{
				width: isCollapsed ? collapsedWidth : expandedWidth,
				minWidth: isCollapsed ? collapsedWidth : expandedWidth,
				maxWidth: isCollapsed ? collapsedWidth : expandedWidth,
				transition:
					"width 0.3s ease-in-out, min-width 0.3s ease-in-out, max-width 0.3s ease-in-out",
				willChange: "width",
			}}
		>
			{/* Fixed Header Section */}
			<div className="flex-shrink-0">
				{header}
				{selector}
			</div>

			{/* Scrollable Navigation Section */}
			<div
				className="min-h-0 flex-1 overflow-y-auto"
				onScroll={() => setHoveredItem(null)}
			>
				<nav aria-label={navigationLabel} className="p-3 space-y-1">
					{navigationItems.map((item) => (
						<SidebarNavItem
							key={item.key || item.href || item.name}
							item={item}
							pathname={pathname}
							expandedMenus={expandedMenus}
							onToggleMenu={onToggleMenu}
							onNavigate={onNavigate}
							isItemLocked={isItemLocked}
							isCollapsed={isCollapsed}
							onMouseEnterItem={handleMouseEnterItem}
							onMouseLeaveItem={handleMouseLeaveItem}
						/>
					))}
				</nav>
			</div>

			{/* Fixed Bottom Section */}
			<div className="flex-shrink-0 p-3 border-t border-[rgb(var(--color-border-primary))]">
				{bottomItems.map((item) => (
					<SidebarNavItem
						key={item.key || item.href || item.name}
						item={item}
						pathname={pathname}
						expandedMenus={expandedMenus}
						onToggleMenu={onToggleMenu}
						onNavigate={onNavigate}
						isItemLocked={isItemLocked}
						isCollapsed={isCollapsed}
						onMouseEnterItem={handleMouseEnterItem}
						onMouseLeaveItem={handleMouseLeaveItem}
						isBottomItem={true}
					/>
				))}
			</div>

			{/* ── Collapsed Flyout Menu ── */}
			<SidebarFlyout
				pathname={pathname}
				onNavigate={onNavigate}
				isItemLocked={isItemLocked}
				hoveredItem={hoveredItem}
				onMouseEnter={handleMouseEnterFlyout}
				onMouseLeave={handleMouseLeaveFlyout}
				onClose={() => setHoveredItem(null)}
			/>
		</div>
	);
};
