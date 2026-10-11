"use client";
import { VariantDeleteDialog } from "../component/VariantDeleteDialog.jsx";
import { VariantsTable } from "../component/VariantsTable.jsx";

import { Plus } from "lucide-react";
import { Button } from "@dragorbit/ui";
export function VariantsScreen({ model }) {
	const { t, variants, can, variantToDelete, onCreate } = model;
	return (
		<div className="overflow-hidden">
			<div className="max-w-8xl mx-auto w-full">
				<div className="flex items-center justify-between px-5 py-4 gap-4 flex-wrap">
					<div>
						<h1 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
							{t("sidebar.variants")}
						</h1>
						<p className="text-sm text-[rgb(var(--color-text-secondary))]">
							{variants.length} {t("common.items") || "items"}
						</p>
					</div>
					{can("create") && (
						<Button variant="primary" leftIcon={Plus} onClick={onCreate}>
							{t("products.addVariant") || "Add variant"}
						</Button>
					)}
				</div>

				<div className="px-5 pb-6">
					<VariantsTable model={model} />
				</div>
			</div>

			{variantToDelete && <VariantDeleteDialog model={model} />}
		</div>
	);
}
