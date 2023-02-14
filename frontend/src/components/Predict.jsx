import { useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { useMutation } from "react-query";
import "../App.css";
import { imagesResize } from "../services/imagesResize";
import { patientRegister } from "../services/patientRegister";
import { predict } from "../services/predict";
import { videoCrop } from "../services/videoCrop";
import { videoToImage } from "../services/videoToImage";
import Loader from "./Loader";
const Predict = ({
  file,
  cropDims,
  activeStep,
  setActiveStep,
  data,
  thumbnail,
  patientData,
  setPatientData,
}) => {
  const firstName = data.firstName;
  const lastName = data.lastName;
  const age = data.age;
  const isVideo = data.isVideo;
  const [convertedFile, setConvertedFile] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictStatus, setPredictStatus] = useState(0);

  const { mutate: mutatePatientInfo, statusPatientInfo } = useMutation(
    patientRegister,
    {
      onSuccess: async (data) => {
        setPatientData(data.data);
        const patientId = data.data["id"];

        if (isVideo) {
          await mutateVideoCrop.mutateAsync({ patientId, cropDims });
          setPredictStatus(1);
          await mutateVideoToImage.mutateAsync(patientId);
        }
        setPredictStatus(2);
        await mutateImagesResize.mutateAsync(patientId);
        setPredictStatus(3);
        await mutatePredict.mutateAsync(patientId);
      },
    }
  );

  const mutateVideoCrop = useMutation(videoCrop, {
    onSuccess: (data) => {
      console.log(data.data);
    },
  });

  const mutateImagesResize = useMutation(imagesResize, {
    onSuccess: (data) => {
      console.log(data.data);
    },
  });

  const mutateVideoToImage = useMutation(videoToImage, {
    onSuccess: (data) => {
      console.log(data.data);
    },
  });

  const mutatePredict = useMutation(predict, {
    onSuccess: (data) => {
      console.log(data.data);
    },
  });
  const backButtonHandler = () => {
    setActiveStep(activeStep - 1);
  };
  const nextButtonHandler = (e) => {
    e.preventDefault();
    setPredicting(true);

    // Send file to image to send to backend
    mutatePatientInfo({
      firstName,
      lastName,
      age,
      file,
    });
  };
  return (
    <>
      {!predicting ? (
        <div className="mx-auto flex max-w-4xl items-center justify-center p-4 pb-0">
          <div className="mt-10 sm:mt-0">
            <form>
              <div className="overflow-hidden shadow sm:rounded-md0">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    {/* First Name -------------------------------------------- */}
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        value={firstName}
                        disabled={true}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100`}
                      />
                    </div>
                    {/* First Name End ----------------------------------------- */}

                    {/* Last Name -------------------------------------------- */}
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        value={lastName}
                        disabled={true}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100`}
                      />
                    </div>
                    {/* Last Name End ----------------------------------------- */}

                    {/* Age -------------------------------------------------- */}
                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Age
                      </label>

                      <input
                        type="number"
                        name="region"
                        id="region"
                        autoComplete="address-level1"
                        value={age}
                        disabled={true}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100`}
                      />
                    </div>
                    {/* Age End ----------------------------------------------- */}
                  </div>
                </div>

                <div className="flex justify-center mb-10">
                  {isVideo && (
                    <img
                      className="w-1/4 border-4 border-indigo-600"
                      src={thumbnail}
                    ></img>
                  )}
                  {!isVideo && file != null && (
                    <img
                      className="w-1/4 border-4 border-indigo-600"
                      src={URL.createObjectURL(file)}
                    ></img>
                  )}
                </div>
                {/* Submit button -------------------------------------------- */}
                <div className="flex justify-between bg-gray-50 px-4 py-3 sm:px-6">
                  <button
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={backButtonHandler}
                  >
                    Back
                  </button>
                  <button
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={nextButtonHandler}
                  >
                    Predict
                  </button>
                </div>
                {/* Submit button End ---------------------------------------- */}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Predicting ------------------------------------------------------------ */}
          <div className="mx-auto flex max-w-4xl items-center justify-center p-4 pb-20 ">
            <div className="flex flex-col align-middle justify-center mt-10 sm:mt-0 w-4/5">
              <div className="shadow sm:rounded-md flex flex-col items-center">
                <Loader />
                <div className="pb-40">
                  {predictStatus === 0 && <>Sending data to server</>}
                  {predictStatus === 1 && <>Converting video to images</>}
                  {predictStatus === 2 && isVideo && <>Resizing images</>}
                  {predictStatus === 2 && !isVideo && <>Resizing the image</>}
                  {predictStatus === 3 && <>Predicting</>}
                </div>
              </div>
            </div>
          </div>
          {/* Predicting End --------------------------------------------------------- */}
        </>
      )}
    </>
  );
};

export default Predict;
