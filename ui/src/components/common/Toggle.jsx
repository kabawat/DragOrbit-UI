"use client";
import { Grid, List } from "lucide-react";

const Toggle = ({
	options = [],
	value,
	onChange,
	size = "md",
	variant = "default",
	disabled = false,
	className = "",
	// Checkbox-style toggle props
	label,
	checked,
	helperText,
	error,
	errorMessage,
	...props
}) => {
	const sizeClasses = {
		sm: "px-2 py-1 text-xs",
		md: "px-3 py-2 text-sm",
		lg: "px-4 py-3 text-base",
	};

	const variantClasses = {
		default:
			"bg-[rgb(var(--color-bg-primary))] border-[rgb(var(--color-border-primary))]",
		primary:
			"bg-[rgb(var(--color-primary))] border-[rgb(var(--color-primary))]",
		secondary:
			"bg-[rgb(var(--color-bg-secondary))] border-[rgb(var(--color-border-secondary))]",
	};

	const handleOptionClick = (optionValue) => {
		if (!disabled && optionValue !== value) {
			onChange?.(optionValue);
		}
	};

	const handleCheckboxToggle = () => {
		if (!disabled) {
			onChange?.(!checked);
		}
	};

	// Checkbox-style toggle (switch + label/helperText, vertically align-center)
	if (label !== undefined) {
		return (
			<div className={`flex items-center gap-3 ${className}`}>
				<button
					type="button"
					onClick={handleCheckboxToggle}
					disabled={disabled}
					className={`
            relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2
            ${
							checked
								? "bg-[rgb(var(--color-primary))]"
								: "bg-[rgb(var(--color-primary))]/30"
						}
            ${disabled ? "cursor-not-allowed border border-[rgb(var(--color-border-primary))]" : "cursor-pointer"}
          `}
					aria-pressed={checked}
					aria-label={label}
					{...props}
				>
					<span
						className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
              ${checked ? "translate-x-6" : "translate-x-1"}
            `}
					/>
				</button>
				<div className="flex flex-col justify-center min-w-0">
					{label && (
						<label
							className="text-sm font-medium text-[rgb(var(--color-text-primary))] cursor-pointer"
							onClick={handleCheckboxToggle}
						>
							{label}
						</label>
					)}
					{(helperText || errorMessage) && (
						<>
							{error && errorMessage && (
								<p className="text-sm text-[rgb(var(--color-danger))] mt-0.5">
									{errorMessage}
								</p>
							)}
							{!error && helperText && (
								<p className="text-sm text-[rgb(var(--color-text-secondary))] mt-0.5">
									{helperText}
								</p>
							)}
						</>
					)}
				</div>
			</div>
		);
	}

	// Option-based toggle
	return (
		<div
			className={`inline-flex rounded-lg border ${variantClasses[variant]} ${className}`}
		>
			{options.map((option, index) => {
				const isSelected = value === option.value;
				const isFirst = index === 0;
				const isLast = index === options.length - 1;

				return (
					<button
						key={option.value}
						onClick={() => handleOptionClick(option.value)}
						disabled={disabled}
						className={`
              ${sizeClasses[size]}
              font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2
              ${isFirst ? "rounded-l-lg" : ""}
              ${isLast ? "rounded-r-lg" : ""}
              ${!isFirst && !isLast ? "border-l border-[rgb(var(--color-border-primary))]" : ""}
              ${
								isSelected
									? "bg-[rgb(var(--color-primary))] text-white border-[rgb(var(--color-primary))]"
									: "text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))]"
							}
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
						aria-pressed={isSelected}
						aria-label={option.label}
					>
						{option.icon && <option.icon className="w-4 h-4 mr-2" />}
						{option.label}
					</button>
				);
			})}
		</div>
	);
};

// Predefined toggle components for common use cases
export const ViewToggle = ({ value, onChange, className = "", ...props }) => (
	<Toggle
		options={[
			{ value: "grid", label: "Grid", icon: Grid },
			{ value: "list", label: "List", icon: List },
		]}
		value={value}
		onChange={onChange}
		className={className}
		{...props}
	/>
);

export default Toggle;
