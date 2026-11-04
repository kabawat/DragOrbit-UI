"use client";
import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,Tooltip as SharedTooltip, } from "@dragorbit/ui";
import { GripVertical, Info } from "lucide-react";
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
        className={`relative !p-4 sm:!p-5 shadow-sm rounded-xl border border-[rgb(var(--color-border-primary))] ${glassStyles.card}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`absolute top-2 right-2 p-1.5 rounded-md cursor-grab active:cursor-grabbing text-gray-500 z-50 ${glassStyles.dragHandle} ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity`}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        <CardHeader className={`${glassStyles.header} pr-12 !pb-2.5 !mb-3 border-b border-[rgb(var(--color-border-primary)/0.6)]`}>
          <div className="flex items-center space-x-2.5">
            <div
              className={`p-1.5 backdrop-blur-sm rounded-lg shrink-0 ${glassStyles.icon}`}
            >
              <Icon className="w-4 h-4 text-[rgb(var(--color-primary))]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <CardTitle className={`text-sm sm:text-base font-semibold truncate ${glassStyles.title}`}>
                  {title}
                </CardTitle>
                <SharedTooltip content={t("products.sectionInformation")}>
                  <button
                    type="button"
                    aria-label={t("products.sectionInformation")}
                    onClick={() => onInfoClick(id)}
                    className="p-0.5 hover:bg-[rgb(var(--color-bg-secondary))] rounded-full transition-colors duration-200 group/info cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))] group-hover/info:text-[rgb(var(--color-primary))]" />
                  </button>
                </SharedTooltip>
              </div>
              <CardDescription className={`text-xs ${glassStyles.description} mt-0.5 truncate`}>
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
