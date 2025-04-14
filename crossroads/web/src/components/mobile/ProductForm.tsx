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
  InputAdornment
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

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
  const [, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!productName || !price) {
      return; // Require at least name and price
    }

    try {
      setSubmitting(true);
      
      // In a real implementation, you would upload the image to storage
      // and get back a URL. This is simplified for now.
      const imageUrl = imagePreview || "/api/placeholder/400/300";
      
      // Create the product in the database
      console.log(businessId,
        productName,)
      await dataClient.models.Product.create({
        businessId,
        userId,
        productName,
        productDescription: productDescription ? [productDescription] : [],
        productImage: imageUrl ?? "https://t3.ftcdn.net/jpg/03/35/13/14/360_F_335131435_DrHIQjlOKlu3GCXtpFkIG1v0cGgM9vJC.jpg",
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
      console.log("Submitted!!")
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Product Image
          </Typography>
          <input
            accept="image/*"
            id="product-image-upload"
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="product-image-upload">
            <Button variant="outlined" component="span">
              Upload Image
            </Button>
          </label>
          
          {imagePreview && (
            <Box mt={2} sx={{ position: 'relative' }}>
              <img 
                src={imagePreview}
                alt="Product preview"
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'white' }}
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
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