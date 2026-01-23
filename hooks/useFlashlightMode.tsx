"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FlashlightContextType {
  isFlashlightMode: boolean;
  toggleFlashlightMode: () => void;
}

const FlashlightContext = createContext<FlashlightContextType | undefined>(
  undefined,
);

export function FlashlightProvider({ children }: { children: ReactNode }) {
  const [isFlashlightMode, setIsFlashlightMode] = useState(false);

  const toggleFlashlightMode = () => {
    setIsFlashlightMode((prev) => !prev);
  };

  return (
    <FlashlightContext.Provider
      value={{ isFlashlightMode, toggleFlashlightMode }}
    >
      {children}
    </FlashlightContext.Provider>
  );
}

export function useFlashlightMode() {
  const context = useContext(FlashlightContext);
  if (!context) {
    throw new Error("useFlashlightMode must be used within FlashlightProvider");
  }
  return context;
}
