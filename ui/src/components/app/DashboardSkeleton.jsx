export function DashboardSkeleton() {
	const block = "rounded-lg bg-[rgb(var(--color-bg-tertiary))]";
	return (
		<section
			aria-busy="true"
			aria-label="Loading dashboard"
			className="space-y-6 p-4 sm:p-6 lg:p-8"
		>
			<div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
				<div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
					<div className="grid grid-cols-2 gap-4 xl:col-span-3">
						{[1, 2, 3, 4].map((id) => (
							<div key={id} className={`${block} h-28`} />
						))}
					</div>
					<div className={`${block} h-60`} />
				</div>
				<div className={`${block} h-64`} />
			</div>
		</section>
	);
}
