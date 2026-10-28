"use client";

import { getCatalogUrl } from "@dragorbit/core/domain";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  RowActionsMenu,
  RowContextMenuLayer,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
  useRowActionMenu,
} from "@dragorbit/ui";
import { TableRowActions } from "@dragorbit/ui/table";
import {
  BookOpen,
  Copy,
  ExternalLink,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useRef } from "react";

function CatalogStatus({ status, statuses }) {
  return (
    <Badge
      size="sm"
      variant={
        status === "ACTIVE"
          ? "success"
          : status === "SUSPENDED"
            ? "danger"
            : "secondary"
      }
    >
      {statuses.find((option) => option.value === status)?.label || status}
    </Badge>
  );
}

function catalogActions(catalog, onOpen, onDelete, onCopyLink, disabled) {
  return [
    {
      id: "view",
      label: "View details",
      icon: Eye,
      disabled,
      onClick: () => onOpen(catalog, "view"),
    },
    {
      id: "edit",
      label: "Edit",
      icon: Pencil,
      disabled,
      onClick: () => onOpen(catalog, "edit"),
    },
    {
      id: "copy",
      label: "Copy link",
      icon: Copy,
      disabled,
      onClick: () => onCopyLink(catalog),
    },
    {
      id: "open",
      label: "Open digital shop",
      icon: ExternalLink,
      disabled,
      onClick: () =>
        window.open(
          getCatalogUrl(catalog.subdomain),
          "_blank",
          "noopener,noreferrer"
        ),
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      tone: "danger",
      disabled,
      onClick: () => onDelete(catalog),
    },
  ];
}

function CatalogActions({ catalog, onOpen, onDelete, onCopyLink, disabled }) {
  return (
    <TableRowActions
      label={`Actions for ${catalog.name}`}
      actions={catalogActions(catalog, onOpen, onDelete, onCopyLink, disabled)}
    />
  );
}

