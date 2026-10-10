"use client";
import { EmptyState } from "@dragorbit/ui";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import CartItem from "./CartItem.jsx";
import DiscountModal from "./DiscountModal.jsx";

const CartItemsList = ({ cart, setCart, getProductPrice }) => {
	const [showDiscountModal, setShowDiscountModal] = useState(null);
	const [discountInput, setDiscountInput] = useState("");

	const increaseQty = (id) =>
		setCart((prev) =>
			prev.map((i) => ((i.id || i._id) === id ? { ...i, qty: i.qty + 1 } : i)),
		);

	const decreaseQty = (id) =>
		setCart((prev) =>
			prev.map((i) =>
				(i.id || i._id) === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i,
			),
		);

	const removeItem = (id) =>
		setCart((prev) => prev.filter((i) => (i.id || i._id) !== id));

	const openDiscountModal = (id, currentDiscount) => {
		setShowDiscountModal(id);
		setDiscountInput(String(currentDiscount || ""));
	};

	const applyItemDiscount = () => {
		const val = parseFloat(discountInput) || 0;
		setCart((prev) =>
			prev.map((i) =>
				(i.id || i._id) === showDiscountModal
					? { ...i, discount: Math.min(100, Math.max(0, val)) }
					: i,
			),
		);
		setShowDiscountModal(null);
		setDiscountInput("");
	};

	return (
		<div
			className={`flex-1 overflow-y-auto px-4 min-h-0 custom-scrollbar ${cart.length === 0 ? "flex flex-col" : "divide-y divide-[rgb(var(--color-border-primary))]"}`}
		>
			{cart.length === 0 ? (
				<EmptyState
					title="Your cart is empty"
					description="Pick products from the menu to start billing."
					icon={ShoppingCart}
					fullHeight={true}
				/>
			) : (
				cart.map((item) => {
					const itemId = item.id || item._id;
					return (
						<CartItem
							getProductPrice={getProductPrice}
							key={itemId}
							item={item}
							onIncrease={() => increaseQty(itemId)}
							onDecrease={() => decreaseQty(itemId)}
							onRemove={() => removeItem(itemId)}
							onDiscount={() => openDiscountModal(itemId, item.discount)}
						/>
					);
				})
			)}

			<DiscountModal
				isOpen={!!showDiscountModal}
				discountInput={discountInput}
				setDiscountInput={setDiscountInput}
				onClose={() => {
					setShowDiscountModal(null);
					setDiscountInput("");
				}}
				onApply={applyItemDiscount}
			/>
		</div>
	);
};

export default CartItemsList;
