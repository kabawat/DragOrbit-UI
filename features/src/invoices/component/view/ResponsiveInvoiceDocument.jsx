"use client";

import { useEffect, useRef, useState } from "react";

export function ResponsiveInvoiceDocument({ children, pageWidth = 794, fitHeight = false }) {
  const viewportRef = useRef(null);
  const pageRef = useRef(null);
  const [pageSize, setPageSize] = useState({ scale: 1, height: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const page = pageRef.current;
    if (!viewport || !page) return undefined;

    const updateSize = () => {
      const pageHeight = page.scrollHeight;
      const widthScale = viewport.clientWidth / pageWidth;
      const heightScale = fitHeight && viewport.clientHeight > 0 && pageHeight > 0
        ? viewport.clientHeight / pageHeight
        : 1;
      const scale = Math.min(widthScale, heightScale, 1);
      setPageSize({ scale, height: pageHeight });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    observer.observe(page);
    return () => observer.disconnect();
  }, [pageWidth, fitHeight]);

  const scaledWidth = pageWidth * pageSize.scale;

  return (
    <div ref={viewportRef} className={`invoice-responsive-viewport min-w-0 overflow-x-hidden ${fitHeight ? "flex h-full items-center justify-center overflow-y-hidden" : ""}`}>
      <div
        className="invoice-responsive-frame mx-auto"
        style={{ width: `${scaledWidth}px`, height: `${pageSize.height * pageSize.scale}px` }}
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
        .invoice-responsive-viewport { display: block !important; width: auto !important; height: auto !important; overflow: visible !important; }
        .invoice-responsive-frame { width: auto !important; height: auto !important; margin: 0 !important; }
        .invoice-responsive-page { width: auto !important; transform: none !important; }
      }`}</style>
    </div>
  );
}
