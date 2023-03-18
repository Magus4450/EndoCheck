import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Image from "./Image";
import InfoBar from "./InfoBar";

const SlideShow = ({ nImg, imgPath, gradPath, overPath, output }) => {
  console.log(nImg, imgPath, gradPath, overPath);
  const [curImg, setCurImg] = useState(0);
  return (
    <div className="flex flex-row justify-center items-center w-full mx-auto max-w-3xl mt-20">
      <div className="flex flex-col items-center mt-10">
        <div className="grid grid-cols-2 gap-1 border shadow">
          {/* <Image
            //   key={index}
            image={`${imgPath.toString()}/${curImg}.png`}
            isActive={true}
            //   onClick={() => setActiveIndex(index)}
          /> */}

          <Image
            //   key={index}
            image={`${gradPath}/${curImg}.png`}
            isActive={true}
            //   onClick={() => setActiveIndex(index)}
          />
        </div>
        <div className="flex mt-5 text-gray-500">
          <ArrowLeftCircleIcon
            className="w-10 h-10 cursor-pointer hover:text-black transition-all duration-300 ease-in-out"
            onClick={() => {
              const img = Math.max(0, curImg - 1);
              setCurImg(img);
              console.log(curImg);
            }}
          />
          <ArrowRightCircleIcon
            className="w-10 h-10 cursor-pointer hover:text-black transition-all duration-300 ease-in-out"
            onClick={() => {
              const img = Math.min(curImg + 1, nImg - 1);
              setCurImg(img);
              console.log(curImg);
            }}
          />
        </div>
      </div>
      <div className="w-2/6 shadow p-5 m-4 ml-5 rounded-lg">
        <div className="block text-lg font-medium text-gray-700 text-center">
          Classes
        </div>
        <InfoBar output={output[curImg]} />
      </div>
    </div>
  );
};

export default SlideShow;
