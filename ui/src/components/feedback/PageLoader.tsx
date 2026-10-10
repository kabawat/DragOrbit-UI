"use client";
import type { ReactNode } from "react";
export function PageLoader({
	text = "Loading…",
	className = "",
}: {
	text?: ReactNode;
	className?: string;
}) {
	return (
		<div
			role="status"
			aria-live="polite"
			className={`bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))] p-8 mb-6 flex justify-center ${className}`}
		>
			<div className="text-center">
				<div
					aria-hidden="true"
					className="w-12 h-12 border-4 border-[rgb(var(--color-primary))] border-t-transparent rounded-full motion-safe:animate-spin mx-auto mb-4"
				/>
				<p className="text-[rgb(var(--color-text-secondary))]">{text}</p>
			</div>
		</div>
	);
}
