"use client";
import type { ReactNode } from "react";

/** Shared content placeholder for route, list, and table loading. */
export function TableSkeleton({
	label = "Loading records…",
	rows = 6,
	compact = false,
	className = "",
}: {
	label?: ReactNode;
	rows?: number;
	compact?: boolean;
	className?: string;
}) {
	const block = "rounded bg-[rgb(var(--color-bg-tertiary))]";
	return (
		<section aria-busy="true" className={`w-full min-w-0 ${className}`}>
			<output className="sr-only">{label}</output>
			<div
				aria-hidden="true"
				className={`overflow-hidden rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] motion-safe:animate-pulse ${compact ? "" : "min-h-72"}`}
			>
				{!compact && (
					<div className="flex gap-6 border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-primary))]/5 px-4 py-4 sm:px-6">
						{[1, 2, 3, 4].map((id) => (
							<div key={id} className={`${block} h-3 flex-1`} />
						))}
					</div>
				)}
				{Array.from({ length: rows }, (_, index) => (
					<div
						key={`row-${index}`}
						className="flex items-center gap-4 border-b border-[rgb(var(--color-border-primary))] px-4 py-5 last:border-b-0 sm:gap-6 sm:px-6"
					>
						<div className={`${block} h-3 w-5 shrink-0`} />
						<div className={`${block} h-4 flex-[2]`} />
						<div className={`${block} h-4 flex-1`} />
						<div className={`${block} hidden h-4 flex-1 sm:block`} />
						<div className={`${block} h-4 w-14`} />
					</div>
				))}
			</div>
		</section>
	);
}
