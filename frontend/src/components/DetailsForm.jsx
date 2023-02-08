import { useRef, useState } from "react";

export default function DetailsForm({
  onReceiveDetails,
  activeStep,
  setActiveStep,
}) {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const ageRef = useRef();
  // const fileInputRef = useRef(null);

  const [ageError, setAgeError] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState(null);
  const [isVideo, setIsVideo] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const age = ageRef.current.value;

    if (age < 0 || age > 120) {
      setAgeError(true);
    }
    const details = {
      firstName: firstName,
      lastName: lastName,
      age: age,
      file: uploadedMedia,
    };

    onReceiveDetails(details);
    setActiveStep(activeStep + 1);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    // fileInputRef.current.files = files;
    fileHandler(files);
  };

  const handleDrag = (event) => {
    event.preventDefault();
    console.log("dragging");
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    const files = event.target.files;
    // fileInputRef.current.files = files;
    fileHandler(files);
  };

  const fileHandler = (files) => {
    setFileUploaded(true);
    console.log(files);
    setUploadedMedia(files[0]);
    if (files[0].type.includes("video")) {
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl items-center justify-center p-4 pb-20">
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="">
          <div className="">
            <form>
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
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
                        ref={firstNameRef}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

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
                        ref={lastNameRef}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

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
                        ref={ageRef}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          ageError ? "border-red-500" : ""
                        }`}
                        onKeyDown={(e) => {
                          setAgeError(false);
                        }}
                      />
                      {ageError && (
                        <p className="text-red-500 text-xs italic">
                          Please enter a valid age.
                        </p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Endoscopic Data
                      </label>
                      <div
                        className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {!fileUploaded ? (
                          <div className="space-y-1 text-center">
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
                          <div className="flex flex-col align-center w-40">
                            <div className="flex justify-center">
                              {isVideo ? (
                                <video
                                  // ref={fileInputRef}
                                  src={URL.createObjectURL(uploadedMedia)}
                                />
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
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={submitHandler}
                  >
                    Next
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
