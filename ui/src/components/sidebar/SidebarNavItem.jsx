"use client";
import { ChevronDown, Crown } from "lucide-react";
export const SidebarNavItem = ({
	item,
	isCollapsed,
	onMouseEnterItem = () => {},
	onMouseLeaveItem = () => {},
	isBottomItem = false,
	pathname = "",
	expandedMenus = {},
	onToggleMenu,
	onNavigate,
	isItemLocked = () => false,
}) => {
	const handleToggleSubMenu = (item, e) => {
		e?.preventDefault();
		onToggleMenu?.(item.key);
	};
	const Icon = item.icon;

	if (item.hasSubMenu && item.key) {
		const isExpanded = expandedMenus[item.key];
		const isChildActive =
			isCollapsed &&
			item.subMenuItems?.some(
				(sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`),
			);

		return (
			<div className="relative">
				<button
					type="button"
					aria-expanded={isCollapsed ? undefined : !!isExpanded}
					onClick={(e) =>
						isCollapsed
							? onMouseEnterItem(item, e, isBottomItem)
							: handleToggleSubMenu(item, e)
					}
					onFocus={(e) => onMouseEnterItem(item, e, isBottomItem)}
					onMouseEnter={(e) => onMouseEnterItem(item, e, isBottomItem)}
					onMouseLeave={onMouseLeaveItem}
					className={`group flex min-h-9 w-full items-center ${
						isCollapsed ? "justify-center px-0" : "justify-between gap-2 px-2"
					} py-1.5 cursor-pointer rounded-lg transition-colors text-[rgb(var(--color-text-secondary))] ${
						isChildActive
							? "bg-[rgb(var(--color-primary))]/10"
							: "hover:bg-[rgb(var(--color-bg-secondary))]"
					} ${isExpanded && !isCollapsed ? "bg-[rgb(var(--color-bg-secondary))]" : ""}`}
					title={isCollapsed ? item.name : ""}
				>
					{!isCollapsed ? (
						<div className="flex min-w-0 items-center gap-3 text-[rgb(var(--color-text-secondary))]">
							<Icon
								className={`h-4 w-4 shrink-0 transition-colors ${isExpanded ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-tertiary))]"}`}
							/>
							<span
								className={`min-w-0 truncate whitespace-nowrap text-xs font-semibold uppercase leading-5 tracking-wide transition-colors ${isExpanded ? "text-[rgb(var(--color-primary))]" : ""}`}
							>
								{item.name}
							</span>
						</div>
					) : (
						<Icon
							className={`w-[18px] h-[18px] transition-colors ${isChildActive ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-tertiary))]"}`}
						/>
					)}

					{!isCollapsed && (
						<ChevronDown
							className={`h-4 w-4 shrink-0 text-[rgb(var(--color-text-tertiary))] transition-all duration-100 ${isExpanded ? "rotate-180 opacity-100 text-[rgb(var(--color-primary))]" : "opacity-50 group-hover:opacity-100"}`}
						/>
					)}
				</button>

				<div
					inert={!(isExpanded && !isCollapsed) ? true : undefined}
					className={`overflow-hidden transition-[max-height,opacity] duration-100 ease-out ${
						isExpanded && !isCollapsed
							? "max-h-[960px] opacity-100 mt-1"
							: "max-h-0 opacity-0"
					}`}
				>
					<div className="relative ml-4 space-y-0.5 pl-2">
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-y-1 left-0 border-l border-dashed border-[rgb(var(--color-border-primary))]/70"
						/>
						{item.subMenuItems?.map((subItem, index) => {
							const SubIcon = subItem.icon;
							const isSubActive =
								pathname === subItem.href ||
								pathname.startsWith(`${subItem.href}/`);
							const locked = isItemLocked(subItem);
							const prevGroup = item.subMenuItems[index - 1]?.group;
							const showGroupHeader =
								subItem.group && subItem.group !== prevGroup;
							return (
								<div key={`${subItem.href}-${subItem.name}`}>
									{showGroupHeader && (
										<div
											className={`px-2.5 pt-2 pb-1 text-[0.625rem] font-bold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))] ${
												index === 0 ? "pt-0.5" : "mt-1"
											}`}
										>
											{subItem.group}
										</div>
									)}
									<a
										aria-current={isSubActive ? "page" : undefined}
										href={subItem.href}
										onClick={(e) => {
											if (!onNavigate) return;
											e.preventDefault();
											onNavigate?.(subItem);
										}}
										className={`group relative flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-all duration-100 ${
											isSubActive
												? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]"
												: "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))]"
										} ${locked ? "opacity-75" : ""}`}
										title={
											subItem.shortcut
												? `Alt+${subItem.shortcut.toUpperCase()}`
												: ""
										}
									>
										{!isSubActive && (
											<span
												aria-hidden="true"
												className="pointer-events-none absolute top-1/2 -left-[11px] h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))]"
											/>
										)}
										<div className="relative shrink-0">
											<SubIcon
												className={`h-4 w-4 ${isSubActive ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-tertiary))]"}`}
											/>
										</div>
										<span className="min-w-0 flex-1 truncate whitespace-nowrap text-sm font-medium leading-5">
											{subItem.name}
										</span>
										{locked && (
											<Crown
												size={12}
												className="shrink-0 fill-[#f59e0b]/20 text-[#f59e0b]"
											/>
										)}
										{isSubActive && (
											<span
												aria-hidden="true"
												className="pointer-events-none absolute top-1/2 -left-2.5 h-4/5 w-1 -translate-y-1/2 rounded-full bg-[rgb(var(--color-primary))]"
											/>
										)}
									</a>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

	const isActive = pathname === item.href;
	const bottomSpecificClasses = isBottomItem
		? `min-h-9 px-2 py-1.5 ${isCollapsed ? "justify-center" : "gap-3"}`
		: `min-h-9 py-1.5 ${isCollapsed ? "justify-center px-0" : "gap-3 px-2"}`;

	const iconClasses = isBottomItem
		? `${isCollapsed ? "w-[24px] h-[24px]" : "w-5 h-5"} text-[rgb(var(--color-text-tertiary))]`
		: `${isCollapsed ? "w-[18px] h-[18px]" : "w-4 h-4"} ${
				isActive
					? "text-[rgb(var(--color-primary))]"
					: "text-[rgb(var(--color-text-tertiary))]"
			}`;

	const locked = isItemLocked(item);

	return (
		<div>
			<a
				aria-current={isActive ? "page" : undefined}
				href={item.href}
				onMouseEnter={(e) => onMouseEnterItem(item, e, isBottomItem)}
				onMouseLeave={onMouseLeaveItem}
				onClick={(e) => {
					if (!onNavigate) return;
					e.preventDefault();
					onNavigate?.(item);
				}}
				className={`relative flex w-full items-center overflow-hidden rounded-lg transition-all duration-300 cursor-pointer ${bottomSpecificClasses} ${
					isActive
						? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]"
						: "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))]"
				} ${locked ? "opacity-75" : ""}`}
				title={
					isCollapsed && item.shortcut
						? `${item.name}  ⌥${item.shortcut.toUpperCase()}`
						: isCollapsed
							? item.name
							: ""
				}
			>
				<div className="relative shrink-0">
					<Icon className={`transition-all duration-300 ${iconClasses}`} />
					{isCollapsed && locked && (
						<div className="absolute -top-1 -right-1 bg-[#f59e0b] text-white rounded-full p-0.5 shadow-sm">
							<Crown size={8} className="fill-white/30" />
						</div>
					)}
				</div>
				{!isCollapsed && (
					<span
						className={`min-w-0 flex-1 truncate whitespace-nowrap font-medium leading-5 ${isBottomItem ? "" : "text-sm"}`}
					>
						{item.name}
					</span>
				)}
				{!isCollapsed && locked && (
					<Crown
						size={14}
						className="shrink-0 fill-[#f59e0b]/20 text-[#f59e0b]"
					/>
				)}
				{isActive && !isBottomItem && (
					<span
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 left-0 h-4/5 w-1 -translate-y-1/2 rounded-r-full bg-[rgb(var(--color-primary))]"
					/>
				)}
			</a>
		</div>
	);
};
