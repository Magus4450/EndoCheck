import Bar from "./Bar";
const InfoBar = ({ percentages }) => {
  const colors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-pink-500",
    "bg-gray-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];
  return (
    <div>
      {/* Create n amount of Bar */}
      {percentages.map((percent, index) => (
        <Bar key={index} percent={percent} color={colors[index]} />
      ))}
    </div>
  );
};

export default InfoBar;
