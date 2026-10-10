"use client";
const tabButtonClass = (isActive) =>
	`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
		isActive
			? "bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] shadow-sm"
			: "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
	}`;

const CustomerViewTabs = ({ activeTab, onTabChange, t }) => (
	<div className="inline-flex p-1 rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]/50 shrink-0">
		<button
			type="button"
			onClick={() => onTabChange("details")}
			className={tabButtonClass(activeTab === "details")}
		>
			{t("khata.tabDetails")}
		</button>
		<button
			type="button"
			onClick={() => onTabChange("khata")}
			className={tabButtonClass(activeTab === "khata")}
		>
			{t("khata.tabKhata")}
		</button>
	</div>
);

export default CustomerViewTabs;
