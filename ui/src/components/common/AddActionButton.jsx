"use client";
import { Plus } from "lucide-react";
import { Tooltip as SharedTooltip } from "../tooltip/Tooltip";

const AddActionButton = ({
	onClick,
	label = "Add",
	Icon = Plus,
	className = "",
	fullWidth = false,
	size = "sm", // 'sm' | 'md'
	title = "Add",
	disabled = false,
	iconClassName = "",
	variant = "success", // 'success' | 'primary' | 'danger' | 'neutral'
}) => {
	const sizeClasses =
		size === "md" ? "px-4 py-2.5 h-12 text-sm" : "px-3 py-2 h-10 text-sm";
	const widthClasses = fullWidth ? "w-full" : "";
	const colorMap = {
		success: {
			text: "rgb(var(--color-success))",
			hoverBg: "rgba(var(--color-success),0.1)",
		},
		primary: {
			text: "rgb(var(--color-primary))",
			hoverBg: "rgba(var(--color-primary),0.1)",
		},
		danger: {
			text: "rgb(var(--color-danger))",
			hoverBg: "rgba(var(--color-danger),0.1)",
		},
		neutral: {
			text: "rgb(var(--color-text-secondary))",
			hoverBg: "rgba(var(--color-primary),0.06)",
		},
	};
	const colors = colorMap[variant] || colorMap.success;
	return (
		<SharedTooltip content={title}><button
			type="button"
			onClick={onClick}

			disabled={disabled}
			className={`flex items-center justify-center gap-2 cursor-pointer rounded-lg transition-colors duration-200 ${sizeClasses} ${widthClasses} ${className}`}
			style={{ color: colors.text, backgroundColor: "transparent" }}
			onMouseEnter={(e) => {
				e.currentTarget.style.backgroundColor = colors.hoverBg;
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.backgroundColor = "transparent";
			}}
		>
			{Icon && <Icon className={`w-4 h-4 ${iconClassName}`} />}
			{label ? <span className="font-medium">{label}</span> : null}
		</button></SharedTooltip>
	);
};

export default AddActionButton;
