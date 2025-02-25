import React from "react";
import { useFetchBusinessList } from "../helpers/businessHelpers";
import { BUSINESS_STATUS_COLOR_MAPPING } from "../config/StyleConfig";

const BusinessTable: React.FC = () => {
  const businesses = useFetchBusinessList();
  console.log(businesses);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      {/* <!-- Card header --> */}
      <div className="items-center justify-between lg:flex">
        <div className="mb-4 lg:mb-0">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Businesses
          </h3>
          <span className="text-base font-normal text-gray-500 dark:text-gray-400">
            This is a list of businesses
          </span>
        </div>
        <div className="items-center sm:flex">
          <div className="flex items-center">
            <button
              id="dropdownDefault"
              data-dropdown-toggle="dropdown"
              className="mb-4 sm:mb-0 mr-4 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              Filter by status
              <svg
                className="w-4 h-4 ml-2"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {/* <!-- Dropdown menu --> */}
            <div
              id="dropdown"
              className="z-10 w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700 hidden"
              style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                transform: "translate(1134px, 3260px)",
              }}
              aria-hidden="true"
              data-popper-placement="bottom"
            >
              <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                Category
              </h6>
              <ul
                className="space-y-2 text-sm"
                aria-labelledby="dropdownDefault"
              >
                <li className="flex items-center">
                  <input
                    id="apple"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />

                  <label
                    htmlFor="apple"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Completed (56)
                  </label>
                </li>

                <li className="flex items-center">
                  <input
                    id="fitbit"
                    type="checkbox"
                    value=""
                    checked={false}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />

                  <label
                    htmlFor="fitbit"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Cancelled (56)
                  </label>
                </li>

                <li className="flex items-center">
                  <input
                    id="dell"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />

                  <label
                    htmlFor="dell"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    In progress (56)
                  </label>
                </li>

                <li className="flex items-center">
                  <input
                    id="asus"
                    type="checkbox"
                    value=""
                    checked={false}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />

                  <label
                    htmlFor="asus"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    In review (97)
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Table --> */}
      <div className="flex flex-col mt-6">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Business Name
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Last Update
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Business ID
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Owner
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {businesses.businesses.map((business, index) => (
                    <tr key={business.businessId} className={index % 1 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""}>
                      <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                        <span className="font-semibold">{business.name}</span>
                      </td>
                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {business.updatedAt}
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                      {business.businessId}
                      </td>
                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <a href={`user/${business.user?.id}`}>
                          {business.user?.firstName || "N/A"} {business.user?.lastName || "N/A"} 
                        </a>
                      
                      </td>
                      <td className="inline-flex items-center p-4 space-x-2 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <span>{business.category}</span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`${
                            BUSINESS_STATUS_COLOR_MAPPING[
                              business.status ?? "UNKNOWN"
                            ]
                          } text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md`}
                        >
                          {business.status ?? "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Card Footer --> */}
      <div className="flex items-center justify-between pt-3 sm:pt-6">
        <div>
          <button
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            type="button"
            data-dropdown-toggle="transactions-dropdown"
          >
            Last 7 days{" "}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {/* <!-- Dropdown menu --> */}
          <div
            className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
            id="transactions-dropdown"
            data-popper-placement="bottom"
          >
            <div className="px-4 py-3" role="none">
              <p
                className="text-sm font-medium text-gray-900 truncate dark:text-white"
                role="none"
              >
                Sep 16, 2021 - Sep 22, 2021
              </p>
            </div>
            <ul className="py-1" role="none">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                >
                  Yesterday
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                >
                  Today
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                >
                  Last 7 days
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                >
                  Last 30 days
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                >
                  Last 90 days
                </a>
              </li>
            </ul>
            <div className="py-1" role="none">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
              >
                Custom...
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTable;
