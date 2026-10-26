"use client";
import { FormDrawer, Input, TagInput, Textarea } from "@dragorbit/ui";
import { Save, Tags } from "lucide-react";
export function CategoryDrawerView({ model }) {
  const {
    isOpen,
    handleClose,
    t,
    handleAddCategory,
    addCategoryLoading,
    newCategoryData,
    iconUploading,
    setNewCategoryData,
    Checkbox,
    FileUpload,
    handleIconUpload,
    handleRemoveIcon,
    isEditing = false,
  } = model;
  return (
    <FormDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={
        isEditing
          ? t("products.editCategory") || "Edit Category"
          : t("products.addNewCategory") || "Add Category"
      }
      icon={Tags}
      width="w-full md:w-2/3 lg:w-1/2"
      onSave={handleAddCategory}
      onCancel={handleClose}
      saveLabel={
        addCategoryLoading
          ? t("common.saving")
          : isEditing
            ? t("products.updateCategory") || "Update Category"
            : t("products.addCategory") || "Add Category"
      }
      cancelLabel={t("common.cancel")}
      isSaving={addCategoryLoading}
      saveIcon={Save}
      disabled={!newCategoryData.name.trim() || iconUploading}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
            {t("products.basicInformation")}
          </h3>

          <Input
            label={t("products.categoryName")}
            placeholder={t("products.categoryNamePlaceholder")}
            value={newCategoryData.name}
            onChange={(value) =>
              setNewCategoryData((prev) => ({ ...prev, name: value }))
            }
            required
          />

          <Textarea
            label={t("common.description")}
            placeholder={t("products.enterCategoryDescription")}
            value={newCategoryData.description}
            onChange={(value) =>
              setNewCategoryData((prev) => ({ ...prev, description: value }))
            }
            rows={3}
          />

          <Checkbox
            label={t("products.categoryRequiresExpiryDate")}
            checked={newCategoryData.hasExpiryDate === true}
            onChange={(checked) =>
              setNewCategoryData((prev) => ({
                ...prev,
                hasExpiryDate: checked,
              }))
            }
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
            {t("products.categorySettings")}
          </h3>

          <FileUpload
            label={t("products.categoryIcon")}
            accept="image/*"
            multiple={false}
            value={
              newCategoryData.metadata.icon
                ? [newCategoryData.metadata.icon]
                : []
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
            value={newCategoryData.metadata.tags}
            onChange={(value) =>
              setNewCategoryData((prev) => ({
                ...prev,
                metadata: { ...prev.metadata, tags: value },
              }))
            }
          />
        </div>

        <div className="rounded-lg p-4 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))]">
          <h3 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
            {t("products.aboutCategories")}
          </h3>
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            {t("products.aboutCategoriesDescription")}
          </p>
        </div>
      </div>
    </FormDrawer>
  );
}
