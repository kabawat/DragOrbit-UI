"use client";
import { Tag } from "lucide-react";

const fmt = (n) => `₹${Number(n).toFixed(2)}`;

const TaxRow = ({ label, amount }) => {
	if (!amount || amount <= 0) return null;
	return (
		<div className="flex justify-between text-[rgb(var(--color-text-secondary))] text-xs">
			<span>{label}</span>
			<span className="font-medium text-[rgb(var(--color-text-primary))]">
				{fmt(amount)}
			</span>
		</div>
	);
};

const CartSummary = ({
	subtotal,
	taxTotal,
	gstBreakdown,
	discountAmt,
	globalDiscount,
	setGlobalDiscount,
	grandTotal,
	calculating = false,
}) => {
	const breakdown = gstBreakdown || {};

	return (
		<div className="space-y-1.5 text-sm p-4 border-t border-[rgb(var(--color-border-primary))]">
			<div className="flex justify-between text-[rgb(var(--color-text-secondary))]">
				<span>Subtotal</span>
				<span className="font-medium text-[rgb(var(--color-text-primary))]">
					{calculating ? "…" : fmt(subtotal)}
				</span>
			</div>

			<TaxRow label="CGST" amount={breakdown.cgst} />
			<TaxRow label="SGST" amount={breakdown.sgst} />
			<TaxRow label="IGST" amount={breakdown.igst} />
			<TaxRow label="UTGST" amount={breakdown.utgst} />

			{!breakdown.cgst &&
				!breakdown.sgst &&
				!breakdown.igst &&
				!breakdown.utgst && (
					<div className="flex justify-between text-[rgb(var(--color-text-secondary))]">
						<span>Tax</span>
						<span className="font-medium text-[rgb(var(--color-text-primary))]">
							{calculating ? "…" : fmt(taxTotal)}
						</span>
					</div>
				)}

			<div className="flex items-center justify-between pb-1 pt-0.5">
				<div className="flex items-center gap-1.5">
					<Tag className="w-3 h-3 text-[rgb(var(--color-primary))]" />
					<span className="text-[rgb(var(--color-text-secondary))] text-xs">
						Discount
					</span>
				</div>
				<div className="flex items-center gap-1">
					<span className="text-xs text-[rgb(var(--color-text-secondary))]">
						₹
					</span>
					<input
						type="number"
						min="0"
						value={globalDiscount}
						onChange={(e) =>
							setGlobalDiscount(Math.max(0, Number(e.target.value)))
						}
						placeholder="0"
						className="w-20 text-right text-xs px-2 py-1 rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))] transition-all"
					/>
					{discountAmt > 0 && (
						<span className="text-xs font-medium text-red-500">
							-{fmt(discountAmt)}
						</span>
					)}
				</div>
			</div>

			<div className="flex justify-between font-bold text-base border-t border-[rgb(var(--color-border-primary))] pt-2.5 mt-1">
				<span className="text-[rgb(var(--color-text-primary))] uppercase tracking-tight">
					Total
				</span>
				<span className="text-[rgb(var(--color-primary))] text-lg">
					{calculating ? "…" : fmt(grandTotal)}
				</span>
			</div>
		</div>
	);
};

export default CartSummary;
