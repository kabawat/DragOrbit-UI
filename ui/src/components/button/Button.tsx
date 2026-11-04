"use client";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithRef, ComponentType } from "react";
import { Tooltip } from "../tooltip/Tooltip";

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "success"
	| "danger"
	| "warning"
	| "outline"
	| "ghost"
	| "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

type ButtonIcon = ComponentType<{ className?: string }>;

export type ButtonProps = ComponentPropsWithRef<"button"> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	isLoading?: boolean;
	leftIcon?: ButtonIcon;
	rightIcon?: ButtonIcon;
	fullWidth?: boolean;
};

export const Button = ({
	children,
	variant = "primary",
	size = "sm",
	disabled = false,
	loading = false,
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	onClick,
	type = "button",
	className = "",
	fullWidth = false,
	isLoading,
	title,
	...props
}: ButtonProps) => {
	// Determine loading state from either prop
	const isLoadingState = loading || isLoading;

	// Base classes
	const baseClasses =
		"inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-80 disabled:cursor-not-allowed disabled:pointer-events-none btn-ripple cursor-pointer";

	// Size variants - Reduced padding and font sizes
	const sizeClasses: Record<ButtonSize, string> = {
		xs: "px-2 py-1.5 text-xs",
		sm: "px-2.5 py-2 text-xs",
		md: "px-3 py-2 text-sm",
		lg: "px-4 py-2.5 text-sm",
		xl: "px-5 py-3 text-base",
	};

	// Color variants - Theme aware
	const variantClasses: Record<ButtonVariant, string> = {
		primary:
			"bg-[rgb(var(--color-primary))] text-white hover:opacity-90 focus:ring-[rgb(var(--color-primary))] shadow-sm hover:shadow-md",
		secondary:
			"bg-[rgb(var(--color-bg-tertiary))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] focus:ring-[rgb(var(--color-secondary))]",
		success:
			"bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md",
		danger:
			"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
		warning:
			"bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-sm hover:shadow-md",
		outline:
			"border-2 border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] focus:ring-[rgb(var(--color-primary))]",
		ghost:
			"text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] focus:ring-[rgb(var(--color-primary))]",
		link: "text-[rgb(var(--color-primary))] hover:opacity-80 underline-offset-4 hover:underline focus:ring-[rgb(var(--color-primary))]",
	};

	// Width classes
	const widthClasses = fullWidth ? "w-full" : "";

	// Combine all classes
	const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${title ? "disabled:pointer-events-auto!" : ""} ${className}`;

	const button = (
		<button
			type={type}
			disabled={disabled || isLoadingState}
			onClick={onClick}
			className={buttonClasses}
			{...props}
		>
			{isLoadingState && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}

			{!isLoadingState && LeftIcon && <LeftIcon className="w-4 h-4 mr-2" />}

			{children}

			{!isLoadingState && RightIcon && <RightIcon className="w-4 h-4 ml-2" />}
		</button>
	);
	return title ? <Tooltip content={title}>{button}</Tooltip> : button;
};

export default Button;
