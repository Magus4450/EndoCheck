import Bar from "./Bar";

const InfoBar = ({ output }) => {
  console.log(output);
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
  const normalNames = [
    "Ampulla of vater",
    "Ileocecal valve",
    "Normal clean mucosa",
    "Pylorus",
    "Reduced mucosal view",
  ];

  const pathologicalNames = [
    "Angiectasia",
    "Blood - fresh",
    "Blood - hematin",
    "Erosion",
    "Erythema",
    "Foreign body",
    "Lymphangiectasia",
    "Polyp",
    "Ulcer",
  ];

  if (output["predicted_class"] == "Pathological") {
    var currentProbas = output["predicted_probas_pathological"];
    var currentClass = pathologicalNames;
  } else {
    var currentProbas = output["predicted_probas_normal"];
    var currentClass = normalNames;
  }
  return (
    <div>
      {/* Map */}

      {currentProbas.map((proba, index) => (
        <Bar
          key={index}
          percent={proba}
          color={colors[index]}
          name={currentClass[index]}
        />
      ))}
    </div>
  );
};

export default InfoBar;
