"use client";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function Section({ id, children, visible = true }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });
	return (
		<div
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
				opacity: isDragging ? 0.5 : 1,
			}}
			className="relative group"
		>
			<button
				type="button"
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
				aria-label={`Move ${id} section`}
				className="absolute -left-2 top-2 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-grab active:cursor-grabbing p-1 bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded"
			>
				<GripVertical className="w-3 h-3 text-[rgb(var(--color-text-secondary))]" />
			</button>
			<div className={visible ? "" : "opacity-50 pointer-events-none"}>
				{children}
			</div>
		</div>
	);
}
export function normalizeSections(saved) {
	const defaults = ["storesSummary", "quickActions"];
	const ids = Array.isArray(saved)
		? saved.map((value) => (typeof value === "string" ? value : value?.id))
		: [];
	return [
		...new Set([...ids.filter((id) => defaults.includes(id)), ...defaults]),
	];
}
export function DashboardSections({
	sections,
	onSave,
	quickActions,
	storesSummary,
}) {
	const order = normalizeSections(sections);
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);
	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={({ active, over }) => {
				if (!over || active.id === over.id) return;
				const next = [...order],
					from = next.indexOf(active.id),
					to = next.indexOf(over.id);
				if (from < 0 || to < 0) return;
				next.splice(to, 0, next.splice(from, 1)[0]);
				onSave?.(next);
			}}
		>
			<SortableContext items={order} strategy={rectSortingStrategy}>
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{order.map((id) => (
						<div
							key={id}
							className={
								id === "storesSummary" ? "lg:col-span-3 min-w-0" : "min-w-0"
							}
						>
							<Section
								id={id}
								visible={
									sections?.find?.((section) => section?.id === id)?.visible !==
									false
								}
							>
								{id === "storesSummary" ? storesSummary : quickActions}
							</Section>
						</div>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
