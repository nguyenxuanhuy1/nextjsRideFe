"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { getUserInfor } from "@/api/apiUser";

export default function XacThucPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfor();

        if (res.status !== 200) {
          throw new Error("Lỗi khi lấy thông tin user");
        }
        const data = res.data;
        localStorage.setItem("userInfo", JSON.stringify(data));
        router.replace("/");
      } catch (err) {
        console.error(err);
      }
    };

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      window.dispatchEvent(new Event("userLogin"));
      fetchUserInfo();
    } else {
      console.error("Không nhận được token từ backend");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loading />
    </div>
  );
}
