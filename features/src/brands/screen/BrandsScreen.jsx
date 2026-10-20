"use client";
import { Button } from "@dragorbit/ui";

import { Plus } from "lucide-react";
import { Suspense } from "react";
import { BrandsTable } from "../component/BrandsTable.jsx";
export function BrandsScreen({ model }) {
	const {
		t,
		brands,
		canCreate,
		setShowDrawer,
		BrandDrawer,
		showDrawer,
		storeId,
		fetchBrands,
	} = model;
	return (
		<div className="overflow-hidden">
			<div className="max-w-8xl mx-auto w-full">
				<div className="flex items-center justify-between px-5 py-4">
					<div>
						<h1 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
							{t("sidebar.brands")}
						</h1>
						<p className="text-sm text-[rgb(var(--color-text-secondary))]">
							{model.loading && brands.length === 0 ? (
								<span
									role="img"
									aria-label={t("common.loading")}
									aria-busy="true"
									className="inline-block h-4 w-20 animate-pulse rounded bg-[rgb(var(--color-bg-tertiary))]"
								/>
							) : (
								<>
									{brands.length} {t("common.items")}
								</>
							)}
						</p>
					</div>
					{canCreate && (
						<Button leftIcon={Plus} onClick={() => setShowDrawer(true)}>
							{t("products.addNewBrand") || "Add Brand"}
						</Button>
					)}
				</div>

				<div className="px-5 pb-6">
					<BrandsTable model={model} />
				</div>
			</div>

			{showDrawer && (
				<Suspense fallback={null}>
					<BrandDrawer
						isOpen={showDrawer}
						onClose={() => setShowDrawer(false)}
						storeId={storeId}
						onBrandAdded={() => {
							setShowDrawer(false);
							fetchBrands();
						}}
					/>
				</Suspense>
			)}
		</div>
	);
}
