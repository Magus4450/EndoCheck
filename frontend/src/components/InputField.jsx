import React from "react";

const InputField = React.forwardRef(
  (
    { labelName, value, setError, setValue, error, type, disabled = false },
    ref
  ) => {
    return (
      <div
        // className={`col-span-6 sm:col-span-3 ${
        //   type == "number" ? "lg:col-span-2" : ""
        // }`}
        className={`col-span-6 sm:col-span-3 ${
          type == "number"
            ? "lg:col-span-2"
            : labelName == "Other Details"
            ? "lg:col-span-6 sm:col-span-6"
            : "lg:col-span-4"
        }`}
      >
        <label
          htmlFor="first-name"
          className="block text-sm font-medium text-gray-700"
        >
          {labelName}
        </label>
        {labelName != "Other Details" && (
          <input
            type={type}
            value={value}
            ref={ref}
            disabled={disabled}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-100" : ""}`}
            onKeyDown={(e) => {
              setError(false);
            }}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        )}
        {labelName == "Other Details" && (
          <textarea
            type={type}
            value={value}
            ref={ref}
            disabled={disabled}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-100" : ""}`}
            onKeyDown={(e) => {
              setError(false);
            }}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        )}

        {error && (
          <p className="text-red-500 text-xs italic">
            Please enter {labelName.toLowerCase()}.
          </p>
        )}
      </div>
    );
  }
);

export default InputField;
