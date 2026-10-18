/**
 * Slash shortcuts for the AI chat composer.
 * `prompt` is sent as the user message when selected (or filled into draft).
 */
export const VOICE_SLASH_COMMANDS = [
	{
		id: "sales",
		command: "/sales",
		categoryKey: "voice.slash.cat.revenue",
		labelKey: "voice.slash.sales.label",
		promptKey: "voice.slash.sales.prompt",
	},
	{
		id: "revenue",
		command: "/revenue",
		categoryKey: "voice.slash.cat.revenue",
		labelKey: "voice.slash.revenue.label",
		promptKey: "voice.slash.revenue.prompt",
	},
	{
		id: "dues",
		command: "/dues",
		categoryKey: "voice.slash.cat.customers",
		labelKey: "voice.slash.dues.label",
		promptKey: "voice.slash.dues.prompt",
	},
	{
		id: "find-customer",
		command: "/find-customer",
		categoryKey: "voice.slash.cat.customers",
		labelKey: "voice.slash.findCustomer.label",
		promptKey: "voice.slash.findCustomer.prompt",
	},
	{
		id: "create-customer",
		command: "/create-customer",
		categoryKey: "voice.slash.cat.customers",
		labelKey: "voice.slash.createCustomer.label",
		promptKey: "voice.slash.createCustomer.prompt",
	},
	{
		id: "update-customer",
		command: "/update-customer",
		categoryKey: "voice.slash.cat.customers",
		labelKey: "voice.slash.updateCustomer.label",
		promptKey: "voice.slash.updateCustomer.prompt",
	},
	{
		id: "payments",
		command: "/payments",
		categoryKey: "voice.slash.cat.customers",
		labelKey: "voice.slash.payments.label",
		promptKey: "voice.slash.payments.prompt",
	},
	{
		id: "khata",
		command: "/khata",
		categoryKey: "voice.slash.cat.customers",
		labelKey: "voice.slash.khata.label",
		promptKey: "voice.slash.khata.prompt",
	},
	{
		id: "stock",
		command: "/stock",
		categoryKey: "voice.slash.cat.inventory",
		labelKey: "voice.slash.stock.label",
		promptKey: "voice.slash.stock.prompt",
	},
	{
		id: "find-product",
		command: "/find-product",
		categoryKey: "voice.slash.cat.inventory",
		labelKey: "voice.slash.findProduct.label",
		promptKey: "voice.slash.findProduct.prompt",
	},
	{
		id: "low-stock",
		command: "/low-stock",
		categoryKey: "voice.slash.cat.inventory",
		labelKey: "voice.slash.lowStock.label",
		promptKey: "voice.slash.lowStock.prompt",
	},
	{
		id: "invoice",
		command: "/invoice",
		categoryKey: "voice.slash.cat.create",
		labelKey: "voice.slash.invoice.label",
		promptKey: "voice.slash.invoice.prompt",
	},
	{
		id: "release-invoice",
		command: "/release-invoice",
		categoryKey: "voice.slash.cat.create",
		labelKey: "voice.slash.releaseInvoice.label",
		promptKey: "voice.slash.releaseInvoice.prompt",
	},
	{
		id: "payables",
		command: "/payables",
		categoryKey: "voice.slash.cat.suppliers",
		labelKey: "voice.slash.payables.label",
		promptKey: "voice.slash.payables.prompt",
	},
	{
		id: "credit",
		command: "/credit",
		categoryKey: "voice.slash.cat.ledger",
		labelKey: "voice.slash.credit.label",
		promptKey: "voice.slash.credit.prompt",
	},
	{
		id: "debit",
		command: "/debit",
		categoryKey: "voice.slash.cat.ledger",
		labelKey: "voice.slash.debit.label",
		promptKey: "voice.slash.debit.prompt",
	},
	{
		id: "gst",
		command: "/gst",
		categoryKey: "voice.slash.cat.reports",
		labelKey: "voice.slash.gst.label",
		promptKey: "voice.slash.gst.prompt",
	},
	{
		id: "help",
		command: "/help",
		categoryKey: "voice.slash.cat.help",
		labelKey: "voice.slash.help.label",
		promptKey: "voice.slash.help.prompt",
	},
];

export function matchSlashCommands(draft) {
	const text = typeof draft === "string" ? draft : "";
	if (!text.startsWith("/")) return [];
	const query = text.slice(1).trim().toLowerCase();
	if (!query) return VOICE_SLASH_COMMANDS;
	return VOICE_SLASH_COMMANDS.filter((item) => {
		const cmd = item.command.slice(1).toLowerCase();
		return (
			cmd.includes(query) ||
			query.split(/\s+/).every((part) => cmd.includes(part))
		);
	});
}
