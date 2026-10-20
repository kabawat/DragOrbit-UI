"use client";

import { DataTable } from "@dragorbit/ui/table";
import { TableSkeleton } from "@dragorbit/ui";
import { Building, MoreVertical } from "lucide-react";
export function SupplierTableView({ model }) {
	const {
		className,
		suppliers,
		hoveredRow,
		setHoveredRow,
		openContextMenu,
		onViewDetails,
		CopyableContactValue,
		t,
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
					minWidth={800}
					caption="Suppliers"
				>
					{/* Table Header */}
					<thead className="bg-gradient-to-r from-[rgb(var(--color-bg-tertiary))] to-[rgb(var(--color-bg-secondary))] border-b border-[rgb(var(--color-border-primary))] sticky top-0 z-10">
						<tr>
							<th className="px-4 py-4 text-left">
								<span className="text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
									Supplier
								</span>
							</th>
							<th className="px-4 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								Contact
							</th>
							<th className="px-4 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								Account
							</th>
							<th className="px-4 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								Total Bills
							</th>
							<th className="px-4 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								Status
							</th>
							<th className="w-24 px-4 py-4 text-center">
								<MoreVertical className="w-4 h-4 mx-auto" />
							</th>
						</tr>
					</thead>

					{/* Table Body */}
					<tbody className="divide-y divide-[rgb(var(--color-border-primary))]">
						{suppliers.map((supplier, index) => {
							const rowId = supplier.id;
							return (
								<tr
									key={supplier.id}
									className={`group transition-all duration-200 hover:bg-[rgb(var(--color-bg-tertiary))] border-b border-[rgb(var(--color-border-primary))] ${hoveredRow === index ? "bg-[rgb(var(--color-bg-tertiary))]" : ""}`}
									onMouseEnter={() => setHoveredRow(index)}
									onMouseLeave={() => setHoveredRow(null)}
									onContextMenu={(event) => openContextMenu(event, rowId)}
								>
									{/* Supplier Column */}
									<td
										className="px-4 py-2 cursor-pointer"
										onClick={() => onViewDetails?.(supplier.id)}
									>
										<div className="flex items-center gap-4">
											{/* Supplier Avatar */}
											<div className="w-10 h-10 bg-gradient-to-br from-[rgb(var(--color-bg-tertiary))] to-[rgb(var(--color-bg-secondary))] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-[rgb(var(--color-border-primary))]">
												<Building className="w-6 h-6 text-[rgb(var(--color-text-tertiary))]" />
											</div>

											{/* Supplier Details */}
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-[rgb(var(--color-text-primary))] text-sm truncate group-hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
													{supplier.name || "N/A"}
												</h3>
												<p className="text-xs text-[rgb(var(--color-text-secondary))] font-medium">
													GST: {supplier.gstNumber || "N/A"}
												</p>
												<div className="flex items-center gap-2 mt-1">
													<span className="text-xs text-[rgb(var(--color-text-tertiary))]">
														Added:{" "}
														{new Date(
															supplier.createdAt || Date.now(),
														).toLocaleDateString()}
													</span>
												</div>
											</div>
										</div>
									</td>

									{/* Contact Column */}
									<td
										className="px-4 py-2 cursor-pointer"
										onClick={() => onViewDetails?.(supplier.id)}
									>
										<div className="space-y-1">
											<div className="flex items-center">
												<span className="text-sm font-semibold text-[rgb(var(--color-text-primary))] group-hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
													{supplier.agency || "N/A"}
												</span>
											</div>
											<div className="text-xs text-[rgb(var(--color-text-secondary))]">
												{supplier.phone ? (
													<CopyableContactValue
														value={supplier.phone}
														className="text-xs"
													/>
												) : (
													<CopyableContactValue
														value={supplier.email}
														className="text-xs"
													/>
												)}
											</div>
										</div>
									</td>

									{/* Account Column */}
									<td className="px-4 py-2">
										<div className="space-y-1">
											<div className="text-sm font-semibold text-green-600">
												Paid: ₹
												{supplier.account?.totalPaid?.toLocaleString() || "0"}
											</div>
											<div className="text-sm font-semibold text-red-600">
												Due: ₹
												{supplier.account?.totalDue?.toLocaleString() ||
													supplier.account?.dueAmount?.toLocaleString() ||
													"0"}
											</div>
										</div>
									</td>

									{/* Total Bills Column */}
									<td className="px-4 py-2">
										<div className="flex items-center">
											<span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
												{supplier.account?.totalBills || "0"}
											</span>
										</div>
									</td>

									{/* Status Column */}
									<td className="px-4 py-2">
										<div className="space-y-1">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${supplier.isActive ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}
											>
												{supplier.isActive
													? t("common.active")
													: t("common.inactive")}
											</span>
											<div className="text-xs text-[rgb(var(--color-text-secondary))]">
												{supplier.account?.onTimePaymentRate || "0"}% on-time
											</div>
										</div>
									</td>

									{/* Actions Column */}
									<td className="w-24 px-4 py-2 text-center">
										<div
											className="relative inline-block"
											ref={(el) => (menuRefs.current[rowId] = el)}
										>
											<button
												onClick={() => toggleDropdown(rowId)}
												className="p-2 hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors duration-200 group/btn cursor-pointer"
												title={t("common.moreActions")}
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
