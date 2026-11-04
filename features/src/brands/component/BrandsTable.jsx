"use client";
import {
	DataTable,
	EmptyState,
	EntityLogo,
	TableRowActions,
	TableSkeleton,
} from "@dragorbit/ui";
import { Award, Edit, Plus, Trash2 } from "lucide-react";

export function BrandsTable({ model }) {
	const {
		t,
		brands,
		canCreate,
		canEdit = true,
		canDelete = true,
		setShowDrawer,
		onEdit,
		setBrandToEdit,
		setBrandToDelete,
		onCreate,
		loading,
	} = model;

	const handleEdit = (brand) => {
		if (onEdit) {
			onEdit(brand);
		} else {
			setBrandToEdit?.(brand);
			setShowDrawer(true);
		}
	};

	const handleDelete = (brand) => {
		setBrandToDelete?.(brand);
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
			caption={t("sidebar.brands")}
			rows={brands}
			getRowKey={(row) => row._id || row.id || row.name}
			columns={[
				{
					id: "icon",
					header: t("common.icon"),
					width: 96,
					pin: false,
					align: "center",
					cell: (brand) => (
						<div className="flex justify-center">
							<EntityLogo src={brand.metadata?.icon} fallbackIcon={Award} />
						</div>
					),
				},
				{
					id: "name",
					header: t("common.name") || "Name",
					width: "30%",
					cell: (brand) => (
						<span className="break-words font-semibold">{brand.name}</span>
					),
				},
				{
					id: "description",
					header: t("common.description") || "Description",
					width: "40%",
					cell: (brand) => (
						<span className="text-[rgb(var(--color-text-secondary))]">
							{brand.description || "—"}
						</span>
					),
				},
				{
					id: "products",
					header: t("sidebar.products") || "Products",
					align: "right",
					width: 100,
					cell: (brand) => brand.productCount ?? 0,
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
					cell: (brand) => (
						<TableRowActions
							label={`${t("common.actions") || "Actions"}: ${brand.name}`}
							actions={[
								{
									id: "edit",
									label: t("common.edit") || "Edit",
									icon: Edit,
									hidden: !canEdit,
									onClick: () => handleEdit(brand),
								},
								{
									id: "delete",
									label: t("common.delete") || "Delete",
									icon: Trash2,
									tone: "danger",
									hidden: !canDelete,
									onClick: () => handleDelete(brand),
								},
							]}
						/>
					),
				},
			]}
			minWidth={640}
			maxHeight="calc(100vh - 240px)"
			loading={loading && brands.length === 0}
			loadingContent={
				<TableSkeleton compact rows={5} label={t("common.loading")} />
			}
			emptyContent={
				<EmptyState
					fullHeight
					className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
					icon={Award}
					title={t("sidebar.noBrands") || "No brands yet"}
					description={
						t("sidebar.noBrandsDescription") ||
						"Create brands to organize your products"
					}
					actionButton={
						canCreate
							? {
									label: t("products.addNewBrand") || "Add Brand",
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
