import axiosInstance from "../utils/axiosInstance";

export const videoCrop = async (patientId, cropDims) => {
  const formData = new FormData();
  formData.append("patient_id", patientId);
  formData.append("x", cropDims.x);
  formData.append("y", cropDims.y);
  formData.append("w", cropDims.width);
  formData.append("h", cropDims.height);

  const response = await axiosInstance.post("/crop", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response);
  return response;
};
