"use client";
import { AlertTriangle } from "lucide-react";
import { Modal } from "../modal/Modal";
import { Button } from "../button/Button";
export default function ConfirmDialog({
	isOpen = true,
	onClose,
	onConfirm,
	busy = false,
	title = "Confirm",
	description,
	cancelLabel = "Cancel",
	confirmLabel = "Confirm",
	busyLabel = "Please wait…",
	icon: Icon = AlertTriangle,
	variant = "danger",
}) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				if (!busy) onClose?.();
			}}
			closeOnOverlayClick={!busy}
			closeOnEscape={!busy}
			title={title}
			className="w-full max-w-md"
		>
			<div className="p-6 space-y-6">
				<div className="flex items-start gap-3">
					<Icon
						className="h-6 w-6 shrink-0 text-[rgb(var(--color-warning))]"
						aria-hidden
					/>
					<p className="text-[rgb(var(--color-text-secondary))]">
						{description}
					</p>
				</div>
				<div className="flex justify-end gap-3">
					<Button variant="secondary" disabled={busy} onClick={onClose}>
						{cancelLabel}
					</Button>
					<Button variant={variant} loading={busy} onClick={onConfirm}>
						{busy ? busyLabel : confirmLabel}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
