"use client";
import { TableSkeleton } from "@dragorbit/ui";
export function ProductListContentView({ model }) {
	const {
		StockInDrawer,
		viewMode,
		ProductTable,
		transformedProducts,
		handleEditProduct,
		handleDeleteProduct,
		handleViewProduct,
		handleStockIn,
		isLoading,
		t,
		selectedStore,
		canEdit,
		canDelete,
		ProductCard,
		pagination,
		sentinelRef,
		isFetchingMore,
		ProductDeleteConfirmModal,
		productToDelete,
		handleDeleteClose,
		handleDeleteSuccess,
		ProductDeleteSuccessModal,
		showDeleteSuccessModal,
		setShowDeleteSuccessModal,
		deletedProductName,
		ProductErrorModal,
		showErrorModal,
		setShowErrorModal,
		errorDetails,
		showStockInDrawer,
		handleCloseStockInDrawer,
		productForStockIn,
		handleStockInSuccess,
		scrollRootRef,
	} = model;
	return (
		<>
			<div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.6)] overflow-hidden">
				<div
					ref={scrollRootRef}
					className="h-[calc(100vh-210px)] overflow-y-auto"
				>
					{viewMode === "table" ? (
						<div className="h-full">
							<ProductTable
								products={transformedProducts}
								onEdit={handleEditProduct}
								onDelete={handleDeleteProduct}
								onViewDetails={handleViewProduct}
								onStockIn={handleStockIn}
								loading={isLoading}
								emptyMessage={t("products.noProducts")}
								hasStoreGst={!!selectedStore?.gst}
								canEdit={canEdit}
								canDelete={canDelete}
							/>
						</div>
					) : (
						<div>
							<div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{transformedProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
										onEdit={handleEditProduct}
										onDelete={handleDeleteProduct}
										onViewDetails={handleViewProduct}
										onStockIn={handleStockIn}
										canEdit={canEdit}
										canDelete={canDelete}
									/>
								))}
							</div>
						</div>
					)}

					{/* Sentinel — IntersectionObserver triggers load more */}
					{pagination.hasNextPage && (
						<div ref={sentinelRef} className="h-4 w-full" />
					)}

					{/* Infinite scroll loading */}
					{isFetchingMore && transformedProducts.length > 0 && (
						<TableSkeleton compact rows={2} />
					)}
				</div>

				{/* Footer */}
				<div className="bg-[rgb(var(--color-bg-tertiary))] border-t border-[rgb(var(--color-border-primary))] px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="text-sm text-[rgb(var(--color-text-secondary))]">
							{pagination.hasNextPage ? (
								<>
									Showing{" "}
									<span className="font-semibold text-[rgb(var(--color-text-primary))]">
										{transformedProducts.length}
									</span>{" "}
									products
									<span className="ml-2 text-xs text-[rgb(var(--color-primary))]">
										• Scroll down to load more
									</span>
								</>
							) : (
								<>
									<span className="font-semibold text-[rgb(var(--color-text-primary))]">
										{t("products.showingProducts", {
											count: transformedProducts.length,
										})}
									</span>
									<span className="ml-2 text-xs text-[rgb(var(--color-text-tertiary))]">
										• {t("products.noMore")}
									</span>
								</>
							)}
						</div>
						<div className="text-sm text-[rgb(var(--color-text-secondary))]" />
					</div>
				</div>
			</div>

			{/* Delete confirmation modal — self-contained */}
			<ProductDeleteConfirmModal
				productToDelete={productToDelete}
				onClose={handleDeleteClose}
				onSuccess={handleDeleteSuccess}
			/>

			{/* Delete success modal */}
			<ProductDeleteSuccessModal
				isOpen={showDeleteSuccessModal}
				onClose={() => setShowDeleteSuccessModal(false)}
				productName={deletedProductName}
			/>

			{/* Error modal */}
			<ProductErrorModal
				isOpen={showErrorModal}
				onClose={() => setShowErrorModal(false)}
				title={errorDetails?.title}
				message={errorDetails?.message}
				details={errorDetails?.details}
			/>

			{/* Stock In Drawer */}
			<StockInDrawer
				isOpen={showStockInDrawer}
				onClose={handleCloseStockInDrawer}
				item={productForStockIn}
				onSuccess={handleStockInSuccess}
				type="product"
			/>
		</>
	);
}
