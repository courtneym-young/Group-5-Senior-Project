// Import the necessary components for the review form
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
  Box,
  Typography,
  IconButton,
  Paper,
  Avatar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { formatDate } from "../../helpers/timeHelpers";

const dataClient = generateClient<Schema>();

// ReviewForm component
const ReviewForm: React.FC<{
  businessId: string;
  userId: string;
  open: boolean;
  onClose: () => void;
  // onReviewSubmitted: () => void;
}> = ({ businessId, userId, open, onClose }) => {
  const [rating, setRating] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      // Require at least a rating
      return;
    }

    try {
      setSubmitting(true);
      
      // Create the review in the database
      await dataClient.models.Review.create({
        businessId,
        userId,
        rating: rating || 0,
        text: reviewText,
        isPublic: true,
        createdAt: new Date().toISOString(),
      });
      
      setSubmitting(false);
      // onReviewSubmitted();
      onClose();
      
      // Reset form
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Write a Review
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography component="legend">Your Rating</Typography>
          <Rating
            name="business-rating"
            value={rating}
            onChange={(_event, newValue) => {
              setRating(newValue);
            }}
            size="large"
            precision={0.5}
          />
        </Box>
        <TextField
          autoFocus
          margin="dense"
          id="review"
          label="Your Review"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!rating || submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Now let's implement the ReviewsSection component that will use our form
const ReviewsSection: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  business: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userRelationship: any;
  // refreshBusiness?: () => void;
}> = ({ business, userRelationship }) => {
  const [openReviewForm, setOpenReviewForm] = useState(false);
  
  const handleOpenReviewForm = () => {
    setOpenReviewForm(true);
  };
  
  const handleCloseReviewForm = () => {
    setOpenReviewForm(false);
  };
  
  // const handleReviewSubmitted = () => {
  //   // Refresh business data to include the new review
  //   refreshBusiness();
  // };

  return (
    <>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Reviews</span>
        {!userRelationship.isOwner && userRelationship.currentUserId && (
          <Button variant="contained" size="small" onClick={handleOpenReviewForm}>
            Write a Review
          </Button>
        )}
      </Typography>

      {/* Display reviews or "No reviews yet" message */}
      {business.reviews && business.reviews.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {business.reviews.map((review: any) => (
            <Paper key={review.id} sx={{ p: 2, mb: 2, borderRadius: "8px" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  src={review.user?.profilePhoto}
                  sx={{ width: 32, height: 32, mr: 1 }}
                >
                  {review.user?.firstName?.charAt(0) ||
                    review.user?.username?.charAt(0) ||
                    "?"}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {review.user?.firstName} {review.user?.lastName}
                    {review.user?.username && (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ ml: 1, color: "text.secondary" }}
                      >
                        @{review.user.username}
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(review.createdAt || "")}
                  </Typography>
                </Box>
              </Box>
              
              <Rating 
                value={review.rating} 
                readOnly 
                precision={0.5} 
                size="small"
                sx={{ mb: 1 }}
              />

              {review.text && (
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {review.text}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            bgcolor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <Typography color="text.secondary">No reviews yet</Typography>
        </Box>
      )}
      
      {/* Review Form Dialog */}
      {userRelationship.currentUserId && (
        <ReviewForm
          businessId={business.id}
          userId={userRelationship.currentUserId}
          open={openReviewForm}
          onClose={handleCloseReviewForm}
          // onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </>
  );
};

export { ReviewsSection, ReviewForm };