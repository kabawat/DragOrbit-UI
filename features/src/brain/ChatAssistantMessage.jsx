/** biome-ignore-all lint/suspicious/noArrayIndexKey: Markdown tokens are immutable positional snapshots, with no editable or reorderable child state. */
"use client";

import { ArrowUpRight } from "lucide-react";
import { Fragment, useMemo } from "react";
import { AiChatLink as Link } from "./AiChatPresentation.jsx";

const STEP_CHUNK = /(?:\r?\n)+\s*(?=\d+\.\s+)/;
const TABLE_SEP = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/;
const SHORTCUT_RE =
  /(?:Alt|Ctrl|Control|Shift|Cmd|Command|Meta)\s*\+\s*(?:Shift\s*\+\s*)?[A-Za-z0-9,?\\]+|F\d{1,2}/i;
const INLINE_SPLIT =
  /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\/dashboard\/[a-zA-Z0-9/_-]*|(?:Alt|Ctrl|Control|Shift|Cmd|Command|Meta)\s*\+\s*(?:Shift\s*\+\s*)?[A-Za-z0-9,?\\]+|F\d{1,2})/gi;

function normalizeMessage(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\\n/g, "\n")
    .trim();
}

function isInternalHref(href) {
  return typeof href === "string" && href.startsWith("/");
}

function isExternalHref(href) {
  return typeof href === "string" && /^https?:\/\//i.test(href);
}

function isDashboardPath(value) {
  return typeof value === "string" && value.startsWith("/dashboard/");
}

function normalizeShortcut(label) {
  return String(label)
    .replace(/\s+/g, "")
    .replace(/Control/gi, "Ctrl")
    .replace(/Command|Meta/gi, "Cmd")
    .replace(/\+/g, "+");
}

/**
 * Validates that step numbers are strictly sequential positive integers starting at 1.
 */
export function areValidSequentialSteps(steps) {
  if (!Array.isArray(steps) || steps.length < 2) return false;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i]?.number !== i + 1) return false;
  }
  return true;
}

/**
 * Parse one "1. …" chunk into title/body.
 * Title only when the model used **Title** or a short "Label: rest" form —
 * never peel the first letter off a plain sentence (e.g. "Agar …").
 */
function parseStepChunk(chunk) {
  const trimmed = String(chunk || "").trim();
  const numbered = trimmed.match(/^(\d+)\.\s+([\s\S]+)$/);
  if (!numbered) return null;

  const number = Number(numbered[1]);
  if (!Number.isInteger(number) || number <= 0) return null;
  const rest = numbered[2].trim();

  const bold = rest.match(/^\*\*(.+?)\*\*\s*:?\s*([\s\S]*)$/);
  if (bold) {
    return {
      number,
      title: bold[1].trim().replace(/:$/, ""),
      body: (bold[2] || "").trim(),
    };
  }

  const colon = rest.match(/^([^:\n*]{1,48}):\s+([\s\S]+)$/);
  if (colon) {
    return {
      number,
      title: colon[1].trim(),
      body: colon[2].trim(),
    };
  }

  return { number, title: "", body: rest };
}

/**
 * Split assistant text into intro + numbered steps + outro.
 */
export function parseStepGuide(text) {
  const trimmed = normalizeMessage(text);
  if (!trimmed) {
    return { intro: "", steps: [], outro: "" };
  }

  const chunks = trimmed.split(STEP_CHUNK).filter((part) => part.trim());
  const introParts = [];
  const outroParts = [];
  const rawSteps = [];
  let seenStep = false;

  for (const chunk of chunks) {
    const step = parseStepChunk(chunk);
    if (step) {
      seenStep = true;
      rawSteps.push(step);
      continue;
    }

    if (!seenStep) {
      introParts.push(chunk.trim());
    } else {
      outroParts.push(chunk.trim());
    }
  }

  const steps = areValidSequentialSteps(rawSteps) ? rawSteps : [];
  if (steps.length === 0) {
    return {
      intro: trimmed,
      steps: [],
      outro: "",
    };
  }

  return {
    intro: introParts.join("\n\n").trim(),
    steps,
    outro: outroParts.join("\n\n").trim(),
  };
}

function splitTableRow(line) {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((cell) => cell.trim());
}

function looksLikeTableHeader(line) {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;
  const cells = splitTableRow(trimmed);
  return cells.length >= 2;
}

