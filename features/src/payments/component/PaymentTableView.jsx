"use client";
export function PaymentTableView({ model }) {
  const {
    PaymentTableHeader,
    payments,
    PaymentTableRow,
    menuRefs,
    menu,
    toggleDropdown,
    openContextMenu,
    buildMenuItems,
    canEdit,
    canDelete,
    isLoadingMore,
    t,
    RowContextMenuLayer,
    closeMenu,
    RowActionsMenu,
  } = model;
  return (
    <>
      <PaymentTableHeader />

      <div className="overflow-auto min-h-[calc(100vh-400px)]">
        <table className="w-full min-w-[1000px] table-fixed">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {payments &&
              payments.map((payment) => (
                <PaymentTableRow
                  key={payment._id || payment.id}
                  payment={payment}
                  menuRefs={menuRefs}
                  menu={menu}
                  toggleDropdown={toggleDropdown}
                  openContextMenu={openContextMenu}
                  buildMenuItems={buildMenuItems}
                  canEdit={canEdit}
                  canDelete={canDelete}
                />
              ))}
          </tbody>
        </table>

        {isLoadingMore && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[rgb(var(--color-primary))]"></div>
              <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                {t("payments.loadingMore", {
                  defaultValue: "Loading more payments...",
                })}
              </span>
            </div>
          </div>
        )}
      </div>

      <RowContextMenuLayer
        open={menu?.mode === "context"}
        onClose={closeMenu}
      />
      {menu?.mode === "context" ? (
        <RowActionsMenu
          mode="context"
          anchorPoint={{ x: menu.x, y: menu.y }}
          items={buildMenuItems(menu.rowId)}
          className="w-48"
        />
      ) : null}
    </>
  );
}
