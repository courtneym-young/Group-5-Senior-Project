import React from "react";
import {
  useCountTotalBusinesses,
  useCountTotalFlaggedBusinesses,
  useCountTotalVerifiedBusinesses,
  useCountTotalPendingReviewBusinesses
} from "../../helpers/businessHelpers";

const OverviewStats: React.FC = () => {
  const totalBusinesses = useCountTotalBusinesses();
  const totalFlaggedBusinesses = useCountTotalFlaggedBusinesses();
  const verifiedBusinesses = useCountTotalVerifiedBusinesses();
  const totalPendingBusinesses = useCountTotalPendingReviewBusinesses()

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Total Businesses</h2>
        <p className="text-3xl font-bold text-blue-600">{totalBusinesses}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Verified Businesses</h2>
        <p className="text-3xl font-bold text-green-600">
          {verifiedBusinesses}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Pending Businesses</h2>
        <p className="text-3xl font-bold text-yellow-600">
          {totalPendingBusinesses}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Flagged Businesses</h2>
        <p className="text-3xl font-bold text-red-600">
          {totalFlaggedBusinesses}
        </p>
      </div>

      
    </div>
  );
};

export default OverviewStats;
