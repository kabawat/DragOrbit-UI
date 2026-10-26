"use client";

import { useEffect, useRef, useState } from "react";
import aiAnimationData from "../assets/ai.json";
import { DragAiIcon } from "./DragBizzLogoIcon.jsx";

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
        <div className="absolute inset-0 flex items-center justify-center p-0.5">
          <DragAiIcon className="w-full h-full text-[rgb(var(--color-primary))] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
        </div>
      )}
    </div>
  );
}

export default AiLottieIcon;
