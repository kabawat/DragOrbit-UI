"use client";

import { Calendar, ChevronDown } from "lucide-react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import CustomDateRangePanel from "./CustomDateRangePanel";
import { defaultTranslate } from "./defaults";
import {
	DATE_RANGE_PRESETS,
	DATE_RANGE_PRESET_ORDER,
	formatDisplayDate,
	getDateRangeDropdownPosition,
	getPresetDateRange,
	getPresetLabelKey,
	inferPresetFromDates,
} from "./dateRange";

const DateRangeFilter = ({
	t = defaultTranslate,
	locale = "en",
	startDate = "",
	endDate = "",
	onChange,
	className = "",
	disabled = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showCustomPanel, setShowCustomPanel] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState(null);
	const triggerRef = useRef(null);
	const dropdownRef = useRef(null);

	const activePreset = useMemo(
		() => inferPresetFromDates(startDate, endDate),
		[startDate, endDate],
	);

	const updateDropdownPosition = useCallback(() => {
		if (!isOpen || !triggerRef.current) {
			setDropdownPosition(null);
			return;
		}

		const measuredHeight = dropdownRef.current?.offsetHeight ?? null;
		setDropdownPosition(
			getDateRangeDropdownPosition(triggerRef.current, {
				isCustomPanel: showCustomPanel,
				measuredHeight,
			}),
		);
	}, [isOpen, showCustomPanel]);

	useLayoutEffect(() => {
		updateDropdownPosition();
		if (!isOpen) return undefined;

		const rafId = requestAnimationFrame(updateDropdownPosition);
		const handleReposition = () => updateDropdownPosition();

		window.addEventListener("resize", handleReposition);
		window.addEventListener("scroll", handleReposition, true);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener("resize", handleReposition);
			window.removeEventListener("scroll", handleReposition, true);
		};
	}, [isOpen, showCustomPanel, updateDropdownPosition]);

	useEffect(() => {
		if (!isOpen) return undefined;

		const handleClickOutside = (event) => {
			const isInsideTrigger = triggerRef.current?.contains(event.target);
			const isInsideDropdown = event.target.closest(
				".date-range-dropdown-portal",
			);
			if (!isInsideTrigger && !isInsideDropdown) {
				setIsOpen(false);
				setShowCustomPanel(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	const emitChange = (
		nextStartDate,
		nextEndDate,
		preset = inferPresetFromDates(nextStartDate, nextEndDate),
	) => {
		onChange?.({
			startDate: nextStartDate,
			endDate: nextEndDate,
			preset,
		});
	};

	const closeDropdown = () => {
		setIsOpen(false);
		setShowCustomPanel(false);
	};

	const handlePresetSelect = (preset) => {
		if (preset === DATE_RANGE_PRESETS.CUSTOM) {
			setShowCustomPanel(true);
			return;
		}

		const range = getPresetDateRange(preset);
		if (range) {
			emitChange(range.startDate, range.endDate, preset);
		}
		closeDropdown();
	};

	const handleTriggerClick = () => {
		if (disabled) return;
		const nextOpen = !isOpen;
		setIsOpen(nextOpen);
		setShowCustomPanel(nextOpen && activePreset === DATE_RANGE_PRESETS.CUSTOM);
	};

	const triggerLabel = useMemo(() => {
		if (activePreset === DATE_RANGE_PRESETS.CUSTOM && startDate && endDate) {
			return `${formatDisplayDate(startDate, locale)} — ${formatDisplayDate(endDate, locale)}`;
		}
		if (activePreset) {
			return t(getPresetLabelKey(activePreset));
		}
		return t("common.dateRange.placeholder", "Date range");
	}, [activePreset, startDate, endDate, locale, t]);

	return (
		<div className={`flex items-center gap-2 flex-wrap ${className}`}>
			<div className="relative min-w-[160px]" ref={triggerRef}>
				<button
					type="button"
					disabled={disabled}
					onClick={handleTriggerClick}
					className="w-full h-10 px-3 rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-sm text-[rgb(var(--color-text-primary))] flex items-center justify-between gap-2 hover:bg-[rgb(var(--color-bg-secondary))] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
				>
					<span className="flex items-center gap-2 min-w-0">
						<Calendar className="w-4 h-4 shrink-0 text-[rgb(var(--color-text-secondary))]" />
						<span className="truncate">{triggerLabel}</span>
					</span>
					<ChevronDown
						className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
					/>
				</button>

				{isOpen &&
					dropdownPosition &&
					typeof document !== "undefined" &&
					createPortal(
						<div
							ref={dropdownRef}
							style={{
								top: dropdownPosition.top,
								left: dropdownPosition.left,
								width: dropdownPosition.width,
								maxWidth: `calc(100vw - 24px)`,
							}}
							className="date-range-dropdown-portal fixed z-[999999] bg-[rgb(var(--color-bg-primary))] rounded-xl shadow-xl border border-[rgb(var(--color-border-primary))] overflow-hidden"
							onMouseDown={(e) => e.stopPropagation()}
						>
							{showCustomPanel ? (
								<CustomDateRangePanel
									t={t}
									locale={locale}
									startDate={startDate}
									endDate={endDate}
									onApply={({ startDate: nextStart, endDate: nextEnd }) => {
										emitChange(nextStart, nextEnd, DATE_RANGE_PRESETS.CUSTOM);
										closeDropdown();
									}}
									onCancel={closeDropdown}
									onClear={() => emitChange("", "", "")}
									onPresetSelect={({
										startDate: nextStart,
										endDate: nextEnd,
										preset,
									}) => {
										emitChange(nextStart, nextEnd, preset);
										closeDropdown();
									}}
								/>
							) : (
								<div className="py-1.5">
									{DATE_RANGE_PRESET_ORDER.map((preset) => (
										<button
											key={preset}
											type="button"
											onClick={() => handlePresetSelect(preset)}
											className={`w-[calc(100%-8px)] mx-1 px-3 py-2.5 rounded-lg text-left text-sm transition-colors hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer ${
												activePreset === preset
													? "text-[rgb(var(--color-primary))] font-semibold bg-[rgb(var(--color-primary))]/8"
													: "text-[rgb(var(--color-text-primary))]"
											}`}
										>
											{t(getPresetLabelKey(preset))}
										</button>
									))}
								</div>
							)}
						</div>,
						document.body,
					)}
			</div>
		</div>
	);
};

export default DateRangeFilter;
