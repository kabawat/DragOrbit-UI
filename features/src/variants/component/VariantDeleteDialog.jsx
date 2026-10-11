"use client";
import { Modal } from "@dragorbit/ui";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@dragorbit/ui";
export function VariantDeleteDialog({ model }) {
	const {
		t,
		variantDisplayLabel,
		setVariantToDelete,
		variantToDelete,
		isDeleting,
		handleConfirmDelete,
	} = model;
	return (
		<Modal
			isOpen={Boolean(variantToDelete)}
			onClose={() => {
				if (!isDeleting) setVariantToDelete(null);
			}}
			closeOnEscape={!isDeleting}
			closeOnOverlayClick={!isDeleting}
			showCloseButton={false}
			className="rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] shadow-xl overflow-hidden"
			style={{ width: 448, maxWidth: "calc(100vw - 20px)" }}
		>
			<div className="px-6 py-4 border-b border-[rgb(var(--color-border-primary))] flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
						<AlertTriangle className="w-5 h-5 text-red-600" />
					</div>
					<div>
						<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
							{t("products.deleteVariant") || "Delete variant"}
						</h2>
					</div>
				</div>
				<button
					type="button"
					onClick={() => !isDeleting && setVariantToDelete(null)}
					className="p-2 rounded-lg hover:bg-[rgb(var(--color-bg-tertiary))]"
					disabled={isDeleting}
				>
					<X className="w-5 h-5" />
				</button>
			</div>
			<div className="px-6 py-4">
				<p className="text-sm text-[rgb(var(--color-text-secondary))] mb-6">
					{t("products.variantDeleteConfirm") ||
						"Are you sure you want to delete"}{" "}
					<span className="font-medium text-[rgb(var(--color-text-primary))]">
						{variantDisplayLabel(variantToDelete)}
					</span>
					?
				</p>
				<div className="flex justify-end gap-3">
					<Button
						variant="outline"
						onClick={() => setVariantToDelete(null)}
						disabled={isDeleting}
					>
						{t("common.cancel")}
					</Button>
					<Button
						variant="danger"
						onClick={handleConfirmDelete}
						loading={isDeleting}
						leftIcon={Trash2}
					>
						{t("common.delete")}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
