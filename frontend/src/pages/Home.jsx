import { useState } from "react";
import DetailsForm from "../components/DetailsForm";
import Steps from "../components/Steps";
const Home = () => {
  const [activeStep, setActiveStep] = useState(0);

  const detailsReceiveHandler = ({ firstName, lastName, age, file }) => {
    console.log(file);
  };
  return (
    <>
      <Steps activeStep={activeStep} />
      <DetailsForm
        onReceiveDetails={detailsReceiveHandler}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
    </>
  );
};

export default Home;
