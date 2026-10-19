"use client";
import { Inbox, AlertCircle } from "lucide-react";
import { Button } from "../button/Button";

const EmptyState = ({
	title,
	description = null,
	icon = null,
	type = "empty",
	size = "sm", // sm, md, lg
	actionButton = null,
	className = "",
	fullHeight = false,
}) => {
	const Icon = icon || (type === "error" ? AlertCircle : Inbox);
	const sizeStyles = {
		sm: {
			iconSize: "w-12 h-12",
			iconInner: "w-6 h-6",
			titleSize: "text-base sm:text-lg",
			descSize: "text-xs sm:text-sm",
			spacing: "mb-3",
			padding: "p-4",
		},
		md: {
			iconSize: "w-16 h-16",
			iconInner: "w-8 h-8",
			titleSize: "text-lg sm:text-xl",
			descSize: "text-sm",
			spacing: "mb-6",
			padding: "p-8",
		},
		lg: {
			iconSize: "w-24 h-24",
			iconInner: "w-12 h-12",
			titleSize: "text-2xl sm:text-3xl",
			descSize: "text-base",
			spacing: "mb-8",
			padding: "p-12",
		},
	};

	const typeStyles = {
		empty: {
			iconBg: "bg-[rgb(var(--color-primary))]/10",
			iconColor: "text-[rgb(var(--color-primary))]",
		},
		error: {
			iconBg: "bg-red-50 dark:bg-red-900/10",
			iconColor: "text-red-500",
		},
		info: {
			iconBg: "bg-blue-50 dark:bg-blue-900/10",
			iconColor: "text-blue-500",
		},
	};

	const activeSize = sizeStyles[size] || sizeStyles.sm;
	const activeType = typeStyles[type] || typeStyles.empty;

	const containerClasses = `flex flex-col items-center justify-center text-center ${activeSize.padding} w-full ${fullHeight ? "min-h-[max(16rem,calc(100dvh-16rem))] flex-1" : "min-h-56"} ${className}`;

	return (
		<section
			className={containerClasses.trim()}
			aria-label={typeof title === "string" ? title : undefined}
		>
			{Icon && (
				<div
					className={`${activeSize.iconSize} rounded-full flex items-center justify-center ${activeSize.spacing} animate-in zoom-in-75 duration-300 ${activeType.iconBg}`}
				>
					<Icon className={`${activeSize.iconInner} ${activeType.iconColor}`} />
				</div>
			)}

			<h2
				className={`${activeSize.titleSize} font-bold text-[rgb(var(--color-text-primary))] mb-2 max-w-lg`}
			>
				{title}
			</h2>
			{description && (
				<p
					className={`text-[rgb(var(--color-text-secondary))] ${activeSize.descSize} mb-6 max-w-md mx-auto leading-relaxed`}
				>
					{description}
				</p>
			)}

			{actionButton && (
				<div className="animate-in slide-in-from-bottom-2 duration-400">
					<Button
						variant={actionButton.variant || "primary"}
						onClick={actionButton.onClick}
						leftIcon={actionButton.icon}
						size={size === "sm" ? "sm" : "md"}
						className="px-6"
					>
						{actionButton.label}
					</Button>
				</div>
			)}
		</section>
	);
};

export default EmptyState;
