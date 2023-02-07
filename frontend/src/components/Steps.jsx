import { IdentificationIcon, MapPinIcon } from "@heroicons/react/24/outline";

const Steps = () => {
  return (
    <div className="mx-auto flex max-w-3xl items-center p-4 justify-center mt-5 ">
      <div>
        <ol className="grid grid-cols-1 divide-x divide-gray-100 overflow-hidden rounded-lg border border-gray-100 text-sm text-gray-500 sm:grid-cols-3">
          <li className="flex items-center justify-center p-4">
            <IdentificationIcon className="mr-2 h-7 w-7 flex-shrink-0" />
            <p className="leading-none">
              <strong className="block font-medium"> Details </strong>
              <small className="mt-1"> About the patient. </small>
            </p>
          </li>

          <li className="relative flex items-center justify-center bg-gray-50 p-4">
            <span className="absolute -left-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border border-b-0 border-l-0 border-gray-100 bg-white sm:block"></span>

            <span className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border border-b-0 border-l-0 border-gray-100 bg-gray-50 sm:block"></span>

            <MapPinIcon className="mr-2 h-7 w-7 flex-shrink-0" />

            <p className="leading-none">
              <strong className="block font-medium"> Media </strong>
              <small className="mt-1"> Any customizations? </small>
            </p>
          </li>

          <li className="flex items-center justify-center p-4">
            <p className="leading-none">
              <strong className="block font-medium"> Payment </strong>
              <small className="mt-1"> Show us the money. </small>
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Steps;
