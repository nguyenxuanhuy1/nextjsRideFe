import axiosInstance from "./axiosInstance";

export const createTrip = async (body: any) => {
  const res = await axiosInstance.post(`/api/routes/create`, body);
  return res;
};
export const searchTrip = async (body: any) => {
  const res = await axiosInstance.post(`/api/routes/search`, body);
  console.log("body", body);

  return res;
};
