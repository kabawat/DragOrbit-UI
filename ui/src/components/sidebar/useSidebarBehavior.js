"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const PREFERENCE_KEY = "dragbizz-sidebar-mode";
export function useSidebarBehavior({ pathname, collapsed, setCollapsed }) {
	const sidebarRef = useRef(null);
	const previousPath = useRef(pathname);
	const [compact, setCompact] = useState(false);
	const [mode, setMode] = useState("button");
	const [locked, setLocked] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [dismissed, setDismissed] = useState(false);
	useEffect(() => {
		try {
			const saved = localStorage.getItem(PREFERENCE_KEY);
			if (saved === "hover" || saved === "button") setMode(saved);
		} catch {
			/* Preferences are optional when browser storage is unavailable. */
		}
		const media = window.matchMedia("(max-width: 1279px)");
		const update = () => {
			setCompact(media.matches);
			setHovered(false);
			setDismissed(false);
			setCollapsed(media.matches);
		};
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, [setCollapsed]);
	const changeMode = useCallback(
		(next) => {
			setMode(next);
			setLocked(false);
			setDismissed(false);
			setCollapsed(true);
			try {
				localStorage.setItem(PREFERENCE_KEY, next);
			} catch {
				/* Keep the in-memory preference. */
			}
		},
		[setCollapsed],
	);
	const isCollapsed =
		mode === "hover" ? !locked && (!hovered || dismissed) : collapsed;
	const close = useCallback(() => {
		if (mode === "hover" && locked) return;
		setDismissed(true);
		if (compact || mode === "hover") setCollapsed(true);
	}, [compact, mode, locked, setCollapsed]);
	// Dismiss the overlay when the user continues working outside navigation.
	useEffect(() => {
		if (!compact || locked || isCollapsed) return;
		const handleOutside = (event) => {
			if (sidebarRef.current?.contains(event.target)) return;
			if (
				event.target instanceof Element &&
				event.target.closest("[data-sidebar-overlay]")
			)
				return;
			close();
		};
		document.addEventListener("pointerdown", handleOutside, true);
		return () =>
			document.removeEventListener("pointerdown", handleOutside, true);
	}, [compact, locked, isCollapsed, close]);
	// Covers navigation initiated elsewhere as well as sidebar menu clicks.
	useEffect(() => {
		if (previousPath.current !== pathname) {
			previousPath.current = pathname;
			close();
		}
	}, [pathname, close]);
	return {
		sidebarRef,
		compact,
		mode,
		locked,
		isCollapsed,
		overlay: compact && !locked,
		changeMode,
		close,
		toggle: () => {
			if (mode === "hover") {
				setLocked((value) => !value);
				setDismissed(false);
			} else setCollapsed(!collapsed);
		},
		enter: (event) => {
			if (event.pointerType === "mouse") setHovered(true);
		},
		leave: () => {
			setHovered(false);
			setDismissed(false);
		},
	};
}
