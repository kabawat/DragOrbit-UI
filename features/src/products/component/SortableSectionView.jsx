"use client";
import { GripVertical, Info } from "lucide-react";
import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dragorbit/ui";
export function SortableSectionPresentation({ model }) {
  const {
    setNodeRef,
    style,
    glassStyles,
    setIsHovered,
    attributes,
    listeners,
    isHovered,
    Icon,
    title,
    onInfoClick,
    id,
    t,
    subtitle,
    children,
  } = model;
  return (
    <div ref={setNodeRef} style={style} className="break-inside-avoid">
      <Card
        className={`relative ${glassStyles.card}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`absolute top-2 right-2 p-2 cursor-grab active:cursor-grabbing text-gray-600 z-50 ${glassStyles.dragHandle} ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <CardHeader className={`${glassStyles.header} pr-20`}>
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 backdrop-blur-sm rounded-lg ${glassStyles.icon}`}
            >
              <Icon className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <CardTitle className={`text-lg ${glassStyles.title}`}>
                  {title}
                </CardTitle>
                <button
                  onClick={() => onInfoClick(id)}
                  className="p-1 hover:bg-[rgb(var(--color-bg-secondary))] rounded-full transition-colors duration-200 group/info cursor-pointer"
                  title={t("products.sectionInformation")}
                >
                  <Info className="w-4 h-4 text-[rgb(var(--color-text-tertiary))] group-hover/info:text-[rgb(var(--color-primary))]" />
                </button>
              </div>
              <CardDescription className={glassStyles.description}>
                {subtitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardBody className={glassStyles.body}>{children}</CardBody>
      </Card>
    </div>
  );
}
