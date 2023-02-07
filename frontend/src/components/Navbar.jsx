import { BeakerIcon, DocumentChartBarIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  return (
    <nav
      aria-label="Site Nav"
      className="mx-auto flex max-w-3xl items-center justify-between p-4 border-b-2 border-gray-400"
    >
      <a
        href="/"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
      >
        <span className="sr-only">Logo</span>
        👋
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
    </nav>
  );
};

export default Navbar;
