import { useState } from "react";
import CropImage from "../components/CropImage";
import DetailsForm from "../components/DetailsForm";
import Predict from "../components/Predict";
import Steps from "../components/Steps";
const Home = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [name, setname] = useState("");
  const [detail, setdetail] = useState("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [mediaWidth, setMediaWidth] = useState(0);
  const [mediaHeight, setMediaHeight] = useState(0);
  const [croppedFile, setCroppedFile] = useState(null);
  const [cropDims, setCropDims] = useState({});

  const [patientData, setPatientData] = useState({});

  const detailsReceiveHandler = ({ name, detail, age, file, isVideo }) => {
    setname(name);
    setdetail(detail);
    setAge(age);
    setFile(file);
    setIsVideo(isVideo);
  };

  const cropReceiveHandler = (file, cropDims) => {
    if (isVideo) {
      setCropDims(cropDims);
    }
    setCroppedFile(file);
  };
  return (
    <div className="flex flex-col justify-center mt-10">
      <div>
        <Steps activeStep={activeStep} />
        {activeStep === 0 && (
          <DetailsForm
            onReceiveDetails={detailsReceiveHandler}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            data={{ name, detail, age, file, isVideo }}
          />
        )}
        {activeStep === 1 && (
          <CropImage
            file={file}
            isVideo={isVideo}
            onReceiveCrop={cropReceiveHandler}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setThumbnail={setThumbnail}
          />
        )}
        {activeStep === 2 && (
          <Predict
            file={croppedFile}
            cropDims={cropDims}
            thumbnail={thumbnail}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            data={{ name, detail, age, isVideo }}
            patientData={patientData}
            setPatientData={setPatientData}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
