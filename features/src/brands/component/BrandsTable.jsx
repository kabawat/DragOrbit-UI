"use client";
import { DataTable } from "@dragorbit/ui";
import { Award, Plus } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";

export function BrandsTable({ model }) {
	const { t, brands, canCreate, setShowDrawer, loading } = model;
	return (
		<DataTable
			caption={t("sidebar.brands")}
			rows={brands}
			getRowKey={(row) => row._id || row.id || row.name}
			columns={[
				{
					id: "name",
					header: t("common.name") || "Name",
					width: "30%",
					cell: (brand) => <span className="font-semibold">{brand.name}</span>,
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
			loadingContent={<PageLoader />}
			emptyContent={
				<EmptyState
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
