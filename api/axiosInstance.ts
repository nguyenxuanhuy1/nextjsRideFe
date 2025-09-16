// /utils/axiosInstance.ts
import axios from "axios";
import { message, notification } from "antd";
import { authRefreshToken } from "@/api/auth";

// Tạo axios instance với baseURL động (Next.js)
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

// Request Interceptor: gắn token nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Nếu không có response (lỗi mạng)
    if (!error.response) {
      if (typeof window !== "undefined") {
        // notification.error({
        //   message: "Lỗi mạng",
        //   description: "Vui lòng thử lại.",
        //   placement: "topRight",
        // });
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const originalRequest = error.config;

    switch (status) {
      case 400:
        notification.error({
          message: data?.msg || "Lỗi xảy ra, vui lòng thử lại.",
          placement: "topRight",
        });
        break;

      case 401:
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("refreshToken");
          if (
            refreshToken &&
            !originalRequest.url?.includes("/api/user/refresh")
          ) {
            try {
              const res = await authRefreshToken({
                refreshToken: refreshToken,
              });
              localStorage.setItem("accessToken", res.accessToken);
              localStorage.setItem("refreshToken", res.refreshToken);
              // Retry request gốc
              return axiosInstance({
                ...originalRequest,
                headers: {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${res.accessToken}`,
                },
              });
            } catch {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              window.location.href = "/auth/login";
            }
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/auth/login";
          }
        }
        break;

      case 403:
        message.error("Bạn không có quyền truy cập");
        break;

      case 404:
        message.error("Không tìm thấy");
        break;

      case 422:
        message.error("Dữ liệu khong hợp lệ");
        break;

      case 500:
        message.error("server err");
        break;

      default:
        message.error("Có lỗi xảy ra");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
