"use client";
import { AlertCircle } from "lucide-react";
import React, { forwardRef } from "react";

const Textarea = forwardRef(
	(
		{
			placeholder,
			value,
			onChange,
			leftIcon: LeftIcon,
			label,
			error = false,
			errorMessage,
			success = false,
			successMessage,
			helperText,
			disabled = false,
			required = false,
			rows = 4,
			maxLength,
			showCharCount = false,
			resize = "vertical",
			className = "",
			name,
			id,
			...props
		},
		ref,
	) => {
		const [isFocused, setIsFocused] = React.useState(false);

		// Base classes
		const baseClasses =
			"w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]";

		// Padding classes - adjust based on leftIcon
		const paddingClasses = LeftIcon ? "pl-12 pr-4 py-2.5" : "px-3.5 py-2.5 text-sm";

		// State classes
		const stateClasses = error
			? "!border-red-500 !bg-red-50 focus:!border-red-500 focus:!ring-red-500"
			: success
				? "!border-green-500 !bg-green-50 focus:!border-green-500 focus:!ring-green-500"
				: "border-[rgb(var(--color-border-primary))] focus:border-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]";

		const disabledClasses = disabled
			? "bg-[rgb(var(--color-bg-tertiary))] cursor-not-allowed opacity-50"
			: "";

		// Resize classes
		const resizeClasses = {
			none: "resize-none",
			vertical: "resize-y",
			horizontal: "resize-x",
			both: "resize",
		};

		const textareaClasses = `${baseClasses} ${paddingClasses} ${stateClasses} ${disabledClasses} ${resizeClasses[resize]} ${className}`;

		const handleFocus = (e) => {
			setIsFocused(true);
			props.onFocus?.(e);
		};

		const handleBlur = (e) => {
			setIsFocused(false);
			props.onBlur?.(e);
		};

		const handleChange = (e) => {
			const newValue = e.target.value;
			if (maxLength && newValue.length > maxLength) {
				return;
			}
			onChange?.(newValue);
		};

		const currentLength = value?.length || 0;
		const isNearLimit = maxLength && currentLength > maxLength * 0.8;
		const isAtLimit = maxLength && currentLength >= maxLength;

		return (
			<div className="w-full">
				{/* Label */}
				{label && (
					<label htmlFor={id} className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
						<span className="flex items-center gap-2">
							<span>{label}</span>
							{required && <span className="text-red-500">*</span>}
						</span>
					</label>
				)}

				<div className="relative">
					{/* Left Icon */}
					{LeftIcon && (
						<div className="absolute left-4 top-3 z-10 flex items-start">
							<LeftIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
						</div>
					)}

					{/* Textarea Field */}
					<textarea
						ref={ref}
						placeholder={placeholder}
						value={value}
						onChange={handleChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
						disabled={disabled}
						required={required}
						rows={rows}
						maxLength={maxLength}
						name={name}
						id={id}
						className={textareaClasses}
						{...props}
					/>

					{/* Character Count */}
					{showCharCount && maxLength && (
						<div className="absolute bottom-2 right-2 text-xs text-gray-400">
							<span
								className={
									isAtLimit
										? "text-red-500"
										: isNearLimit
											? "text-yellow-500"
											: ""
								}
							>
								{currentLength}/{maxLength}
							</span>
						</div>
					)}

					{/* Error/Success Icon */}
					{(error || success) && (
						<div className="absolute top-3 right-3">
							<AlertCircle
								className={`w-5 h-5 ${error ? "text-red-500" : "text-green-500"}`}
							/>
						</div>
					)}
				</div>

				{/* Helper Text / Error Message / Success Message */}
				{(helperText || errorMessage || successMessage) && (
					<div className="mt-2">
						{error && errorMessage && (
							<p className="text-sm text-red-600 animate-fade-in">
								{errorMessage}
							</p>
						)}
						{success && successMessage && (
							<p className="text-sm text-green-600 animate-fade-in">
								{successMessage}
							</p>
						)}
						{!error && !success && helperText && (
							<p className="text-sm text-gray-500">{helperText}</p>
						)}
					</div>
				)}

				{/* Character Count Below */}
				{showCharCount && maxLength && (
					<div className="mt-1 text-right">
						<span
							className={`text-xs ${isAtLimit ? "text-red-500" : isNearLimit ? "text-yellow-500" : "text-gray-400"}`}
						>
							{currentLength}/{maxLength} characters
						</span>
					</div>
				)}
			</div>
		);
	},
);

Textarea.displayName = "Textarea";

export default Textarea;
