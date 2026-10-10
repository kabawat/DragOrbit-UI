"use client";
export function DashboardShell({
	sidebar,
	header,
	children,
	overlay,
	standalone = false,
}) {
	if (standalone)
		return (
			<>
				<main className="min-h-[100dvh] bg-[rgb(var(--color-bg-primary))]">
					{children}
				</main>
				{overlay}
			</>
		);
	return (
		<>
			<div className="flex h-screen bg-[rgb(var(--color-bg-secondary))] overflow-hidden">
				<div className="no-print shrink-0">{sidebar}</div>
				<div className="flex-1 min-w-0 flex flex-col min-h-screen overflow-hidden">
					<div className="no-print">{header}</div>
					<main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
						{children}
					</main>
				</div>
			</div>
			{overlay}
		</>
	);
}
