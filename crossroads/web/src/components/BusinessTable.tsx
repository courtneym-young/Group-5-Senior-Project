import React, { useState, useEffect } from "react";
import { useFetchBusinessList } from "../helpers/businessHelpers";
import { BUSINESS_STATUS_COLOR_MAPPING } from "../config/StyleConfig";
import { formatDate } from "../helpers/timeHelpers";
import {
  BusinessStatusType,
  BusinessStatusTypes,
} from "../types/business-types";
import { APP_ROUTES } from "../config/UrlConfig";

const BusinessTable: React.FC = () => {
  const { businesses: allBusinesses } = useFetchBusinessList();

  // State for filters
  const [statusFilters, setStatusFilters] = useState<BusinessStatusType[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState(allBusinesses);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State for time filter
  const [timeFilter, setTimeFilter] = useState("All time");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Effect to filter businesses when filters change
  useEffect(() => {
    let result = [...allBusinesses];

    // Apply status filters if any are selected
    if (statusFilters.length > 0) {
      result = result.filter((business) =>
        statusFilters.includes(business.status as BusinessStatusType)
      );
    }

    // Apply time filter logic (simplified for example)
    if (timeFilter !== "All time") {
      const now = new Date();
      const cutoffDate = new Date();

      switch (timeFilter) {
        case "Today":
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "Yesterday":
          cutoffDate.setDate(now.getDate() - 1);
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "Last 7 days":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "Last 30 days":
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case "Last 90 days":
          cutoffDate.setDate(now.getDate() - 90);
          break;
        default:
          // No time filtering
          break;
      }

      result = result.filter((business) => {
        const updateDate = new Date(business.updatedAt || "");
        return updateDate >= cutoffDate;
      });
    }

    setFilteredBusinesses(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [allBusinesses, statusFilters, timeFilter]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBusinesses = filteredBusinesses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);

  // Toggle status filter
  const toggleStatusFilter = (status: BusinessStatusType) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter((s) => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  // Get count of businesses by status
  const getStatusCount = (status: BusinessStatusType) => {
    return allBusinesses.filter((business) => business.status === status)
      .length;
  };

  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Toggle dropdowns
  const toggleTimeDropdown = () => {
    setIsTimeDropdownOpen(!isTimeDropdownOpen);
    if (isFilterDropdownOpen) setIsFilterDropdownOpen(false);
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
    if (isTimeDropdownOpen) setIsTimeDropdownOpen(false);
  };

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
          <div className="flex items-center relative">
            <button
              onClick={toggleFilterDropdown}
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {/* <!-- Status filter dropdown menu --> */}
            {isFilterDropdownOpen && (
              <div className="z-10 w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700 absolute top-full left-0 mt-2">
                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </h6>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <input
                      id="status-pending"
                      type="checkbox"
                      checked={statusFilters.includes(
                        BusinessStatusTypes.PENDING
                      )}
                      onChange={() =>
                        toggleStatusFilter(BusinessStatusTypes.PENDING)
                      }
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="status-pending"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Pending Review (
                      {getStatusCount(BusinessStatusTypes.PENDING)})
                    </label>
                  </li>
                  <li className="flex items-center">
                    <input
                      id="status-flagged"
                      type="checkbox"
                      checked={statusFilters.includes(
                        BusinessStatusTypes.FLAGGED
                      )}
                      onChange={() =>
                        toggleStatusFilter(BusinessStatusTypes.FLAGGED)
                      }
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="status-flagged"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Flagged ({getStatusCount(BusinessStatusTypes.FLAGGED)})
                    </label>
                  </li>
                  <li className="flex items-center">
                    <input
                      id="status-verified"
                      type="checkbox"
                      checked={statusFilters.includes(
                        BusinessStatusTypes.VERIFIED
                      )}
                      onChange={() =>
                        toggleStatusFilter(BusinessStatusTypes.VERIFIED)
                      }
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="status-verified"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Verified ({getStatusCount(BusinessStatusTypes.VERIFIED)})
                    </label>
                  </li>
                </ul>
              </div>
            )}
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
                  {currentBusinesses.map((business, index) => (
                    <tr
                      key={business.businessId}
                      className={
                        index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""
                      }
                    >
                      <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                        <a
                          href={business.website ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="font-semibold">{business.name}</span>
                        </a>
                      </td>
                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {formatDate(business.updatedAt ?? "")}
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                        <a href={`${APP_ROUTES.BUSINESSES}/${business.businessId}`}>{business.businessId}</a>
                      </td>
                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <a href={`${APP_ROUTES.USERS}/${business.user?.id}`}>
                          {business.user?.firstName || "N/A"}{" "}
                          {business.user?.lastName || "N/A"}
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

      {/* <!-- Pagination --> */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            }`}
          >
            Previous
          </button>
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show 5 page numbers centered around current page
              let pageNum = currentPage;
              if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
          </div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            }`}
          >
            Next
          </button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, filteredBusinesses.length)} of{" "}
          {filteredBusinesses.length}
        </div>
      </div>

      {/* <!-- Card Footer --> */}
      <div className="flex items-center justify-between pt-3 sm:pt-6">
        <div className="relative">
          <button
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            type="button"
            onClick={toggleTimeDropdown}
          >
            {timeFilter}{" "}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {/* <!-- Time filter dropdown menu --> */}
          {isTimeDropdownOpen && (
            <div className="z-50 absolute left-0 bottom-full mb-2 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3" role="none">
                <p
                  className="text-sm font-medium text-gray-900 truncate dark:text-white"
                  role="none"
                >
                  Select time range
                </p>
              </div>
              <ul className="py-1" role="none">
                <li>
                  <button
                    onClick={() => {
                      setTimeFilter("Today");
                      setIsTimeDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Today
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setTimeFilter("Yesterday");
                      setIsTimeDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Yesterday
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setTimeFilter("Last 7 days");
                      setIsTimeDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 7 days
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setTimeFilter("Last 30 days");
                      setIsTimeDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 30 days
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setTimeFilter("Last 90 days");
                      setIsTimeDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 90 days
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setTimeFilter("All time");
                      setIsTimeDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    All time
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Items per page:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
            className="text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BusinessTable;
