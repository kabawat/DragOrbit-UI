"use client";
import { X } from "lucide-react";

const Badge = ({
	children,
	variant = "default",
	size = "md",
	rounded = "full",
	dismissible = false,
	onDismiss,
	className = "",
	...props
}) => {
	// Variant classes with dark mode support
	const variantClasses = {
		default:
			"bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]",
		primary: "bg-blue-500/20 text-blue-500 border border-blue-500/30",
		secondary:
			"bg-[rgb(var(--color-bg-tertiary))] text-[rgb(var(--color-text-secondary))]",
		success: "bg-green-500/20 text-green-700 border border-green-500/30",
		danger: "bg-red-500/20 text-red-500 border border-red-500/30",
		warning: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
		info: "bg-cyan-500/20 text-cyan-500 border border-cyan-500/30",
		purple: "bg-purple-500/20 text-purple-500 border border-purple-500/30",
		pink: "bg-pink-500/20 text-pink-500 border border-pink-500/30",
		indigo: "bg-indigo-500/20 text-indigo-500 border border-indigo-500/30",
		outline:
			"border border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-primary))] bg-transparent",
		solid:
			"bg-[rgb(var(--color-text-primary))] text-[rgb(var(--color-bg-primary))]",
	};

	// Size classes
	const sizeClasses = {
		xs: "px-2 py-0.5 text-xs",
		sm: "px-2.5 py-1 text-xs",
		md: "px-3 py-1.5 text-sm",
		lg: "px-4 py-2 text-base",
	};

	// Rounded classes
	const roundedClasses = {
		none: "rounded-none",
		sm: "rounded-sm",
		md: "rounded-md",
		lg: "rounded-lg",
		full: "rounded-full",
	};

	// Base classes
	const baseClasses =
		"inline-flex items-center font-medium transition-all duration-200";

	const badgeClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses[rounded]} ${className}`;

	return (
		<span className={badgeClasses} {...props}>
			{children}

			{dismissible && (
				<button
					onClick={onDismiss}
					className="ml-1 hover:bg-[rgb(var(--color-bg-tertiary))] rounded-full p-0.5 transition-colors duration-200"
					aria-label="Remove badge"
				>
					<X className="w-3 h-3" />
				</button>
			)}
		</span>
	);
};

// Badge Group Component
const BadgeGroup = ({ children, className = "", ...props }) => (
	<div className={`flex flex-wrap gap-2 ${className}`} {...props}>
		{children}
	</div>
);

// Status Badge Component
const StatusBadge = ({ status, className = "", ...props }) => {
	const statusConfig = {
		active: { variant: "success", text: "Active" },
		inactive: { variant: "secondary", text: "Inactive" },
		pending: { variant: "warning", text: "Pending" },
		approved: { variant: "success", text: "Approved" },
		rejected: { variant: "danger", text: "Rejected" },
		draft: { variant: "secondary", text: "Draft" },
		published: { variant: "primary", text: "Published" },
		archived: { variant: "outline", text: "Archived" },
		online: { variant: "success", text: "Online" },
		offline: { variant: "danger", text: "Offline" },
		available: { variant: "success", text: "Available" },
		unavailable: { variant: "danger", text: "Unavailable" },
	};

	const config = statusConfig[status] || { variant: "default", text: status };

	return (
		<Badge variant={config.variant} className={className} {...props}>
			{config.text}
		</Badge>
	);
};

// Notification Badge Component
const NotificationBadge = ({
	count,
	maxCount = 99,
	variant = "danger",
	size = "sm",
	className = "",
	...props
}) => {
	const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

	if (count === 0) return null;

	return (
		<Badge
			variant={variant}
			size={size}
			className={`min-w-5 h-5 flex items-center justify-center ${className}`}
			{...props}
		>
			{displayCount}
		</Badge>
	);
};

export { Badge, BadgeGroup, StatusBadge, NotificationBadge };
export default Badge;
