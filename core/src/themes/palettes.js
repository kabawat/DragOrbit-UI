import warmThemes from "./warmThemes.js";
import coolThemes from "./coolThemes.js";
import greenThemes from "./greenThemes.js";
import vibrantThemes from "./vibrantThemes.js";
import neutralThemes from "./neutralThemes.js";

export const themes = {
	// Warm Themes
	default: warmThemes.default,
	ocean: warmThemes.ocean,
	forest: warmThemes.forest,
	sunset: warmThemes.sunset,
	rose: warmThemes.rose,

	// Cool Themes
	violet: coolThemes.violet,
	indigo: coolThemes.indigo,
	purple: coolThemes.purple,
	blue: coolThemes.blue,
	sapphire: coolThemes.sapphire,
	midnight: coolThemes.midnight,

	// Green Themes
	emerald: greenThemes.emerald,
	green: greenThemes.green,
	teal: greenThemes.teal,
	lime: greenThemes.lime,

	// Vibrant Themes
	amber: vibrantThemes.amber,
	coral: vibrantThemes.coral,
	pink: vibrantThemes.pink,

	// Neutral Themes
	sky: neutralThemes.sky,
	cyan: neutralThemes.cyan,
	slate: neutralThemes.slate,
	zinc: neutralThemes.zinc,
};

export { warmThemes, coolThemes, greenThemes, vibrantThemes, neutralThemes };
