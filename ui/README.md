# Shared UI

React renderer components for Next.js/browser and Electron. No API, routing, Redux, database, filesystem or persistence imports. Hosts provide labels, values, callbacks and design-token CSS. Existing `/table` and `/legacy` imports remain supported.

## Exports

- `Modal`, `ModalHeader`, `ModalBody`, `ModalFooter`: portal, nested focus/scroll lock, Escape/outside-close options; optional dragging/resizing. `labelledBy` can target an existing title; otherwise an accessible title ID/label is generated.
- `SlideDrawer` (also `SideDrawer`): the same modal base, right placement, responsive width, optional download/header actions. Legacy drawer imports delegate to it.
- `StatCard`: `data: { title, logo, value, onClick }`; `onclick` is also supported. `logo` is an icon component; optional `iconColor`, `change`, `changeType`, `loading`.
- `StatCards` (also `StatCardRow`): array of stat data with stable unique `id`; `maxCol` defaults to 5.
- `QuickAction`, `QuickActions`: action data with stable `id`, `title`, optional icon `logo`, `onClick`, `primary`, `disabled`. Callbacks own navigation.
- `EmptyState` (also `EmptyScreen`), `PageLoader`, `Loading`, `Spinner`, skeleton/progress components: shared presentation, preserving existing Store FE behavior/styles.
- `Button`, `Input`, `Select`: existing control APIs. Input/Select `onChange` receives the value, not a browser event. Input has a functional accessible password toggle.

## Editable card/action rows

```jsx
import { StatCards, QuickActions } from '@dragorbit/ui';
import { IndianRupee, Plus } from 'lucide-react';

<StatCards
  data={[{ id: 'revenue', title: 'Total revenue', logo: IndianRupee,
    value: '₹12,000', onClick: openRevenue }]}
  maxCol={5}
  layout={savedStatsLayout}
  onSave={saveStatsLayout}
/>

<QuickActions
  title="Quick actions"
  data={[{ id: 'add-product', title: 'Add product', logo: Plus,
    onClick: openProductForm }]}
  layout={savedActionLayout}
  onSave={saveActionLayout}
/>
```

`layout` and `onSave` work for both collections:

```ts
type GridLayout = {
  order: string[];
  columns: number;
  widthPercent: number;
  minHeight: number;
};
```

Drag ordering is enabled directly, without Edit/Save/Cancel controls. Drag from anywhere on a card: a floating copy follows the pointer and the grid reorders live. Dropping a changed order automatically calls `onSave(layout)`; keyboard arrow reordering also auto-saves. A normal click still performs the card action; a drag suppresses navigation. Escape/pointer cancellation restores the pre-gesture order without saving. Set `reorderable={false}` only when a consumer explicitly needs a static collection.

There are no resize controls. Collections fill available width, grow naturally and adapt columns up to `maxCol`; old saved resize values are ignored. Stable IDs preserve order through data refresh and new items append. The async save callback locks further reordering until it resolves; failures retain the order with an error message. Without a callback the component manages order locally for its mounted lifetime.

No localStorage or platform detection exists in these components. Store FE persists per-user/per-store preferences in its `useDashboardLayout` hook. Electron can save the same shape through IPC/settings storage later. Consumers remount rows by account/store scope to discard stale drafts.

## Store FE integration

Dashboard uses shared StatCards/QuickActions. Both collections are directly draggable and automatically persist on drop. Store wrappers for Button, Input, Select, EmptyState, Loading and SideDrawer reuse shared exports. Modal wrapper retains Store FE size/content-padding compatibility. PageLoader wrapper supplies translated loading text. Existing form drawers therefore exercise the common SlideDrawer.

Persistence keys: `dragbizz:dashboard-layout:v1:<user>:<store>:stats|actions`. Only presentation preferences are saved. Existing `dashboard-metrics-order` is read as a fallback until the first scoped save.

## Lightweight verification / manual checks

Typecheck, changed Store FE file checks, UI-source bundling and SSR smoke checks were run. SSR checks included controls/feedback, closed overlays, edit/read row rendering and invalid/stale layout normalization. Full builds and browser interaction checks were intentionally not run.

Please manually verify:

