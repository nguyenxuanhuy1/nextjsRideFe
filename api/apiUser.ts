import axiosInstance from "./axiosInstance";

export const createTrip = async (body: any) => {
  const res = await axiosInstance.post(`/api/routes/create`, body);
  return res;
};
export const searchTrip = async (body: any) => {
  const res = await axiosInstance.post(`/api/routes/search`, body);
  return res;
};
export const feedBack = async (body: any) => {
  const res = await axiosInstance.post(`/api/feedbacks`, body);
  return res;
};
export const getTripDetail = async (id: number) => {
  const res = await axiosInstance.get(`/api/routes/${id}`);
  return res;
};
