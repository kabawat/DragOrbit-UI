"use client";
import { Grid3X3, List, Search, Crown, Users } from "lucide-react";
import { Input, Select, SideDrawer, DateRangeFilter } from "@dragorbit/ui";
import { TableToolbar } from "@dragorbit/ui";
/** Host model supplies state/actions; this component owns the shared markup. */
export function CustomerListHeaderView({ model }) {
	const {
		searchInputRef,
		t,
		searchValue,
		setSearchValue,
		isActive,
		setIsActive,
		source,
		setSource,
		sourceOptions,
		balanceFilter,
		setBalanceFilter,
		balanceFilterOptions,
		startDate,
		endDate,
		setStartDate,
		setEndDate,
		hasActiveFilters,
		handleClearFilters,
		hasCustomers,
		handleViewModeChange,
		viewMode,
		canSeeDownload,
		handleDownloadClick,
		isReportLocked,
		canCreate,
		CustomerImportMenu,
		importMenuRef,
		setShowOpeningBalanceDrawer,
		setShowBulkUploadDrawer,
		setShowCustomerDrawer,
		showCustomerDrawer,
		CreateCustomer,
		handleCustomerSuccess,
		showDownloadDrawer,
		CustomerDownloadDrawer,
		setShowDownloadDrawer,
		showBulkUploadDrawer,
		CustomerBulkUploadDrawer,
		handleBulkUploadSuccess,
		showOpeningBalanceDrawer,
		OpeningBalanceImportDrawer,
		syncStatus,
	} = model;
	return (
		<>
			<TableToolbar
				searchSlot={
					<div className="flex-1 min-w-[200px] max-w-md">
						<Input
							ref={searchInputRef}
							type="text"
							placeholder={`${t("common.search")} ${t("customers.title").toLowerCase()}...`}
							value={searchValue}
							onChange={setSearchValue}
							leftIcon={Search}
							className="w-full"
						/>
					</div>
				}
				filters={
					<>
						<div className="min-w-[140px]">
							<Select
								placeholder={t("common.status") || "Status"}
								value={isActive}
								onChange={setIsActive}
								options={[
									{ value: "", label: t("common.allStatus") },
									{ value: "true", label: t("common.active") },
									{ value: "false", label: t("common.inactive") },
								]}
								clearable
							/>
						</div>
						<div className="min-w-[160px]">
							<Select
								placeholder={t("customers.source")}
								value={source}
								onChange={setSource}
								options={sourceOptions}
								clearable
							/>
						</div>
						<div className="min-w-[150px]">
							<Select
								placeholder={t("khata.balanceFilter")}
								value={balanceFilter}
								onChange={setBalanceFilter}
								options={balanceFilterOptions}
								clearable
							/>
						</div>
						<DateRangeFilter
							startDate={startDate}
							endDate={endDate}
							onChange={({ startDate: nextStart, endDate: nextEnd }) => {
								setStartDate(nextStart);
								setEndDate(nextEnd);
							}}
						/>
					</>
				}
				clearFilters={{
					visible: hasActiveFilters,
					label: t("common.clearFilters"),
					onClick: handleClearFilters,
				}}
				viewSwitcher={
					hasCustomers && (
						<div className="flex bg-[rgb(var(--color-bg-secondary))] rounded-lg">
							<button
								type="button"
								onClick={() => handleViewModeChange("table")}
								className={`px-3 cursor-pointer py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
									viewMode === "table"
										? "bg-[rgb(var(--color-primary))] text-white"
										: "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
								}`}
							>
								<List className="w-4 h-4" />
								{t("common.tableView")}
							</button>
							<button
								type="button"
								onClick={() => handleViewModeChange("card")}
								className={`px-3 cursor-pointer py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
									viewMode === "card"
										? "bg-[rgb(var(--color-primary))] text-white"
										: "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
								}`}
							>
								<Grid3X3 className="w-4 h-4" />
								{t("common.cardView")}
							</button>
						</div>
					)
				}
				download={{
					label: t("customers.download"),
					hidden: !canSeeDownload,
					onClick: handleDownloadClick,
					badge: isReportLocked ? (
						<div className="absolute -top-1 -right-1 bg-[#f59e0b] text-white rounded-full p-0.5 shadow-sm">
							<Crown size={8} className="fill-white/20" />
						</div>
					) : undefined,
				}}
				actions={
					<>
						
						{syncStatus}
						{canCreate ? (
							<CustomerImportMenu
								ref={importMenuRef}
								onOpeningBalance={() => setShowOpeningBalanceDrawer(true)}
								onBulkUpload={() => setShowBulkUploadDrawer(true)}
							/>
						) : null}
					</>
				}
				create={{
					label: t("customers.addCustomer"),
					hidden: !canCreate,
					onClick: () => setShowCustomerDrawer(true),
				}}
			/>

			<SideDrawer
				isOpen={showCustomerDrawer}
				onClose={() => setShowCustomerDrawer(false)}
				title={t("customers.addNewCustomer")}
				icon={Users}
				width="w-full md:w-2/3 lg:w-1/2"
			>
				<div className="p-6 h-full">
					<CreateCustomer
						onSuccess={handleCustomerSuccess}
						onCancel={() => setShowCustomerDrawer(false)}
						showCancelButton={true}
						autoRedirect={false}
						mode="drawer"
					/>
				</div>
			</SideDrawer>

			{showDownloadDrawer && (
				<CustomerDownloadDrawer
					isOpen={showDownloadDrawer}
					onClose={() => setShowDownloadDrawer(false)}
				/>
			)}

			{showBulkUploadDrawer && (
				<CustomerBulkUploadDrawer
					isOpen={showBulkUploadDrawer}
					onClose={() => setShowBulkUploadDrawer(false)}
					onSuccess={handleBulkUploadSuccess}
				/>
			)}

			{showOpeningBalanceDrawer && (
				<OpeningBalanceImportDrawer
					isOpen={showOpeningBalanceDrawer}
					onClose={() => setShowOpeningBalanceDrawer(false)}
					onSuccess={handleBulkUploadSuccess}
				/>
			)}
		</>
	);
}
