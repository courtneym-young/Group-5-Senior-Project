import React, { useState } from "react";
import { useParams } from "react-router-dom";

// Review interface
interface Review {
  user: string;
  rating: number;
  comment: string;
}

// Product interface
interface Product {
  id: string;
  name: string;
}

const fakeProducts: Product[] = [
  { id: "1", name: "Wireless Headphones" },
  { id: "2", name: "Smartwatch" },
];

const fakeReviews: Record<string, Review[]> = {
  "1": [
    { user: "Alice", rating: 5, comment: "Great headphones! The sound quality is amazing." },
    { user: "Bob", rating: 4, comment: "Very comfortable, but a bit pricey." },
  ],
  "2": [
    { user: "Charlie", rating: 4, comment: "Nice smartwatch, but the battery could be better." },
  ],
};

// Helper function to generate stars
const renderStars = (rating: number) => {
  return "⭐".repeat(rating).padEnd(5, "☆"); // Fills remaining with empty stars
};

const ReviewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Add a review form state
  const [newReview, setNewReview] = useState({
    user: "",
    rating: 0,
    comment: "",
  });

  // If id is undefined, show a fallback message
  if (!id) {
    return <div>No product found.</div>;
  }

  // Get product details based on the ID
  const product = fakeProducts.find((product) => product.id === id);

  // Check if the product exists, and fetch reviews if it does
  const reviews = product ? fakeReviews[id] : [];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.user && newReview.rating && newReview.comment) {
      console.log("New review submitted:", newReview);
      // Here you would update state or send a request to the backend
    }
  };

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="reviews-page">
      <h1>Reviews for {product.name}</h1>

      {/* Display reviews with star ratings */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review">
              <h3>{review.user}</h3>
              <p>{renderStars(review.rating)}</p> {/* Star rating display */}
              <p>{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Review form */}
      <h3>Submit a Review</h3>
      <form onSubmit={handleSubmitReview}>
        <label>
          Name:
          <input
            type="text"
            value={newReview.user}
            onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
            required
          />
        </label>

        <label>
          Rating:
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setNewReview({ ...newReview, rating: star })}
                style={{ cursor: "pointer", fontSize: "20px" }}
              >
                {star <= newReview.rating ? "⭐" : "☆"}
              </span>
            ))}
          </div>
        </label>

        <label>
          Comment:
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            required
          />
        </label>

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewsPage;
