"use client";
import { sessionDecision } from "@dragorbit/core/auth";
import { useEffect } from "react";
import { StartupLoader } from "./StartupLoader";

export function SessionGate({
	profile,
	pathname,
	guest = false,
	allowShellPreview = false,
	sessionHint = true,
	onRedirect,
	onRetry,
	children,
}) {
	// Cached navigation may render while auth remains explicitly unverified.
	const preview =
		allowShellPreview &&
		profile.shellRestored &&
		!profile.sessionVerified &&
		profile.authProfileErrorStatus !== 401 &&
		profile.retailerErrorStatus !== 401;
	const decision = preview
		? { state: "ready" }
		: sessionDecision(profile, { guest, sessionHint, pathname });
	useEffect(() => {
		if (decision.state === "redirect") onRedirect(decision.to);
	}, [decision.state, decision.to, onRedirect]);
	if (decision.state === "error")
		return (
			<section
				role="alert"
				className="mx-auto my-12 max-w-lg space-y-4 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-6"
			>
				<h1 className="text-base font-semibold">Unable to load your account</h1>
				<p className="text-sm text-[rgb(var(--color-text-secondary))]">
					{decision.message || "Please try again shortly."}
				</p>
				<button
					type="button"
					onClick={onRetry}
					disabled={profile.authProfileLoading || profile.isLoading}
					className="rounded-lg bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
				>
					Try again
				</button>
			</section>
		);
	if (decision.state !== "ready") return <StartupLoader />;
	return children;
}
