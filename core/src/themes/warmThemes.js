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

class WarmThemes {
	constructor() {
		this.default = new Theme(
			"Default",
			"Clean and professional",
			{
				primary: "#187CC5",
				secondary: "#6b7280",
				background: "#ffffff",
				surface: "#f9fafb",
				text: "#111827",
				textSecondary: "#4b5563",
				border: "#e5e7eb",
			},
			{
				primary: "#187CC5",
				secondary: "#6b7280",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.ocean = new Theme(
			"Ocean",
			"Calm and refreshing",
			{
				primary: "#0ea5e9",
				secondary: "#06b6d4",
				background: "#f7fbff",
				surface: "#f0f9ff",
				text: "#082f49",
				textSecondary: "#075985",
				border: "#bae6fd",
			},
			{
				primary: "#0ea5e9",
				secondary: "#06b6d4",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.forest = new Theme(
			"Forest",
			"Natural and organic",
			{
				primary: "#22c55e",
				secondary: "#10b981",
				background: "#f8fef9",
				surface: "#f0fdf4",
				text: "#052e16",
				textSecondary: "#14532d",
				border: "#bbf7d0",
			},
			{
				primary: "#22c55e",
				secondary: "#10b981",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.sunset = new Theme(
			"Sunset",
			"Warm and vibrant",
			{
				primary: "#fb923c",
				secondary: "#f97316",
				background: "#fffaf5",
				surface: "#fff7ed",
				text: "#431407",
				textSecondary: "#9a3412",
				border: "#fdba74",
			},
			{
				primary: "#fb923c",
				secondary: "#f97316",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.rose = new Theme(
			"Rose",
			"Soft and elegant",
			{
				primary: "#f43f5e",
				secondary: "#fb7185",
				background: "#fffafb",
				surface: "#fff1f2",
				text: "#4c0519",
				textSecondary: "#881337",
				border: "#fecdd3",
			},
			{
				primary: "#f43f5e",
				secondary: "#fb7185",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);
	}
}

export default new WarmThemes();
