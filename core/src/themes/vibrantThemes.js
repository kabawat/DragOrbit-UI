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

class VibrantThemes {
	constructor() {
		this.amber = new Theme(
			"Amber",
			"Warm and friendly",
			{
				primary: "#f59e0b",
				secondary: "#fbbf24",
				background: "#fffdf0",
				surface: "#fffbeb",
				text: "#451a03",
				textSecondary: "#78350f",
				border: "#fef3c7",
			},
			{
				primary: "#f59e0b",
				secondary: "#fbbf24",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.coral = new Theme(
			"Coral",
			"Vibrant and energetic",
			{
				primary: "#ef4444",
				secondary: "#f87171",
				background: "#fff9f9",
				surface: "#fff1f2",
				text: "#450a0a",
				textSecondary: "#991b1b",
				border: "#fee2e2",
			},
			{
				primary: "#ef4444",
				secondary: "#f87171",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.pink = new Theme(
			"Pink",
			"Soft and feminine",
			{
				primary: "#ec4899",
				secondary: "#f472b6",
				background: "#fff9fc",
				surface: "#fdf2f8",
				text: "#500724",
				textSecondary: "#9f1239",
				border: "#fce7f3",
			},
			{
				primary: "#ec4899",
				secondary: "#f472b6",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);
	}
}

export default new VibrantThemes();