export function parseBlocks(text) {
  const lines = normalizeMessage(text).split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    const next = i + 1 < lines.length ? lines[i + 1].trim() : "";
    const isTable =
      (trimmed.startsWith("|") || looksLikeTableHeader(trimmed)) &&
      TABLE_SEP.test(next);

    if (isTable) {
      const rows = [];
      while (i < lines.length) {
        const rowLine = lines[i].trim();
        if (!rowLine || (!rowLine.includes("|") && !rowLine.startsWith("|"))) {
          break;
        }
        if (!TABLE_SEP.test(rowLine)) {
          rows.push(splitTableRow(rowLine));
        }
        i += 1;
      }
      if (rows.length) {
        blocks.push({ type: "table", header: rows[0], body: rows.slice(1) });
      }
      continue;
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      blocks.push({
        type: "heading",
        level: trimmed.match(/^#+/)[0].length,
        text: trimmed.replace(/^#{1,3}\s+/, ""),
      });
      i += 1;
      continue;
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "bullets", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const stepStart = lines.slice(i).join("\n");
      const { steps, outro } = parseStepGuide(stepStart);
      if (areValidSequentialSteps(steps)) {
        blocks.push({ type: "steps", steps });
        i = lines.length;
        if (outro) {
          blocks.push(...parseBlocks(outro));
        }
        continue;
      }

      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      if (items.length > 0) {
        blocks.push({ type: "numbered", items });
        continue;
      }
    }

    const para = [trimmed];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("|") &&
      !TABLE_SEP.test(lines[i].trim()) &&
      !/^#{1,3}\s+/.test(lines[i].trim()) &&
      !/^[-*•]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      // Don't swallow a table header that is about to start.
      if (
        i + 1 < lines.length &&
        looksLikeTableHeader(lines[i]) &&
        TABLE_SEP.test(lines[i + 1].trim())
      ) {
        break;
      }
      para.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ type: "paragraph", text: para.join(" ") });
  }

  return blocks;
}

function ShortcutChip({ label }) {
  return (
    <kbd className="inline-flex items-center rounded-md border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-tertiary))] px-1.5 py-0.5 font-mono text-[10.5px] font-medium tracking-wide text-[rgb(var(--color-text-primary))] transition-colors hover:border-[rgb(var(--color-primary))]/45">
      {normalizeShortcut(label)}
    </kbd>
  );
}

