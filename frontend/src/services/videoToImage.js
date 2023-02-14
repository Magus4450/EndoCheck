import axiosInstance from "../utils/axiosInstance";

export const videoToImage = async (patientId) => {
  const formData = new FormData();
  formData.append("patient_id", patientId);
  const response = await axiosInstance.post("/video-to-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
