# Shared features

## Feature imports

A single wildcard export supports every feature. No per-feature package.json entry is required.

```text
features/src/<feature>/
  component/
  screen/
  index.js       # Runtime public exports
  exports.ts     # Type entry; re-export index.js and feature contracts
```

Import `@dragorbit/features/dashboard`, `@dragorbit/features/customer`, etc. Each feature owns its public index; consumers should import from its feature entry. `exports.ts` follows this convention:

```ts
export * from "./index.js";
// Optional: export type { FeatureProps } from "./contracts";
```

The root aggregate barrel remains optional; app code should prefer direct feature imports. Adding a new feature only requires its folder and entry files.
