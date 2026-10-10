"use client";
import { createPortal } from "react-dom";

export function RowContextMenuLayer({ open, onClose }) {
	if (!open) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[10050]"
			onMouseDown={onClose}
			onContextMenu={(event) => {
				event.preventDefault();
				onClose();
			}}
		/>,
		document.body,
	);
}

export default RowContextMenuLayer;