function ChatLink({ href, children, chip = false }) {
  const className = chip
    ? "ai-chat-accent inline-flex max-w-full items-center gap-1 rounded-full border border-[rgb(var(--color-primary))]/20 bg-[rgb(var(--color-primary))]/8 px-2 py-0.5 text-[11px] font-medium transition-colors hover:border-[rgb(var(--color-primary))]/40 hover:bg-[rgb(var(--color-primary))]/14"
    : "ai-chat-accent font-medium underline decoration-[rgb(var(--color-primary))]/30 underline-offset-2 transition-colors hover:decoration-[rgb(var(--color-primary))]";
  const accentStyle = { color: "rgb(var(--color-primary))" };

  const content = chip ? (
    <>
      <span className="truncate">{children}</span>
      <ArrowUpRight className="h-3 w-3 shrink-0 opacity-70" />
    </>
  ) : (
    children
  );

  if (isInternalHref(href)) {
    return (
      <Link className={className} href={href} style={accentStyle}>
        {content}
      </Link>
    );
  }

  if (isExternalHref(href)) {
    return (
      <a
        className={className}
        href={href}
        rel="noopener noreferrer"
        style={accentStyle}
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return (
    <span className={className} style={accentStyle}>
      {content}
    </span>
  );
}

function renderInline(text, keyPrefix = "i") {
  if (!text) return null;
  const parts = String(text)
    .split(INLINE_SPLIT)
    .filter((part) => part !== "");

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return (
        <strong
          className="font-semibold text-[rgb(var(--color-text-primary))]"
          key={key}
        >
          {bold[1]}
        </strong>
      );
    }

    const code = part.match(/^`([^`]+)`$/);
    if (code) {
      const value = code[1].trim();
      if (isDashboardPath(value)) {
        return (
          <ChatLink chip href={value} key={key}>
            {value.replace(/^\/dashboard\/?/, "") || "dashboard"}
          </ChatLink>
        );
      }
      if (SHORTCUT_RE.test(value)) {
        return <ShortcutChip key={key} label={value} />;
      }
      return (
        <code
          className="rounded bg-[rgb(var(--color-bg-primary))] px-1 py-0.5 font-mono text-[11px] text-[rgb(var(--color-text-primary))]"
          key={key}
        >
          {value}
        </code>
      );
    }

    const mdLink = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLink) {
      return (
        <ChatLink href={mdLink[2]} key={key}>
          {mdLink[1]}
        </ChatLink>
      );
    }

    if (isDashboardPath(part)) {
      return (
        <ChatLink chip href={part} key={key}>
          {part.replace(/^\/dashboard\/?/, "") || "dashboard"}
        </ChatLink>
      );
    }

    if (SHORTCUT_RE.test(part) && part.length < 24) {
      return <ShortcutChip key={key} label={part} />;
    }

    return <Fragment key={key}>{part}</Fragment>;
  });
}

function AnimatedBlock({ index, children }) {
  return (
    <div
      className="animate-[chatFadeUp_0.35s_ease-out_both]"
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      {children}
    </div>
  );
}

function StepsBlock({ steps }) {
  return (
    <ol className="relative m-0 list-none space-y-0 p-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li
            className="relative flex gap-3 pb-3.5 last:pb-0"
            key={step.number}
          >
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute top-7 bottom-0 left-[13px] w-px bg-[rgb(var(--color-border-primary))]/70"
              />
            )}
            <span
              aria-hidden="true"
              className="ai-chat-accent relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/12 text-[11px] font-bold tabular-nums ring-1 ring-[rgb(var(--color-primary))]/25"
              style={{ color: "rgb(var(--color-primary))" }}
            >
              {step.number}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              {step.title ? (
                <p className="text-[13px] font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
                  {renderInline(step.title, `st-${step.number}`)}
                </p>
              ) : null}
              {step.body ? (
                <p
                  className={`leading-5 ${
                    step.title
                      ? "mt-0.5 text-[12.5px] text-[rgb(var(--color-text-secondary))]"
                      : "text-[13px] text-[rgb(var(--color-text-primary))]"
                  }`}
                >
                  {renderInline(step.body, `sb-${step.number}`)}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function parseActionTokens(cell) {
  const tokens = String(cell || "")
    .split(
      /\s*[·•|,]\s*|(?:\s+(?=\/dashboard\/|(?:Alt|Ctrl|Shift|Cmd)\s*\+|POS\b|Stock\b|Tally\b))/i
    )
    .map((part) => part.trim().replace(/^`|`$/g, ""))
    .filter(Boolean);

  const links = [];
  const shortcuts = [];
  const seenHrefs = new Set();
  const seenShortcuts = new Set();

  const pushLink = (href, label) => {
    if (!href || seenHrefs.has(href)) return;
    seenHrefs.add(href);
    links.push({ href, label });
  };
  const pushShortcut = (label) => {
    if (!label || seenShortcuts.has(label)) return;
    seenShortcuts.add(label);
    shortcuts.push(label);
  };

  for (const token of tokens) {
    const pathMatch = token.match(/\/dashboard\/[a-zA-Z0-9/_-]*/);
    if (pathMatch) {
      const href = pathMatch[0];
      const prefix = token.match(/^(POS|Tally|Stock)\b/i)?.[1];
      pushLink(href, prefix || href.replace(/^\/dashboard\/?/, "") || "Open");
      const shortcutMatch = token.match(SHORTCUT_RE);
      if (shortcutMatch) pushShortcut(shortcutMatch[0]);
      continue;
    }

    if (/^POS\b/i.test(token)) {
      pushLink("/dashboard/pos", "POS");
      const shortcutMatch = token.match(SHORTCUT_RE);
      if (shortcutMatch) pushShortcut(shortcutMatch[0]);
      continue;
    }

    if (/^Stock\b/i.test(token)) {
      pushLink("/dashboard/stock", "Stock");
      const shortcutMatch = token.match(SHORTCUT_RE);
      if (shortcutMatch) pushShortcut(shortcutMatch[0]);
      continue;
    }

    if (/^Tally\b/i.test(token)) {
      pushLink("/dashboard/integrations/tally", "Tally");
      const shortcutMatch = token.match(SHORTCUT_RE);
      if (shortcutMatch) pushShortcut(shortcutMatch[0]);
      continue;
    }

    const shortcutMatch = token.match(SHORTCUT_RE);
    if (shortcutMatch) {
      pushShortcut(shortcutMatch[0]);
    }
  }

  return { links, shortcuts };
}

function FeatureCards({ header, body }) {
  const [titleKey = "Area", descKey = "Details", actionKey = "Open"] = header;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--color-text-secondary))]">
          {titleKey}
        </p>
        <p className="text-[10px] text-[rgb(var(--color-text-secondary))]">
          {actionKey}
        </p>
      </div>
      <ul className="m-0 space-y-2 p-0">
        {body.map((row, rowIndex) => {
          const [title = "", description = "", actions = ""] = row;
          const { links, shortcuts } = parseActionTokens(
            actions || description
          );
          const detail =
            actions && description
              ? description
              : links.length || shortcuts.length
                ? description
                : row.slice(1).join(" · ");

          return (
            <li
              className="group rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:border-[rgb(var(--color-primary))]/35 hover:bg-[rgb(var(--color-bg-tertiary))]"
              key={`feat-${rowIndex}`}
            >
              <p className="text-[13px] font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
                {renderInline(title, `ft-${rowIndex}`)}
              </p>
              {detail ? (
                <p className="mt-0.5 text-[12px] leading-5 text-[rgb(var(--color-text-secondary))]">
                  {renderInline(detail, `fd-${rowIndex}`)}
                </p>
              ) : null}
              {(links.length > 0 || shortcuts.length > 0) && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {links.map((link) => (
                    <ChatLink
                      chip
                      href={link.href}
                      key={`${link.href}-${link.label}`}
                    >
                      {link.label}
                    </ChatLink>
                  ))}
                  {shortcuts.map((shortcut) => (
                    <ShortcutChip key={shortcut} label={shortcut} />
                  ))}
                </div>
              )}
              {!links.length && !shortcuts.length && actions ? (
                <p className="mt-1.5 text-[11px] text-[rgb(var(--color-text-secondary))]">
                  <span className="sr-only">{descKey}: </span>
                  {renderInline(actions, `fa-${rowIndex}`)}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CompactTable({ header, body }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[rgb(var(--color-border-primary))]/70">
      <table className="w-full min-w-[220px] border-collapse text-left text-[12px]">
        <thead>
          <tr className="bg-[rgb(var(--color-primary))]/8">
            {header.map((cell, index) => (
              <th
                className="border-b border-[rgb(var(--color-border-primary))]/60 px-2.5 py-2 font-semibold text-[rgb(var(--color-text-primary))]"
                key={`h-${index}`}
              >
                {renderInline(cell, `th-${index}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr
              className="transition-colors hover:bg-[rgb(var(--color-primary))]/[0.06]"
              key={`r-${rowIndex}`}
            >
              {row.map((cell, cellIndex) => (
                <td
                  className="border-b border-[rgb(var(--color-border-primary))]/40 px-2.5 py-2 align-top text-[rgb(var(--color-text-secondary))]"
                  key={`c-${rowIndex}-${cellIndex}`}
                >
                  {renderInline(cell, `td-${rowIndex}-${cellIndex}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableBlock({ header, body }) {
  // Chat panel is narrow — 3+ column feature tables work better as cards.
  if (header.length >= 3) {
    return <FeatureCards body={body} header={header} />;
  }
  return <CompactTable body={body} header={header} />;
}

function renderBlock(block, index) {
  switch (block.type) {
    case "heading":
      return (
        <AnimatedBlock index={index} key={`b-${index}`}>
          <p
            className={`font-semibold text-[rgb(var(--color-text-primary))] ${
              block.level <= 2 ? "text-[14px]" : "text-[13px]"
            }`}
          >
            {renderInline(block.text, `h-${index}`)}
          </p>
        </AnimatedBlock>
      );
    case "bullets":
      return (
        <AnimatedBlock index={index} key={`b-${index}`}>
          <ul className="m-0 space-y-1.5 p-0">
            {block.items.map((item, itemIndex) => (
              <li
                className="group flex gap-2.5 rounded-lg px-1 py-0.5 transition-colors hover:bg-[rgb(var(--color-primary))]/[0.05]"
                key={`bu-${itemIndex}`}
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--color-primary))] transition-transform group-hover:scale-125"
                />
                <span className="text-[12.5px] leading-5 text-[rgb(var(--color-text-primary))]">
                  {renderInline(item, `bu-t-${itemIndex}`)}
                </span>
              </li>
            ))}
          </ul>
        </AnimatedBlock>
      );
    case "numbered":
      return (
        <AnimatedBlock index={index} key={`b-${index}`}>
          <ol className="m-0 list-decimal space-y-1.5 py-0 pl-4">
            {block.items.map((item, itemIndex) => (
              <li
                className="text-[12.5px] leading-5 text-[rgb(var(--color-text-primary))] marker:font-semibold marker:text-[rgb(var(--color-primary))]"
                key={`nu-${itemIndex}`}
              >
                {renderInline(item, `nu-t-${itemIndex}`)}
              </li>
            ))}
          </ol>
        </AnimatedBlock>
      );
    case "steps":
      return (
        <AnimatedBlock index={index} key={`b-${index}`}>
          <StepsBlock steps={block.steps} />
        </AnimatedBlock>
      );
    case "table":
      return (
        <AnimatedBlock index={index} key={`b-${index}`}>
          <TableBlock body={block.body} header={block.header} />
        </AnimatedBlock>
      );
    default:
      return (
        <AnimatedBlock index={index} key={`b-${index}`}>
          <p className="text-[13px] leading-5 text-[rgb(var(--color-text-primary))]">
            {renderInline(block.text, `p-${index}`)}
          </p>
        </AnimatedBlock>
      );
  }
}

const ChatAssistantMessage = ({ message, className = "" }) => {
  const blocks = useMemo(() => {
    const trimmed = normalizeMessage(message);
    if (!trimmed) return [];
    return parseBlocks(trimmed);
  }, [message]);

  if (!blocks.length) return null;

  return (
    <div className={`space-y-2.5 ${className}`.trim()}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export { ChatAssistantMessage };
export default ChatAssistantMessage;
