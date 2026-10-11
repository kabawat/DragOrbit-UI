"use client";
import { ChevronRight } from "lucide-react";
export function SupportScreen({ model }) {
  const {
    tabs,
    activeTab,
    handleTabChange,
    SuggestionsTab,
    HelpTab,
    ShortcutsTab,
  } = model;
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar Navigation (100% Match with Settings Page) */}
      <div className="w-64 bg-[rgb(var(--color-bg-primary))]/20 backdrop-blur-md border-r border-[rgb(var(--color-border-primary))]/50 flex-shrink-0">
        <div className="p-4">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))]/20"
                      : "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-primary))]/30 hover:text-[rgb(var(--color-text-primary))]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Content Area (Match Settings Page Padding) */}
      <div className="flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
        <div className="w-full h-full mx-auto">
          {activeTab === "suggestions" && <SuggestionsTab />}
          {activeTab === "help" && <HelpTab />}
          {activeTab === "shortcuts" && <ShortcutsTab />}
        </div>
      </div>
    </div>
  );
}
