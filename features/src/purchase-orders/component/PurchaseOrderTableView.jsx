"use client";
import {
  Building2,
  Copy,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Phone,
  Send,
} from "lucide-react";
import { AddActionButton } from "@dragorbit/ui";
export function PurchaseOrderTableView({ model }) {
  const {
    t,
    bills,
    normalizePurchaseOrder,
    getPurchaseOrderStatus,
    openContextMenu,
    onViewDetails,
    CopyableContactValue,
    formatDate,
    formatCurrency,
    renderStatusBadge,
    enableSendMenu,
    sendMenuRefs,
    setOpenSendMenuId,
    openSendMenuId,
    handleWhatsAppShare,
    handleCopyLink,
    menuRefs,
    toggleDropdown,
    menu,
    RowActionsMenu,
    buildMenuItems,
    isLoadingMore,
    RowContextMenuLayer,
    closeMenu,
  } = model;
  return (
    <div className="h-full">
      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-[rgb(var(--color-bg-tertiary))] to-[rgb(var(--color-bg-secondary))] border-b border-[rgb(var(--color-border-primary))] sticky top-0 z-20">
        <table className="w-full min-w-[800px] table-fixed">
          <thead>
            <tr>
              <th className="w-1/6 px-6 py-4 text-left">
                <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
                  {t("purchaseOrders.poNumber")}
                </span>
              </th>
              <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
                {t("purchaseOrders.supplier")}
              </th>
              <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
                {t("purchaseOrders.orderDate")}
              </th>
              <th className="w-1/5 px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
                {t("purchaseOrders.expectedDate")}
              </th>
              <th className="w-28 px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
                {t("invoice.items")}
              </th>
              <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
                {t("purchaseOrders.advancePaid")}
              </th>
              <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
                {t("purchaseOrders.approvalStatus")}
              </th>
              <th className="w-50 py-4 text-center">{t("common.actions")}</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body */}
      <div className="overflow-auto min-h-[calc(100vh-300px)]">
        <table className="w-full min-w-[800px] table-fixed">
          <tbody className="divide-y divide-gray-100">
            {bills.map((row) => {
              const normalizedData = normalizePurchaseOrder(row);
              const poStatus = (normalizedData.status || "").toUpperCase();
              const isDeleted = poStatus === "DELETED";

              const { status, icon: StatusIcon } =
                getPurchaseOrderStatus(normalizedData);
              const hasAdvancePayments = (normalizedData.payments || []).some(
                (payment) => payment.paymentType === "ADVANCE_PAYMENT",
              );
              const hasAdvancePayment =
                normalizedData.advanceAmount > 0 || hasAdvancePayments;

              const rowId =
                normalizedData._id ||
                normalizedData.id ||
                normalizedData.billNumber;

              return (
                <tr
                  key={rowId}
                  className="group transition-all duration-200 hover:bg-[rgb(var(--color-bg-tertiary))] border-b border-[rgb(var(--color-border-primary))]"
                  onContextMenu={(event) => openContextMenu(event, rowId)}
                >
                  <td className="w-1/6 px-6 py-4">
                    <div
                      className="font-medium text-[rgb(var(--color-primary))] cursor-pointer hover:underline transition-colors decoration-2 underline-offset-4"
                      onClick={() =>
                        onViewDetails(normalizedData._id || normalizedData.id)
                      }
                    >
                      {normalizedData.billNumber}
                    </div>
                  </td>
                  <td className="w-1/6 px-6 py-4">
                    <div className="flex items-start">
                      <Building2 className="w-4 h-4 text-[rgb(var(--color-text-tertiary))] mr-2 mt-0.5" />
                      <div className="text-[rgb(var(--color-text-primary))] font-medium">
                        {normalizedData.supplier?.name ||
                          t("common.notAvailable")}
                      </div>
                    </div>

                    <div>
                      {(normalizedData.supplier?.phone ||
                        normalizedData.supplier?.email) && (
                        <div className="text-xs mt-0.5 flex items-center justify-start gap-1.5">
                          {normalizedData.supplier?.phone ? (
                            <>
                              <Phone className="w-3.5 h-3.5 text-green-500 dark:text-green-400 shrink-0" />
                              <CopyableContactValue
                                value={normalizedData.supplier.phone}
                                className="text-xs text-[rgb(var(--color-text-secondary))]"
                              />
                            </>
                          ) : (
                            <>
                              <Mail className="w-3.5 h-3.5 text-[rgb(var(--color-primary))] shrink-0" />
                              <CopyableContactValue
                                value={normalizedData.supplier?.email}
                                className="text-xs text-[rgb(var(--color-text-secondary))]"
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="w-1/6 px-6 py-4 text-[rgb(var(--color-text-secondary))]">
                    {formatDate(normalizedData.billDate)}
                  </td>
                  <td className="w-1/5 px-6 py-4 text-[rgb(var(--color-text-secondary))]">
                    {formatDate(normalizedData.dueDate)}
                  </td>
                  <td className="w-28 px-6 py-4">
                    <div className="text-sm text-[rgb(var(--color-text-primary))] font-medium">
                      {normalizedData.receivedQuantity}/
                      {normalizedData.totalQuantity || 0}
                    </div>
                    {normalizedData.totalQuantity > 0 && (
                      <div className="w-full h-1.5 bg-[rgb(var(--color-bg-tertiary))] rounded-full mt-1">
                        <div
                          className="h-full rounded-full bg-[rgb(var(--color-primary))]"
                          style={{
                            width: `${Math.min(100, Math.round((normalizedData.receivedQuantity / normalizedData.totalQuantity) * 100))}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="w-1/6 px-6 py-4 text-[rgb(var(--color-text-secondary))]">
                    {formatCurrency(normalizedData.advanceAmount)}
                  </td>
                  <td className="w-1/6 px-6 py-4">
                    {renderStatusBadge(status, "purchase-order", StatusIcon)}
                  </td>
                  <td className="w-50 py-4 text-center">
                    <div className="relative inline-flex items-center gap-2">
                      {enableSendMenu && (
                        <div
                          className="relative"
                          ref={(el) =>
                            (sendMenuRefs.current[row._id || row.id] = el)
                          }
                        >
                          <AddActionButton
                            onClick={() =>
                              setOpenSendMenuId(
                                openSendMenuId === (row._id || row.id)
                                  ? null
                                  : row._id || row.id,
                              )
                            }
                            Icon={Send}
                            label={t("common.send")}
                            size="sm"
                            title={t("common.send")}
                            className="h-9 px-3 rounded-lg"
                          />
                          {openSendMenuId === (row._id || row.id) && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-50">
                              <button
                                className="w-full px-3 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200"
                                onClick={() => handleWhatsAppShare(row)}
                              >
                                <MessageCircle className="w-4 h-4 text-green-500 dark:text-green-400" />{" "}
                                {t("common.whatsapp")}
                              </button>
                              <button className="w-full px-3 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200">
                                <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400" />{" "}
                                {t("common.email")}
                              </button>
                              <button className="w-full px-3 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200">
                                <MessageSquare className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />{" "}
                                {t("common.message")}
                              </button>
                              <div className="my-1 border-t border-[rgb(var(--color-border-primary))]" />
                              <button
                                className="w-full px-3 py-2 text-left text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200"
                                onClick={() => handleCopyLink(row)}
                              >
                                <Copy className="w-4 h-4 text-purple-500 dark:text-purple-400" />{" "}
                                {t("common.copyLink")}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        ref={(el) => (menuRefs.current[rowId] = el)}
                        className="relative inline-block"
                      >
                        <button
                          onClick={() => toggleDropdown(rowId)}
                          className="p-2 hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors duration-200 group/btn cursor-pointer"
                          title={t("common.actions")}
                        >
                          <MoreVertical className="w-4 h-4 text-[rgb(var(--color-text-secondary))] group-hover/btn:text-[rgb(var(--color-primary))]" />
                        </button>

                        {menu?.rowId === rowId && menu.mode === "dropdown" ? (
                          <RowActionsMenu
                            items={buildMenuItems(rowId)}
                            mode="dropdown"
                          />
                        ) : null}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Loading More Indicator */}
        {isLoadingMore && (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {t("purchaseOrders.loadingMore")}
            </p>
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
    </div>
  );
}
