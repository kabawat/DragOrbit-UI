/** Content-only placeholder; the app layout owns the sidebar and header. */
export function PageSkeleton({ label = "Loading page…" }) {
	const block = "rounded-lg bg-[rgb(var(--color-bg-tertiary))]";
	return (
		<section
			aria-busy="true"
			aria-label={label}
			className="min-w-0 space-y-5 p-4 sm:p-6"
		>
			<output className="sr-only">{label}</output>
			<div aria-hidden="true" className="space-y-5 motion-safe:animate-pulse">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="space-y-2">
						<div className={`${block} h-6 w-44`} />
						<div className={`${block} h-4 w-64 max-w-full`} />
					</div>
					<div className="flex gap-2">
						<div className={`${block} h-9 w-24`} />
						<div className={`${block} h-9 w-24`} />
					</div>
				</div>
				<div className="grid gap-5 lg:grid-cols-3">
					<div className="space-y-5 lg:col-span-2">
						{["primary", "secondary"].map((id) => (
							<div
								key={id}
								className="space-y-5 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-5"
							>
								<div className={`${block} h-5 w-32`} />
								<div className="grid grid-cols-2 gap-5">
									{["one", "two", "three", "four"].map((field) => (
										<div key={field} className="space-y-2">
											<div className={`${block} h-3 w-2/3`} />
											<div className={`${block} h-5 w-full`} />
										</div>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="h-fit space-y-4 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-5">
						<div className={`${block} h-5 w-28`} />
						{["one", "two", "three"].map((id) => (
							<div key={id} className={`${block} h-10 w-full`} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
