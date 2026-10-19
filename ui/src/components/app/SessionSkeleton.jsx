export function SessionSkeleton({ guest = false }) {
	const block = "rounded-lg bg-[rgb(var(--color-bg-tertiary))]";
	if (guest)
		return (
			<section
				aria-busy="true"
				aria-label="Loading page"
				className="min-h-dvh grid place-items-center bg-[rgb(var(--color-bg-secondary))] p-4"
			>
				<div
					aria-hidden="true"
					className="w-full max-w-md space-y-6 rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-8 motion-safe:animate-pulse"
				>
					<div className={`${block} mx-auto h-10 w-36`} />
					<div className={`${block} mx-auto h-5 w-48`} />
					<div className={`${block} h-12 w-full`} />
					<div className={`${block} h-12 w-full`} />
					<div className={`${block} h-11 w-full`} />
				</div>
			</section>
		);
	return (
		<section
			aria-busy="true"
			aria-label="Loading workspace"
			className="flex min-h-dvh bg-[rgb(var(--color-bg-secondary))]"
		>
			<aside
				aria-hidden="true"
				className="hidden w-64 shrink-0 space-y-6 border-r border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-5 lg:block motion-safe:animate-pulse"
			>
				<div className={`${block} h-9 w-36`} />
				<div className={`${block} h-14 w-full`} />
				{[1, 2, 3, 4, 5, 6].map((id) => (
					<div key={id} className={`${block} h-9 w-full`} />
				))}
			</aside>
			<div
				aria-hidden="true"
				className="min-w-0 flex-1 motion-safe:animate-pulse"
			>
				<div className="flex h-16 items-center justify-between border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-6">
					<div className={`${block} h-5 w-36`} />
					<div className={`${block} h-9 w-24`} />
				</div>
				<div className="space-y-6 p-4 sm:p-6">
					<div className={`${block} h-6 w-40`} />
					<div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
						{[1, 2, 3, 4].map((id) => (
							<div key={id} className={`${block} h-28`} />
						))}
					</div>
					<div className={`${block} h-64 w-full`} />
				</div>
			</div>
		</section>
	);
}
