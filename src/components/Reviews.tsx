import React, { useState } from 'react';
import { useParams, Link} from 'react-router-dom';

interface Review {
  user: string;
  rating: number;
  comment: string;
}

const ReviewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Sample reviews for the product
  const initialReviews: Review[] = [
    { user: 'Alice', rating: 5, comment: 'Excellent product! Totally worth it.' },
    { user: 'Bob', rating: 4, comment: 'Very good, but could be improved.' },
    { user: 'Charlie', rating: 3, comment: 'It’s okay, not the best experience.' },
    { user: 'Dave', rating: 5, comment: 'Love it, great quality!' },
    { user: 'Eve', rating: 2, comment: 'Not satisfied, it broke after a week.' },
  ];

  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // Function to sort reviews by rating
  const sortByRating = (a: Review, b: Review) => b.rating - a.rating;

  // Function to sort reviews by keywords (if the comment includes the keyword)
  const sortByKeyword = (a: Review, b: Review) => {
    const keyword = 'good';  // Example keyword, you could make this dynamic
    const aContainsKeyword = a.comment.toLowerCase().includes(keyword);
    const bContainsKeyword = b.comment.toLowerCase().includes(keyword);
    
    if (aContainsKeyword === bContainsKeyword) return 0;
    return aContainsKeyword ? -1 : 1;
  };

  // Sort the reviews by the selected option (rating or keyword)
  const handleSortChange = (sortMethod: 'rating' | 'keyword') => {
    let sortedReviews;
    if (sortMethod === 'rating') {
      sortedReviews = [...reviews].sort(sortByRating);  // Sort by rating
    } else {
      sortedReviews = [...reviews].sort(sortByKeyword);  // Sort by keyword
    }
    setReviews(sortedReviews);
  };

  return (
    <div className="reviews-page">
      <h2>Reviews for Product {id}</h2>

      {/* Sort by options */}
      <div>
        <button onClick={() => handleSortChange('rating')}>Sort by Rating</button>
        <button onClick={() => handleSortChange('keyword')}>Sort by Keyword ("good")</button>
      </div>

      {/* Display reviews */}
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="review-item">
            <p><strong>{review.user}</strong> rated it {review.rating} stars</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}

      {/* Back to Product Link */}
      <Link to={`/products/${id}`}>Back to Product</Link>
    </div>
  );
};

export default ReviewsPage;
