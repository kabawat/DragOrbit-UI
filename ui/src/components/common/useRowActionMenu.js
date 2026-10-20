"use client";
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useRowActionMenu() {
	const [menu, setMenu] = useState(null);
	const menuRefs = useRef({});

	const closeMenu = useCallback(() => setMenu(null), []);

	useEffect(() => {
		if (!menu) return undefined;

		const handlePointerDown = (event) => {
			if (menu.mode === "dropdown") {
				const anchor = menuRefs.current[menu.rowId];
				if (anchor?.contains(event.target)) return;
			}
			if (event.target.closest?.("[data-row-context-menu]")) {
				return;
			}
			closeMenu();
		};

		const handleEscape = (event) => {
			if (event.key === "Escape") closeMenu();
		};

		const handleScroll = () => closeMenu();

		document.addEventListener("mousedown", handlePointerDown);
		document.addEventListener("keydown", handleEscape);
		window.addEventListener("scroll", handleScroll, true);

		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
			document.removeEventListener("keydown", handleEscape);
			window.removeEventListener("scroll", handleScroll, true);
		};
	}, [menu, closeMenu]);

	const toggleDropdown = useCallback((rowId) => {
		setMenu((current) =>
			current?.rowId === rowId && current.mode === "dropdown"
				? null
				: { rowId, mode: "dropdown" },
		);
	}, []);

	const openContextMenu = useCallback((event, rowId) => {
		event.preventDefault();
		setMenu({
			rowId,
			mode: "context",
			x: event.clientX,
			y: event.clientY,
		});
	}, []);

	return {
		menu,
		menuRefs,
		closeMenu,
		toggleDropdown,
		openContextMenu,
	};
}

export default useRowActionMenu;
