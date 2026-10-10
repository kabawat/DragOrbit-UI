"use client";
import Toast from "./Toast";

const ToastContainer = ({ toasts, onRemove }) => {
	return (
		<div className="fixed top-4 right-4 z-[10000] space-y-2">
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					message={toast.message}
					type={toast.type}
					duration={toast.duration}
					onClose={() => onRemove(toast.id)}
				/>
			))}
		</div>
	);
};

export default ToastContainer;
