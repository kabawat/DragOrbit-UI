"use client";
import { Button, ConfirmDialog } from "@dragorbit/ui";

import { Plus } from "lucide-react";
import { Suspense } from "react";
import { CategoriesTable } from "../component/CategoriesTable.jsx";
export function CategoriesScreen({ model }) {
  const {
    t,
    categories,
    canCreate,
    setShowDrawer,
    CategoryDrawer,
    showDrawer,
    storeId,
    fetchCategories,
    categoryToEdit,
    setCategoryToEdit,
    categoryToDelete,
    setCategoryToDelete,
    isDeleting,
    handleConfirmDelete,
    onCreate,
  } = model;

  const handleOpenCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      setCategoryToEdit?.(null);
      setShowDrawer(true);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="max-w-8xl mx-auto w-full">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
              {t("sidebar.categories")}
            </h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {model.loading && categories.length === 0 ? (
                <span
                  role="img"
                  aria-label={t("common.loading")}
                  aria-busy="true"
                  className="inline-block h-4 w-20 animate-pulse rounded bg-[rgb(var(--color-bg-tertiary))]"
                />
              ) : (
                <>
                  {categories.length} {t("common.items")}
                </>
              )}
            </p>
          </div>
          {canCreate && (
            <Button leftIcon={Plus} onClick={handleOpenCreate}>
              {t("products.addNewCategory") || "Add Category"}
            </Button>
          )}
        </div>

        <div className="px-5 pb-6">
          <CategoriesTable model={model} />
        </div>
      </div>

      {showDrawer && (
        <Suspense fallback={null}>
          <CategoryDrawer
            isOpen={showDrawer}
            onClose={() => {
              setShowDrawer(false);
              setCategoryToEdit?.(null);
            }}
            storeId={storeId}
            categoryToEdit={categoryToEdit}
            onCategoryAdded={() => {
              setShowDrawer(false);
              setCategoryToEdit?.(null);
              fetchCategories();
            }}
            onCategoryUpdated={() => {
              setShowDrawer(false);
              setCategoryToEdit?.(null);
              fetchCategories();
            }}
          />
        </Suspense>
      )}

      {categoryToDelete && (
        <ConfirmDialog
          isOpen={Boolean(categoryToDelete)}
          onClose={() => {
            if (!isDeleting) setCategoryToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          busy={isDeleting}
          title={t("products.deleteCategory") || "Delete Category"}
          description={
            <span>
              {t("products.categoryDeleteConfirm") ||
                "Are you sure you want to delete category"}
              <strong className="font-semibold text-[rgb(var(--color-text-primary))]">
                {categoryToDelete?.name}
              </strong>
              ?
            </span>
          }
          confirmLabel={t("common.delete") || "Delete"}
          cancelLabel={t("common.cancel") || "Cancel"}
          variant="danger"
        />
      )}
    </div>
  );
}
