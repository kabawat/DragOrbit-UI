"use client";
import { Button, Input, Select } from "@dragorbit/ui";
import { Download, Grid3X3, List, Plus, Search, Upload } from "lucide-react";
export function ProductListHeaderView({ model }) {
	const {
		searchInputRef,
		t,
		searchValue,
		setSearchValue,
		showInCatalog,
		setShowInCatalog,
		getCatalogOptions,
		category,
		setCategory,
		categoryOptions,
		categoriesLoading,
		sortBy,
		setSortBy,
		getSortOptions,
		handleViewModeChange,
		viewMode,
		canSeeDownload,
		setShowDownloadDrawer,
		canCreate,
		setShowBulkUploadDrawer,
		showBulkUploadDrawer,
		ProductBulkUpload,
		handleBulkUploadSuccess,
		showDownloadDrawer,
		ProductDownloadDrawer,
		onCreate,
		syncStatus,
	} = model;
	return (
		<div className="p-5">
			<div className="flex justify-between items-center lg:flex-row gap-4 mb-0">
				{/* Search */}
				<div className="flex">
					<Input
						type="text"
						ref={searchInputRef}
						placeholder={`${t("common.search")} ${t("products.title").toLowerCase()}...`}
						value={searchValue}
						onChange={setSearchValue}
						leftIcon={Search}
						className="w-100"
					/>
				</div>

				{/* Filters + Actions */}
				<div className="flex gap-3 items-center">
					<div className="min-w-[150px]">
						<Select
							placeholder={t("products.visibility")}
							value={showInCatalog}
							onChange={setShowInCatalog}
							options={getCatalogOptions(t)}
							searchable={false}
						/>
					</div>

					<div className="min-w-[180px]">
						<Select
							placeholder={t("products.category")}
							value={category}
							onChange={setCategory}
							options={categoryOptions}
							searchable={true}
							disabled={categoriesLoading}
							clearable
						/>
					</div>

					<div className="min-w-[180px]">
						<Select
							placeholder={t("common.sortBy")}
							value={sortBy}
							onChange={setSortBy}
							options={getSortOptions(t)}
							clearable={true}
						/>
					</div>

					{syncStatus}

					{/* View toggle */}
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

					{canSeeDownload && (
						<Button
							variant="secondary"
							onClick={() => setShowDownloadDrawer(true)}
							leftIcon={Download}
						>
							{t("products.download", "Download")}
						</Button>
					)}

					{canCreate && (
						<Button
							variant="secondary"
							onClick={() => setShowBulkUploadDrawer(true)}
							leftIcon={Upload}
						>
							{t("products.bulkUpload", "Bulk Upload")}
						</Button>
					)}
					{canCreate && (
						<Button variant="primary" onClick={onCreate} leftIcon={Plus}>
							{t("products.addProduct")}
						</Button>
					)}
				</div>
			</div>

			{showBulkUploadDrawer && (
				<ProductBulkUpload
					isOpen={showBulkUploadDrawer}
					onClose={() => setShowBulkUploadDrawer(false)}
					onSuccess={handleBulkUploadSuccess}
				/>
			)}

			{showDownloadDrawer && (
				<ProductDownloadDrawer
					isOpen={showDownloadDrawer}
					onClose={() => setShowDownloadDrawer(false)}
					searchValue={searchValue}
					sortBy={sortBy}
					showInCatalog={showInCatalog}
					category={category}
				/>
			)}
		</div>
	);
}
