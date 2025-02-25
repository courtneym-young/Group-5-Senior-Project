import React from "react";
import { useFetchBusinessList } from "../helpers/businessHelpers";

const BusinessTable: React.FC = () => {
  const businesses = useFetchBusinessList();

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Business List</h2>

      {businesses.length === 0 ? (
        <p className="text-gray-500">Loading businesses...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">Business Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr key={business.businessId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{business.name}</td>
                  <td className="px-4 py-2">{business.category}</td>
                  <td className="px-4 py-2">{business.address || "N/A"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                        business.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {business.status ? "Verified" : "Unverified"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BusinessTable;
