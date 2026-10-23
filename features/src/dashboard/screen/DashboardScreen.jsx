"use client";
import { Button } from "@dragorbit/ui";
import { useMemo, useState } from "react";
import { CashbookSummaryCard } from "../component/CashbookSummaryCard";
import { DashboardSections } from "../component/DashboardSections";
import { DashboardStats } from "../component/DashboardStats";
import { LowStockCard } from "../component/LowStockCard";
import { QuickActions } from "../component/QuickActions";
import { StaffDashboard } from "../component/StaffDashboard";
import { StoresSummaryTable } from "../component/StoresSummaryTable";
import { useDashboardData } from "../hook/useDashboardData";
import { createDashboardRoutes, getStaffModules } from "../model/actions";
import { buildDashboardMetrics } from "../model/metrics";

const DEFAULT_ROUTES = createDashboardRoutes();
/** @param {import("../contracts").DashboardScreenProps} props */
export function DashboardScreen({
	t,
	repository,
	storeId,
	ready = true,
	isStaff = false,
	permissions = [],
	routes = DEFAULT_ROUTES,
	onNavigate,
	scope,
	statsLayout,
	actionsLayout,
	onSaveStats,
	onSaveActions,
	initialSummary,
	onSummary,
	lowStockCount,
	sectionOrder,
	onSaveSections,
	layoutVariant = "overview",
	storeOverview: StoreOverview,
	intelligencePanel: IntelligencePanel,
	salesTrendPanel: SalesTrendPanel,
}) {
	const [salesTrendDays, setSalesTrendDays] = useState(7);
	const {
		summary,
		loading,
		today,
		salesTrend,
		salesTrendLoading,
		salesTrendError,
		error,
		retry,
	} = useDashboardData({
		repository,
		storeId,
		ready,
		isStaff,
		initialSummary,
		onSummary,
		salesTrendDays,
	});
	const metrics = useMemo(
		() => buildDashboardMetrics(summary, t),
		[summary, t],
	);
	if (isStaff)
		return (
			<div className="p-4 sm:p-6 lg:p-8">
				<StaffDashboard
					modules={getStaffModules(permissions, routes)}
					onNavigate={(module) => onNavigate?.(module.path)}
				/>
			</div>
		);
	if (error && !loading && !summary.length)
		return (
			<section role="alert" className="space-y-4 p-6">
				<h1 className="text-base font-semibold">Unable to load dashboard</h1>
				<p className="text-sm text-[rgb(var(--color-text-secondary))]">
					{error}
				</p>
				<Button type="button" onClick={retry}>
					Try again
				</Button>
			</section>
		);
	const stats = (
		<DashboardStats
			key={`${scope}:stats`}
			t={t}
			metrics={metrics}
			loading={loading}
			scope={scope}
			layout={statsLayout}
			onSave={onSaveStats}
		/>
	);
	const actions = (
		<QuickActions
			t={t}
			routes={routes}
			onNavigate={onNavigate}
			layout={actionsLayout}
			onSave={onSaveActions}
			scope={scope}
		/>
	);
	const stores = (
		<StoresSummaryTable
			data={summary}
			loading={loading}
			t={t}
			fitContainer={layoutVariant === "store"}
		/>
	);
	const cashbook = storeId && (
		<CashbookSummaryCard
			today={today}
			t={t}
			onClick={() => onNavigate?.(routes.cashbook)}
		/>
	);
	const alerts = storeId && lowStockCount != null && (
		<LowStockCard
			count={lowStockCount}
			t={t}
			onClick={() => onNavigate?.(routes["stock/alerts"])}
		/>
	);
	if (layoutVariant === "store" && StoreOverview) {
		return (
			<div className="store-dashboard-screen">
				<div className="store-dashboard-grid">
					<StoreOverview
						summary={summary}
						metrics={metrics}
						loading={loading}
						t={t}
					/>
					{IntelligencePanel && (
						<aside aria-label="Proactive retail intelligence">
							<IntelligencePanel summary={summary} />
						</aside>
					)}
				</div>
				{SalesTrendPanel && (
					<SalesTrendPanel
						data={salesTrend}
						loading={salesTrendLoading}
						error={salesTrendError}
						selectedDays={salesTrendDays}
						onRangeChange={setSalesTrendDays}
						onNavigate={onNavigate}
					/>
				)}
				<div className="store-dashboard-secondary-grid">
					{cashbook && (
						<div className="store-dashboard-cashbook">{cashbook}</div>
					)}
					<section className="store-dashboard-quick-actions">{actions}</section>
				</div>
				<div className="store-dashboard-table">{stores}</div>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6 lg:p-8 space-y-6">
			{layoutVariant === "sectioned" ? (
				<>
					{stats}
					{cashbook}
					{alerts}
					<DashboardSections
						sections={sectionOrder}
						onSave={onSaveSections}
						quickActions={actions}
						storesSummary={stores}
					/>
				</>
			) : (
				<>
					<div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-4">
						<div className="min-w-0 xl:col-span-3">{stats}</div>
						<aside className="min-w-0" aria-label={t("dashboard.quickActions")}>
							{actions}
						</aside>
					</div>
					{cashbook}
					{alerts}
					{stores}
				</>
			)}
		</div>
	);
}
export default DashboardScreen;
