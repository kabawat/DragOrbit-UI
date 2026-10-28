/** Return a local image source for saved signatures, including typed signatures. */
export function signatureToImage(signature) {
  if (!signature?.content) return "";
  if (signature.method === "upload" || signature.method === "draw") return signature.content;

  const family = String(signature.config?.fontFamily || "cursive").replace(/["&<>]/g, "");
  const escaped = String(signature.content).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[char]);
  const weight = signature.config?.bold ? "700" : "400";
  const italic = signature.config?.italic ? "italic" : "normal";
  const color = /^#[\da-f]{3,8}$/i.test(signature.config?.color || "") ? signature.config.color : "#111827";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="120" viewBox="0 0 480 120"><text x="8" y="82" font-family="${family}" font-size="64" font-weight="${weight}" font-style="${italic}" fill="${color}">${escaped}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
