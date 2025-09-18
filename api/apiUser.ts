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

export const joinTrip = async (id: number, body: any) => {
  const res = await axiosInstance.post(`/api/rides/join/${id}`, {
    note: body,
  });
  return res;
};

export const notification = async () => {
  const res = await axiosInstance.get(`/api/rides/notifications`);
  return res;
};

export const myCreate = async () => {
  const res = await axiosInstance.get(`/api/routes/my-created-rides`);
  return res;
};
export const acceptPassenger = async (participantId: number) => {
  const res = await axiosInstance.post(
    `/api/rides/approve/${participantId}`,
    {}
  );
  return res;
};

export const rejectPassenger = async (participantId: number) => {
  const res = await axiosInstance.post(
    `/api/rides/reject/${participantId}`,
    {}
  );
  return res;
};
