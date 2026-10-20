"use client";

import { useEffect, useRef, useState } from "react";
import aiAnimationData from "./ai.json";

export function AiLottieIcon({
  className = "w-6 h-6",
  size = 26,
  loop = true,
  autoplay = true,
}) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const playLottie = (lottieInstance) => {
      if (isCancelled || !containerRef.current || !lottieInstance) return;
      if (animRef.current) {
        try {
          animRef.current.destroy();
        } catch {}
        animRef.current = null;
      }
      try {
        const anim = lottieInstance.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop,
          autoplay,
          animationData: aiAnimationData,
        });
        animRef.current = anim;
        if (anim && typeof anim.addEventListener === "function") {
          anim.addEventListener("DOMLoaded", () => {
            if (!isCancelled) setIsLoaded(true);
          });
        } else {
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn("Lottie playback error:", err);
      }
    };

    if (typeof window !== "undefined") {
      if (window.lottie) {
        playLottie(window.lottie);
      } else {
        const scriptId = "lottie-web-script";
        let script = document.getElementById(scriptId);
        if (!script) {
          script = document.createElement("script");
          script.id = scriptId;
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
          script.async = true;
          document.head.appendChild(script);
        }

        const handleLoad = () => {
          if (!isCancelled && window.lottie) {
            playLottie(window.lottie);
          }
        };

        if (window.lottie) {
          handleLoad();
        } else {
          script.addEventListener("load", handleLoad);
        }

        return () => {
          isCancelled = true;
          if (script) script.removeEventListener("load", handleLoad);
          if (animRef.current) {
            try {
              animRef.current.destroy();
            } catch {}
            animRef.current = null;
          }
        };
      }
    }

    return () => {
      isCancelled = true;
      if (animRef.current) {
        try {
          animRef.current.destroy();
        } catch {}
        animRef.current = null;
      }
    };
  }, [loop, autoplay]);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
            fill="none"
            role="img"
            aria-label="AI Assistant"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>AI Assistant</title>
            {/* Outer glowing head */}
            <rect
              x="14"
              y="20"
              width="72"
              height="58"
              rx="18"
              fill="url(#headGradient-shared)"
              stroke="#54E0EE"
              strokeWidth="2.5"
            />
            {/* Inner dark screen face */}
            <rect x="24" y="30" width="52" height="38" rx="12" fill="#0F172A" />
            {/* Cyan glowing eyes */}
            <ellipse cx="40" cy="48" rx="5.5" ry="6.5" fill="#54E0EE" />
            <ellipse cx="60" cy="48" rx="5.5" ry="6.5" fill="#54E0EE" />
            {/* Cute robot smile */}
            <path
              d="M44 57C47 60 53 60 56 57"
              stroke="#54E0EE"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Side ear sensors */}
            <rect x="7" y="38" width="6" height="22" rx="3" fill="#54E0EE" />
            <rect x="87" y="38" width="6" height="22" rx="3" fill="#54E0EE" />
            <defs>
              <linearGradient
                id="headGradient-shared"
                x1="14"
                y1="20"
                x2="86"
                y2="78"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F8FAFC" />
                <stop offset="0.6" stopColor="#E2E8F0" />
                <stop offset="1" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
}

export default AiLottieIcon;
