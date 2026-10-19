"use client";
import { TableSkeleton } from "@dragorbit/ui";
/** Host model supplies state/actions; this component owns the shared markup. */
export function SalesOrderListContentView({ model }) {
	const {
		scrollRef,
		viewMode,
		SalesOrderTable,
		orders,
		handleViewDetails,
		handleUpdateStatus,
		handlePrint,
		canEdit,
		canDelete,
		SalesOrderCard,
		pagination,
		sentinelRef,
		isFetchingMore,
		isLoading,
		t,
	} = model;
	return (
		<div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.6)] overflow-hidden">
			<div className="h-[calc(100vh-210px)] overflow-y-auto" ref={scrollRef}>
				{viewMode === "table" ? (
					<div className="h-full">
						<SalesOrderTable
							orders={orders}
							onViewDetails={handleViewDetails}
							onUpdateStatus={handleUpdateStatus}
							onPrint={handlePrint}
							canEdit={canEdit}
							canDelete={canDelete}
						/>
					</div>
				) : (
					<div>
						<div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{orders.map((order, index) => (
								<SalesOrderCard
									key={order?.id || order?._id || index}
									order={order}
									onViewDetails={handleViewDetails}
									onUpdateStatus={handleUpdateStatus}
									onPrint={handlePrint}
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

				{/* Infinite scroll loading indicator */}
				{(isFetchingMore || (isLoading && orders.length > 0)) && (
					<TableSkeleton compact rows={2} />
				)}
			</div>

			{/* Footer */}
			<div className="bg-[rgb(var(--color-bg-tertiary))] border-t border-[rgb(var(--color-border-primary))] px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="text-sm text-[rgb(var(--color-text-secondary))]">
						{pagination.hasNextPage ? (
							<>
								{t("common.showing")}{" "}
								<span className="font-semibold text-[rgb(var(--color-text-primary))]">
									{orders.length}
								</span>{" "}
								{t("sidebar.sellOrders").toLowerCase()}
								<span className="ml-2 text-xs text-[rgb(var(--color-primary))]">
									• Scroll down to load more
								</span>
							</>
						) : (
							<>
								{t("common.showing")}{" "}
								<span className="font-semibold text-[rgb(var(--color-text-primary))]">
									{orders.length}
								</span>{" "}
								{t("sidebar.sellOrders").toLowerCase()}
								<span className="ml-2 text-xs text-[rgb(var(--color-text-tertiary))]">
									• No more orders
								</span>
							</>
						)}
					</div>
					<div className="text-sm text-[rgb(var(--color-text-secondary))]" />
				</div>
			</div>
		</div>
	);
}
