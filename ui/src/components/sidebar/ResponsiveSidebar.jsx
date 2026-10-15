"use client";
import { useCallback, useState } from "react";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarPreferences } from "./SidebarPreferences";
import { useSidebarBehavior } from "./useSidebarBehavior";

/** Apps own routing, permissions and Redux; this component owns presentation. */
export function ResponsiveSidebar({
	collapsed,
	onCollapsedChange,
	pathname,
	t,
	header,
	selector,
	onNavigate,
	...menuProps
}) {
	const behavior = useSidebarBehavior({
		pathname,
		collapsed,
		setCollapsed: onCollapsedChange,
	});
	const [preferences, setPreferences] = useState(null);
	const closePreferences = useCallback(() => setPreferences(null), []);
	const controls = {
		isCollapsed: behavior.isCollapsed,
		onToggle: behavior.toggle,
		mode: behavior.mode,
		locked: behavior.locked,
		onAction: behavior.close,
	};
	return (
		<aside
			ref={behavior.sidebarRef}
			aria-label={t("sidebar.behaviorTitle")}
			className="relative h-screen shrink-0"
			style={{
				width: behavior.overlay ? 64 : behavior.isCollapsed ? 64 : 256,
				transition: "width 120ms ease-out",
			}}
			onPointerEnter={behavior.enter}
			onPointerLeave={behavior.leave}
			onContextMenu={(event) => {
				event.preventDefault();
				setPreferences({ x: event.clientX, y: event.clientY });
			}}
			onKeyDown={(event) => {
				if (event.key === "Escape") behavior.close();
				if (
					event.key === "ContextMenu" ||
					(event.shiftKey && event.key === "F10")
				) {
					event.preventDefault();
					const rect = event.currentTarget.getBoundingClientRect();
					setPreferences({ x: rect.left + 16, y: rect.top + 72 });
				}
			}}
		>
			<div
				style={{
					position: behavior.overlay ? "absolute" : "relative",
					top: 0,
					left: 0,
					zIndex: 150,
				}}
			>
				<SidebarMenu
					{...menuProps}
					pathname={pathname}
					isCollapsed={behavior.isCollapsed}
					onNavigate={(item) => {
						behavior.close();
						onNavigate?.(item);
					}}
					header={header?.(controls)}
					selector={selector?.(controls)}
				/>
			</div>
			{preferences && (
				<SidebarPreferences
					position={preferences}
					mode={behavior.mode}
					onChange={behavior.changeMode}
					onClose={closePreferences}
					t={t}
				/>
			)}
		</aside>
	);
}
