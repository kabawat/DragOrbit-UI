"use client";
import { Button, DateRangeFilter, Input, Select } from "@dragorbit/ui";
import { DataTable } from "@dragorbit/ui/table";
import {
	ArrowDown,
	ArrowUp,
	FileText,
	Plus,
	RefreshCw,
	Save,
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
	startDate = "",
	endDate = "",
	onDateChange,
	listError,
	disabled = false,
}) {
	const id = useId();
	const today = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());
	const isToday = startDate === today && endDate === today;
	const saving = useRef(false);
	const [direction, setDirection] = useState("CASH_IN");
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState("ALL");
	const [submitting, setSubmitting] = useState(false);
	const busy = loading || submitting;
	const reasons =
		direction === "CASH_IN"
			? ["sales", "customerPayment", "advance"]
			: ["supplierPayment", "officeExpense", "transport"];
	const changeDirection = (next) => {
		if (
			reasons.some((reason) => description === t(`cashbook.reasons.${reason}`))
		)
			setDescription("");
		setDirection(next);
	};
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
		<span
			className={`whitespace-nowrap font-semibold tabular-nums ${entry.type === "CASH_IN" ? "text-emerald-600" : "text-rose-600"}`}
		>
			{entry.type === "CASH_IN" ? "+" : "−"}
			{formatCurrency(entry.amount)}
		</span>
	);
	const typeBadge = (entry) => {
		const Icon = entry.type === "CASH_IN" ? ArrowDown : ArrowUp;
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
		: t(isToday ? "cashbook.noEntries" : "cashbook.noEntriesForDate");
	return (
		<div
			className={`bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] mx-auto w-full space-y-5 p-4 text-sm leading-5 sm:p-6 [&_*]:shadow-none!`}
		>
			<div
				className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
				aria-busy={listLoading}
			>
				{[
					["closingBalance", closingBalance, Wallet],
					["cashIn", totals.cashIn, ArrowDown],
					["cashOut", totals.cashOut, ArrowUp],
				].map(([key, value, Icon], index) => (
					<div
						key={key}
						className={`${surface} relative flex min-h-26 items-center gap-3 overflow-hidden sm:gap-4 ${key === "closingBalance" ? "text-[rgb(var(--color-primary))]" : key === "cashIn" ? "text-emerald-600" : "text-rose-600"} p-4 sm:p-5 ${index === 0 ? "col-span-2 sm:col-span-1" : ""}`}
					>
						<span
							className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl [&_svg]:h-5 [&_svg]:w-5 ${key === "closingBalance" ? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]" : key === "cashIn" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}
						>
							<Icon aria-hidden focusable="false" />
						</span>
						<div className="relative z-10 min-w-0">
							<div className="mb-1 flex items-center justify-between gap-2">
								<p className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
									{t(
										`cashbook.${key === "cashIn" ? "totalCashIn" : key === "cashOut" ? "totalCashOut" : key}`,
									)}
								</p>
							</div>
							{listLoading ? (
								<div className="h-8 w-28 max-w-full animate-pulse rounded bg-[rgb(var(--color-bg-tertiary))]" />
							) : (
								<p className="break-words text-2xl font-semibold leading-8 tabular-nums text-[rgb(var(--color-text-primary))]">
									{listError ? "—" : formatCurrency(value)}
								</p>
							)}
							<p
								className={`mt-1 text-[rgb(var(--color-text-secondary))] text-xs leading-5`}
							>
								{t(
									`cashbook.${key === "closingBalance" ? "availableCash" : key === "cashIn" ? (isToday ? "moneyReceived" : "moneyReceivedForDate") : (isToday ? "moneyPaid" : "moneyPaidForDate")}`,
								)}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,2.2fr)_minmax(320px,1fr)]">
				<section className={`${surface} order-1 p-4 sm:p-6 xl:order-2`}>
					<div className="mb-6 flex items-center gap-3">
						<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgb(var(--color-primary))] text-white [&_svg]:h-4.5 [&_svg]:w-4.5">
							<Plus aria-hidden />
						</span>
						<div>
							<h2 className="text-base font-semibold leading-6">
								{t("cashbook.quickEntry")}
							</h2>
							<p className="mt-1 text-xs leading-5 text-[rgb(var(--color-text-secondary))]">
								{t("cashbook.entryHint")}
							</p>
						</div>
					</div>
					<form
						onSubmit={submit}
						className="space-y-5"
						aria-busy={busy}
						onKeyDown={(event) => {
							if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
								event.preventDefault();
								event.currentTarget.requestSubmit();
							}
						}}
					>
						<Input
							id={`${id}-amount`}
							label={t("cashbook.amount")}
							type="number"
							min="0.01"
							step="0.01"
							placeholder="0"
							value={amount}
							onChange={setAmount}
							disabled={busy || disabled}
							required
							leftIcon={() => <span aria-hidden>₹</span>}
							size="md"
							className={`rounded-lg bg-[rgb(var(--color-bg-secondary))]/40 font-medium tabular-nums`}
						/>
						<fieldset
							className="flex flex-wrap gap-1.5"
							aria-label={t("cashbook.quickAmounts")}
						>
							{[100, 500, 1000, 5000].map((value) => (
								<button
									className="rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-2.5 py-1.5 text-xs font-medium text-[rgb(var(--color-text-secondary))] transition-colors hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/5 hover:text-[rgb(var(--color-primary))] aria-pressed:border-[rgb(var(--color-primary))] aria-pressed:bg-[rgb(var(--color-primary))]/5 aria-pressed:text-[rgb(var(--color-primary))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-primary))] disabled:cursor-not-allowed disabled:opacity-50"
									type="button"
									key={value}
									disabled={busy || disabled}
									onClick={() =>
										setAmount(
											Math.round(((Number(amount) || 0) + value) * 100) / 100,
										)
									}
								>
									+{value.toLocaleString("en-IN")}
								</button>
							))}
						</fieldset>
						<fieldset disabled={busy || disabled}>
							<legend className="mb-2 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
								{t("cashbook.transactionType")}
							</legend>
							<div className="grid grid-cols-2 gap-2">
								{[
									["CASH_IN", ArrowDown],
									["CASH_OUT", ArrowUp],
								].map(([type, Icon]) => (
									<label
										key={type}
										className={`relative flex min-h-17 min-w-0 cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm font-medium leading-5 text-[rgb(var(--color-text-primary))] transition-colors motion-reduce:transition-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60 [&>span]:min-w-0 ${type === "CASH_IN" ? "border-[rgb(var(--color-border-primary))] data-[selected=true]:border-[rgb(var(--color-primary))] data-[selected=true]:bg-[rgb(var(--color-primary))]/5 hover:bg-[rgb(var(--color-primary))]/5 has-[:focus-visible]:outline-[rgb(var(--color-primary))]" : "border-[rgb(var(--color-border-primary))] data-[selected=true]:border-rose-500 data-[selected=true]:bg-rose-500/5 hover:bg-rose-500/5 has-[:focus-visible]:outline-rose-500"}`}
										data-direction={type}
										data-selected={direction === type}
										data-disabled={busy || disabled}
									>
										<input
											type="radio"
											name={`${id}-direction`}
											className="sr-only"
											value={type}
											checked={direction === type}
											onChange={() => changeDirection(type)}
										/>
										<Icon
											className={
												type === "CASH_OUT"
													? "h-7 w-7 shrink-0 rounded-full bg-rose-500/10 p-1.5 text-rose-500"
													: "h-7 w-7 shrink-0 rounded-full bg-[rgb(var(--color-primary))]/10 p-1.5 text-[rgb(var(--color-primary))]"
											}
											aria-hidden
										/>
										<span>
											{t(`cashbook.types.${type}`)}
											<small className="mt-1 block text-xs font-normal leading-5 text-[rgb(var(--color-text-secondary))]">
												{t(
													`cashbook.${type === "CASH_IN" ? "moneyReceivedShort" : "moneyPaidShort"}`,
												)}
											</small>
										</span>
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
								maxLength={140}
								aria-describedby={`${id}-description-count`}
								value={description}
								onChange={(event) => setDescription(event.target.value)}
								disabled={busy || disabled}
								placeholder={t("cashbook.reasonPlaceholder")}
								className={`block min-h-22 leading-relaxed w-full resize-y rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-3 py-2 text-sm text-[rgb(var(--color-text-primary))] focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))]`}
							/>
							<fieldset
								className={`flex flex-wrap gap-1.5 mt-3`}
								aria-label={t("cashbook.predefinedReasons")}
							>
								{reasons.map((reason) => {
									const label = t(`cashbook.reasons.${reason}`);
									return (
										<button
											className="rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-2.5 py-1.5 text-xs font-medium text-[rgb(var(--color-text-secondary))] transition-colors hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/5 hover:text-[rgb(var(--color-primary))] aria-pressed:border-[rgb(var(--color-primary))] aria-pressed:bg-[rgb(var(--color-primary))]/5 aria-pressed:text-[rgb(var(--color-primary))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-primary))] disabled:cursor-not-allowed disabled:opacity-50"
											type="button"
											key={reason}
											disabled={busy || disabled}
											aria-pressed={description === label}
											onClick={() =>
												setDescription(description === label ? "" : label)
											}
										>
											{label}
										</button>
									);
								})}
							</fieldset>
							<p
								id={`${id}-description-count`}
								className="mt-1 text-right text-xs leading-5 text-[rgb(var(--color-text-tertiary))]"
							>
								{description?.length || 0}/140
							</p>
						</div>
						{error && (
							<p role="alert" className="text-sm text-red-600">
								{error}
							</p>
						)}
						<Button
							type="submit"
							leftIcon={Save}
							className="min-h-12 w-full rounded-lg"
							size="sm"
							fullWidth
							loading={busy}
							disabled={busy || disabled || !validAmount}
						>
							{t(
								direction === "CASH_IN"
									? "cashbook.saveCashIn"
									: "cashbook.saveCashOut",
							)}
							<kbd className="ml-2 rounded border border-current px-1 py-0.5 font-[inherit] opacity-70">
								Ctrl ↵
							</kbd>
						</Button>
					</form>
				</section>
				<section
					className={`${surface} order-2 min-w-0 space-y-4 p-4 sm:p-5 xl:order-1`}
					aria-busy={listLoading}
				>
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="relative min-h-10 flex-[1_1_230px] pl-12">
							<span className="absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] [&_svg]:h-4.5 [&_svg]:w-4.5">
								<FileText aria-hidden />
							</span>
							<h2 className="text-base font-semibold leading-6 text-[rgb(var(--color-text-primary))]">
								{t(
									isToday ? "cashbook.todayEntries" : "cashbook.entriesForDate",
								)}
							</h2>
							<p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
								{t(
									isToday
										? "cashbook.recentEntriesHint"
										: "cashbook.selectedEntriesHint",
								)}
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_130px_auto_auto] [&>*]:min-w-0 [&>:first-child]:col-span-2 sm:[&>:first-child]:col-span-1 [&>button]:col-start-2 [&>button]:row-start-3 [&>button]:whitespace-nowrap sm:[&>button]:col-auto sm:[&>button]:row-auto">
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
						{onDateChange && (
							<DateRangeFilter
								t={t}
								startDate={startDate}
								endDate={endDate}
								onChange={onDateChange}
								disabled={busy}
								className="col-start-1 row-start-3 flex-nowrap sm:col-auto sm:row-auto [&>div]:w-full [&>div]:min-w-0"
							/>
						)}

						{onRefresh && (
							<Button
								variant="outline"
								leftIcon={RefreshCw}
								disabled={listLoading || refreshing || busy}
								aria-busy={listLoading || refreshing}
								onClick={onRefresh}
							>
								{t("cashbook.refresh")}
							</Button>
						)}
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
						<div aria-live="polite">
							<div
								className={`hidden grid-cols-[1fr_1.2fr_2fr_1fr] gap-3 rounded-lg bg-[rgb(var(--color-primary))]/5 px-4 py-3 [&>span:last-child]:text-right sm:grid text-xs font-semibold leading-5`}
								aria-hidden
							>
								<span>{t("cashbook.time")}</span>
								<span>{t("cashbook.transactionType")}</span>
								<span>{t("cashbook.descriptionLabel")}</span>
								<span>{t("cashbook.amount")}</span>
							</div>
							<div className="flex min-h-80 flex-col items-center justify-center px-4 py-6 text-center [&>p]:mb-4 [&>p]:mt-1 [&>p]:max-w-sm [&>p]:text-[rgb(var(--color-text-secondary))] [&>button]:max-w-full">
								<span className="relative mb-3 grid h-12 w-12 place-items-center rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] [&>svg]:h-6 [&>svg]:w-6 [&>span]:hidden">
									<FileText aria-hidden />
									<span>
										<Plus size={16} aria-hidden />
									</span>
								</span>
								<h3 className="text-base font-semibold leading-6">
									{emptyMessage}
								</h3>
								<p className="text-xs leading-5">
									{t(
										entries.length
											? "cashbook.adjustSearch"
											: "cashbook.emptyHint",
									)}
								</p>
								{entries.length ? (
									<Button
										variant="outline"
										onClick={() => {
											setQuery("");
											setFilter("ALL");
										}}
									>
										{t("cashbook.clearFilters")}
									</Button>
								) : (
									<Button
										leftIcon={Plus}
										disabled={disabled || busy}
										onClick={() =>
											document.getElementById(`${id}-amount`)?.focus()
										}
									>
										{t("cashbook.addFirstEntry")}
									</Button>
								)}
							</div>
						</div>
					) : (
						<>
							<div className="hidden md:block">
								<DataTable
									rows={visibleEntries}
									columns={columns}
									getRowKey={(entry) => entry.id ?? entry._id ?? entry.localId}
									caption={t(
										isToday
											? "cashbook.todayEntries"
											: "cashbook.entriesForDate",
									)}
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
