import { createFFmpeg } from "@ffmpeg/ffmpeg";
import { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../App.css";

const ffmpeg = createFFmpeg({
  log: true,
});

const CropImage = ({
  file,
  isVideo,
  onReceiveCrop,
  activeStep,
  setActiveStep,
}) => {
  const [ready, setReady] = useState(false);
  const [croppedVideo, setCroppedVideo] = useState(null);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const cropVideo = async () => {
    // Write file to memory
    ffmpeg.FS("writeFile", "inp.mp4", await fetchFile(file));

    // Run the FFMpeg command
    await ffmpeg.run(
      "-i",
      "inp.mp4",
      "-filter:v",
      `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`,
      "out.mp4"
    );

    // Read the Result
    const data = ffmpeg.FS("readFile", "out.mp4");

    const video = new Blob([data.buffer], { type: "video/mp4" });
    // Create a URL
    const url = URL.createObjectURL(video);

    setCroppedVideo(video);
  };
  const [firstFrame, setFirstFrame] = useState(null);

  useEffect(() => {
    const getFirstFrame = (file) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        const videoBlob = new Blob([reader.result], { type: file.type });
        const videoUrl = URL.createObjectURL(videoBlob);
        const video = document.createElement("video");
        video.src = videoUrl;
        video.onloadedmetadata = () => {
          video.currentTime = 10;
          video.onseeked = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            setFirstFrame(canvas.toDataURL());
          };
        };
      };
    };

    getFirstFrame(file);
  }, [file]);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (isVideo) {
      setSrc(firstFrame);
    } else {
      setSrc(URL.createObjectURL(file));
    }
  }, [file, firstFrame, isVideo]);

  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 30,
    aspect: 1 / 1,
  });
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  // For video crop
  const [cropDims, setCropDims] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // If you setState the crop in here you should return false.
  const onImageLoaded = (img) => {
    setImage(img);
  };

  const onCropComplete = (crop) => {
    if (!isVideo) {
      makeClientCrop(crop);
    }
  };

  const onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // setState({ crop: percentCrop });
    const cropInfo = {
      x: crop.x,
      y: crop.y,
      width: crop.width,
      height: crop.height,
    };
    setCropDims(cropInfo);
    setCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (image && crop.width && crop.height) {
      const cropImgUrl = await getCroppedImg(image, crop, "newFile.jpeg");
      setCroppedImageUrl(cropImgUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        setCroppedImage(blob);
        window.URL.revokeObjectURL(fileUrl);
        setFileUrl(window.URL.createObjectURL(blob));
        resolve(fileUrl);
      }, "image/jpeg");
    });
  };

  const backButtonHandler = (e) => {
    e.preventDefault();
    setActiveStep(activeStep - 1);
  };

  const nextButtonHandler = (e) => {
    e.preventDefault();

    if (isVideo) {
      cropVideo();
      console.log(video);
    } else {
      onReceiveCrop(croppedImage);
    }
    setActiveStep(activeStep + 1);
  };
  return (
    <>
      <div className="mx-auto flex max-w-4xl items-center justify-center p-4 pb-20 ">
        <div className="flex flex-col align-middle justify-center mt-10 sm:mt-0 w-4/5">
          <div className="overflow-hidden shadow sm:rounded-md">
            <div className="text-center text-sm font-medium text-gray-700 pl-10 pr-10">
              Crop the image to include only the endoscopic part
            </div>
            <div className="flex justify-evenly">
              {src && (
                <div className="m-10 flex justify-center">
                  <ReactCrop
                    src={src}
                    crop={crop}
                    ruleOfThirds
                    onImageLoaded={onImageLoaded}
                    onComplete={onCropComplete}
                    onChange={onCropChange}
                  />
                </div>
              )}
            </div>
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
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CropImage;
