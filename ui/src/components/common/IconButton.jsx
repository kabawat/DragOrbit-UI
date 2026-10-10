"use client";
import { MoreVertical } from "lucide-react";

const IconButton = ({
	icon: Icon = MoreVertical,
	onClick,
	className = "",
	iconClassName = "w-4 h-4 text-[rgb(var(--color-text-secondary))]",
	title = "Actions",
	variant = "glass",
	...props
}) => {
	const variants = {
		glass:
			"bg-white/80 dark:bg-[rgb(var(--color-bg-primary))]/80 hover:bg-white dark:hover:bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/20",
		ghost: "hover:bg-[rgb(var(--color-bg-secondary))]",
		outline:
			"border border-[rgb(var(--color-border-primary))] hover:bg-[rgb(var(--color-bg-secondary))]",
		primary:
			"bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary))]/90 shadow-sm",
	};

	return (
		<button
			onClick={onClick}
			className={`p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${variants[variant] || variants.glass} ${className}`}
			title={title}
			type="button"
			{...props}
		>
			<Icon className={iconClassName} />
		</button>
	);
};

export default IconButton;
