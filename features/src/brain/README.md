# Brain

Import the shared UI from `@dragorbit/features/brain`.

`BrainPanel` owns the header launcher, messages, history, responsive workspace,
composer, keyboard shortcuts, floating window, fullscreen and eight resize handles.
The UI never imports Next.js, Electron, Redux or an application API client.
The window is portalled to the current renderer document; no separate Electron window is created.

## Platform adapters

- Web: `dragbizz-store-fe/src/components/voice/VoiceCommandLauncher.jsx` supplies its existing authenticated chat/history hooks, translation, Next Link and ledger download component.
- Desktop: `dragbizz-desktop/desktop/src/features/brain/BrainPanel.jsx` supplies TanStack Link. Pass real desktop controllers before mounting this adapter. There is currently no desktop AI API bridge; this change does not invent one or mount a nonfunctional launcher.

## Required props

- `t(key)`, `locale`, `selectedStore`, `user`: current application labels and profile.
- `chat`: `messages`, `isSending`, `isConfirming`, `chatError`, `storeId`, `sessionId`, and methods `sendChat`, `confirmPending`, `rejectPending`, `resetChat`, `loadChat`.
- `history`: `grouped` (`today`, `yesterday`, `week`, `older` arrays), `loading`, `error`, and methods `refresh`, `getSession`, `optimisticTouch`.
- `voice`: result of exported `useVoiceCapture({ language })`. On a renderer without speech recognition the microphone is disabled; text chat still works. Electron microphone access continues to follow the application's permission policy.
- `LinkComponent` (optional): accepts `href`, `children`, and normal anchor props. Omit to use standard anchors. Each app adapter chooses its own router.
- `DownloadButtons` (optional): receives `storeId` and `toolResults`. Supply the platform's ledger export implementation; absent means no export controls.
- `showToolTrace` (optional, false): development tool diagnostics.

History normalization helpers are available from `@dragorbit/features/brain/history`.
Visual changes belong here; keep services, credentials, exports and routing in platform adapters.
