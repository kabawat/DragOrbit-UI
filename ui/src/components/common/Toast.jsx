"use client";
import { CheckCircle, WifiOff, X } from "lucide-react";
import { useEffect, useState } from "react";

const Toast = ({
	message,
	type = "success",
	duration = 3000,
	onClose,
	position = "top-right",
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isExiting, setIsExiting] = useState(false);

	useEffect(() => {
		// Trigger entrance animation
		setTimeout(() => setIsVisible(true), 10);

		// Auto-dismiss after duration
		const timer = setTimeout(() => {
			setIsExiting(true);
			setTimeout(() => {
				if (onClose) onClose();
			}, 300); // Wait for exit animation
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	const handleClose = () => {
		setIsExiting(true);
		setTimeout(() => {
			if (onClose) onClose();
		}, 300);
	};

	const bgColor =
		type === "success"
			? "bg-green-500"
			: type === "error"
				? "bg-red-500"
				: "bg-blue-500";

	const positionClasses = {
		"top-right": "top-4 right-4",
		"bottom-center": "bottom-4 left-1/2",
		"top-center": "top-4 left-1/2",
		"bottom-right": "bottom-4 right-4",
	};

	const getAnimationClasses = () => {
		if (position === "bottom-center") {
			return isVisible && !isExiting
				? "-translate-x-1/2 translate-y-0 opacity-100"
				: "-translate-x-1/2 translate-y-8 opacity-0";
		}
		if (position === "top-center") {
			return isVisible && !isExiting
				? "-translate-x-1/2 translate-y-0 opacity-100"
				: "-translate-x-1/2 -translate-y-4 opacity-0";
		}
		return isVisible && !isExiting
			? "translate-x-0 opacity-100"
			: "translate-x-full opacity-0";
	};

	return (
		<div
			className={`fixed ${positionClasses[position] || positionClasses["top-right"]} z-[10000] transform transition-all duration-300 ease-out ${getAnimationClasses()}`}
		>
			<div
				className={`
        min-w-[300px] max-w-md 
        ${bgColor}
        border border-[rgb(var(--color-border-primary))] 
        rounded-lg 
        shadow-2xl 
        p-4 
        flex items-center gap-3
      `}
			>
				{/* Icon */}
				<div
					className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
					style={{
						backgroundColor: `rgb(var(--color-bg-primary))`,
					}}
				>
					{type === "success" && (
						<CheckCircle className="w-5 h-5" style={{ color: "#22c55e" }} />
					)}
					{type === "error" && (
						<WifiOff className="w-5 h-5" style={{ color: "#ef4444" }} />
					)}
				</div>

				{/* Message */}
				<div className="flex-1 min-w-0">
					<div className="text-sm font-medium text-white">
						{message.split("\n").map((line, index) => (
							<p key={index} className={index > 0 ? "mt-1" : ""}>
								{line}
							</p>
						))}
					</div>
				</div>

				{/* Close button */}
				<button
					onClick={handleClose}
					className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
				>
					<X className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};

export default Toast;
