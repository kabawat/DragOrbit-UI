"use client";
import { TableSkeleton } from "@dragorbit/ui";
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
              payments.map((payment, index) => (
                <PaymentTableRow
                  key={payment._id || payment.id}
                  payment={payment}
                  rowNumber={index + 1}
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
          <TableSkeleton compact rows={2} />
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
