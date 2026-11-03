"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "@dragorbit/ui";
import { AlertTriangle, AlertCircle, Trash2, X } from "lucide-react";

export function ProductDeleteConfirmModalView({ model }) {
	const {
		t = (_k, fallback) => fallback,
		handleClose,
		isDeleting,
		productToDelete,
		handleConfirm,
	} = model;

	const [deleteErrorState, setDeleteErrorState] = useState(null);
	const [forceDeleteChecked, setForceDeleteChecked] = useState(false);

	// Reset state when productToDelete changes
	useEffect(() => {
		setDeleteErrorState(null);
		setForceDeleteChecked(false);
	}, [productToDelete]);

	const onCloseModal = () => {
		if (!isDeleting) {
			setDeleteErrorState(null);
			setForceDeleteChecked(false);
			handleClose?.();
		}
	};

	const onConfirm = async () => {
		if (deleteErrorState?.canForceDelete && !forceDeleteChecked) {
			return;
		}

		const isForce = Boolean(deleteErrorState?.canForceDelete && forceDeleteChecked);
		const result = await handleConfirm({ force: isForce });

		if (result && result.success === false) {
			const fields = result.fields || {};
			const canForce =
				result.canForceDelete === true ||
				fields.canForceDelete === true ||
				/force delete/i.test(result.message || result.error || "");
			const errorMessage =
				result.message || result.error || "Cannot delete product without force.";

			setDeleteErrorState({
				message: errorMessage,
				canForceDelete: canForce,
			});
			setForceDeleteChecked(false);
		} else if (result?.success) {
			setDeleteErrorState(null);
			setForceDeleteChecked(false);
		}
	};

	const hasError = Boolean(deleteErrorState);
	const canForceDelete = deleteErrorState?.canForceDelete === true;
	const isActionDisabled =
		isDeleting ||
		(hasError && canForceDelete && !forceDeleteChecked) ||
		(hasError && !canForceDelete);

	return (
		<Modal
			isOpen={true}
			onClose={onCloseModal}
			closeOnOverlayClick={!isDeleting}
			closeOnEscape={!isDeleting}
			showCloseButton={false}
			className="bg-gradient-to-br from-[rgb(var(--color-bg-primary))] to-[rgb(var(--color-bg-secondary))] rounded-2xl border border-[rgb(var(--color-border-primary))] shadow-2xl max-w-md w-full mx-4 transform transition-all duration-500"
			style={{ width: 448, maxWidth: "calc(100vw - 20px)" }}
		>
			{/* Header */}
			<div className="px-6 py-4 border-b border-[rgb(var(--color-border-primary))]">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 rounded-full flex items-center justify-center ${
								hasError
									? "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
									: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
							}`}
						>
							{hasError ? (
								<AlertCircle className="w-5 h-5" />
							) : (
								<AlertTriangle className="w-5 h-5" />
							)}
						</div>
						<div>
							<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
								{t("products.deleteProduct") || "Delete Product"}
							</h2>
							{hasError ? (
								<p className="text-xs text-[rgb(var(--color-text-secondary))]">
									{canForceDelete
										? t(
												"products.forceDeleteRequired",
												"Confirmation required to delete product",
											)
										: t(
												"products.cannotDeleteProduct",
												"This product cannot be deleted",
											)}
								</p>
							) : (
								<p className="text-xs text-[rgb(var(--color-text-secondary))]">
									{t("modals.deleteConfirmMessage") ||
										"This action cannot be undone"}
								</p>
							)}
						</div>
					</div>
					<button
						type="button"
						onClick={onCloseModal}
						className="p-2 hover:bg-[rgb(var(--color-bg-tertiary))] rounded-lg transition-colors duration-200"
						disabled={isDeleting}
					>
						<X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="px-6 py-4">
				<div className="mb-4">
					<p className="text-[rgb(var(--color-text-primary))] mb-2">
						{t("products.deleteConfirm") || "Are you sure you want to delete"}
					</p>
					<div className="bg-[rgb(var(--color-bg-tertiary))] rounded-lg p-3 border border-[rgb(var(--color-border-primary))]">
						<p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
							&ldquo;{productToDelete?.name}&rdquo;
						</p>
						<p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
							{t("modals.deleteConfirmMessage") ||
								"This action cannot be undone"}
						</p>
					</div>
				</div>

				{/* Error message / Conflict banner */}
				{hasError && (
					<div className="mb-4 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
						<div className="flex items-start gap-2.5">
							<AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
							<div className="text-sm min-w-0 flex-1">
								<p className="font-semibold leading-snug">
									{deleteErrorState.message}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Checkbox for force delete when canForceDelete is true */}
				{hasError && canForceDelete && (
					<label className="flex items-start gap-3 p-3 mb-5 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] cursor-pointer select-none transition-colors hover:border-[rgb(var(--color-primary)/0.5)]">
						<input
							type="checkbox"
							checked={forceDeleteChecked}
							onChange={(e) => setForceDeleteChecked(e.target.checked)}
							className="mt-0.5 h-4 w-4 rounded border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
						/>
						<div className="text-xs min-w-0 flex-1">
							<span className="font-semibold text-[rgb(var(--color-text-primary))]">
								{t(
									"products.forceDeleteProductConfirm",
									"Force delete this product and its inventory",
								)}
							</span>
							<p className="text-[rgb(var(--color-text-secondary))] mt-0.5 leading-relaxed">
								{t(
									"products.forceDeleteProductWarning",
									"I understand this product has stock. Checking this will permanently delete it and deduct inventory.",
								)}
							</p>
						</div>
					</label>
				)}

				{/* Action Buttons */}
				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={onCloseModal}
						className="flex-1 h-10 text-sm font-semibold border-2 border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-primary))]"
						disabled={isDeleting}
					>
						{t("common.cancel") || "Cancel"}
					</Button>

					<Button
						variant="danger"
						onClick={onConfirm}
						className="flex-1 h-10 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white"
						leftIcon={Trash2}
						loading={isDeleting}
						disabled={isActionDisabled}
					>
						{isDeleting
							? t("common.loading") || "Loading..."
							: canForceDelete
							? t("products.forceDelete") || "Force Delete"
							: t("products.deleteProduct") || "Delete Product"}
					</Button>
				</div>
			</div>

			{/* Footer */}
			<div className="px-6 py-3 bg-[rgb(var(--color-bg-tertiary))] border-t border-[rgb(var(--color-border-primary))] rounded-b-2xl">
				<p className="text-xs text-[rgb(var(--color-text-tertiary))] text-center">
					{t("products.deletePermanentlyWarning") ||
						"This action cannot be undone."}
				</p>
			</div>
		</Modal>
	);
}

export default ProductDeleteConfirmModalView;
