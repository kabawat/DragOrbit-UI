"use client";
import {
  DataTable,
  EmptyState,
  EntityLogo,
  TableRowActions,
  TableSkeleton,
} from "@dragorbit/ui";
import { Edit, Plus, Tags, Trash2 } from "lucide-react";

export function CategoriesTable({ model }) {
  const {
    t,
    categories,
    canCreate,
    canEdit = true,
    canDelete = true,
    setShowDrawer,
    onEdit,
    setCategoryToEdit,
    setCategoryToDelete,
    onCreate,
    loading,
  } = model;

  const handleEdit = (category) => {
    if (onEdit) {
      onEdit(category);
    } else {
      setCategoryToEdit?.(category);
      setShowDrawer(true);
    }
  };

  const handleDelete = (category) => {
    setCategoryToDelete?.(category);
  };

  return (
    <DataTable
      errorContent={
        model.error ? (
          <EmptyState
            fullHeight
            type="error"
            title={t("common.error")}
            description={model.error}
          />
        ) : undefined
      }
      caption={t("sidebar.categories")}
      rows={categories}
      getRowKey={(row) => row._id || row.id || row.name}
      columns={[
        {
          id: "icon",
          header: t("common.icon"),
          width: 96,
          pin: false,
          align: "center",
          cell: (category) => (
            <div className="flex justify-center">
              <EntityLogo src={category.metadata?.icon} fallbackIcon={Tags} />
            </div>
          ),
        },
        {
          id: "name",
          header: t("common.name") || "Name",
          width: "30%",
          cell: (category) => (
            <span className="break-words font-semibold">{category.name}</span>
          ),
        },
        {
          id: "description",
          header: t("common.description") || "Description",
          width: "40%",
          cell: (category) => (
            <span className="text-[rgb(var(--color-text-secondary))]">
              {category.description || "—"}
            </span>
          ),
        },
        {
          id: "products",
          header: t("sidebar.products") || "Products",
          align: "right",
          width: 100,
          cell: (category) => category.productCount ?? 0,
        },
        {
          id: "actions",
          header: t("common.actions") || "Actions",
          width: 100,
          align: "center",
          pin: false,
          hidden: !canEdit && !canDelete,
          cellProps: () => ({
            onClick: (event) => event.stopPropagation(),
          }),
          cell: (category) => (
            <TableRowActions
              label={`${t("common.actions") || "Actions"}: ${category.name}`}
              actions={[
                {
                  id: "edit",
                  label: t("common.edit") || "Edit",
                  icon: Edit,
                  hidden: !canEdit,
                  onClick: () => handleEdit(category),
                },
                {
                  id: "delete",
                  label: t("common.delete") || "Delete",
                  icon: Trash2,
                  tone: "danger",
                  hidden: !canDelete,
                  onClick: () => handleDelete(category),
                },
              ]}
            />
          ),
        },
      ]}
      minWidth={640}
      maxHeight="calc(100vh - 240px)"
      loading={loading && categories.length === 0}
      loadingContent={
        <TableSkeleton compact rows={5} label={t("common.loading")} />
      }
      emptyContent={
        <EmptyState
          fullHeight
          className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
          icon={Tags}
          title={t("sidebar.noCategories") || "No categories yet"}
          description={
            t("sidebar.noCategoriesDescription") ||
            "Create categories to organize products"
          }
          actionButton={
            canCreate
              ? {
                  label: t("products.addNewCategory") || "Add Category",
                  onClick: onCreate || (() => setShowDrawer(true)),
                  icon: Plus,
                }
              : null
          }
        />
      }
    />
  );
}
