"use client";
import { CategoriesTable } from "../component/CategoriesTable.jsx";

import { Plus } from "lucide-react";
import { Button } from "@dragorbit/ui";
import { Suspense } from "react";
export function CategoriesScreen({ model }) {
	const {
		t,
		categories,
		canCreate,
		setShowDrawer,
		CategoryDrawer,
		showDrawer,
		storeId,
		fetchCategories,
	} = model;
	return (
		<div className="overflow-hidden">
			<div className="max-w-8xl mx-auto w-full">
				<div className="flex items-center justify-between px-5 py-4">
					<div>
						<h1 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
							{t("sidebar.categories")}
						</h1>
						<p className="text-sm text-[rgb(var(--color-text-secondary))]">
							{categories.length} {t("common.items") || "items"}
						</p>
					</div>
					{canCreate && (
						<Button leftIcon={Plus} onClick={() => setShowDrawer(true)}>
							{t("products.addNewCategory") || "Add Category"}
						</Button>
					)}
				</div>

				<div className="px-5 pb-6">
					<CategoriesTable model={model} />
				</div>
			</div>

			{showDrawer && (
				<Suspense fallback={null}>
					<CategoryDrawer
						isOpen={showDrawer}
						onClose={() => setShowDrawer(false)}
						storeId={storeId}
						onCategoryAdded={() => {
							setShowDrawer(false);
							fetchCategories();
						}}
					/>
				</Suspense>
			)}
		</div>
	);
}
