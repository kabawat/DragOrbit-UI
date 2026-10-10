"use client";
import React, { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

const Input = forwardRef(
  (
    {
      type = "text",
      placeholder,
      value,
      onChange,
      leftIcon: LeftIcon,
      error,
      errorMessage,
      success,
      successMessage,
      label,
      helperText,
      className = "",
      autoFocus = false,
      disabled = false,
      required = false,
      name,
      id,
      maxLength,
      minLength,
      pattern,
      autoComplete = "off",
      showPasswordToggle = false,
      rightElement,
      size = "sm",
      min,
      max,
      step,
      precision,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const generatedId = useId();
    const inputId = id || generatedId;
    const passwordToggle = showPasswordToggle && type === "password";
    const trailing = rightElement || (passwordToggle ? <button type="button" disabled={disabled} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)} className="p-1 text-[rgb(var(--color-text-secondary))]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button> : null);

    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    const handleChange = (e) => {
      const inputValue = e.target.value;

      if (type === "number") {
        if (inputValue === "" || inputValue === "-") {
          onChange?.(inputValue);
          return;
        }

        const numValue = parseFloat(inputValue);
        if (Number.isNaN(numValue)) {
          return;
        }

        let processedValue = numValue;

        if (min !== undefined && processedValue < min) {
          processedValue = min;
        }
        if (max !== undefined && processedValue > max) {
          processedValue = max;
        }

        if (precision !== undefined) {
          processedValue = parseFloat(processedValue.toFixed(precision));
        }

        onChange?.(processedValue);
      } else {
        onChange?.(inputValue);
      }
    };

    const handleKeyDown = (e) => {
      if (type === "number") {
        const allowedKeys = [
          "Backspace",
          "Delete",
          "Tab",
          "Escape",
          "Enter",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ];
        const isNumber = /[0-9]/.test(e.key);
        const isDecimal =
          e.key === "." && precision !== undefined && precision > 0;
        const isMinus = e.key === "-" && min !== undefined && min < 0;
        const isCtrlA = e.ctrlKey && e.key === "a";
        const isCtrlC = e.ctrlKey && e.key === "c";
        const isCtrlV = e.ctrlKey && e.key === "v";
        const isCtrlX = e.ctrlKey && e.key === "x";

        if (
          !allowedKeys.includes(e.key) &&
          !isNumber &&
          !isDecimal &&
          !isMinus &&
          !isCtrlA &&
          !isCtrlC &&
          !isCtrlV &&
          !isCtrlX
        ) {
          e.preventDefault();
        }
      }
      props.onKeyDown?.(e);
    };

    // Size classes - Original padding restored
    const sizeClasses = {
      sm: "py-1.5 text-xs h-10",
      md: "py-2.5 text-sm h-12", // Restored original padding
      lg: "py-3 text-base h-14",
    };

    // Base classes - Theme aware
    const baseClasses = `w-full border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] ${sizeClasses[size]}`;

    // Padding classes - Reduced spacing based on size
    const paddingClasses = {
      sm: LeftIcon ? "pl-8" : "pl-2.5",
      md: LeftIcon ? "pl-10" : "pl-3", // Default padding
      lg: LeftIcon ? "pl-12" : "pl-4",
    };

    const rightPaddingClasses = {
      sm: trailing ? "pr-8" : "pr-2.5",
      md: trailing ? "pr-10" : "pr-3", // Default padding
      lg: trailing ? "pr-12" : "pr-4",
    };

    // State classes - Theme aware with higher specificity
    const stateClasses = error
      ? "!border-red-500 !bg-red-50 focus:!border-red-500 focus:!ring-red-500"
      : success
        ? "!border-green-500 !bg-green-50 focus:!border-green-500 focus:!ring-green-500"
        : "border-[rgb(var(--color-border-primary))] focus:border-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]";

    const disabledClasses = disabled
      ? "bg-[rgb(var(--color-bg-tertiary))] cursor-not-allowed opacity-50"
      : "";

    const inputClasses = cn(
      baseClasses,
      paddingClasses[size],
      rightPaddingClasses[size],
      stateClasses,
      disabledClasses,
      className
    );

    return (
      <div className="relative">
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="block text-sm text-[rgb(var(--color-text-primary))] mb-2">
            <span className="flex items-center gap-2">
              <span>{label}</span>
              {required && <span className="text-red-500">*</span>}
            </span>
          </label>
        )}
        <div className="relative">
          {/* Left Icon - Support for React element or icon component */}
          {LeftIcon && (
            <div
              className={`absolute left-0 top-0 h-full ${type === "date" ? "pointer-events-none" : "z-10"} flex items-center justify-center ${size === "sm" ? "w-8 ps-3" : size === "lg" ? "w-12 ps-5" : "w-10 ps-4"}`}
            >
              {React.isValidElement(LeftIcon) ? (
                LeftIcon
              ) : (
                <LeftIcon
                  className={`pointer-events-none ${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"} ${error ? "text-red-500" : "text-[rgb(var(--color-text-tertiary))]"}`}
                />
              )}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            required={required}
            name={name}
            id={inputId}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            autoComplete={autoComplete || "off"}
            autoFocus={autoFocus}
            aria-invalid={error || undefined}
            min={min}
            max={max}
            step={step}
            className={inputClasses}
            style={
              error
                ? { borderColor: "#ef4444", backgroundColor: "#fef2f2" }
                : {}
            }
            {...props}
          />

          {/* Right Element - Only rightElement renders here */}
          {trailing && (
            <div
              className={`absolute right-0 top-0 h-full z-10 flex items-center justify-center ${size === "sm" ? "w-8 pe-3" : size === "lg" ? "w-12 pe-5" : "w-10 pe-4"}`}
            >
              {trailing}
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
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
