import type { GridLayout } from "@dragorbit/ui";
export interface StoreSummary {
	_id?: string;
	id?: string;
	storeId?: string;
	storeName: string;
	revenue?: number | string;
	profit?: number | string;
	customers?: number | string;
	products?: number | string;
	stockValue?: number | string;
	outOfStock?: number | string;
	payables?: number | string;
}
export interface DashboardRepository {
	getSummary(params: { storeId: string }): Promise<StoreSummary[] | null>;
	getCashbook?(params: { storeId: string }): Promise<{
		today?: { cashIn?: number; cashOut?: number; closingBalance?: number };
	} | null>;
}
export interface DashboardScreenProps {
	t: (key: string, params?: Record<string, unknown>) => string;
	repository: DashboardRepository;
	storeId?: string | null;
	ready?: boolean;
	isStaff?: boolean;
	permissions?: Array<{ module: string; read?: boolean }>;
	routes?: Record<string, string>;
	onNavigate?: (path: string) => void;
	scope?: string | null;
	statsLayout?: Partial<GridLayout>;
	actionsLayout?: Partial<GridLayout>;
	onSaveStats?: (layout: GridLayout) => void | Promise<void>;
	onSaveActions?: (layout: GridLayout) => void | Promise<void>;
	initialSummary?: StoreSummary[] | null;
	onSummary?: (rows: StoreSummary[]) => void;
	lowStockCount?: number;
	layoutVariant?: "overview" | "sectioned";
	sectionOrder?: Array<string | { id: string; visible?: boolean }>;
	onSaveSections?: (order: string[]) => void;
}
