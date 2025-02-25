import React from "react";
import {
  useTotalBusinessCount,
  useFlaggedBusinessCount,
  useVerifiedBusinessCount,
} from "../helpers/businessHelpers";

const OverviewStats: React.FC = () => {
  const totalBusinesses = useTotalBusinessCount();
  const totalFlaggedBusinesses = useFlaggedBusinessCount();
  const verifiedBusinesses = useVerifiedBusinessCount();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Total Businesses</h2>
        <p className="text-3xl font-bold text-blue-600">{totalBusinesses}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Flagged Businesses</h2>
        <p className="text-3xl font-bold text-red-600">
          {totalFlaggedBusinesses}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Verified Businesses</h2>
        <p className="text-3xl font-bold text-green-600">
          {verifiedBusinesses}
        </p>
      </div>
    </div>
  );
};

export default OverviewStats;
