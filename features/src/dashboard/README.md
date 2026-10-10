# Shared dashboard feature

Both Store FE and Electron import `DashboardScreen` from `@dragorbit/features/dashboard`. The same screen owns metrics, owner/staff presentation, quick actions, cashbook, stores table and optional desktop low-stock/section-order UI.

```text
features/dashboard/
  component/
    DashboardStats.jsx       # uses generic StatCards from ui
    QuickActions.jsx         # uses generic QuickActions from ui
    CashbookSummaryCard.jsx
    StoresSummaryTable.jsx
    StaffDashboard.jsx
    LowStockCard.jsx
    DashboardSections.jsx
  screen/DashboardScreen.jsx
  hook/useDashboardData.js
  model/metrics.js
  model/actions.js
  index.js
```

`dragorbit/screens` is unchanged. Generic controls, shell, header, sidebar, themes and toast stay in `ui`/`core`. Dashboard-specific presentation is in this feature rather than `ui/components/app`.

## Platform contract

```jsx
import { DashboardScreen, createDashboardRoutes } from "@dragorbit/features/dashboard";

<DashboardScreen
  t={translate}
  repository={repository}
  storeId={storeId}
  ready={storeReady}
  isStaff={isStaff}
  permissions={staffPermissions}
  routes={createDashboardRoutes("/dashboard")}
  onNavigate={navigate}
  scope={`${userId}:${storeId}`}
  statsLayout={statsPreferences}
  actionsLayout={actionPreferences}
  onSaveStats={saveStats}
  onSaveActions={saveActions}
/>
```

`repository.getSummary({ storeId })` returns an array of store summary rows (or null for an unsuccessful read). `repository.getCashbook({ storeId })` optionally returns `{ today: { cashIn, cashOut, closingBalance } }`. The repository object and `onSummary` callback must be stable (useMemo/useCallback or module constants).

Store FE normalizes existing HTTP-service responses in its adapter. Desktop normalizes IPC responses, passes cached Redux `agencySummary` through `initialSummary`, and updates its cache through `onSummary`. The shared hook ignores late responses after store/repository changes or unmount, retains cached summary on failed loads, and clears cashbook values on store change. Summary/cashbook fetching is skipped for staff; permission-filtered staff tools render instead.

Desktop additionally passes `lowStockCount`, `layoutVariant="sectioned"`, `sectionOrder` and `onSaveSections`. Shared section UI retains the old desktop arrangement and drag behavior. Storage of section/card/action order remains in the host. Default layout retains the Store FE overview arrangement. Routes are injected: web uses `/dashboard/...`, desktop `/...`.

The feature does not import Next, TanStack Router, Redux, Axios, Electron/IPC, localStorage or application services. Platform adapters retain page-header hooks, selected-store/auth hooks, API/IPC calls, cache dispatch and inventory loading. Their only rendered dashboard element is `DashboardScreen`.

## Verification

Lightweight checks: workspace typecheck, focused lint, isolated feature browser bundle, numeric totals, route mapping, permission filtering, callback navigation, cached owner/staff/desktop-layout SSR, platform adapter syntax and consumer lockfile links. No full builds/E2E/interactive app tests were run.

Manually verify login-to-dashboard, offline cached desktop dashboard, store switches while requests are pending, cashbook card, owner/staff views, quick-action navigation, metric/action order save/reload, desktop section ordering, language changes and responsive table/layout.
