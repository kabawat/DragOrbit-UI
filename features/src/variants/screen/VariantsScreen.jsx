"use client";
import { Button } from "@dragorbit/ui";
import { Plus } from "lucide-react";
import { VariantDeleteDialog } from "../component/VariantDeleteDialog.jsx";
import { VariantsTable } from "../component/VariantsTable.jsx";
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
							{model.loading && variants.length === 0 ? (
								<span
									role="img"
									aria-label={t("common.loading")}
									aria-busy="true"
									className="inline-block h-4 w-20 animate-pulse rounded bg-[rgb(var(--color-bg-tertiary))]"
								/>
							) : (
								<>
									{variants.length} {t("common.items")}
								</>
							)}
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
