"use client";
import { Grid3X3, List, QrCode, RotateCcw, Search } from "lucide-react";
import { Button, Input, Select, DateRangeFilter } from "@dragorbit/ui";
/** Host model supplies state/actions; this component owns the shared markup. */
export function SalesOrderListHeaderView({ model }) {
	const {
		searchInputRef,
		t,
		searchValue,
		setSearchValue,
		orderSourceFilter,
		setOrderSourceFilter,
		statusFilter,
		setStatusFilter,
		startDate,
		endDate,
		setStartDate,
		setEndDate,
		hasActiveFilters,
		handleClearFilters,
		handleViewModeChange,
		viewMode,
		canCreate,
		selectedStore,
		setIsCatalogModalOpen,
		CatalogQRModal,
		isCatalogModalOpen,
		syncStatus,
	} = model;
	return (
		<div className="p-5">
			<div className="flex justify-between items-center lg:flex-row gap-4 mb-0">
				<div className="w-100">
					<Input
						type="text"
						ref={searchInputRef}
						placeholder={t("common.searchOrders")}
						value={searchValue}
						onChange={(e) => setSearchValue(e.target?.value ?? e)}
						leftIcon={Search}
						className="w-100"
					/>
				</div>

				<div className="flex flex-wrap gap-3 items-center mt-3 lg:mt-0">
					<div className="min-w-[140px]">
						<Select
							placeholder={t("common.type", { defaultValue: "All Types" })}
							value={orderSourceFilter}
							onChange={setOrderSourceFilter}
							options={[
								{ value: "all", label: "All Sources" },
								{ value: "ONLINE", label: "Online" },
								{ value: "IN_STORE", label: "In-Store" },
							]}
						/>
					</div>

					<div className="min-w-[160px]">
						<Select
							placeholder={t("common.allStatus")}
							value={statusFilter}
							onChange={setStatusFilter}
							options={[
								{ value: "all", label: t("common.allStatus") },
								{ value: "PENDING", label: t("salesOrder.status.pending") },
								{ value: "CONFIRMED", label: t("salesOrder.status.confirmed") },
								{
									value: "PROCESSING",
									label: t("salesOrder.status.processing"),
								},
								{ value: "SHIPPED", label: t("salesOrder.status.shipped") },
								{ value: "DELIVERED", label: t("salesOrder.status.delivered") },
								{ value: "CANCELLED", label: t("salesOrder.status.cancelled") },
							]}
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

					{syncStatus}
					{hasActiveFilters && (
						<Button
							variant="ghost"
							onClick={handleClearFilters}
							className="h-10 px-3 text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] flex items-center gap-2"
						>
							<RotateCcw className="w-4 h-4" />
							{t("common.clearFilters")}
						</Button>
					)}

					<div className="flex bg-[rgb(var(--color-bg-secondary))] rounded-lg">
						<button
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

					{canCreate && selectedStore?.catalogId && (
						<>
							<Button
								variant="outline"
								onClick={() => setIsCatalogModalOpen(true)}
								leftIcon={QrCode}
								className="h-9 font-semibold border-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/5"
							>
								{t("settings.publicCatalog")}
							</Button>

							<CatalogQRModal
								isOpen={isCatalogModalOpen}
								onClose={() => setIsCatalogModalOpen(false)}
								store={selectedStore}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
