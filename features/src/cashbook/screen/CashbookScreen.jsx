"use client";
import { Button, EmptyState, IconButton, Input, Select } from "@dragorbit/ui";
import { DataTable } from "@dragorbit/ui/table";
import {
	ArrowDownLeft,
	ArrowUpRight,
	RefreshCw,
	Search,
	Wallet,
} from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";

function formatCurrency(value) {
	return `₹${(Number(value) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatTime(value) {
	const date = new Date(value);
	return value && !Number.isNaN(date.getTime())
		? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
		: "—";
}
const surface =
	"rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))]";

export function CashbookScreen({
	t,
	amount,
	setAmount,
	description,
	setDescription,
	entries = [],
	totals = {},
	closingBalance,
	listLoading,
	refreshing = false,
	loading,
	error,
	handleCashIn,
	handleCashOut,
	onRefresh,
	listError,
	disabled = false,
}) {
	const id = useId();
	const saving = useRef(false);
	const [direction, setDirection] = useState("CASH_IN");
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState("ALL");
	const [submitting, setSubmitting] = useState(false);
	const busy = loading || submitting;
	const validAmount = Number.isFinite(Number(amount)) && Number(amount) > 0;
	const visibleEntries = useMemo(() => {
		const search = query.trim().toLocaleLowerCase();
		return entries.filter(
			(entry) =>
				(filter === "ALL" || entry.type === filter) &&
				(!search ||
					`${entry.description ?? ""} ${entry.amount} ${t(`cashbook.types.${entry.type}`)}`
						.toLocaleLowerCase()
						.includes(search)),
		);
	}, [entries, filter, query, t]);
	const typeLabel = (entry) => t(`cashbook.types.${entry.type}`);
	const money = (entry) => (
		<span className="whitespace-nowrap font-semibold tabular-nums">
			{entry.type === "CASH_IN" ? "+" : "−"}
			{formatCurrency(entry.amount)}
		</span>
	);
	const typeBadge = (entry) => {
		const Icon = entry.type === "CASH_IN" ? ArrowDownLeft : ArrowUpRight;
		return (
			<span className="inline-flex items-center gap-1.5 rounded-md bg-[rgb(var(--color-bg-tertiary))] px-2 py-1 text-xs font-medium text-[rgb(var(--color-text-secondary))]">
				<Icon className="h-3.5 w-3.5" aria-hidden />
				{typeLabel(entry)}
			</span>
		);
	};
	const columns = [
		{
			id: "description",
			header: t("cashbook.descriptionLabel"),
			minWidth: 200,
			cell: (entry) => (
				<span className="break-words">
					{entry.description || typeLabel(entry)}
				</span>
			),
		},
		{
			id: "type",
			header: t("cashbook.transactionType"),
			minWidth: 130,
			cell: typeBadge,
		},
		{
			id: "time",
			header: t("cashbook.time"),
			minWidth: 110,
			cell: (entry) => (
				<span className="whitespace-nowrap text-[rgb(var(--color-text-secondary))]">
					{formatTime(entry.createdAt ?? entry.entryDate)}
				</span>
			),
		},
		{
			id: "amount",
			header: t("cashbook.amount"),
			minWidth: 140,
			align: "right",
			cell: money,
		},
	];
	const submit = async (event) => {
		event.preventDefault();
		if (busy || disabled || !validAmount || saving.current) return;
		saving.current = true;
		setSubmitting(true);
		try {
			await (direction === "CASH_IN" ? handleCashIn() : handleCashOut());
		} catch {
			/* The entry hook supplies the error; preserve the input for retry. */
		} finally {
			saving.current = false;
			setSubmitting(false);
		}
	};
	const emptyMessage = entries.length
		? t("cashbook.noMatchingEntries")
		: t("cashbook.noEntries");
	return (
		<div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
					<Wallet
						className="h-4 w-4 text-[rgb(var(--color-primary))]"
						aria-hidden
					/>
					{t("cashbook.todayOverview")}
				</div>
				{onRefresh && (
					<IconButton
						icon={RefreshCw}
						title={t("cashbook.refresh")}
						disabled={listLoading || refreshing || busy}
						iconClassName={`h-4 w-4 ${listLoading || refreshing ? "animate-spin" : ""}`}
						aria-busy={listLoading || refreshing}
						onClick={onRefresh}
					/>
				)}
			</div>
			<div
				className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
				aria-busy={listLoading}
			>
				{[
					["closingBalance", closingBalance, Wallet],
					["cashIn", totals.cashIn, ArrowDownLeft],
					["cashOut", totals.cashOut, ArrowUpRight],
				].map(([key, value, Icon], index) => (
					<div
						key={key}
						className={`${surface} p-4 sm:p-5 ${index === 0 ? "col-span-2 border-[rgb(var(--color-primary))]/20! sm:col-span-1" : ""}`}
					>
						<div className="mb-3 flex items-center justify-between gap-2">
							<p className="text-sm text-[rgb(var(--color-text-secondary))]">
								{t(`cashbook.${key}`)}
							</p>
							<Icon
								className="h-4 w-4 shrink-0 text-[rgb(var(--color-text-tertiary))]"
								aria-hidden
							/>
						</div>
						{listLoading ? (
							<div className="h-8 w-28 max-w-full animate-pulse rounded bg-[rgb(var(--color-bg-tertiary))]" />
						) : (
							<p className="break-words text-xl font-semibold tracking-tight tabular-nums text-[rgb(var(--color-text-primary))] sm:text-2xl">
								{listError ? "—" : formatCurrency(value)}
							</p>
						)}
					</div>
				))}
			</div>
			<div className="grid items-start gap-6 xl:grid-cols-3">
				<section className={`${surface} order-1 p-4 sm:p-5 xl:order-2`}>
					<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
						{t("cashbook.quickEntry")}
					</h2>
					<p className="mb-5 mt-1 text-xs leading-5 text-[rgb(var(--color-text-secondary))]">
						{t("cashbook.entryHint")}
					</p>
					<form onSubmit={submit} className="space-y-5" aria-busy={busy}>
						<Input
							id={`${id}-amount`}
							label={t("cashbook.amount")}
							type="number"
							min="0.01"
							step="0.01"
							placeholder="0.00"
							value={amount}
							onChange={setAmount}
							disabled={busy || disabled}
							required
							leftIcon={() => <span aria-hidden>₹</span>}
							className="h-auto py-3 text-2xl font-semibold tabular-nums"
						/>
						<fieldset disabled={busy || disabled}>
							<legend className="mb-2 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
								{t("cashbook.transactionType")}
							</legend>
							<div className="grid grid-cols-2 gap-2">
								{[
									["CASH_IN", ArrowDownLeft],
									["CASH_OUT", ArrowUpRight],
								].map(([type, Icon]) => (
									<label
										key={type}
										className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border p-2 text-sm font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[rgb(var(--color-primary))] ${direction === type ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 text-[rgb(var(--color-primary))]" : "border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-secondary))]"}`}
									>
										<input
											type="radio"
											name={`${id}-direction`}
											className="sr-only"
											value={type}
											checked={direction === type}
											onChange={() => setDirection(type)}
										/>
										<Icon className="h-4 w-4" aria-hidden />
										{t(`cashbook.types.${type}`)}
									</label>
								))}
							</div>
						</fieldset>
						<div>
							<label
								htmlFor={`${id}-description`}
								className="mb-2 block text-sm font-medium text-[rgb(var(--color-text-secondary))]"
							>
								{t("cashbook.descriptionLabel")}
							</label>
							<textarea
								id={`${id}-description`}
								rows={3}
								value={description}
								onChange={(event) => setDescription(event.target.value)}
								disabled={busy || disabled}
								placeholder={t("cashbook.descriptionPlaceholder")}
								className="w-full resize-y rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-3 py-2 text-sm text-[rgb(var(--color-text-primary))] focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))]"
							/>
						</div>
						{error && (
							<p role="alert" className="text-sm text-red-600">
								{error}
							</p>
						)}
						<Button
							type="submit"
							fullWidth
							loading={busy}
							disabled={busy || disabled || !validAmount}
						>
							{t("cashbook.saveEntry")} · {t(`cashbook.types.${direction}`)}
						</Button>
					</form>
				</section>
				<section
					className="order-2 min-w-0 space-y-4 xl:order-1 xl:col-span-2"
					aria-busy={listLoading}
				>
					<div>
						<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
							{t("cashbook.todayEntries")}
						</h2>
						<p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
							{t("cashbook.recentEntriesHint")}
						</p>
					</div>
					<div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
						<Input
							value={query}
							onChange={setQuery}
							placeholder={t("cashbook.searchEntries")}
							aria-label={t("cashbook.searchEntries")}
							leftIcon={Search}
						/>
						<Select
							value={filter}
							onChange={setFilter}
							options={[
								{ value: "ALL", label: t("cashbook.allEntries") },
								...["CASH_IN", "CASH_OUT"].map((value) => ({
									value,
									label: t(`cashbook.types.${value}`),
								})),
							]}
							searchable={false}
						/>
					</div>
					{listError ? (
						<div className={`${surface} space-y-3 p-5`} role="alert">
							<p className="text-sm text-[rgb(var(--color-text-secondary))]">
								{t("cashbook.loadFailed")}
							</p>
							{onRefresh && (
								<Button
									variant="outline"
									size="sm"
									disabled={listLoading}
									onClick={onRefresh}
								>
									{t("cashbook.retry")}
								</Button>
							)}
						</div>
					) : !listLoading && !visibleEntries.length ? (
						<div className={surface} aria-live="polite">
							<EmptyState title={emptyMessage} icon={Wallet} />
						</div>
					) : (
						<>
							<div className="hidden md:block">
								<DataTable
									rows={visibleEntries}
									columns={columns}
									getRowKey={(entry) => entry.id ?? entry._id ?? entry.localId}
									caption={t("cashbook.todayEntries")}
									density="compact"
									maxHeight={600}
									loading={listLoading}
									loadingContent={
										<div className="h-32 animate-pulse rounded-lg bg-[rgb(var(--color-bg-tertiary))]" />
									}
								/>
							</div>
							<div className={`${surface} overflow-hidden md:hidden`}>
								{listLoading ? (
									<div className="space-y-4 p-5">
										{[1, 2, 3].map((key) => (
											<div
												key={key}
												className="h-12 animate-pulse rounded-lg bg-[rgb(var(--color-bg-tertiary))]"
											/>
										))}
									</div>
								) : (
									<ul className="divide-y divide-[rgb(var(--color-border-primary))]">
										{visibleEntries.map((entry) => (
											<li
												key={entry.id ?? entry._id ?? entry.localId}
												className="space-y-2 p-4"
											>
												<div className="flex items-start justify-between gap-4">
													<p className="min-w-0 break-words text-sm text-[rgb(var(--color-text-primary))]">
														{entry.description || typeLabel(entry)}
													</p>
													{money(entry)}
												</div>
												<div className="flex items-center justify-between gap-3">
													{typeBadge(entry)}
													<span className="text-xs text-[rgb(var(--color-text-secondary))]">
														{formatTime(entry.createdAt ?? entry.entryDate)}
													</span>
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						</>
					)}
				</section>
			</div>
		</div>
	);
}
export default CashbookScreen;
