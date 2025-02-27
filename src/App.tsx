import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import BusinessProfile from './components/BusinessProfile';
import ProductPage from './components/Product';
import ReviewsPage from './components/Reviews';
import Featured from './components/Featured';
import Promotions from './components/Promotions';

// Business data interface
interface Business {
  name: string;
  contactInfo: string;
  address: string;
  hours: string;
  category: string;
  minorityOwned: boolean;
  products: Product[];
  reviews: Review[];
  imageUrl: string;
  deals?: Deal[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Deal {
  title: string;
  description: string;
  oldPrice?: number;
  newPrice?: number;
}

interface Review {
  user: string;
  rating: number;
  comment: string;
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

// Business Profile Page
const BusinessProfilePage: React.FC<{ businesses: Business[] }> = ({ businesses }) => {
  const { name } = useParams<{ name: string }>();
  const business = businesses.find((b) => b.name === decodeURIComponent(name || ''));

  if (!business) return <h2>Business Not Found</h2>;

  return (
    <div>
      <BusinessProfile initialBusiness={business} />
      <Link to={`/profile/${encodeURIComponent(business.name)}/products`}>
        <button>View Products</button>
      </Link>
      <Link to={`/profile/${encodeURIComponent(business.name)}/reviews`}>
        <button>View Reviews</button>
      </Link>
    </div>
  );
};

// Business Products Page
const BusinessProductsPage: React.FC<{ businesses: Business[] }> = ({ businesses }) => {
  const { name } = useParams<{ name: string }>();
  const business = businesses.find((b) => b.name === decodeURIComponent(name || ''));

  if (!business) return <h2>Business Not Found</h2>;

  return (
    <div>
      <h2>Products for {business.name}</h2>
      {business.products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        business.products.map((product) => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
          </div>
        ))
      )}
      <Link to={`/profile/${encodeURIComponent(business.name)}`}>Back to Business</Link>
    </div>
  );
};

// Business Reviews Page
const BusinessReviewsPage: React.FC<{ businesses: Business[] }> = ({ businesses }) => {
  const { name } = useParams<{ name: string }>();
  const business = businesses.find((b) => b.name === decodeURIComponent(name || ''));

  if (!business) return <h2>Business Not Found</h2>;

  return (
    <div>
      <h2>Reviews for {business.name}</h2>
      {business.reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        business.reviews.map((review, index) => (
          <div key={index} className="review-item">
            <p><strong>{review.user}</strong> rated it {review.rating} stars</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}
      <Link to={`/profile/${encodeURIComponent(business.name)}`}>Back to Business</Link>
    </div>
  );
};

const App: React.FC = () => {
  const fakeBusinesses: Business[] = [
    {
      name: 'Tech Innovators',
      contactInfo: 'tech@innovators.com',
      address: '123 Innovation Rd, Silicon Valley, CA',
      hours: '9:00 AM - 5:00 PM',
      category: 'Technology',
      minorityOwned: true,
      products: [
        { id: 1, name: 'Wireless Headphones', description: 'Nice headphones', price: 100 },
        { id: 2, name: 'Wireless Speaker', description: 'Cool speaker', price: 50 },
      ],
      reviews: [
        { user: 'sydneydenae', rating: 5, comment: 'I love this business.' },
        { user: 'howardstudent1', rating: 4, comment: 'I like this business.' },
      ],
      imageUrl: '/images/tech.png',
      deals: [
        { title: '50% off all headphones', description: 'Limited time offer', oldPrice: 200, newPrice: 100 },
      ],
    },
    {
      name: 'Plant People',
      contactInfo: 'plant@peoples.com',
      address: '123 Plant Rd, Plant Valley, CA',
      hours: '11:00 AM - 5:00 PM',
      minorityOwned: true,
      category: 'Plants',
      products: [
        { id: 1, name: 'Snake Plant', description: 'Big striped plant.', price: 30 },
        { id: 2, name: 'Cactus', description: 'Prickly plant', price: 5 },
      ],
      reviews: [
        { user: 'sydneydenae', rating: 5, comment: 'I love this business. I got plants' },
        { user: 'howardstudent1', rating: 2, comment: 'My plant died.' },
      ],
      imageUrl: '/images/plant.png',
      deals: [
        { title: '50% off all plants', description: 'Limited time offer', oldPrice: 100, newPrice: 50 },
      ],
    },
  ];

  return (
    <Router>
      <nav className="links-container">
      <Link to="/featured">Featured</Link>
      <Link to="/deals">Deals</Link>
      <Link to="/">Search</Link>
      <Link to="/insights">Insights</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/messages">Messages</Link>
      </nav>

      <Routes>
        <Route path="/featured" element={<Featured businesses={fakeBusinesses}/>}/>
        <Route path="/deals" element={<Promotions businesses={fakeBusinesses}/>}/>
        <Route path="/" element={<BusinessSearch businesses={fakeBusinesses} />} />
        <Route path="/profile/:name" element={<BusinessProfilePage businesses={fakeBusinesses} />} />
        <Route path="/profile/:name/products" element={<BusinessProductsPage businesses={fakeBusinesses} />} />
        <Route path="/profile/:name/reviews" element={<BusinessReviewsPage businesses={fakeBusinesses} />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/reviews/:id" element={<ReviewsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
