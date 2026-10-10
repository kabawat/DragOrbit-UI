"use client";
import { Copy, Mail, MessageCircle, MessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddActionButton from "./AddActionButton";

const SendMenu = ({
	onError = () => {},
	item,
	onShare,
	getShareUrl,
	formatCurrency,
	formatDate,
	showToast,
	className = "",
	buttonClassName = "",
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const buildShareUrl = (item) => {
		if (typeof window === "undefined") return "";
		const base = window.location.origin;
		// Use publicId for public sharing, fallback to _id if publicId doesn't exist
		const publicId = item.publicId || item._id || item.id;
		const path = `/view/purchase-order/${publicId}`;
		return `${base}${path}`;
	};

	const handleCopy = async (text) => {
		try {
			if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(text);
				if (showToast) showToast("Link copied to clipboard!", "success");
			} else {
				// Fallback for non-secure contexts
				const textArea = document.createElement("textarea");
				textArea.value = text;
				document.body.appendChild(textArea);
				textArea.select();
				try {
					document.execCommand("copy");
					if (showToast) showToast("Link copied to clipboard!", "success");
				} catch (err) {
					if (showToast) showToast("Failed to copy link", "error");
				}
				document.body.removeChild(textArea);
			}
		} catch (error) {
			onError(error);
			if (showToast) showToast("Failed to copy link", "error");
		}
	};

	const handleWhatsAppShare = () => {
		const shareUrl = buildShareUrl(item);

		// Create properly formatted WhatsApp message
		const message = `Hello *${item.supplier?.name || "Supplier"}*, Thanks for your business! *Purchase Order: ${item.billNumber || item.poNumber || "N/A"}* *Link:* ${shareUrl} Thanks *${item.store?.name || "DragBizz Store"}* *${item.store?.phone || "N/A"}* Sent using *DragBizz: Simple Store Management* (dragbizz.com)`;

		// Get supplier's phone number and format it for WhatsApp
		const supplierPhone = item.supplier?.phone;
		if (supplierPhone) {
			// Remove any non-digit characters and ensure it starts with country code
			const cleanPhone = supplierPhone.replace(/\D/g, "");
			const whatsappPhone = cleanPhone.startsWith("91")
				? cleanPhone
				: `91${cleanPhone}`;
			window.open(
				`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,
				"_blank",
			);
		} else {
			// Fallback to general WhatsApp if no phone number
			window.open(
				`https://wa.me/?text=${encodeURIComponent(message)}`,
				"_blank",
			);
		}

		setIsOpen(false);
		onShare?.("whatsapp", item);
	};

	const handleEmailShare = () => {
		const shareUrl = buildShareUrl(item);
		const subject = `Purchase Order: ${item.billNumber || item.poNumber} - ${item.store?.name || "DragBizz Store"}`;
		const body =
			`Purchase Order Details\n\n` +
			`PO Number: ${item.billNumber || item.poNumber || "N/A"}\n` +
			`Store: ${item.store?.name || "DragBizz Store"}\n` +
			`Supplier: ${item.supplier?.name || "N/A"}\n` +
			`Total Amount: ${formatCurrency(item.totalAmount)}\n` +
			`PO Date: ${formatDate(item.billDate || item.poDate)}\n` +
			`Expected Delivery: ${formatDate(item.dueDate || item.expectedDeliveryDate)}\n` +
			`Items: ${item.items?.length || 0} items\n` +
			`Store Contact: ${item.store?.phone || "N/A"}\n` +
			`Store Email: ${item.store?.email || "N/A"}\n\n` +
			`View Full Details: ${shareUrl}\n\n` +
			`Powered by DragBizz Store Management`;
		window.open(
			`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
			"_blank",
		);
		setIsOpen(false);
		onShare?.("email", item);
	};

	const handleSMSShare = () => {
		const shareUrl = buildShareUrl(item);
		const message =
			`Purchase Order Details\n\n` +
			`PO: ${item.billNumber || item.poNumber || "N/A"}\n` +
			`Store: ${item.store?.name || "DragBizz Store"}\n` +
			`Supplier: ${item.supplier?.name || "N/A"}\n` +
			`Amount: ${formatCurrency(item.totalAmount)}\n` +
			`Delivery: ${formatDate(item.dueDate || item.expectedDeliveryDate)}\n` +
			`Items: ${item.items?.length || 0}\n\n` +
			`View: ${shareUrl}\n\n` +
			`DragBizz Store Management`;
		window.open(`sms:?body=${encodeURIComponent(message)}`, "_blank");
		setIsOpen(false);
		onShare?.("sms", item);
	};

	const handleCopyLink = async () => {
		const shareUrl = buildShareUrl(item);
		await handleCopy(shareUrl);
		setIsOpen(false);
		onShare?.("copy", item);
	};

	return (
		<div className={`relative ${className}`} ref={menuRef} {...props}>
			<AddActionButton
				onClick={() => setIsOpen(!isOpen)}
				Icon={Send}
				label="Send"
				size="sm"
				title="Send"
				className={`h-9 px-3 rounded-lg bg-white/90 hover:bg-white ${buttonClassName}`}
			/>

			{isOpen && (
				<div className="absolute right-0 top-full mt-1 w-44 bg-[rgb(var(--color-bg-primary))] rounded-lg shadow-lg border border-[rgb(var(--color-border-primary))] py-1 z-50">
					<button
						className="w-full px-3 py-2 text-left text-sm hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200"
						style={{ color: "#25D366" }}
						onClick={handleWhatsAppShare}
					>
						<MessageCircle className="w-4 h-4" /> WhatsApp
					</button>

					<button
						className="w-full px-3 py-2 text-left text-sm hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200"
						style={{ color: "#2563EB" }}
						onClick={handleEmailShare}
					>
						<Mail className="w-4 h-4" /> Email
					</button>

					<button
						className="w-full px-3 py-2 text-left text-sm hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200"
						style={{ color: "#6B7280" }}
						onClick={handleSMSShare}
					>
						<MessageSquare className="w-4 h-4" /> Message
					</button>

					<div className="my-1 border-t border-[rgb(var(--color-border-primary))]" />

					<button
						className="w-full px-3 py-2 text-left text-sm hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-2 cursor-pointer transition-colors duration-200"
						style={{ color: "#7C3AED" }}
						onClick={handleCopyLink}
					>
						<Copy className="w-4 h-4" /> Copy link
					</button>
				</div>
			)}
		</div>
	);
};

export default SendMenu;
