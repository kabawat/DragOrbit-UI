"use client";
import { Wallet } from "lucide-react";
export function CashbookSummaryCard({ today, onClick, t = (key) => key }) {
	if (!today) return null;
	const { cashIn = 0, cashOut = 0, closingBalance = 0 } = today;

	return (
		<div className="mb-2">
			<div className="flex items-center gap-2 mb-3">
				<Wallet className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
				<h3 className="font-semibold">{t("dashboard.cashbookToday")}</h3>
			</div>
			<button
				type="button"
				onClick={onClick}
				className="block w-full text-left rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4 cursor-pointer hover:border-[rgb(var(--color-border-secondary))] transition-colors"
			>
				<div className="grid grid-cols-3 gap-3 text-sm">
					<div>
						<p className="text-[rgb(var(--color-text-secondary))]">
							{t("cashbook.cashIn")}
						</p>
						<p className="font-semibold text-green-600">
							₹{cashIn.toLocaleString("en-IN")}
						</p>
					</div>
					<div>
						<p className="text-[rgb(var(--color-text-secondary))]">
							{t("cashbook.cashOut")}
						</p>
						<p className="font-semibold text-red-600">
							₹{cashOut.toLocaleString("en-IN")}
						</p>
					</div>
					<div>
						<p className="text-[rgb(var(--color-text-secondary))]">
							{t("cashbook.closingBalance")}
						</p>
						<p className="font-semibold">
							₹{closingBalance.toLocaleString("en-IN")}
						</p>
					</div>
				</div>
			</button>
		</div>
	);
}
