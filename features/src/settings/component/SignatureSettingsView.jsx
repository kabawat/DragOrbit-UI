"use client";
import { Button, Tooltip as SharedTooltip } from "@dragorbit/ui";
import { Fingerprint, PenTool, Plus, Trash2 } from "lucide-react";
export function SignatureSettingsView({ model }) {
  const {
    t,
    setShowDrawer,
    signaturesLoading,
    signatures,
    setSignatureToDelete,
    Image,
    themeVariant,
    SignatureDrawer,
    showDrawer,
    handleCreateSuccess,
    agencyId,
    SignatureDeleteModal,
    signatureToDelete,
    isDeleting,
    confirmDelete,
  } = model;
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] flex items-center gap-2">
            <PenTool className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            {t("settings.digitalSignatures") || "Digital Signatures"}
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
            {t("settings.signatureDescription") ||
              "Manage your digital signatures for invoices and documents."}
          </p>
        </div>
        <Button
          onClick={() => setShowDrawer(true)}
          leftIcon={Plus}
          variant="primary"
        >
          {t("common.addNew") || "Add New"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {signaturesLoading && signatures.length === 0 ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))
        ) : signatures.length > 0 ? (
          <>
            {signatures.map((sig) => {
              const id = sig.id || sig._id;
              return (
                <div
                  key={id}
                  className="bg-[rgb(var(--color-bg-primary))]/20 rounded-lg border border-[rgb(var(--color-border-primary))]/70 p-4 relative group flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-[rgb(var(--color-border-primary))]/20 pb-3">
                    <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {new Date(sig.createdAt).toLocaleDateString()}
                    </div>
                    <SharedTooltip content={t("common.delete")}><button aria-label={t("common.delete")}
                      onClick={() => setSignatureToDelete(sig)}
                      className="w-8 h-8 flex items-center justify-center bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))] rounded-lg transition-colors cursor-pointer"

                    >
                      <Trash2 className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                    </button></SharedTooltip>
                  </div>

                  <div className="flex-1 flex items-center justify-center min-h-[100px] bg-[rgb(var(--color-bg-secondary))]/30 rounded-lg p-4 mb-2">
                    <div className="relative w-full h-24 flex items-center justify-center">
                      {sig.method === "upload" || sig.method === "draw" ? (
                        <Image
                          src={sig.content}
                          alt="Signature"
                          fill
                          className={`object-contain ${themeVariant === "dark" ? "invert" : ""}`}
                        />
                      ) : sig.method === "type" ? (
                        <span
                          style={{
                            fontFamily:
                              sig.config?.fontFamily ||
                              "'Dancing Script', cursive",
                          }}
                          className={`text-4xl text-[rgb(var(--color-text-primary))] select-none ${sig.config?.bold ? "font-bold" : ""} ${sig.config?.italic ? "italic" : ""}`}
                        >
                          {sig.content}
                        </span>
                      ) : sig.method === "identity" ? (
                        <div className="text-center text-[rgb(var(--color-primary))]">
                          <Fingerprint className="w-6 h-6 mx-auto mb-1 opacity-70" />
                          <p className="font-bold tracking-widest text-lg">
                            {sig.content}
                          </p>
                          <p className="text-[0.625rem] uppercase font-black opacity-50">
                            {sig.verificationDetails?.idType || "Verified ID"}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-[0.625rem] text-center text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider font-medium">
                    {sig.method === "type"
                      ? t("invoice.typeName")
                      : sig.method === "draw"
                        ? t("invoice.draw")
                        : t("invoice.uploadImage")}
                  </div>
                </div>
              );
            })}
            {/* Always show Add New Card at the end if there are signatures */}
            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              className="bg-[rgb(var(--color-bg-primary))]/20 rounded-lg border border-dashed border-[rgb(var(--color-border-primary))]/70 p-6 relative flex flex-col items-center justify-center h-full min-h-[220px] hover:border-[rgb(var(--color-primary))]/60 hover:bg-[rgb(var(--color-primary))]/5 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 mb-4 rounded-full bg-[rgb(var(--color-primary))]/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-[rgb(var(--color-primary))]" />
              </div>
              <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-1">
                {t("common.addNew")}
              </h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] text-center max-w-[220px]">
                {t("settings.createSignaturePrompt") ||
                  "Create a new digital signature"}
              </p>
            </button>
          </>
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-[rgb(var(--color-border-primary))]/50 rounded-xl bg-[rgb(var(--color-bg-primary))]/30">
            <div className="p-4 rounded-full bg-[rgb(var(--color-bg-secondary))] mb-4">
              <PenTool className="w-8 h-8 text-[rgb(var(--color-text-tertiary))]" />
            </div>
            <h3 className="text-base font-medium text-[rgb(var(--color-text-primary))] mb-1">
              {t("settings.noSignatures") || "No signatures found"}
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4 max-w-sm">
              {t("settings.createSignaturePrompt") ||
                "Create a digital signature to use on your invoices and documents."}
            </p>
            <Button
              onClick={() => setShowDrawer(true)}
              variant="outline"
              size="sm"
              leftIcon={Plus}
            >
              {t("common.createNow") || "Create Now"}
            </Button>
          </div>
        )}
      </div>

      <SignatureDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSuccess={handleCreateSuccess}
        agencyId={agencyId}
      />

      <SignatureDeleteModal
        isOpen={!!signatureToDelete}
        signatureToDelete={signatureToDelete}
        isDeleting={isDeleting}
        onClose={() => setSignatureToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
