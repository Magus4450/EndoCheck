import axiosInstance from "../utils/axiosInstance";

export const patientRegister = async (data) => {
  console.log("patient");

  const formData = new FormData();

  // CHnage filename to a.jpg
  // file.name = "a.jpg";
  formData.append("file", data.file);
  formData.append("first_name", data.firstName);
  formData.append("last_name", data.lastName);
  formData.append("patients_age", data.age);
  const response = await axiosInstance.post("/patient-info", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response);
  return response;
};
