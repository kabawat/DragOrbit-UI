"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { defaultTranslate } from "./defaults";
import {
	DATE_RANGE_PRESETS,
	DATE_RANGE_PRESET_ORDER,
	compareISODates,
	formatDateISO,
	formatDisplayDate,
	getCalendarGrid,
	getMonthOptions,
	getMonthYearFromISO,
	getDefaultCalendarViews,
	addMonths,
	getPresetDateRange,
	getPresetLabelKey,
	getYearOptions,
	isDateInRange,
	startOfDay,
} from "./dateRange";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const SelectField = ({ value, onChange, options, className = "" }) => (
	<div className={`relative ${className}`}>
		<select
			value={value}
			onChange={onChange}
			className="w-full h-10 appearance-none pl-3 pr-9 rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-sm text-[rgb(var(--color-text-primary))] cursor-pointer hover:border-[rgb(var(--color-primary))]/40 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20 focus:border-[rgb(var(--color-primary))]"
		>
			{options.map((option) => (
				<option key={option.value ?? option} value={option.value ?? option}>
					{option.label ?? option}
				</option>
			))}
		</select>
		<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-tertiary))] pointer-events-none" />
	</div>
);

const MonthCalendar = ({
	label,
	year,
	month,
	draftStart,
	draftEnd,
	onMonthChange,
	onYearChange,
	onDaySelect,
	monthOptions,
	yearOptions,
}) => {
	const todayIso = formatDateISO(startOfDay());
	const cells = useMemo(() => getCalendarGrid(year, month), [year, month]);
	const isSelectingEnd = Boolean(draftStart && !draftEnd);

	const isDayDisabled = (iso) =>
		isSelectingEnd && compareISODates(iso, draftStart) <= 0;

	const getDayClassName = (iso) => {
		if (isDayDisabled(iso)) {
			return "text-[rgb(var(--color-text-tertiary))]/35 cursor-not-allowed";
		}

		const isStart = iso === draftStart;
		const isEnd = iso === draftEnd;
		const inRange =
			draftStart && draftEnd && isDateInRange(iso, draftStart, draftEnd);
		const isToday = iso === todayIso;

		if (isStart || isEnd) {
			return "bg-[rgb(var(--color-primary))] text-white font-semibold";
		}
		if (inRange) {
			return "bg-[rgb(var(--color-primary))]/12 text-[rgb(var(--color-text-primary))]";
		}
		if (isToday) {
			return "text-[rgb(var(--color-primary))] font-semibold ring-1 ring-[rgb(var(--color-primary))]/30";
		}
		return "text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))]";
	};

	return (
		<div className="flex-1 min-w-[252px]">
			<p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))] mb-3">
				{label}
			</p>

			<div className="flex items-center gap-2 mb-4">
				<SelectField
					value={month}
					onChange={(event) => onMonthChange(Number(event.target.value))}
					options={monthOptions}
					className="flex-1"
				/>
				<SelectField
					value={year}
					onChange={(event) => onYearChange(Number(event.target.value))}
					options={yearOptions.map((optionYear) => ({
						value: optionYear,
						label: optionYear,
					}))}
					className="w-[96px]"
				/>
			</div>

			<div className="grid grid-cols-7 gap-x-1.5 gap-y-1 mb-2">
				{WEEKDAY_LABELS.map((weekday, index) => (
					<div
						key={`${weekday}-${index}`}
						className="h-8 flex items-center justify-center text-[0.6875rem] font-semibold uppercase text-[rgb(var(--color-text-tertiary))]"
					>
						{weekday}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-x-1.5 gap-y-2">
				{cells.map((iso, index) => (
					<div
						key={`${iso || "empty"}-${index}`}
						className="h-9 flex items-center justify-center"
					>
						{iso ? (
							<button
								type="button"
								disabled={isDayDisabled(iso)}
								onClick={() => onDaySelect(iso)}
								className={`h-8 w-full max-w-[36px] rounded-md text-sm transition-colors ${getDayClassName(iso)} ${
									isDayDisabled(iso) ? "" : "cursor-pointer"
								}`}
							>
								{Number(iso.split("-")[2])}
							</button>
						) : null}
					</div>
				))}
			</div>
		</div>
	);
};

const CustomDateRangePanel = ({
	t = defaultTranslate,
	locale = "en",
	startDate = "",
	endDate = "",
	onApply,
	onCancel,
	onClear,
	onPresetSelect,
}) => {
	const [draftStart, setDraftStart] = useState(startDate);
	const [draftEnd, setDraftEnd] = useState(endDate);

	const { from: initialFrom, to: initialTo } = getDefaultCalendarViews(
		startDate,
		endDate,
	);

	const [fromYear, setFromYear] = useState(initialFrom.year);
	const [fromMonth, setFromMonth] = useState(initialFrom.month);
	const [toYear, setToYear] = useState(initialTo.year);
	const [toMonth, setToMonth] = useState(initialTo.month);

	const monthOptions = useMemo(() => getMonthOptions(locale), [locale]);
	const yearOptions = useMemo(() => getYearOptions(15), []);

	const hasCompleteRange = Boolean(
		draftStart && draftEnd && compareISODates(draftEnd, draftStart) > 0,
	);
	const rangeLabel = hasCompleteRange
		? `${formatDisplayDate(draftStart, locale)} — ${formatDisplayDate(draftEnd, locale)}`
		: draftStart
			? `${formatDisplayDate(draftStart, locale)} — ${t("common.dateRange.to", "To")}`
			: t("common.dateRange.selectRange", "Select date range");

	const handleDaySelect = (iso) => {
		if (!draftStart || (draftStart && draftEnd)) {
			setDraftStart(iso);
			setDraftEnd("");

			const startView = getMonthYearFromISO(iso);
			if (toYear === startView.year && toMonth === startView.month) {
				const nextView = addMonths(startView.year, startView.month, 1);
				setToYear(nextView.year);
				setToMonth(nextView.month);
			}
			return;
		}

		if (compareISODates(iso, draftStart) < 0) {
			setDraftStart(iso);
			setDraftEnd("");

			const startView = getMonthYearFromISO(iso);
			if (toYear === startView.year && toMonth === startView.month) {
				const nextView = addMonths(startView.year, startView.month, 1);
				setToYear(nextView.year);
				setToMonth(nextView.month);
			}
			return;
		}

		if (compareISODates(iso, draftStart) <= 0) {
			return;
		}

		setDraftEnd(iso);
	};

	const handleApply = () => {
		if (!draftStart || !draftEnd || compareISODates(draftEnd, draftStart) <= 0)
			return;
		onApply?.({ startDate: draftStart, endDate: draftEnd });
	};

	const handleClear = () => {
		setDraftStart("");
		setDraftEnd("");
		const { from, to } = getDefaultCalendarViews();
		setFromYear(from.year);
		setFromMonth(from.month);
		setToYear(to.year);
		setToMonth(to.month);
		onClear?.();
	};

	return (
		<div className="flex w-full min-w-0 max-w-full">
			<aside className="w-48 shrink-0 border-r border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]/35 py-3">
				{DATE_RANGE_PRESET_ORDER.map((preset) => {
					const isCustom = preset === DATE_RANGE_PRESETS.CUSTOM;
					return (
						<button
							key={preset}
							type="button"
							onClick={() => {
								if (isCustom) return;
								const range = getPresetDateRange(preset);
								if (range) onPresetSelect?.(range);
							}}
							className={`w-[calc(100%-12px)] mx-1.5 mb-0.5 px-3 py-2.5 rounded-lg text-left text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
								isCustom
									? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] font-semibold"
									: "text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-primary))]"
							}`}
						>
							<span className="truncate">{t(getPresetLabelKey(preset))}</span>
							{isCustom && <ChevronRight className="w-4 h-4 shrink-0" />}
						</button>
					);
				})}
			</aside>

			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[rgb(var(--color-border-primary))]">
					<div
						className={`min-w-0 flex-1 text-sm ${
							hasCompleteRange
								? "font-medium text-[rgb(var(--color-text-primary))]"
								: "text-[rgb(var(--color-text-tertiary))]"
						}`}
					>
						<span className="truncate block">{rangeLabel}</span>
					</div>

					<div className="flex items-center gap-4 shrink-0">
						<button
							type="button"
							onClick={handleClear}
							className="text-sm font-medium text-[rgb(var(--color-primary))] hover:opacity-80 cursor-pointer"
						>
							{t("common.clearFilters")}
						</button>
						<button
							type="button"
							onClick={onCancel}
							className="text-sm font-medium text-[rgb(var(--color-primary))] hover:opacity-80 cursor-pointer"
						>
							{t("common.dateRange.cancel", "Cancel")}
						</button>
						<button
							type="button"
							onClick={handleApply}
							disabled={!hasCompleteRange}
							className={`h-9 px-5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
								hasCompleteRange
									? "bg-[rgb(var(--color-primary))] text-white hover:opacity-90"
									: "bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))]/60 cursor-not-allowed"
							}`}
						>
							{t("common.dateRange.apply", "Apply")}
						</button>
					</div>
				</div>

				<div className="flex gap-0 px-5 py-5">
					<MonthCalendar
						label={t("common.dateRange.from", "From")}
						year={fromYear}
						month={fromMonth}
						draftStart={draftStart}
						draftEnd={draftEnd}
						onMonthChange={setFromMonth}
						onYearChange={setFromYear}
						onDaySelect={handleDaySelect}
						monthOptions={monthOptions}
						yearOptions={yearOptions}
					/>
					<div className="w-px bg-[rgb(var(--color-border-primary))] mx-5 shrink-0" />
					<MonthCalendar
						label={t("common.dateRange.to", "To")}
						year={toYear}
						month={toMonth}
						draftStart={draftStart}
						draftEnd={draftEnd}
						onMonthChange={setToMonth}
						onYearChange={setToYear}
						onDaySelect={handleDaySelect}
						monthOptions={monthOptions}
						yearOptions={yearOptions}
					/>
				</div>
			</div>
		</div>
	);
};

export default CustomDateRangePanel;
