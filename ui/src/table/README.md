# Shared table UI

## Audit: store-fe Customers, Suppliers, Products

| Page | Columns / row actions | Toolbar differences |
| --- | --- | --- |
| Customers | Name/date, balance, copyable phone/email, source, status; view, quick khata, manage khata, edit, delete | Search; status, source, balance and date filters; clear filters; view switch; gated download; import menu (customers/opening balances); create drawer |
| Suppliers | Name/GST/date, contact, paid/due account, bill count, status; view, print, edit, delete | Search; account status, risk and active filters; view switch; bulk upload; gated download; create drawer |
| Products | Image/name/brand/SKU, visibility, category, price, optional GST; view, stock-in, edit, duplicate, delete | Search; catalog visibility, category and price sort; view switch; bulk upload; create route. Current header has no download action. |

Reviewed each module's table, header and page. Sources: CustomerTable.jsx, SupplierTable.jsx, ProductTable.jsx; customer/list/CustomerListHeader.jsx, supplier/list/SupplierListHeader.jsx, page/dashboard/products/components/ProductListHeader.jsx; the shared RowActionsMenu and useRowActionMenu.

Existing ui/Table.jsx only centralizes HTML primitives; these pages still repeat their actual header/body markup. CustomerTable uses separate header and body tables; this can misalign during horizontal scrolling. Supplier/Product use a single table. Empty states and infinite-scroll orchestration also live in page/list adapters.

## Implementation

- DataTable: a single native table, shared colgroup widths, gradient sticky header, theme borders/hover, comfortable/compact density, horizontal scrolling, accessible caption/column scopes, loading/error/empty state, toolbar/footer slots.
- TableToolbar: responsive search/filter/action layout, controlled search input with ref forwarding, filter/reset slots, upload/download/create buttons, hidden/disabled/loading state, optional subscription badge and view switch slot.
- TableRowActions: permission-filtered action definitions, shared three-dot trigger, body portal to avoid clipping inside table scroll containers, Escape/outside-click dismissal and arrow/Home/End navigation.

No Redux, routing, translation, API, Excel or subscription dependencies enter this package. Parents pass translated labels, permitted actions and callbacks. Server filtering, debounce, fetching, pagination and actual uploads/exports stay in the parent. Upload opens the existing drawer; download opens the existing report drawer. Search does not filter rows internally.

The package intentionally uses Tailwind 4 classes and the existing --color-* RGB theme tokens. Set transpilePackages to include @dragorbit/ui and register the package src through @source in the consumer stylesheet (see root README). No dist build.

## Complete integration pattern

```tsx
"use client";

import { DataTable, TableToolbar, TableRowActions } from "@dragorbit/ui/table";
import type { TableColumn } from "@dragorbit/ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

type Customer = {
  id: string;
  name: string;
  phone?: string;
  isActive: boolean;
};

type Props = {
  customers: Customer[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  loading: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  canDownload: boolean;
  filters: ReactNode; // Existing Select and DateRangeFilter components.
  importMenu: ReactNode; // Existing CustomerImportMenu (multiple import types).
  viewSwitcher: ReactNode;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onDownload: () => void; // Existing withAccess-wrapped callback.
};

export function CustomerListUI(props: Props) {
  const columns: TableColumn<Customer>[] = [
    { id: "name", header: "Customer", width: "40%", cell: customer => (
      <button type="button" onClick={() => props.onView(customer.id)} className="font-semibold text-left">
        {customer.name}
      </button>
    ) },
    { id: "phone", header: "Phone", cell: customer => customer.phone || "—" },
    { id: "status", header: "Status", cell: customer => customer.isActive ? "Active" : "Inactive" },
    { id: "actions", header: "Actions", width: 72, align: "center", cell: customer => (
      <TableRowActions label={`Actions for ${customer.name}`} actions={[
        { id: "view", label: "View details", icon: Eye, onClick: () => props.onView(customer.id) },
        { id: "edit", label: "Edit", icon: Edit, hidden: !props.canEdit, onClick: () => props.onEdit(customer.id) },
        { id: "delete", label: "Delete", icon: Trash2, tone: "danger", hidden: !props.canDelete, onClick: () => props.onDelete(customer.id) },
      ]} />
    ) },
  ];

  return <DataTable
    caption="Customers"
    rows={props.customers}
    columns={columns}
    getRowKey={customer => customer.id}
    loading={props.loading}
    maxHeight="65vh"
    toolbar={<TableToolbar
      search={{ label: "Search customers", placeholder: "Search customers…", value: props.searchValue, onChange: props.setSearchValue }}
      filters={props.filters}
      actions={props.importMenu}
      viewSwitcher={props.viewSwitcher}
      download={{ label: "Download", hidden: !props.canDownload, onClick: props.onDownload }}
      create={{ label: "Add customer", hidden: !props.canCreate, onClick: props.onCreate }}
    />}
  />;
}
```