export function CatalogsScreen({ model }) {
  const {
    catalogs,
    pagination,
    loading,
    loadingMore,
    error,
    search,
    searchInputRef,
    status,
    statuses,
    onSearch,
    onStatus,
    onLoadMore,
    onCopyLink,
    onRefresh,
    onCreate,
    onOpen,
    onDelete,
    storeNames,
    busy,
  } = model;
  const { menu, closeMenu, openContextMenu } = useRowActionMenu();
  const contextCatalog =
    menu?.mode === "context"
      ? catalogs.find((catalog) => catalog.id === menu.rowId)
      : null;
  const handleContextMenu = (event, catalog) => {
    event.preventDefault();
    if (!busy) openContextMenu(event, catalog.id);
  };
  useEffect(() => {
    if (busy || loading) closeMenu();
  }, [busy, loading, closeMenu]);
  const sentinel = useRef(null);
  const nextCursor = pagination?.nextCursor;
  useEffect(() => {
    if (
      !sentinel.current ||
      !nextCursor ||
      loading ||
      loadingMore ||
      error ||
      busy
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { rootMargin: "200px", threshold: 0 }
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [nextCursor, loading, loadingMore, error, busy, onLoadMore]);
  const linkedStores = (catalog) =>
    catalog.stores
      .map((id) => storeNames.get(id) || `Unavailable Store (${id})`)
      .join(", ") || "No Stores linked";
  return (
    <div className="mx-auto w-full max-w-8xl space-y-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid w-full grid-cols-1 items-end gap-3 sm:w-auto sm:flex-1 sm:grid-cols-[minmax(180px,320px)_160px_auto] lg:flex-none">
          <Input
            ref={searchInputRef}
            aria-label="Search digital shops"
            aria-keyshortcuts="Control+k Meta+k Alt+Shift+f /"
            placeholder="Search by Digital Shop name"
            leftIcon={Search}
            value={search}
            onChange={onSearch}
          />
          <Select
            placeholder="All statuses"
            value={status}
            onChange={onStatus}
            options={[{ value: "", label: "All statuses" }, ...statuses]}
          />
          <Button
            variant="outline"
            title="Refresh (Alt+R)"
            aria-keyshortcuts="Alt+r"
            leftIcon={RefreshCw}
            disabled={loading || busy}
            onClick={onRefresh}
          >
            Refresh
          </Button>
        </div>
        <Button
          leftIcon={Plus}
          title="Create digital shop (Alt+N)"
          aria-keyshortcuts="Alt+n"
          onClick={onCreate}
          disabled={busy}
          className="w-full sm:w-auto"
        >
          Create Digital Shop
        </Button>
      </header>
      {loading ? (
        <TableSkeleton label="Loading Digital Shops…" />
      ) : error && !catalogs.length ? (
        <EmptyState
          fullHeight
          type="error"
          title="Couldn't load Digital Shops"
          description={error}
          actionButton={{ label: "Try again", onClick: onRefresh }}
        />
      ) : !catalogs.length ? (
        <EmptyState
          fullHeight
          icon={BookOpen}
          title={
            search || status
              ? "No matching Digital Shops"
              : "No Digital Shops yet"
          }
          description={
            search || status
              ? "Try a different name or status filter."
              : "Create your first Digital Shop and link Stores from your Agency."
          }
          actionButton={
            search || status
              ? {
                  label: "Clear filters",
                  onClick: () => {
                    onSearch("");
                    onStatus("");
                  },
                }
              : { label: "Create Digital Shop", onClick: onCreate }
          }
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-[rgb(var(--color-border-primary))] md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">SR No</TableHead>
                  <TableHead>Digital Shop</TableHead>
                  <TableHead>Subdomain</TableHead>
                  <TableHead>Linked Stores</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catalogs.map((catalog, index) => (
                  <TableRow
                    key={catalog.id}
                    onContextMenu={(event) => handleContextMenu(event, catalog)}
                  >
                    <TableCell className="w-16 text-center tabular-nums text-[rgb(var(--color-text-secondary))]">
                      {index + 1}
                    </TableCell>
                    <TableCell className="max-w-64 !whitespace-normal">
                      <button
                        type="button"
                        className="break-words text-left font-medium hover:underline"
                        onClick={() => onOpen(catalog, "view")}
                        disabled={busy}
                      >
                        {catalog.name}
                      </button>
                      <p className="mt-1 text-xs text-[rgb(var(--color-text-tertiary))]">
                        {catalog.catalogId}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-56 !whitespace-normal break-all">
                      {catalog.subdomain}
                    </TableCell>
                    <TableCell className="max-w-72 !whitespace-normal">
                      <p className="break-words">{linkedStores(catalog)}</p>
                      <p className="mt-1 text-xs text-[rgb(var(--color-text-tertiary))]">
                        {catalog.stores.length} Stores
                        {catalog.defaultStore
                          ? ` · Default: ${storeNames.get(catalog.defaultStore) || "Unavailable Store"}`
                          : ""}
                      </p>
                    </TableCell>
                    <TableCell>
                      <CatalogStatus
                        status={catalog.status}
                        statuses={statuses}
                      />
                    </TableCell>
                    <TableCell>
                      <CatalogActions
                        catalog={catalog}
                        onOpen={onOpen}
                        onDelete={onDelete}
                        onCopyLink={onCopyLink}
                        disabled={busy}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-3 md:hidden">
            {catalogs.map((catalog, index) => (
              <article
                key={catalog.id}
                onContextMenu={(event) => handleContextMenu(event, catalog)}
                className="min-w-0 space-y-3 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-xs font-semibold tabular-nums text-[rgb(var(--color-text-tertiary))]">
                      #{index + 1}
                    </span>
                    <h2 className="min-w-0 break-words text-base font-semibold text-[rgb(var(--color-text-primary))]">
                      {catalog.name}
                    </h2>
                  </div>
                  <CatalogStatus status={catalog.status} statuses={statuses} />
                </div>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-xs text-[rgb(var(--color-text-tertiary))]">
                      Subdomain
                    </dt>
                    <dd className="break-all text-[rgb(var(--color-text-primary))]">
                      {catalog.subdomain}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[rgb(var(--color-text-tertiary))]">
                      Linked Stores ({catalog.stores.length})
                    </dt>
                    <dd className="break-words text-[rgb(var(--color-text-primary))]">
                      {linkedStores(catalog)}
                    </dd>
                  </div>
                </dl>
                <CatalogActions
                  catalog={catalog}
                  onOpen={onOpen}
                  onDelete={onDelete}
                  onCopyLink={onCopyLink}
                  disabled={busy}
                />
              </article>
            ))}
          </div>
          <div
            ref={sentinel}
            className="min-h-16 text-center text-sm text-[rgb(var(--color-text-secondary))]"
            aria-live="polite"
          >
            {loadingMore ? (
              <TableSkeleton
                compact
                rows={2}
                label="Loading more digital shops…"
              />
            ) : error ? (
              <div role="alert" className="space-y-3 py-4">
                <p>{error}</p>
                <Button variant="outline" onClick={onLoadMore}>
                  Retry loading more
                </Button>
              </div>
            ) : pagination?.hasNextPage ? (
              <Button variant="outline" onClick={onLoadMore} disabled={busy}>
                Load more shops
              </Button>
            ) : (
              <p className="py-4">All {catalogs.length} digital shops loaded</p>
            )}
          </div>
        </>
      )}
      <RowContextMenuLayer
        open={!!contextCatalog && !busy && !loading}
        onClose={closeMenu}
      />
      {contextCatalog && !busy && !loading && (
        <RowActionsMenu
          mode="context"
          anchorPoint={{ x: menu.x, y: menu.y }}
          items={catalogActions(
            contextCatalog,
            onOpen,
            onDelete,
            onCopyLink,
            false
          ).map(({ id, onClick, ...action }) => ({
            ...action,
            key: id,
            onClick: () => {
              closeMenu();
              onClick();
            },
          }))}
        />
      )}
    </div>
  );
}
