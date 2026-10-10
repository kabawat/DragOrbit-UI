"use client";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

const HeaderContext = createContext(null);

export function HeaderProvider({ children }) {
	const [headerContent, setHeaderContent] = useState({
		title: "",
		description: "",
	});

	const setHeader = useCallback((content) => {
		setHeaderContent(content);
	}, []);

	const value = useMemo(
		() => ({ headerContent, setHeader }),
		[headerContent, setHeader],
	);

	return (
		<HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
	);
}

export function useHeader() {
	const ctx = useContext(HeaderContext);
	if (!ctx) throw new Error("useHeader requires HeaderProvider");
	return ctx;
}
