"use client";

import { useEffect, useState } from "react";
import { useFlashlightMode } from "@/hooks/useFlashlightMode";

export default function FlashlightEffect() {
  const { isFlashlightMode } = useFlashlightMode();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isFlashlightMode) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isFlashlightMode]);

  if (!isFlashlightMode) return null;

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, transparent 0%, transparent 80px, rgba(0,0,0,0.7) 120px, rgba(0,0,0,0.95) 180px)`,
        }}
      />

      <div
        className="fixed w-[240px] h-[240px] rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,200,0.3) 30%, rgba(255,255,150,0.15) 50%, transparent 80%)",
          boxShadow:
            "0 0 50px rgba(255,255,255,0.5), 0 0 100px rgba(255,255,200,0.4), inset 0 0 30px rgba(255,255,255,0.3)",
        }}
      />

      <div
        className="fixed pointer-events-none z-[10000] text-5xl"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: "translate(-80%, -80%)",
          filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))",
        }}
      >
        {/* 🔦 */}
      </div>

      <style jsx global>{`
        body.flashlight-mode {
          cursor: none !important;
        }
        body.flashlight-mode * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
