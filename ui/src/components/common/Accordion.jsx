"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const Accordion = ({
	items = [],
	allowMultiple = false,
	defaultOpenItems = [],
	className = "",
	...props
}) => {
	const [openItems, setOpenItems] = useState(defaultOpenItems);

	const toggleItem = (itemId) => {
		if (allowMultiple) {
			setOpenItems((prev) =>
				prev.includes(itemId)
					? prev.filter((id) => id !== itemId)
					: [...prev, itemId],
			);
		} else {
			setOpenItems((prev) => (prev.includes(itemId) ? [] : [itemId]));
		}
	};

	return (
		<div className={`space-y-2 ${className}`} {...props}>
			{items.map((item) => {
				const isOpen = openItems.includes(item.id);

				return (
					<div
						key={item.id}
						className="border border-gray-200 rounded-lg overflow-hidden"
					>
						<button
							onClick={() => toggleItem(item.id)}
							className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
						>
							<span className="font-medium text-gray-900">{item.title}</span>
							{isOpen ? (
								<ChevronUp className="w-5 h-5 text-gray-500" />
							) : (
								<ChevronDown className="w-5 h-5 text-gray-500" />
							)}
						</button>

						{isOpen && (
							<div className="px-4 py-3 bg-white border-t border-gray-200 animate-fade-in">
								{item.content}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

// Single Accordion Item Component
const AccordionItem = ({
	title,
	children,
	isOpen = false,
	onToggle,
	className = "",
	...props
}) => {
	return (
		<div
			className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}
			{...props}
		>
			<button
				onClick={onToggle}
				className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
			>
				<span className="font-medium text-gray-900">{title}</span>
				{isOpen ? (
					<ChevronUp className="w-5 h-5 text-gray-500" />
				) : (
					<ChevronDown className="w-5 h-5 text-gray-500" />
				)}
			</button>

			{isOpen && (
				<div className="px-4 py-3 bg-white border-t border-gray-200 animate-fade-in">
					{children}
				</div>
			)}
		</div>
	);
};

export { Accordion, AccordionItem };
export default Accordion;
