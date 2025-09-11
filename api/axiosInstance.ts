// /utils/axiosInstance.ts
import axios from "axios";
import { notification } from "antd";
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
        notification.error({
          message: "Lỗi mạng",
          description: "Vui lòng thử lại.",
          placement: "topRight",
        });
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
            !originalRequest.url?.includes("/auth/refresh-token")
          ) {
            try {
              const res = await authRefreshToken({
                refresh_token: refreshToken,
              });
              localStorage.setItem("accessToken", res.access_token);
              // Retry request gốc
              return axiosInstance({
                ...originalRequest,
                headers: { ...originalRequest.headers },
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
        notification.error({
          message: "Bạn không có quyền truy cập.",
          placement: "topRight",
        });
        break;

      case 404:
        notification.error({
          message: "Không tìm thấy tài nguyên.",
          placement: "topRight",
        });
        break;

      case 422:
        notification.error({
          message: data?.message || "Dữ liệu không hợp lệ.",
          placement: "topRight",
        });
        break;

      case 500:
        notification.error({
          message: "Lỗi server. Vui lòng thử lại sau.",
          placement: "topRight",
        });
        break;

      default:
        notification.error({
          message: "Đã có lỗi xảy ra.",
          placement: "topRight",
        });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
