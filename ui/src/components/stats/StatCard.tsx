"use client";
import type { ComponentType, ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
export type StatCardData = {
	title: ReactNode;
	logo?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
	value: ReactNode;
	onClick?: () => void;
	onclick?: () => void;
	iconColor?: string;
	iconTone?: "subtle" | "solid";
	change?: string;
	changeType?: "up" | "down";
};
export function StatCard({
	data,
	loading = false,
	className = "",
	disabled = false,
}: {
	data: StatCardData;
	loading?: boolean;
	className?: string;
	disabled?: boolean;
}) {
	const Icon = data.logo,
		Trend = data.changeType === "down" ? TrendingDown : TrendingUp;
	const content = (
		<>
			<div className="min-w-0">
				<div className="text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1">
					{data.title}
				</div>
				<div className="break-words text-xl sm:text-2xl font-semibold tracking-tight tabular-nums text-[rgb(var(--color-text-primary))]">
					{loading ? (
						<span
							aria-hidden="true"
							className="block h-8 w-24 motion-safe:animate-pulse rounded bg-[rgb(var(--color-bg-tertiary))]"
						/>
					) : (
						data.value
					)}
				</div>
				{!loading && data.change && Number.parseFloat(data.change) !== 0 && (
					<div
						className={`flex items-center mt-2 text-sm font-medium ${data.changeType === "down" ? "text-red-600" : "text-green-600"}`}
					>
						<Trend className="h-4 w-4 mr-1" aria-hidden="true" />
						{data.change}
					</div>
				)}
			</div>
			{Icon && (
				<span
					className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${data.iconTone === "subtle" ? "bg-[rgb(var(--color-primary))]/5 text-[rgb(var(--color-primary))]" : data.iconColor || "bg-[rgb(var(--color-primary))]"}`}
				>
					<Icon
						className={`w-5 h-5 ${data.iconTone === "subtle" ? "" : "text-white"}`}
						aria-hidden
					/>
				</span>
			)}
		</>
	);
	const classes = `flex w-full h-full items-start justify-between gap-3 text-left min-w-0 bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] p-4 sm:p-5 ${className}`;
	const click = data.onClick ?? data.onclick;
	return click ? (
		<button
			type="button"
			disabled={disabled || loading}
			onClick={click}
			aria-busy={loading}
			className={`${classes} hover:border-[rgb(var(--color-primary))] focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))] disabled:cursor-default`}
		>
			{content}
		</button>
	) : (
		<div aria-busy={loading} className={classes}>
			{content}
		</div>
	);
}
