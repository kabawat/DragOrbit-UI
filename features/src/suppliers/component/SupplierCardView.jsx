"use client";
import { Building, Mail, Phone } from "lucide-react";
export function SupplierCardView({ model }) {
  const {
    className,
    props,
    menuRefs,
    supplier,
    IconButton,
    toggleDropdown,
    menu,
    RowActionsMenu,
    buildMenuItems,
    themeConfig,
    t,
    CopyableContactValue,
  } = model;
  return (
    <div
      className={`w-full max-w-sm mx-auto rounded-xl border border-[rgb(var(--color-border-primary))] transition-all duration-300 ease-out group overflow-hidden ${className}`}
      {...props}
    >
      {/* Supplier Avatar Section with Gradient Background */}
      <div className="w-full h-32 sm:h-36 md:h-40 bg-gradient-to-br relative">
        <div className="w-full h-full overflow-hidden rounded-t-xl">
          {/* Supplier Avatar */}
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[rgb(var(--color-primary))]/10 via-[rgb(var(--color-primary))]/5 to-[rgb(var(--color-bg-secondary))]">
            <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-br from-[rgb(var(--color-primary))]/20 to-[rgb(var(--color-primary))]/10 rounded-full flex items-center justify-center border-4 border-[rgb(var(--color-primary))]/20 shadow-lg">
              <Building className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-[rgb(var(--color-primary))]" />
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

        {/* Action Menu */}
        <div className="absolute top-4 right-4">
          <div
            className="relative"
            ref={(el) => (menuRefs.current[supplier.id] = el)}
          >
            <IconButton onClick={() => toggleDropdown(supplier.id)} />

            {menu?.rowId === supplier.id && menu.mode === "dropdown" ? (
              <RowActionsMenu
                items={buildMenuItems(supplier.id)}
                mode="dropdown"
              />
            ) : null}
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-sm">
            Active
          </span>
        </div>
      </div>

      {/* Supplier Info */}
      <div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4">
        {/* Supplier Name */}
        <div>
          <h3
            className="font-bold text-md sm:text-xl mb-1"
            style={{ color: themeConfig.text }}
          >
            {supplier.name || t("common.notAvailable")}
          </h3>
          <p
            className="text-xs sm:text-sm font-medium"
            style={{ color: themeConfig.textSecondary }}
          >
            {t("suppliers.gstin")}:{" "}
            {supplier.gstNumber || t("common.notAvailable")}
          </p>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          {/* Phone */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Phone className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-medium"
                style={{ color: themeConfig.text }}
              >
                <CopyableContactValue
                  value={supplier.phone}
                  fallback={t("common.notAvailable")}
                />
              </p>
              <p
                className="text-xs"
                style={{ color: themeConfig.textSecondary }}
              >
                {t("common.phone")}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-medium"
                style={{ color: themeConfig.text }}
              >
                <CopyableContactValue
                  value={supplier.email}
                  fallback={t("common.notAvailable")}
                />
              </p>
              <p
                className="text-xs"
                style={{ color: themeConfig.textSecondary }}
              >
                {t("common.email")}
              </p>
            </div>
          </div>

          {/* Agency */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Building className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-medium"
                style={{ color: themeConfig.text }}
              >
                {supplier.agency || t("common.notAvailable")}
              </p>
              <p
                className="text-xs"
                style={{ color: themeConfig.textSecondary }}
              >
                {t("suppliers.agencyName")}
              </p>
            </div>
          </div>
        </div>

        {/* Supplier Stats Section */}
        <div className="rounded-lg p-4 space-y-2 bg-gradient-to-r from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))]">
          <div className="flex items-center justify-between">
            <span
              className="text-sm"
              style={{ color: themeConfig.textSecondary }}
            >
              {t("common.status")}
            </span>
            <span className="text-sm font-medium text-green-600">
              {t("suppliers.activeSupplier")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className="text-sm"
              style={{ color: themeConfig.textSecondary }}
            >
              {t("suppliers.memberSince")}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: themeConfig.text }}
            >
              {new Date(supplier.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>

          {/* Account Summary */}
          {supplier.account && (
            <>
              <div className="border-t border-[rgb(var(--color-border-primary))] pt-2 mt-2"></div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: themeConfig.textSecondary }}
                  >
                    {t("suppliers.totalPaid")}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    ₹{(supplier.account?.totalPaid || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: themeConfig.textSecondary }}
                  >
                    {t("suppliers.totalDue")}
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    ₹
                    {(
                      supplier.account?.totalDue ||
                      supplier.account?.dueAmount ||
                      0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Last Updated */}
        <div
          className="text-xs text-center pt-1.5 border-t"
          style={{
            color: themeConfig.textSecondary,
            borderColor: themeConfig.border,
          }}
        >
          {t("common.lastUpdated")}:{" "}
          {new Date(supplier.updatedAt || Date.now()).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
