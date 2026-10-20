import { renderDefaultVariant } from "./default/DefaultVariant";
import { renderMinimalVariant } from "./minimal/MinimalVariant";
import { renderStripedVariant } from "./striped/StripedVariant";

export const tableVariants = {
	default: renderDefaultVariant,
	minimal: renderMinimalVariant,
	striped: renderStripedVariant,
};
export type DataTableVariant = keyof typeof tableVariants;
