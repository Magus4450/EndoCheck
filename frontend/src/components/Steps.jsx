import { IdentificationIcon, MapPinIcon } from "@heroicons/react/24/outline";
const Steps = ({ activeStep }) => {
  // const activeStep = 0;
  console.log(activeStep);
  const activeColorClass = "bg-gray-50";
  const inactiveColorClass = "bg-white";

  // const [diamond1, setDiamond1] = useState(activeColorClass);
  // const [diamond2, setDiamond2] = useState(inactiveColorClass);
  // const [step1, setStep1] = useState(activeColorClass);
  // const [step2, setStep2] = useState(inactiveColorClass);
  // const [step3, setStep3] = useState(inactiveColorClass);

  let diamond1 = activeColorClass;
  let diamond2 = inactiveColorClass;
  let step1 = activeColorClass;
  let step2 = inactiveColorClass;
  let step3 = inactiveColorClass;

  if (activeStep === 0) {
    diamond1 = activeColorClass;
    diamond2 = inactiveColorClass;
    step1 = activeColorClass;
    step2 = inactiveColorClass;
    step3 = inactiveColorClass;
  } else if (activeStep === 1) {
    diamond1 = inactiveColorClass;
    diamond2 = activeColorClass;
    step1 = inactiveColorClass;
    step2 = activeColorClass;
    step3 = inactiveColorClass;
  } else if (activeStep === 2) {
    diamond1 = inactiveColorClass;
    diamond2 = inactiveColorClass;
    step1 = inactiveColorClass;
    step2 = inactiveColorClass;
    step3 = activeColorClass;
  }

  // if (activeStep === 0) {
  //   setDiamond1(activeColorClass);
  //   setDiamond2(inactiveColorClass);
  //   setStep1(activeColorClass);
  //   setStep2(inactiveColorClass);
  //   setStep3(inactiveColorClass);
  // } else if (activeStep === 1) {
  //   setDiamond1(activeColorClass);
  //   setDiamond2(activeColorClass);
  //   setStep1(activeColorClass);
  //   setStep2(activeColorClass);
  //   setStep3(inactiveColorClass);
  // } else if (activeStep === 2) {
  //   setDiamond1(activeColorClass);
  //   setDiamond2(activeColorClass);
  //   setStep1(activeColorClass);
  //   setStep2(activeColorClass);
  //   setStep3(activeColorClass);
  // }
  // const changeStates = () => {
  //   if (activeStep === 0) {
  //     setDiamond1(activeColorClass);
  //     setDiamond2(inactiveColorClass);
  //     setStep1(activeColorClass);
  //     setStep2(inactiveColorClass);
  //     setStep3(inactiveColorClass);
  //   } else if (activeStep === 1) {
  //     setDiamond1(activeColorClass);
  //     setDiamond2(activeColorClass);
  //     setStep1(activeColorClass);
  //     setStep2(activeColorClass);
  //     setStep3(inactiveColorClass);
  //   } else if (activeStep === 2) {
  //     setDiamond1(activeColorClass);
  //     setDiamond2(activeColorClass);
  //     setStep1(activeColorClass);
  //     setStep2(activeColorClass);
  //     setStep3(activeColorClass);
  //   }

  //   changeStates();
  return (
    <div className="mx-auto flex max-w-3xl items-center p-4 justify-center mt-5 ">
      <div>
        <ol className="grid grid-cols-1 divide-x divide-gray-100 overflow-hidden rounded-lg border border-gray-100 text-sm text-gray-500 sm:grid-cols-3">
          <li className={`flex items-center justify-center p-4 ${step1}`}>
            <IdentificationIcon className="mr-2 h-7 w-7 flex-shrink-0" />
            <p className="leading-none">
              <strong className="block font-medium"> Details </strong>
              <small className="mt-1"> About the patient. </small>
            </p>
          </li>

          <li
            className={`relative flex items-center justify-center ${step2} p-4`}
          >
            {/* Diamonds representing arrows ---------------- */}
            <span
              className={`absolute -left-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border border-b-0 border-l-0 border-gray-100 ${diamond1} sm:block`}
            ></span>
            <span
              className={`absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border border-b-0 border-l-0 border-gray-100 ${diamond2} sm:block`}
            ></span>
            {/* Diamonds representing arrows ---------------- */}
            <MapPinIcon className="mr-2 h-7 w-7 flex-shrink-0" />
            <p className="leading-none">
              <strong className="block font-medium"> Media </strong>
              <small className="mt-1"> Any customizations? </small>
            </p>
          </li>

          <li className={`flex items-center justify-center p-4 ${step3}`}>
            <p className="leading-none">
              <strong className="block font-medium"> Payment </strong>
              <small className="mt-1"> Show us the money. </small>
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Steps;
