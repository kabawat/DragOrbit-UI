// Screen

export {
  AiChatLink,
  AiChatPresentation,
  useAiChatPresentation,
} from "./component/AiChatPresentation.jsx";
export { AiLottieIcon } from "./component/AiLottieIcon.jsx";
// Components
export {
  areValidSequentialSteps,
  ChatAssistantMessage,
  parseBlocks,
  parseStepGuide,
} from "./component/ChatAssistantMessage.jsx";
export {
  ChatCustomerResultCard,
  collectCustomerWrites,
  stripCustomerOpenLinks,
} from "./component/ChatCustomerResultCard.jsx";
export { ChatSlashMenu } from "./component/ChatSlashMenu.jsx";
export { ChatWorkspace } from "./component/ChatWorkspace.jsx";
export { DragAiAvatar } from "./component/DragAiAvatar.jsx";
export { DragAiIcon, DragBizzLogoIcon } from "./component/DragBizzLogoIcon.jsx";
// Hooks
export {
  default as useFloatingPanel,
  fitPanel,
  resizePanel,
} from "./hook/useFloatingPanel.js";
export { useHotkeys } from "./hook/useHotkeys.js";
export {
  useVoiceCapture,
  VOICE_CAPTURE_ERRORS,
} from "./hook/useVoiceCapture.js";
export { BrainPanel, BrainPanel as default } from "./screen/BrainPanel.jsx";
// Utils
export * from "./utils/chatHistory.js";
export {
  matchSlashCommands,
  VOICE_SLASH_COMMANDS,
} from "./utils/voiceSlashCommands.js";
