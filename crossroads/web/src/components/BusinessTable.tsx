import React from "react";
import { useFetchBusinessList } from "../helpers/businessHelpers";

const BusinessTable: React.FC = () => {
  const businesses = useFetchBusinessList();
  console.log(businesses)
  return (
    <div>
      <h2>Business List</h2>
      {businesses.length === 0 ? (
        <p>Loading businesses...</p>
      ) : (
        <ul>
          {businesses.map((business) => (
            <li key={business.businessId}>
              <strong>{business.name}</strong> - {business.category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BusinessTable;
