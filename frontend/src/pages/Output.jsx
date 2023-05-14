import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@material-tailwind/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import raw from "../assets/4.jpg";
import grad from "../assets/4g.png";
import SlideShow from "../components/SlideShow";
import Spinner from "../components/Spinner";
import { patientOutput } from "../services/patientOutput";
const Output = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState([raw, grad]);
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery(
    ["patientOutput", id],
    () => patientOutput(id),
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <Spinner />;
  } else {
    console.log(data);
  }

  return (
    <>
      {!isLoading && (
        <>
          <div className="flex flex-row justify-center items-center w-full mx-auto max-w-3xl mt-10">
            <div className="flex flex-col items-center mt-5">
              {/* <h1 className="text-3xl font-bold text-gray-800">
                {data["name"]}
              </h1> */}
              <div className="flex">
                <div className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <span className="text-gray-900 font-semibold mr-1">
                    Name:
                  </span>
                  {data.name}
                </div>
                <div className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <span className="text-gray-900 font-semibold mr-1">Age:</span>
                  {data.patients_age}
                </div>
                <div className="flex whitespace-nowrap px-4 py-2 text-gray-700">
                  <Tooltip content={data.detail} placement="bottom">
                    <ClipboardDocumentIcon className="w-7 h-7" />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <SlideShow
            nImg={data["preprocessed_file_number"] || 0}
            imgPath={data["preprocessed_file_path"]}
            gradPath={data["grad_images"]}
            overPath={data["overlayed_images"]}
            output={data["output"]}
          />
        </>
      )}
    </>
  );
};

export default Output;
