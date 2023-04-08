import { PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Confirmation from "../components/Confirmation.jsx";
import Spinner from "../components/Spinner.jsx";
import { patientList } from "../services/patientList.js";
const Results = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmation(!showConfirmation);
    console.log(showConfirmation);
  };
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery(
    ["patientList"],
    () => patientList(),
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
          <div className="mx-auto flex items-center justify-center p-5 w-2/3">
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Age
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Entry Date
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Media
                  </th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data.map((patient) => (
                  <tr key={patient.id}>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {patient.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {patient.patients_age}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {patient.date.slice(0, 19).replace("T", " ")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {patient.file_type === "video" ? (
                        <VideoCameraIcon className="w-7 h-7" />
                      ) : (
                        <PhotoIcon className="w-7 h-7" />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <a
                        href={`/output/${patient.id}`}
                        className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 mr-1"
                      >
                        View
                      </a>
                      <a
                        href="#"
                        className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 ml-1"
                        onClick={() => handleDeleteClick(patient.id)}
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showConfirmation && (
        <Confirmation
          id={deleteId}
          setShowConfirmation={setShowConfirmation}
          setDeleteId={setDeleteId}
        />
      )}
    </>
  );
};

export default Results;
