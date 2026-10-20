"use client";

import { ArrowUpRight, Mail, Phone, UserRound } from "lucide-react";
import { useMemo } from "react";
import {
	AiChatLink as Link,
	AiChatPresentation,
	useAiChatPresentation,
} from "./AiChatPresentation.jsx";

const CUSTOMER_WRITE_TOOLS = new Set(["create_customer", "update_customer"]);

function pickString(...values) {
	for (const value of values) {
		if (typeof value === "string" && value.trim()) return value.trim();
	}
	return "";
}

export function collectCustomerWrites(toolResults) {
	const cards = [];
	const seen = new Set();

	for (const tool of toolResults || []) {
		if (!CUSTOMER_WRITE_TOOLS.has(tool?.tool) || tool?.success === false) {
			continue;
		}
		const data = tool?.data && typeof tool.data === "object" ? tool.data : {};
		const nested =
			data.customer && typeof data.customer === "object" ? data.customer : null;
		const id = pickString(nested?.id, data.id);
		const openPath = pickString(
			data.openPath,
			id ? `/dashboard/customers/${id}` : "",
		);
		const name = pickString(nested?.name, data.name, "Customer");
		const phone = pickString(nested?.phone, data.phone);
		const email = pickString(nested?.email, data.email);
		const key = openPath || id || `${name}:${phone}:${email}`;
		if (!key || seen.has(key)) continue;
		seen.add(key);

		cards.push({
			key,
			tool: tool.tool,
			existing: Boolean(data.existing),
			name,
			phone,
			email,
			openPath: openPath || null,
			initial: (name || "?").charAt(0).toUpperCase(),
		});
	}

	return cards;
}

export function stripCustomerOpenLinks(message) {
	return String(message || "")
		.replace(/\[[^\]]*\]\(\/dashboard\/customers\/[^)]+\)/gi, "")
		.replace(/(?:^|\n)\s*Open customer\s*(?=\n|$)/gi, "\n")
		.replace(/[ \t]+\n/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

export function ChatCustomerResultCard({ toolResults }) {
	const { t } = useAiChatPresentation();
	const cards = useMemo(
		() => collectCustomerWrites(toolResults),
		[toolResults],
	);

	if (cards.length === 0) return null;

	return (
		<div className="mt-3 space-y-2.5">
			{cards.map((card, index) => {
				const badge =
					card.tool === "update_customer"
						? t("voice.customerCard.updated")
						: card.existing
							? t("voice.customerCard.existing")
							: t("voice.customerCard.added");

				return (
					<div
						className="animate-[chatFadeUp_0.35s_ease-out_both] overflow-hidden rounded-xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))]"
						key={card.key}
						style={{ animationDelay: `${index * 40}ms` }}
					>
						<div className="h-1 w-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary))]/30" />
						<div className="flex gap-3 p-3">
							<div className="ai-chat-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/12 text-[15px] font-semibold">
								{card.initial}
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<p className="truncate text-[14px] font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
										{card.name}
									</p>
									<span className="ai-chat-accent rounded-md bg-[rgb(var(--color-primary))]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em]">
										{badge}
									</span>
								</div>
								<ul className="mt-2 space-y-1.5">
									{card.phone ? (
										<li className="flex items-center gap-2 text-[12px] leading-4 text-[rgb(var(--color-text-secondary))]">
											<Phone className="h-3.5 w-3.5 shrink-0 opacity-70" />
											<span className="truncate font-medium text-[rgb(var(--color-text-primary))]">
												{card.phone}
											</span>
										</li>
									) : null}
									{card.email ? (
										<li className="flex items-center gap-2 text-[12px] leading-4 text-[rgb(var(--color-text-secondary))]">
											<Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
											<span className="truncate font-medium text-[rgb(var(--color-text-primary))]">
												{card.email}
											</span>
										</li>
									) : (
										<li className="flex items-center gap-2 text-[12px] leading-4 text-[rgb(var(--color-text-secondary))]">
											<UserRound className="h-3.5 w-3.5 shrink-0 opacity-70" />
											<span>{t("voice.customerCard.noEmail")}</span>
										</li>
									)}
								</ul>
								{card.openPath ? (
									<Link
										className="ai-chat-on-primary mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[rgb(var(--color-primary))] px-2.5 py-1.5 text-[12px] font-semibold transition-transform hover:-translate-y-0.5"
										href={card.openPath}
										style={{ color: "#fff" }}
									>
										{t("voice.customerCard.open")}
										<ArrowUpRight className="h-3.5 w-3.5" />
									</Link>
								) : null}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export { AiChatPresentation };
export default ChatCustomerResultCard;
