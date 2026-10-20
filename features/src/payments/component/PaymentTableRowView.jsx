"use client";
import { RowNumberCell } from "@dragorbit/ui";
import { Building2, MoreVertical } from "lucide-react";
export function PaymentTableRowView({ model }) {
	const {
		openContextMenu,
		paymentId,
		payment,
		formatDate,
		formatCurrency,
		typeBadge,
		methodBadge,
		statusBadge,
		StatusIcon,
		menuRefs,
		toggleDropdown,
		menu,
		RowActionsMenu,
		buildMenuItems,
		onRoute0,
		onRoute1,
	} = model;
	return (
		<tr
			className="group transition-all duration-200 hover:bg-[rgb(var(--color-bg-tertiary))] border-b border-[rgb(var(--color-border-primary))]"
			onContextMenu={(event) => openContextMenu(event, paymentId)}
		>
			{model.rowNumber != null ? (
				<RowNumberCell value={model.rowNumber} />
			) : null}
			<td className="">
				<button
					type="button"
					onClick={() => onRoute0(paymentId)}
					className="font-medium text-[rgb(var(--color-primary))] cursor-pointer hover:underline"
				>
					{payment.paymentNumber}
				</button>
			</td>
			<td className="">
				{payment.supplier?._id || payment.supplier?.id ? (
					<button
						type="button"
						onClick={() =>
							onRoute1(payment.supplier._id || payment.supplier.id)
						}
						className="flex items-center text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
					>
						<Building2 className="w-4 h-4 mr-2" />
						<span>{payment.supplier.name}</span>
					</button>
				) : (
					<div className="flex items-center text-[rgb(var(--color-text-primary))]">
						<Building2 className="w-4 h-4 text-[rgb(var(--color-text-tertiary))] mr-2" />
						<span>{payment.supplier?.name || "N/A"}</span>
					</div>
				)}
			</td>
			<td className="text-[rgb(var(--color-text-secondary))]">
				{formatDate(payment.paymentDate)}
			</td>
			<td className="text-right font-medium text-[rgb(var(--color-text-primary))]">
				{formatCurrency(payment.totalAmount || payment.amount)}
			</td>
			<td className="">
				<span
					className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
					style={typeBadge.style}
				>
					{typeBadge.text}
				</span>
			</td>
			<td className="">
				<span
					className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
					style={methodBadge.style}
				>
					{methodBadge.text}
				</span>
			</td>
			<td className="">
				<span
					className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
					style={statusBadge.style}
				>
					<StatusIcon className="w-3 h-3 mr-1" />
					{statusBadge.text}
				</span>
			</td>
			<td className="text-center">
				<div
					className="relative inline-block"
					ref={(el) => {
						menuRefs.current[paymentId] = el;
					}}
				>
					<button
						type="button"
						onClick={() => toggleDropdown(paymentId)}
						className="p-2 hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors duration-200 group/btn cursor-pointer"
						title="More Actions"
					>
						<MoreVertical className="w-4 h-4 text-[rgb(var(--color-text-secondary))] group-hover/btn:text-[rgb(var(--color-primary))]" />
					</button>

					{menu?.rowId === paymentId && menu.mode === "dropdown" ? (
						<RowActionsMenu items={buildMenuItems(paymentId)} mode="dropdown" />
					) : null}
				</div>
			</td>
		</tr>
	);
}
