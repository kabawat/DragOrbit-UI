"use client";
import { AlertCircle, Image as ImageIcon, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { defaultTranslate } from "./defaults";
const FileUpload = ({
	t = defaultTranslate,
	currentVariant = "light",
	label,
	value = [],
	onChange,
	accept = "image/*",
	multiple = true,
	maxFiles = 10,
	maxSize = 5 * 1024 * 1024, // 5MB
	error = false,
	errorMessage,
	helperText,
	dropZoneLabel,
	sizeLimitLabel,
	showFileList = true,
	disabled = false,
	required = false,
	variant = "default", // "default" or "compact"
	className = "",
	loading = false,
	onRemove,
	...props
}) => {
	const [isDragOver, setIsDragOver] = useState(false);
	const [_uploading, _setUploading] = useState(false);
	const fileInputRef = useRef(null);

	const handleFiles = useCallback(
		(files) => {
			const fileArray = Array.from(files);
			const validFiles = [];
			const errors = [];

			fileArray.forEach((file) => {
				// Check file size
				if (file.size > maxSize) {
					errors.push(
						`${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`,
					);
					return;
				}

				// Check file type
				if (accept && !file.type.match(accept.replace("*", ".*"))) {
					errors.push(`${file.name} is not a valid file type`);
					return;
				}

				// Check if file already exists (File objects and URL strings)
				const exists = value.some((existingFile) => {
					if (typeof existingFile === "string") return false;
					if (!(existingFile instanceof File) || !(file instanceof File))
						return false;
					return (
						existingFile.name === file.name && existingFile.size === file.size
					);
				});

				if (exists) {
					errors.push(`${file.name} is already uploaded`);
					return;
				}

				validFiles.push(file);
			});

			if (validFiles.length > 0) {
				const newFiles = multiple ? [...value, ...validFiles] : validFiles;
				onChange?.(newFiles.slice(0, maxFiles));
			}
		},
		[value, onChange, maxFiles, maxSize, accept, multiple],
	);

	const handleDrop = useCallback(
		(e) => {
			e.preventDefault();
			setIsDragOver(false);

			if (disabled) return;

			const files = e.dataTransfer.files;
			handleFiles(files);
		},
		[disabled, handleFiles],
	);

	const handleDragOver = useCallback(
		(e) => {
			e.preventDefault();
			if (!disabled) {
				setIsDragOver(true);
			}
		},
		[disabled],
	);

	const handleDragLeave = useCallback((e) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleFileInputChange = useCallback(
		(e) => {
			const files = e.target.files;
			handleFiles(files);
			// Allow selecting the same files again
			e.target.value = "";
		},
		[handleFiles],
	);

	const removeFile = useCallback(
		(index) => {
			const newFiles = value.filter((_, i) => i !== index);
			onChange?.(newFiles);
		},
		[value, onChange],
	);

	const openFileDialog = useCallback(() => {
		if (!disabled) {
			fileInputRef.current?.click();
		}
	}, [disabled]);

	const createPreviewUrl = (file) => {
		if (typeof file === "string") return file;
		try {
			return URL.createObjectURL(file);
		} catch (e) {
			return null;
		}
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	return (
		<div className={`w-full ${className}`}>
			{/* Label - Only in default variant */}
			{variant !== "compact" && label && (
				<label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			{/* Upload Area / Preview Area */}
			{!multiple && value.length > 0 ? (
				<div className="relative group rounded-xl border-2 border-dashed border-[rgb(var(--color-border-primary))] overflow-hidden bg-[rgb(var(--color-bg-secondary))] transition-all hover:border-[rgb(var(--color-primary))] min-h-[220px] flex items-center justify-center p-6">
					<div className="flex flex-col items-center justify-center w-full text-center">
						<div className="w-40 h-40 rounded-xl border-2 border-[rgb(var(--color-border-primary))] overflow-hidden bg-white mb-6 shadow-md relative group-hover:shadow-lg transition-transform hover:scale-[1.02]">
							<img
								src={createPreviewUrl(value[0])}
								alt="Uploaded icon"
								className="w-full h-full object-contain p-2"
							/>
							{loading && (
								<div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
									<div className="w-10 h-10 border-4 border-[rgb(var(--color-primary))]/20 border-t-[rgb(var(--color-primary))] rounded-full animate-spin"></div>
								</div>
							)}
						</div>
						<div className="flex gap-4">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									openFileDialog();
								}}
								className="inline-flex items-center px-4 py-2 text-sm font-bold bg-[rgb(var(--color-primary))] text-white rounded-lg hover:bg-[rgb(var(--color-primary))]/90 transition-all shadow-sm cursor-pointer"
								disabled={disabled || loading}
							>
								<Upload className="w-4 h-4 mr-2" />
								{t("common.change") || "Change Image"}
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onRemove ? onRemove(0) : removeFile(0);
								}}
								className="inline-flex items-center px-4 py-2 text-sm font-bold bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all shadow-sm cursor-pointer"
								disabled={disabled || loading}
							>
								<X className="w-4 h-4 mr-2" />
								{t("common.remove") || "Remove"}
							</button>
						</div>
						{!loading && (
							<p className="mt-4 text-[0.625rem] uppercase tracking-widest font-bold text-[rgb(var(--color-text-tertiary))]">
								{typeof value[0] === "string"
									? "Cloud Storage Active"
									: "Local File Ready"}
							</p>
						)}
					</div>
				</div>
			) : (
				<div
					className={`
            relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
            ${
							isDragOver
								? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary)/0.1)] scale-[0.98]"
								: "border-[rgb(var(--color-border-primary))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:shadow-md"
						}
            ${error ? "border-red-500 bg-red-50/50" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${variant === "compact" ? "aspect-square flex items-center justify-center p-2" : value.length > 0 ? "mb-4 p-4" : "p-10"}
            ${className}
          `}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onClick={openFileDialog}
				>
					<div className="text-center w-full leading-relaxed">
						{loading ? (
							<div className="flex flex-col items-center justify-center space-y-4 py-4">
								<div className="w-12 h-12 border-4 border-[rgb(var(--color-primary))]/20 border-t-[rgb(var(--color-primary))] rounded-full animate-spin"></div>
								<div className="space-y-1">
									<p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
										{t("common.uploading") || "Uploading Assets..."}
									</p>
									<p className="text-xs text-[rgb(var(--color-text-tertiary))]">
										{t("common.pleaseWait") ||
											"Please wait while we secure your file"}
									</p>
								</div>
							</div>
						) : variant === "compact" ? (
							<div className="flex flex-col items-center justify-center space-y-1">
								<div
									className={`p-2 rounded-full transition-colors ${isDragOver ? "bg-[rgb(var(--color-primary))]/20" : "bg-[rgb(var(--color-bg-tertiary))]"}`}
								>
									<Upload
										className={`w-5 h-5 ${isDragOver ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-tertiary))]"}`}
									/>
								</div>
								<span className="text-[0.6875rem] font-medium text-[rgb(var(--color-text-secondary))] truncate px-1">
									{t("common.add") || "Add More"}
								</span>
							</div>
						) : (
							<div className="flex flex-col items-center">
								<div
									className={`p-5 rounded-full mb-4 transition-transform duration-500 ${isDragOver ? "bg-[rgb(var(--color-primary))]/20 scale-110 shadow-lg" : "bg-[rgb(var(--color-bg-tertiary))]"}`}
								>
									<Upload
										className={`w-10 h-10 ${isDragOver ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-tertiary))]"}`}
									/>
								</div>
								<h4 className="text-base font-bold text-[rgb(var(--color-text-primary))] mb-1">
									{isDragOver
										? t("common.dropFilesHere") || "Drop files here"
										: dropZoneLabel ||
											(value.length > 0
												? t("common.addMoreImages") || "Add more images"
												: t("common.clickToUploadOrDrag") ||
													"Upload your brand assets")}
								</h4>
								<p className="text-xs text-[rgb(var(--color-text-tertiary))] max-w-[240px] mx-auto text-balance">
									{sizeLimitLabel || (
										<>
											{accept.includes("image") ? "Images" : "Files"} up to{" "}
											<span className="font-bold text-[rgb(var(--color-text-secondary))]">
												{maxSize / (1024 * 1024)}MB
											</span>
											{multiple && ` • Max ${maxFiles} files`}
										</>
									)}
								</p>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Hidden File Input */}
			<input
				ref={fileInputRef}
				type="file"
				accept={accept}
				multiple={multiple}
				onChange={handleFileInputChange}
				className="hidden"
				disabled={disabled}
				{...props}
			/>

			{/* Multiple File List (Only when multiple=true) */}
			{showFileList && multiple && value.length > 0 && (
				<div className="space-y-2 mt-4">
					{value.map((file, index) => (
						<div
							key={`${typeof file === "string" ? file : file.name}-${index}`}
							className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-secondary))] rounded-lg border border-[rgb(var(--color-border-primary))] transition-all hover:shadow-sm"
						>
							<div className="flex items-center space-x-4 flex-1 min-w-0">
								<div className="w-12 h-12 rounded-lg border border-[rgb(var(--color-border-primary))] overflow-hidden flex-shrink-0 bg-white shadow-sm">
									<img
										src={createPreviewUrl(file)}
										alt="Preview"
										className="w-full h-full object-contain"
									/>
								</div>

								<div className="flex-1 min-w-0">
									<p className="text-sm font-bold text-[rgb(var(--color-text-primary))] truncate">
										{typeof file === "string"
											? file.split("/").pop()
											: file.name}
									</p>
									<p className="text-[0.625rem] uppercase font-bold text-[rgb(var(--color-text-tertiary))]">
										{typeof file === "string"
											? "Stored"
											: formatFileSize(file.size)}
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onRemove ? onRemove(index) : removeFile(index);
								}}
								className="ml-4 p-2 cursor-pointer text-gray-500 hover:text-red-600 rounded-lg transition-all hover:bg-red-50"
								disabled={disabled}
							>
								<X className="w-5 h-5" />
							</button>
						</div>
					))}
				</div>
			)}

			{/* Helper Text / Error Message */}
			{variant !== "compact" && (helperText || errorMessage) && (
				<div className="mt-3">
					{error && errorMessage && (
						<div className="flex items-center space-x-2 p-3 rounded-lg bg-red-50 text-red-600 border border-red-100">
							<AlertCircle className="w-4 h-4 shrink-0" />
							<p className="text-xs font-bold leading-none">{errorMessage}</p>
						</div>
					)}
					{!error && helperText && (
						<p className="text-xs font-medium text-[rgb(var(--color-text-tertiary))] leading-relaxed">
							{helperText}
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default FileUpload;
