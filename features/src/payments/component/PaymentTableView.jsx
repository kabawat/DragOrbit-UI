"use client";
import { TableSkeleton } from "@dragorbit/ui";
import { DataTable } from "@dragorbit/ui/table";
import { getPaymentColumns } from "./PaymentTableHeaderView";
export function PaymentTableView({ model }) {
	const {
		variant,
		showNumOfData = true,
		rowNumberOffset = 0,
		payments,
		PaymentTableRow,
		menuRefs,
		menu,
		toggleDropdown,
		openContextMenu,
		buildMenuItems,
		canEdit,
		canDelete,
		isLoadingMore,
		t,
		RowContextMenuLayer,
		closeMenu,
		RowActionsMenu,
	} = model;
	return (
		<>
			<DataTable
				variant={variant}
				showNumOfData={showNumOfData}
				rowNumberOffset={rowNumberOffset}
				rows={payments ?? []}
				columns={getPaymentColumns(t)}
				getRowKey={(payment) => payment._id || payment.id}
				caption={t("payments.title", { defaultValue: "Payments" })}
				minWidth={1000}
				renderRow={(payment, _index, { rowNumber }) => (
					<PaymentTableRow
						payment={payment}
						rowNumber={rowNumber}
						menuRefs={menuRefs}
						menu={menu}
						toggleDropdown={toggleDropdown}
						openContextMenu={openContextMenu}
						buildMenuItems={buildMenuItems}
						canEdit={canEdit}
						canDelete={canDelete}
					/>
				)}
				scrollFooter={isLoadingMore ? <TableSkeleton compact rows={2} /> : null}
			/>
			<RowContextMenuLayer
				open={menu?.mode === "context"}
				onClose={closeMenu}
			/>
			{menu?.mode === "context" ? (
				<RowActionsMenu
					mode="context"
					anchorPoint={{ x: menu.x, y: menu.y }}
					items={buildMenuItems(menu.rowId)}
					className="w-48"
				/>
			) : null}
		</>
	);
}
