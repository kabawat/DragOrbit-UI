"use client";
import { Save } from "lucide-react";
import { Button, Input, Modal, MultiSelect, Toggle } from "@dragorbit/ui";
export function UpiFormModalView({ model, mode = "add" }) {
	const {
		isOpen,
		handleCancel,
		t,
		form,
		setForm,
		errors,
		setErrors,
		storeOptions,
		handleSave,
	} = model;
	const busy = mode === "edit" ? model.isSaving : model.isCreating;
	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				if (!busy) handleCancel();
			}}
			title={
				mode === "edit"
					? `${t("settings.upi.edit")} UPI`
					: t("settings.upi.addNewUpi")
			}
			size="md"
			bodyClassName="p-4 sm:p-6"
			footer={
				<>
					<Button variant="outline" onClick={handleCancel} disabled={busy}>
						{t("common.cancel")}
					</Button>
					<Button
						variant="primary"
						leftIcon={Save}
						onClick={handleSave}
						isLoading={busy}
					>
						{mode === "edit" ? t("common.save") : t("settings.upi.addUpi")}
					</Button>
				</>
			}
			closeOnOverlayClick={false}
			closeOnEscape={false}
			className="!shadow-none"
		>
			<div className="space-y-5">
				<p className="text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
					{t("settings.upi.manageUpiDescription")}
				</p>
				<Input
					disabled={busy}
					label={t("settings.upi.upiId")}
					placeholder="merchant@paytm"
					value={form.upiId}
					onChange={(val) => {
						setForm((p) => ({ ...p, upiId: val ?? "" }));
						if (errors.upiId) setErrors((p) => ({ ...p, upiId: null }));
					}}
					error={!!errors.upiId}
					errorMessage={errors.upiId}
				/>
				<Input
					disabled={busy}
					label={t("settings.upi.labelOptional")}
					placeholder="Primary, Backup..."
					value={form.label}
					onChange={(val) => setForm((p) => ({ ...p, label: val ?? "" }))}
				/>
				<MultiSelect
					disabled={busy}
					label={t("settings.upi.assignToStores")}
					placeholder={t("settings.upi.selectStores")}
					options={storeOptions}
					value={form.storeIds?.map((id) => String(id)) || []}
					onChange={(vals) => setForm((p) => ({ ...p, storeIds: vals || [] }))}
					error={!!errors.storeIds}
					errorMessage={errors.storeIds}
					clearable={false}
				/>
				<Toggle
					disabled={busy}
					label={t("settings.upi.setAsDefault")}
					checked={form.isDefault}
					onChange={(checked) => setForm((p) => ({ ...p, isDefault: checked }))}
				/>
			</div>
		</Modal>
	);
}
