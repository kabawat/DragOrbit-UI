"use client";
import { DataTable } from "@dragorbit/ui";
import { Plus, Tags } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";

export function CategoriesTable({ model }) {
	const { t, categories, canCreate, setShowDrawer, loading } = model;
	return (
		<DataTable
			caption={t("sidebar.categories")}
			rows={categories}
			getRowKey={(row) => row._id || row.id || row.name}
			columns={[
				{
					id: "name",
					header: t("common.name") || "Name",
					width: "35%",
					cell: (category) => (
						<span className="font-semibold">{category.name}</span>
					),
				},
				{
					id: "description",
					header: t("common.description") || "Description",
					cell: (category) => (
						<span className="text-[rgb(var(--color-text-secondary))]">
							{category.description || "—"}
						</span>
					),
				},
			]}
			minWidth={640}
			maxHeight="calc(100vh - 240px)"
			loading={loading && categories.length === 0}
			loadingContent={<PageLoader />}
			emptyContent={
				<EmptyState
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
									onClick: () => setShowDrawer(true),
									icon: Plus,
								}
							: null
					}
				/>
			}
		/>
	);
}
