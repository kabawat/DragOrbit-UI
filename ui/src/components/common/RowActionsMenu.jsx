"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { clampFloatingMenuPosition } from "./floatingMenuPosition";

const MENU_WIDTH = 192;

const toneClass = {
	default:
		"w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-3 transition-colors cursor-pointer focus:outline-none",
	primary:
		"w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10 flex items-center gap-3 transition-colors cursor-pointer focus:outline-none",
	success:
		"w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-500/10 flex items-center gap-3 transition-colors cursor-pointer focus:outline-none",
	danger:
		"w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-500/10 flex items-center gap-3 transition-colors cursor-pointer focus:outline-none",
};

export function RowActionsMenu({
	items = [],
	mode = "dropdown",
	anchorPoint = null,
	className = "w-48",
}) {
	const menuRef = useRef(null);
	const [position, setPosition] = useState({
		left: anchorPoint?.x ?? 0,
		top: anchorPoint?.y ?? 0,
	});

	useLayoutEffect(() => {
		if (mode !== "context" || !anchorPoint) return;
		const el = menuRef.current;
		if (!el) return;
		const { width, height } = el.getBoundingClientRect();
		setPosition(
			clampFloatingMenuPosition(
				anchorPoint.x,
				anchorPoint.y,
				width || MENU_WIDTH,
				height,
			),
		);
	}, [mode, anchorPoint, items]);

	const menuBody = items.map((item, index) => {
		if (item.type === "separator") {
			return (
				<div
					key={`sep-${index}`}
					className="border-t border-[rgb(var(--color-border-primary))] my-1"
				/>
			);
		}

		const Icon = item.icon;
		const tone = item.tone || "default";

		return (
			<button
				key={item.key || index}
				type="button"
				onClick={item.onClick}
				className={toneClass[tone] || toneClass.default}
			>
				{Icon ? (
					<Icon
						className={`w-4 h-4 ${tone === "danger" ? "text-red-500" : "text-[rgb(var(--color-text-secondary))]"}`}
					/>
				) : null}
				{item.label}
			</button>
		);
	});

	const shellClass = `${className} bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1`;

	if (mode === "dropdown") {
		return (
			<div
				ref={menuRef}
				data-row-context-menu
				className={`absolute right-0 top-full mt-1 z-50 ${shellClass}`}
			>
				{menuBody}
			</div>
		);
	}

	return createPortal(
		<div
			ref={menuRef}
			data-row-context-menu
			style={{ left: position.left, top: position.top }}
			className={`fixed z-[10051] ${shellClass}`}
		>
			{menuBody}
		</div>,
		document.body,
	);
}

export default RowActionsMenu;
