// src/components/Featured.tsx
import React from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
  }
  
  interface Review {
    user: string;
    rating: number;
    comment: string;
  }

  interface Deal {
    title: string;
    description: string;
    oldPrice?: number;
    newPrice?: number;
  }

  interface Business {
    name: string;
    contactInfo: string;
    address: string;
    hours: string;
    category: string;
    minorityOwned: boolean;
    products: Product[];
    reviews: Review[];
    imageUrl?: string;
    deals?: Deal[];
  }
  

  interface FeaturedProps {
    businesses: Business[];
  }

const Featured: React.FC <FeaturedProps> = ({ businesses })=> {
  return (
    <div>
      <h1>Featured</h1>
      <div style={{ overflowY: 'scroll', maxHeight: '400px' }}>
        {businesses.map((business, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <img src={business.imageUrl} alt={business.name} style={{ width: '100px', height: '100px' }} />
            <h2>{business.name}</h2>
            <p>Category: {business.category}</p>
            <p>Address: {business.address}</p>
            <p>Minority Owned: {business.minorityOwned ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
      {/* Add more content here */}
    </div>
  );
};

export default Featured;
