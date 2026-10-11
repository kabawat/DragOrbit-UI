"use client";
import {
  MessageCircle,
  BookOpen,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Search,
  PlusCircle,
} from "lucide-react";
export function HelpTabView({ model }) {
  const {
    t,
    searchQuery,
    setSearchQuery,
    getMainDomainUrl,
    filteredFaqs,
    openFaq,
    toggleFaq,
    relatedLinks,
    iconsMap,
    Link,
    steps,
  } = model;
  return (
    <div className="h-full overflow-y-auto pr-2 pb-6 custom-scrollbar animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content (Left) */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Search Section */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] group-focus-within:text-[rgb(var(--color-primary))] transition-colors" />
            <input
              type="text"
              placeholder={
                t("help.ui.searchPlaceholder") ||
                "Search for topics, features, or questions..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] focus:border-[rgb(var(--color-primary))]/50 focus:ring-4 focus:ring-[rgb(var(--color-primary))]/5 outline-none transition-all font-sans text-sm"
            />
          </div>

          {/* Quick Support Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href={getMainDomainUrl("/help")}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[rgb(var(--color-bg-primary))] p-3.5 rounded-xl border border-[rgb(var(--color-border-primary))] hover:border-[rgb(var(--color-primary))]/30 transition-all hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-[rgb(var(--color-primary))]/10 rounded-lg flex-shrink-0 flex items-center justify-center text-[rgb(var(--color-primary))] group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[rgb(var(--color-text-primary))] truncate">
                  {t("help.ui.docsTitle") || "Feature Guides"}
                </h3>
                <p className="text-[rgb(var(--color-text-secondary))] text-[0.6875rem] leading-tight line-clamp-1 mt-0.5">
                  {t("help.ui.docsDesc") ||
                    "Step-by-step documentation for every feature."}
                </p>
              </div>
            </a>

            <a
              href="mailto:support@dragbizz.com"
              className="group bg-[rgb(var(--color-bg-primary))] p-3.5 rounded-xl border border-[rgb(var(--color-border-primary))] hover:border-[rgb(var(--color-primary))]/30 transition-all hover:bg-[rgb(var(--color-bg-secondary))] flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-[rgb(var(--color-success))]/10 rounded-lg flex-shrink-0 flex items-center justify-center text-[rgb(var(--color-success))] group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[rgb(var(--color-text-primary))] truncate">
                  {t("help.ui.contactTitle") || "Direct Support"}
                </h3>
                <p className="text-[rgb(var(--color-text-secondary))] text-[0.6875rem] leading-tight line-clamp-1 mt-0.5">
                  {t("help.ui.contactDesc") ||
                    "Talk to our team for personalized assistance."}
                </p>
              </div>
            </a>
          </div>

          {/* FAQs Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
                  {t("help.ui.faqTitle") || "Popular Questions"}
                </h3>
              </div>
              {searchQuery && (
                <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))] bg-[rgb(var(--color-bg-primary))] px-3 py-1 rounded-full border border-[rgb(var(--color-border-primary))]">
                  {filteredFaqs.length} results
                </span>
              )}
            </div>

            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className={`group border rounded-2xl transition-all duration-300 ${
                      openFaq === idx
                        ? "border-[rgb(var(--color-primary))]/40 bg-[rgb(var(--color-bg-primary))]"
                        : "border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-primary))]/20 hover:border-[rgb(var(--color-border-primary))] hover:bg-[rgb(var(--color-bg-primary))]"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                    >
                      <div className="flex flex-col gap-1">
                        {faq.category && (
                          <span className="text-[0.625rem] uppercase tracking-wider font-bold text-[rgb(var(--color-primary))] opacity-70">
                            {faq.category}
                          </span>
                        )}
                        <span className="font-bold text-sm text-[rgb(var(--color-text-primary))] leading-snug">
                          {faq.q}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[rgb(var(--color-text-tertiary))] transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="px-6 pb-6 text-[rgb(var(--color-text-secondary))] leading-relaxed text-sm antialiased italic border-t border-[rgb(var(--color-border-primary))]/40 pt-4">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-[rgb(var(--color-bg-primary))]/20 rounded-2xl border border-dashed border-[rgb(var(--color-border-primary))]">
                  <Search className="w-8 h-8 text-[rgb(var(--color-text-tertiary))] mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium text-[rgb(var(--color-text-tertiary))]">
                    No matching questions found.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs font-bold text-[rgb(var(--color-primary))] hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
          {/* Related Module Links */}
          <div className="bg-[rgb(var(--color-bg-primary))]/40 backdrop-blur-sm rounded-2xl border border-[rgb(var(--color-border-primary))] p-5">
            <h4 className="text-[0.625rem] font-bold uppercase tracking-widest text-[rgb(var(--color-text-tertiary))] mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-primary))]" />
              {t("help.ui.quickAccess") || "Quick Access"}
            </h4>
            <div className="space-y-3">
              {relatedLinks.map((link, idx) => {
                const Icon = iconsMap[link.icon];
                return (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[rgb(var(--color-bg-primary))] group border border-transparent hover:border-[rgb(var(--color-border-primary))] transition-all"
                  >
                    <div className="p-2 bg-[rgb(var(--color-bg-secondary))] rounded-lg text-[rgb(var(--color-text-secondary))] group-hover:text-[rgb(var(--color-primary))] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[rgb(var(--color-text-primary))] truncate">
                        {link.title}
                      </p>
                      <p className="text-[0.625rem] text-[rgb(var(--color-text-tertiary))] truncate font-medium">
                        {link.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Progress Checklist */}
          <div className="bg-[rgb(var(--color-bg-primary))] p-6 rounded-2xl border border-[rgb(var(--color-border-primary))]">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="w-4 h-4 text-[rgb(var(--color-primary))]" />
              <h3 className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                {t("help.ui.checklistTitle") || "Quick Setup"}
              </h3>
            </div>
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="mt-0.5 flex-shrink-0">
                    {step.completed ? (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-secondary))] group-hover:border-[rgb(var(--color-primary))]/40 transition-colors" />
                    )}
                  </div>
                  <span
                    className={`text-[0.6875rem] font-bold leading-tight ${step.completed ? "text-[rgb(var(--color-text-tertiary))] line-through opacity-60" : "text-[rgb(var(--color-text-primary))]"}`}
                  >
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Card */}
          <div className="bg-gradient-to-br from-[rgb(var(--color-primary))] to-indigo-600 p-6 rounded-2xl text-white overflow-hidden relative group">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <h4 className="text-[0.625rem] font-bold uppercase tracking-widest opacity-80 mb-2">
              Pro Tip
            </h4>
            <p className="text-xs font-semibold leading-relaxed mb-4 antialiased">
              Try{" "}
              <span className="underline decoration-white/40">Voice AI</span>{" "}
              for adding customers. Just say "Add John from Mumbai" and let us
              handle the rest!
            </p>
            <div className="flex gap-2">
              <span className="text-[0.5625rem] font-bold bg-white/20 px-2 py-1 rounded-md border border-white/10 uppercase">
                Alt + V
              </span>
              <span className="text-[0.5625rem] font-bold bg-white/20 px-2 py-1 rounded-md border border-white/10 uppercase tracking-tighter">
                AI Assistant
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
