"use client";
import {
	DataTable,
	EmptyState,
	TableRowActions,
	TableSkeleton,
} from "@dragorbit/ui";
import { Edit, Layers, Plus, Trash2 } from "lucide-react";
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
			caption={t("sidebar.variants")}
			rows={variants}
			getRowKey={(row) => row._id || row.id || row.name}
			columns={[
				{
					id: "name",
					header: t("products.displayName") || "Display name",
					width: "22%",
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
					header: t("sidebar.products") || "Product",
					width: "18%",
					cell: (variant) => variant.product?.name || "—",
				},
				{
					id: "sku",
					header: t("products.sku") || "SKU",
					width: "16%",
					cell: (variant) => variant.sku || "—",
				},
				{
					id: "stock",
					header: t("products.stock") || "Stock",
					align: "center",
					width: "12%",
					cell: (variant) => {
						const rawStock =
							variant.stock ??
							variant.inventory?.availableQuantity ??
							variant.inventory?.totalQuantity ??
							variant.stockQuantity;
						if (rawStock === null || rawStock === undefined || rawStock === "") {
							return <span className="text-[rgb(var(--color-text-secondary))]">—</span>;
						}
						const count = Number(rawStock);
						if (isNaN(count)) {
							return <span className="text-[rgb(var(--color-text-secondary))]">—</span>;
						}
						if (count <= 0) {
							return (
								<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
									0 {t("products.units") || "units"}
								</span>
							);
						}
						if (count < 10) {
							return (
								<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
									{count} {t("products.units") || "units"}
								</span>
							);
						}
						return (
							<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
								{count} {t("products.units") || "units"}
							</span>
						);
					},
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
			loadingContent={
				<TableSkeleton compact rows={5} label={t("common.loading")} />
			}
			emptyContent={
				<EmptyState
					fullHeight
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
