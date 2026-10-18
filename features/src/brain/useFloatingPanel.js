"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GAP = 12;

export function fitPanel(
	bounds,
	viewport,
	minimum = { width: 360, height: 420 },
) {
	const maxWidth = Math.max(1, viewport.width - GAP * 2);
	const maxHeight = Math.max(1, viewport.height - GAP * 2);
	const width = Math.min(
		maxWidth,
		Math.max(Math.min(minimum.width, maxWidth), bounds.width),
	);
	const height = Math.min(
		maxHeight,
		Math.max(Math.min(minimum.height, maxHeight), bounds.height),
	);
	return {
		width,
		height,
		left: Math.max(GAP, Math.min(bounds.left, viewport.width - width - GAP)),
		top: Math.max(GAP, Math.min(bounds.top, viewport.height - height - GAP)),
	};
}

export function resizePanel(bounds, direction, dx, dy, viewport) {
	const minWidth = Math.min(360, viewport.width - GAP * 2);
	const minHeight = Math.min(420, viewport.height - GAP * 2);
	const right = bounds.left + bounds.width;
	const bottom = bounds.top + bounds.height;
	const next = { ...bounds };
	if (direction.includes("w")) {
		next.left = Math.max(GAP, Math.min(bounds.left + dx, right - minWidth));
		next.width = right - next.left;
	}
	if (direction.includes("e"))
		next.width = Math.max(
			minWidth,
			Math.min(bounds.width + dx, viewport.width - bounds.left - GAP),
		);
	if (direction.includes("n")) {
		next.top = Math.max(GAP, Math.min(bounds.top + dy, bottom - minHeight));
		next.height = bottom - next.top;
	}
	if (direction.includes("s"))
		next.height = Math.max(
			minHeight,
			Math.min(bounds.height + dy, viewport.height - bounds.top - GAP),
		);
	return next;
}

/** Shared floating-window geometry; fullscreen never overwrites the user's restored bounds. */
export default function useFloatingPanel({
	isOpen,
	isExpanded,
	initialWidth = 400,
	initialHeight = 640,
}) {
	const [bounds, setBounds] = useState(null);
	const [viewportSize, setViewportSize] = useState(null);
	const [interacting, setInteracting] = useState(false);
	const gesture = useRef(null);
	const viewport = useCallback(
		() => ({ width: window.innerWidth, height: window.innerHeight }),
		[],
	);

	useEffect(() => {
		if (!isOpen) return;
		const update = () => {
			setViewportSize(viewport());
			setBounds((current) =>
				fitPanel(
					current ?? {
						left: window.innerWidth - initialWidth - 24,
						top: 80,
						width: initialWidth,
						height: initialHeight,
					},
					viewport(),
				),
			);
		};
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, [isOpen, initialWidth, initialHeight, viewport]);

	useEffect(() => {
		if (!isOpen || isExpanded) {
			gesture.current = null;
			setInteracting(false);
		}
	}, [isOpen, isExpanded]);

	const start = useCallback(
		(event, resize) => {
			if (
				isExpanded ||
				!bounds ||
				event.button !== 0 ||
				(!resize && event.target.closest("button, input, textarea, a"))
			)
				return;
			gesture.current = { x: event.clientX, y: event.clientY, bounds, resize };
			event.currentTarget.setPointerCapture(event.pointerId);
			event.preventDefault();
			setInteracting(true);
		},
		[bounds, isExpanded],
	);

	const move = useCallback(
		(event) => {
			const active = gesture.current;
			if (!active) return;
			const dx = event.clientX - active.x;
			const dy = event.clientY - active.y;
			const next = active.resize
				? resizePanel(active.bounds, active.resize, dx, dy, viewport())
				: {
						...active.bounds,
						left: active.bounds.left + dx,
						top: active.bounds.top + dy,
					};
			setBounds(fitPanel(next, viewport()));
		},
		[viewport],
	);

	const end = useCallback(() => {
		gesture.current = null;
		setInteracting(false);
	}, []);
	const handlers = (resize) => ({
		onPointerDown: (event) => start(event, resize),
		onPointerMove: move,
		onPointerUp: end,
		onPointerCancel: end,
		onLostPointerCapture: end,
	});

	const onResizeKeyDown = (event, direction) => {
		if (
			!bounds ||
			isExpanded ||
			!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
		)
			return;
		event.preventDefault();
		const step = event.shiftKey ? 40 : 16;
		setBounds(
			resizePanel(
				bounds,
				direction,
				event.key === "ArrowRight"
					? step
					: event.key === "ArrowLeft"
						? -step
						: 0,
				event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0,
				viewport(),
			),
		);
	};

	return {
		style: isExpanded
			? {
					left: GAP,
					top: GAP,
					width: Math.max(1, (viewportSize?.width ?? 0) - GAP * 2),
					height: Math.max(1, (viewportSize?.height ?? 0) - GAP * 2),
				}
			: bounds,
		ready: Boolean(bounds),
		interacting,
		dragHandlers: handlers(false),
		resizeHandles: ["n", "e", "s", "w", "ne", "nw", "se", "sw"].map(
			(direction) => ({
				direction,
				handlers: {
					...handlers(direction),
					onKeyDown: (event) => onResizeKeyDown(event, direction),
				},
			}),
		),
	};
}
