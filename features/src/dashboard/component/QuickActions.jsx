"use client";
import { QuickActions as ActionGrid } from "@dragorbit/ui";
import { getQuickActions } from "../model/actions";
export function QuickActions({ t, routes, onNavigate, layout, onSave, scope }) {
	return (
		<ActionGrid
			key={`${scope}:actions`}
			title={t("dashboard.quickActions")}
			data={getQuickActions(t, routes, onNavigate)}
			layout={layout}
			onSave={onSave}
		/>
	);
}
