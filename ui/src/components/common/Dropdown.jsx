"use client";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Dropdown = ({
	options = [],
	value,
	onChange,
	placeholder = "Select an option",
	label,
	error = false,
	errorMessage,
	helperText,
	disabled = false,
	required = false,
	multiple = false,
	clearable = false,
	className = "",
	name,
	id,
	trigger,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const dropdownRef = useRef(null);

	// Get selected option(s)
	const selectedOption = multiple
		? options.filter((option) => value?.includes(option.value))
		: options.find((option) => option.value === value);

	// Handle option selection
	const handleSelect = (option) => {
		if (multiple) {
			const newValue = value || [];
			const isSelected = newValue.includes(option.value);
			const updatedValue = isSelected
				? newValue.filter((v) => v !== option.value)
				: [...newValue, option.value];
			onChange?.(updatedValue);
		} else {
			onChange?.(option.value);
			setIsOpen(false);
		}
	};

	// Handle keyboard navigation
	const handleKeyDown = (e) => {
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
					prev < options.length - 1 ? prev + 1 : 0,
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setHighlightedIndex((prev) =>
					prev > 0 ? prev - 1 : options.length - 1,
				);
				break;
			case "Enter":
				e.preventDefault();
				if (highlightedIndex >= 0) {
					handleSelect(options[highlightedIndex]);
				}
				break;
			case "Escape":
				setIsOpen(false);
				setHighlightedIndex(-1);
				break;
		}
	};

	// Handle clear
	const handleClear = (e) => {
		e.stopPropagation();
		onChange?.(multiple ? [] : "");
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
				setHighlightedIndex(-1);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className={`relative ${className}`}>
			{/* Label */}
			{label && (
				<label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			{/* Dropdown Container */}
			<div
				ref={dropdownRef}
				className={`relative cursor-pointer border border-[rgb(var(--color-border-primary))] rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))] ${
					error
						? "border-red-500 focus:ring-red-500"
						: isOpen
							? "border-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
							: "border-[rgb(var(--color-border-primary))] focus:ring-[rgb(var(--color-primary))]"
				} ${disabled ? "bg-[rgb(var(--color-bg-tertiary))] cursor-not-allowed" : "bg-[rgb(var(--color-bg-primary))]"}`}
				onClick={() => !disabled && setIsOpen(!isOpen)}
				onKeyDown={handleKeyDown}
				tabIndex={disabled ? -1 : 0}
				role="combobox"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				{/* Custom Trigger */}
				{trigger ? (
					<div className="flex items-center justify-between px-4 py-3">
						{trigger}
						<ChevronDown
							className={`w-5 h-5 text-[rgb(var(--color-text-tertiary))] transition-transform duration-200 ${
								isOpen ? "rotate-180" : ""
							}`}
						/>
					</div>
				) : (
					/* Default Trigger */
					<div className="flex items-center justify-between px-4 py-3">
						<div className="flex-1 min-w-0">
							{multiple ? (
								<div className="flex flex-wrap gap-1">
									{selectedOption?.length > 0 ? (
										selectedOption.map((option) => (
											<span
												key={option.value}
												className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[rgb(var(--color-primary))] bg-opacity-10 text-[rgb(var(--color-primary))]"
											>
												{option.label}
											</span>
										))
									) : (
										<span className="text-[rgb(var(--color-text-tertiary))]">
											{placeholder}
										</span>
									)}
								</div>
							) : (
								<span
									className={
										selectedOption
											? "text-[rgb(var(--color-text-primary))]"
											: "text-[rgb(var(--color-text-tertiary))]"
									}
								>
									{selectedOption?.label || placeholder}
								</span>
							)}
						</div>

						<div className="flex items-center space-x-2 ml-2">
							{/* Clear Button */}
							{clearable && (multiple ? value?.length > 0 : value) && (
								<button
									type="button"
									onClick={handleClear}
									className="text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-primary))] transition-colors duration-200"
									tabIndex={-1}
								>
									×
								</button>
							)}

							{/* Dropdown Arrow */}
							<ChevronDown
								className={`w-5 h-5 text-[rgb(var(--color-text-tertiary))] transition-transform duration-200 ${
									isOpen ? "rotate-180" : ""
								}`}
							/>
						</div>
					</div>
				)}

				{/* Dropdown Options */}
				{isOpen && (
					<div className="absolute z-50 w-full mt-1 bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg shadow-lg max-h-60 overflow-hidden">
						{/* Options List */}
						<div className="max-h-48 overflow-y-auto">
							{options.length > 0 ? (
								options.map((option, index) => {
									const isSelected = multiple
										? value?.includes(option.value)
										: value === option.value;
									const isHighlighted = index === highlightedIndex;

									return (
										<div
											key={option.value}
											className={`px-4 py-2 cursor-pointer transition-colors duration-150 flex items-center justify-between ${
												isHighlighted
													? "bg-[rgb(var(--color-primary))] bg-opacity-10"
													: "hover:bg-[rgb(var(--color-bg-secondary))]"
											} ${isSelected ? "bg-[rgb(var(--color-primary))] bg-opacity-10" : ""}`}
											onClick={() => handleSelect(option)}
											onMouseEnter={() => setHighlightedIndex(index)}
										>
											<span
												className={
													isSelected
														? "font-medium text-[rgb(var(--color-primary))]"
														: "text-[rgb(var(--color-text-primary))]"
												}
											>
												{option.label}
											</span>
											{isSelected && (
												<Check className="w-4 h-4 text-[rgb(var(--color-primary))]" />
											)}
										</div>
									);
								})
							) : (
								<div className="px-4 py-3 text-sm text-[rgb(var(--color-text-secondary))] text-center">
									No options available
								</div>
							)}
						</div>
					</div>
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

export default Dropdown;
