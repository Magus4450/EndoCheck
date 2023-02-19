import { useState } from "react";
import raw from "../assets/4.jpg";
import grad from "../assets/4g.png";
import Image from "../components/Image";
import InfoBar from "../components/InfoBar";
const Output = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState([raw, grad]);

  const handleRightButtonClick = () => {
    const newImages = [
      "https://picsum.photos/id/240/200/300",
      "https://picsum.photos/id/241/200/300",
    ];
    setImages(newImages);
    setActiveIndex(0); // reset the active index to the first square
  };

  return (
    <div className="flex flex-row justify-center items-center w-full mx-auto max-w-3xl mt-20">
      <div className="w-4/6 m-4 mr-5">
        <div className="grid grid-cols-2 gap-1 border shadow">
          {images.map((image, index) => (
            <Image
              key={index}
              image={image}
              isActive={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <div>
          {/* <ArrowLeftCircleIcon /> */}
          {/* <ArrowRightCircleIcon /> */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            onClick={handleRightButtonClick}
          >
            Apple
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            onClick={handleRightButtonClick}
          >
            Change Images
          </button>
        </div>
      </div>

      <div className="w-2/6 shadow p-5 m-4 ml-5 rounded-lg">
        <div className="block text-lg font-medium text-gray-700 text-center">
          Classes
        </div>
        <InfoBar percentages={[78, 10, 4, 4, 4, 4, 4, 4, 4]} />
      </div>
    </div>
  );
};

export default Output;
