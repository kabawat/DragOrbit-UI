"use client";
import { Plus } from "lucide-react";
const fmt = (n) =>
	"₹" +
	Number(n || 0).toLocaleString("en-IN", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
const getProductImageUrl = (product) => {
	const first = product?.images?.[0];
	return typeof first === "string" ? first : first?.url || null;
};

export default function ProductCard({
	product,
	onAdd,
	viewMode,
	getProductPrice = (product) =>
		Number(
			product?.sellingPrice ??
				product?.pricing?.sellingPrice ??
				product?.price ??
				0,
		),
}) {
	const isGrid = viewMode === "grid";
	const imageUrl = getProductImageUrl(product);
	const price = getProductPrice(product);

	if (isGrid) {
		return (
			<button
				type="button"
				onClick={() => onAdd(product)}
				className="group w-full h-full p-2 bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-xl transition-all duration-300 hover:border-[rgb(var(--color-primary))] text-left overflow-hidden cursor-pointer flex flex-col gap-2 relative"
			>
				<div className="bg-[rgb(var(--color-bg-secondary))] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden w-full h-20 sm:h-24 md:h-28 relative">
					{imageUrl ? (
						<img
							src={imageUrl}
							alt={product.name}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
						/>
					) : (
						<span className="text-3xl opacity-50">📦</span>
					)}
					<div className="absolute bottom-1 right-1 bg-[rgb(var(--color-primary))] text-white text-[0.625rem] font-bold px-1.5 py-0.5 rounded">
						{fmt(price)}
					</div>
				</div>
				<div className="min-w-0 w-full px-1 flex-1 flex flex-col justify-between pb-1">
					<div>
						<p className="text-[0.6875rem] font-bold text-[rgb(var(--color-text-primary))] leading-[1.2] line-clamp-2 mb-0.5">
							{product.name}
						</p>
						<p className="text-[0.5625rem] text-[rgb(var(--color-text-secondary))] font-medium truncate uppercase tracking-wider">
							{product.sku || "NO SKU"}
						</p>
					</div>
					<div className="flex items-center justify-between mt-auto">
						<span className="text-xs font-black text-[rgb(var(--color-primary))]">
							{fmt(price)}
						</span>
						<div className="w-5 h-5 rounded-full bg-[rgb(var(--color-primary))]/10 flex items-center justify-center text-[rgb(var(--color-primary))] group-hover:bg-[rgb(var(--color-primary))] group-hover:text-white transition-colors duration-200">
							<Plus className="w-3 h-3" strokeWidth={3} />
						</div>
					</div>
				</div>
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={() => onAdd(product)}
			className="group w-full relative bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-xl transition-all duration-200 hover:border-[rgb(var(--color-primary))] text-left overflow-hidden flex-shrink-0 p-2.5 flex items-center gap-3 cursor-pointer"
		>
			<div className="bg-[rgb(var(--color-bg-secondary))] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden w-14 h-14 border border-[rgb(var(--color-border-primary))]">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={product.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				) : (
					<span className="text-2xl opacity-40">📦</span>
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between gap-2">
					<p className="text-sm font-semibold text-[rgb(var(--color-text-primary))] truncate">
						{product.name}
					</p>
					<span className="text-sm font-black text-[rgb(var(--color-primary))] whitespace-nowrap">
						{fmt(price)}
					</span>
				</div>
				<div className="flex items-center gap-2 mt-1">
					<span className="text-[0.625rem] bg-[rgb(var(--color-bg-secondary))] px-1.5 py-0.5 rounded border border-[rgb(var(--color-border-primary))] text-[rgb(var(--color-text-secondary))] font-mono">
						{product.sku || "N/A"}
					</span>
				</div>
			</div>
			<div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
				<div className="w-8 h-8 rounded-full bg-[rgb(var(--color-primary))] text-white flex items-center justify-center">
					<Plus className="w-5 h-5" strokeWidth={2.5} />
				</div>
			</div>
		</button>
	);
}
