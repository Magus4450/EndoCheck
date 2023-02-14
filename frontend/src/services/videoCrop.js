import axiosInstance from "../utils/axiosInstance";

export const videoCrop = async (data) => {
  const formData = new FormData();
  formData.append("patient_id", data.patientId);
  formData.append("x", data.cropDims.x);
  formData.append("y", data.cropDims.y);
  formData.append("w", data.cropDims.width);
  formData.append("h", data.cropDims.height);

  const response = await axiosInstance.post("/crop", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response);
  return response;
};
