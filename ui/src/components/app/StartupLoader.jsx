"use client";
import { Spinner } from "../feedback/Loading";
export function StartupLoader({ title, description }) {
	return (
		<output
			className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-bg-primary))]"
			aria-live="polite"
		>
			<div className="text-center">
				<Spinner size="xl" color="primary" className="mx-auto mb-4" />
				{title && (
					<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-2">
						{title}
					</h2>
				)}
				{description && (
					<p className="text-[rgb(var(--color-text-secondary))]">
						{description}
					</p>
				)}
			</div>
		</output>
	);
}
