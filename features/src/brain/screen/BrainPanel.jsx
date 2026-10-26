"use client";

import { IconButton } from "@dragorbit/ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AgentActivityCard } from "../component/AgentActivityCard.jsx";
import { AiChatPresentation } from "../component/AiChatPresentation.jsx";
import { AiLottieIcon } from "../component/AiLottieIcon.jsx";
import { AssistantMessageBubble } from "../component/AssistantMessageBubble.jsx";
import { ChatComposer } from "../component/ChatComposer.jsx";
import { ChatWorkspace } from "../component/ChatWorkspace.jsx";
import { DragAiAvatar } from "../component/DragAiAvatar.jsx";
import { DragBizzLogoIcon } from "../component/DragBizzLogoIcon.jsx";
import { PanelHeader } from "../component/PanelHeader.jsx";
import { PanelResizeHandle } from "../component/PanelResizeHandle.jsx";
import { UserMessageBubble } from "../component/UserMessageBubble.jsx";

import { useHotkeys } from "../hook/useHotkeys.js";
import { usePanelResize } from "../hook/usePanelResize.js";
import { VOICE_CAPTURE_ERRORS } from "../hook/useVoiceCapture.js";
import { titleFromUserText } from "../utils/chatHistory.js";
import {
  getDefaultPanelWidth,
  getMaxPanelWidth,
  MIN_PANEL_WIDTH,
} from "../utils/panelBounds.js";
import { matchSlashCommands } from "../utils/voiceSlashCommands.js";
import "../assets/brain.css";

const NoDownloads = () => null;

