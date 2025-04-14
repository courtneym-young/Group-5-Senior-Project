import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Avatar,
  LinearProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { uploadBusinessImage } from "../../helpers/storageHelpers";

const dataClient = generateClient<Schema>();

// BusinessPostForm component
const BusinessPostForm: React.FC<{
  businessId: string;
  userId: string;
  userProfile?: {
    firstName?: string;
    lastName?: string;
    username?: string;
    profilePhoto?: string;
  };
  open: boolean;
  onClose: () => void;
}> = ({ businessId, userId, userProfile, open, onClose }) => {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Validate file size and type
      const validFiles = filesArray.filter(file => {
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        const isValidType = file.type.match('image.*');
        return isValidSize && isValidType;
      });
      
      // Limit to 4 images max
      const newFiles = [...imageFiles, ...validFiles].slice(0, 4);
      setImageFiles(newFiles);
      
      // Create preview URLs
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      // Revoke the URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    
    // Remove upload progress for this index
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      
      // Upload images if present
      const uploadedImageUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        // Upload each image sequentially
        for (let i = 0; i < imageFiles.length; i++) {
          try {
            const postImageId = `post-${businessId}-${Date.now()}-${i}`;
            
            const imageUrl = await uploadBusinessImage(
              imageFiles[i],
              postImageId,
              (progress) => {
                const percentage = Math.round((progress.transferredBytes / progress.totalBytes) * 100);
                setUploadProgress(prev => ({
                  ...prev,
                  [i]: percentage
                }));
              }
            );
            
            uploadedImageUrls.push(imageUrl);
          } catch (uploadError) {
            console.error(`Error uploading image ${i}:`, uploadError);
          }
        }
      }
      
      // Create the post in the database
      await dataClient.models.BusinessOwnerPost.create({
        businessId,
        userId,
        content: content.trim(),
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
        createdAt: new Date().toISOString(),
      });
      
      setSubmitting(false);
      onClose();
      
      // Reset form
      setContent("");
      setImageFiles([]);
      // Revoke all object URLs to prevent memory leaks
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
      setUploadProgress({});
    } catch (error) {
      console.error("Error submitting post:", error);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Create New Post
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={userProfile?.profilePhoto}
            sx={{ width: 40, height: 40, mr: 1 }}
          >
            {userProfile?.firstName?.charAt(0) ||
              userProfile?.username?.charAt(0) ||
              "?"}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {userProfile?.firstName || ""} {userProfile?.lastName || ""}
            </Typography>
            {userProfile?.username && (
              <Typography variant="caption" color="text.secondary">
                @{userProfile.username}
              </Typography>
            )}
          </Box>
        </Box>
        
        <TextField
          autoFocus
          margin="dense"
          id="post-content"
          placeholder="What's new with your business?"
          type="text"
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Add Images (Optional)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {imageFiles.length}/4
            </Typography>
          </Box>
          
          <input
            accept="image/*"
            id="post-images-upload"
            type="file"
            multiple
            onChange={handleImageChange}
            disabled={imageFiles.length >= 4}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <label htmlFor="post-images-upload">
            <Button 
              variant="outlined" 
              component="span"
              startIcon={<ImageIcon />}
              disabled={imageFiles.length >= 4}
            >
              Upload Images
            </Button>
          </label>
          
          {imagePreviews.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {imagePreviews.map((preview, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img 
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{ 
                      width: imagePreviews.length === 1 ? '100%' : '150px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.8)' }}
                    onClick={() => removeImage(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  
                  {/* Add upload progress indicator */}
                  {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 1, bgcolor: 'rgba(0,0,0,0.5)' }}>
                      <LinearProgress variant="determinate" value={uploadProgress[index]} sx={{ height: 5, borderRadius: 1 }} />
                      <Typography variant="caption" sx={{ color: 'white', display: 'block', textAlign: 'center', fontSize: '0.7rem' }}>
                        {uploadProgress[index]}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
          
          {/* Display info message for rejected files */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Images must be under 5MB and in standard image formats
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!content.trim() || submitting}
        >
          {submitting ? "Posting..." : "Post Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BusinessPostForm;