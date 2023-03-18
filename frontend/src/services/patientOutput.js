import axiosInstance from "../utils/axiosInstance";

export const patientOutput = async (patientId) => {
  const response = await axiosInstance.get(`/patient-info/${patientId}`);
  console.log(response.data);
  return response.data;
};
