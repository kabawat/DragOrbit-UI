"use client";
import { useState } from "react";
import { Users, Search } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";

/** Shared presentation; hosts supply data and platform-bound list adapters. */
export function CustomersScreen({
	t,
	customers,
	isLoading,
	error,
	CustomerListHeader,
	CustomerListContent,
}) {
	const [searchValue, setSearchValue] = useState("");
	const [isActive, setIsActive] = useState("");
	const [source, setSource] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [balanceFilter, setBalanceFilter] = useState("");
	const handleBulkSuccess = () => {};
	const isFiltered = Boolean(
		searchValue || isActive || source || startDate || endDate || balanceFilter,
	);
	return (
		<div className="overflow-hidden">
			<div className="max-w-8xl mx-auto">
				<CustomerListHeader
					searchValue={searchValue}
					setSearchValue={setSearchValue}
					isActive={isActive}
					setIsActive={setIsActive}
					source={source}
					setSource={setSource}
					startDate={startDate}
					setStartDate={setStartDate}
					endDate={endDate}
					setEndDate={setEndDate}
					balanceFilter={balanceFilter}
					setBalanceFilter={setBalanceFilter}
					onSuccess={handleBulkSuccess}
				/>

				<div className="px-5">
					{isLoading && customers.length === 0 && !error && <PageLoader />}

					{!isLoading && customers.length === 0 && (
						<EmptyState
							className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
							title={
								isFiltered ? t("common.noResults") : t("customers.noCustomers")
							}
							description={
								error
									? `${t("common.error")}: ${error}`
									: isFiltered
										? `${t("common.noResultsFoundFor")} "${searchValue || t("common.filters")}"`
										: t("customers.emptyDescription")
							}
							icon={isFiltered ? Search : Users}
							type={error ? "error" : "empty"}
						/>
					)}

					{customers.length > 0 && (
						<CustomerListContent
							searchValue={searchValue}
							isActive={isActive}
							source={source}
							startDate={startDate}
							endDate={endDate}
							balanceFilter={balanceFilter}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
export default CustomersScreen;
