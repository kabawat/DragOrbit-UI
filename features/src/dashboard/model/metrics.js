import {
	AlertTriangle,
	IndianRupee,
	Package,
	Receipt,
	TrendingUp,
	Users,
	Warehouse,
} from "lucide-react";

const METRICS = [
	["revenue", "totalRevenue", true, IndianRupee, "bg-green-500", "up"],
	["profit", "totalProfit", true, TrendingUp, "bg-emerald-500", "up"],
	["customers", "totalCustomers", false, Users, "bg-blue-500", "up"],
	["products", "totalProducts", false, Package, "bg-purple-500", "up"],
	["stockValue", "stockValue", true, Warehouse, "bg-indigo-500", "up"],
	["outOfStock", "outOfStock", false, AlertTriangle, "bg-red-500", "down"],
	["payables", "totalPayables", true, Receipt, "bg-orange-500", "down"],
];
export function getSummaryTotals(summary) {
	const totals = Object.fromEntries(METRICS.map(([key]) => [key, 0]));
	for (const store of Array.isArray(summary) ? summary : []) {
		for (const [key] of METRICS) {
			const value = Number(store?.[key] ?? 0);
			if (Number.isFinite(value)) totals[key] += value;
		}
	}
	return totals;
}
export function buildDashboardMetrics(summary, t) {
	const totals = getSummaryTotals(summary);
	return METRICS.map(([id, label, currency, logo, iconColor, changeType]) => ({
		id,
		title: t(`dashboard.${label}`),
		value: `${currency ? "₹" : ""}${totals[id].toLocaleString("en-IN")}`,
		logo,
		iconColor,
		iconTone: "subtle",
		change: "0%",
		changeType,
	}));
}
