"use client";
import { ShoppingCart, Trash2, X } from "lucide-react";

const CartHeader = ({ cartCount, onClear, onClose }) => (
	<div className="flex-shrink-0 px-4 py-3 border-b border-[rgb(var(--color-border-primary))] flex items-center justify-between gap-2 bg-[rgb(var(--color-bg-primary))]">
		<div className="flex items-center gap-2 min-w-0">
			<ShoppingCart className="w-4 h-4 text-[rgb(var(--color-primary))] flex-shrink-0" />
			<span className="font-semibold text-[rgb(var(--color-text-primary))]">
				Cart
			</span>
			<span className="bg-[rgb(var(--color-primary))] text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center font-bold">
				{cartCount}
			</span>
		</div>
		<div className="flex items-center gap-2 flex-shrink-0">
			<button
				type="button"
				onClick={onClear}
				className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
				disabled={cartCount === 0}
			>
				<Trash2 className="w-3 h-3" /> Clear
			</button>
			{onClose && (
				<button
					type="button"
					onClick={onClose}
					className="lg:hidden p-1.5 rounded-md text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors cursor-pointer"
					aria-label="Close cart"
				>
					<X className="w-4 h-4" />
				</button>
			)}
		</div>
	</div>
);

export default CartHeader;
