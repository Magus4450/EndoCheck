import axiosInstance from "../utils/axiosInstance";

export const predict = async (patientId) => {
  const formData = new FormData();
  formData.append("patient_id", patientId);
  const response = await axiosInstance.post("/predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
