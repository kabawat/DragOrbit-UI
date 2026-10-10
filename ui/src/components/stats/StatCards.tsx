"use client";
import { EditableGrid } from "../layout/EditableGrid";
import type { EditableGridProps } from "../layout/EditableGrid";
import { StatCard } from "./StatCard";
import type { StatCardData } from "./StatCard";
export type StatItem = StatCardData & { id: string };
export type StatCardsProps = Omit<EditableGridProps<StatItem>, "renderItem">;
export function StatCards(props: StatCardsProps) {
	return (
		<EditableGrid
			{...props}
			renderItem={(item) => <StatCard data={item} loading={props.loading} />}
		/>
	);
}
export const StatCardRow = StatCards;
