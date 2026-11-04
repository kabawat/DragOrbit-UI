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
			<div className="dashboard-viewport-shell flex h-dvh bg-[rgb(var(--color-bg-secondary))] overflow-hidden">
				<div className="dashboard-sidebar no-print relative z-[150] h-full shrink-0 overflow-visible">{sidebar}</div>
				<div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
					<div className="no-print">{header}</div>
					<main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
						{children}
					</main>
				</div>
			</div>
			{overlay}
		</>
	);
}
