import { useState } from 'react';
import MinorityOwnedBadge from './MinorityOwnedBadge';
import MinorityOwnedTag from './MinorityOwnedTag';

interface BusinessProfileProps {
  // Pass in the business data from the parent component
  initialBusiness: {
    name: string;
    contactInfo: string;
    address: string;
    hours: string;
    minorityOwned: boolean;
  };
}

const BusinessProfile: React.FC<BusinessProfileProps> = ({ initialBusiness }) => {
  // State for editable business information
  const [name, setName] = useState(initialBusiness.name);
  const [contactInfo, setContactInfo] = useState(initialBusiness.contactInfo);
  const [address, setAddress] = useState(initialBusiness.address);
  const [hours, setHours] = useState(initialBusiness.hours);
  const [isMinorityOwned, setIsMinorityOwned] = useState(initialBusiness.minorityOwned);

  // Handle the minority-owned toggle
  const handleMinorityOwnedToggle = () => {
    setIsMinorityOwned(prev => !prev);
  };

  // Handle saving updated business information with an API call
  const handleSaveChanges = async () => {
    try {
      const response = await fetch('/api/update-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contactInfo,
          address,
          hours,
          isMinorityOwned,
        }),
      });
      const data = await response.json();
      console.log('Business details saved:', data);
    } catch (error) {
      console.error('Error saving business details:', error);
    }
  };

  return (
    <div>
      <h2>Business Profile</h2>

      {/* Display Minority-Owned Badge if toggled */}
      {isMinorityOwned && <MinorityOwnedBadge />}

      {/* Editable Business Information */}
      <div>
        <label>
          Business Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Contact Info:
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Hours:
          <input
            type="text"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </label>
      </div>

      {/* Minority-Owned Toggle */}
      <MinorityOwnedTag
        minorityOwned={isMinorityOwned}
        onChange={handleMinorityOwnedToggle}
      />

      {/* Save Button */}
      <button onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default BusinessProfile;
