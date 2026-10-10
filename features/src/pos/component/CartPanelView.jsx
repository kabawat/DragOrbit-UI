"use client";
import CartHeader from "./CartHeader.jsx";
import CartItemsList from "./CartItemsList.jsx";
import CartSummary from "./CartSummary.jsx";
export function CartPanelView({ model }) {
	const {
		mobileOpen,
		itemCount,
		setCart,
		onMobileClose,
		cart,
		subtotal,
		taxTotal,
		gstBreakdown,
		discountAmt,
		globalDiscount,
		setGlobalDiscount,
		grandTotal,
		calculating,
		getProductPrice,
		customerSearch,
		paymentSection,
	} = model;
	return (
		<div
			className={`
                flex flex-col bg-[rgb(var(--color-bg-primary))] border-[rgb(var(--color-border-primary))] overflow-hidden transition-transform duration-300 ease-out
                absolute top-0 right-0 bottom-0 w-full max-w-md z-50 shadow-2xl border-l border-[rgb(var(--color-border-primary))]
                lg:relative lg:inset-auto lg:z-10 lg:w-80 xl:w-96 lg:max-w-none lg:shadow-none
                ${mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
            `}
		>
			<CartHeader
				cartCount={itemCount}
				onClear={() => setCart([])}
				onClose={onMobileClose}
			/>

			{customerSearch}

			<CartItemsList
				getProductPrice={getProductPrice}
				cart={cart}
				setCart={setCart}
			/>

			{cart.length > 0 && (
				<div className="flex-shrink-0 animate-in slide-in-from-bottom duration-500 border-t border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))]">
					<CartSummary
						subtotal={subtotal}
						taxTotal={taxTotal}
						gstBreakdown={gstBreakdown}
						discountAmt={discountAmt}
						globalDiscount={globalDiscount}
						setGlobalDiscount={setGlobalDiscount}
						grandTotal={grandTotal}
						calculating={calculating}
					/>

					{paymentSection}
				</div>
			)}
		</div>
	);
}
