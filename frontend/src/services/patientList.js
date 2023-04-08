import axiosInstance from "../utils/axiosInstance";

export const patientList = async () => {
  const response = await axiosInstance.get(`/patient-list`);

  return response.data;
};
