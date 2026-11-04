"use client";

import { useCallback, useRef, useState } from "react";
import { getMaxPanelWidth, MIN_PANEL_WIDTH } from "../utils/panelBounds.js";

export function usePanelResize({
  panelWidth,
  setPanelWidth,
  setMaxPanelWidth,
  isExpanded,
  setIsExpanded,
  toggleMaximize,
  panelRef,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({
    startX: 0,
    startWidth: MIN_PANEL_WIDTH,
    hasDragged: false,
  });

  const handlePillMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const currentWidth = panelRef.current?.offsetWidth || panelWidth;
      const maxAllowed = getMaxPanelWidth();
      setMaxPanelWidth(maxAllowed);
      dragStartRef.current = {
        startX,
        startWidth: currentWidth,
        hasDragged: false,
      };
      setIsDragging(true);

      const onMouseMove = (moveEvent) => {
        const delta = dragStartRef.current.startX - moveEvent.clientX;
        if (Math.abs(delta) > 3) {
          dragStartRef.current.hasDragged = true;
          if (isExpanded) {
            setIsExpanded(false);
          }
        }
        const newWidth = Math.min(
          Math.max(dragStartRef.current.startWidth + delta, MIN_PANEL_WIDTH),
          maxAllowed
        );
        setPanelWidth(newWidth);
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        setIsDragging(false);
        if (!dragStartRef.current.hasDragged) {
          toggleMaximize();
        }
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [
      panelWidth,
      isExpanded,
      toggleMaximize,
      panelRef,
      setIsExpanded,
      setPanelWidth,
      setMaxPanelWidth,
    ]
  );

  const handlePillTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const startX = touch.clientX;
      const currentWidth = panelRef.current?.offsetWidth || panelWidth;
      const maxAllowed = getMaxPanelWidth();
      setMaxPanelWidth(maxAllowed);
      dragStartRef.current = {
        startX,
        startWidth: currentWidth,
        hasDragged: false,
      };
      setIsDragging(true);

      const onTouchMove = (moveEvent) => {
        const moveTouch = moveEvent.touches[0];
        if (!moveTouch) return;
        const delta = dragStartRef.current.startX - moveTouch.clientX;
        if (Math.abs(delta) > 3) {
          dragStartRef.current.hasDragged = true;
          if (isExpanded) {
            setIsExpanded(false);
          }
        }
        const newWidth = Math.min(
          Math.max(dragStartRef.current.startWidth + delta, MIN_PANEL_WIDTH),
          maxAllowed
        );
        setPanelWidth(newWidth);
      };

      const onTouchEnd = () => {
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        setIsDragging(false);
        if (!dragStartRef.current.hasDragged) {
          toggleMaximize();
        }
      };

      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
    },
    [
      panelWidth,
      isExpanded,
      toggleMaximize,
      panelRef,
      setIsExpanded,
      setPanelWidth,
      setMaxPanelWidth,
    ]
  );

  return {
    isDragging,
    handlePillMouseDown,
    handlePillTouchStart,
  };
}

export default usePanelResize;
