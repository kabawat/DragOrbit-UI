"use client";
import { TableSkeleton } from "@dragorbit/ui";
import { Button, SideDrawer } from "@dragorbit/ui";
import {
  CalendarCheck,
  IndianRupee,
  Search,
  UserPlus,
  Users,
  WifiOff,
} from "lucide-react";
export function StaffScreen({ model }) {
  const {
    isOnline,
    t,
    PAGE_TABS,
    setPageTab,
    pageTab,
    StaffAttendanceTab,
    storeId,
    staffList,
    attendanceRefreshKey,
    attendanceSavedDate,
    setShowMarkAttendanceDrawer,
    StaffSalaryTab,
    salaryRefreshKey,
    salarySavedPeriodMonth,
    setShowRecordSalaryDrawer,
    searchValue,
    setSearchValue,
    STATUS_TABS,
    setActiveTab,
    activeTab,
    handleInviteOpen,
    listLoading,
    filteredStaff,
    StaffEmptyState,
    StaffCard,
    handleDeleteTempStaff,
    handleResendInvite,
    handleRemoveStaff,
    handleEditStaff,
    loadLocalStaff,
    isSyncing,
    ManagementShortcuts,
    showMarkAttendanceDrawer,
    MarkAttendanceDrawer,
    setAttendanceSavedDate,
    setAttendanceRefreshKey,
    showRecordSalaryDrawer,
    RecordSalaryDrawer,
    setSalarySavedPeriodMonth,
    setSalaryRefreshKey,
    showInviteDrawer,
    setShowInviteDrawer,
    InviteStaffDrawer,
    editingStaff,
    setEditingStaff,
    UpdateStaffDrawer,
  } = model;
  return (
    <div className="p-5">
      <div className="max-w-8xl mx-auto">
        {!isOnline && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
            <WifiOff size={16} />
            <span>
              {t("staff.offlineReadOnly") ||
                "Showing cached team from local storage. Invite and edit require an internet connection."}
            </span>
          </div>
        )}

        <div className="mb-4 flex items-center gap-1 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg p-1 w-fit">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setPageTab(tab.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                pageTab === tab.value
                  ? "bg-[rgb(var(--color-primary))] text-white shadow-sm"
                  : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {pageTab === "ATTENDANCE" ? (
          <StaffAttendanceTab
            storeId={storeId}
            staffList={staffList}
            isOnline={isOnline}
            refreshKey={attendanceRefreshKey}
            savedDate={attendanceSavedDate}
            onOpenMarkDrawer={() => setShowMarkAttendanceDrawer(true)}
          />
        ) : pageTab === "SALARY" ? (
          <StaffSalaryTab
            storeId={storeId}
            staffList={staffList}
            isOnline={isOnline}
            refreshKey={salaryRefreshKey}
            savedPeriodMonth={salarySavedPeriodMonth}
            onOpenRecordDrawer={() => setShowRecordSalaryDrawer(true)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary)/0.4)] rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap text-sm">
                  <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                    <div className="relative flex-1 max-w-sm">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]"
                      />
                      <input
                        type="text"
                        placeholder="Search by name, email or role..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-tertiary))] focus:outline-none focus:border-[rgb(var(--color-primary))] transition-colors"
                      />
                    </div>

                    <div className="flex items-center gap-1 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg p-1 overflow-hidden">
                      {STATUS_TABS.map((tab) => (
                        <button
                          key={tab.value}
                          type="button"
                          onClick={() => setActiveTab(tab.value)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                            activeTab === tab.value
                              ? "bg-[rgb(var(--color-primary))] text-white shadow-sm"
                              : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-primary))] shadow-none"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    leftIcon={UserPlus}
                    className="px-5"
                    onClick={handleInviteOpen}
                    disabled={!isOnline}
                    title={
                      !isOnline
                        ? "Internet required to invite staff"
                        : undefined
                    }
                  >
                    Invite Staff
                  </Button>
                </div>
              </div>

              <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.4)] overflow-hidden">
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar p-1">
                  {listLoading ? (
                    <TableSkeleton />
                  ) : filteredStaff.length === 0 ? (
                    <div className="py-12">
                      <StaffEmptyState
                        hasSearch={!!searchValue || activeTab !== "ALL"}
                        onClearSearch={() => {
                          setSearchValue("");
                          setActiveTab("ALL");
                        }}
                        onInvite={handleInviteOpen}
                      />
                    </div>
                  ) : (
                    <div className="divide-y divide-[rgb(var(--color-border-primary)/0.3)]">
                      {filteredStaff.map((staff) => (
                        <div key={staff._id} className="p-1">
                          <StaffCard
                            staff={staff}
                            isOnline={isOnline}
                            onDeleteTemp={handleDeleteTempStaff}
                            onResendInvite={handleResendInvite}
                            onRemoveStaff={handleRemoveStaff}
                            onEditStaff={handleEditStaff}
                            onRefresh={loadLocalStaff}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <ManagementShortcuts />
              <div className="p-5 bg-[rgb(var(--color-primary))]/5 border border-dashed border-[rgb(var(--color-primary))]/20 rounded-xl">
                <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-1.5">
                  Staff Note
                </h4>
                <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed">
                  Team list is read from local SQLite. Invite, edit, and remove
                  need network access.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <SideDrawer
        isOpen={showMarkAttendanceDrawer}
        onClose={() => setShowMarkAttendanceDrawer(false)}
        title={t("staff.attendance.markTitle") || "Mark attendance"}
        description={
          t("staff.attendance.markDescription") ||
          "Record daily attendance for your active team members."
        }
        icon={CalendarCheck}
        width="w-full md:w-[500px]"
        closeOnOutsideClick={false}
      >
        <MarkAttendanceDrawer
          storeId={storeId}
          staffList={staffList}
          isOnline={isOnline}
          onSuccess={(savedDate) => {
            setShowMarkAttendanceDrawer(false);
            setAttendanceSavedDate(savedDate || null);
            setAttendanceRefreshKey((key) => key + 1);
          }}
          onCancel={() => setShowMarkAttendanceDrawer(false)}
        />
      </SideDrawer>

      <SideDrawer
        isOpen={showRecordSalaryDrawer}
        onClose={() => setShowRecordSalaryDrawer(false)}
        title={t("staff.salary.recordTitle") || "Record salary"}
        description={
          t("staff.salary.recordDescription") ||
          "Record salary payment for an active team member."
        }
        icon={IndianRupee}
        width="w-full md:w-[500px]"
        closeOnOutsideClick={false}
      >
        <RecordSalaryDrawer
          storeId={storeId}
          staffList={staffList}
          isOnline={isOnline}
          onSuccess={(periodMonth) => {
            setShowRecordSalaryDrawer(false);
            setSalarySavedPeriodMonth(periodMonth || null);
            setSalaryRefreshKey((key) => key + 1);
          }}
          onCancel={() => setShowRecordSalaryDrawer(false)}
        />
      </SideDrawer>

      <SideDrawer
        isOpen={showInviteDrawer}
        onClose={() => setShowInviteDrawer(false)}
        title="Invite Staff Member"
        description="Invite a new team member and assign them to one or more stores with specific roles."
        icon={UserPlus}
        width="max-w-2xl"
        closeOnOutsideClick={false}
      >
        <InviteStaffDrawer
          storeId={storeId}
          isOnline={isOnline}
          onSuccess={() => {
            setShowInviteDrawer(false);
            loadLocalStaff();
          }}
          onCancel={() => setShowInviteDrawer(false)}
        />
      </SideDrawer>

      <SideDrawer
        isOpen={!!editingStaff}
        onClose={() => setEditingStaff(null)}
        title="Edit Staff Member"
        description="Update roles, permissions, and assigned stores for this staff member."
        icon={Users}
        width="max-w-2xl"
        closeOnOutsideClick={false}
      >
        <UpdateStaffDrawer
          staff={editingStaff}
          isOnline={isOnline}
          onSuccess={() => {
            setEditingStaff(null);
            loadLocalStaff();
          }}
          onCancel={() => setEditingStaff(null)}
        />
      </SideDrawer>
    </div>
  );
}
