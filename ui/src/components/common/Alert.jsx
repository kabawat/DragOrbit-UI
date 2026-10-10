"use client";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

const Alert = ({
	variant = "info",
	title,
	children,
	dismissible = false,
	onDismiss,
	className = "",
	...props
}) => {
	// Variant configurations
	const variants = {
		info: {
			container: "bg-blue-50 border-blue-200 text-blue-800",
			icon: Info,
			iconColor: "text-blue-500",
		},
		success: {
			container: "bg-green-50 border-green-200 text-green-800",
			icon: CheckCircle,
			iconColor: "text-green-500",
		},
		warning: {
			container: "bg-yellow-50 border-yellow-200 text-yellow-800",
			icon: AlertTriangle,
			iconColor: "text-yellow-500",
		},
		error: {
			container: "bg-red-50 border-red-200 text-red-800",
			icon: AlertCircle,
			iconColor: "text-red-500",
		},
	};

	const config = variants[variant];
	const Icon = config.icon;

	return (
		<div
			className={`border rounded-lg p-4 ${config.container} ${className}`}
			{...props}
		>
			<div className="flex items-start">
				<Icon className={`w-5 h-5 mt-0.5 mr-3 ${config.iconColor}`} />

				<div className="flex-1">
					{title && <h4 className="font-medium mb-1">{title}</h4>}
					<div className="text-sm">{children}</div>
				</div>

				{dismissible && (
					<button
						onClick={onDismiss}
						className="ml-3 text-current opacity-70 hover:opacity-100 transition-opacity duration-200"
						aria-label="Dismiss alert"
					>
						×
					</button>
				)}
			</div>
		</div>
	);
};

export default Alert;
