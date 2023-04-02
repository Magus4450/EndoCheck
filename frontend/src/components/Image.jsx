import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const Image = ({
  image,
  altImage,
  isActive,
  onClick,
  color,
  isOverlayable,
}) => {
  console.log(image);
  const [overlayClicked, setOverlayClicked] = useState(false);
  return (
    <div
      className={`relative w-full border-2 border-gray-300 ${
        isActive ? color : ""
      }`}
      onClick={onClick}
    >
      {isOverlayable &&
        (overlayClicked ? (
          <EyeIcon className="absolute top-0 right-0 w-8 h-8 m-2 text-gray-300" />
        ) : (
          <EyeSlashIcon className="absolute top-0 right-0 w-8 h-8 m-2 text-gray-300" />
        ))}

      <img
        src={!overlayClicked ? `http://${image}` : `http://${altImage}`}
        alt=""
        className="w-full h-full object-cover cursor-pointer"
        style={{ cursor: isOverlayable ? "pointer" : "default" }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();

          setOverlayClicked(!overlayClicked);
        }}
      />
    </div>
  );
};

export default Image;
