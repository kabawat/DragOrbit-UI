"use client";
import { Crown, ShieldAlert } from "lucide-react";
export function AccessRestricted({
	isSubscriptionRestricted = false,
	canUpgrade = false,
	onUpgrade,
	onGoHome,
}) {
	return (
		<div className="min-h-full w-full relative overflow-hidden flex items-center justify-center py-10 px-4">
			{/* Subtle background glows */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-red-500/6 rounded-full blur-[120px]" />
				<div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[rgb(var(--color-primary))]/5 rounded-full blur-[100px]" />
			</div>

			{/* Centered content — stacked on all sizes for true page center */}
			<div className="relative z-10 flex flex-col items-center justify-center text-center gap-6 max-w-lg w-full">
				{/* Decorative 403 + status */}
				<div className="flex flex-col items-center select-none">
					<div className="relative">
						<span className="text-[7.5rem] sm:text-[8.75rem] font-black leading-none tracking-tighter text-[rgb(var(--color-text-primary))]/5 select-none">
							403
						</span>

						<div className="absolute inset-0 flex items-center justify-center">
							<div className="relative">
								<span
									className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"
									style={{ animationDuration: "2.5s" }}
								/>
								<div
									className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${isSubscriptionRestricted ? "from-[#f59e0b]/25 to-[#f59e0b]/10 border-[#f59e0b]/30 shadow-[#f59e0b]/20" : "from-red-500/25 to-red-700/10 border-red-500/30 shadow-red-500/20"} border shadow-xl flex items-center justify-center`}
								>
									{isSubscriptionRestricted ? (
										<Crown
											className="w-11 h-11 text-[#f59e0b] drop-shadow-sm"
											role="img"
											aria-label="Premium feature crown"
										/>
									) : (
										<ShieldAlert
											className="w-11 h-11 text-red-500 drop-shadow-sm"
											role="img"
											aria-label="Access denied shield"
										/>
									)}
								</div>
							</div>
						</div>
					</div>

					<span
						className={`mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${isSubscriptionRestricted ? "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20" : "text-red-500 bg-red-500/10 border-red-500/20"} px-4 py-1.5 rounded-full border`}
					>
						<span
							className={`w-1.5 h-1.5 rounded-full ${isSubscriptionRestricted ? "bg-[#f59e0b]" : "bg-red-500"} animate-pulse`}
						/>
						{isSubscriptionRestricted ? "Plan Limited" : "Permission Denied"}
					</span>
				</div>

				{/* Text + CTA */}
				<div className="flex flex-col items-center w-full">
					<h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-3 leading-tight">
						{isSubscriptionRestricted ? (
							<>
								Plan <span className="text-[#f59e0b]">Restricted</span>
							</>
						) : (
							<>
								Access <span className="text-red-500">Restricted</span>
							</>
						)}
					</h1>

					{isSubscriptionRestricted ? (
						<p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-8 max-w-md">
							Your current plan does not include this module. Please upgrade
							your subscription or contact your store admin to access this
							feature.
						</p>
					) : (
						<>
							<p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-2 max-w-md">
								You don&apos;t have the required permissions to view this
								section.
							</p>
							<p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed mb-8 max-w-md">
								Please contact your{" "}
								<span className="text-[rgb(var(--color-primary))] font-semibold">
									store owner
								</span>{" "}
								to request access.
							</p>
						</>
					)}

					<div className="w-24 h-px bg-[rgb(var(--color-border-primary))]/40 mb-8" />

					{isSubscriptionRestricted && canUpgrade ? (
						<button
							type="button"
							onClick={onUpgrade}
							className="cursor-pointer group flex items-center gap-2.5 px-6 py-3 bg-[#f59e0b] text-white font-semibold rounded-xl hover:bg-[#f59e0b]/90 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-[#f59e0b]/25"
						>
							<Crown
								className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
								role="img"
								aria-hidden="true"
							/>
							Upgrade Plan Now
						</button>
					) : (
						<button
							type="button"
							onClick={onGoHome}
							className="group flex items-center gap-2.5 px-6 py-3 bg-[rgb(var(--color-primary))] text-white font-semibold rounded-xl hover:bg-[rgb(var(--color-primary))]/90 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-[rgb(var(--color-primary))]/25"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2.5}
								role="img"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
								/>
							</svg>
							Return to Dashboard
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
