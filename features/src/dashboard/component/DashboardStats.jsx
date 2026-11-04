"use client";
import { StatCards } from "@dragorbit/ui";
export function DashboardStats({ metrics, loading, layout, onSave, scope, t }) {
	return (
		<StatCards
			key={`${scope}:stats`}
			title={t("dashboard.businessOverview")}
			data={metrics}
			loading={loading}
			maxCol={4}
			minCol={2}
			itemMinWidth={140}
			layout={{ ...layout, columns: 4 }}
			onSave={onSave}
		/>
	);
}
