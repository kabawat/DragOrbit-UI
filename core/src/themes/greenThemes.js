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

class GreenThemes {
	constructor() {
		this.emerald = new Theme(
			"Emerald",
			"Fresh and natural",
			{
				primary: "#10b981",
				secondary: "#34d399",
				background: "#f0fdf9",
				surface: "#ecfdf5",
				text: "#064e3b",
				textSecondary: "#065f46",
				border: "#d1fae5",
			},
			{
				primary: "#10b981",
				secondary: "#34d399",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.green = new Theme(
			"Green",
			"Calm and peaceful",
			{
				primary: "#22c55e",
				secondary: "#4ade80",
				background: "#f7fff9",
				surface: "#f0fdf4",
				text: "#052e16",
				textSecondary: "#14532d",
				border: "#dcfce7",
			},
			{
				primary: "#22c55e",
				secondary: "#4ade80",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.teal = new Theme(
			"Teal",
			"Fresh and crisp",
			{
				primary: "#4fd1c5",
				secondary: "#2dd4bf",
				background: "#f0fdfa",
				surface: "#f0fdfa",
				text: "#042f2e",
				textSecondary: "#134e4a",
				border: "#ccfbf1",
			},
			{
				primary: "#4fd1c5",
				secondary: "#2dd4bf",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);

		this.lime = new Theme(
			"Lime",
			"Fresh and zesty",
			{
				primary: "#84cc16",
				secondary: "#a3e635",
				background: "#fdfdf0",
				surface: "#f7fee7",
				text: "#1a2e05",
				textSecondary: "#365314",
				border: "#ecfccb",
			},
			{
				primary: "#84cc16",
				secondary: "#a3e635",
				background: "#09090b",
				surface: "#121212",
				text: "#f9fafb",
				textSecondary: "#d1d5db",
				border: "#1e1e20",
			},
		);
	}
}

export default new GreenThemes();
