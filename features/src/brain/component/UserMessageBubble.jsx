"use client";

import { User } from "lucide-react";

export function UserMessageBubble({ item, userName, fallbackUserLabel }) {
  return (
    <div className="flex animate-[chatFadeUp_0.25s_ease-out_both] flex-col items-end gap-1.5 my-2">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[rgb(var(--color-text-tertiary))] uppercase select-none">
        <User className="h-3 w-3" />
        <span>{userName || fallbackUserLabel || "STORE OWNER"}</span>
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/25 text-[rgb(var(--color-text-primary))] px-4 py-2.5 text-[13.5px] font-medium leading-relaxed shadow-2xs">
        <span className="block whitespace-pre-wrap text-[rgb(var(--color-text-primary))]">
          {item.content}
        </span>
      </div>
    </div>
  );
}

export default UserMessageBubble;

