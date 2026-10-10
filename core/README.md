# Shared core: themes and colors

`@dragorbit/core/themes` owns all 22 palettes, light/dark variants, preference-key metadata and pure color-to-CSS-token mapping. `@dragorbit/core/themes.css` owns the baseline/status/gradient/glass design tokens. Core has no React, database, browser-storage or DOM dependency at import time.

```js
import { themes, getThemeTokens, hexToRgbSpace } from '@dragorbit/core/themes';
const { themeName, variant, colors, variables } = getThemeTokens('ocean', 'dark');
// variables contains RGB channel strings such as '--color-primary': '59 130 246'.
```

```css
@import '@dragorbit/core/themes.css';
```

`createThemeBootstrapScript()` produces a script string for early browser initialization; it does not execute it or read browser globals in core. Store FE's script adapter renders it. HTML opening brackets in generated JSON are escaped; persisted values only select valid theme/variant keys. Runtime helpers and early initialization use the same token resolver.

Store FE and Desktop keep their own providers, Redux/local state, preference storage and DOM adapters. Existing `dragbizz-theme` / `dragbizz-variant` keys and theme IDs remain compatible. App-specific dark-mode selectors remain host-owned. Desktop's UI package declares core as a direct dependency; the desktop renderer also declares it for CSS imports.

Current installations have their local core links refreshed. On another checkout, run the consumer's normal install to apply manifest/lockfile links. The shared repo uses its root workspace install. Native Electron rebuilds are not needed for a pure theme change.

Lightweight checks: core typecheck, 22 palettes in both modes, RGB conversion, malformed-preference fallback, bootstrap parity, blocked-storage initialization, consumer module resolution and CSS/source bundling. Full application builds were not run.

Manual checks: change every required theme/light-dark mode in Store FE and Desktop, reload/restart, verify early paint and shared modal/table/cards/input colors, and check an existing saved preference still restores. Run production builds when ready; check packaged Desktop assets as part of your normal release validation.

## API helpers

`@dragorbit/core/api` provides transport-injected `HttpService`, query serialization and HTTP/message/error helpers. Browsers/Next/Vite import native ESM from `src/api/index.js`. Electron main requires the generated `src/api/runtime.cjs`. Edit only `index.js`, then run `yarn build:api` in this package to refresh CommonJS; packaging also regenerates it. Neither browser entry nor API helpers depend on CommonJS interop or platform globals. Authentication, base URL, IPC/local database, upload/native behavior, retry policy and UI presentation remain host-owned. See `fe/docs/store-fe-api-flow.md` in the workspace for the traced flow and actual adapters.
