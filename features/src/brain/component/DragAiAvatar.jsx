"use client";

import { DragBizzLogoIcon } from "./DragBizzLogoIcon.jsx";

export function DragAiAvatar({ isThinking = false, size = "md" }) {
  const isSm = size === "sm";
  return (
    <div
      className={`relative flex ${
        isSm ? "h-6 w-6" : "h-7 w-7"
      } shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-primary))] text-white shadow-xs ring-2 ring-[rgb(var(--color-primary))]/25 select-none`}
    >
      <DragBizzLogoIcon
        color="white"
        className={`${isSm ? "h-3.5 w-3.5" : "h-4 w-4"} drop-shadow-xs ${
          isThinking ? "animate-pulse" : ""
        }`}
      />
    </div>
  );
}

export default DragAiAvatar;

