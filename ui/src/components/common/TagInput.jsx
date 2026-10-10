"use client";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";

const TagInput = ({
	value = [],
	onChange,
	placeholder = "Add tags...",
	label,
	error = false,
	errorMessage,
	helperText,
	disabled = false,
	required = false,
	maxTags = 10,
	maxTagLength = 20,
	allowDuplicates = false,
	countLabel,
	className = "",
	name,
	id,
	...props
}) => {
	const [inputValue, setInputValue] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef(null);

	// Handle input change
	const handleInputChange = (e) => {
		const newValue = e.target.value;

		// Prevent adding if max tags reached
		if (maxTags && value.length >= maxTags) {
			return;
		}

		// Limit tag length
		if (maxTagLength && newValue.length > maxTagLength) {
			return;
		}

		setInputValue(newValue);
	};

	// Handle key down events
	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag();
		} else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
			// Remove last tag if input is empty and backspace is pressed
			removeTag(value.length - 1);
		}
	};

	// Add tag
	const addTag = () => {
		const trimmedValue = inputValue.trim();

		if (!trimmedValue) return;

		// Check for duplicates
		if (!allowDuplicates && value.includes(trimmedValue)) {
			setInputValue("");
			return;
		}

		// Check max tags
		if (maxTags && value.length >= maxTags) {
			return;
		}

		const newTags = [...value, trimmedValue];
		onChange?.(newTags);
		setInputValue("");
	};

	// Remove tag
	const removeTag = (index) => {
		const newTags = value.filter((_, i) => i !== index);
		onChange?.(newTags);
	};

	// Handle blur
	const handleBlur = () => {
		setIsFocused(false);
		if (inputValue.trim()) {
			addTag();
		}
	};

	// Handle focus
	const handleFocus = () => {
		setIsFocused(true);
	};

	// Clear all tags
	const clearAllTags = () => {
		onChange?.([]);
	};

	return (
		<div className={`w-full ${className}`}>
			{/* Label */}
			{label && (
				<label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			{/* Tag Input Container */}
			<div
				className={`
          relative border border-[rgb(var(--color-border-primary))] rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-[rgb(var(--color-primary))] focus-within:border-[rgb(var(--color-primary))]
          ${
						error
							? "border-red-500 focus-within:ring-red-500"
							: isFocused
								? "border-[rgb(var(--color-primary))] focus-within:ring-[rgb(var(--color-primary))]"
								: "border-[rgb(var(--color-border-primary))] focus-within:ring-[rgb(var(--color-primary))]"
					}
          ${disabled ? "bg-[rgb(var(--color-bg-tertiary))] cursor-not-allowed" : "bg-[rgb(var(--color-bg-primary))]"}
        `}
				onClick={() => !disabled && inputRef.current?.focus()}
			>
				<div className="flex flex-wrap items-center gap-2 p-3 min-h-[48px]">
					{/* Existing Tags */}
					{value.map((tag, index) => (
						<span
							key={index}
							className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[rgb(var(--color-primary))] text-white border border-[rgb(var(--color-primary))]"
						>
							{tag}
							{!disabled && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										removeTag(index);
									}}
									className="ml-2 hover:text-red-300 transition-colors duration-200 text-white"
								>
									<X className="w-3 h-3" />
								</button>
							)}
						</span>
					))}

					{/* Input Field */}
					<div className="flex-1 min-w-[120px]">
						<input
							ref={inputRef}
							type="text"
							value={inputValue}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							onFocus={handleFocus}
							onBlur={handleBlur}
							placeholder={value.length === 0 ? placeholder : ""}
							disabled={disabled || (maxTags && value.length >= maxTags)}
							className="w-full border-none outline-none bg-transparent text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-tertiary))]"
							maxLength={maxTagLength}
							{...props}
							style={{ border: "none" }}
						/>
					</div>

					{/* Add Button (when input has value) */}
					{inputValue.trim() && !disabled && (
						<button
							type="button"
							onClick={addTag}
							className="p-1 text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:bg-opacity-10 rounded transition-colors duration-200"
						>
							<Plus className="w-4 h-4" />
						</button>
					)}
				</div>

				{/* Clear All Button */}
				{value.length > 0 && !disabled && (
					<button
						type="button"
						onClick={clearAllTags}
						className="absolute top-2 right-2 p-1 text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-primary))] transition-colors duration-200"
					>
						<X className="w-4 h-4" />
					</button>
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

			{/* Tag Count */}
			{maxTags && (
				<div className="mt-1 text-right">
					<span className="text-xs text-[rgb(var(--color-text-secondary))]">
						{countLabel
							? countLabel
									.replace("{count}", value.length)
									.replace("{max}", maxTags)
							: `${value.length}/${maxTags} tags`}
					</span>
				</div>
			)}
		</div>
	);
};

export default TagInput;
