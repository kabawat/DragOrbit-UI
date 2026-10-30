"use client";
import { Trash2 } from "lucide-react";
import { Button, Modal } from "@dragorbit/ui";
export function UpiDeleteModalView({ model }) {
	const { isOpen, handleCancel, t, upiToDelete, isDeleting, handleDelete } =
		model;
	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				if (!isDeleting) handleCancel();
			}}
			title={t("settings.upi.deleteUpiTitle")}
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
					{t("settings.upi.confirmDelete")}
				</p>
				{upiToDelete && (
					<div className="bg-[rgb(var(--color-bg-secondary))] p-4 rounded-lg border border-[rgb(var(--color-border-primary))]">
						<p className="break-words font-medium text-[rgb(var(--color-text-primary))]">
							{upiToDelete.label ? (
								<>
									{upiToDelete.label}:
									<code className="text-[rgb(var(--color-primary))]">
										{upiToDelete.upiId}
									</code>
								</>
							) : (
								<code className="text-[rgb(var(--color-primary))]">
									{upiToDelete.upiId}
								</code>
							)}
						</p>
					</div>
				)}
			</div>
		</Modal>
	);
}
