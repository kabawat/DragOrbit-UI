import { themes } from "./palettes.js";
export {
	themes,
	warmThemes,
	coolThemes,
	greenThemes,
	vibrantThemes,
	neutralThemes,
} from "./palettes.js";
export const THEME_STORAGE_KEYS = Object.freeze({
	theme: "dragbizz-theme",
	variant: "dragbizz-variant",
});
export const DEFAULT_THEME = "default";
export const DEFAULT_VARIANT = "light";
export const themeColorMapping = Object.freeze({
	primary: "--color-primary",
	secondary: "--color-secondary",
	background: "--color-bg-primary",
	surface: "--color-bg-secondary",
	text: "--color-text-primary",
	textSecondary: "--color-text-secondary",
	border: "--color-border-primary",
});
export function isThemeName(value) {
	return typeof value === "string" && Object.hasOwn(themes, value);
}
export function isThemeVariant(value) {
	return value === "light" || value === "dark";
}
export function hexToRgbSpace(value) {
	if (
		typeof value !== "string" ||
		!/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(value)
	)
		throw new TypeError("Expected a three- or six-digit hex color");
	const hex = value.slice(1),
		full =
			hex.length === 3 ? [...hex].map((char) => char + char).join("") : hex;
	return [0, 2, 4]
		.map((index) => parseInt(full.slice(index, index + 2), 16))
		.join(" ");
}
/** Pure resolver: no React, storage, document or platform dependency. */
export function getThemeTokens(
	themeName = DEFAULT_THEME,
	variant = DEFAULT_VARIANT,
) {
	const name = isThemeName(themeName) ? themeName : DEFAULT_THEME;
	const mode = isThemeVariant(variant) ? variant : DEFAULT_VARIANT;
	const colors = themes[name].colors[mode],
		variables = {};
	for (const [key, cssVar] of Object.entries(themeColorMapping)) {
		const value = colors[key];
		if (value)
			variables[cssVar] = value.startsWith("#") ? hexToRgbSpace(value) : value;
	}
	variables["--color-bg-tertiary"] = hexToRgbSpace(colors.surface);
	variables["--color-border-secondary"] = hexToRgbSpace(colors.border);
	return { themeName: name, variant: mode, colors, variables };
}
/** Produces bootstrap text; browser effects happen only when the host executes it. */
export function createThemeBootstrapScript() {
	const presets = {};
	for (const name of Object.keys(themes))
		presets[name] = {
			light: getThemeTokens(name, "light"),
			dark: getThemeTokens(name, "dark"),
		};
	const safeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
	return `(function(){try{const presets=${safeJson(presets)},keys=${safeJson(THEME_STORAGE_KEYS)};let name='default',variant='light';try{const stored=localStorage.getItem(keys.theme),mode=localStorage.getItem(keys.variant);if(Object.prototype.hasOwnProperty.call(presets,stored))name=stored;if(mode==='light'||mode==='dark')variant=mode;}catch{}const theme=presets[name][variant],root=document.documentElement;root.setAttribute('data-theme',theme.themeName);root.setAttribute('data-variant',theme.variant);root.classList.toggle('dark',theme.variant==='dark');Object.entries(theme.variables).forEach(([key,value])=>root.style.setProperty(key,value));}catch{}})();`;
}
