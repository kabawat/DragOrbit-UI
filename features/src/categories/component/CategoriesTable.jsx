"use client";
import { DataTable, EntityLogo } from "@dragorbit/ui";
import { Plus, Tags } from "lucide-react";
import { EmptyState } from "@dragorbit/ui";

export function CategoriesTable({ model }) {
	const { t, categories, canCreate, setShowDrawer, loading } = model;
	return (
		<DataTable
			caption={t("sidebar.categories")}
			rows={categories}
			getRowKey={(row) => row._id || row.id || row.name}
			columns={[
				{
					id: "serialNumber",
					header: "SR NO",
					width: 64,
					fitContent: true,
					align: "center",
					pin: false,
					cell: (_row, index) => (
						<span className="tabular-nums text-[rgb(var(--color-text-secondary))]">
							{index + 1}
						</span>
					),
				},
				{
					id: "icon",
					header: "Icon",
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
					width: "35%",
					cell: (category) => (
						<span className="break-words font-semibold">{category.name}</span>
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
			loadingContent={
				<div className="h-24 animate-pulse rounded-lg bg-[rgb(var(--color-bg-tertiary))]">
					<span className="sr-only">{t("common.loading")}</span>
				</div>
			}
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
