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

class NeutralThemes {
	constructor() {
		this.sky = new Theme(
			"Sky",
			"Bright and airy",
			{
				primary: "#0ea5e9",
				secondary: "#38bdf8",
				background: "#f7fbff",
				surface: "#f0f9ff",
				text: "#082f49",
				textSecondary: "#075985",
				border: "#e0f2fe",
			},
			{
				primary: "#0ea5e9",
				secondary: "#38bdf8",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.cyan = new Theme(
			"Cyan",
			"Cool and modern",
			{
				primary: "#06b6d4",
				secondary: "#22d3ee",
				background: "#f0fefe",
				surface: "#ecfeff",
				text: "#083344",
				textSecondary: "#155e75",
				border: "#cffafe",
			},
			{
				primary: "#06b6d4",
				secondary: "#22d3ee",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.slate = new Theme(
			"Slate",
			"Neutral and balanced",
			{
				primary: "#64748b",
				secondary: "#94a3b8",
				background: "#fcfcfd",
				surface: "#f8fafc",
				text: "#0f172a",
				textSecondary: "#1e293b",
				border: "#f1f5f9",
			},
			{
				primary: "#64748b",
				secondary: "#94a3b8",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.zinc = new Theme(
			"Zinc",
			"Modern and clean",
			{
				primary: "#71717a",
				secondary: "#a1a1aa",
				background: "#fafafa",
				surface: "#f4f4f5",
				text: "#09090b",
				textSecondary: "#27272a",
				border: "#e4e4e7",
			},
			{
				primary: "#71717a",
				secondary: "#a1a1aa",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);
	}
}

export default new NeutralThemes();
