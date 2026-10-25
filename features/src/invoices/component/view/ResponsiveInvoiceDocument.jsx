"use client";

import { useEffect, useRef, useState } from "react";

export function ResponsiveInvoiceDocument({ children, pageWidth = 794 }) {
  const viewportRef = useRef(null);
  const pageRef = useRef(null);
  const [pageSize, setPageSize] = useState({ scale: 1, height: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const page = pageRef.current;
    if (!viewport || !page) return undefined;

    const updateSize = () => {
      const scale = Math.min(viewport.clientWidth / pageWidth, 1);
      setPageSize({ scale, height: page.scrollHeight });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    observer.observe(page);
    return () => observer.disconnect();
  }, [pageWidth]);

  const scaledWidth = pageWidth * pageSize.scale;

  return (
    <div ref={viewportRef} className="invoice-responsive-viewport min-w-0 overflow-x-hidden">
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
        .invoice-responsive-viewport { width: auto !important; overflow: visible !important; }
        .invoice-responsive-frame { width: auto !important; height: auto !important; margin: 0 !important; }
        .invoice-responsive-page { width: auto !important; transform: none !important; }
      }`}</style>
    </div>
  );
}
