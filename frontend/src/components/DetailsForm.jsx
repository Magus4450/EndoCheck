import { useEffect, useRef, useState } from "react";
import InputField from "./InputField";
export default function DetailsForm({
  onReceiveDetails,
  activeStep,
  setActiveStep,
  data,
}) {
  const nameRef = useRef(null);
  const detailRef = useRef(null);
  const ageRef = useRef(null);
  const fileRef = useRef(null);

  const [name, setname] = useState(data.name);
  const [detail, setdetail] = useState(data.detail);
  const [age, setAge] = useState(data.age);
  const [isVideo, setIsVideo] = useState(data.isVideo);

  const [nameError, setnameError] = useState(false);
  const [detailError, setdetailError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [fileError, setFileError] = useState(false);

  const [fileUploaded, setFileUploaded] = useState(data.file ? true : false);
  const [uploadedMedia, setUploadedMedia] = useState(data.file);

  const [mediaWidth, setMediaWidth] = useState(0);
  const [mediaHeight, setMediaHeight] = useState(0);
  useEffect(() => {}, [mediaHeight, mediaWidth]);
  const submitHandler = (e) => {
    e.preventDefault();

    let formValid = true;
    const name = nameRef.current.value;
    const detail = detailRef.current.value;
    const age = ageRef.current.value;

    if (name == "") {
      setnameError(true);
      formValid = false;
    }

    if (detail == "") {
      setdetailError(true);
      formValid = false;
    }
    if (age < 0 || age > 120 || age == "") {
      setAgeError(true);
      formValid = false;
    }

    if (!fileUploaded) {
      setFileError(true);
      formValid = false;
    }
    const details = {
      name: name,
      detail: detail,
      age: age,
      file: uploadedMedia,
      isVideo: isVideo,
      mediaWidth: mediaWidth,
      mediaHeight: mediaHeight,
    };
    if (!formValid) {
      return;
    }
    onReceiveDetails(details);
    setActiveStep(activeStep + 1);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFileError(false);
    const files = event.dataTransfer.files;
    fileHandler(files);
  };

  const handleDrag = (event) => {
    event.preventDefault();
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    setFileError(false);
    const files = event.target.files;
    fileHandler(files);
  };

  const fileHandler = (files) => {
    setFileUploaded(true);
    setUploadedMedia(files[0]);
    if (files[0].type.includes("video")) {
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl items-center justify-center p-4">
      <div className="mt-10 sm:mt-0">
        <form>
          <div className="overflow-hidden shadow sm:rounded-md0">
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <InputField
                  labelName={"Full Name"}
                  type={"text"}
                  value={name}
                  setValue={setname}
                  ref={nameRef}
                  error={nameError}
                  setError={setnameError}
                />
                <InputField
                  labelName={"Age"}
                  type={"number"}
                  value={age}
                  setValue={setAge}
                  ref={ageRef}
                  error={ageError}
                  setError={setAgeError}
                />
                <InputField
                  labelName={"Other Details"}
                  type={"text"}
                  value={detail}
                  setValue={setdetail}
                  ref={detailRef}
                  error={detailError}
                  setError={setdetailError}
                />

                {/* Endoscopic Data -------------------------------------- */}
                <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Endoscopic Data
                  </label>
                  <div
                    className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 ${
                      fileError ? "border-red-500" : ""
                    }`}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {/* If file uploaded */}
                    {!fileUploaded ? (
                      <div className="space-y-1 text-center">
                        {/* Media Logo ------------------------------------ */}
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {/* Media Logo End --------------------------------- */}

                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              // ref={fileInputRef}
                              onChange={handleFileUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>

                        <p className="text-xs text-gray-500">
                          .mp4 .mkv .jpg .png .jpeg
                        </p>
                      </div>
                    ) : (
                      // If file not uploaded

                      <div className="flex flex-col align-center w-40">
                        <div className="flex justify-center">
                          {isVideo ? (
                            <>
                              <video src={URL.createObjectURL(uploadedMedia)} />
                            </>
                          ) : (
                            <img
                              src={URL.createObjectURL(uploadedMedia)}
                              className="w-20 flex justify-center"
                            ></img>
                          )}
                        </div>
                        <div className="flex justify-center items-center mt-3">
                          <span className="text-xs text-gray-500 mr-2">
                            {uploadedMedia.name}
                          </span>
                          <span
                            className=" cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500
                              text-sm"
                            onClick={() => {
                              setFileUploaded(false);
                              setUploadedMedia(null);
                            }}
                          >
                            Remove
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Endoscopic Data End --------------------------------- */}
              </div>
            </div>

            {/* Submit button -------------------------------------------- */}
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={submitHandler}
              >
                Next
              </button>
            </div>
            {/* Submit button End ---------------------------------------- */}
          </div>
        </form>
      </div>
      {isVideo && uploadedMedia && (
        <video
          ref={fileRef}
          src={uploadedMedia ? URL.createObjectURL(uploadedMedia) : ""}
          className="invisible"
          onLoadedMetadata={() => {
            setMediaHeight(fileRef.current.mediaHeight);
            setMediaWidth(fileRef.current.MediaWidth);

            // Change classname to hidden
            fileRef.current.className = "hidden";
          }}
        />
      )}
      {!isVideo && uploadedMedia && (
        <img
          ref={fileRef}
          src={uploadedMedia ? URL.createObjectURL(uploadedMedia) : ""}
          className="invisible"
          onLoad={() => {
            setMediaHeight(fileRef.current.mediaHeight);
            setMediaWidth(fileRef.current.MediaWidth);

            // Change classname to hidden
            fileRef.current.className = "hidden";
          }}
        />
      )}
    </div>
  );
}
