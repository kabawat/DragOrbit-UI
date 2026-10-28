"use client";

import { Tooltip as SharedTooltip, TableSkeleton } from "@dragorbit/ui";
import { DataTable } from "@dragorbit/ui/table";
import {
	AlertTriangle,
	Building2,
	CheckCircle,
	Clock,
	Copy,
	Mail,
	MessageCircle,
	MessageSquare,
	MoreVertical,
	Send,
} from "lucide-react";
export function BillTableView({ model }) {
	const {
		t,
		bills,
		openContextMenu,
		formatDate,
		formatCurrency,
		renderStatusBadge,
		enableSendMenu,
		sendMenuRefs,
		setOpenSendMenuId,
		openSendMenuId,
		buildShareUrl,
		handleCopy,
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
		<div className="h-full">
			<div className="min-w-0">
				<DataTable className="min-w-0" minWidth={800} caption="Bills">
					<thead>
						<tr>
							<th className="w-[15%] px-6 py-4 text-left">
								<span className="text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
									{t("bills.title")}
								</span>
							</th>
							<th className="w-[20%] px-6 py-4 text-left text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								{t("bills.supplier")}
							</th>
							<th className="w-[12%] px-6 py-4 text-left text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								{t("common.date")}
							</th>
							<th className="w-[12%] px-6 py-4 text-right text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								{t("invoice.total")}
							</th>
							<th className="w-[12%] px-6 py-4 text-right text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								{t("bills.paid")}
							</th>
							<th className="w-[12%] px-6 py-4 text-right text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								{t("bills.due")}
							</th>
							<th className="w-[12%] px-6 py-4 text-center text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								{t("common.status")}
							</th>
							<th className="w-24 px-6 py-4 text-center text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
								{t("common.actions")}
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{bills.map((bill, _index) => {
							// Determine status for renderStatusBadge
							let status = bill.paymentStatus || "UNPAID";
							if (new Date(bill.dueDate) < new Date() && bill.dueAmount > 0) {
								status = "OVERDUE";
							}

							// Map icons for bills
							const iconMap = {
								PAID: CheckCircle,
								PARTIAL: Clock,
								UNPAID: Clock,
								OVERDUE: AlertTriangle,
							};
							const StatusIcon = iconMap[status] || Clock;
							const rowId = bill._id || bill.id || bill.billNumber;
							return (
								<tr
									key={rowId}
									className="group transition-all duration-200 hover:bg-[rgb(var(--color-bg-tertiary))] border-b border-[rgb(var(--color-border-primary))]"
									onContextMenu={(event) => openContextMenu(event, rowId)}
								>
									<td className="w-[15%] px-6 py-4">
										<div className="font-semibold text-sm text-[rgb(var(--color-text-primary))]">
											{bill.billNumber}
										</div>
									</td>
									<td className="w-[20%] px-6 py-4">
										<div className="flex items-center">
											<Building2 className="w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))] mr-2 shrink-0" />
											<span className="text-sm text-[rgb(var(--color-text-primary))] truncate">
												{bill.supplier?.name || t("common.notAvailable")}
											</span>
										</div>
									</td>
									<td className="w-[12%] px-6 py-4 text-sm text-[rgb(var(--color-text-secondary))]">
										{formatDate(bill.billDate)}
									</td>
									<td className="w-[12%] px-6 py-4 text-right">
										<div className="font-bold text-sm text-[rgb(var(--color-text-primary))]">
											{formatCurrency(bill.totalAmount)}
										</div>
										<div className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] font-medium mt-0.5 leading-tight">
											Sub: {formatCurrency(bill.subtotal || 0)}
										</div>
									</td>
									<td className="w-[12%] px-6 py-4 text-right text-sm text-[rgb(var(--color-text-secondary))] font-medium">
										{formatCurrency(bill.paidAmount || 0)}
									</td>
									<td className="w-[12%] px-6 py-4 text-right">
										<div className="text-sm font-bold text-[rgb(var(--color-danger))]">
											{formatCurrency(
												bill.dueAmount ||
													Math.max(
														(bill.totalAmount || 0) - (bill.paidAmount || 0),
														0,
													),
											)}
										</div>
									</td>
									<td className="w-[12%] px-6 py-4 text-center">
										<div className="inline-flex">
											{renderStatusBadge(status, "bill", StatusIcon)}
										</div>
									</td>
									<td className="w-24 px-6 py-4 text-center">
										<div className="relative inline-flex items-center gap-2">
											{enableSendMenu && (
												<div
													className="relative"
													ref={(el) =>
														(sendMenuRefs.current[bill._id || bill.id] = el)
													}
												>
													<SharedTooltip content={t("common.send")}><button aria-label={t("common.send")}
														onClick={() =>
															setOpenSendMenuId(
																openSendMenuId === (bill._id || bill.id)
																	? null
																	: bill._id || bill.id,
															)
														}
														className="p-2 hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors duration-200 cursor-pointer"

													>
														<Send className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
													</button></SharedTooltip>

													{openSendMenuId === (bill._id || bill.id) && (
									<RowActionsMenu
									className="w-48 table-share-menu"
									items={[
										{ key: "whatsapp", label: t("common.whatsapp"), icon: MessageCircle, onClick: () => { const url = buildShareUrl(bill); const text = encodeURIComponent(`${bill.billNumber || bill.poNumber || "Details"}\n${url}`); window.open(`https://wa.me/?text=${text}`, "_blank"); setOpenSendMenuId(null); } },
										{ key: "email", label: t("common.email"), icon: Mail, onClick: () => { const url = buildShareUrl(bill); const subject = encodeURIComponent(bill.billNumber || bill.poNumber || "Details"); const body = encodeURIComponent(`Please review:\n${url}`); window.location.href = `mailto:?subject=${subject}&body=${body}`; setOpenSendMenuId(null); } },
										{ key: "message", label: t("common.message"), icon: MessageSquare, onClick: () => { const url = buildShareUrl(bill); const body = encodeURIComponent(`${bill.billNumber || bill.poNumber || ""} ${url}`); window.location.href = `sms:?&body=${body}`; setOpenSendMenuId(null); } },
										{ key: "share-separator", type: "separator" },
										{ key: "copy-link", label: t("common.copyLink"), icon: Copy, onClick: () => { handleCopy(buildShareUrl(bill)); setOpenSendMenuId(null); } },
									]}
								/>
													)}
												</div>
											)}

											<div
												className="relative inline-block"
												ref={(el) => (menuRefs.current[rowId] = el)}
											>
												<SharedTooltip content={t("common.actions")}><button aria-label={t("common.actions")}
													onClick={() => toggleDropdown(rowId)}
													className="p-2 hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors duration-200 group/btn cursor-pointer"

												>
													<MoreVertical className="w-4 h-4 text-[rgb(var(--color-text-secondary))] group-hover/btn:text-[rgb(var(--color-primary))]" />
												</button></SharedTooltip>

												{menu?.rowId === rowId && menu.mode === "dropdown" ? (
													<RowActionsMenu
														items={buildMenuItems(rowId)}
														mode="dropdown"
													/>
												) : null}
											</div>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</DataTable>

				{/* Loading More Indicator */}
				{isLoadingMore && <TableSkeleton compact rows={2} />}
			</div>

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
