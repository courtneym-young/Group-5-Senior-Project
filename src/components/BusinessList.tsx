import { useState } from 'react';
import MinorityOwnedTag from './MinorityOwnedTag';
import MinorityOwnedBadge from './MinorityOwnedBadge';

const initialBusinessList = [
  { id: 1, name: 'Business 1', minorityOwned: true },
  { id: 2, name: 'Business 2', minorityOwned: false },
  { id: 3, name: 'Business 3', minorityOwned: true },
];

const BusinessList = () => {
    const[businessList, setBusinessList] = useState(initialBusinessList);
 

    // Function to toggle the `minorityOwned` status for a specific business
  const handleToggle = (id: number) => {
    setBusinessList(prevList =>
      prevList.map(business =>
        business.id === id
          ? { ...business, minorityOwned: !business.minorityOwned }
          : business
      )
    );
};

return (
    <div>
      {businessList.map(business => (
        <div key={business.id}>
          <h3>{business.name}</h3>
          {business.minorityOwned && <MinorityOwnedBadge />}
          
          {/* Pass `minorityOwned` and `onChange` as props to `MinorityOwnedTag` */}
          <MinorityOwnedTag
            minorityOwned={business.minorityOwned}
            onChange={() => handleToggle(business.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default BusinessList;