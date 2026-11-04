"use client";
import DOMPurify from "dompurify";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Image,
	Italic,
	Link,
	List,
	ListOrdered,
	Quote,
	Underline,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tooltip as SharedTooltip } from "../tooltip/Tooltip";

const RichTextEditor = ({
	value = "",
	onChange,
	placeholder = "Start typing...",
	label,
	error = false,
	errorMessage,
	helperText,
	disabled = false,
	required = false,
	maxLength = 5000,
	showCharCount = true,
	className = "",
	name,
	id,
	...props
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const editorRef = useRef(null);
	const [isReady, setIsReady] = useState(false);

	// Initialize editor
	useEffect(() => {
		if (editorRef.current && !isReady) {
			setIsReady(true);
		}
	}, [isReady]);

	// Handle content change
	const handleInput = () => {
		if (editorRef.current) {
			const content = editorRef.current.innerHTML;
			onChange?.(content);
		}
	};

	// Handle focus
	const handleFocus = () => {
		setIsFocused(true);
	};

	// Handle blur
	const handleBlur = () => {
		setIsFocused(false);
	};

	// Format text
	const formatText = (command, value = null) => {
		if (disabled) return;

		document.execCommand(command, false, value);
		editorRef.current?.focus();
		handleInput();
	};

	// Insert link
	const insertLink = () => {
		if (disabled) return;

		const url = prompt("Enter URL:");
		if (url) {
			formatText("createLink", url);
		}
	};

	// Insert image
	const insertImage = () => {
		if (disabled) return;

		const url = prompt("Enter image URL:");
		if (url) {
			formatText("insertImage", url);
		}
	};

	// Get current length
	const getCurrentLength = () => {
		if (editorRef.current) {
			return editorRef.current.textContent.length;
		}
		return 0;
	};

	const currentLength = getCurrentLength();
	const isNearLimit = maxLength && currentLength > maxLength * 0.8;
	const isAtLimit = maxLength && currentLength >= maxLength;

	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	// Sanitize HTML to prevent XSS attacks (only on client-side)
	const sanitizedValue = useMemo(() => {
		if (!mounted || !value) return "";
		// DOMPurify only works in browser, skip sanitization during SSR
		if (
			typeof window === "undefined" ||
			!DOMPurify ||
			typeof DOMPurify.sanitize !== "function"
		) {
			return "";
		}
		return DOMPurify.sanitize(value, {
			ALLOWED_TAGS: [
				"p",
				"br",
				"strong",
				"em",
				"u",
				"ul",
				"ol",
				"li",
				"a",
				"img",
				"blockquote",
				"div",
				"span",
			],
			ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "style"],
			ALLOWED_URI_REGEXP:
				/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
		});
	}, [value, mounted]);

	// Toolbar buttons
	const toolbarButtons = [
		{ command: "bold", icon: Bold, label: "Bold" },
		{ command: "italic", icon: Italic, label: "Italic" },
		{ command: "underline", icon: Underline, label: "Underline" },
		{ command: "insertUnorderedList", icon: List, label: "Bullet List" },
		{ command: "insertOrderedList", icon: ListOrdered, label: "Numbered List" },
		{ command: "justifyLeft", icon: AlignLeft, label: "Align Left" },
		{ command: "justifyCenter", icon: AlignCenter, label: "Align Center" },
		{ command: "justifyRight", icon: AlignRight, label: "Align Right" },
		{
			command: "formatBlock",
			icon: Quote,
			label: "Quote",
			value: "blockquote",
		},
	];

	return (
		<div className={`w-full ${className}`}>
			{/* Label */}
			{label && (
				<label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			{/* Editor Container */}
			<div
				className={`
          border-2 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-[rgb(var(--color-primary))] focus-within:border-[rgb(var(--color-primary))]
          ${
						error
							? "border-red-500 focus-within:ring-red-500"
							: isFocused
								? "border-[rgb(var(--color-primary))] focus-within:ring-[rgb(var(--color-primary))]"
								: "border-[rgb(var(--color-border-primary))] focus-within:ring-[rgb(var(--color-primary))]"
					}
          ${disabled ? "bg-[rgb(var(--color-bg-tertiary))] cursor-not-allowed" : "bg-[rgb(var(--color-bg-primary))]"}
        `}
			>
				{/* Toolbar */}
				{!disabled && (
					<div className="flex flex-wrap items-center gap-1 p-2 border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))]">
						{/* Format Buttons */}
						{toolbarButtons.map((button) => (
							<SharedTooltip key={button.command} content={button.label}><button aria-label={button.label}

								type="button"
								onClick={() => formatText(button.command, button.value)}
								className="p-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded transition-colors duration-200"

							>
								<button.icon className="w-4 h-4" />
							</button></SharedTooltip>
						))}

						{/* Separator */}
						<div className="w-px h-6 bg-[rgb(var(--color-border-primary))] mx-1" />

						{/* Link Button */}
						<SharedTooltip content={"Insert Link"}><button aria-label={"Insert Link"}
							type="button"
							onClick={insertLink}
							className="p-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded transition-colors duration-200"

						>
							<Link className="w-4 h-4" />
						</button></SharedTooltip>

						{/* Image Button */}
						<SharedTooltip content={"Insert Image"}><button aria-label={"Insert Image"}
							type="button"
							onClick={insertImage}
							className="p-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded transition-colors duration-200"

						>
							<Image className="w-4 h-4" />
						</button></SharedTooltip>
					</div>
				)}

				{/* Editor Content */}
				<div
					ref={editorRef}
					contentEditable={!disabled}
					onInput={handleInput}
					onFocus={handleFocus}
					onBlur={handleBlur}
					dangerouslySetInnerHTML={{ __html: sanitizedValue }}
					className={`
            p-4 min-h-[120px] max-h-[300px] overflow-y-auto
            ${disabled ? "cursor-not-allowed" : "cursor-text"}
            focus:outline-none
          `}
					style={{
						whiteSpace: "pre-wrap",
						wordBreak: "break-word",
					}}
					data-placeholder={placeholder}
					suppressContentEditableWarning={true}
					{...props}
				/>

				{/* Character Count */}
				{showCharCount && maxLength && (
					<div className="px-4 py-2 border-t border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] text-right">
						<span
							className={`text-xs ${isAtLimit ? "text-red-500" : isNearLimit ? "text-yellow-500" : "text-[rgb(var(--color-text-secondary))]"}`}
						>
							{currentLength}/{maxLength} characters
						</span>
					</div>
				)}
			</div>

			{/* Helper Text / Error Message */}
			{(helperText || errorMessage) && (
				<div className="mt-2">
					{error && errorMessage && (
						<p className="text-sm text-red-600 animate-fade-in">
							{errorMessage}
						</p>
					)}
					{!error && helperText && (
						<p className="text-sm text-[rgb(var(--color-text-secondary))]">
							{helperText}
						</p>
					)}
				</div>
			)}

			{/* CSS for placeholder */}
			<style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgb(var(--color-text-tertiary));
          pointer-events: none;
        }
      `}</style>
		</div>
	);
};

export default RichTextEditor;
