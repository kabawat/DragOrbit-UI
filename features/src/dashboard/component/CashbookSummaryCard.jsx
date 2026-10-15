"use client";
import {
	ArrowDownLeft,
	ArrowUpRight,
	ChevronRight,
	Wallet,
} from "lucide-react";
const amount = (value) =>
	`₹${(Number.isFinite(Number(value)) ? Number(value) : 0).toLocaleString("en-IN")}`;
export function CashbookSummaryCard({ today, onClick, t = (key) => key }) {
	if (!today) return null;
	const { cashIn = 0, cashOut = 0, closingBalance = 0 } = today;
	return (
		<section className="rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4 sm:p-5">
			<div className="mb-5 flex items-center justify-between gap-3">
				<h2 className="flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
					<Wallet
						className="h-5 w-5 text-[rgb(var(--color-primary))]"
						aria-hidden
					/>
					{t("dashboard.cashbookToday")}
				</h2>
				<button
					type="button"
					onClick={onClick}
					className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg px-2 text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))]"
				>
					{t("dashboard.viewCashbook")}
					<ChevronRight className="h-4 w-4" aria-hidden />
				</button>
			</div>
			<div className="flex flex-wrap items-end justify-between gap-5">
				<div className="min-w-0">
					<p className="mb-1 text-xs text-[rgb(var(--color-text-secondary))]">
						{t("cashbook.closingBalance")}
					</p>
					<p className="break-words text-3xl font-semibold tracking-tight tabular-nums text-[rgb(var(--color-text-primary))]">
						{amount(closingBalance)}
					</p>
				</div>
				<div className="flex flex-wrap gap-4 sm:gap-6">
					{[
						["cashIn", cashIn, ArrowDownLeft],
						["cashOut", cashOut, ArrowUpRight],
					].map(([key, value, Icon]) => (
						<div key={key}>
							<p className="mb-1 text-xs text-[rgb(var(--color-text-secondary))]">
								{t(`cashbook.${key}`)}
							</p>
							<p className="flex items-center gap-1 text-sm font-medium tabular-nums text-[rgb(var(--color-text-primary))]">
								<Icon
									className="h-3.5 w-3.5 text-[rgb(var(--color-text-tertiary))]"
									aria-hidden
								/>
								{amount(value)}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
