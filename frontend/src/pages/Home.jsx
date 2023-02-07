import DetailsForm from "../components/DetailsForm";
import Steps from "../components/Steps";
const Home = () => {
  const detailsReceiveHandler = ({ firstName, lastName, age }) => {};
  return (
    <>
      <Steps />
      <DetailsForm onReceiveDetails={detailsReceiveHandler} />
    </>
  );
};

export default Home;
