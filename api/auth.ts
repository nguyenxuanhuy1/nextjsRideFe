import axiosInstance from "./axiosInstance";

interface RefreshTokenResponse {
  access_token: string;
  expires_in?: number; // nếu API có trả về thời gian hết hạn
}

export const authLogin = async (body: any) => {
  const res = await axiosInstance.post(`auth/login`, body);
  return res.data;
};

export const authProfile = async () => {
  const res = await axiosInstance.get(`auth/profile`);
  return res.data;
};

export const authRefreshToken = async (body: {
  refresh_token: string;
}): Promise<RefreshTokenResponse> => {
  const res = await axiosInstance.post<RefreshTokenResponse>(
    `auth/refresh-token`,
    body
  );
  return res.data;
};
