"use client";
import { Award, Save } from "lucide-react";
import { Input, TagInput, Textarea } from "@dragorbit/ui";
import { FormDrawer } from "@dragorbit/ui";
export function BrandDrawerView({ model }) {
	const {
		isOpen,
		handleClose,
		t,
		handleAddBrand,
		addBrandLoading,
		newBrandData,
		iconUploading,
		setNewBrandData,
		FileUpload,
		handleIconUpload,
		handleRemoveIcon,
	} = model;
	return (
		<FormDrawer
			isOpen={isOpen}
			onClose={handleClose}
			title={t("products.addNewBrand")}
			icon={Award}
			width="w-full md:w-2/3 lg:w-1/2"
			onSave={handleAddBrand}
			onCancel={handleClose}
			saveLabel={addBrandLoading ? t("common.saving") : t("products.addBrand")}
			cancelLabel={t("common.cancel")}
			isSaving={addBrandLoading}
			saveIcon={Save}
			disabled={!newBrandData.name.trim() || iconUploading}
		>
			<div className="space-y-6">
				<div className="space-y-4">
					<h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
						{t("products.basicInformation")}
					</h3>

					<Input
						label={t("products.brandName")}
						placeholder={t("products.brandNamePlaceholder")}
						value={newBrandData.name}
						onChange={(value) =>
							setNewBrandData((prev) => ({ ...prev, name: value }))
						}
						required
					/>

					<Textarea
						label={t("common.description")}
						placeholder={t("products.enterBrandDescription")}
						value={newBrandData.description}
						onChange={(value) =>
							setNewBrandData((prev) => ({ ...prev, description: value }))
						}
						rows={3}
					/>
				</div>

				<div className="space-y-4">
					<h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
						{t("products.brandSettings")}
					</h3>

					<FileUpload
						label={t("products.brandIcon")}
						accept="image/*"
						multiple={false}
						value={
							newBrandData.metadata.icon ? [newBrandData.metadata.icon] : []
						}
						onChange={handleIconUpload}
						onRemove={handleRemoveIcon}
						loading={iconUploading}
						dropZoneLabel={t("products.clickToUpload")}
						sizeLimitLabel={t("products.imagesUpTo2MB")}
						maxSize={2 * 1024 * 1024}
					/>

					<TagInput
						label={t("products.tags")}
						placeholder={t("products.addTagsPlaceholder")}
						countLabel={t("products.tagCount")}
						value={newBrandData.metadata.tags}
						onChange={(value) =>
							setNewBrandData((prev) => ({
								...prev,
								metadata: { ...prev.metadata, tags: value },
							}))
						}
					/>
				</div>

				<div className="rounded-lg p-4 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))]">
					<h3 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
						{t("products.aboutBrands")}
					</h3>
					<p className="text-sm text-[rgb(var(--color-text-secondary))]">
						{t("products.aboutBrandsDescription")}
					</p>
				</div>
			</div>
		</FormDrawer>
	);
}
