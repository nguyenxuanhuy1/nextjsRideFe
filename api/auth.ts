import axiosInstance from "./axiosInstance";

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const getUserInfor = async () => {
  const res = await axiosInstance.get(`/api/user/info`);
  return res;
};

export const authRefreshToken = async (body: {
  refreshToken: string;
}): Promise<RefreshTokenResponse> => {
  const res = await axiosInstance.post<RefreshTokenResponse>(
    `/api/user/refresh`,
    body
  );
  return res.data;
};
