"use client";
import { Button, Modal, Tooltip as SharedTooltip } from "@dragorbit/ui";
import {
  ArrowLeft,
  Calendar,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  Trash2,
  User,
} from "lucide-react";
export function SuggestionDetailScreen({ model }) {
  const {
    Link,
    backLinkProps,
    t,
    suggestion,
    isLoading,
    getStatusBadge,
    getCategoryBadge,
    setShowDeleteModal,
    showDeleteModal,
    isDeleting,
    handleDeleteSuggestion,
  } = model;
  return (
    <div className="flex h-screen relative w-full overflow-hidden">
      <div className="min-h-screen w-full flex flex-col">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <Link
              {...backLinkProps}
              className="inline-flex items-center space-x-2 px-3 py-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t("common.backTo", { item: t("suggestions.title") })}
              </span>
            </Link>
          </div>

          {!suggestion && !isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))]">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                Suggestion Not Found
              </h2>
              <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                The suggestion you are looking for does not exist or has been
                removed.
              </p>
              <Link
                {...backLinkProps}
                className="text-[rgb(var(--color-primary))] hover:underline font-medium"
              >
                Back to support
              </Link>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              style={{ height: "calc(100vh - 300px)" }}
            >
              {/* Main Content */}
              <div className="lg:col-span-2 flex flex-col h-full">
                <div
                  className="overflow-y-auto pe-3 space-y-6"
                  style={{
                    height: "calc(100vh - 200px)",
                    maxHeight: "calc(100vh - 200px)",
                  }}
                >
                  <div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-4 text-balance">
                      {suggestion.title}
                    </h1>

                    <div className="prose prose-sm sm:prose-base max-w-none text-[rgb(var(--color-text-secondary))] leading-relaxed whitespace-pre-wrap">
                      {suggestion.description}
                    </div>

                    {suggestion.adminResponse && (
                      <div className="mt-8 p-6 bg-[rgb(var(--color-primary))]/5 border border-[rgb(var(--color-primary))]/20 rounded-xl">
                        <h4 className="text-sm font-bold text-[rgb(var(--color-primary))] uppercase tracking-wider mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Admin Response
                        </h4>
                        <p className="text-[rgb(var(--color-text-primary))]">
                          {suggestion.adminResponse}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Discussion Section */}
                  <div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] p-6">
                    <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))] mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Discussion
                    </h3>
                    <div className="py-8 text-center text-[rgb(var(--color-text-tertiary))]">
                      <p>
                        No comments yet. Be the first to start the discussion!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Info - Stats & Actions */}
              <div className="flex flex-col gap-6">
                <div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] p-6">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-[rgb(var(--color-border-primary))]">
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(suggestion.status)}
                      {getCategoryBadge(suggestion.category)}
                    </div>
                    <SharedTooltip content={"Delete Suggestion"}><button aria-label={"Delete Suggestion"}
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 text-[rgb(var(--color-text-tertiary))] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"

                    >
                      <Trash2 className="w-4 h-4" />
                    </button></SharedTooltip>
                  </div>

                  <h4 className="text-sm font-bold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-4 border-b border-[rgb(var(--color-border-primary))] pb-2">
                    Stats & Analytics
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
                        <ThumbsUp className="w-4 h-4" />
                        Upvotes
                      </div>
                      <span className="font-bold text-[rgb(var(--color-text-primary))]">
                        {suggestion.upvotes || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
                        <Calendar className="w-4 h-4" />
                        Submitted on
                      </div>
                      <span className="font-medium text-[rgb(var(--color-text-primary))]">
                        {new Date(suggestion.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
                        <User className="w-4 h-4" />
                        Submitted By
                      </div>
                      <span className="font-medium text-[rgb(var(--color-text-primary))]">
                        {suggestion.store?.name || "Premium Store"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-primary))]/5 rounded-2xl border border-[rgb(var(--color-primary))]/20 p-6">
                  <h4 className="text-sm font-bold text-[rgb(var(--color-primary))] uppercase tracking-wider mb-2">
                    Community Feedback
                  </h4>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                    Highly requested features are prioritized by our development
                    team. Share this suggestion with other retailers to gain
                    more traction.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Suggestion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[rgb(var(--color-text-secondary))]">
            Are you sure you want to delete this suggestion? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
              onClick={handleDeleteSuggestion}
              loading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
