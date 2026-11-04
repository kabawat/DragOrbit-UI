"use client";
export function getPaymentColumns(t) {
	return [
		["payment", t("payments.payment", { defaultValue: "Payment" })],
		["supplier", t("payments.supplier", { defaultValue: "Supplier" })],
		["date", t("common.date", { defaultValue: "Date" })],
		["amount", t("payments.amount", { defaultValue: "Amount" })],
		["type", t("payments.type", { defaultValue: "Type" })],
		["method", t("payments.method", { defaultValue: "Method" })],
		["status", t("common.status", { defaultValue: "Status" })],
		["actions", t("common.actions", { defaultValue: "Actions" })],
	].map(([id, header]) => ({
		id,
		header,
		pin: false,
		fitContent: id === "actions",
		align: id === "amount" ? "right" : id === "actions" ? "center" : "left",
		cell: () => null,
	}));
}

/** Compatibility header slot; PaymentTableView uses the same column definitions. */
export function PaymentTableHeaderView({ model }) {
	return (
		<thead>
			<tr>
				{getPaymentColumns(model.t).map((column) => (
					<th key={column.id} scope="col">
						{column.header}
					</th>
				))}
			</tr>
		</thead>
	);
}
