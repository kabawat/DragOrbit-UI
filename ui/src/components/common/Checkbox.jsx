"use client";
import { Check } from "lucide-react";
import { useEffect, useId, useRef } from "react";

const Checkbox = ({
	currentVariant = "light",
	themeConfig = {
		primary: "rgb(var(--color-primary))",
		background: "rgb(var(--color-bg-primary))",
		border: "rgb(var(--color-border-primary))",
		text: "rgb(var(--color-text-primary))",
		textSecondary: "rgb(var(--color-text-secondary))",
	},
	checked = false,
	onChange,
	label,
	description,
	disabled = false,
	required = false,
	error = false,
	errorMessage,
	size = "md",
	className = "",
	name,
	id: idProp,
	value,
	indeterminate,
	...props
}) => {
	const checkboxRef = useRef(null);
	const generatedId = useId();
	const id = idProp ?? generatedId;

	// Set indeterminate property on the input element
	useEffect(() => {
		if (checkboxRef.current) {
			checkboxRef.current.indeterminate = indeterminate || false;
		}
	}, [indeterminate]);

	// Size variants
	const sizeClasses = {
		sm: "w-3 h-3",
		md: "w-4 h-4",
		lg: "w-5 h-5",
	};

	const iconSizes = {
		sm: "w-3 h-3",
		md: "w-4 h-4",
		lg: "w-5 h-5",
	};

	// Base classes
	const baseClasses =
		"rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";

	// State classes
	const stateClasses = error
		? "border-red-500 focus:ring-red-500"
		: checked || indeterminate
			? "focus:ring-blue-500"
			: "focus:ring-blue-500";

	const disabledClasses = disabled
		? "opacity-50 cursor-not-allowed"
		: "cursor-pointer";

	const checkboxClasses = `${baseClasses} ${sizeClasses[size]} ${stateClasses} ${disabledClasses} ${className}`;

	const handleChange = (e) => {
		if (!disabled) {
			onChange?.(e.target.checked);
		}
	};

	// Determine if checkbox should show as filled (checked or indeterminate)
	const isFilled = checked || indeterminate;

	const handleBoxClick = () => {
		if (!disabled && checkboxRef.current) {
			checkboxRef.current.click();
		}
	};

	return (
		<div className="flex items-start space-x-3">
			<div className="relative flex-shrink-0">
				<input
					ref={checkboxRef}
					type="checkbox"
					checked={checked}
					onChange={handleChange}
					disabled={disabled}
					required={required}
					name={name}
					id={id}
					value={value}
					className="sr-only"
					{...props}
				/>

				<div
					role="button"
					tabIndex={disabled ? -1 : 0}
					onClick={handleBoxClick}
					onKeyDown={(e) => {
						if (!disabled && (e.key === "Enter" || e.key === " ")) {
							e.preventDefault();
							handleBoxClick();
						}
					}}
					className={checkboxClasses}
					style={{
						backgroundColor: isFilled
							? themeConfig.primary
							: themeConfig.background,
						borderColor: error
							? "#ef4444"
							: isFilled
								? themeConfig.primary
								: themeConfig.border,
						color: isFilled ? "#ffffff" : themeConfig.text,
					}}
				>
					{checked && (
						<Check
							className={`${iconSizes[size]} animate-bounce-in`}
							style={{ color: "#ffffff" }}
						/>
					)}
					{indeterminate && !checked && (
						<div
							className={`${iconSizes[size]}`}
							style={{
								width: "60%",
								height: "2px",
								backgroundColor: "#ffffff",
								margin: "0 auto",
							}}
						/>
					)}
				</div>
			</div>

			{(label || description) && (
				<div className="flex-1 min-w-0">
					{label && (
						<label
							htmlFor={id}
							className="text-sm font-medium cursor-pointer"
							style={{
								color: disabled ? themeConfig.textSecondary : themeConfig.text,
							}}
						>
							{label}
							{required && <span className="text-red-500 ml-1">*</span>}
						</label>
					)}

					{description && (
						<p
							className="text-sm mt-1"
							style={{
								color: disabled
									? themeConfig.textSecondary
									: themeConfig.textSecondary,
							}}
						>
							{description}
						</p>
					)}

					{error && errorMessage && (
						<p className="text-sm text-red-600 mt-1 animate-fade-in">
							{errorMessage}
						</p>
					)}
				</div>
			)}
		</div>
	);
};

// Checkbox Group Component
const CheckboxGroup = ({
	children,
	label,
	description,
	error = false,
	errorMessage,
	className = "",
	...props
}) => {
	return (
		<div className={className}>
			{label && (
				<legend className="text-sm font-medium text-gray-700 mb-2">
					{label}
				</legend>
			)}

			{description && (
				<p className="text-sm text-gray-500 mb-4">{description}</p>
			)}

			<div className="space-y-3" {...props}>
				{children}
			</div>

			{error && errorMessage && (
				<p className="text-sm text-red-600 mt-2 animate-fade-in">
					{errorMessage}
				</p>
			)}
		</div>
	);
};

export { Checkbox, CheckboxGroup };
export default Checkbox;