1. Dashboard: drag from any part of a card, verify the floating card follows the pointer, drop and reload to confirm automatic persistence. Normal quick-action clicks must still navigate; dragging must not navigate. Test keyboard reorder and Escape cancellation.
2. Switch store/user: preferences stay scoped. Simulate blocked browser storage: automatic persistence shows an error and retains the reordered cards.
3. Mobile/narrow desktop: rows fit without horizontal clipping and card text wraps.
4. Open category/product form drawers: scroll/footer, drag/resize, Escape/outside-close setting, nested modal, focus restoration and Select search/keyboard behavior.
5. Input/Select/Button, password toggle, loading/empty screens in existing flows.
6. Store FE and existing catalog production builds; existing modal/table/legacy exports stay compatible.

Modal/drawer focus and real pointer gestures require browser testing; SSR/typecheck does not certify them.

## Shared color tokens

Hosts can import `@dragorbit/core/themes.css` and use `getThemeTokens` from `@dragorbit/core/themes` in their own DOM/storage adapters. Store FE and Desktop now do this; the UI package continues to consume `--color-*` variables without owning preference persistence.

## Extended reusable controls

Store FE's reusable UI now lives in `ui/src/components/common/`: cards, badges, tables, accordion/tabs, alert/toast, dropdown/multiselect/tag input, textarea/phone input, pagination/step progress, checkbox/file picker, calendar filters, menus, settings view and confirmation/upgrade presentation. Existing app imports are compatibility adapters.

For theme/translation-sensitive controls, pass `t`, `locale`, `currentVariant` or `themeConfig` as documented by each component's props. SettingsPanel/SettingsDrawer receive `theme`, `t`, `locale`, `localeNames`, `changeLanguage` and `isAuthenticated`; callbacks own theme/language changes. ConfirmDialog receives action callbacks, not an auth service. UpgradeModal receives `onUpgrade`, not a router. FileUpload picks files and calls callbacks; it does not send uploads to a backend. NetworkError optionally accepts `offline` for a platform-owned network status.

Use `import RichTextEditor from '@dragorbit/ui/rich-text'` for the optional editor and declare DOMPurify in that consumer. It is intentionally absent from the root barrel, keeping base UI consumers independent of that dependency. Pure date/phone helpers live in core; DOM placement stays in the `/date-range` UI entry.

The Store FE UI README lists the remaining service-backed host adapters and manual checks. Core/UI packages contain no app-alias, Next routing, API service, Redux or preference-storage imports.

### Sidebar menu

`SidebarMenu`, `SidebarHeader`, `SidebarNavItem`, and `SidebarFlyout` are platform-independent presentation components. Store FE's `components/dashboard/sidebar/index.jsx` supplies its translated, permission-filtered menu, Next router callbacks, and Redux state. StoreSelector stays in the application.

```jsx
import { SidebarMenu, SidebarHeader } from "@dragorbit/ui";

<SidebarMenu
  navigationItems={items}
  bottomItems={bottomItems}
  pathname={activePath}
  isCollapsed={collapsed}
  expandedMenus={expandedMenus}
  onToggleMenu={key => setExpandedMenus(old => ({ ...old, [key]: !old[key] }))}
  onNavigate={item => navigate(item.href)}
  isItemLocked={item => Boolean(item.locked)}
  header={<SidebarHeader title="My Store" isCollapsed={collapsed}
    onToggle={() => setCollapsed(value => !value)} />}
  selector={<YourStoreSelector />}
/>
```

Items use `{ key, name, icon, href, shortcut?, hasSubMenu?, subMenuItems? }`; child items may supply `group` labels. Icons are React components. Application-specific metadata is passed unchanged to `onNavigate`/`isItemLocked`. `expandedMenus` and collapsed state are controlled; automatic active-route expansion belongs in the host. `onNavigate` is used for both regular and flyout links; when omitted, anchors follow `href` normally. Electron can inject its own router callback without Next or Redux dependencies. Header/selector are optional slots; widths default to 256/64 and can be set with `expandedWidth`/`collapsedWidth`, with `className` and `navigationLabel` overrides. Mobile visibility/drawer presentation remains the host layout's responsibility.

Manual checks: collapse/expand, nested groups and active routes, flyout mouse travel and scrolling, subscription locks for regular AND flyout navigation, staff permissions, store switching, and existing mobile sidebar behavior.

### Common application header

`AppHeader` and `HeaderTitle` are available from `@dragorbit/ui/header` (also the main barrel). Both Store FE and Desktop use this shared presentation. The header has responsive wrapping and supports rich React descriptions without wrapping them in a paragraph.

