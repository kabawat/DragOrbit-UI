"use client";
import {
	Bell,
	Moon,
	Palette,
	RefreshCw,
	Settings,
	Sun,
	Volume2,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip as SharedTooltip } from "../tooltip/Tooltip";

export const SettingsButton = ({ className = "", t, theme }) => {
	const { isSettingsOpen, setIsSettingsOpen } = theme;

	return (
		<SharedTooltip content={t("settings.title")}><button
			onClick={() => setIsSettingsOpen(!isSettingsOpen)}
			className={`relative p-2 rounded-xl transition-all duration-300 group cursor-pointer flex items-center justify-center active:scale-95 hover:bg-[rgb(var(--color-text-primary)/0.05)] border border-transparent hover:border-[rgb(var(--color-border-primary)/0.5)] navbar-settings-btn ${className}`}

		>
			<Settings
				className={`w-5 h-5 text-[rgb(var(--color-text-secondary))] transition-all duration-500 ${
					isSettingsOpen
						? "rotate-90 text-[rgb(var(--color-primary))]"
						: "group-hover:rotate-45"
				}`}
			/>
			{isSettingsOpen && (
				<span className="absolute -top-1 -right-1 w-2 h-2 bg-[rgb(var(--color-primary))] rounded-full animate-pulse" />
			)}
		</button></SharedTooltip>
	);
};

