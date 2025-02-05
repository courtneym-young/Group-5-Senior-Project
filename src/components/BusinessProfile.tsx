import React, { useState } from 'react';

interface BusinessProfileProps {
  initialBusiness: {
    name: string;
    contactInfo: string;
    address: string;
    hours: string;
    minorityOwned: boolean;
  };
}

const BusinessProfile: React.FC<BusinessProfileProps> = ({ initialBusiness }) => {
  // Initialize state with initial values from the `initialBusiness` prop
  const [name, setName] = useState(initialBusiness.name);
  const [contactInfo, setContactInfo] = useState(initialBusiness.contactInfo);
  const [address, setAddress] = useState(initialBusiness.address);
  const [hours, setHours] = useState(initialBusiness.hours);
  const [isMinorityOwned, setIsMinorityOwned] = useState(initialBusiness.minorityOwned);
  
  // State to control editing mode, saving state, and error handling
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle saving the profile (for example, simulating a save with setTimeout)
  const handleSave = () => {
    setIsSaving(true);  // Indicate that we're saving
    setError(null);  // Reset error message

    // Simulate a save operation (e.g., API call)
    setTimeout(() => {
      setIsSaving(false);  // Stop saving
      setIsEditing(false); // Exit edit mode

      // Simulate an error or success
      if (Math.random() < 0.5) {
        setError('Failed to save the business profile.');
      } else {
        // No error, you could also update the `initialBusiness` here if you had an API call
        setError(null);  // Clear any previous errors
      }
    }, 1000);  // Simulate a 1-second delay for the "saving" process
  };

  // Handle form submission (optional)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();  // Trigger the save function when the form is submitted
  };

  return (
    <div className="business-profile">
      <h1>Business Profile</h1>

      {/* Display error if there was an issue with saving */}
      {error && <div className="error">{error}</div>}

      {/* Form to edit business information */}
      <form onSubmit={handleFormSubmit}>
        {/* Business Name */}
        <div>
          <label htmlFor="name">Business Name</label>
          {isEditing ? (
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}  // Update state when value changes
            />
          ) : (
            <p>{name}</p>  // Display name in view mode
          )}
        </div>

        {/* Contact Info */}
        <div>
          <label htmlFor="contactInfo">Contact Info</label>
          {isEditing ? (
            <input
              id="contactInfo"
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}  // Update state
            />
          ) : (
            <p>{contactInfo}</p>  // Display contact info in view mode
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address">Address</label>
          {isEditing ? (
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}  // Update state
            />
          ) : (
            <p>{address}</p>  // Display address in view mode
          )}
        </div>

        {/* Hours of Operation */}
        <div>
          <label htmlFor="hours">Business Hours</label>
          {isEditing ? (
            <input
              id="hours"
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}  // Update state
            />
          ) : (
            <p>{hours}</p>  // Display hours in view mode
          )}
        </div>

        {/* Minority Owned Checkbox */}
        <div>
          <label htmlFor="minorityOwned">Minority Owned</label>
          {isEditing ? (
            <input
              id="minorityOwned"
              type="checkbox"
              checked={isMinorityOwned}
              onChange={() => setIsMinorityOwned(!isMinorityOwned)}  // Toggle checkbox
            />
          ) : (
            <p>{isMinorityOwned ? 'Yes' : 'No'}</p>  // Display checkbox status in view mode
          )}
        </div>

        {/* Edit/Save Button */}
        <div>
          <button type="button" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessProfile;
