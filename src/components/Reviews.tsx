import React, { useState } from 'react';
import '../App.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Reply {
  user: string;
  comment: string;
}

interface Review {
  user: string;
  rating: number;
  comment: string;
  replies: Reply[];
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

interface ReviewProps {
  businesses: Business[];
}

const ReviewsPage: React.FC<ReviewProps> = ({ businesses }) => {
  const [replyText, setReplyText] = useState<string>('');
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number | null>(null);

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(e.target.value);
  };

  const handleAddReply = (businessIndex: number, reviewIndex: number) => {
    if (replyText.trim()) {
      const updatedBusinesses = [...businesses];
      const reply: Reply = { user: 'Current User', comment: replyText };

      updatedBusinesses[businessIndex].reviews[reviewIndex].replies.push(reply);
      setReplyText(''); // Clear input after adding reply
    }
  };

  return (
    <div className="reviews-page">
      <h1 className="page-title">Reviews</h1>
      <div className="reviews-container">
        {businesses.map((business, businessIndex) => (
          <div key={businessIndex} className="business-container">
            <h2 className="business-name">{business.name}</h2>
            {business.reviews.map((review, reviewIndex) => (
              <div key={reviewIndex} className="review-container">
                <h3 className="review-title">Review</h3>
                <p><strong>Username:</strong> {review.user}</p>
                <p><strong>Rating:</strong> {review.rating}</p>
                <p><strong>Comment:</strong> {review.comment}</p>
                {review.replies.map((reply, replyIndex) => (
                  <div key={replyIndex} className="reply-container">
                    <h4 className="reply-title">Reply</h4>
                    <p><strong>Username:</strong> {reply.user}</p>
                    <p>{reply.comment}</p>
                  </div>
                ))}
                <div className="reply-input-container">
                  {currentReviewIndex === reviewIndex ? (
                    <>
                      <input
                        type="text"
                        value={replyText}
                        onChange={handleReplyChange}
                        placeholder="Add your reply..."
                        className="reply-input"
                      />
                      <button
                        onClick={() => handleAddReply(businessIndex, reviewIndex)}
                        className="reply-button"
                      >
                        Reply
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setCurrentReviewIndex(reviewIndex)}
                      className="add-reply-button"
                    >
                      Add a reply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
