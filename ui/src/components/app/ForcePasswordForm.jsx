"use client";
import {
	AlertCircle,
	CheckCircle,
	Eye,
	EyeOff,
	Lock,
	Shield,
} from "lucide-react";
import { useId, useState } from "react";
import { Modal } from "../modal/Modal";

export function ForcePasswordForm({
	isOpen,
	onSubmit,
	t = (key) => key,
	getError = (error) => error?.message || "Failed to set password",
}) {
	const passwordId = useId();
	const confirmId = useId();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	if (!isOpen) return null;

	// Password strength calculation identical to registration logic
	const getPasswordStrength = (pwd) => {
		let score = 0;
		const checks = {
			length: pwd.length >= 8,
			lowercase: /[a-z]/.test(pwd),
			uppercase: /[A-Z]/.test(pwd),
			number: /\d/.test(pwd),
			symbol: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
		};

		score = Object.values(checks).filter(Boolean).length;

		if (score <= 2) return { strength: "weak", color: "red", percentage: 25 };
		if (score <= 3)
			return { strength: "fair", color: "yellow", percentage: 50 };
		if (score <= 4) return { strength: "good", color: "blue", percentage: 75 };
		return { strength: "strong", color: "green", percentage: 100 };
	};

	const passwordStrength = getPasswordStrength(password);
	const isPasswordValid =
		password.length >= 8 && passwordStrength.strength !== "weak";

	const strengthChecks = [
		{
			label: t("auth.atLeast8Characters") || "At least 8 characters",
			valid: password.length >= 8,
		},
		{
			label: t("auth.containsNumber") || "Contains a number",
			valid: /\d/.test(password),
		},
		{
			label: t("auth.containsSymbol") || "Contains a special character",
			valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		},
		{
			label: t("auth.mixUpperLowercase") || "Contains uppercase & lowercase",
			valid: /[a-z]/.test(password) && /[A-Z]/.test(password),
		},
	];

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isLoading) return;
		setError("");

		if (!isPasswordValid) {
			setError(
				t("auth.passwordRequirements") ||
					"Please meet all password requirements.",
			);
			return;
		}

		if (password !== confirmPassword) {
			setError(t("auth.passwordsDoNotMatch") || "Passwords do not match");
			return;
		}

		setIsLoading(true);

		try {
			const result = await onSubmit(password);
			if (!result?.success)
				setError(result?.message || "Failed to set password");
		} catch (err) {
			setError(getError(err));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			ariaLabel="Set Your Login Password"
			showCloseButton={false}
			closeOnEscape={false}
			closeOnOverlayClick={false}
			className="w-full max-w-2xl"
		>
			<div className="p-6 sm:p-8">
				<div className="text-center mb-6">
					<div className="w-16 h-16 bg-[rgb(var(--color-primary))] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-[rgba(var(--color-primary),0.3)]">
						<Lock className="w-8 h-8 text-white" />
					</div>
					<h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
						Set Your Login Password
					</h2>
					<div className="flex flex-col items-center justify-center mt-3 p-3.5 bg-[rgba(var(--color-primary),0.05)] rounded-xl text-center">
						<p className="text-[0.8125rem] sm:text-sm font-medium text-[rgb(var(--color-primary))] leading-relaxed flex flex-col sm:flex-row items-center justify-center gap-2">
							{/* <AlertCircle className="w-5 h-5 shrink-0 opacity-80" /> */}
							<span className="opacity-90">
								You must set a login password before continuing. You cannot skip
								this step. This password will secure your account.
							</span>
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					{error && (
						<div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-600 text-sm">
							<AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
							<p>{error}</p>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<label
								htmlFor={passwordId}
								className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5"
							>
								New Password
							</label>
							<div className="relative">
								<input
									id={passwordId}
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter a strong password"
									className={`w-full px-4 py-2.5 pr-10 bg-[rgb(var(--color-bg-secondary))] border ${
										password && passwordStrength.strength === "strong"
											? "border-green-500 bg-green-50 dark:bg-green-900/20"
											: password && passwordStrength.strength === "weak"
												? "border-red-500 bg-red-50 dark:bg-red-900/20"
												: "border-[rgb(var(--color-border-primary))]"
									} rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent text-[rgb(var(--color-text-primary))] transition-all`}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>

						{/* Confirm Password Input */}
						<div>
							<label
								htmlFor={confirmId}
								className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5"
							>
								Confirm Login Password
							</label>
							<div className="relative">
								<input
									id={confirmId}
									type={showConfirmPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Re-enter your password"
									className="w-full px-4 py-2.5 pr-10 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent text-[rgb(var(--color-text-primary))] transition-all"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
								>
									{showConfirmPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>
					</div>

					{/* Password Strength Meter */}
					{password && (
						<div className="mt-3">
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs text-[rgb(var(--color-text-secondary))]">
									{t("auth.passwordStrengthLabel") || "Password strength"}
								</span>
								<span
									className={`text-xs font-semibold capitalize ${
										passwordStrength.color === "red"
											? "text-red-500"
											: passwordStrength.color === "yellow"
												? "text-yellow-500"
												: passwordStrength.color === "blue"
													? "text-blue-500"
													: "text-green-500"
									}`}
								>
									{passwordStrength.strength}
								</span>
							</div>
							<div className="w-full bg-[rgb(var(--color-bg-tertiary))] rounded-full h-1.5">
								<div
									className={`h-1.5 rounded-full transition-all duration-300 ${
										passwordStrength.color === "red"
											? "bg-red-500"
											: passwordStrength.color === "yellow"
												? "bg-yellow-500"
												: passwordStrength.color === "blue"
													? "bg-blue-500"
													: "bg-green-500"
									}`}
									style={{ width: `${passwordStrength.percentage}%` }}
								></div>
							</div>
						</div>
					)}

					{/* Password Requirements Checklist */}
					<div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-xl p-3">
						<div className="flex items-center mb-2">
							<Shield className="w-4 h-4 text-[rgb(var(--color-primary))] mr-2" />
							<span className="font-semibold text-xs text-[rgb(var(--color-text-primary))]">
								{t("auth.securityTips") || "Security Requirements"}
							</span>
						</div>
						<div className="space-y-1.5">
							{strengthChecks.map((check) => (
								<div key={check.label} className="flex items-center">
									{check.valid ? (
										<CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2" />
									) : (
										<AlertCircle className="w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))] mr-2" />
									)}
									<span
										className={`text-xs ${check.valid ? "text-green-600 dark:text-green-400 font-medium" : "text-[rgb(var(--color-text-secondary))]"}`}
									>
										{check.label}
									</span>
								</div>
							))}
						</div>
					</div>

					<button
						type="submit"
						disabled={
							isLoading ||
							!isPasswordValid ||
							!confirmPassword ||
							password !== confirmPassword
						}
						className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all bg-[rgb(var(--color-primary))] ${
							isLoading ||
							!isPasswordValid ||
							!confirmPassword ||
							password !== confirmPassword
								? "opacity-60 cursor-not-allowed"
								: "hover:bg-opacity-90 shadow-md hover:shadow-lg"
						}`}
					>
						{isLoading ? (
							<div className="flex items-center justify-center">
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
								Saving...
							</div>
						) : (
							"Save Login Password"
						)}
					</button>
				</form>
			</div>
		</Modal>
	);
}
