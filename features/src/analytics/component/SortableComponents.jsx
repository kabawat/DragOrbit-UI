"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, TrendingUp } from "lucide-react";
import { Card } from "@dragorbit/ui";

// Map Tailwind gradient classes to CSS variable gradients
const getGradientStyle = (iconColor) => {
  const gradientMap = {
    "from-green-100 to-green-200": "var(--gradient-green)",
    "from-blue-100 to-blue-200": "var(--gradient-blue)",
    "from-purple-100 to-purple-200": "var(--gradient-purple)",
    "from-orange-100 to-orange-200": "var(--gradient-orange)",
    "from-amber-100 to-amber-200": "var(--gradient-orange)",
    "from-red-100 to-red-200": "var(--gradient-red)",
    "from-yellow-100 to-yellow-200": "var(--gradient-yellow)",
    "from-teal-100 to-teal-200": "var(--gradient-teal)",
    "from-gray-100 to-gray-200": "var(--gradient-gray)",
    "from-indigo-100 to-indigo-200": "var(--gradient-indigo)",
  };

  return gradientMap[iconColor] || "var(--gradient-gray)";
};

export const SortableMetricCard = ({
  id,
  title,
  value,
  change,
  subtext,
  icon: Icon,
  iconColor,
  textColor,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group h-full">
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="w-6 h-6 bg-[rgb(var(--color-bg-primary))] rounded border-[var(--color-border-primary-light)] flex items-center justify-center shadow-sm">
          <GripVertical className="w-3 h-3 text-[rgb(var(--color-text-secondary))]" />
        </div>
      </div>
      <Card
        className={`h-full backdrop-blur-md border-[var(--color-border-primary-light)] transition-all duration-300 relative overflow-hidden flex flex-col`}
        style={{ background: getGradientStyle(iconColor) }}
      >
        {/* Background Icon */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-3 opacity-10">
          <Icon className="w-13 h-13 text-[rgb(var(--color-text-primary))]" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 flex-1 min-w-0 flex flex-col">
          <div className="min-w-0">
            <p className="text-[rgb(var(--color-text-secondary))] text-xs font-medium truncate">
              {title}
            </p>
            <p className="text-[rgb(var(--color-text-primary))] text-xl font-bold mt-1">
              {value}
            </p>
            <p className="text-[rgb(var(--color-text-secondary))] text-xs flex items-center mt-1 truncate min-h-[1.25rem]">
              {(subtext != null && subtext !== "") ||
              (change != null && change !== "") ? (
                subtext != null && subtext !== "" ? (
                  <span className="truncate">{subtext}</span>
                ) : (
                  <>
                    <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{change}</span>
                  </>
                )
              ) : (
                <span className="invisible">&#8203;</span>
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const SortableCard = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="w-6 h-6 bg-[rgb(var(--color-bg-primary))] rounded border-[var(--color-border-primary-light)] flex items-center justify-center shadow-sm">
          <GripVertical className="w-3 h-3 text-[rgb(var(--color-text-secondary))]" />
        </div>
      </div>
      {children}
    </div>
  );
};

export const SortableSection = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="w-6 h-6 bg-[rgb(var(--color-bg-primary))] rounded border-[var(--color-border-primary-light)] flex items-center justify-center shadow-sm">
          <GripVertical className="w-3 h-3 text-[rgb(var(--color-text-secondary))]" />
        </div>
      </div>
      {children}
    </div>
  );
};
