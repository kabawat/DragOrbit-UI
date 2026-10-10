"use client";
import { useState } from "react";
import { IndianRupee, Search } from "lucide-react";
import { EmptyState, PageLoader } from "@dragorbit/ui";

/** Shared presentation; hosts supply data and platform-bound list adapters. */
export function ExpensesScreen({
	t,
	expenses,
	isLoading,
	error,
	ExpenseListHeader,
	ExpenseListContent,
}) {
	const [searchValue, setSearchValue] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	return (
		<div className="overflow-hidden">
			<div className="max-w-8xl mx-auto">
				<ExpenseListHeader
					searchValue={searchValue}
					setSearchValue={setSearchValue}
					startDate={startDate}
					setStartDate={setStartDate}
					endDate={endDate}
					setEndDate={setEndDate}
				/>

				<div className="px-5">
					{isLoading && expenses.length === 0 && !error && <PageLoader />}

					{!isLoading && expenses.length === 0 && (
						<EmptyState
							className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))]"
							title={
								searchValue
									? t("common.noResults")
									: t("expenses.noExpenses") || "No Expenses Found"
							}
							description={
								error
									? `${t("common.error")}: ${error}`
									: searchValue
										? `${t("common.noResultsFoundFor")} "${searchValue}"`
										: t("expenses.emptyDescription") ||
											t("expenses.startAddingExpense")
							}
							icon={searchValue ? Search : IndianRupee}
							type={error ? "error" : "empty"}
						/>
					)}

					{expenses.length > 0 && (
						<ExpenseListContent
							searchValue={searchValue}
							startDate={startDate}
							endDate={endDate}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
export default ExpensesScreen;
