"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function XacThucPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.dispatchEvent(new Event("userLogin"));
      router.replace("/"); 
    } else {
      console.error("Không nhận được token từ backend");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Đang xác thực...</p>
    </div>
  );
}
