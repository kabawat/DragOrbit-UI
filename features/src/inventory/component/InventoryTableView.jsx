"use client";

import { DataTable } from "@dragorbit/ui/table";
import { TableSkeleton } from "@dragorbit/ui";
import { MoreVertical, Package } from "lucide-react";
export function InventoryTableView({ model }) {
	const {
		className,
		inventories,
		hoveredRow,
		setHoveredRow,
		openContextMenu,
		imageError,
		Image,
		setImageError,
		getInventoryStatusBadge,
		getPaymentStatusBadge,
		menuRefs,
		toggleDropdown,
		menu,
		RowActionsMenu,
		buildMenuItems,
		isLoadingMore,
		RowContextMenuLayer,
		closeMenu,
	} = model;
	return (
		<div className={`${className}`}>
			<div className="relative">
				<DataTable
					className="min-w-0"
					minWidth={1200}
					caption="Inventory"
				>
					{/* Table Header */}
					<thead className="bg-gradient-to-r from-[rgb(var(--color-bg-tertiary))] to-[rgb(var(--color-bg-secondary))] border-b border-[rgb(var(--color-border-primary))] sticky top-0 z-10">
						<tr>
							<th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								Product
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								Stock
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								Batches
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								Pricing
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								Payment
							</th>
							<th className="px-6 py-4 w-24 text-center text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								<MoreVertical className="w-4 h-4 text-[rgb(var(--color-text-secondary))] group-hover/btn:text-[rgb(var(--color-primary))]" />
							</th>
						</tr>
					</thead>

					{/* Table Body */}
					<tbody className="divide-y divide-[rgb(var(--color-border-primary))]">
						{inventories.map((inventory, index) => {
							const rowId = inventory.id;
							return (
								<tr
									key={inventory.id}
									className={`group transition-all duration-200 hover:bg-[rgb(var(--color-bg-tertiary))] border-b border-[rgb(var(--color-border-primary))] ${hoveredRow === index ? "bg-[rgb(var(--color-bg-tertiary))]" : ""}`}
									onMouseEnter={() => setHoveredRow(index)}
									onMouseLeave={() => setHoveredRow(null)}
									onContextMenu={(event) => openContextMenu(event, rowId)}
								>
									{/* Product Column */}
									<td className="px-6 py-4 relative">
										<div className="flex items-center gap-4">
											{/* Product Image */}
											<div className="w-12 h-12 bg-gradient-to-br from-[rgb(var(--color-bg-tertiary))] to-[rgb(var(--color-bg-secondary))] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-[rgb(var(--color-border-primary))]">
												{inventory.product?.image &&
												!imageError[inventory.id] ? (
													<Image
														src={inventory.product.image}
														alt={inventory.product.name}
														width={48}
														height={48}
														className="object-cover"
														onError={() =>
															setImageError((prev) => ({
																...prev,
																[inventory.id]: true,
															}))
														}
													/>
												) : (
													<Package className="w-6 h-6 text-[rgb(var(--color-text-tertiary))]" />
												)}
											</div>

											{/* Product Details */}
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-[rgb(var(--color-text-primary))] text-sm truncate">
													{inventory.product?.name || "Unknown Product"}
												</h3>
												<p className="text-xs text-[rgb(var(--color-text-secondary))] font-medium">
													{inventory.product?.brand || "Unknown Brand"}
												</p>
												<div className="flex items-center gap-2 mt-1">
													<span className="text-xs text-[rgb(var(--color-text-tertiary))]">
														{inventory.product?.category || "No Category"}
													</span>
												</div>
											</div>
										</div>
									</td>

									{/* Stock Column */}
									<td className="px-6 py-4">
										<div className="space-y-1">
											<div className="flex items-center">
												<span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
													{inventory.stockSummary?.availableQuantity || 0}
												</span>
												<span className="text-xs text-[rgb(var(--color-text-tertiary))] ml-1">
													available
												</span>
											</div>
											<div className="text-xs text-[rgb(var(--color-text-secondary))]">
												Total: {inventory.stockSummary?.totalQuantity || 0}
											</div>
										</div>
									</td>

									{/* Status Column */}
									<td className="px-6 py-4">
										{getInventoryStatusBadge(inventory)}
									</td>

									{/* Batches Column */}
									<td className="px-6 py-4">
										<div className="space-y-1">
											<div className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
												{inventory.batchSummary?.totalBatches || 0} batches
											</div>
											<div className="text-xs text-[rgb(var(--color-text-secondary))]">
												{inventory.batchSummary?.activeBatches || 0} active
											</div>
										</div>
									</td>

									{/* Pricing Column */}
									<td className="px-6 py-4">
										<div className="space-y-1">
											<div className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
												₹
												{inventory.pricingSummary?.averageSellingPrice?.toLocaleString() ||
													"0"}
											</div>
											<div className="text-xs text-[rgb(var(--color-text-secondary))]">
												Cost: ₹
												{inventory.pricingSummary?.averagePurchasePrice?.toLocaleString() ||
													"0"}
											</div>
										</div>
									</td>

									{/* Payment Column */}
									<td className="px-6 py-4">
										{getPaymentStatusBadge(
											inventory.paymentSummary?.paymentStatus,
										)}
									</td>

									{/* Actions Column */}
									<td className="px-4 py-4 w-24 text-start">
										<div
											className="relative"
											ref={(el) => (menuRefs.current[rowId] = el)}
										>
											<button
												onClick={() => toggleDropdown(rowId)}
												className="p-2 hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors duration-200 group/btn cursor-pointer"
												title="More Actions"
											>
												<MoreVertical className="w-4 h-4 text-[rgb(var(--color-text-secondary))] group-hover/btn:text-[rgb(var(--color-primary))]" />
											</button>

											{menu?.rowId === rowId && menu.mode === "dropdown" ? (
												<RowActionsMenu
													items={buildMenuItems(rowId)}
													mode="dropdown"
												/>
											) : null}
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</DataTable>
			</div>

			{/* Infinite Scroll Loading */}
			{isLoadingMore && <TableSkeleton compact rows={2} />}

			<RowContextMenuLayer
				open={menu?.mode === "context"}
				onClose={closeMenu}
			/>
			{menu?.mode === "context" ? (
				<RowActionsMenu
					mode="context"
					anchorPoint={{
						x: menu.x,
						y: menu.y,
					}}
					items={buildMenuItems(menu.rowId)}
					className="w-48"
				/>
			) : null}
		</div>
	);
}
