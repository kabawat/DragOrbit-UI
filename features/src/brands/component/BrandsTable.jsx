"use client";
import { DataTable, EntityLogo } from "@dragorbit/ui";
import { Award, Plus } from "lucide-react";
import { EmptyState } from "@dragorbit/ui";

export function BrandsTable({ model }) {
	const { t, brands, canCreate, setShowDrawer, loading } = model;
	return (
		<DataTable
			errorContent={model.error ? <EmptyState fullHeight type="error" title={t("common.error")} description={model.error} /> : undefined}
			caption={t("sidebar.brands")}
			rows={brands}
			getRowKey={(row) => row._id || row.id || row.name}
			columns={[
				{
					id: "icon",
					header: "Icon",
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
					width: "50%",
					cell: (brand) => (
						<span className="text-[rgb(var(--color-text-secondary))]">
							{brand.description || "—"}
						</span>
					),
				},
				{
					id: "products",
					header: t("sidebar.products"),
					align: "right",
					cell: (brand) => brand.productCount ?? 0,
				},
			]}
			minWidth={640}
			maxHeight="calc(100vh - 240px)"
			loading={loading && brands.length === 0}
			loadingContent={
				<div className="h-24 animate-pulse rounded-lg bg-[rgb(var(--color-bg-tertiary))]">
					<span className="sr-only">{t("common.loading")}</span>
				</div>
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
