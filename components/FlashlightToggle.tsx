"use client";

import { useFlashlightMode } from "@/hooks/useFlashlightMode";
import { useEffect, useState } from "react";

export default function FlashlightToggle() {
  const { isFlashlightMode, toggleFlashlightMode } = useFlashlightMode();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Kiểm tra thiết bị mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isFlashlightMode) {
      document.body.classList.add("flashlight-mode");
    } else {
      document.body.classList.remove("flashlight-mode");
    }
  }, [isFlashlightMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        e.preventDefault(); // cố chặn browser
        toggleFlashlightMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFlashlightMode]);
  // Ẩn nút trên mobile
  if (isMobile) return null;

  return (
    <button
      onClick={toggleFlashlightMode}
      className="fixed bottom-6 right-6 z-[10001] bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2"
    >
      <span className="text-2xl">{isFlashlightMode ? "💡" : "🔦"}</span>
      {isFlashlightMode && <span className="text-sm">Ctrl + M để tắt</span>}
    </button>
  );
}