export const SettingsDrawer = ({
	t,
	locale,
	changeLanguage,
	localeNames,
	theme,
	isAuthenticated = false,
}) => {
	const {
		currentTheme,
		currentVariant,
		themes,
		changeTheme,
		toggleVariant,
		isSettingsOpen,
		setIsSettingsOpen,
	} = theme;

	const [activeTab, setActiveTab] = useState("appearance");
	const [notifications, setNotifications] = useState(true);
	const [sound, setSound] = useState(true);
	const [autoSave, setAutoSave] = useState(true);

	// Set default tab based on auth
	useEffect(() => {
		if (!isAuthenticated && activeTab !== "appearance") {
			setActiveTab("appearance");
		}
	}, [isAuthenticated, activeTab]);

	// Close drawer with Escape key
	useEffect(() => {
		const handleEscape = (event) => {
			if (event.key === "Escape" && isSettingsOpen) {
				setIsSettingsOpen(false);
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isSettingsOpen, setIsSettingsOpen]);

	// Close drawer with click outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (isSettingsOpen) {
				const drawerElement = document.querySelector("[data-drawer]");
				const settingsButtons = document.querySelectorAll(
					".settings-panel button, .navbar-settings-btn",
				);

				let isClickOnButton = false;
				settingsButtons.forEach((btn) => {
					if (btn.contains(event.target)) isClickOnButton = true;
				});

				if (
					drawerElement &&
					!drawerElement.contains(event.target) &&
					!isClickOnButton
				) {
					setIsSettingsOpen(false);
				}
			}
		};

		if (isSettingsOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isSettingsOpen, setIsSettingsOpen]);

	const handleThemeChange = (themeName) => {
		changeTheme(themeName);
	};

	const handleVariantToggle = () => {
		toggleVariant();
	};

	const tabs = [
		{ id: "appearance", label: t("settings.appearance"), icon: Palette },
		...(isAuthenticated
			? [
					{
						id: "notifications",
						label: t("settings.notificationsLabel"),
						icon: Bell,
					},
					{ id: "general", label: t("settings.general"), icon: Settings },
				]
			: []),
	];

	if (!isSettingsOpen) return null;

	return (
		<div
			data-drawer
			className="fixed inset-y-0 right-0 h-full w-full max-w-full sm:max-w-md md:w-[30.5rem] bg-[rgb(var(--color-bg-primary))]/95 backdrop-blur-xl border-l border-[rgb(var(--color-border-primary))] shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.25)] z-[10000] transform transition-all duration-500 ease-in-out flex flex-col isolate animate-in slide-in-from-right"
		>
			{/* Header */}
			<div className="bg-[rgb(var(--color-bg-secondary))] px-6 py-4 border-b border-[rgb(var(--color-border-primary))] flex-shrink-0 relative z-10">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-base font-bold text-[rgb(var(--color-text-primary))]">
							{t("settings.title")}
						</h2>
						<p className="text-sm text-[rgb(var(--color-text-secondary))]">
							{t("settings.customizeExperience")}
						</p>
					</div>
					<button
						onClick={() => setIsSettingsOpen(false)}
						className="p-2 hover:bg-[rgb(var(--color-bg-tertiary))] rounded-lg transition-colors cursor-pointer text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex border-b border-[rgb(var(--color-border-primary))] overflow-x-auto whitespace-nowrap tabs-scroll flex-shrink-0 relative z-10">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer flex-shrink-0 ${
								activeTab === tab.id
									? "text-[rgb(var(--color-primary))] border-b-2 border-[rgb(var(--color-primary))] bg-[rgb(var(--color-bg-secondary))]"
									: "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))]"
							}`}
						>
							<Icon className="w-4 h-4" />
							<span className="hidden sm:inline">{tab.label}</span>
						</button>
					);
				})}
			</div>

			{/* Tab Content */}
			<div className="flex-1 p-4 sm:p-6 overflow-y-auto">
				{/* Appearance Tab */}
				{activeTab === "appearance" && (
					<div className="space-y-6">
						{/* Dark Mode Toggle */}
						<div className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-secondary))] rounded-xl border border-[rgb(var(--color-border-primary))]/50 transition-all duration-300 group/card">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-[rgb(var(--color-bg-primary))] group-hover/card:scale-110 transition-transform duration-300">
									{currentVariant === "light" ? (
										<Sun className="w-5 h-5 text-yellow-500" />
									) : (
										<Moon className="w-5 h-5 text-blue-500" />
									)}
								</div>
								<div>
									<p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
										{t("settings.darkMode")}
									</p>
									<p className="text-xs text-[rgb(var(--color-text-secondary))]">
										{currentVariant === "light"
											? t("settings.switchToDark")
											: t("settings.switchToLight")}
									</p>
								</div>
							</div>
							<button
								onClick={handleVariantToggle}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
									currentVariant === "dark"
										? "bg-[rgb(var(--color-primary))] shadow-[0_0_10px_rgba(var(--color-primary),0.4)]"
										: "bg-[rgb(var(--color-border-primary))]"
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
										currentVariant === "dark"
											? "translate-x-6"
											: "translate-x-1"
									}`}
								/>
							</button>
						</div>
						{/* Theme Selection */}
						<div>
							<h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">
								{t("settings.theme")}
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{Object.entries(themes).map(([themeKey, theme]) => (
									<button
										key={themeKey}
										onClick={() => handleThemeChange(themeKey)}
										className={`relative p-3 rounded-xl border-1 transition-all duration-300 cursor-pointer overflow-hidden group/theme ${
											currentTheme === themeKey
												? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10"
												: "border-[rgb(var(--color-border-primary))]/50 hover:border-[rgb(var(--color-primary))]/50 hover:bg-[rgb(var(--color-bg-secondary))]"
										}`}
									>
										{/* Selected Indicator */}
										{currentTheme === themeKey && (
											<div className="absolute top-0 right-0 w-8 h-8 bg-[rgb(var(--color-primary))] flex items-center justify-center rounded-bl-xl shadow-sm">
												<RefreshCw className="w-3 h-3 text-white animate-spin-slow" />
											</div>
										)}

										<div className="flex items-center gap-2 mb-2">
											<div
												className="w-4 h-4 rounded-full border border-white/20 shadow-inner group-hover/theme:scale-110 transition-transform duration-300"
												style={{
													backgroundColor: theme.colors.light.primary,
												}}
											/>
											<span
												className={`text-xs font-bold transition-colors ${
													currentTheme === themeKey
														? "text-[rgb(var(--color-primary))]"
														: "text-[rgb(var(--color-text-primary))]"
												}`}
											>
												{theme.name}
											</span>
										</div>
										<p
											className={`text-[0.625rem] leading-tight text-left transition-colors font-medium ${
												currentTheme === themeKey
													? "text-[rgb(var(--color-text-primary))]"
													: "text-[rgb(var(--color-text-secondary))]"
											}`}
										>
											{theme.description}
										</p>
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Notifications Tab */}
				{activeTab === "notifications" && (
					<div className="space-y-6">
						<div className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-secondary))] rounded-lg">
							<div className="flex items-center gap-3">
								<Bell className="w-5 h-5 text-[rgb(var(--color-primary))]" />
								<div>
									<p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
										{t("settings.pushNotifications")}
									</p>
									<p className="text-xs text-[rgb(var(--color-text-secondary))]">
										{t("settings.receiveUpdates")}
									</p>
								</div>
							</div>
							<button
								onClick={() => setNotifications(!notifications)}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
									notifications
										? "bg-[rgb(var(--color-primary))]"
										: "bg-[rgb(var(--color-border-primary))]"
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										notifications ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>

						<div className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-secondary))] rounded-lg">
							<div className="flex items-center gap-3">
								<Volume2 className="w-5 h-5 text-[rgb(var(--color-primary))]" />
								<div>
									<p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
										{t("settings.soundEffects")}
									</p>
									<p className="text-xs text-[rgb(var(--color-text-secondary))]">
										{t("settings.playSounds")}
									</p>
								</div>
							</div>
							<button
								onClick={() => setSound(!sound)}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
									sound
										? "bg-[rgb(var(--color-primary))]"
										: "bg-[rgb(var(--color-border-primary))]"
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										sound ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>
					</div>
				)}

				{/* General Tab */}
				{activeTab === "general" && (
					<div className="space-y-6">
						<div className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-secondary))] rounded-lg">
							<div className="flex items-center gap-3">
								<RefreshCw className="w-5 h-5 text-[rgb(var(--color-primary))]" />
								<div>
									<p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
										{t("settings.autoSave")}
									</p>
									<p className="text-xs text-[rgb(var(--color-text-secondary))]">
										{t("settings.autoSaveDescription")}
									</p>
								</div>
							</div>
							<button
								onClick={() => setAutoSave(!autoSave)}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
									autoSave
										? "bg-[rgb(var(--color-primary))]"
										: "bg-[rgb(var(--color-border-primary))]"
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										autoSave ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>

						<div>
							<h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">
								{t("settings.language")}
							</h3>
							<select
								value={locale || "en"}
								onChange={(e) => {
									const newLocale = e.target.value;
									if (newLocale !== locale) {
										changeLanguage(newLocale);
									}
								}}
								className="w-full p-3 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
							>
								<option value="en">{localeNames.en}</option>
								<option value="hi">{localeNames.hi}</option>
								<option value="gu">{localeNames.gu}</option>
								<option value="hi-en">{localeNames["hi-en"]}</option>
							</select>
						</div>

						<div className="pt-4 border-t border-[rgb(var(--color-border-primary))]">
							<button className="w-full p-3 rounded-lg bg-[rgb(var(--color-danger))] text-white hover:opacity-90 transition-colors cursor-pointer">
								{t("settings.resetAll")}
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="px-6 py-4 bg-[rgb(var(--color-bg-secondary))] border-t border-[rgb(var(--color-border-primary))] flex-shrink-0">
				<div className="flex items-center justify-between text-xs text-[rgb(var(--color-text-secondary))]">
					<span>{t("settings.appVersion")}</span>
					<span>{t("settings.savedAutomatically")}</span>
				</div>
			</div>
		</div>
	);
};

const SettingsPanel = ({
	showButton = true,
	buttonClassName = "",
	...settings
}) => {
	return (
		<div className="no-print settings-panel">
			{showButton && (
				<div className="fixed bottom-20 right-0 sm:bottom-20 z-[10000]">
					<SettingsButton
						{...settings}
						className={`bg-[rgb(var(--color-primary))] !text-white h-14 w-14 pl-5 pr-2 rounded-l-2xl shadow-lg !hover:bg-[rgb(var(--color-primary)/0.9)] !border-none ${buttonClassName}`}
					/>
				</div>
			)}
			<SettingsDrawer {...settings} />
		</div>
	);
};

export default SettingsPanel;
