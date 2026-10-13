"use client";
import { Search, Grid3X3, List, Package, Loader2 } from "lucide-react";
import { Select, EmptyState } from "@dragorbit/ui";
import ProductCard from "./ProductCard.jsx";
export function ProductPanelView({ model }) {
	const {
		searchRef,
		search,
		setSearch,
		selectedCategory,
		setSelectedCategory,
		categories,
		viewMode,
		setViewMode,
		isLoading,
		products,
		filteredProducts,
		addToCart,
		pagination,
		sentinelRef,
		isFetchingMore,
		getProductPrice,
		cartQtyById,
		t,
		actions,
	} = model;
	return (
		<div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-4 gap-3 min-h-0 h-full">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 flex-shrink-0">
				<div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0 w-full">
					<div className="relative flex-1 min-w-0 w-full">
						<Search
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-secondary))] pointer-events-none"
						/>
						<input
							ref={searchRef}
							type="text"
							placeholder={
								t("pos.searchPlaceholder") ||
								"Search product, SKU, or barcode..."
							}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-9 pr-4 py-2.5 text-sm bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-secondary))] focus:outline-none focus:border-[rgb(var(--color-primary))]"
						/>
					</div>
					<div className="w-full sm:w-48 md:w-56 flex-shrink-0">
						<Select
							value={selectedCategory}
							onChange={(val) => setSelectedCategory(val)}
							options={categories.map((c) => ({ label: c.name, value: c.id }))}
							placeholder="All Categories"
							searchable
						/>
					</div>
				</div>
				<div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
					{actions}
					<div className="flex items-center gap-1 bg-[rgb(var(--color-bg-secondary))] rounded-lg p-1">
						<button
							type="button"
							onClick={() => setViewMode("grid")}
							aria-label="Grid view"
							className={`p-1.5 rounded-md transition-all cursor-pointer ${
								viewMode === "grid"
									? "bg-[rgb(var(--color-primary))] text-white shadow-sm"
									: "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
							}`}
						>
							<Grid3X3 size={18} />
						</button>
						<button
							type="button"
							onClick={() => setViewMode("list")}
							aria-label="List view"
							className={`p-1.5 rounded-md transition-all cursor-pointer ${
								viewMode === "list"
									? "bg-[rgb(var(--color-primary))] text-white shadow-sm"
									: "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
							}`}
						>
							<List size={18} />
						</button>
					</div>
				</div>
			</div>

			<div
				className={`flex-1 overflow-y-auto min-h-0 custom-scrollbar p-1 sm:p-2 ${
					viewMode === "grid"
						? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 auto-rows-[minmax(160px,1fr)] sm:auto-rows-[180px] md:auto-rows-[200px]"
						: "flex flex-col gap-2 sm:gap-3"
				}`}
			>
				{isLoading && !products.length ? (
					<div className="col-span-full flex flex-col items-center justify-center py-16 text-[rgb(var(--color-text-secondary))]">
						<Loader2 className="w-8 h-8 mb-3 animate-spin opacity-50" />
						<p className="text-sm">
							{t("pos.loadingProducts") || "Loading products..."}
						</p>
					</div>
				) : filteredProducts.length === 0 ? (
					<div className="col-span-full">
						<EmptyState
							className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
							title={
								search
									? t("pos.noProductsFound") || "No Products Found"
									: t("pos.noProductsInCategory") || "No Products"
							}
							description={
								search
									? t("pos.noProductsSearchHint") ||
										`No products matching "${search}".`
									: t("pos.noProductsCategoryHint") ||
										"Try another category or sync products."
							}
							icon={search ? Search : Package}
						/>
					</div>
				) : (
					<>
						{filteredProducts.map((p) => {
							const lineId = String(p._id || p.id || "");
							const selectedQty =
								typeof cartQtyById?.get === "function"
									? cartQtyById.get(lineId) || 0
									: cartQtyById?.[lineId] || 0;
							return (
								<ProductCard
									getProductPrice={getProductPrice}
									key={lineId}
									product={p}
									onAdd={addToCart}
									viewMode={viewMode}
									selectedQty={selectedQty}
								/>
							);
						})}
						{pagination.hasNextPage && (
							<div
								ref={sentinelRef}
								className="col-span-full h-8 w-full flex items-center justify-center text-[rgb(var(--color-text-secondary))]"
							>
								{isFetchingMore ? (
									<Loader2 className="w-5 h-5 animate-spin opacity-50" />
								) : null}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
