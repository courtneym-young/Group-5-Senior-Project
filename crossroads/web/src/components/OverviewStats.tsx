import React from "react";
import { useTotalBusinessCount, useFlaggedBusinessCount, useVerifiedBusinessCount } from "../helpers/businessHelpers";

const OverviewStats: React.FC = () => {
  const totalBusinesses = useTotalBusinessCount();
  const totalFlaggedBusinesses = useFlaggedBusinessCount();
  const verifiedBusinesses = useVerifiedBusinessCount()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div className="p-4 bg-white rounded-2xl shadow-md flex items-center">
    <div className="p-3 bg-blue-500 text-white rounded-lg">
      📊
    </div>
    <div className="ml-4">
      <p className="text-gray-600 text-sm">Total Businesses</p>
      <p className="text-xl font-semibold">{totalBusinesses}</p>
    </div>
  </div>

  <div className="p-4 bg-white rounded-2xl shadow-md flex items-center">
    <div className="p-3 bg-red-500 text-white rounded-lg">
      🚩
    </div>
    <div className="ml-4">
      <p className="text-gray-600 text-sm">Flagged Businesses</p>
      <p className="text-xl font-semibold">{totalFlaggedBusinesses}</p>
    </div>
  </div>

  <div className="p-4 bg-white rounded-2xl shadow-md flex items-center">
    <div className="p-3 bg-green-500 text-white rounded-lg">
      ✅
    </div>
    <div className="ml-4">
      <p className="text-gray-600 text-sm">Verified Businesses</p>
      <p className="text-xl font-semibold">{verifiedBusinesses}</p>
    </div>
  </div>
</div>
  );
};

export default OverviewStats;
