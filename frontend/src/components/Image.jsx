const Image = ({ image, isActive, onClick, color }) => {
  console.log(image);
  return (
    <div
      className={`w-full border-2 border-gray-300 ${isActive ? color : ""}`}
      onClick={onClick}
    >
      <img
        src={`http://${image}`}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Image;
