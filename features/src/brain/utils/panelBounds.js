export const MIN_PANEL_WIDTH = 480;

export function getSidebarRightBoundary() {
  if (typeof document === "undefined") return 0;
  const sidebar = document.querySelector(
    'aside, [data-sidebar="true"], nav[aria-label*="Sidebar"]'
  );
  if (!sidebar) return 0;
  const rect = sidebar.getBoundingClientRect();
  return rect.right > 0 ? rect.right : 0;
}

export function getMaxPanelWidth() {
  if (typeof window === "undefined") return 1200;
  const sidebarRight = getSidebarRightBoundary();
  const available = window.innerWidth - sidebarRight;
  return Math.max(
    MIN_PANEL_WIDTH,
    available > 0 ? available : window.innerWidth
  );
}

export function getDefaultPanelWidth() {
  if (typeof window === "undefined") return MIN_PANEL_WIDTH;
  return Math.min(MIN_PANEL_WIDTH, window.innerWidth);
}

