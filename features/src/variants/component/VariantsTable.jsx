"use client";
import { DataTable, TableRowActions } from "@dragorbit/ui";
import { Edit, Layers, Plus, Trash2 } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";
export function VariantsTable({ model }) {
	const {
		t,
		variants,
		can,
		variantDisplayLabel,
		setVariantToDelete,
		loading,
		onCreate,
		onEdit,
		onView,
	} = model;
	return (
		<DataTable
			caption={t("sidebar.variants")}
			rows={variants}
			getRowKey={(row) => row._id || row.id || row.name}
			columns={[
				{
					id: "name",
					header: t("products.displayName") || "Display name",
					width: "24%",
					cell: (variant) => (
						<>
							<button
								type="button"
								className="font-semibold text-left hover:text-[rgb(var(--color-primary))]"
								onClick={(event) => {
									event.stopPropagation();
									onView(variant._id || variant.id);
								}}
							>
								{variant.displayName || "—"}
							</button>
							{variant.isDefault && (
								<span className="ml-2 text-xs text-[rgb(var(--color-text-secondary))]">
									({t("products.default") || "default"})
								</span>
							)}
						</>
					),
				},
				{
					id: "product",
					header: t("sidebar.products"),
					width: "22%",
					cell: (variant) => variant.product?.name || "—",
				},
				{
					id: "sku",
					header: t("products.sku") || "SKU",
					width: "18%",
					cell: (variant) => variant.sku || "—",
				},
				{
					id: "mrp",
					header: t("products.mrp") || "MRP",
					align: "right",
					cell: (variant) => `₹${(parseFloat(variant.mrp) || 0).toFixed(2)}`,
				},
				{
					id: "price",
					header: t("products.sellingPrice") || "Selling Price",
					align: "right",
					cell: (variant) =>
						`₹${(parseFloat(variant.sellingPrice) || 0).toFixed(2)}`,
				},
				{
					id: "actions",
					header: t("common.actions") || "Actions",
					width: 100,
					align: "center",
					pin: false,
					hidden: !can("edit") && !can("delete"),
					cellProps: () => ({
						onClick: (event) => event.stopPropagation(),
					}),
					cell: (variant) => (
						<TableRowActions
							label={`${t("common.actions")}: ${variantDisplayLabel(variant)}`}
							actions={[
								{
									id: "edit",
									label: t("common.edit"),
									icon: Edit,
									hidden: !can("edit"),
									onClick: () => onEdit(variant._id || variant.id),
								},
								{
									id: "delete",
									label: t("common.delete"),
									icon: Trash2,
									tone: "danger",
									hidden: !can("delete"),
									onClick: () => setVariantToDelete(variant),
								},
							]}
						/>
					),
				},
			]}
			minWidth={1000}
			maxHeight="calc(100vh - 240px)"
			loading={loading && variants.length === 0}
			loadingContent={<PageLoader />}
			emptyContent={
				<EmptyState
					className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
					icon={Layers}
					title={t("sidebar.noVariants") || "No variants yet"}
					description={
						t("sidebar.noVariantsDescription") ||
						"Variants are created when you add products, or create one here"
					}
					actionButton={
						can("create")
							? {
									label: t("products.addVariant") || "Add variant",
									icon: Plus,
									onClick: onCreate,
								}
							: undefined
					}
				/>
			}
			rowProps={(variant) => ({
				className: "cursor-pointer",
				onClick: () => onView(variant._id || variant.id),
			})}
		/>
	);
}
