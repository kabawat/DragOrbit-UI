"use client";
import { Button, Input, Modal, Select, Textarea } from "@dragorbit/ui";
import { DataTable } from "@dragorbit/ui/table";
import {
	ArrowDown,
	ArrowUp,
	FileText,
	Plus,
	RefreshCw,
	Save,
	Search,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import CashbookDayHistory from "../component/CashbookDayHistory";

function formatCurrency(value) {
	return `₹${(Number(value) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatTime(value) {
	const date = new Date(value);
	return value && !Number.isNaN(date.getTime())
		? date.toLocaleTimeString("en-IN", {
				hour: "2-digit",
				minute: "2-digit",
				timeZone: "Asia/Kolkata",
			})
		: "—";
}
const surface =
	"rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))]";

const entryCategories = {
	CASH_IN: [
		"SALE",
		"CUSTOMER_PAYMENT",
		"CUSTOMER_ADVANCE",
		"OWNER_DEPOSIT",
		"BANK_WITHDRAWAL",
		"LOAN_RECEIVED",
		"OTHER",
	],
	CASH_OUT: [
		"EXPENSE",
		"SUPPLIER_PAYMENT",
		"SALARY",
		"RENT",
		"UTILITIES",
		"TRANSPORT",
		"OWNER_WITHDRAWAL",
		"BANK_DEPOSIT",
		"REFUND",
		"LOAN_REPAYMENT",
		"OTHER",
	],
};

export function CashbookScreen({
	t,
	entrySettings,
	days = [],
	ledgerVersion,
	onReconcile,
	pendingSync = false,
	canEdit,
	hasMore,
	onLoadMore,
	moreLoading,
	amount,
	setAmount,
	description,
	setDescription,
	entries = [],
	listLoading,
	refreshing = false,
	loading,
	error,
	handleCashIn,
	handleCashOut,
	onRefresh,
	selectedDate = "",
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
	const isToday = selectedDate === today;
	const saving = useRef(false);
	const [entryOpen, setEntryOpen] = useState(false);
	const openEntry = () => {
		setDirection(entrySettings?.defaultEntryType || "CASH_IN");
		setCategory("OTHER");
		setEntryOpen(true);
	};
	const closeEntry = () => {
		if (!saving.current) setEntryOpen(false);
	};
	const [category, setCategory] = useState("OTHER");
	const [direction, setDirection] = useState("CASH_IN");
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState("ALL");
	const [submitting, setSubmitting] = useState(false);
	const busy = loading || submitting;
	useEffect(() => {
		const handleNewEntry = (event) => {
			if (
				!event.altKey ||
				event.key.toLowerCase() !== "n" ||
				event.ctrlKey ||
				event.metaKey ||
				event.shiftKey
			)
				return;
			event.preventDefault();
			event.stopImmediatePropagation();
			// Consume the shortcut even when a dialog is already open.
			if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
			if (event.repeat || disabled || busy || entryOpen) return;
			setDirection(entrySettings?.defaultEntryType || "CASH_IN");
			setCategory("OTHER");
			setEntryOpen(true);
		};
		window.addEventListener("keydown", handleNewEntry, { capture: true });
		return () =>
			window.removeEventListener("keydown", handleNewEntry, { capture: true });
	}, [disabled, busy, entryOpen, entrySettings?.defaultEntryType]);

	const autoDescription = (value, type) =>
		value === "OTHER"
			? ""
			: `${t(`cashbook.categories.${value}`)} — ${t(`cashbook.types.${type}`)}`;
	const changeCategory = (value) => {
		setCategory(value);
		setDescription(autoDescription(value, direction));
	};
	const changeDirection = (next) => {
		setDirection(next);
		setCategory("OTHER");
		setDescription("");
	};

	const validAmount =
		Number.isFinite(Number(amount)) &&
		Number(amount) > 0 &&
		Number(amount) <= (entrySettings?.maxAmount ?? 100000000);
	const validDescription =
		!entrySettings?.requireDescription || Boolean(description?.trim());
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
		const isCashIn = entry.type === "CASH_IN";
		const Icon = isCashIn ? ArrowDown : ArrowUp;
		return (
			<span
				className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-xs font-medium leading-5 ${isCashIn ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"}`}
			>
				<Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
				{typeLabel(entry)}
			</span>
		);
	};
	const columns = [
		{
			id: "description",
			header: t("common.description"),
			minWidth: 200,
			cell: (entry) => (
				<span className="break-words font-medium text-[rgb(var(--color-text-primary))]">
					{entry.description || typeLabel(entry)}
				</span>
			),
		},
		{
			id: "category",
			header: t("cashbook.day.category"),
			minWidth: 140,
			cell: (entry) => t(`cashbook.categories.${entry.category || "OTHER"}`),
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
		{
			id: "balanceAfter",
			header: t("cashbook.day.balanceAfter"),
			minWidth: 140,
			align: "right",
			cell: (entry) => (
				<span className="whitespace-nowrap font-medium tabular-nums text-[rgb(var(--color-text-secondary))]">
					{entry.balanceAfter == null
						? "—"
						: formatCurrency(entry.balanceAfter)}
				</span>
			),
		},
	];
	const submit = async (event) => {
		event.preventDefault();
		if (busy || disabled || !validAmount || !validDescription || saving.current)
			return;
		saving.current = true;
		setSubmitting(true);
		try {
			await (direction === "CASH_IN"
				? handleCashIn({ category })
				: handleCashOut({ category }));
			setEntryOpen(false);
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
	const renderToolbar = (reconcileAction, historyAction) => (
		<div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<div className="flex flex-wrap items-center gap-2">
				<div className="min-w-36 flex-1 sm:flex-none sm:w-40">
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
				{onDateChange && (
					<div className="w-full sm:w-44">
						<Input
							type="date"
							aria-label={t("cashbook.day.date")}
							value={selectedDate}
							max={today}
							onChange={(value) => {
								if (value) onDateChange(value);
							}}
							disabled={busy}
						/>
					</div>
				)}
			</div>
			<div className="flex flex-wrap items-center justify-end gap-2">
				{historyAction}
				{reconcileAction}

				<Button
					leftIcon={Plus}
					disabled={disabled || busy}
					onClick={openEntry}
					aria-keyshortcuts="Alt+n"
					title={`Alt + N`}
					className="min-h-10 shrink-0 rounded-lg px-4 shadow-none!"
				>
					{t("cashbook.addEntry")}
				</Button>
			</div>
		</div>
	);
	return (
		<div
			className={`bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] mx-auto w-full space-y-5 p-4 text-sm leading-5 sm:p-6 [&_*]:shadow-none!`}
		>
			<div className="flex min-w-0 flex-col gap-5">
				<CashbookDayHistory
					t={t}
					toolbar={renderToolbar}
					days={days}
					ledgerVersion={ledgerVersion}
					onReconcile={onReconcile}
					pendingSync={pendingSync}
					canEdit={canEdit}
					loading={listLoading}
					error={listError}
				/>
				<section
					className={`${surface} min-w-0 w-full space-y-5 p-4 sm:p-5`}
					aria-label={t("cashbook.entriesForDate")}
					aria-busy={listLoading}
				>
					<div className="flex flex-col gap-4 border-b border-[rgb(var(--color-border-primary))] pb-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-2.5">
							<h2 className="text-base font-semibold">
								{t(
									isToday ? "cashbook.todayEntries" : "cashbook.entriesForDate",
								)}
							</h2>
							<span className="rounded-full bg-[rgb(var(--color-bg-secondary))] px-3 py-1 text-xs font-medium tabular-nums text-[rgb(var(--color-text-secondary))]">
								{visibleEntries.length}
							</span>
						</div>
						<div className="flex w-full items-center gap-2 sm:w-auto [&>*]:min-w-0">
							<div className="min-w-0 flex-1 sm:w-72 lg:w-80">
								<Input
									value={query}
									onChange={setQuery}
									placeholder={t("cashbook.searchEntries")}
									aria-label={t("cashbook.searchEntries")}
									leftIcon={Search}
								/>
							</div>

							{onRefresh && (
								<Button
									variant="outline"
									className="min-h-10 rounded-lg border!"
									leftIcon={RefreshCw}
									disabled={listLoading || refreshing || busy}
									aria-busy={listLoading || refreshing}
									onClick={onRefresh}
								>
									{t("cashbook.refresh")}
								</Button>
							)}
						</div>
					</div>
					{(query.trim() || filter !== "ALL") && (
						<div
							className="flex flex-wrap items-center justify-between gap-2 text-xs text-[rgb(var(--color-text-secondary))]"
							aria-live="polite"
						>
							<span>
								{visibleEntries.length} / {entries.length}{" "}
								{t("cashbook.entriesForDate")}
							</span>
							<Button
								variant="ghost"
								onClick={() => {
									setQuery("");
									setFilter("ALL");
								}}
								className="text-xs"
							>
								{t("cashbook.clearFilters")}
							</Button>
						</div>
					)}

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
							<div className="flex min-h-64 sm:min-h-72 flex-col items-center justify-center px-4 py-6 text-center [&>p]:mb-4 [&>p]:mt-1 [&>p]:max-w-sm [&>p]:text-[rgb(var(--color-text-secondary))] [&>button]:max-w-full">
								<span className="relative mb-3 grid h-12 w-12 place-items-center rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] [&>svg]:h-6 [&>svg]:w-6 [&>span]:hidden">
									<FileText aria-hidden />
									<span>
										<Plus size={16} aria-hidden />
									</span>
								</span>
								<h3 className="text-base font-semibold leading-6">
									{emptyMessage}
								</h3>
								<p className="text-sm leading-6">
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
										onClick={openEntry}
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
									density="comfortable"
									className="[&_thead]:text-[rgb(var(--color-text-secondary))] md:[&_th>span>button:not([aria-pressed=true])]:opacity-0 md:[&_th:hover>span>button]:opacity-100 md:[&_th:focus-within>span>button]:opacity-100"
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
					{hasMore && (
						<Button
							variant="outline"
							onClick={onLoadMore}
							disabled={moreLoading || listLoading}
							loading={moreLoading}
						>
							{t("cashbook.day.loadMore")}
						</Button>
					)}
				</section>
			</div>
			<Modal
				isOpen={entryOpen}
				onClose={closeEntry}
				title={t("cashbook.quickEntry")}
				closeLabel={t("cashbook.closeEntry")}
				size="lg"
				closeOnOverlayClick={!busy}
				closeOnEscape={!busy}
				className="border border-[rgb(var(--color-border-primary))] shadow-none! [&_*]:shadow-none!"
				bodyClassName="p-4 sm:p-6 text-sm leading-5"
				overlayClassName="items-end! p-0! sm:items-center! sm:p-4!"
			>
				<p className="mb-5 text-xs leading-5 text-[rgb(var(--color-text-secondary))]">
					{t("cashbook.entryHint")}
				</p>

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
						max={entrySettings?.maxAmount ?? 100000000}
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
							<Button
								variant="outline"
								size="xs"
								className="rounded-lg border! aria-pressed:border-[rgb(var(--color-primary))]! aria-pressed:bg-[rgb(var(--color-primary))]/5 aria-pressed:text-[rgb(var(--color-primary))]"
								type="button"
								key={value}
								disabled={
									busy ||
									disabled ||
									(Number(amount) || 0) + value >
										(entrySettings?.maxAmount ?? 100000000)
								}
								onClick={() =>
									setAmount(
										Math.round(((Number(amount) || 0) + value) * 100) / 100,
									)
								}
							>
								+{value.toLocaleString("en-IN")}
							</Button>
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
					<Select
						label={t("cashbook.day.category")}
						value={category}
						onChange={changeCategory}
						disabled={busy || disabled}
						searchable={false}
						options={entryCategories[direction].map((value) => ({
							value,
							label: t(`cashbook.categories.${value}`),
						}))}
					/>
					<div>
						<label
							htmlFor={`${id}-description`}
							className="mb-2 block text-sm font-medium text-[rgb(var(--color-text-secondary))]"
						>
							{t(
								entrySettings?.requireDescription
									? "cashbook.requiredDescription"
									: "cashbook.descriptionLabel",
							)}
						</label>
						<Textarea
							id={`${id}-description`}
							rows={3}
							required={entrySettings?.requireDescription}
							maxLength={140}
							aria-describedby={`${id}-description-count`}
							value={description}
							onChange={setDescription}
							disabled={busy || disabled}
							placeholder={t("cashbook.reasonPlaceholder")}
							className={`block min-h-22 leading-relaxed w-full resize-y rounded-lg bg-[rgb(var(--color-bg-primary))]! border! border-[rgb(var(--color-border-primary))]! px-3 py-2 text-sm text-[rgb(var(--color-text-primary))] focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))]`}
						/>
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
						aria-keyshortcuts="Control+Enter Meta+Enter"
						title="Ctrl + Enter"
						leftIcon={Save}
						className="min-h-12 w-full rounded-lg"
						size="sm"
						fullWidth
						loading={busy}
						disabled={busy || disabled || !validAmount || !validDescription}
					>
						{t(
							direction === "CASH_IN"
								? "cashbook.saveCashIn"
								: "cashbook.saveCashOut",
						)}
					</Button>
				</form>
			</Modal>
		</div>
	);
}
export default CashbookScreen;
