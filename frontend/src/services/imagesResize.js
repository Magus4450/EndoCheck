import axiosInstance from "../utils/axiosInstance";

export const imagesResize = async (patientId) => {
  console.log("resizing");
  const formData = new FormData();
  formData.append("patient_id", patientId);
  const response = await axiosInstance.post("/resize-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response);
  return response;
};
