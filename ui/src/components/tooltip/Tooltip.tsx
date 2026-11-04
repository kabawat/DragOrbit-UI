"use client";

import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import {
	cloneElement,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

type TriggerProps = HTMLAttributes<HTMLElement>;
export type TooltipProps = {
	content?: ReactNode;
	children: ReactElement<TriggerProps>;
	side?: "top" | "bottom";
	delay?: number;
};

/** Adds a portal tooltip without inserting a wrapper or replacing the trigger's ref. */
export function Tooltip({
	content,
	children,
	side = "top",
	delay = 350,
}: TooltipProps) {
	const id = useId();
	const [anchor, setAnchor] = useState<HTMLElement | null>(null);
	const [position, setPosition] = useState<{
		left: number;
		top: number;
		side: string;
		background: string;
		foreground: string;
		border: string;
		fontFamily: string;
	} | null>(null);
	const popup = useRef<HTMLDivElement>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const clearTimer = () => {
		if (timer.current !== null) clearTimeout(timer.current);
	};
	const close = () => {
		clearTimer();
		setAnchor(null);
		setPosition(null);
	};
	const show = (target: HTMLElement, wait: number) => {
		clearTimer();
		if (!content) return;
		timer.current = setTimeout(() => {
			window.dispatchEvent(
				new CustomEvent("dragorbit:tooltip-open", { detail: id }),
			);
			setAnchor(target);
		}, wait);
	};
	const hide = () => {
		clearTimer();
		timer.current = setTimeout(close, 100);
	};

	useEffect(
		() => () => {
			if (timer.current !== null) clearTimeout(timer.current);
		},
		[],
	);
	useEffect(() => {
		const dismissOther = (event: Event) => {
			if ((event as CustomEvent<string>).detail === id) return;
			if (timer.current !== null) clearTimeout(timer.current);
			setAnchor(null);
			setPosition(null);
		};
		window.addEventListener("dragorbit:tooltip-open", dismissOther);
		return () =>
			window.removeEventListener("dragorbit:tooltip-open", dismissOther);
	}, [id]);

	useEffect(() => {
		if (!anchor) return;
		const dismiss = () => {
			if (timer.current !== null) clearTimeout(timer.current);
			setAnchor(null);
			setPosition(null);
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.stopPropagation();
				dismiss();
			}
		};
		window.addEventListener("keydown", onKeyDown, true);
		window.addEventListener("scroll", dismiss, true);
		window.addEventListener("resize", dismiss);
		return () => {
			window.removeEventListener("keydown", onKeyDown, true);
			window.removeEventListener("scroll", dismiss, true);
			window.removeEventListener("resize", dismiss);
		};
	}, [anchor]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: Re-measure when the rendered content changes.
	useLayoutEffect(() => {
		if (!anchor || !popup.current) return;
		const rect = anchor.getBoundingClientRect();
		const box = popup.current.getBoundingClientRect();
		const theme = getComputedStyle(anchor);
		const color = (name: string, fallback: string) =>
			`rgb(${theme.getPropertyValue(name).trim() || fallback})`;
		const gap = 8;
		const placement =
			side === "top"
				? rect.top >= box.height + gap + 8
					? "top"
					: "bottom"
				: window.innerHeight - rect.bottom >= box.height + gap + 8
					? "bottom"
					: "top";
		setPosition({
			left: Math.max(
				8,
				Math.min(
					rect.left + (rect.width - box.width) / 2,
					window.innerWidth - box.width - 8,
				),
			),
			top: Math.max(
				8,
				Math.min(
					placement === "top" ? rect.top - box.height - gap : rect.bottom + gap,
					window.innerHeight - box.height - 8,
				),
			),
			side: placement,
			background: color("--color-bg-primary", "255 255 255"),
			foreground: color("--color-text-primary", "28 40 60"),
			border: color("--color-border-primary", "220 227 237"),
			fontFamily: theme.fontFamily,
		});
	}, [anchor, side, content]);

	if (!content) return children;
	const props = children.props;
	return (
		<>
			{cloneElement(children, {
				"aria-describedby":
					[props["aria-describedby"], anchor ? id : ""]
						.filter(Boolean)
						.join(" ") || undefined,
				onPointerEnter: (event) => {
					props.onPointerEnter?.(event);
					if (event.pointerType !== "touch") show(event.currentTarget, delay);
				},
				onPointerLeave: (event) => {
					props.onPointerLeave?.(event);
					hide();
				},
				onFocus: (event) => {
					props.onFocus?.(event);
					show(event.currentTarget, 0);
				},
				onBlur: (event) => {
					props.onBlur?.(event);
					close();
				},
				onPointerDown: (event) => {
					props.onPointerDown?.(event);
					close();
				},
			})}
			{anchor &&
				createPortal(
					<div
						ref={popup}
						id={id}
						role="tooltip"
						className={styles.tooltip}
						data-side={position?.side ?? side}
						style={{
							left: position?.left ?? 0,
							top: position?.top ?? 0,
							visibility: position ? "visible" : "hidden",
							backgroundColor: position?.background,
							color: position?.foreground,
							borderColor: position?.border,
							fontFamily: position?.fontFamily,
						}}
						onPointerEnter={clearTimer}
						onPointerLeave={hide}
					>
						{content}
					</div>,
					document.body,
				)}
		</>
	);
}
