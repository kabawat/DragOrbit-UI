"use client";
import { Crown, ShieldAlert } from "lucide-react";
import { Button } from "../button/Button";
import { Modal } from "../modal/Modal";
import { translateLabel } from "./translateLabel";
export function SubscriptionNotice({
	isOpen,
	onClose,
	message,
	type = "UPGRADE",
	onUpgrade,
	onViewPlans,
	isOwner = false,
	t = (key, fallback) => fallback || key,
}) {
	const localize = (key, fallback) => translateLabel(t, key, fallback);
	const quota = type === "QUOTA",
		info = type === "INFO";
	const title = quota
		? localize("subscription.quotaTitle", "You've hit the limit")
		: info
			? localize("subscription.accessRestricted", "Access Restricted")
			: localize("subscription.upgradeTitle", "Unlock the full power");
	const Icon = info ? ShieldAlert : Crown;
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			className="w-full max-w-md"
		>
			<div className="p-6 space-y-6 text-center">
				<Icon
					className="w-12 h-12 mx-auto text-[rgb(var(--color-primary))]"
					aria-hidden
				/>
				<p className="text-sm text-[rgb(var(--color-text-secondary))]">
					{message ||
						(quota
							? localize(
									"subscription.quotaMessage",
									"You've used up your quota for this period. Upgrade now to continue without interruptions.",
								)
							: info
								? localize(
										"subscription.infoMessage",
										"This feature is restricted in the current plan.",
									)
								: localize(
										"subscription.upgradeMessage",
										"Premium features are waiting for you. Upgrade your plan and get access to everything.",
									))}
				</p>
				{!quota && !info && (
					<div className="grid grid-cols-3 gap-2 text-xs">
						{[
							["∞", "subscription.unlimitedUsage", "Unlimited usage"],
							["⚡", "subscription.prioritySpeed", "Priority speed"],
							["🔒", "subscription.advancedAccess", "Advanced access"],
						].map(([icon, key, label]) => (
							<div
								key={key}
								className="rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] p-2"
							>
								<div className="mb-1 text-base">{icon}</div>
								{localize(key, label)}
							</div>
						))}
					</div>
				)}
				<Button
					className="w-full"
					onClick={
						info
							? onClose
							: () => {
									onClose?.();
									onUpgrade?.();
								}
					}
				>
					{info
						? localize("common.gotIt", "Got it")
						: isOwner
							? localize(
									"subscription.manageSubscription",
									"Manage subscription",
								)
							: quota
								? localize("subscription.upgradeContinue", "Upgrade & Continue")
								: localize("subscription.upgradeMyPlan", "Upgrade My Plan")}
				</Button>
				{!info && onViewPlans && (
					<Button
						variant="outline"
						className="w-full"
						onClick={() => {
							onClose?.();
							onViewPlans();
						}}
					>
						{localize("subscription.viewPlans", "View plans")}
					</Button>
				)}
			</div>
		</Modal>
	);
}