const BrainPanel = ({
  t = (key) => key,
  locale: _locale = "en",
  selectedStore: _selectedStore,
  user,
  chat = {},
  history = {},
  voice = {},
  LinkComponent,
  DownloadButtons = NoDownloads,
  showToolTrace: _showToolTrace = false,
  triggerButton = null,
  customTrigger = null,
  triggerClassName = "",
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const isControlled = controlledIsOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (action) => {
      const nextOpen =
        typeof action === "function" ? action(isOpen) : Boolean(action);
      if (!isControlled) {
        setInternalIsOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, isOpen, onOpenChange]
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [panelWidth, setPanelWidth] = useState(MIN_PANEL_WIDTH);
  const [maxPanelWidth, setMaxPanelWidth] = useState(1200);
  const panelRef = useRef(null);

  const [draftText, setDraftText] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [portalReady, setPortalReady] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionCreatedAtRef = useRef(Date.now());

  const toggleMaximize = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (!next) {
        setPanelWidth(getDefaultPanelWidth());
      }
      return next;
    });
  }, []);

  const { isDragging, handlePillMouseDown, handlePillTouchStart } =
    usePanelResize({
      panelWidth,
      setPanelWidth,
      maxPanelWidth,
      setMaxPanelWidth,
      isExpanded,
      setIsExpanded,
      toggleMaximize,
      panelRef,
    });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        const maxW = getMaxPanelWidth();
        setMaxPanelWidth(maxW);
        setPanelWidth((curr) =>
          Math.min(Math.max(curr, MIN_PANEL_WIDTH), maxW)
        );
      };
      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasAnimatedIn(false);
      setPanelWidth(getDefaultPanelWidth());
      setIsExpanded(false);
      setMaxPanelWidth(getMaxPanelWidth());
      const timer = setTimeout(() => {
        setHasAnimatedIn(true);
      }, 350);
      return () => clearTimeout(timer);
    }
    setHasAnimatedIn(false);
  }, [isOpen]);

  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    abortListening,
    resetTranscript,
  } = voice;

  const {
    messages,
    isSending,
    isConfirming,
    activeTool,
    progress,
    chatError,
    sendChat,
    confirmPending,
    rejectPending,
    resetChat,
    loadChat,
    storeId,
    sessionId,
  } = chat;

  const {
    grouped,
    loading: historyLoading,
    refresh: refreshHistory,
    getSession,
    optimisticTouch,
  } = history;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    setActiveSessionId(sessionId);
  }, [sessionId]);

  // Optimistic sidebar row after first user message; server persists on reply.
  useEffect(() => {
    if (!storeId || !activeSessionId || messages.length === 0) return;
    if (isSending || isConfirming) return;
    const firstUser = messages.find(
      (item) => item?.role === "user" && typeof item.content === "string"
    );
    if (!firstUser?.content) return;
    optimisticTouch({
      id: activeSessionId,
      title: titleFromUserText(firstUser.content),
      createdAt: sessionCreatedAtRef.current,
    });
  }, [
    messages,
    storeId,
    activeSessionId,
    optimisticTouch,
    isSending,
    isConfirming,
  ]);

  // After an active user turn finishes (assistant reply completed), refresh list from server
  const wasSendingRef = useRef(false);
  useEffect(() => {
    if (isSending || isConfirming) {
      wasSendingRef.current = true;
      return;
    }
    if (wasSendingRef.current) {
      wasSendingRef.current = false;
      if (storeId) {
        void refreshHistory();
      }
    }
  }, [isSending, isConfirming, storeId, refreshHistory]);

  useEffect(() => {
    if (!isListening && !interimTranscript) return;
    const live = [transcript, interimTranscript]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (live) setDraftText(live);
  }, [transcript, interimTranscript, isListening]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Scroll when streamed messages or request status change.
  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages, isSending, isConfirming, chatError]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Refocus the composer after changing window mode.
  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen, isExpanded]);

  const closePanel = useCallback(() => {
    abortListening?.();
    setIsExpanded(false);
    setIsOpen(false);
  }, [abortListening, setIsOpen]);

  const openPanel = useCallback(() => {
    setIsExpanded(false);
    setPanelWidth(getDefaultPanelWidth());
    setMaxPanelWidth(getMaxPanelWidth());
    setIsOpen(true);
  }, [setIsOpen]);

  const collapsePanel = useCallback(() => {
    setIsExpanded(false);
    setPanelWidth(getDefaultPanelWidth());
  }, []);

  const togglePanel = useCallback(() => {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }, [isOpen, closePanel, openPanel]);

  useHotkeys({
    "alt+v": (event) => {
      event.preventDefault();
      togglePanel();
    },
    escape: (event) => {
      if (!isOpen) return;
      event.preventDefault();
      if (isExpanded) {
        collapsePanel();
        return;
      }
      closePanel();
    },
  });

  useEffect(() => {
    return () => abortListening();
  }, [abortListening]);

  const handleMicrophoneClick = async () => {
    if (isListening) {
      const finalText = stopListening();
      if (finalText) {
        setDraftText(finalText);
        await sendChat(finalText);
        setDraftText("");
        resetTranscript();
      }
      return;
    }

    await startListening();
  };

  const handleSend = async () => {
    const text = draftText.trim();
    if (!text || isSending || !storeId) return;
    if (isListening) stopListening();
    setDraftText("");
    resetTranscript();
    await sendChat(text);
  };

  const handleQuickPrompt = useCallback(
    async (prompt) => {
      const text = typeof prompt === "string" ? prompt.trim() : "";
      if (!text || isSending || isConfirming || !storeId) return;
      if (isListening) stopListening();
      setDraftText("");
      resetTranscript();
      await sendChat(text);
    },
    [
      isSending,
      isConfirming,
      storeId,
      isListening,
      stopListening,
      resetTranscript,
      sendChat,
    ]
  );

  const slashMatches = useMemo(
    () => matchSlashCommands(draftText),
    [draftText]
  );
  const showSlashMenu = slashMatches.length > 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Each new draft resets the keyboard menu selection.
  useEffect(() => {
    setSlashIndex(0);
  }, [draftText]);

  const applySlashCommand = useCallback(
    (item) => {
      if (!item) return;
      const prompt = t(item.promptKey);
      if (typeof prompt === "string" && prompt.endsWith(" ")) {
        setDraftText(prompt);
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }
      void handleQuickPrompt(prompt);
    },
    [t, handleQuickPrompt]
  );

  const handleDraftKeyDown = (event) => {
    if (showSlashMenu) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSlashIndex((current) =>
          current + 1 >= slashMatches.length ? 0 : current + 1
        );
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSlashIndex((current) =>
          current - 1 < 0 ? slashMatches.length - 1 : current - 1
        );
        return;
      }
      if (event.key === "Tab" || (event.key === "Enter" && !event.shiftKey)) {
        event.preventDefault();
        applySlashCommand(slashMatches[slashIndex] || slashMatches[0]);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setDraftText("");
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    resetTranscript();
    resetChat();
    setDraftText("");
    sessionCreatedAtRef.current = Date.now();
  };

  const handleNewChat = () => {
    handleReset();
    void refreshHistory();
  };

  const handleSelectSession = async (session) => {
    if (!session?.id) return;
    if (session.id === activeSessionId) return;
    setDraftText("");
    const result = await getSession(session.id);
    if (!result?.success || !result.session) {
      return;
    }
    loadChat({
      sessionId: result.session.id,
      messages: result.session.messages || [],
    });
    sessionCreatedAtRef.current = result.session.createdAt || Date.now();
  };

  const canSend =
    Boolean(draftText.trim()) &&
    Boolean(storeId) &&
    !isSending &&
    !isConfirming;
  const isPermissionError =
    error?.code === VOICE_CAPTURE_ERRORS.PERMISSION_DENIED;
  const hasThread =
    messages.length > 0 || isSending || isConfirming || Boolean(chatError);

  const userFirst = (user?.firstName || user?.first_name || "").trim();
  const userLast = (user?.lastName || user?.last_name || "").trim();
  const combinedUserName = [userFirst, userLast].filter(Boolean).join(" ");
  const userName =
    combinedUserName ||
    user?.name ||
    user?.fullName ||
    user?.displayName ||
    userFirst ||
    "";

  const messageList = (
    <>
      {messages.map((item) =>
        item.role === "user" ? (
          <UserMessageBubble
            fallbackUserLabel={t("voice.userFallback", "STORE OWNER")}
            item={item}
            key={item.id}
            userName={userName}
          />
        ) : (
          <AssistantMessageBubble
            DownloadButtons={DownloadButtons}
            confirmPending={confirmPending}
            isConfirming={isConfirming}
            isSending={isSending}
            item={item}
            key={item.id}
            rejectPending={rejectPending}
            storeId={storeId}
            t={t}
          />
        )
      )}

      {(() => {
        const lastMessage = messages[messages.length - 1];
        const isStreamingLast =
          lastMessage?.role === "assistant" && Boolean(lastMessage?.streaming);

        if (!(isSending || isConfirming) || isStreamingLast) {
          return null;
        }

        return (
          <AgentActivityCard
            activeTool={activeTool}
            isConfirming={isConfirming}
            progress={progress}
          />
        );
      })()}

      {chatError && (
        <div className="flex justify-start items-start gap-2.5">
          <div className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl bg-[rgb(var(--color-danger))]/10 border border-[rgb(var(--color-danger))]/20 p-1 shadow-2xs">
            <DragBizzLogoIcon
              className="h-4 w-4"
              color="rgb(var(--color-danger))"
            />
          </div>
          <div className="rounded-2xl rounded-tl-sm border border-[rgb(var(--color-danger))]/25 bg-[rgb(var(--color-danger))]/8 px-3.5 py-2.5 text-[13px] leading-5 text-[rgb(var(--color-danger))] shadow-2xs">
            {chatError.code === "STORE_REQUIRED"
              ? t("voice.status.noStore")
              : chatError.message || t("voice.errors.ai_failed")}
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </>
  );

  const composer = (
    <ChatComposer
      applySlashCommand={applySlashCommand}
      canSend={canSend}
      draftText={draftText}
      handleDraftKeyDown={handleDraftKeyDown}
      handleMicrophoneClick={handleMicrophoneClick}
      handleQuickPrompt={handleQuickPrompt}
      handleSend={handleSend}
      hasThread={hasThread}
      inputRef={inputRef}
      isConfirming={isConfirming}
      isListening={isListening}
      isPermissionError={isPermissionError}
      isSending={isSending}
      isSupported={isSupported}
      onChangeDraft={setDraftText}
      onHoverSlash={setSlashIndex}
      onKeyDown={handleDraftKeyDown}
      onMicrophoneClick={handleMicrophoneClick}
      onQuickPrompt={handleQuickPrompt}
      onSelectSlash={applySlashCommand}
      onSend={handleSend}
      showSlashMenu={showSlashMenu}
      slashIndex={slashIndex}
      slashMatches={slashMatches}
      storeId={storeId}
      t={t}
      variant="docked"
    />
  );

  const centerComposer = (
    <ChatComposer
      canSend={canSend}
      draftText={draftText}
      handleMicrophoneClick={handleMicrophoneClick}
      handleSend={handleSend}
      isConfirming={isConfirming}
      isListening={isListening}
      isSending={isSending}
      isSupported={isSupported}
      onChangeDraft={setDraftText}
      onKeyDown={handleDraftKeyDown}
      onMicrophoneClick={handleMicrophoneClick}
      onSend={handleSend}
      storeId={storeId}
      t={t}
      variant="center"
    />
  );

  const chatPanel = (
    <>
      <div
        className="fixed inset-0 z-[399] bg-black/[0.04] transition-opacity duration-300"
        onClick={closePanel}
        aria-hidden="true"
      />
      {isDragging && (
        <div className="fixed inset-0 z-[500] cursor-col-resize select-none" />
      )}
      <section
        ref={panelRef}
        aria-label={t("voice.title")}
        aria-modal="true"
        role="dialog"
        className={`no-print fixed top-0 right-0 bottom-0 z-[400] flex flex-col h-full bg-[rgb(var(--color-bg-primary))] border-l border-[rgb(var(--color-border-primary))] shadow-[-16px_0_40px_rgba(0,0,0,0.08)] ${
          isDragging
            ? "transition-none select-none"
            : `transition-[width] duration-200 ease-out ${!hasAnimatedIn ? "animate-[drawerSlideIn_0.28s_cubic-bezier(0.16,1,0.3,1)]" : ""}`
        }`}
        style={{
          width: isExpanded ? `${maxPanelWidth}px` : `${panelWidth}px`,
          maxWidth: `${maxPanelWidth}px`,
          minWidth: `${Math.min(MIN_PANEL_WIDTH, typeof window !== "undefined" ? window.innerWidth : MIN_PANEL_WIDTH)}px`,
        }}
      >
        <PanelResizeHandle
          isExpanded={isExpanded}
          maxWidth={maxPanelWidth}
          minWidth={MIN_PANEL_WIDTH}
          onMouseDown={handlePillMouseDown}
          onToggleMaximize={toggleMaximize}
          onTouchStart={handlePillTouchStart}
          panelWidth={panelWidth}
        />

        <PanelHeader
          hasThread={hasThread}
          isExpanded={isExpanded}
          onClose={closePanel}
          onNewChat={handleNewChat}
          onToggleMaximize={toggleMaximize}
          t={t}
        />

        <ChatWorkspace
          activeSessionId={activeSessionId}
          centerComposer={centerComposer}
          composer={composer}
          hasThread={hasThread}
          historyGrouped={grouped}
          historyLoading={historyLoading}
          isExpanded={isExpanded}
          onNewChat={handleNewChat}
          onQuickPrompt={handleQuickPrompt}
          onSelectSession={handleSelectSession}
          showHistory={
            isExpanded ||
            (typeof window !== "undefined" &&
              panelWidth >= window.innerWidth * 0.5)
          }
          t={t}
          userName={userName}
        >
          {messageList}
        </ChatWorkspace>
      </section>
    </>
  );

  return (
    <AiChatPresentation t={t} LinkComponent={LinkComponent}>
      {(() => {
        const trigger = triggerButton || customTrigger;
        if (trigger) {
          return typeof trigger === "function" ? (
            trigger({
              isOpen,
              setIsOpen,
              openPanel,
              closePanel,
              togglePanel,
            })
          ) : (
            <button
              aria-expanded={isOpen}
              aria-haspopup="dialog"
              className={`no-print bg-[rgb(var(--color-text-primary)/0.06)] border border-[rgb(var(--color-border-primary)/0.6)] ${triggerClassName}`}
              onClick={isOpen ? closePanel : openPanel}
              type="button"
            >
              {trigger}
            </button>
          );
        }
        return (
          <IconButton
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className={`no-print bg-[rgb(var(--color-text-primary)/0.06)] border border-[rgb(var(--color-border-primary)/0.6)] ${triggerClassName}`}
            icon={AiLottieIcon}
            iconClassName="h-5 w-5"
            onClick={isOpen ? closePanel : openPanel}
            title={`${t("voice.open")} — ${t("voice.shortcut")}`}
          />
        );
      })()}
      {portalReady && isOpen && createPortal(chatPanel, document.body)}
    </AiChatPresentation>
  );
};

export { DragAiAvatar };
export { BrainPanel };
export default BrainPanel;
