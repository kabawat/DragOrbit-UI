import type { GridLayout } from "@dragorbit/ui";
import type { ComponentType } from "react";
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
	getSalesTrend?(params: { storeId: string; days: number }): Promise<DashboardSalesTrendPoint[]>;
	getCashbook?(params: { storeId: string }): Promise<{
		today?: { cashIn?: number; cashOut?: number; closingBalance?: number };
	} | null>;
}
export interface DashboardSalesTrendPoint {
	date: string;
	dateLabel: string;
	label: string;
	revenue: number;
	sales: number;
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
	layoutVariant?: "overview" | "sectioned" | "store";
	storeOverview?: ComponentType<{
		summary: StoreSummary[];
		metrics: Array<{ id: string; title: string; value: string }>;
		loading: boolean;
		t: (key: string) => string;
	}>;
	intelligencePanel?: ComponentType<{ summary: StoreSummary[] }>;
	salesTrendPanel?: ComponentType<{
		data: DashboardSalesTrendPoint[];
		loading: boolean;
		error?: string | null;
		selectedDays: number;
		onRangeChange: (days: number) => void;
		onNavigate?: (path: string) => void;
	}>;
	sectionOrder?: Array<string | { id: string; visible?: boolean }>;
	onSaveSections?: (order: string[]) => void;
}
