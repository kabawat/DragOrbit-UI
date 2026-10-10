"use client";
import { Button } from "../button/Button";
import { SideDrawer } from "./SlideDrawer";

const FormDrawer = ({
	isOpen,
	onClose,
	title,
	icon: Icon,
	description,
	children,
	width = "w-full md:w-2/3 lg:w-1/2",
	// Footer button props
	onSave,
	onCancel,
	saveLabel = "Save",
	cancelLabel = "Cancel",
	isLoading = false,
	isSaving = false,
	saveIcon: SaveIcon,
	saveVariant = "success",
	cancelVariant = "outline",
	disabled = false,
	// Custom footer content (if provided, overrides default buttons)
	footer,
	// Additional props for SideDrawer
	showDownloadButton = false,
	onDownload = null,
}) => {
	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		} else {
			onClose();
		}
	};

	return (
		<SideDrawer
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			icon={Icon}
			description={description}
			width={width}
			showDownloadButton={showDownloadButton}
			onDownload={onDownload}
		>
			<div className="p-3 sm:p-4 md:p-6 h-full">
				<div className="flex flex-col h-full">
					{/* Main Content Area - Scrollable */}
					<div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 min-h-0 pb-4">
						{children}
					</div>

					{/* Footer - Action Buttons */}
					{footer ? (
						<div className="flex-shrink-0 bg-[rgb(var(--color-bg-primary))] border-t border-[rgb(var(--color-border-primary))] p-3 sm:p-4 -mx-3 sm:-mx-4 md:-mx-6 -mb-3 sm:-mb-4 md:-mb-6">
							{footer}
						</div>
					) : (
						<div className="flex-shrink-0 bg-[rgb(var(--color-bg-primary))] border-t border-[rgb(var(--color-border-primary))] p-3 sm:p-4 -mx-3 sm:-mx-4 md:-mx-6 -mb-3 sm:-mb-4 md:-mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
							{onSave && (
								<Button
									variant={saveVariant}
									onClick={onSave}
									disabled={isLoading || isSaving || disabled}
									loading={isLoading || isSaving}
									leftIcon={SaveIcon}
									className="w-full sm:w-auto"
									size="sm"
								>
									{saveLabel}
								</Button>
							)}
							<Button
								variant={cancelVariant}
								onClick={handleCancel}
								disabled={isLoading || isSaving || disabled}
								className="w-full sm:w-auto"
								size="sm"
							>
								{cancelLabel}
							</Button>
						</div>
					)}
				</div>
			</div>
		</SideDrawer>
	);
};

export default FormDrawer;
