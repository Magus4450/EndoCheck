import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import raw from "../assets/4.jpg";
import grad from "../assets/4g.png";
import SlideShow from "../components/SlideShow";
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
  // const [loaded, setLoaded] = useState(false);

  if (data) {
    console.log(data);
  }
  const handleRightButtonClick = () => {
    const newImages = [
      "https://picsum.photos/id/240/200/300",
      "https://picsum.photos/id/241/200/300",
    ];
    setImages(newImages);
    setActiveIndex(0); // reset the active index to the first square
  };

  return (
    <>
      {!isLoading && (
        <SlideShow
          nImg={data["preprocessed_file_number"] || 0}
          imgPath={data["preprocessed_file_path"]}
          gradPath={data["grad_images"]}
          overPath={data["overlayed_images"]}
          output={data["output"]}
        />
      )}
    </>
  );
};

export default Output;
