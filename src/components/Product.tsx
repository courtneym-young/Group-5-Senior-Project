import React from "react";
import { useParams, Link } from "react-router-dom";

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

// Fake product data (Replace with API call later)
const fakeProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality noise-canceling headphones with deep bass.",
    price: "$99.99",
    imageUrl: "https://via.placeholder.com/300", // Replace with actual image
  },
  {
    id: "2",
    name: "Smartwatch Pro",
    description: "Track your fitness and stay connected on the go.",
    price: "$149.99",
    imageUrl: "https://via.placeholder.com/300",
  },
];

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Find product by ID
  const product = fakeProducts.find((p) => p.id === id);

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} width="300" />
      <p>{product.description}</p>
      <h3>Price: {product.price}</h3>

      {/* Link to the reviews page */}
      <Link to={`/product/${product.id}/reviews`}>
        <button>View Reviews</button>
      </Link>
    </div>
  );
};

export default ProductPage;