"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Check, MousePointer2, PanelLeftOpen } from "lucide-react";

export function SidebarPreferences({ position, mode, onChange, onClose, t }) {
	const ref = useRef(null);
	useEffect(() => {
		const previous = document.activeElement;
		ref.current?.querySelector("button")?.focus();
		const outside = (event) => {
			if (!ref.current?.contains(event.target)) onClose();
		};
		const handleEscape = (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
			}
		};
		document.addEventListener("pointerdown", outside);
		document.addEventListener("keydown", handleEscape);
		window.addEventListener("resize", onClose);
		return () => {
			document.removeEventListener("pointerdown", outside);
			document.removeEventListener("keydown", handleEscape);
			window.removeEventListener("resize", onClose);
			if (previous?.isConnected) previous.focus();
		};
	}, [onClose]);
	return createPortal(
		<section
			data-sidebar-overlay="preferences"
			ref={ref}
			aria-label={t("sidebar.behaviorTitle")}
			className="fixed z-[10060] w-60 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-2"
			style={{
				left: Math.max(8, Math.min(position.x, window.innerWidth - 248)),
				top: Math.max(8, Math.min(position.y, window.innerHeight - 170)),
			}}
		>
			<h2 className="px-3 py-2 text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
				{t("sidebar.behaviorTitle")}
			</h2>
			{[
				["hover", "expandOnHover", MousePointer2],
				["button", "expandWithButton", PanelLeftOpen],
			].map(([value, label, Icon]) => (
				<button
					key={value}
					type="button"
					aria-pressed={mode === value}
					onClick={() => {
						onChange(value);
						onClose();
					}}
					className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))]"
				>
					<Icon
						className="h-4 w-4 shrink-0 text-[rgb(var(--color-text-secondary))]"
						aria-hidden
					/>
					<span className="flex-1">{t(`sidebar.${label}`)}</span>
					{mode === value && (
						<Check
							className="h-4 w-4 text-[rgb(var(--color-primary))]"
							aria-hidden
						/>
					)}
				</button>
			))}
		</section>,
		document.body,
	);
}
