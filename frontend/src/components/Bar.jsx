const Bar = ({ percent, name, color }) => {
  return (
    <div className="mb-5 first:mt-5 text-gray-500">
      <div className="text-sm ">{name}</div>
      <div className="flex items-center">
        <div className="w-full h-4 bg-gray-200 rounded-sm dark:bg-gray-700 ">
          <div
            className={`h-4 ${color} rounded-sm dark:bg-blue-500 `}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <div className="ml-1 text-sm font-medium">{percent}%</div>
      </div>
    </div>
  );
};

export default Bar;
