"use client";
import { TableSkeleton } from "@dragorbit/ui";
/** Host model supplies state/actions; this component owns the shared markup. */
export function InvoiceListContentView({ model }) {
	const {
		viewMode,
		InvoiceTable,
		invoices,
		canEdit,
		handleEditInvoice,
		canDelete,
		handleDeleteInvoice,
		canRead,
		handleViewInvoice,
		handlePrintInvoice,
		handleReleaseInvoice,
		handleUpdatePaymentStatus,
		handleCancelInvoice,
		handleIssueCreditNote,
		isLoading,
		t,
		pagination,
		InvoiceCard,
		sentinelRef,
		isFetchingMore,
		invoiceToDelete,
		InvoiceDeleteConfirmModal,
		setInvoiceToDelete,
		invoiceToRelease,
		ReleaseInvoiceModal,
		setInvoiceToRelease,
		setPaymentInvoiceId,
		PaymentConfirmModal,
		paymentInvoiceId,
		invoiceToUpdatePayment,
		UpdatePaymentStatusModal,
		setInvoiceToUpdatePayment,
		invoiceToCancel,
		CancelInvoiceModal,
		setInvoiceToCancel,
		handleCancelSuccess,
		invoiceToCreditNote,
		CreditNoteModal,
		setInvoiceToCreditNote,
		onCreditNoteSuccess,
	} = model;
	return (
		<>
			<div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary)/0.6)] overflow-hidden">
				<div className="h-[calc(100vh-210px)] overflow-y-auto custom-scrollbar">
					{viewMode === "table" ? (
						<div className="min-h-full">
							<InvoiceTable
								invoices={invoices}
								onEdit={canEdit ? handleEditInvoice : undefined}
								onDelete={canDelete ? handleDeleteInvoice : undefined}
								onViewDetails={canRead ? handleViewInvoice : undefined}
								onPrint={canRead ? handlePrintInvoice : undefined}
								onRelease={canEdit ? handleReleaseInvoice : undefined}
								onUpdatePaymentStatus={
									canEdit ? handleUpdatePaymentStatus : undefined
								}
								onCancel={canEdit ? handleCancelInvoice : undefined}
								onCreditNote={canEdit ? handleIssueCreditNote : undefined}
								loading={isLoading}
								emptyMessage={t("common.noResults")}
								hasMore={pagination?.hasNextPage}
							/>
						</div>
					) : (
						<div>
							<div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{invoices.map((invoice) => (
									<InvoiceCard
										key={invoice.id || invoice._id}
										invoice={invoice}
										onEdit={canEdit ? handleEditInvoice : undefined}
										onDelete={canDelete ? handleDeleteInvoice : undefined}
										onViewDetails={canRead ? handleViewInvoice : undefined}
										onPrint={canRead ? handlePrintInvoice : undefined}
										onRelease={canEdit ? handleReleaseInvoice : undefined}
										onUpdatePaymentStatus={
											canEdit ? handleUpdatePaymentStatus : undefined
										}
										onCancel={canEdit ? handleCancelInvoice : undefined}
										onCreditNote={canEdit ? handleIssueCreditNote : undefined}
										allInvoices={invoices}
									/>
								))}
							</div>
						</div>
					)}

					{/* Sentinel — IntersectionObserver triggers load more */}
					{pagination.hasNextPage && (
						<div ref={sentinelRef} className="h-4 w-full" />
					)}

					{isFetchingMore && invoices.length > 0 && (
						<TableSkeleton compact rows={2} />
					)}
				</div>

				<div className="bg-[rgb(var(--color-bg-tertiary))] border-t border-[rgb(var(--color-border-primary))] px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="text-sm text-[rgb(var(--color-text-secondary))]">
							{pagination?.hasNextPage ? (
								<>
									Showing{" "}
									<span className="font-semibold text-[rgb(var(--color-text-primary))]">
										{invoices.length}
									</span>{" "}
									invoices
									<span className="ml-2 text-xs text-[rgb(var(--color-primary))]">
										• Scroll down to load more
									</span>
								</>
							) : (
								<>
									Showing{" "}
									<span className="font-semibold text-[rgb(var(--color-text-primary))]">
										{invoices.length}
									</span>{" "}
									invoices
									<span className="ml-2 text-xs text-[rgb(var(--color-text-tertiary))]">
										• No more invoices
									</span>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Delete confirmation modal */}
			{invoiceToDelete && (
				<InvoiceDeleteConfirmModal
					onClose={() => setInvoiceToDelete(null)}
					invoice={invoiceToDelete}
				/>
			)}

			{/* Release confirmation modal */}
			{invoiceToRelease && (
				<ReleaseInvoiceModal
					onClose={() => setInvoiceToRelease(null)}
					invoice={invoiceToRelease}
					onCollectPayment={setPaymentInvoiceId}
				/>
			)}

			<PaymentConfirmModal
				open={Boolean(paymentInvoiceId)}
				invoiceId={paymentInvoiceId}
				source="release"
				onClose={() => setPaymentInvoiceId(null)}
			/>

			{/* Payment Status Update Modal */}
			{invoiceToUpdatePayment && (
				<UpdatePaymentStatusModal
					onClose={() => setInvoiceToUpdatePayment(null)}
					invoice={invoiceToUpdatePayment}
				/>
			)}

			{invoiceToCancel && (
				<CancelInvoiceModal
					isOpen={Boolean(invoiceToCancel)}
					onClose={() => setInvoiceToCancel(null)}
					invoiceId={invoiceToCancel.id || invoiceToCancel._id}
					invoiceNumber={
						invoiceToCancel.invoiceNumber ||
						`INV-${(invoiceToCancel.id || invoiceToCancel._id)?.slice(-6)}`
					}
					onSuccess={handleCancelSuccess}
				/>
			)}

			{invoiceToCreditNote && (
				<CreditNoteModal
					isOpen={Boolean(invoiceToCreditNote)}
					onClose={() => setInvoiceToCreditNote(null)}
					invoiceId={invoiceToCreditNote.id || invoiceToCreditNote._id}
					invoiceNumber={
						invoiceToCreditNote.invoiceNumber ||
						`INV-${(invoiceToCreditNote.id || invoiceToCreditNote._id)?.slice(-6)}`
					}
					items={invoiceToCreditNote.items}
					onSuccess={onCreditNoteSuccess}
				/>
			)}
		</>
	);
}
