"use client";
import { ArrowDownLeft, ArrowUpRight, Loader2, Wallet } from "lucide-react";
function formatCurrency(value) {
	return `₹${(Number(value) || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatTime(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleTimeString("en-IN", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function CashbookScreen({
	t,
	amount,
	setAmount,
	description,
	setDescription,
	entries,
	totals,
	closingBalance,
	listLoading,
	loading,
	error,
	handleCashIn,
	handleCashOut,
}) {
	return (
		<div className="p-5 space-y-6 max-w-3xl mx-auto">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4">
					<p className="text-sm text-[rgb(var(--color-text-secondary))]">
						{t("cashbook.cashIn")}
					</p>
					<p className="text-xl font-semibold text-green-600 mt-1">
						{formatCurrency(totals.cashIn)}
					</p>
				</div>
				<div className="rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4">
					<p className="text-sm text-[rgb(var(--color-text-secondary))]">
						{t("cashbook.cashOut")}
					</p>
					<p className="text-xl font-semibold text-red-600 mt-1">
						{formatCurrency(totals.cashOut)}
					</p>
				</div>
				<div className="rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4">
					<p className="text-sm text-[rgb(var(--color-text-secondary))]">
						{t("cashbook.closingBalance")}
					</p>
					<p className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mt-1">
						{formatCurrency(closingBalance)}
					</p>
				</div>
			</div>

			<div className="rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-5 space-y-4">
				<div className="flex items-center gap-2">
					<Wallet className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
					<h2 className="font-semibold text-[rgb(var(--color-text-primary))]">
						{t("cashbook.quickEntry")}
					</h2>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1 text-[rgb(var(--color-text-secondary))]">
						{t("cashbook.amount")}
					</label>
					<input
						type="number"
						min="0"
						step="0.01"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-3 py-2 text-[rgb(var(--color-text-primary))]"
						placeholder="0.00"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1 text-[rgb(var(--color-text-secondary))]">
						{t("cashbook.descriptionLabel")}
					</label>
					<input
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-3 py-2 text-[rgb(var(--color-text-primary))]"
						placeholder={t("cashbook.descriptionPlaceholder")}
					/>
				</div>

				{error && (
					<p className="text-sm text-red-600" role="alert">
						{error}
					</p>
				)}

				<div className="grid grid-cols-2 gap-3">
					<button
						type="button"
						disabled={loading || !amount}
						onClick={handleCashIn}
						className="h-11 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{loading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<ArrowDownLeft className="h-4 w-4" />
						)}
						{t("cashbook.cashIn")}
					</button>
					<button
						type="button"
						disabled={loading || !amount}
						onClick={handleCashOut}
						className="h-11 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{loading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<ArrowUpRight className="h-4 w-4" />
						)}
						{t("cashbook.cashOut")}
					</button>
				</div>
			</div>

			<div className="rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] overflow-hidden">
				<div className="px-5 py-4 border-b border-[rgb(var(--color-border-primary))]">
					<h2 className="font-semibold text-[rgb(var(--color-text-primary))]">
						{t("cashbook.todayEntries")}
					</h2>
				</div>
				{listLoading ? (
					<div className="p-8 text-center text-[rgb(var(--color-text-secondary))]">
						{t("common.loading")}
					</div>
				) : entries.length === 0 ? (
					<div className="p-8 text-center text-[rgb(var(--color-text-secondary))]">
						{t("cashbook.noEntries")}
					</div>
				) : (
					<ul className="divide-y divide-[rgb(var(--color-border-primary))]">
						{entries.map((entry) => (
							<li
								key={entry.id ?? entry.localId}
								className="px-5 py-3 flex items-center justify-between gap-4"
							>
								<div className="min-w-0">
									<p className="font-medium text-[rgb(var(--color-text-primary))] truncate">
										{entry.description ||
											t(`cashbook.types.${entry.type}`, entry.type)}
									</p>
									<p className="text-xs text-[rgb(var(--color-text-secondary))]">
										{formatTime(entry.entryDate ?? entry.createdAt)}
									</p>
								</div>
								<p
									className={`font-semibold shrink-0 ${
										entry.type === "CASH_IN" ? "text-green-600" : "text-red-600"
									}`}
								>
									{entry.type === "CASH_IN" ? "+" : "-"}
									{formatCurrency(entry.amount)}
								</p>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
export default CashbookScreen;
