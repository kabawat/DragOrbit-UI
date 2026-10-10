"use client";
import {
	Download,
	Grid3X3,
	List,
	Plus,
	RotateCcw,
	Search,
	Crown,
} from "lucide-react";
import { Button, Input, DateRangeFilter } from "@dragorbit/ui";
/** Host model supplies state/actions; this component owns the shared markup. */
export function ExpenseListHeaderView({ model }) {
	const {
		searchInputRef,
		t,
		searchValue,
		setSearchValue,
		startDate,
		endDate,
		setStartDate,
		setEndDate,
		hasActiveFilters,
		handleClearFilters,
		hasExpenses,
		handleViewModeChange,
		viewMode,
		canSeeDownload,
		handleDownloadClick,
		isReportLocked,
		canCreate,
		setShowAddDrawer,
		AddExpenseDrawer,
		showAddDrawer,
		handleSuccess,
		showDownloadDrawer,
		ExpenseDownloadDrawer,
		setShowDownloadDrawer,
		syncStatus,
	} = model;
	return (
		<div className="p-5">
			<div className="flex justify-between items-center lg:flex-row gap-4 mb-0">
				<div className="flex flex-wrap items-center gap-3">
					<div className="min-w-[200px] max-w-md flex-1">
						<Input
							ref={searchInputRef}
							type="text"
							placeholder={`${t("common.search")} ${t("expenses.title").toLowerCase()}...`}
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							leftIcon={Search}
							className="w-full"
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
				</div>

				<div className="flex gap-3">
					{syncStatus}
					{hasExpenses && (
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
					)}

					{canSeeDownload && (
						<Button
							variant="outline"
							onClick={handleDownloadClick}
							className="flex items-center gap-2 h-9 relative"
						>
							<Download className="w-4 h-4" />
							{t("expenses.download")}
							{isReportLocked && (
								<div className="absolute -top-1 -right-1 bg-[#f59e0b] text-white rounded-full p-0.5 shadow-sm">
									<Crown size={8} className="fill-white/20" />
								</div>
							)}
						</Button>
					)}
					{canCreate && (
						<Button
							variant="primary"
							onClick={() => setShowAddDrawer(true)}
							leftIcon={Plus}
						>
							{t("expenses.addExpense")}
						</Button>
					)}
				</div>
			</div>

			<AddExpenseDrawer
				isOpen={showAddDrawer}
				onClose={() => setShowAddDrawer(false)}
				onSuccess={handleSuccess}
			/>

			{showDownloadDrawer && (
				<ExpenseDownloadDrawer
					isOpen={showDownloadDrawer}
					onClose={() => setShowDownloadDrawer(false)}
				/>
			)}
		</div>
	);
}
