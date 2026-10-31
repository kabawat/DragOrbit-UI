"use client";

import { useLayoutEffect, useEffect, useRef, useState, useCallback } from "react";

export function ResponsiveInvoiceDocument({ children, pageWidth = 794, fitHeight = false }) {
  const viewportRef = useRef(null);
  const pageRef = useRef(null);
  const [pageSize, setPageSize] = useState({ scale: 1, height: 0 });
  const [isMeasured, setIsMeasured] = useState(false);

  const updateSize = useCallback(() => {
    const viewport = viewportRef.current;
    const page = pageRef.current;
    if (!viewport || !page) return;

    const pageHeight = page.scrollHeight || 1123;
    const vWidth = viewport.clientWidth;
    const vHeight = viewport.clientHeight;
    if (vWidth <= 0) return;

    const widthScale = vWidth / pageWidth;
    const heightScale =
      fitHeight && vHeight > 0 && pageHeight > 0
        ? vHeight / pageHeight
        : 1;

    const scale = fitHeight
      ? Math.min(widthScale, heightScale, 1)
      : Math.min(widthScale, 1);

    setPageSize({ scale: Math.max(0.1, scale), height: pageHeight });
    setIsMeasured(true);
  }, [pageWidth, fitHeight]);

  useLayoutEffect(() => {
    updateSize();
  }, [updateSize]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const page = pageRef.current;
    if (!viewport || !page) return undefined;

    updateSize();

    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        updateSize();
      });
      observer.observe(viewport);
      observer.observe(page);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [updateSize]);

  const scaledWidth = pageWidth * pageSize.scale;

  return (
    <div
      ref={viewportRef}
      className={`invoice-responsive-viewport min-w-0 overflow-x-hidden ${
        fitHeight ? "flex h-full items-center justify-center overflow-y-hidden" : ""
      }`}
      style={{
        opacity: isMeasured ? 1 : 0,
        transition: "opacity 0.15s ease-out",
      }}
    >
      <div
        className="invoice-responsive-frame mx-auto"
        style={{
          width: `${scaledWidth}px`,
          height: `${pageSize.height * pageSize.scale}px`,
        }}
      >
        <div
          ref={pageRef}
          className="invoice-responsive-page"
          style={{
            width: `${pageWidth}px`,
            transform: `scale(${pageSize.scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
      <style>{`@media print {
        .invoice-responsive-viewport { display: block !important; width: auto !important; height: auto !important; overflow: visible !important; opacity: 1 !important; }
        .invoice-responsive-frame { width: auto !important; height: auto !important; margin: 0 !important; }
        .invoice-responsive-page { width: auto !important; transform: none !important; }
      }`}</style>
    </div>
  );
}
