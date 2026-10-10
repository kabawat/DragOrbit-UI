"use client";
/** Host model supplies state/actions; this component owns the shared markup. */
export function ExpenseListContentView({ model }) {
	const {
		viewMode,
		ExpenseTable,
		expenses,
		canEdit,
		handleOpenEdit,
		canDelete,
		deleteModalRef,
		canView,
		sortBy,
		sortOrder,
		handleSort,
		pagination,
		sentinelRef,
		isFetchingMore,
		isLoading,
		t,
		ExpenseCard,
		ExpenseDeleteModal,
		EditExpenseDrawer,
		editDrawerOpen,
		editingExpenseId,
		handleCloseEdit,
		onView,
		readOnlyDrawer,
	} = model;
	return (
		<>
			<div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.6)] overflow-hidden">
				<div className="h-[calc(100vh-210px)] overflow-y-auto">
					{viewMode === "table" ? (
						<>
							{/* Fixed Table Header — outside scroll container so it never scrolls */}
							<ExpenseTable
								expenses={expenses}
								onEdit={canEdit ? handleOpenEdit : undefined}
								onDelete={
									canDelete
										? (id) => deleteModalRef.current?.open(id)
										: undefined
								}
								onView={canView ? onView : undefined}
								sortBy={sortBy}
								sortOrder={sortOrder}
								onSort={handleSort}
								headerOnly
							/>

							{/* Scrollable Body */}
							<div className="flex-1 overflow-y-auto overflow-x-auto">
								<ExpenseTable
									expenses={expenses}
									onEdit={canEdit ? handleOpenEdit : undefined}
									onDelete={
										canDelete
											? (id) => deleteModalRef.current?.open(id)
											: undefined
									}
									onView={canView ? onView : undefined}
									sortBy={sortBy}
									sortOrder={sortOrder}
									onSort={handleSort}
									bodyOnly
								/>

								{/* Sentinel — IntersectionObserver triggers load more */}
								{pagination.hasNextPage && (
									<div ref={sentinelRef} className="h-4 w-full" />
								)}

								{(isFetchingMore || isLoading) && (
									<div className="flex items-center justify-center py-8">
										<div className="flex items-center gap-3">
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[rgb(var(--color-primary))]" />
											<span className="text-sm text-[rgb(var(--color-text-secondary))]">
												{t("common.loadingMore") || "Loading more..."}
											</span>
										</div>
									</div>
								)}
							</div>
						</>
					) : (
						<div className="flex-1 overflow-y-auto">
							<div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{expenses.map((expense) => (
									<ExpenseCard
										key={expense.id}
										expense={expense}
										onEdit={canEdit ? handleOpenEdit : undefined}
										onDelete={
											canDelete
												? (id) => deleteModalRef.current?.open(id)
												: undefined
										}
										onView={canView ? onView : undefined}
									/>
								))}
							</div>

							{/* Sentinel — IntersectionObserver triggers load more */}
							{pagination.hasNextPage && (
								<div ref={sentinelRef} className="h-4 w-full" />
							)}

							{(isFetchingMore || isLoading) && (
								<div className="flex items-center justify-center py-8">
									<div className="flex items-center gap-3">
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[rgb(var(--color-primary))]" />
										<span className="text-sm text-[rgb(var(--color-text-secondary))]">
											{t("common.loadingMore") || "Loading more..."}
										</span>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Fixed Footer */}
					<div className="bg-[rgb(var(--color-bg-tertiary))] border-t border-[rgb(var(--color-border-primary))] px-6 py-4 shrink-0">
						<div className="flex items-center justify-between">
							<div className="text-sm text-[rgb(var(--color-text-secondary))]">
								Showing{" "}
								<span className="font-semibold text-[rgb(var(--color-text-primary))]">
									{expenses.length}
								</span>{" "}
								expenses
								{pagination.hasNextPage ? (
									<span className="ml-2 text-xs text-[rgb(var(--color-primary))]">
										• Scroll down to load more
									</span>
								) : (
									<span className="ml-2 text-xs text-[rgb(var(--color-text-tertiary))]">
										• All expenses loaded
									</span>
								)}
							</div>
							<div className="text-sm text-[rgb(var(--color-text-secondary))]" />
						</div>
					</div>
				</div>

				{/* Delete modal — fully self-contained via ref */}
				<ExpenseDeleteModal ref={deleteModalRef} />

				{/* Edit Expense Drawer */}
				<EditExpenseDrawer
					isOpen={editDrawerOpen}
					expenseId={editingExpenseId}
					onClose={handleCloseEdit}
					readOnly={readOnlyDrawer}
				/>
			</div>
		</>
	);
}
