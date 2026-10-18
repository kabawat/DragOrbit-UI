"use client";
import { Trash2 } from "lucide-react";
import { Button, Modal } from "@dragorbit/ui";
export function SignatureDeleteModalView({ model }) {
	const {
		isOpen,
		isDeleting,
		onClose,
		t,
		signatureToDelete,
		Image,
		themeVariant,
		onConfirm,
	} = model;
	return (
		<Modal
			bodyClassName="p-4 sm:p-6"
			isOpen={isOpen}
			onClose={isDeleting ? undefined : onClose}
			title={t("settings.deleteSignature") || "Delete Signature"}
			size="sm"
		>
			<div className="space-y-4">
				<p className="text-[rgb(var(--color-text-secondary))]">
					{t("common.confirmDelete") ||
						"Are you sure you want to delete this signature?"}
				</p>

				{signatureToDelete && (
					<div className="bg-[rgb(var(--color-bg-secondary))] p-4 rounded-lg border border-[rgb(var(--color-border-primary))] flex justify-center">
						<div className="relative w-full h-20">
							<Image
								src={signatureToDelete.content}
								alt="Signature to delete"
								fill
								className={`object-contain ${themeVariant === "dark" ? "invert" : ""}`}
							/>
						</div>
					</div>
				)}

				<div className="flex justify-end gap-3 pt-2">
					<Button variant="outline" onClick={onClose} disabled={isDeleting}>
						{t("common.cancel")}
					</Button>
					<Button
						variant="danger"
						onClick={onConfirm}
						loading={isDeleting}
						leftIcon={Trash2}
					>
						{isDeleting ? t("common.deleting") : t("common.delete")}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
