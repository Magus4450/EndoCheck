import { useState } from "react";
import CropImage from "../components/CropImage";
import DetailsForm from "../components/DetailsForm";
import Steps from "../components/Steps";
const Home = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [croppedFile, setCroppedFile] = useState(null);
  const detailsReceiveHandler = ({
    firstName,
    lastName,
    age,
    file,
    isVideo,
  }) => {
    setFirstName(firstName);
    setLastName(lastName);
    setAge(age);
    setFile(file);
    setIsVideo(isVideo);
  };

  const cropReceiveHandler = (file) => {
    setCroppedFile(file);
    console.log(file);
  };
  return (
    <>
      <Steps activeStep={activeStep} />
      {activeStep === 0 && (
        <DetailsForm
          onReceiveDetails={detailsReceiveHandler}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          data={{ firstName, lastName, age, file, isVideo }}
        />
      )}
      {activeStep === 1 && (
        <CropImage
          file={file}
          isVideo={isVideo}
          onReceiveCrop={cropReceiveHandler}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      )}
    </>
  );
};

export default Home;
