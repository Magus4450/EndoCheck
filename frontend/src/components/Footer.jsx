const Footer = () => {
  return (
    <footer
      aria-label="Site Footer"
      className="bg-gray-50 w-full fixed bottom-0"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
        <div className="flex align-middle sm:items-center sm:justify-between w-full ">
          <div className="flex justify-center gray-500 sm:justify-start text-sm ">
            <strong>EndoCheck</strong>
          </div>

          <p className="text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
            Copyright &copy; 2023. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
