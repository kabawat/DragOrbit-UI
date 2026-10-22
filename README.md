# DragOrbit workspace

One Git repository with four Yarn 1 workspaces. Generic UI is in `ui/`, pure theme/API helpers are in `core/`, and the shared dashboard feature is in `features/dashboard/`. `screens/` remains unchanged as a foundation.

```text
ui/        @dragorbit/ui        Existing UI, table and legacy exports
core/      @dragorbit/core      Shared pure themes/colors and rules/contracts
features/  @dragorbit/features  Feature-owned screens/components/models (dashboard)
screens/   @dragorbit/screens   Foundation only; dashboard stays inside its feature
```

Root owns the development tooling and one `yarn.lock`. Run installation from the root. Each package declares its own runtime dependencies; React/React DOM are peers in React packages. Core has no React dependency. UI is consumed directly from TS/JSX source; no dist build is required today.

The public import names remain unchanged: `@dragorbit/ui`, `@dragorbit/ui/table`, `@dragorbit/ui/legacy`. Consumers link to `dragorbit/ui`, never the workspace root. Nested checkouts under `dragbizz-web/` use `link:../../dragorbit/ui` and their corresponding deeper Tailwind source path.

## Verification after workspace migration

Lightweight aggregate typecheck: `yarn typecheck`. Per-package: `yarn workspace @dragorbit/ui typecheck` (also core/features/screens).

Current consumers are Store FE and catalog, including nested checkouts. Desktop does not currently depend on dragorbit; connecting it and centralizing login are later steps.

Full builds/UI checks are intentionally left to the user:

1. Run `yarn install` at dragorbit root, then in each actual consumer checkout to refresh its installed link.
2. Run Store FE and catalog production builds from their own folders.
3. Check Store FE customer/product/category/brand/variant tables, toolbar and action menus.
4. Check catalog Button, modal/quick-view/cart and legacy Input/Select/Card styling.
5. Restart running development servers after paths change. Check one React identity per renderer; local linked sources can resolve root development React differently from the host.

Shared migration adds no Electron/native/database imports. No heavy builds or live database/sync tests are part of this step.

## Development

```sh
cd dragorbit
yarn install
yarn typecheck
```

## Button

```tsx
import { Button } from "@dragorbit/ui";
import { Plus } from "lucide-react";

<Button variant="primary" size="sm" leftIcon={Plus} loading={saving} onClick={save}>
  Save
</Button>
```

Matches store-fe Button: default primary/sm, eight variants, five sizes, leftIcon/rightIcon component props, fullWidth, loading and legacy isLoading. Native button props and React 19 refs are forwarded. Classes retain the existing concatenation order; className is appended, not merged with tailwind-merge.

## Connect a Next.js + Tailwind 4 app (Yarn 1)

From dragbizz-store-fe, install a live local link:

```sh
yarn add @dragorbit/ui@link:../dragorbit/ui
```

Run yarn install in dragorbit first: Yarn 1 link dependencies do not install the linked package dependencies for you. Both folders must be available in development and deployment.

Add the following property to the existing nextConfig object, preserving other settings:

```js
transpilePackages: ["@dragorbit/ui"],
```

In src/app/globals.css, add this after the existing CSS imports:

```css
@source "../../../dragorbit/ui/src";
```

This path is relative to src/app/globals.css. Tailwind must scan the package because the utility classes now live outside the app source. No component CSS Module or separate global package stylesheet is needed. Next.js handles TSX compilation; Tailwind generates the utilities. Restart the app after changing dependency/configuration.

Once connected, the existing src/components/ui/Button.jsx can become:

```jsx
"use client";
export { Button as default } from "@dragorbit/ui";
```

That preserves existing imports while sharing the package implementation.

## Theme requirements

The Button intentionally preserves the existing store-fe theme variables. Other apps must define RGB channel values (e.g. --color-primary: 24 124 197) for:

- --color-primary
- --color-secondary
- --color-bg-tertiary
- --color-bg-secondary
- --color-text-primary
- --color-border-primary

store-fe already defines these in src/styles/themes.css.

The legacy btn-ripple class is retained for compatibility, but no definition was found in store-fe/src, so it does not currently supply a ripple animation.

Button.module.css is the earlier prototype and is no longer imported by the Tailwind Button.

## Reusable UI and Store FE dashboard

See [ui/README.md](ui/README.md) for modal/drawer, editable stat/action rows, feedback/controls APIs, save contract and manual verification steps. Login migration is still a separate step.

## Central themes and colors

Store FE and Desktop now consume `@dragorbit/core/themes` and `@dragorbit/core/themes.css`. See [core/README.md](core/README.md) for ownership, usage and manual verification. Theme preference providers/storage remain in each host.

## Dashboard feature

Both applications import `DashboardScreen` from `@dragorbit/features/dashboard`. Feature views are in `features/dashboard/component`, screen in `features/dashboard/screen`, shared data orchestration in `hook`, and metrics/actions in `model`. Hosts inject HTTP/IPC repositories, route callbacks, cache and layout persistence. See [feature contract](features/dashboard/README.md). Generic stats/actions/table controls stay in `ui`; dashboard-specific views were moved out of `ui/components/app`.
