"use client";

import {
	BrainCircuit,
	FileText,
	IndianRupee,
	Package,
	Plus,
	Users,
	Wallet,
} from "lucide-react";
import styles from "./chat-panel.module.css";

function HistoryGroup({ label, items, activeId, onSelect }) {
	if (!items?.length) return null;
	return (
		<div className="mb-5">
			<p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[rgb(var(--color-text-secondary))]">
				{label}
			</p>
			<ul className="space-y-0.5">
				{items.map((session) => {
					const active = session.id === activeId;
					return (
						<li key={session.id}>
							<button
								className={`w-full cursor-pointer truncate rounded-xl px-2.5 py-2.5 text-left text-[13px] leading-4 transition-colors ${
									active
										? "ai-chat-accent bg-[rgb(var(--color-primary))]/15 font-medium"
										: "text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-tertiary))]"
								}`}
								onClick={() => onSelect(session)}
								style={
									active ? { color: "rgb(var(--color-primary))" } : undefined
								}
								type="button"
							>
								{session.title}
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

const QUICK_PROMPTS = [
	{
		key: "revenue",
		icon: IndianRupee,
		titleKey: "voice.quick.revenueTitle",
		hintKey: "voice.quick.revenueHint",
		promptKey: "voice.quick.revenuePrompt",
	},
	{
		key: "dues",
		icon: Users,
		titleKey: "voice.quick.duesTitle",
		hintKey: "voice.quick.duesHint",
		promptKey: "voice.quick.duesPrompt",
	},
	{
		key: "stock",
		icon: Package,
		titleKey: "voice.quick.stockTitle",
		hintKey: "voice.quick.stockHint",
		promptKey: "voice.quick.stockPrompt",
	},
	{
		key: "invoice",
		icon: FileText,
		titleKey: "voice.quick.invoiceTitle",
		hintKey: "voice.quick.invoiceHint",
		promptKey: "voice.quick.invoicePrompt",
	},
];

/**
 * One responsive workspace; columns follow the panel width, including while resizing.
 */
export default function ChatWorkspace({
	t,
	greeting,
	storeName,
	storeGst,
	historyGrouped,
	historyLoading = false,
	historyError = null,
	activeSessionId,
	onNewChat,
	onSelectSession,
	hasThread,
	emptyHint,
	children,
	composer,
	aiStatus,
	onQuickPrompt,
}) {
	const hasHistory =
		historyGrouped.today.length > 0 ||
		historyGrouped.yesterday.length > 0 ||
		historyGrouped.week.length > 0 ||
		historyGrouped.older.length > 0;

	return (
		<div className={styles.workspace}>
			{/* Left: history */}
			<aside
				className={`${styles.history} min-h-0 flex-col border-r border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]`}
			>
				<div className="shrink-0 p-3.5 pb-2">
					<button
						className="ai-chat-on-primary flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[rgb(var(--color-primary))] px-3 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-90"
						onClick={onNewChat}
						style={{ color: "#fff" }}
						type="button"
					>
						<Plus className="h-4 w-4" strokeWidth={2.5} />
						{t("voice.newChat")}
					</button>
				</div>
				<div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2.5 pb-4 pt-1">
					{historyLoading && !hasHistory ? (
						<p className="px-2 py-8 text-center text-[12px] leading-5 text-[rgb(var(--color-text-secondary))]">
							{t("voice.history.loading")}
						</p>
					) : historyError && !hasHistory ? (
						<p className="px-2 py-8 text-center text-[12px] leading-5 text-[rgb(var(--color-danger))]">
							{t("voice.history.loadFailed")}
						</p>
					) : (
						<>
							<HistoryGroup
								activeId={activeSessionId}
								items={historyGrouped.today}
								label={t("voice.history.today")}
								onSelect={onSelectSession}
							/>
							<HistoryGroup
								activeId={activeSessionId}
								items={historyGrouped.yesterday}
								label={t("voice.history.yesterday")}
								onSelect={onSelectSession}
							/>
							<HistoryGroup
								activeId={activeSessionId}
								items={historyGrouped.week}
								label={t("voice.history.week")}
								onSelect={onSelectSession}
							/>
							<HistoryGroup
								activeId={activeSessionId}
								items={historyGrouped.older}
								label={t("voice.history.older")}
								onSelect={onSelectSession}
							/>
							{!hasHistory && (
								<p className="px-2 py-8 text-center text-[12px] leading-5 text-[rgb(var(--color-text-secondary))]">
									{t("voice.history.empty")}
								</p>
							)}
						</>
					)}
				</div>
			</aside>

			{/* Center: chat */}
			<section className="flex min-h-0 min-w-0 flex-col bg-[rgb(var(--color-bg-primary))]">
				<div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
					{!hasThread ? (
						<div className="mx-auto flex w-full max-w-3xl flex-col items-center px-1 pb-6 pt-4 text-center">
							<div
								className="ai-chat-on-primary mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))]"
								style={{ color: "#fff" }}
							>
								<BrainCircuit className="h-7 w-7" strokeWidth={1.75} />
							</div>
							<h3 className="text-xl font-semibold tracking-tight text-[rgb(var(--color-text-primary))]">
								{greeting}
							</h3>
							<p className="mt-2.5 max-w-xl text-[14px] leading-6 text-[rgb(var(--color-text-secondary))]">
								{t("voice.welcomeHint")}
							</p>
							{emptyHint && emptyHint !== t("voice.welcomeHint") && (
								<p className="mt-1 max-w-lg text-[12.5px] leading-5 text-[rgb(var(--color-text-secondary))]">
									{emptyHint}
								</p>
							)}

							<div className={`${styles.prompts} mt-6 grid w-full gap-3`}>
								{QUICK_PROMPTS.map((item) => {
									const Icon = item.icon;
									return (
										<button
											className="group flex cursor-pointer items-start gap-3.5 rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] px-4 py-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-[rgb(var(--color-primary))]/45 hover:bg-[rgb(var(--color-bg-tertiary))]"
											key={item.key}
											onClick={() => onQuickPrompt(t(item.promptKey))}
											type="button"
										>
											<span
												className="ai-chat-accent mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 transition-colors group-hover:bg-[rgb(var(--color-primary))]/20"
												style={{ color: "rgb(var(--color-primary))" }}
											>
												<Icon className="h-5 w-5" />
											</span>
											<span className="min-w-0 pt-0.5">
												<span className="block text-[14px] font-semibold text-[rgb(var(--color-text-primary))]">
													{t(item.titleKey)}
												</span>
												<span className="mt-1 block text-[12.5px] leading-4 text-[rgb(var(--color-text-secondary))]">
													{t(item.hintKey)}
												</span>
											</span>
										</button>
									);
								})}
							</div>
						</div>
					) : (
						<div className="mx-auto w-full max-w-3xl space-y-3.5">
							{children}
						</div>
					)}
				</div>
				<div className="shrink-0 border-t border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-4 py-3 pr-6">
					<div className="mx-auto w-full max-w-3xl">{composer}</div>
				</div>
			</section>

			{/* Right: live context */}
			<aside
				className={`${styles.context} min-h-0 flex-col gap-4 border-l border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] p-3.5`}
			>
				<div className="min-h-0 flex-1">
					<p className="mb-2.5 px-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[rgb(var(--color-text-secondary))]">
						{t("voice.liveContext")}
					</p>
					<div className="rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-3.5">
						<div className="mb-3 flex items-start gap-2.5">
							<div
								className="ai-chat-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10"
								style={{ color: "rgb(var(--color-primary))" }}
							>
								<Wallet className="h-5 w-5" />
							</div>
							<div className="min-w-0 pt-0.5">
								<p className="truncate text-[13.5px] font-semibold text-[rgb(var(--color-text-primary))]">
									{storeName || t("voice.storeFallback")}
								</p>
								<p className="mt-0.5 truncate text-[11px] text-[rgb(var(--color-text-secondary))]">
									{storeGst ? `GST: ${storeGst}` : t("common.notAvailable")}
								</p>
							</div>
						</div>
						<ul className="space-y-1 border-t border-[rgb(var(--color-border-primary))] pt-2.5">
							{[
								{
									label: t("voice.metrics.askRevenue"),
									prompt: t("voice.quick.revenuePrompt"),
								},
								{
									label: t("voice.metrics.askCustomers"),
									prompt: t("voice.quick.duesPrompt"),
								},
								{
									label: t("voice.metrics.askStock"),
									prompt: t("voice.quick.stockPrompt"),
								},
								{
									label: t("voice.metrics.askPayables"),
									prompt: t("voice.quick.payablesPrompt"),
								},
							].map((row) => (
								<li key={row.label}>
									<button
										className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-2 py-2 text-left text-[12.5px] transition-colors hover:bg-[rgb(var(--color-bg-tertiary))]"
										onClick={() => onQuickPrompt(row.prompt)}
										type="button"
									>
										<span className="text-[rgb(var(--color-text-secondary))]">
											{row.label}
										</span>
										<span
											className="ai-chat-accent shrink-0 text-[11px] font-semibold"
											style={{ color: "rgb(var(--color-primary))" }}
										>
											{t("voice.ask")}
										</span>
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div>
					<p className="mb-2.5 px-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[rgb(var(--color-text-secondary))]">
						{t("voice.aiWork")}
					</p>
					<div className="flex items-center gap-2.5 rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-3.5 py-3">
						<span
							className={`h-2 w-2 shrink-0 rounded-full ${
								aiStatus === t("voice.status.waiting")
									? "bg-[rgb(var(--color-warning))]"
									: "animate-pulse bg-[rgb(var(--color-primary))]"
							}`}
						/>
						<p className="text-[13px] font-medium text-[rgb(var(--color-text-primary))]">
							{aiStatus}
						</p>
					</div>
				</div>
			</aside>
		</div>
	);
}
