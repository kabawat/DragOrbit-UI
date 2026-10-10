"use client";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MultiSelect = ({
	options = [],
	value = [],
	onChange,
	placeholder = "Select options",
	label,
	error = false,
	errorMessage,
	helperText,
	disabled = false,
	required = false,
	searchable = true,
	clearable = true,
	maxSelections,
	className = "",
	name,
	id,
	size = "sm",
	...props
}) => {
	const sizeClasses = {
		sm: "py-1.5 px-2.5 min-h-10 text-xs",
		md: "py-2.5 px-3 min-h-12 text-sm",
		lg: "py-3 px-4 min-h-14 text-base",
	};
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const selectRef = useRef(null);
	const searchRef = useRef(null);

	// Filter options based on search term
	const filteredOptions = searchable
		? options.filter((option) =>
				(option.label || "")
					.toLowerCase()
					.includes((searchTerm || "").toLowerCase()),
			)
		: options;

	// Get selected options
	const selectedOptions = options.filter((option) =>
		value.includes(option.value),
	);

	// Handle option selection
	const handleSelect = (option) => {
		const isSelected = value.includes(option.value);
		let newValue;

		if (isSelected) {
			// Remove option
			newValue = value.filter((v) => v !== option.value);
		} else {
			// Add option (check max selections)
			if (maxSelections && value.length >= maxSelections) {
				return;
			}
			newValue = [...value, option.value];
		}

		onChange?.(newValue);
	};

	// Handle keyboard navigation
	const handleKeyDown = (e) => {
		if (searchable && isOpen) {
			searchRef.current?.focus();
		}

		if (!isOpen) {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				setIsOpen(true);
			}
			return;
		}

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setHighlightedIndex((prev) =>
					prev < filteredOptions.length - 1 ? prev + 1 : 0,
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setHighlightedIndex((prev) =>
					prev > 0 ? prev - 1 : filteredOptions.length - 1,
				);
				break;
			case "Enter":
				e.preventDefault();
				if (highlightedIndex >= 0) {
					handleSelect(filteredOptions[highlightedIndex]);
				}
				break;
			case "Escape":
				setIsOpen(false);
				setSearchTerm("");
				setHighlightedIndex(-1);
				break;
		}
	};

	// Handle clear all
	const handleClearAll = (e) => {
		e.stopPropagation();
		onChange?.([]);
	};

	// Handle remove single option
	const handleRemoveOption = (optionValue, e) => {
		e.stopPropagation();
		const newValue = value.filter((v) => v !== optionValue);
		onChange?.(newValue);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			const isClickInsideSelect = selectRef.current?.contains(event.target);
			const isClickInsideDropdown = event.target.closest(
				".select-dropdown-portal",
			);

			if (!isClickInsideSelect && !isClickInsideDropdown) {
				setIsOpen(false);
				setSearchTerm("");
				setHighlightedIndex(-1);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}
	}, [isOpen]);

	// Reset highlighted index when options change
	useEffect(() => {
		setHighlightedIndex(-1);
	}, [filteredOptions]);

	// Calculate dropdown position for portal
	const getDropdownPosition = () => {
		if (!isOpen || !selectRef.current) return null;

		const rect = selectRef.current.getBoundingClientRect();
		return {
			top: rect.bottom + window.scrollY,
			left: rect.left + window.scrollX,
			width: rect.width,
		};
	};

	const dropdownPosition = getDropdownPosition();

	return (
		<div className={`relative ${className}`}>
			{/* Label - matches Input/Select */}
			{label && (
				<label className="block text-sm text-[rgb(var(--color-text-primary))] mb-2">
					<span className="flex items-center gap-2">
						<span>{label}</span>
						{required && <span className="text-red-500">*</span>}
					</span>
				</label>
			)}

			{/* Select Container - matches Input/Select height and styling */}
			<div
				ref={selectRef}
				className={`
          relative cursor-pointer border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent
          ${
						error
							? "border-red-500 focus:ring-red-500"
							: isOpen
								? "border-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
								: "border-[rgb(var(--color-border-primary))] focus:ring-[rgb(var(--color-primary))]"
					} 
          ${disabled ? "bg-[rgb(var(--color-bg-tertiary))] cursor-not-allowed opacity-50" : "bg-[rgb(var(--color-bg-primary))]"}
        `}
				onClick={() => !disabled && setIsOpen(!isOpen)}
				onKeyDown={handleKeyDown}
				tabIndex={disabled ? -1 : 0}
				role="combobox"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				{/* Selected Values Display */}
				<div
					className={`flex items-center justify-between gap-2 ${sizeClasses[size]}`}
				>
					<div className="flex-1 min-w-0">
						{selectedOptions.length > 0 ? (
							<div className="flex flex-wrap gap-1">
								{selectedOptions.map((option) => (
									<span
										key={option.value}
										className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))]/30"
									>
										{option.label}
										{!disabled && (
											<button
												type="button"
												onClick={(e) => handleRemoveOption(option.value, e)}
												className="ml-1 hover:text-red-500 transition-colors duration-200"
											>
												<X className="w-3 h-3" />
											</button>
										)}
									</span>
								))}
								{maxSelections && value.length >= maxSelections && (
									<span className="text-xs text-[rgb(var(--color-text-secondary))]">
										({value.length}/{maxSelections} selected)
									</span>
								)}
							</div>
						) : (
							<span
								className={`text-[rgb(var(--color-text-tertiary))] ${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"}`}
							>
								{placeholder}
							</span>
						)}
					</div>

					<div className="flex items-center space-x-2 ml-2">
						{/* Clear All Button */}
						{clearable && value.length > 0 && (
							<button
								type="button"
								onClick={handleClearAll}
								className="p-0.5 rounded text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors duration-200"
								tabIndex={-1}
							>
								<X
									className={
										size === "sm"
											? "w-3.5 h-3.5"
											: size === "lg"
												? "w-5 h-5"
												: "w-4 h-4"
									}
								/>
							</button>
						)}

						{/* Dropdown Arrow */}
						<ChevronDown
							className={`${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} text-[rgb(var(--color-text-tertiary))] transition-transform duration-200 flex-shrink-0 ${
								isOpen ? "rotate-180" : ""
							}`}
						/>
					</div>
				</div>

				{/* Dropdown Options - Portal */}
				{isOpen &&
					dropdownPosition &&
					createPortal(
						<div
							style={{
								top: dropdownPosition.top,
								left: dropdownPosition.left,
								width: dropdownPosition.width,
							}}
							className="select-dropdown-portal fixed z-[999999] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-xl shadow-lg overflow-hidden flex flex-col"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Search Input */}
							{searchable && (
								<div
									className="p-2 border-b border-[rgb(var(--color-border-primary))]"
									onClick={(e) => e.stopPropagation()}
								>
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-tertiary))]" />
										<input
											ref={searchRef}
											type="text"
											placeholder="Search options..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											onClick={(e) => e.stopPropagation()}
											onKeyDown={(e) => {
												e.stopPropagation();
												if (e.key === "Escape") {
													setIsOpen(false);
													setSearchTerm("");
													setHighlightedIndex(-1);
												}
											}}
											className="w-full pl-9 pr-2.5 py-1.5 text-xs border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]"
										/>
									</div>
								</div>
							)}

							{/* Options List */}
							<div className="max-h-48 overflow-y-auto">
								{filteredOptions.length > 0 ? (
									filteredOptions.map((option, index) => {
										const isSelected = value.includes(option.value);
										const isHighlighted = index === highlightedIndex;
										const isDisabled =
											maxSelections &&
											value.length >= maxSelections &&
											!isSelected;

										return (
											<div
												key={option.value}
												className={`
                        relative px-3 py-2 cursor-pointer transition-colors duration-150 text-xs
                        ${isHighlighted ? "bg-[rgb(var(--color-primary))]/10" : ""}
                        ${isSelected ? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]" : "hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]"}
                        ${isDisabled ? "opacity-50 cursor-not-allowed text-[rgb(var(--color-text-tertiary))]" : ""}
                      `}
												onClick={() => !isDisabled && handleSelect(option)}
												onMouseEnter={() =>
													!isDisabled && setHighlightedIndex(index)
												}
											>
												<span className="block truncate pr-6">
													{option.label}
												</span>
												{isSelected && (
													<Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-primary))] pointer-events-none" />
												)}
											</div>
										);
									})
								) : (
									<div className="px-4 py-3 text-xs text-[rgb(var(--color-text-secondary))] text-center">
										No options found
									</div>
								)}
							</div>
						</div>,
						document.body,
					)}
			</div>

			{/* Helper Text / Error Message */}
			{(helperText || errorMessage) && (
				<div className="mt-2">
					{error && errorMessage && (
						<p className="text-sm text-red-600 animate-fade-in">
							{errorMessage}
						</p>
					)}
					{!error && helperText && (
						<p className="text-sm text-[rgb(var(--color-text-secondary))]">
							{helperText}
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default MultiSelect;
