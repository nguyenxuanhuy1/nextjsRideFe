import axiosInstance from "./axiosInstance";

export const createTrip = async (body: any) => {
  const res = await axiosInstance.post(`/api/routes/create`, body);
  return res.data;
};
