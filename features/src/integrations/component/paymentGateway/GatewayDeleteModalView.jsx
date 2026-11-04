"use client";
import { Trash2 } from "lucide-react";
import { Button, Modal } from "@dragorbit/ui";
export function GatewayDeleteModalView({ model }) {
	const {
		isOpen,
		handleCancel,
		t,
		gatewayToDelete,
		displayName,
		isDeleting,
		handleDelete,
	} = model;
	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				if (!isDeleting) handleCancel();
			}}
			title={t("settings.paymentGateway.deleteTitle")}
			size="md"
			bodyClassName="p-4 sm:p-6"
			closeOnOverlayClick={false}
			closeOnEscape={false}
			footer={
				<>
					<Button
						variant="outline"
						onClick={handleCancel}
						disabled={!!isDeleting}
					>
						{t("common.cancel")}
					</Button>
					<Button
						variant="danger"
						onClick={handleDelete}
						disabled={!!isDeleting}
						leftIcon={Trash2}
						loading={!!isDeleting}
					>
						{isDeleting ? t("common.deleting") : t("common.delete")}
					</Button>
				</>
			}
		>
			<div className="space-y-4">
				<p className="text-[rgb(var(--color-text-secondary))]">
					{t("settings.paymentGateway.confirmDelete")}
				</p>
				{gatewayToDelete && (
					<div className="bg-[rgb(var(--color-bg-secondary))] p-4 rounded-lg border border-[rgb(var(--color-border-primary))]">
						<p className="break-words font-medium text-[rgb(var(--color-text-primary))]">
							<span className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-tertiary))] mr-2">
								{gatewayToDelete.gatewayType}
							</span>
							{displayName}
						</p>
					</div>
				)}
			</div>
		</Modal>
	);
}
