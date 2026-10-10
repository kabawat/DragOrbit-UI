class Theme {
	constructor(name, description, lightColors, darkColors) {
		this.name = name;
		this.description = description;
		this.colors = {
			light: lightColors,
			dark: darkColors,
		};
	}
}

class CoolThemes {
	constructor() {
		this.violet = new Theme(
			"Violet",
			"Bold and modern",
			{
				primary: "#8b5cf6",
				secondary: "#a78bfa",
				background: "#fbfaff",
				surface: "#f5f3ff",
				text: "#2e1065",
				textSecondary: "#4c1d95",
				border: "#ede9fe",
			},
			{
				primary: "#8b5cf6",
				secondary: "#a78bfa",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.indigo = new Theme(
			"Indigo",
			"Trustworthy and calm",
			{
				primary: "#6366f1",
				secondary: "#818cf8",
				background: "#f7f9ff",
				surface: "#eef2ff",
				text: "#1e1b4b",
				textSecondary: "#312e81",
				border: "#e0e7ff",
			},
			{
				primary: "#6366f1",
				secondary: "#818cf8",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.purple = new Theme(
			"Purple",
			"Royal and luxurious",
			{
				primary: "#a855f7",
				secondary: "#c084fc",
				background: "#fcfaff",
				surface: "#faf5ff",
				text: "#3b0764",
				textSecondary: "#581c87",
				border: "#f3e8ff",
			},
			{
				primary: "#a855f7",
				secondary: "#c084fc",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.blue = new Theme(
			"Blue",
			"Classic and trustworthy",
			{
				primary: "#3b82f6",
				secondary: "#60a5fa",
				background: "#f7fbff",
				surface: "#eff6ff",
				text: "#172554",
				textSecondary: "#1e3a8a",
				border: "#dbeafe",
			},
			{
				primary: "#3b82f6",
				secondary: "#60a5fa",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.midnight = new Theme(
			"Midnight",
			"Deep and sophisticated",
			{
				primary: "#0d313a",
				secondary: "#1b4f5e",
				background: "#f1f5f6",
				surface: "#e1e8e9",
				text: "#07191e",
				textSecondary: "#163c45",
				border: "#ccd7d9",
			},
			{
				primary: "#0d313a",
				secondary: "#1b4f5e",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);
		this.sapphire = new Theme(
			"Sapphire",
			"Professional and deep",
			{
				primary: "#006AA1",
				secondary: "#0089cf",
				background: "#f0f9ff",
				surface: "#e0f2fe",
				text: "#002d45",
				textSecondary: "#004c70",
				border: "#bae6fd",
			},
			{
				primary: "#006AA1",
				secondary: "#0089cf",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);
	}
}

export default new CoolThemes();
