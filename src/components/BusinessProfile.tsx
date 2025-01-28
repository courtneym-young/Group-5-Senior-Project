import { useState } from 'react';
import MinorityOwnedBadge from './MinorityOwnedBadge';
import MinorityOwnedTag from './MinorityOwnedTag';

const BusinessProfile = () => {
  const [isMinorityOwned, setIsMinorityOwned] = useState(false);

  return (
    <div>
      <h2>Business Name</h2>
      {isMinorityOwned && <MinorityOwnedBadge />}
      
      {/* You could simulate toggling the status here */}
      <MinorityOwnedTag onChange={() => setIsMinorityOwned(!isMinorityOwned)} />
    </div>
  );
};

export default BusinessProfile;
