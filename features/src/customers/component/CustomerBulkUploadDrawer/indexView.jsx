"use client";
import { Button, Tooltip as SharedTooltip, SideDrawer } from "@dragorbit/ui";
import { Upload, X } from "lucide-react";
export function CustomerBulkUploadDrawerIndexPresentation({ model }) {
  const {
    BulkTemplateDownloadButton,
    isOpen,
    handleClose,
    t,
    uploadResult,
    selectedFile,
    isDragOver,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    openFileDialog,
    fileInputRef,
    accept,
    handleFileInputChange,
    getFileIcon,
    formatFileSize,
    removeFile,
    renderResults,
    handleUpload,
    isUploading,
    resetUpload,
  } = model;
  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={t("customers.bulkUploadTitle", "Bulk Upload Customers")}
      icon={Upload}
      description={t(
        "customers.bulkUploadDesc",
        "Upload a CSV, XLSX, or JSON file to add multiple customers at once.",
      )}
      width="w-full md:w-[600px] lg:w-[600px]"
    >
      <div className="p-4 sm:p-6 h-full flex flex-col">
        <div className="space-y-6 flex-1 overflow-y-auto">
          {!uploadResult ? (
            <>
              {/* Information Section */}
              <div className="bg-[rgb(var(--color-primary)/0.1)] rounded-lg border border-[rgb(var(--color-primary)/0.2)] p-4">
                <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
                  {t("customers.instructions", "Instructions")}
                </h4>
                <ul className="list-disc pl-5 text-sm text-[rgb(var(--color-text-secondary))] space-y-1 mb-4">
                  <li>
                    {t(
                      "customers.instruction1",
                      "Ensure file format is either .csv, .xlsx, or .json",
                    )}
                  </li>
                  <li>
                    {t(
                      "customers.instruction2",
                      "Maximum allowed file size is 5MB. ",
                    )}
                  </li>
                  <li>
                    {t(
                      "customers.instruction3",
                      "Make sure required fields (e.g., phone or name) are present.",
                    )}
                  </li>
                </ul>
                <BulkTemplateDownloadButton
                  module="customer"
                  fileName="customer_bulk_upload_template.xlsx"
                  sheetName="Customers"
                />
              </div>

              {/* Upload Area */}
              {!selectedFile ? (
                <div
                  className={`
                    relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
                    ${
                      isDragOver
                        ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))] bg-opacity-5"
                        : "border-[rgb(var(--color-border-primary))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-bg-secondary))]"
                    }
                  `}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={openFileDialog}
                >
                  <div className="p-8 text-center">
                    <Upload
                      className={`w-10 h-10 mx-auto mb-3 ${
                        isDragOver
                          ? "text-[rgb(var(--color-primary))]"
                          : "text-[rgb(var(--color-text-tertiary))]"
                      }`}
                    />
                    <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
                      {t(
                        "customers.dropZoneLabel",
                        "Click to upload or drag and drop",
                      )}
                    </p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                      {t(
                        "customers.supportedFormats",
                        "Supported formats: CSV, XLSX, JSON",
                      )}
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Selected File Card */
                <div className="bg-[rgb(var(--color-bg-secondary))] rounded-lg border border-[rgb(var(--color-border-primary))] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] flex items-center justify-center flex-shrink-0">
                        {getFileIcon(selectedFile.name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>

                    <SharedTooltip content={"Remove file"}><button aria-label={"Remove file"}
                      type="button"
                      onClick={removeFile}
                      className="p-2 cursor-pointer text-gray-500 hover:text-red-500 rounded-lg transition-colors duration-200 hover:bg-red-500/10"

                    >
                      <X className="w-5 h-5" />
                    </button></SharedTooltip>
                  </div>
                </div>
              )}
            </>
          ) : (
            renderResults()
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-[rgb(var(--color-border-primary))] pt-4 mt-6 flex justify-start gap-3">
          {!uploadResult ? (
            <>
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                loading={isUploading}
              >
                {isUploading
                  ? t("customers.uploading", "Uploading...")
                  : t("customers.upload", "Upload File")}
              </Button>
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isUploading}
              >
                {t("common.cancel", "Cancel")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={handleClose}>
                {t("customers.done", "Done")}
              </Button>
              <Button variant="secondary" onClick={resetUpload}>
                {t("customers.uploadAnother", "Upload Another")}
              </Button>
            </>
          )}
        </div>
      </div>
    </SideDrawer>
  );
}
