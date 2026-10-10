"use client";
import { AlertTriangle } from "lucide-react";
export function LowStockCard({ count = 0, onClick, t }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="block w-full max-w-sm text-left rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4 hover:border-[rgb(var(--color-warning))]/40 transition-colors"
		>
			<div className="flex items-start gap-3">
				<div className="rounded-lg bg-[rgb(var(--color-warning))]/10 p-2">
					<AlertTriangle className="w-5 h-5 text-[rgb(var(--color-warning))]" />
				</div>
				<div>
					<p className="font-medium text-[rgb(var(--color-text-primary))]">
						{t("sidebar.lowStockAlerts")}
					</p>
					<p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
						{count > 0
							? t("inventory.lowStockAlertsCount", { count })
							: t("inventory.noLowStockAlerts")}
					</p>
				</div>
			</div>
		</button>
	);
}
