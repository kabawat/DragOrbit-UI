"use client";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Mail,
  MoreVertical,
  Shield,
} from "lucide-react";
export function StaffCardView({ model }) {
  const {
    isBusy,
    openContextMenu,
    rowId,
    isTempStaff,
    staff,
    initials,
    CopyableContactValue,
    statusInfo,
    isRemoving,
    StatusIcon,
    setShowPermissions,
    showPermissions,
    activeModules,
    menuRefs,
    isOnline,
    toggleDropdown,
    menu,
    RowActionsMenu,
    buildActionItems,
    MODULE_LABELS,
    ACTION_LABELS,
    RowContextMenuLayer,
    closeMenu,
  } = model;
  return (
    <div
      className={`bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary)/0.3)] rounded-xl transition-all ${isBusy ? "opacity-50 pointer-events-none" : "border-[rgb(var(--color-border-primary))]"}`}
      onContextMenu={(event) => openContextMenu(event, rowId)}
    >
      {isTempStaff && (
        <div className="px-4 pt-2.5 pb-0 flex items-center gap-1.5">
          <Mail size={11} className="text-yellow-500" />
          <span className="text-[0.625rem] font-medium text-yellow-500 uppercase tracking-wide">
            Invitation Pending · Expires{" "}
            {new Date(staff.expiresAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        </div>
      )}

      <div className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[rgba(var(--color-primary),0.15)] flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-[rgb(var(--color-primary))]">
            {initials}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))] truncate">
              {staff.name}
            </p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(var(--color-primary),0.1)] text-[rgb(var(--color-primary))] font-medium">
              {staff.roleName}
            </span>
          </div>
          <CopyableContactValue
            value={staff.email}
            className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5"
          />
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusInfo.bg} flex-shrink-0`}
        >
          {isRemoving ? (
            <Loader2 size={12} className="animate-spin text-red-500" />
          ) : (
            <StatusIcon size={12} className={statusInfo.color} />
          )}
          <span className={`text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowPermissions(!showPermissions)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-xl text-xs text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-primary))]/50 transition-all flex-shrink-0"
        >
          <Shield size={12} />
          <span>{activeModules} modules</span>
          {showPermissions ? (
            <ChevronUp size={12} />
          ) : (
            <ChevronDown size={12} />
          )}
        </button>

        {staff.status !== "REMOVED" && (
          <div
            className="relative flex-shrink-0"
            ref={(el) => {
              menuRefs.current[rowId] = el;
            }}
          >
            <button
              type="button"
              onClick={() => isOnline && toggleDropdown(rowId)}
              disabled={!isOnline}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title={!isOnline ? "Internet required" : undefined}
            >
              <MoreVertical size={16} />
            </button>

            {menu?.rowId === rowId && menu.mode === "dropdown" ? (
              <RowActionsMenu
                items={buildActionItems()}
                mode="dropdown"
                className="w-48"
              />
            ) : null}
          </div>
        )}
      </div>

      {showPermissions && staff.permissions?.length > 0 && (
        <div className="border-t border-[rgb(var(--color-border-primary))] px-4 pb-4 pt-3">
          <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))] mb-3 uppercase tracking-wide">
            Module Permissions
          </p>
          <div className="grid gap-2">
            {staff.permissions.map((perm) => (
              <div key={perm.module} className="flex items-center gap-3">
                <span className="text-xs font-medium text-[rgb(var(--color-text-primary))] w-28 flex-shrink-0">
                  {MODULE_LABELS[perm.module] || perm.module}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ACTION_LABELS.map((action) => (
                    <span
                      key={action}
                      className={`text-[0.625rem] px-2 py-0.5 rounded-full font-medium capitalize ${
                        perm[action]
                          ? "bg-green-500/10 text-green-600"
                          : "bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] opacity-40"
                      }`}
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RowContextMenuLayer
        open={menu?.mode === "context"}
        onClose={closeMenu}
      />

      {menu?.mode === "context" ? (
        <RowActionsMenu
          items={buildActionItems()}
          mode="context"
          anchorPoint={{ x: menu.x, y: menu.y }}
        />
      ) : null}
    </div>
  );
}
