# DragOrbit setup

## Step: 1 — Requirements

Requires Node.js and Yarn 1.22.22.

## Step: 2 — Install dependencies

Install from the workspace root:

```bash
yarn install
```

## Step: 3 — Link consumer packages

Link the required package folders from the consumer, for example `link:../dragorbit/ui`. Run `yarn install` in that consumer too.

## Step: 4 — Configure the consumer

In Next.js consumers, add the imported packages to `transpilePackages`. Configure Tailwind to scan the linked source and import the required theme CSS.

## Step: 5 — Run checks

Check changes:

```bash
yarn typecheck
```

When API helpers change, regenerate the CommonJS entry:

```bash
yarn workspace @dragorbit/core build:api
```

Build and check the affected consumer application after shared UI changes.
