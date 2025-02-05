import React, { useState } from 'react';

interface Business {
  name: string;
  contactInfo: string;
  address: string;
  hours: string;
  minorityOwned: boolean;
}

interface SearchProps {
  businesses: Business[];
}

const BusinessSearch: React.FC<SearchProps> = ({ businesses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBusinesses, setFilteredBusinesses] = useState(businesses);

  // Filter and sort the businesses based on the search query
  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();

    // Filter businesses that match the search query
    const filtered = businesses.filter((business) => {
      return (
        business.name.toLowerCase().includes(lowercasedQuery) ||
        business.address.toLowerCase().includes(lowercasedQuery) ||
        business.contactInfo.toLowerCase().includes(lowercasedQuery)
      );
    });

    // Sort the filtered businesses: prioritize minority-owned ones at the top
    const sorted = filtered.sort((a, b) => {
      if (a.minorityOwned && !b.minorityOwned) return -1; // a comes first
      if (!a.minorityOwned && b.minorityOwned) return 1;  // b comes first
      return 0; // No priority change if both are minority-owned or both aren't
    });

    // Set the filtered and sorted businesses to the state
    setFilteredBusinesses(sorted);
  };

  // Handle search query change
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query); // Trigger search when the query changes
  };

  return (
    <div className="business-search">
      <h1>Search for Businesses</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleQueryChange}
        placeholder="Search businesses by name, contact, or address..."
      />

      {/* Render the filtered and sorted results */}
      <div className="search-results">
        {filteredBusinesses.length === 0 ? (
          <p>No businesses found.</p>
        ) : (
          filteredBusinesses.map((business, index) => (
            <div key={index} className={`business-item ${business.minorityOwned ? 'minority-owned' : ''}`}>
              <h3>{business.name}</h3>
              <p>{business.address}</p>
              <p>{business.contactInfo}</p>
              <p>Business Hours: {business.hours}</p>
              {business.minorityOwned && <span className="minority-badge">Minority Owned</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessSearch;
