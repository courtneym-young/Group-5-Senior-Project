import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import BusinessProfile from './components/BusinessProfile';

// Business data interface
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

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = businesses.filter((business) =>
      business.name.toLowerCase().includes(lowercasedQuery) ||
      business.address.toLowerCase().includes(lowercasedQuery) ||
      business.contactInfo.toLowerCase().includes(lowercasedQuery)
    );

    const sorted = filtered.sort((a, b) => (a.minorityOwned === b.minorityOwned ? 0 : a.minorityOwned ? -1 : 1));
    setFilteredBusinesses(sorted);
  };

  return (
    <div className="business-search">
      <h1>Search for Businesses</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search businesses by name, contact, or address..."
      />

      <div className="search-results">
        {filteredBusinesses.length === 0 ? (
          <p>No businesses found.</p>
        ) : (
          filteredBusinesses.map((business, index) => (
            <div key={index} className={`business-item ${business.minorityOwned ? 'minority-owned' : ''}`}>
              <h3>
                <Link to={`/profile/${encodeURIComponent(business.name)}`}>{business.name}</Link>
              </h3>
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

// Business Profile Page (dynamically loads based on URL)
const BusinessProfilePage: React.FC<{ businesses: Business[] }> = ({ businesses }) => {
  const { name } = useParams<{ name: string }>();
  const business = businesses.find((b) => b.name === decodeURIComponent(name || ''));

  if (!business) return <h2>Business Not Found</h2>;

  return <BusinessProfile initialBusiness={business} />;
};

const App = () => {
  const fakeBusinesses: Business[] = [
    { name: 'Tech Innovators', contactInfo: 'tech@innovators.com', address: '123 Innovation Rd, Silicon Valley, CA', hours: '9:00 AM - 5:00 PM', minorityOwned: true },
    { name: 'Green Earth Products', contactInfo: 'contact@greenearth.com', address: '456 Green Ave, Denver, CO', hours: '10:00 AM - 6:00 PM', minorityOwned: false },
    { name: 'Creative Designs', contactInfo: 'support@creativedesigns.com', address: '789 Design St, New York, NY', hours: '8:00 AM - 4:00 PM', minorityOwned: true },
    { name: 'Healthy Eats', contactInfo: 'info@healthyeats.com', address: '101 Wellness Blvd, Austin, TX', hours: '11:00 AM - 7:00 PM', minorityOwned: false },
  ];

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
      </nav>

      <Routes>
        <Route path="/" element={<BusinessSearch businesses={fakeBusinesses} />} />
        <Route path="/profile/:name" element={<BusinessProfilePage businesses={fakeBusinesses} />} />
      </Routes>
    </Router>
  );
};

export default App;
