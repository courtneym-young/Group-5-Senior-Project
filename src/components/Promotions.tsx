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

interface PromotionsProps {
  businesses: Business[];
}

const Promotions: React.FC<PromotionsProps> = ({ businesses }) => {
  return (
    <div>
      <h1>Deals</h1>
      <div style={{ overflowY: 'scroll', maxHeight: '400px' }}>
        {businesses.map((business, index) => (
          <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
            {business.imageUrl && (
              <img src={business.imageUrl} alt={business.name} style={{ width: '100px', height: '100px' }} />
            )}
            <h2>{business.name}</h2>
            <p>Address: {business.address}</p>
            <p>Minority Owned: {business.minorityOwned ? 'Yes' : 'No'}</p>

            {/* Check if the business has deals and map through them */}
            {business.deals && business.deals.length > 0 ? (
              <div>
                <h3>Available Deals:</h3>
                {business.deals.map((deal, i) => (
                  <div key={i} style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                    <p><strong>{deal.title}</strong></p>
                    <p>{deal.description}</p>
                    {deal.oldPrice && deal.newPrice && (
                      <p>
                        <s style={{ color: 'red' }}>${deal.oldPrice.toFixed(2)}</s> → 
                        <strong style={{ color: 'green' }}> ${deal.newPrice.toFixed(2)}</strong>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No deals available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
