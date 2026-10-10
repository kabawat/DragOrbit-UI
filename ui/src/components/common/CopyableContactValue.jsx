"use client";
import { Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { defaultTranslate } from "./defaults";

const COPIED_DURATION_MS = 1500;
const CURSOR_OFFSET = 14;

function CursorFloatingHint({ x, y, mode, copiedLabel }) {
	if (x == null || y == null) return null;

	return createPortal(
		<div
			className="pointer-events-none fixed z-[10060]"
			style={{ left: x + CURSOR_OFFSET, top: y + CURSOR_OFFSET }}
			role={mode === "copied" ? "status" : "presentation"}
		>
			{mode === "copied" ? (
				<span className="rounded-md bg-[rgb(var(--color-text-primary))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-bg-primary))] shadow-lg">
					{copiedLabel}
				</span>
			) : (
				<span className="flex h-7 w-7 items-center justify-center rounded-md border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-primary))] shadow-md">
					<Copy className="h-3.5 w-3.5" aria-hidden />
				</span>
			)}
		</div>,
		document.body,
	);
}

export function CopyableContactValue({
	value,
	className = "",
	fallback = "N/A",
	t = defaultTranslate,
	copyToClipboard,
}) {
	const [pointerHint, setPointerHint] = useState(null);
	const timeoutRef = useRef(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const text = value ? String(value).trim() : "";
	const display = text || fallback;
	const canCopy = Boolean(text);

	const handleMouseMove = (event) => {
		if (pointerHint?.mode === "copied") return;
		setPointerHint({ x: event.clientX, y: event.clientY, mode: "copy" });
	};

	const handleMouseLeave = () => {
		if (pointerHint?.mode !== "copied") {
			setPointerHint(null);
		}
	};

	const handleClick = async (event) => {
		event.stopPropagation();
		if (!canCopy) return;
		const ok = await copyToClipboard?.(text);
		if (!ok) return;

		setPointerHint({ x: event.clientX, y: event.clientY, mode: "copied" });
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(
			() => setPointerHint(null),
			COPIED_DURATION_MS,
		);
	};

	if (!canCopy) {
		return <span className={className}>{display}</span>;
	}

	return (
		<>
			<button
				type="button"
				onClick={handleClick}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				className={`block max-w-full truncate text-left cursor-copy hover:text-[rgb(var(--color-primary))] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]/40 rounded ${className}`}
			>
				{display}
			</button>
			{pointerHint ? (
				<CursorFloatingHint
					x={pointerHint.x}
					y={pointerHint.y}
					mode={pointerHint.mode}
					copiedLabel={t("common.copied")}
				/>
			) : null}
		</>
	);
}

export default CopyableContactValue;
