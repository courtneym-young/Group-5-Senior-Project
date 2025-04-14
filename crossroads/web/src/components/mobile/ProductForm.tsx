/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
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
  InputAdornment,
  LinearProgress 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { uploadBusinessImage } from "../../helpers/storageHelpers";

const dataClient = generateClient<Schema>();

// ProductForm component
const ProductForm: React.FC<{
  businessId: string;
  userId: string,
  open: boolean;
  onClose: () => void;
}> = ({ businessId, userId, open, onClose }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        // You could add error state and display here
        console.error("Image size should be less than 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        console.error("Please select an image file");
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  const handleSubmit = async () => {
    if (!productName || !price) {
      return; // Require at least name and price
    }

    try {
      setSubmitting(true);
      
      // Handle image upload if present
      let imageUrl = "https://t3.ftcdn.net/jpg/03/35/13/14/360_F_335131435_DrHIQjlOKlu3GCXtpFkIG1v0cGgM9vJC.jpg"; // Default image
      
      if (imageFile) {
        try {
          // Generate a unique product ID for the upload path
          const productUploadId = `product-${businessId}-${Date.now()}`;
          
          // Upload the image
          imageUrl = await uploadBusinessImage(
            imageFile,
            productUploadId,
            (progress) => {
              const percentage = Math.round((progress.transferredBytes / progress.totalBytes) * 100);
              setUploadProgress(percentage);
            }
          );
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Could add error state here
        }
      }
      
      // Create the product in the database
      await dataClient.models.Product.create({
        businessId,
        userId,
        productName,
        productDescription: productDescription || "",
        productImage: imageUrl,
        price: parseFloat(price),
        createdAt: new Date().toISOString(),
      });
      
      setSubmitting(false);
      onClose();
      
      // Reset form
      setProductName("");
      setProductDescription("");
      setPrice("");
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error submitting product:", error);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add New Product
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="productName"
          label="Product Name"
          type="text"
          fullWidth
          variant="outlined"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          id="price"
          label="Price"
          type="number"
          fullWidth
          variant="outlined"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          id="description"
          label="Product Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Product Image</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
          {imagePreview ? (
            <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
              <img 
                src={imagePreview} 
                alt="Product preview" 
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
              />
              <Button 
                variant="outlined" 
                color="error" 
                size="small" 
                onClick={clearSelectedImage}
                sx={{ mt: 1 }}
              >
                Remove Image
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              component="label"
              sx={{ width: '100%', height: '120px', display: 'flex', flexDirection: 'column' }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Click to upload product image
              </Typography>
              <Typography variant="caption" color="text.secondary">
                JPEG, PNG, WebP • Max 5MB
              </Typography>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          )}
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                Uploading: {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!productName || !price || submitting}
        >
          {submitting ? "Adding..." : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;