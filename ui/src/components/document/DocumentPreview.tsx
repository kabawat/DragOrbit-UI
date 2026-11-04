"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./document-preview.css";

/** Scale paper for the viewport only; preserve native dimensions for printing. */
export function DocumentPreview({ children }: { children: ReactNode }) {
	const viewport = useRef<HTMLDivElement>(null);
	const paper = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0, scale: 1 });
	useLayoutEffect(() => {
		const frame = viewport.current;
		const content = paper.current;
		if (!frame || !content) return;
		const measure = () => {
			const width = content.scrollWidth;
			const height = content.offsetHeight;
			const scale = width ? Math.min(1, frame.clientWidth / width) : 1;
			setSize((previous) =>
				previous.width === width &&
				previous.height === height &&
				previous.scale === scale
					? previous
					: { width, height, scale },
			);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(frame);
		observer.observe(content);
		return () => observer.disconnect();
	}, []);
	return (
		<div ref={viewport} className="dragorbit-document-preview">
			<div
				className="dragorbit-document-preview-frame"
				style={{
					width: size.width ? size.width * size.scale : "100%",
					height: size.height ? size.height * size.scale : "auto",
				}}
			>
				<div
					ref={paper}
					className="dragorbit-document-preview-paper"
					style={{ transform: `scale(${size.scale})` }}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
