import { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useMutation } from "react-query";
import "../App.css";
import { videoCrop } from "../services/videoCrop";
const CropImage = ({
  file,
  isVideo,
  onReceiveCrop,
  activeStep,
  setActiveStep,
  setThumbnail,
}) => {
  const [firstFrame, setFirstFrame] = useState(null);
  const [src, setSrc] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [crop, setCrop] = useState({
    unit: "px",
    width: 100,
    aspect: 1 / 1,
  });
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const [cropDims, setCropDims] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [croppedVideo, setCroppedVideo] = useState(null);
  const { mutate, status } = useMutation(videoCrop, {
    onSuccess: (data) => {
      setCroppedVideo(data.data);
    },
  });
  const [currWidth, setCurrWidth] = useState(0);
  const [currHeight, setCurrHeight] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);

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
            canvas.width = video.videoWidth; //Actual width of the video
            canvas.height = video.videoHeight;
            setVideoHeight(video.videoHeight);
            setVideoWidth(video.videoWidth);
            console.log(canvas.width, canvas.height);
            console.log(crop);
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            setFirstFrame(canvas.toDataURL());
            setThumbnail(canvas.toDataURL());
          };
        };
      };
    };

    getFirstFrame(file);
  }, [file]);

  useEffect(() => {
    if (isVideo) {
      setSrc(firstFrame);
    } else {
      setSrc(URL.createObjectURL(file));
    }
  }, [file, firstFrame, isVideo]);

  // If you setState the crop in here you should return false.
  const onImageLoaded = (img) => {
    // Get current image size
    setCurrWidth(img.width);
    setCurrHeight(img.height);
    setImage(img);
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

  const backButtonHandler = (e) => {
    e.preventDefault();
    setActiveStep(activeStep - 1);
  };

  // useEffect(() => {
  //   if (status == "success") {
  // onReceiveCrop(croppedVideo);
  // setActiveStep(activeStep + 1);
  //   }
  // }, [croppedVideo]);

  const getCroppedImg = () => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / currWidth;
      const scaleY = image.naturalHeight / currHeight;
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
      const ctx = canvas.getContext("2d");
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = "croppedImage.jpeg";
        console.log(blob);
        setCroppedImage(blob);
        onReceiveCrop(blob);
      }, "image/jpeg");
    };
  };
  const nextButtonHandler = async (e) => {
    e.preventDefault();

    if (isVideo) {
      console.log(currHeight, currWidth);
      const scaleX = videoWidth / currWidth;
      const scaleY = videoHeight / currHeight;
      const cropInfo = {
        x: cropDims.x * scaleX,
        y: cropDims.y * scaleY,
        width: cropDims.width * scaleX,
        height: cropDims.height * scaleY,
      };
      onReceiveCrop(file, cropInfo);
    } else {
      getCroppedImg();

      console.log(croppedImage);
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
                    // onComplete={onCropComplete}
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
