import { BeakerIcon, DocumentChartBarIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
const Navbar = () => {
  return (
    <nav aria-label="Site Nav" className="p-4 border-b-2 border-gray-400">
      <div className="mx-auto max-w-3xl flex items-center justify-between ">
        <a
          href="/"
          className="inline-flex items-center justify-center text-lg font-medium text-gray-700"
        >
          <span className="sr-only">EndoCheck</span>
          <img src={logo} className="h-10"></img>
        </a>
        <ul className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <NavLink
            to={"/"}
            className={({ isActive }) => {
              return isActive ? "text-gray-900" : "text-gray-500";
            }}
          >
            <li>
              <div
                className="inline-flex items-center rounded-lg px-3 py-2 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all duration-300 ease-in-out"
                href=""
              >
                {" "}
                Predict <BeakerIcon className="w-5 h-5 ml-1" />
              </div>
            </li>
          </NavLink>
          <NavLink to={"results"}>
            <li>
              <div
                className="inline-flex items-center rounded-lg px-3 py-2 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all duration-300 ease-in-out"
                href=""
                target="_blank"
              >
                Results
                <DocumentChartBarIcon className="w-5 h-5 ml-1" />
              </div>
            </li>
          </NavLink>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
