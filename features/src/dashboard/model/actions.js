import {
	Building,
	FileText,
	IndianRupee,
	Package,
	PackagePlus,
	PieChart,
	Receipt,
	ShoppingBag,
	ShoppingCart,
	UserPlus,
	Users,
} from "lucide-react";

const STAFF_MODULES = [
	{
		key: "invoice",
		title: "Invoices & Billing",	
		icon: FileText,
		route: "invoices",
		description: "Manage sales, invoices and payments",
		color: "text-blue-500",
		bg: "bg-blue-500/10",
	},
	{
		key: "pos",
		title: "Point of Sale",
		icon: ShoppingCart,
		route: "pos",
		description: "Quick terminal for retail sales",
		color: "text-emerald-500",
		bg: "bg-emerald-500/10",
	},
	{
		key: "sales_order",
		title: "Sales Orders",
		icon: ShoppingBag,
		route: "sales-order",
		description: "Manage advance bookings and orders",
		color: "text-orange-500",
		bg: "bg-orange-500/10",
	},
	{
		key: "product",
		title: "Products",
		icon: Package,
		route: "products",
		description: "Manage catalog and variants",
		color: "text-purple-500",
		bg: "bg-purple-500/10",
	},
	{
		key: "customer",
		title: "Customers",
		icon: Users,
		route: "customers",
		description: "Detailed customer records and history",
		color: "text-indigo-500",
		bg: "bg-indigo-500/10",
	},
	{
		key: "expense",
		title: "Expenses",
		icon: Receipt,
		route: "expenses",
		description: "Record and categorize business costs",
		color: "text-rose-500",
		bg: "bg-rose-500/10",
	},
	{
		key: "supplier",
		title: "Suppliers",
		icon: Building,
		route: "suppliers",
		description: "Wholesale contacts and purchase history",
		color: "text-amber-500",
		bg: "bg-amber-500/10",
	},
	{
		key: "purchase_order",
		title: "Purchase Orders",
		icon: ShoppingCart,
		route: "purchase-orders",
		description: "Inward supply orders and tracking",
		color: "text-teal-500",
		bg: "bg-teal-500/10",
	},
	{
		key: "billing",
		title: "Bills & Payments",
		icon: IndianRupee,
		route: "bills",
		description: "Track inward stock bills and payments",
		color: "text-cyan-500",
		bg: "bg-cyan-500/10",
	},
	{
		key: "analytics",
		title: "Reports",
		icon: PieChart,
		route: "analytics/revenue",
		description: "View performance trends and reports",
		color: "text-violet-500",
		bg: "bg-violet-500/10",
	},
];

export function getStaffModules(permissions = [], routes) {
	return STAFF_MODULES.filter((module) =>
		permissions.some(
			(permission) =>
				permission.module === (module.key === "pos" ? "invoice" : module.key) &&
				permission.read === true,
		),
	).map((module) => ({ ...module, path: routes[module.route] }));
}
export function getQuickActions(t, routes, onNavigate) {
	return [
		["customer", "addCustomer", UserPlus, "customers"],
		["product", "addProduct", PackagePlus, "products/create"],
		["invoice", "newInvoice", FileText, "invoices/create"],
		["supplier", "addSupplier", Building, "suppliers"],
	].map(([id, label, logo, route]) => ({
		id: routes[route],
		title: t(`dashboard.${label}`),
		logo,
		primary: id === "invoice",
		onClick: () => onNavigate?.(routes[route]),
	}));
}
export function createDashboardRoutes(prefix = "/dashboard") {
	const paths = [
		...STAFF_MODULES.map((module) => module.route),
		"customers",
		"products/create",
		"invoices/create",
		"suppliers",
		"cashbook",
	];
	return Object.fromEntries(paths.map((path) => [path, `${prefix}/${path}`]));
}
