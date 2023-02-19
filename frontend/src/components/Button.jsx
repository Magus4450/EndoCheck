const Button = ({ name, onClick }) => {
  return (
    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
      <button
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={onClick}
      >
        {name}
      </button>
    </div>
  );
};

export default Button;
