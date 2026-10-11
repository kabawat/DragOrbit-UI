"use client";
import { ChevronRight } from "lucide-react";
import { Card, CardBody } from "@dragorbit/ui";
export function ManagementShortcutsView({ model }) {
  const { links, pathname, Link, getLinkProps } = model;
  return (
    <Card className="bg-[rgb(var(--color-bg-primary))] border-[rgb(var(--color-border-primary))] rounded-xl overflow-hidden shadow-none">
      <CardBody className="p-4 shadow-none">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
            Quick Management
          </h3>
          <div className="flex gap-1.5 opacity-30">
            <div className="w-1 h-1 rounded-full bg-[rgb(var(--color-primary))]" />
            <div className="w-1 h-1 rounded-full bg-[rgb(var(--color-primary))]" />
          </div>
        </div>

        <div className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                {...getLinkProps(link)}
                className={`group flex items-center justify-between p-2.5 rounded-xl transition-all border shadow-none ${
                  isActive
                    ? "bg-[rgb(var(--color-primary))]/5 border-[rgb(var(--color-primary))]/30"
                    : "hover:bg-[rgb(var(--color-bg-secondary))] border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`p-2 rounded-xl ${link.bg} ${link.color} flex-shrink-0 shadow-none transition-colors`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span
                      className={`text-sm font-medium transition-colors line-clamp-1 ${isActive ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-primary))]"}`}
                    >
                      {link.name}
                    </span>
                    <span className="text-xs text-[rgb(var(--color-text-secondary))] line-clamp-1">
                      {link.desc}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <kbd
                    className={`flex items-center justify-center min-w-[22px] h-5 rounded-md border border-[rgb(var(--color-border-primary))] text-xs font-medium px-1.5 shadow-none ${isActive ? "bg-[rgb(var(--color-primary))] text-white border-transparent" : "bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-tertiary))]"}`}
                  >
                    ⌥{link.key}
                  </kbd>
                  {!isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))] transition-transform" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