```jsx
import { AppHeader } from "@dragorbit/ui/header";
<AppHeader
  title="Dashboard"
  description="Store overview"
  leading={<YourMenuButton />}
  actions={<><YourSettingsButton /><YourNotificationBell /><YourUserProfile /></>}
/>
```

`titleContent` can replace the title area; `className` customizes the header. Translation fallbacks, page header context, auth/logout, notifications, settings and desktop network state belong to each host and are injected as props/slots. No Next, Electron, router, Redux or persistence dependency exists in the shared header. Desktop imports only the header subpath and Vite deduplicates React/React DOM to use renderer instances; its Tailwind stylesheet scans Dragorbit UI sources.

Manual checks: page title changes, rich description, narrow window wrapping, profile dropdown/logout, notifications and settings; on desktop also verify network indicator. Full production builds are left for the application maintainer.

### Root to dashboard shared UI

Import `@dragorbit/ui/app` for the platform-free dashboard views and React contexts:

- `DashboardShell`: sidebar/header/content/overlay slots, standalone payment view.
- `StartupLoader`, `AppErrorBoundary`, `AccessRestricted`: startup and recovery presentation. Error logging, reload, navigation and upgrade actions are injected.
- `StoreSelector`, `UserProfileMenu`, `NotificationBell`, `ActivityNotification`: UI and dropdown/timer interactions; host controllers supply stores, profile, notification appearance and callbacks.
- Dashboard-specific views (`StoresSummaryTable`, `CashbookSummaryCard`, `StaffDashboard`) now live in `@dragorbit/features/dashboard`, under `features/dashboard/component`, and are composed by `DashboardScreen`.
- `SubscriptionNotice`, `ForcePasswordForm`: dialogs/form presentation. Hosts supply translated text, subscription navigation and password submit callbacks; the form expects `{ success, message? }` from `onSubmit` and uses the shared non-dismissible Modal.
- `HeaderProvider/useHeader`, `ThemeProvider/useTheme`, `ToastProvider/useGlobalToast`: shared React contexts with existing consumer APIs. Theme receives initial values and `onApply(name, variant)`; toast receives optional `normalizeMessage` and `shouldShowError`. Storage, Redux and domain error suppression are implemented by host adapters. Toast timers are cleared on removal/unmount.

Store FE and Desktop now both consume the shell, header context, sidebar, store-selector view, profile menu, notification UI, stat cards, quick actions, settings, toast presentation/state, theme state, staff cards, cashbook card and stores-summary table. Desktop retains its extra low-stock card, network/sync UI and section ordering. Stat/action order preferences remain host-owned and are scoped to user/store with legacy metric-order fallback. The desktop dashboard copy script skips migrated view adapters.

Auth/session verification, selected-store persistence, profile hydration, permissions, API/IPC, local database, sync, FCM/socket event ingestion, geolocation, voice capture and routing remain in each application. No shared mega-provider or platform bootstrap was introduced. The optional password form is integrated in Store FE; Desktop can use it with its own password workflow.

Validation performed: shared workspace type check, targeted lint, in-memory SSR fixtures and provider-context checks, recovery callbacks, changed host syntax checks, desktop module resolution, isolated shared browser bundle, and lockfile parsing. Full builds and interactive app tests were not run.

Manual acceptance checks:

1. Login/session bootstrap, onboarding redirects and first dashboard on both apps; desktop offline startup must still work.
2. Sidebar expand/collapse, flyout, staff filtering, subscription locks and active route.
3. Switch stores: web keeps its reload behavior; desktop keeps local active-store persistence and store-change event handling.
4. Profile actions/logout, notification click/read-all, new activity replacement/hover pause and settings/language/theme changes.
5. Drag stat cards and quick actions from anywhere on a card, click actions normally, reload and switch user/store to check saved layouts. No resize/edit/save controls are introduced.
6. Summary empty/loading rows, cashbook values, staff dashboard, quota/upgrade/info popups and mandatory password submission.
7. Narrow-window layout, payment standalone view, and recovery buttons after a render error.

Dashboard screen/model/loading orchestration and related views have moved to `features/dashboard`. Import `DashboardScreen` from `@dragorbit/features/dashboard`; `ui` retains generic controls and app-shell components. See `features/dashboard/README.md` for the repository and navigation adapter contract.
