import { notification } from "antd";
import { ReactNode } from "react";

export const useNotify = () => {
  const [api, contextHolder] = notification.useNotification();

  const notifyError = (message: string, description?: ReactNode) => {
    api.error({ message, description, placement: "topRight" });
  };

  const notifySuccess = (message: string, description?: ReactNode) => {
    api.success({ message, description, placement: "topRight" });
  };

  const notifyInfo = (message: string, description?: ReactNode) => {
    api.info({ message, description, placement: "topRight" });
  };

  return { notifyError, notifySuccess, notifyInfo, contextHolder };
};
