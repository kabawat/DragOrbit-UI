export { CashbookSummaryCard } from "./component/CashbookSummaryCard";
export {
	DashboardSections,
	normalizeSections,
} from "./component/DashboardSections";
export { LowStockCard } from "./component/LowStockCard";
export { QuickActions } from "./component/QuickActions";
export { StaffDashboard } from "./component/StaffDashboard";
export { StoresSummaryTable } from "./component/StoresSummaryTable";
export {
	createDashboardRoutes,
	getQuickActions,
	getStaffModules,
} from "./model/actions";
export { buildDashboardMetrics, getSummaryTotals } from "./model/metrics";
export { DashboardScreen, default } from "./screen/DashboardScreen";
