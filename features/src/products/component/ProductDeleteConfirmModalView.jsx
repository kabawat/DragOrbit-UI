"use client";
import { Modal } from "@dragorbit/ui";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@dragorbit/ui";
export function ProductDeleteConfirmModalView({ model }) {
	const { t, handleClose, isDeleting, productToDelete, handleConfirm } = model;
	return (
		<Modal
			isOpen={true}
			onClose={handleClose}
			closeOnOverlayClick={false}
			closeOnEscape={false}
			showCloseButton={false}
			className="bg-gradient-to-br from-[rgb(var(--color-bg-primary))] to-[rgb(var(--color-bg-secondary))] rounded-2xl border border-[rgb(var(--color-border-primary))] shadow-2xl max-w-md w-full mx-4 transform transition-all duration-500"
			style={{ width: 448, maxWidth: "calc(100vw - 20px)" }}
		>
			{/* Header */}
			<div className="px-6 py-4 border-b border-[rgb(var(--color-border-primary))]">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
							<AlertTriangle className="w-5 h-5 text-red-600" />
						</div>
						<div>
							<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
								{t("products.deleteProduct")}
							</h2>
							<p className="text-sm text-[rgb(var(--color-text-secondary))]">
								{t("modals.deleteConfirmMessage")}
							</p>
						</div>
					</div>
					<button
						onClick={handleClose}
						className="p-2 hover:bg-[rgb(var(--color-bg-tertiary))] rounded-lg transition-colors duration-200"
						disabled={isDeleting}
					>
						<X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="px-6 py-4">
				<div className="mb-6">
					<p className="text-[rgb(var(--color-text-primary))] mb-2">
						{t("products.deleteConfirm")}
					</p>
					<div className="bg-[rgb(var(--color-bg-tertiary))] rounded-lg p-3 border border-[rgb(var(--color-border-primary))]">
						<p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
							&ldquo;{productToDelete?.name}&rdquo;
						</p>
						<p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
							{t("modals.deleteConfirmMessage")}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={handleClose}
						className="flex-1 h-10 text-sm font-semibold border-2 border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-primary))]"
						disabled={isDeleting}
					>
						{t("common.cancel")}
					</Button>

					<Button
						variant="danger"
						onClick={handleConfirm}
						className="flex-1 h-10 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white"
						leftIcon={Trash2}
						loading={isDeleting}
						disabled={isDeleting}
					>
						{isDeleting ? t("common.loading") : t("products.deleteProduct")}
					</Button>
				</div>
			</div>

			{/* Footer */}
			<div className="px-6 py-3 bg-[rgb(var(--color-bg-tertiary))] border-t border-[rgb(var(--color-border-primary))] rounded-b-2xl">
				<p className="text-xs text-[rgb(var(--color-text-tertiary))] text-center">
					{t("products.deletePermanentlyWarning")}
				</p>
			</div>
		</Modal>
	);
}
