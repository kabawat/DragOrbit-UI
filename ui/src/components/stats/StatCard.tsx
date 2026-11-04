"use client";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
export type StatCardData = {
	title: ReactNode;
	logo?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
	value: ReactNode;
	onClick?: () => void;
	onclick?: () => void;
	iconColor?: string;
	iconTone?: "subtle" | "solid" | "custom";
	change?: string;
	changeType?: "up" | "down";
};
export function StatCard({
	data,
	loading = false,
	className = "",
	disabled = false,
	density = "comfortable",
}: {
	data: StatCardData;
	loading?: boolean;
	className?: string;
	disabled?: boolean;
	density?: "comfortable" | "compact";
}) {
	const Icon = data.logo,
		Trend = data.changeType === "down" ? TrendingDown : TrendingUp;
	const content = (
		<>
			<div className="min-w-0">
				<div
					className={`${density === "compact" ? "text-xs leading-5" : "text-sm"} font-medium text-[rgb(var(--color-text-secondary))] mb-1`}
				>
					{data.title}
				</div>
				<div
					className={`break-words ${density === "compact" ? "text-xl leading-7" : "text-xl sm:text-2xl"} font-semibold tracking-tight tabular-nums text-[rgb(var(--color-text-primary))]`}
				>
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
					className={`${density === "compact" ? "order-first" : ""} w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${data.iconTone === "subtle" ? "bg-[rgb(var(--color-primary))]/5 text-[rgb(var(--color-primary))]" : data.iconColor || "bg-[rgb(var(--color-primary))]"}`}
				>
					<Icon
						className={`w-5 h-5 ${data.iconTone === "subtle" || data.iconTone === "custom" ? "text-current" : "text-white"}`}
						aria-hidden
					/>
				</span>
			)}
		</>
	);
	const classes = `flex w-full h-full ${density === "compact" ? "min-h-22 items-center justify-start p-4" : "items-start justify-between p-4 sm:p-5"} gap-3 text-left min-w-0 bg-[rgb(var(--color-bg-primary))] ${density === "compact" ? "rounded-xl" : "rounded-2xl"} border border-[rgb(var(--color-border-primary))] ${className}`;
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
