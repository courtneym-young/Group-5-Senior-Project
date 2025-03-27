import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MobileLayout from "./shared/MobileLayout";
import ImageIcon from "@mui/icons-material/Image";
import { useFetchProductList } from "../../helpers/businessHelpers";
import { getFileUrl } from "../../helpers/storageHelpers";
// import { BUSINESS_STATUS_COLOR_MAPPING } from "../../config/StyleConfig";

// Define a type for product
interface ProductWithImage extends Record<string, unknown> {
  businessId: string;
  productName: string;
  productDescription: string[];
  productImage: string;
  createdAt?: string;
  updatedAt?: string;
  price: number;
}


const Market: React.FC = () => {
  // Data fetching and processing state
  const { products: rawProducts, loading, error } = useFetchProductList();
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [imageLoading, setImageLoading] = useState(true);


  // Process businesses and load images
  useEffect(() => {
    const loadProductImages = async () => {
      if (!rawProducts || rawProducts.length === 0) {
        setProducts([]);
        setImageLoading(false);
        return;
      }

      try {
        setImageLoading(true);
        const productsWithImages = await Promise.all(
          rawProducts.map(async (product) => {
            // Clone the product object
            const productWithImage = {... product} as ProductWithImage;
            
            // If product has a photo path, fetch the URL
            if (product.productImage) {
              try {
                const imageUrl = await getFileUrl(product.productImage);
                productWithImage.imageUrl = imageUrl;
              } catch (imageError) {
                console.error(`Error loading image for business ${product.productName}:`, imageError);
                // Keep the product but without image URL
              }
            }
            
            return productWithImage;
          })
        );
        
        setProducts(productsWithImages);
      } catch (err) {
        console.error("Error processing product images:", err);
      } finally {
        setImageLoading(false);
      }
    };

    loadProductImages();
  }, [rawProducts]);

  if (error) {
    return (
      <MobileLayout title="Market" >
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography color="error">
            Error loading products: {error}
          </Typography>
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Market">
      {/* Search Bar */}
      <Box sx={{ padding: "0 20px", marginBottom: "10px" }}>
        <TextField
          fullWidth
          placeholder="Search"
          variant="outlined"
          sx={{ borderRadius: "8px", backgroundColor: "#f0f0f0" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Scrollable Business List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
      {loading || imageLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <CircularProgress />
        </Box>
      ) : products.length > 0 ? (
        products.map((product) => (
          <Box sx={{ padding: "10px" }}>
            {/* Grey Box with Image or Image Icon */}
            <Box
              sx={{
                width: "100%",
                height: "300px",
                backgroundColor: "#e0e0e0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "12px",
                backgroundImage: product.productImage ? `url(${product.productImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative", // For positioning the verified badge
              }}
            >
              {!product.productImage && (
                <ImageIcon fontSize="large" sx={{ color: "#9e9e9e" }} />
              )}
            </Box>
            
            {/* Business Details */}
            <Box sx={{ padding: "10px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontWeight="bold">{product.productName}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {product.price || "No description available"}
                {product.productDescription || "No description available"}
              </Typography>              
            </Box>
          </Box>
        ))
      ) : (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography align="center" sx={{ mt: 2, color: "#9e9e9e" }}>
            No results found.
          </Typography>
        </Box>
      )}
    </Box>
    
    </MobileLayout>
    );
    };

    export default Market;