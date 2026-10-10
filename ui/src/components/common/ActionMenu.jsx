"use client";
import {
	Edit,
	Eye,
	IndianRupee,
	MoreVertical,
	Receipt,
	Trash2,
} from "lucide-react";

const ActionMenu = ({
	item,
	onAction,
	menuId,
	isOpen,
	onToggle,
	menuRef,
	actions = ["view", "edit", "delete"],
	className = "",
	buttonClassName = "",
	...props
}) => {
	const getActionIcon = (action) => {
		switch (action) {
			case "view":
				return Eye;
			case "edit":
				return Edit;
			case "delete":
				return Trash2;
			case "advancePayment":
				return IndianRupee;
			case "createBill":
				return Receipt;
			default:
				return Edit;
		}
	};

	const getActionLabel = (action) => {
		switch (action) {
			case "view":
				return "View Details";
			case "edit":
				return "Edit";
			case "delete":
				return "Delete";
			case "advancePayment":
				return "Advance Payment";
			case "createBill":
				return "Create Bill";
			default:
				return action;
		}
	};

	const getActionStyle = (action) => {
		if (action === "delete") {
			return "text-red-600 hover:bg-red-500/10 focus:bg-red-500/10";
		}
		return "text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] focus:bg-[rgb(var(--color-bg-secondary))]";
	};

	const handleAction = (action) => {
		onAction(item._id || item.id, action);
	};

	return (
		<div className={`relative ${className}`} ref={menuRef} {...props}>
			<button
				onClick={() => onToggle(item._id || item.id)}
				className={`p-2 hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors duration-200 group/btn cursor-pointer ${buttonClassName}`}
				title="More Actions"
			>
				<MoreVertical className="w-4 h-4 text-[rgb(var(--color-text-secondary))] group-hover/btn:text-[rgb(var(--color-primary))]" />
			</button>

			{isOpen && (
				<div className="absolute right-0 top-full mt-1 w-48 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-50">
					{actions.map((action) => {
						const Icon = getActionIcon(action);
						return (
							<button
								key={action}
								onClick={() => handleAction(action)}
								className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors duration-200 cursor-pointer focus:outline-none ${getActionStyle(action)}`}
							>
								<Icon
									className={`w-4 h-4 ${action === "delete" ? "text-red-500" : "text-[rgb(var(--color-text-secondary))]"}`}
								/>
								{getActionLabel(action)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ActionMenu;
