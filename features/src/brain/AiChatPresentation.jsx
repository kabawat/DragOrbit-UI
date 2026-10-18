"use client";
import { createContext, useContext, useMemo } from "react";

const Presentation = createContext({ t: (key) => key, LinkComponent: null });
export function AiChatPresentation({ t, LinkComponent, children }) {
	const value = useMemo(() => ({ t, LinkComponent }), [t, LinkComponent]);
	return (
		<Presentation.Provider value={value}>{children}</Presentation.Provider>
	);
}
export function useAiChatPresentation() {
	return useContext(Presentation);
}
export function AiChatLink({ href, children, ...props }) {
	const { LinkComponent } = useAiChatPresentation();
	return LinkComponent ? (
		<LinkComponent href={href} {...props}>
			{children}
		</LinkComponent>
	) : (
		<a href={href} {...props}>
			{children}
		</a>
	);
}
