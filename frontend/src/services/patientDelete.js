import axiosInstance from "../utils/axiosInstance";

export const patientDelete = async (patientId) => {
  const response = await axiosInstance.delete(`/patient-destroy/${patientId}`);

  return response.data;
};
