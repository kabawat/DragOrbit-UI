"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "@dragorbit/ui";
import { AlertTriangle, AlertCircle, Trash2, X } from "lucide-react";

export function VariantDeleteDialog({ model }) {
	const {
		t = (_k, fallback) => fallback,
		variantDisplayLabel = (v) => v?.displayName || v?.name || "",
		setVariantToDelete,
		variantToDelete,
		isDeleting,
		handleConfirmDelete,
	} = model;

	const [deleteErrorState, setDeleteErrorState] = useState(null);
	const [forceDeleteChecked, setForceDeleteChecked] = useState(false);

	// Reset state when variantToDelete changes or dialog opens
	useEffect(() => {
		setDeleteErrorState(null);
		setForceDeleteChecked(false);
	}, [variantToDelete]);

	const handleClose = () => {
		if (!isDeleting) {
			setDeleteErrorState(null);
			setForceDeleteChecked(false);
			setVariantToDelete(null);
		}
	};

	const onConfirm = async () => {
		if (deleteErrorState?.canForceDelete && !forceDeleteChecked) {
			return;
		}

		const isForce = Boolean(deleteErrorState?.canForceDelete && forceDeleteChecked);
		const result = await handleConfirmDelete({ force: isForce });

		if (result && result.success === false) {
			const fields = result.fields || {};
			const canForce = fields.canForceDelete === true;
			const isDefaultMsg =
				typeof fields.isDefault === "string" ? fields.isDefault : null;
			const errorMessage =
				result.message || result.error || "Cannot delete variant without force.";

			setDeleteErrorState({
				message: errorMessage,
				isDefault: isDefaultMsg,
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
			isOpen={Boolean(variantToDelete)}
			onClose={handleClose}
			closeOnEscape={!isDeleting}
			closeOnOverlayClick={!isDeleting}
			showCloseButton={false}
			className="rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] shadow-xl overflow-hidden"
			style={{ width: 448, maxWidth: "calc(100vw - 20px)" }}
		>
			<div className="px-6 py-4 border-b border-[rgb(var(--color-border-primary))] flex items-center justify-between">
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
							{t("products.deleteVariant") || "Delete variant"}
						</h2>
						{hasError ? (
							<p className="text-xs text-[rgb(var(--color-text-secondary))]">
								{canForceDelete
									? t(
											"products.forceDeleteRequired",
											"Confirmation required to delete default variant",
										)
									: t(
											"products.cannotDeleteVariant",
											"This variant cannot be deleted",
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
					onClick={handleClose}
					className="p-2 rounded-lg hover:bg-[rgb(var(--color-bg-tertiary))]"
					disabled={isDeleting}
				>
					<X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
				</button>
			</div>

			<div className="px-6 py-4">
				<p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">
					{t("products.variantDeleteConfirm") ||
						"Are you sure you want to delete"}{" "}
					<span className="font-semibold text-[rgb(var(--color-text-primary))]">
						{variantDisplayLabel(variantToDelete)}
					</span>
					?
				</p>

				{/* Error message / Conflict banner */}
				{hasError && (
					<div className="mb-4 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
						<div className="flex items-start gap-2.5">
							<AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
							<div className="text-sm min-w-0 flex-1">
								<p className="font-semibold leading-snug">
									{deleteErrorState.message}
								</p>
								{deleteErrorState.isDefault && (
									<p className="text-xs opacity-90 mt-1 leading-relaxed">
										{deleteErrorState.isDefault}
									</p>
								)}
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
									"products.forceDeleteVariantConfirm",
									"Force delete this default variant",
								)}
							</span>
							<p className="text-[rgb(var(--color-text-secondary))] mt-0.5 leading-relaxed">
								{t(
									"products.forceDeleteVariantWarning",
									"I understand this is the default variant. Checking this will permanently delete it.",
								)}
							</p>
						</div>
					</label>
				)}

				<div className="flex justify-end gap-3 mt-2">
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={isDeleting}
					>
						{t("common.cancel") || "Cancel"}
					</Button>
					<Button
						variant="danger"
						onClick={onConfirm}
						loading={isDeleting}
						disabled={isActionDisabled}
						leftIcon={Trash2}
					>
						{canForceDelete
							? t("products.forceDelete") || "Force Delete"
							: t("common.delete") || "Delete"}
					</Button>
				</div>
			</div>
		</Modal>
	);
}

export default VariantDeleteDialog;
