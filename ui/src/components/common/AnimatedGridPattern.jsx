"use client";
import React from "react";

const AnimatedGridPattern = ({
	opacity = 30,
	blur = 1,
	gridSize = 80,
	className = "",
}) => {
	// Use useId() for stable IDs that match between server and client (SSR-safe)
	const baseId = React.useId();
	const flowGradientHId = `flowGradientH-${baseId}`;
	const flowGradientVId = `flowGradientV-${baseId}`;
	const gridId = `grid-${baseId}`;
	const gridFlowHId = `gridFlowH-${baseId}`;
	const gridFlowVId = `gridFlowV-${baseId}`;

	return (
		<div
			className={`absolute inset-0 ${className}`}
			style={{ opacity: opacity / 100, filter: `blur(${blur}px)` }}
		>
			<svg className="w-full h-full" preserveAspectRatio="none">
				<defs>
					{/* Gradient for flowing light effect - horizontal */}
					<linearGradient
						id={flowGradientHId}
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor="transparent" stopOpacity="0" />
						<stop
							offset="45%"
							stopColor="rgb(196, 181, 253)"
							stopOpacity="0.2"
						/>
						<stop
							offset="50%"
							stopColor="rgb(165, 180, 252)"
							stopOpacity="0.8"
						/>
						<stop
							offset="55%"
							stopColor="rgb(196, 181, 253)"
							stopOpacity="0.2"
						/>
						<stop offset="100%" stopColor="transparent" stopOpacity="0" />
						<animate
							attributeName="x1"
							values="-20%;120%"
							dur="2.5s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="x2"
							values="20%;140%"
							dur="2.5s"
							repeatCount="indefinite"
						/>
					</linearGradient>

					{/* Gradient for flowing light effect - vertical */}
					<linearGradient
						id={flowGradientVId}
						x1="0%"
						y1="0%"
						x2="0%"
						y2="100%"
					>
						<stop offset="0%" stopColor="transparent" stopOpacity="0" />
						<stop
							offset="45%"
							stopColor="rgb(196, 181, 253)"
							stopOpacity="0.2"
						/>
						<stop
							offset="50%"
							stopColor="rgb(165, 180, 252)"
							stopOpacity="0.8"
						/>
						<stop
							offset="55%"
							stopColor="rgb(196, 181, 253)"
							stopOpacity="0.2"
						/>
						<stop offset="100%" stopColor="transparent" stopOpacity="0" />
						<animate
							attributeName="y1"
							values="-20%;120%"
							dur="2.5s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="y2"
							values="20%;140%"
							dur="2.5s"
							repeatCount="indefinite"
						/>
					</linearGradient>

					{/* Base grid pattern */}
					<pattern
						id={gridId}
						width={gridSize}
						height={gridSize}
						patternUnits="userSpaceOnUse"
					>
						<path
							d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
							fill="none"
							stroke="currentColor"
							strokeWidth="0.8"
							className="text-indigo-300"
						/>
					</pattern>

					{/* Animated grid pattern with flowing light - horizontal lines */}
					<pattern
						id={gridFlowHId}
						width={gridSize}
						height={gridSize}
						patternUnits="userSpaceOnUse"
					>
						<path
							d={`M 0 0 L ${gridSize} 0`}
							fill="none"
							stroke={`url(#${flowGradientHId})`}
							strokeWidth="1.5"
						/>
					</pattern>

					{/* Animated grid pattern with flowing light - vertical lines */}
					<pattern
						id={gridFlowVId}
						width={gridSize}
						height={gridSize}
						patternUnits="userSpaceOnUse"
					>
						<path
							d={`M 0 0 L 0 ${gridSize}`}
							fill="none"
							stroke={`url(#${flowGradientVId})`}
							strokeWidth="1.5"
						/>
					</pattern>
				</defs>
				{/* Base grid */}
				<rect
					width="100%"
					height="100%"
					fill={`url(#${gridId})`}
					className="text-indigo-300"
				/>
				{/* Flowing light - horizontal */}
				<rect width="100%" height="100%" fill={`url(#${gridFlowHId})`} />
				{/* Flowing light - vertical */}
				<rect width="100%" height="100%" fill={`url(#${gridFlowVId})`} />
			</svg>
		</div>
	);
};

export default AnimatedGridPattern;
