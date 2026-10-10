"use client";
import type { ReactNode } from "react";

export interface HeaderTitleProps {
	title?: ReactNode;
	description?: ReactNode;
}

export function HeaderTitle({ title, description }: HeaderTitleProps) {
	const richDescription =
		description != null && typeof description !== "string";
	return (
		<div className="min-w-0 flex-1 py-0.5">
			{title != null && (
				<h1 className="truncate text-lg font-semibold leading-6 text-[rgb(var(--color-text-primary))]">
					{title}
				</h1>
			)}
			{richDescription
				? description
				: description != null && (
						<p className="mt-0.5 truncate text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
							{description}
						</p>
					)}
		</div>
	);
}

export interface AppHeaderProps extends HeaderTitleProps {
	/** Platform-owned settings, notifications, profile and network status. */
	actions?: ReactNode;
	leading?: ReactNode;
	titleContent?: ReactNode;
	className?: string;
}

export function AppHeader({
	title,
	description,
	actions,
	leading,
	titleContent,
	className = "",
}: AppHeaderProps) {
	return (
		<header
			className={`bg-[rgb(var(--color-bg-primary))]/80 backdrop-blur-md border-b border-[rgb(var(--color-border-primary))]/50 px-3 sm:px-4 py-2 shadow-sm relative z-[100] ${className}`}
		>
			<div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
				<div className="flex min-w-0 flex-1 items-center gap-2">
					{leading}
					{titleContent ?? (
						<HeaderTitle title={title} description={description} />
					)}
				</div>
				{actions != null && (
					<div className="flex max-w-full shrink-0 flex-wrap items-center gap-2 sm:gap-3">
						{actions}
					</div>
				)}
			</div>
		</header>
	);
}
