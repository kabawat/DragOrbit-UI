"use client";
import { useEffect, useId, useRef, useState } from "react";
export function usePopover() {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	const triggerRef = useRef(null);
	const id = useId();
	useEffect(() => {
		if (!open) return;
		const outside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) setOpen(false);
		};
		const handleEscape = (event) => {
			if (event.key === "Escape") {
				setOpen(false);
				triggerRef.current?.focus();
			}
		};
		document.addEventListener("pointerdown", outside);
		document.addEventListener("focusin", outside);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("pointerdown", outside);
			document.removeEventListener("focusin", outside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [open]);
	return { open, setOpen, ref, triggerRef, id };
}