This is a minimal adapter example; production migration must retain the existing rich cell renderers (avatars, copyable contacts, dates, badges, balances). Use column.cell to return those existing components rather than copying their business logic into the package.

## Migration order and compatibility

1. Replace header layout with TableToolbar, preserving existing filter/search components through filters/searchSlot. Pass existing callbacks, refs, permission checks and drawer state unchanged.
2. Replace table markup with column definitions using the existing cell renderers. Set minWidth: customers 880, suppliers 800, products 1000. Use column.hidden for conditional GST. cellProps preserves cell clicks; rowProps preserves existing context-menu handlers.
3. Migrate three-dot actions when ready. The existing right-click context menu is not built into TableRowActions; retain the existing parent context-menu hook/layer using rowProps until that interaction has been migrated and tested. Do not silently remove it.
4. Keep existing infinite scroll observer in the app; pass its loading/footer UI through footer. Keep store-aware request deduplication/debounce and hotkeys in page adapters.

The store-fe CustomerTable and CustomerListHeader now use DataTable, TableToolbar and TableRowActions. Rich cell renderers, permission checks, filter state, import/report/create drawers and the existing right-click context menu stay in the app. Actions disable pinning with `pin: false`. CustomerListContent passes its load-more sentinel and spinner through scrollFooter so they remain inside the shared scroll region; the observer reattaches when switching table/card views. Supplier and Product pages remain on their existing implementations.

## Research

Native caption and scope=col are based on https://www.w3.org/WAI/tutorials/tables/ . Keyboard menu behavior follows https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ . Column/cell render callbacks follow the general table column-definition pattern: https://tanstack.com/table/latest/docs/guide/column-defs . A table engine dependency is not needed for this initial UI extraction; consider one when adding controlled selection, multi-column sorting, grouping or virtualization.

## Freeze columns and rows

Columns start unpinned. Toggle using the header icon; `pin: false` disables pinning:

```tsx
const columns: TableColumn<Customer>[] = [
  { id: "name", header: "Customer", width: 240, cell: row => row.name },
  { id: "phone", header: "Phone", width: 180, cell: row => row.phone || "—" },
  { id: "status", header: "Status", width: 160, cell: row => row.isActive ? "Active" : "Inactive" },
  { id: "actions", header: "Actions", width: 80, pin: false, cell: row => <button type="button" onClick={() => onView(row.id)}>View</button> },
];

<DataTable
  caption="Customers"
  columns={columns}
  rows={customers}
  getRowKey={row => row.id}
  minWidth={1100}
  maxHeight={480}
  rowPinning={{ top: ["customer-1"], bottom: ["customer-20"] }}
/>
```

- Pinned columns are grouped at the left edge; relative order within each group stays the same. Specify width for predictable space; percentage widths also work. Rendered widths are measured so multiple pinned columns do not overlap.
- Row pinning uses exact getRowKey values (number 1 and string "1" differ). Rows are grouped at top/middle/bottom, preserving source order within each group. A row listed in both groups pins to the top and renders once. Keys not present in rows are ignored; pinning does not fetch missing records.
- The column header remains sticky. Top rows stack below the measured header height; bottom rows stack above the bottom edge. Rendered row heights are measured, including wrapped content. ResizeObserver updates offsets after size changes.
- Set maxHeight to create vertical scrolling inside the table. Without a constrained height, the table normally grows with its content. Column freezing applies to horizontal scrolling; row freezing applies to vertical scrolling. Their intersection stays pinned in both directions.
- Pinned cells have opaque theme backgrounds and layer ordering to keep scrolling content behind them. Keep the total pinned widths/heights smaller than the viewport so some space remains for scrolling content.
- Loading/error/empty states do not render pinned data rows. Column pinning is local UI state; rowPinning remains a controlled prop.

## Header pin buttons

Each pinnable header has a pin icon beside its name. Click to pin to the left; click again to unpin and restore the original position. Column definitions do not need a `pin` field. `pin: false` hides the icon and prevents pinning. `pin: true` only enables pinning; it does not set pinned state. State is keyed by column ID, local to the mounted table, and does not mutate caller columns. Non-text headers can set `pinLabel` for the accessible button label.
