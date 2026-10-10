"use client";
const DiscountModal = ({
	isOpen,
	discountInput,
	setDiscountInput,
	onClose,
	onApply,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] p-6 w-72">
				<h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4">
					Item Discount (%)
				</h3>
				<input
					type="number"
					min="0"
					max="100"
					value={discountInput}
					onChange={(e) => setDiscountInput(e.target.value)}
					className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] text-lg font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
					placeholder="0 – 100"
				/>
				<div className="flex gap-3">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 py-2.5 rounded-xl border border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors text-sm font-medium cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onApply}
						className="flex-1 py-2.5 rounded-xl bg-[rgb(var(--color-primary))] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	);
};

export default DiscountModal;
