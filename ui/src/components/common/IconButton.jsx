"use client";
import { MoreVertical } from "lucide-react";

const IconButton = ({
	icon: Icon = MoreVertical,
	onClick,
	className = "",
	iconClassName = "w-4 h-4",
	title = "Actions",
	variant = "ghost",
	"aria-label": ariaLabel,
	disabled = false,
	...props
}) => {
	const variants = {
		glass:
			"bg-white/80 dark:bg-[rgb(var(--color-bg-primary))]/80 hover:bg-white dark:hover:bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/20",
		ghost: "border-0 bg-transparent hover:bg-[rgb(var(--color-bg-tertiary))]",
		outline:
			"border border-[rgb(var(--color-border-primary))] hover:bg-[rgb(var(--color-bg-secondary))]",
		primary:
			"bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary))]/90",
	};

	return (
		<button
			onClick={onClick}
			className={`inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg p-2 text-[rgb(var(--color-text-secondary))] transition-colors duration-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-primary))] disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant] || variants.ghost} ${className}`}
			title={title}
			aria-label={ariaLabel ?? title}
			disabled={disabled}
			type="button"
			{...props}
		>
			<Icon className={iconClassName} aria-hidden="true" />
		</button>
	);
};

export default IconButton;
