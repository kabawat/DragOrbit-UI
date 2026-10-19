"use client";
import { Package, Plus } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";
export function ProductsScreen({ model }) {
	const {
		ProductListHeader,
		canCreate,
		searchValue,
		setSearchValue,
		sortBy,
		setSortBy,
		showInCatalog,
		setShowInCatalog,
		category,
		setCategory,
		isLoading,
		products,
		error,
		t,
		isFiltered,
		ProductListContent,
		canEdit,
		canDelete,
		onCreate,
	} = model;
	return (
		<div className="overflow-hidden">
			<div className="max-w-8xl mx-auto w-full">
				<ProductListHeader
					canCreate={canCreate}
					searchValue={searchValue}
					setSearchValue={setSearchValue}
					sortBy={sortBy}
					setSortBy={setSortBy}
					showInCatalog={showInCatalog}
					setShowInCatalog={setShowInCatalog}
					category={category}
					setCategory={setCategory}
				/>

				<div className="px-5">
          {error && !(isLoading) && products.length === 0 && <EmptyState fullHeight type="error" title={t("common.error")} description={typeof error === "string" ? error : error.message} />}

					{isLoading && products.length === 0 && !error && <PageLoader />}

					{!isLoading && products.length === 0 && !error && (
						<EmptyState
                fullHeight
							className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
							icon={Package}
							title={t("products.noProducts")}
							description={
								isFiltered
									? t("products.noResultsDescription")
									: t("products.emptyDescription")
							}
							actionButton={
								!isFiltered && canCreate
									? {
											label: t("products.addProduct"),
											onClick: onCreate,
											icon: Plus,
										}
									: null
							}
						/>
					)}

					{products.length > 0 && (
						<ProductListContent canEdit={canEdit} canDelete={canDelete} />
					)}
				</div>
			</div>
		</div>
	);
}
