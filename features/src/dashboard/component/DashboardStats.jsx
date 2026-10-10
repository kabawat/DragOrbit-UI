"use client";
import { StatCards } from "@dragorbit/ui";
export function DashboardStats({ metrics, loading, layout, onSave, scope, t }) {
	return (
		<StatCards
			key={`${scope}:stats`}
			// title={t("dashboard.title")}
			data={metrics}
			loading={loading}
			maxCol={4}
			layout={layout}
			onSave={onSave}
		/>
	);
}
