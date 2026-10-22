"use client";
import { ArrowRight, Check, Lock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { DragBizzLogoIcon } from "./DragBizzLogoIcon";

const UpgradeModal = ({
	isOpen,
	onClose,
	featureName,
	requiredFeature,
	onUpgrade,
}) => {
	const handleUpgrade = () => {
		onClose();
		onUpgrade?.();
	};

	const benefits = [
		"Access to all premium features",
		"Unlimited products and inventory",
		"Advanced analytics and reports",
		"Priority customer support",
		"Regular feature updates",
	];

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!isOpen || !mounted) return null;

	const modalContent = (
		<div
			className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center p-4 z-[9999]"
			style={{
				zIndex: 2147483647,
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
			}}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
		>
			<div
				className="bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
				style={{
					zIndex: 2147483647,
					position: "relative",
					backgroundColor: "rgb(var(--color-bg-primary))",
					border: "1px solid rgb(var(--color-border-primary))",
					borderRadius: "12px",
					boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
					width: "100%",
					maxWidth: "42rem",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Modal Header */}
				<div className="flex items-center justify-between p-6 border-b border-[rgb(var(--color-border-primary))]">
					<h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
						Upgrade Required
					</h2>
					<button
						onClick={onClose}
						className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors p-1 rounded-md hover:bg-[rgb(var(--color-bg-secondary))]"
						aria-label="Close modal"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 text-center">
					{/* Icon */}
					<div className="flex justify-center mb-4">
						<div className="w-20 h-20 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] rounded-full flex items-center justify-center shadow-lg">
							<Lock className="w-10 h-10 text-white" />
						</div>
					</div>

					<p className="text-[rgb(var(--color-text-secondary))] mb-6">
						{featureName ? (
							<>
								The{" "}
								<span className="font-semibold text-[rgb(var(--color-primary))]">
									{featureName}
								</span>{" "}
								feature is not available in your current plan.
							</>
						) : (
							"This feature requires a premium subscription."
						)}
					</p>

					{/* Feature Info */}
					{requiredFeature && (
						<div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg p-4 mb-6">
							<div className="flex items-center justify-center mb-2">
								<DragBizzLogoIcon className="w-5 h-5 text-[rgb(var(--color-primary))] mr-2" />
								<span className="font-semibold text-[rgb(var(--color-text-primary))]">
									Required Feature: {requiredFeature}
								</span>
							</div>
						</div>
					)}

					{/* Benefits */}
					<div className="bg-[rgb(var(--color-bg-secondary))] rounded-lg p-6 mb-6 text-left">
						<h3 className="font-semibold text-[rgb(var(--color-text-primary))] mb-4">
							Upgrade to unlock:
						</h3>
						<div className="space-y-3">
							{benefits.map((benefit, index) => (
								<div key={index} className="flex items-center">
									<div className="w-5 h-5 bg-[rgb(var(--color-primary))] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
										<Check className="w-3 h-3 text-white" />
									</div>
									<span className="text-[rgb(var(--color-text-secondary))]">
										{benefit}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button
							variant="primary"
							size="md"
							onClick={handleUpgrade}
							rightIcon={ArrowRight}
							className="w-full sm:w-auto"
						>
							View Plans & Upgrade
						</Button>
						<Button
							variant="outline"
							size="md"
							onClick={onClose}
							className="w-full sm:w-auto"
						>
							Maybe Later
						</Button>
					</div>

					{/* Footer Note */}
					<p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-6">
						Need help?{" "}
						<a
							href="/contact"
							className="text-[rgb(var(--color-primary))] hover:underline"
						>
							Contact Support
						</a>
					</p>
				</div>
			</div>
		</div>
	);

	// Render portal to body
	return createPortal(modalContent, document.body);
};

export default UpgradeModal;
