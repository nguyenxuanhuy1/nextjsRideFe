import axios from "axios";
import { notification } from "antd";
import { authRefreshToken } from "@/api/auth";
import { ENV } from "./urlApi";

const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
});

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      if (typeof window !== "undefined") {
        console.log("Vui lòng thử lại.");
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
              localStorage.clear();
              window.location.href = "/";
            }
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/";
          }
        }
        break;

      case 403:
        console.log("Bạn không có quyền truy cập");
        break;

      case 404:
        console.log("Không tìm thấy");
        break;

      case 422:
        console.log("Dữ liệu khong hợp lệ");
        break;

      case 500:
        console.log("server err");
        break;

      default:
        console.log("Có lỗi xảy ra");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
