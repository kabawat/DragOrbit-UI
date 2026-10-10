"use client";
import { Download, Grid3X3, List, Plus, RotateCcw } from "lucide-react";
import { Button, Select, DateRangeFilter } from "@dragorbit/ui";
/** Host model supplies state/actions; this component owns the shared markup. */
export function InvoiceListHeaderView({ model }) {
	const {
		paymentStatus,
		handleFilterChange,
		t,
		invoiceStatus,
		startDate,
		endDate,
		handleDateRangeChange,
		hasActiveFilters,
		handleClearFilters,
		OpenCustomerPaymentButton,
		hasInvoices,
		handleViewModeChange,
		viewMode,
		canDownload,
		setShowDownloadDrawer,
		canCreate,
		handleAddInvoice,
		InvoiceDownloadDrawer,
		showDownloadDrawer,
		syncStatus,
	} = model;
	return (
		<div className="p-5">
			<div className="flex justify-between items-center gap-3 flex-wrap">
				{/* Left side - Filters */}
				<div className="flex gap-3 flex-wrap">
					{/* Payment Status */}
					<div className="w-[160px]">
						<Select
							value={paymentStatus}
							onChange={(val) => handleFilterChange("paymentStatus", val)}
							options={[
								{ value: "", label: t("invoice.paymentStatus") },
								{ value: "UNPAID", label: t("invoice.unpaid") },
								{ value: "PAID", label: t("invoice.paid") },
								{ value: "PARTIAL", label: t("invoice.partialPayment") },
								{ value: "CANCELLED", label: t("invoice.cancelled") },
							]}
							placeholder={t("invoice.paymentStatus")}
						/>
					</div>

					{/* Invoice Status */}
					<div className="w-[160px]">
						<Select
							value={invoiceStatus}
							onChange={(val) => handleFilterChange("invoiceStatus", val)}
							options={[
								{ value: "", label: t("invoice.invoiceStatus") },
								{ value: "DRAFT", label: t("invoice.draft") },
								{ value: "RELEASED", label: t("invoice.released") },
								{ value: "CANCELLED", label: t("invoice.cancelled") },
								{ value: "DELETED", label: t("invoice.deleted") },
							]}
							placeholder={t("invoice.invoiceStatus")}
						/>
					</div>

					<DateRangeFilter
						startDate={startDate}
						endDate={endDate}
						onChange={handleDateRangeChange}
					/>

					{/* Clear Filters */}
					{hasActiveFilters && (
						<Button
							variant="ghost"
							onClick={handleClearFilters}
							className="h-10 px-4 text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors flex items-center gap-2"
						>
							<RotateCcw className="w-4 h-4" />
							{t("common.clearFilters")}
						</Button>
					)}
				</div>

				{/* Right side - Action Buttons */}
				<div className="flex gap-3">
					<OpenCustomerPaymentButton className="h-9" />

					{syncStatus}
					{hasInvoices && (
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

					{canDownload && (
						<Button
							variant="secondary"
							onClick={() => setShowDownloadDrawer(true)}
							className="flex items-center gap-2 h-9"
						>
							<Download className="w-4 h-4" />
							{t("common.download")}
						</Button>
					)}

					{canCreate && (
						<Button
							variant="primary"
							onClick={handleAddInvoice}
							leftIcon={Plus}
						>
							{t("invoice.createInvoice")}
						</Button>
					)}
				</div>
			</div>

			{/* Download Drawer */}
			<InvoiceDownloadDrawer
				isOpen={showDownloadDrawer}
				onClose={() => setShowDownloadDrawer(false)}
			/>
		</div>
	);
}
