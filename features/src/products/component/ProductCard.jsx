"use client";
import {
	ArrowDownToLine,
	Copy,
	Edit,
	Eye,
	Package,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge, IconButton } from "@dragorbit/ui";

const ProductCard = ({
	t,
	Image,
	currentVariant,
	getCategoryParts,
	product,
	onEdit,
	onDelete,
	onDuplicate,
	onViewDetails,
	onStockIn,
	className = "",
	canEdit = false,
	canDelete = false,
	...props
}) => {
	const [imageError, setImageError] = useState(false);
	const [openMenuId, setOpenMenuId] = useState(null);
	const menuRef = useRef(null);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setOpenMenuId(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const _getStockBadge = (stock) => {
		if (stock === 0) {
			return <Badge variant="danger">{t("products.outOfStock")}</Badge>;
		} else if (stock < 10) {
			return <Badge variant="warning">{t("products.lowStock")}</Badge>;
		} else {
			return (
				<Badge variant="success">
					{stock} {t("products.inStock")}
				</Badge>
			);
		}
	};

	const calculateDiscount = (sellingPrice, mrp) => {
		if (!mrp || mrp <= sellingPrice) return 0;
		return Math.round(((mrp - sellingPrice) / mrp) * 100);
	};

	const discount = calculateDiscount(product.sellingPrice, product.mrp);

	const getCategoryBadgeClass = (color) => {
		// We use a mapping for common colors or fallback to arbitrary values
		const colorMap = {
			"#6b7280": "bg-gray-500/20 text-gray-500/80 border-gray-500/20",
			"#8b5cf6": "bg-violet-500/20 text-violet-500/80 border-violet-500/20",
			"#3b82f6": "bg-blue-500/20 text-blue-500/80 border-blue-500/20",
		};
		return `${colorMap[color] || ""} inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium border dark:border-opacity-50`;
	};

	const _actionMenuItems = useMemo(() => {
		const items = [
			{
				value: "view",
				label: t("common.viewDetails"),
				icon: Eye,
				onClick: () => onViewDetails?.(product.id),
			},
		];

		if (canEdit) {
			items.push(
				{
					value: "stock-in",
					label: t("products.stockIn"),
					icon: ArrowDownToLine,
					onClick: () => onStockIn?.(product.id),
					className: "text-green-600 hover:text-green-700",
				},
				{
					value: "edit",
					label: t("common.edit"),
					icon: Edit,
					onClick: () => onEdit?.(product.id),
				},
				{
					value: "duplicate",
					label: t("common.duplicate"),
					icon: Copy,
					onClick: () => onDuplicate?.(product.id),
				},
			);
		}

		if (canDelete) {
			items.push({
				value: "delete",
				label: t("common.delete"),
				icon: Trash2,
				onClick: () => onDelete?.(product.id),
			});
		}

		return items;
	}, [
		t,
		product.id,
		canEdit,
		canDelete,
		onEdit,
		onDelete,
		onDuplicate,
		onViewDetails,
		onStockIn,
	]);

	const handleMenuToggle = (productId) => {
		setOpenMenuId(openMenuId === productId ? null : productId);
	};

	const handleMenuAction = (productId, action) => {
		setOpenMenuId(null);
		switch (action) {
			case "view":
				onViewDetails?.(productId);
				break;
			case "stock-in":
				onStockIn?.(productId);
				break;
			case "edit":
				onEdit?.(productId);
				break;
			case "duplicate":
				onDuplicate?.(productId);
				break;
			case "delete":
				onDelete?.(productId);
				break;
			default:
				break;
		}
	};
	// Grid view - Modern Card Design
	return (
		<div
			className={`w-full max-w-sm mx-auto rounded-xl border border-[rgb(var(--color-border-primary))] transition-all duration-300 ease-out group overflow-hidden ${className}`}
			{...props}
		>
			{/* Product Image with Gradient Overlay */}
			<div className="w-full h-32 sm:h-36 md:h-40 bg-gradient-to-br relative">
				<div className="w-full h-full overflow-hidden rounded-t-xl relative">
					{product.image &&
						typeof product.image === "string" &&
						product.image.trim() &&
						!imageError ? (
						<Image
							src={product.image}
							alt={product.name}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
							className="object-cover transition-transform duration-300"
							onError={() => setImageError(true)}
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-[rgb(var(--color-text-secondary))]">
							<Package className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[rgb(var(--color-text-secondary))]" />
						</div>
					)}
				</div>

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-xl"></div>

				{/* Catalog Status Badge */}
				<div className="absolute top-4 left-4 z-10">
					{product.showInCatalog !== false ? (
						<Badge variant="success" className="shadow-sm" size="sm">
							{t("products.inCatalog")}
						</Badge>
					) : (
						<Badge variant="secondary" className="shadow-sm">
							{t("products.hidden")}
						</Badge>
					)}
				</div>

				{/* Action Menu */}
				<div className="absolute top-4 right-4 z-10">
					<div className="relative" ref={menuRef}>
						<IconButton onClick={() => handleMenuToggle(product.id)} />

						{/* Popup Menu */}
						{openMenuId === product.id && (
							<div className="absolute right-0 top-full mt-1 w-48 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-[9999]">
								{_actionMenuItems.map((item) => (
									<button
										key={item.value}
										onClick={() => handleMenuAction(product.id, item.value)}
										className={`w-full px-4 py-2 text-left text-sm ${item.className || "text-[rgb(var(--color-text-primary))]"} hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-3 transition-colors duration-200 cursor-pointer focus:outline-none focus:bg-[rgb(var(--color-bg-secondary))]`}
									>
										<item.icon
											className={`w-4 h-4 ${item.className ? "" : "text-[rgb(var(--color-text-secondary))]"}`}
										/>
										{item.label}
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Product Info */}
			<div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4">
				{/* Product Name */}
				<div>
					<h3 className="font-bold text-sm sm:text-md mb-1 text-[rgb(var(--color-text-primary))]">
						{product.name}
					</h3>
					<div className="flex gap-2 items-center">
						<p className="text-xs sm:text-sm font-medium text-[rgb(var(--color-text-secondary))]">
							{product.brand}
						</p>
						{/* Category Tags */}
						<span className="flex flex-wrap gap-1 sm:gap-2">
							{(() => {
								let categoryParts = [];
								const rawCategory = product.category;

								if (Array.isArray(rawCategory)) {
									categoryParts = rawCategory.filter(Boolean);
								} else if (typeof rawCategory === "string" && rawCategory.trim()) {
									categoryParts = rawCategory.split(" > ").filter(Boolean);
								} else if (
									rawCategory &&
									typeof rawCategory === "object" &&
									rawCategory.name
								) {
									// Handle object with name property (from API)
									categoryParts = [rawCategory.name];
								} else if (rawCategory) {
									categoryParts = [String(rawCategory)];
								}

								if (getCategoryParts) categoryParts = getCategoryParts(product);

								if (categoryParts.length === 0) {
									return (
										<span className={getCategoryBadgeClass("#6b7280")}>
											{t("products.uncategorized")}
										</span>
									);
								}
								return (
									<>
										<span className={getCategoryBadgeClass("#8b5cf6")}>
											{categoryParts[0]}
										</span>
										{categoryParts[1] && (
											<span className={getCategoryBadgeClass("#3b82f6")}>
												{categoryParts[1]}
											</span>
										)}
									</>
								);
							})()}
						</span>
					</div>
				</div>


				{/* Stock Info */}
				<div className="flex items-center justify-between">
					<div className="text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
						<span className="font-medium">{t("products.stock")}:</span>{" "}
						{product.stock} {t("products.units")}
					</div>
					<div className="text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
						<span className="font-medium">{t("products.sku")}:</span>{" "}
						{product.sku}
					</div>
				</div>

				{/* Pricing Section */}
				<div className="pt-2 sm:pt-3 md:pt-4 space-y-1 sm:space-y-1.5 md:space-y-2 border-t border-[rgb(var(--color-border-primary))]">
					<div className="flex items-center justify-between">
						<span className="text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
							{t("products.sellingPrice")}
						</span>
						<span className="text-sm sm:text-base md:text-lg font-bold text-[rgb(var(--color-text-primary))]">
							₹{product.sellingPrice.toLocaleString()}
						</span>
					</div>
					{product.mrp > product.sellingPrice && (
						<div className="flex items-center justify-between">
							<span className="text-xs sm:text-sm text-[rgb(var(--color-text-secondary))]">
								{t("products.mrp")}
							</span>
							<span className="text-xs sm:text-sm line-through text-[rgb(var(--color-text-secondary))]">
								₹{product.mrp.toLocaleString()}
							</span>
						</div>
					)}
					{discount > 0 && (
						<div className="flex items-center justify-between">
							<span className="text-xs sm:text-sm text-green-500 font-medium">
								{t("products.discount")}
							</span>
							<span className="text-xs sm:text-sm text-green-500 font-medium">
								{discount}% off
							</span>
						</div>
					)}
				</div>

				{/* Last Updated */}
				<div className="text-xs text-center pt-1.5 border-t text-[rgb(var(--color-text-secondary))] border-[rgb(var(--color-border-primary))]">
					{t("common.lastUpdated")}: {product.lastUpdated}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
