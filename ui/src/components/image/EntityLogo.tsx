"use client";
import { useState, type ComponentType } from "react";
import { ImageIcon } from "lucide-react";

/** Decorative logo beside an entity name, with a missing/broken-image fallback. */
export function EntityLogo({
	src,
	fallbackIcon: FallbackIcon = ImageIcon,
}: {
	src?: string | null;
	fallbackIcon?: ComponentType<{ className?: string }>;
}) {
	const [failedSource, setFailedSource] = useState<string | null>(null);
	const source = typeof src === "string" ? src.trim() : "";
	return (
		<span
			aria-hidden="true"
			className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-tertiary))]"
		>
			{source && source !== failedSource ? (
				<img
					src={source}
					alt=""
					width={40}
					height={40}
					loading="lazy"
					decoding="async"
					className="h-full w-full object-contain p-1"
					onError={() => setFailedSource(source)}
				/>
			) : (
				<FallbackIcon className="h-5 w-5" />
			)}
		</span>
	);
}
