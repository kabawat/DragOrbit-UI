"use client";

import { normalizeStoreSummary } from "../model/summary";
import { EmptyState } from "@dragorbit/ui";
import { DataTable } from "@dragorbit/ui/table";
import { Building2, LayoutDashboard } from "lucide-react";

const numberValue = (value) => {
	const numeric = Number(value ?? 0);
	return Number.isFinite(numeric) ? numeric : 0;
};
const formatNumber = (value) => numberValue(value).toLocaleString("en-IN");

export const StoresSummaryTable = ({
	data = [],
	loading = false,
	t = (key) => key,
	fitContainer = false,
}) => {
	data = normalizeStoreSummary(data);
	const columns = [
		{
			id: "store",
			header: t("common.store"),
			width: 150,
			cell: (store) => (
				<div className="flex items-center gap-3">
					<Building2 className="h-4 w-4" aria-hidden="true" />

					<span className="wrap-break-words font-medium">
						{store.storeName}
					</span>
				</div>
			),
		},
		...[
			["revenue", "totalRevenue", true, ""],
			["profit", "totalProfit", true, ""],
			["customers", "totalCustomers", false, ""],
			["products", "totalProducts", false, ""],
			["stockValue", "stockValue", true, ""],
			["outOfStock", "outOfStock", false, ""],
			["payables", "totalPayables", true, ""],
		].map(([id, label, currency, color]) => ({
			id,
			header: t(`dashboard.${label}`),
			width: 80,
			align: "right",
			pin: false,
			cell: (store) =>
				id === "outOfStock" ? (
					<span
						className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${numberValue(store[id]) > 0 ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}
					>
						{formatNumber(store[id])}
					</span>
				) : (
					<span
						className={`whitespace-nowrap tabular-nums ${currency ? "font-semibold" : ""} ${color}`}
					>
						{currency ? "₹" : ""}
						{formatNumber(store[id])}
					</span>
				),
		})),
	];

	return (
		<>
			<section
				className={fitContainer ? "space-y-3 xl:hidden" : "space-y-3 md:hidden"}
				aria-busy={loading}
			>
				<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
					{t("dashboard.storesSummary")}
				</h2>
				{loading ? (
					<div className="h-40 animate-pulse rounded-2xl bg-[rgb(var(--color-bg-secondary))]">
						<span className="sr-only">{t("common.loading")}</span>
					</div>
				) : !data?.length ? (
					<EmptyState icon={Building2} title={t("dashboard.noData")} />
				) : (
					data.map((store) => (
						<article
							key={store._id ?? store.id ?? store.storeId ?? store.storeName}
							className="overflow-hidden rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))]"
						>
							<h3 className="flex items-center gap-2 border-b border-[rgb(var(--color-border-primary))] px-4 py-3 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
								<Building2
									className="h-4 w-4 text-[rgb(var(--color-text-tertiary))]"
									aria-hidden
								/>
								{store.storeName}
							</h3>
							<dl className="grid grid-cols-2 gap-4 p-4">
								{[
									["revenue", "totalRevenue"],
									["profit", "totalProfit"],
								].map(([id, label]) => (
									<div key={id}>
										<dt className="mb-1 text-xs text-[rgb(var(--color-text-secondary))]">
											{t(`dashboard.${label}`)}
										</dt>
										<dd className="break-words text-xl font-semibold tabular-nums text-[rgb(var(--color-text-primary))]">
											₹{formatNumber(store[id])}
										</dd>
									</div>
								))}
							</dl>
							<dl className="grid grid-cols-3 gap-x-3 gap-y-4 border-t border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]/40 p-4">
								{[
									["products", "totalProducts", false],
									["customers", "totalCustomers", false],
									["stockValue", "stockValue", true],
									["outOfStock", "outOfStock", false],
									["payables", "totalPayables", true],
								].map(([id, label, currency]) => (
									<div key={id}>
										<dt className="mb-1 text-xs text-[rgb(var(--color-text-secondary))]">
											{t(`dashboard.${label}`)}
										</dt>
										<dd
											className={`break-words text-sm font-semibold tabular-nums ${id === "outOfStock" && numberValue(store[id]) > 0 ? "text-red-600 dark:text-red-400" : "text-[rgb(var(--color-text-primary))]"}`}
										>
											{currency ? "₹" : ""}
											{formatNumber(store[id])}
										</dd>
									</div>
								))}
							</dl>
						</article>
					))
				)}
			</section>
			<div className={fitContainer ? "hidden xl:block" : "hidden md:block"}>
				<DataTable
					rows={data ?? []}
					columns={columns}
					getRowKey={(store) =>
						store._id ?? store.id ?? store.storeId ?? store.storeName
					}
					caption={t("dashboard.storesSummary")}
					loading={loading}
					loadingContent={
						<div className="mx-auto h-16 max-w-lg animate-pulse rounded-lg bg-[rgb(var(--color-bg-tertiary))]">
							<span className="sr-only">{t("common.loading")}</span>
						</div>
					}
					emptyContent={
						<EmptyState icon={Building2} title={t("dashboard.noData")} />
					}
					showNumOfData={!fitContainer}
					layout={fitContainer ? "fixed" : "content"}
					minWidth={fitContainer ? 0 : 960}
					maxHeight={480}
					density={fitContainer ? "compact" : "comfortable"}
					className={`rounded-2xl! shadow-none! ${fitContainer ? "store-summary-fit" : ""}`}
					toolbar={
						<div className="flex items-center gap-3 mt-5 mb-3">
							<LayoutDashboard className="h-5 w-5" aria-hidden="true" />

							<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
								{t("dashboard.storesSummary")}
							</h2>
							{!loading && (
								<span className="ml-auto rounded-full bg-[rgb(var(--color-bg-tertiary))] px-3 py-1 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
									{formatNumber(data?.length)}
								</span>
							)}
						</div>
					}
				/>
			</div>
		</>
	);
};
