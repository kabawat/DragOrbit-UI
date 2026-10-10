"use client";
import { ChevronRight, Layout } from "lucide-react";
export const StaffDashboard = ({
	modules: accessibleModules = [],
	onNavigate,
}) => {
	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
			{/* Staff Welcome Section */}
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] p-8 text-white shadow-xl shadow-[rgb(var(--color-primary))]/10">
				<div className="relative z-10">
					<h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
					<p className="opacity-90 max-w-lg text-sm leading-relaxed">
						Access your assigned tools and manage store operations below. Select
						a module to get started.
					</p>
				</div>
				{/* Decorative Pattern */}
				<div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
					<Layout className="w-64 h-64 opacity-10 rotate-12" />
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{accessibleModules.length > 0 ? (
					accessibleModules.map((module) => (
						<button
							type="button"
							key={module.key}
							onClick={() => onNavigate?.(module)}
							className="group relative flex flex-col p-6 bg-[rgb(var(--color-bg-primary))]/30 backdrop-blur-md border border-[rgb(var(--color-border-primary))]/50 rounded-2xl transition-all duration-300 hover:border-[rgb(var(--color-primary))]/40 hover:bg-[rgb(var(--color-bg-primary))]/60 hover:-translate-y-1 text-left"
						>
							<div
								className={`w-12 h-12 ${module.bg} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
							>
								<module.icon className={`w-6 h-6 ${module.color}`} />
							</div>

							<h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))] mb-1 flex items-center justify-between">
								{module.title}
								<ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-[rgb(var(--color-primary))]" />
							</h3>
							<p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
								{module.description}
							</p>

							{/* Accent Dot */}
							<div className="absolute bottom-4 right-4 w-1 h-1 rounded-full bg-[rgb(var(--color-primary))]/20 group-hover:bg-[rgb(var(--color-primary))]/60 transition-colors" />
						</button>
					))
				) : (
					<div className="col-span-full py-20 text-center bg-[rgb(var(--color-bg-primary))]/20 rounded-3xl border border-dashed border-[rgb(var(--color-border-primary))]/50">
						<div className="w-20 h-20 bg-[rgb(var(--color-bg-tertiary))] rounded-full flex items-center justify-center mx-auto mb-6">
							<Layout className="w-10 h-10 text-[rgb(var(--color-text-tertiary))]" />
						</div>
						<h2 className="text-xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
							No Modules Assigned
						</h2>
						<p className="text-[rgb(var(--color-text-secondary))] max-w-sm mx-auto">
							It seems you don't have access to any modules yet. Please contact
							your store manager to assign permissions.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
