"use client";
import { themes } from "@dragorbit/core/themes";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
export function useTheme() {
	const value = useContext(ThemeContext);
	if (!value) throw new Error("useTheme requires ThemeProvider");
	return value;
}
export function ThemeProvider({
	children,
	initialTheme = "default",
	initialVariant = "light",
	onApply,
}) {
	const [currentTheme, setCurrentTheme] = useState(() => {
		const name =
			typeof initialTheme === "function" ? initialTheme() : initialTheme;
		return Object.hasOwn(themes, name) ? name : "default";
	});
	const [currentVariant, setCurrentVariant] = useState(() => {
		const variant =
			typeof initialVariant === "function" ? initialVariant() : initialVariant;
		return ["light", "dark"].includes(variant) ? variant : "light";
	});
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	useEffect(() => {
		onApply?.(currentTheme, currentVariant);
	}, [currentTheme, currentVariant, onApply]);
	const value = useMemo(() => {
		const themeConfig = themes[currentTheme].colors[currentVariant];
		return {
			currentTheme,
			currentVariant,
			themes,
			themeConfig,
			isSettingsOpen,
			setIsSettingsOpen,
			getCurrentThemeConfig: () => themeConfig,
			changeTheme: (name) => {
				if (Object.hasOwn(themes, name)) setCurrentTheme(name);
			},
			changeVariant: (variant) => {
				if (["light", "dark"].includes(variant)) setCurrentVariant(variant);
			},
			toggleVariant: () =>
				setCurrentVariant((value) => (value === "light" ? "dark" : "light")),
		};
	}, [currentTheme, currentVariant, isSettingsOpen]);
	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
