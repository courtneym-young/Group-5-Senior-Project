import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Chip,
  Switch,
  Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MobileLayout from "./shared/MobileLayout";
import TuneIcon from "@mui/icons-material/Tune";
import ImageIcon from "@mui/icons-material/Image";
import VerifiedIcon from "@mui/icons-material/Verified";
import { IconButton } from "@mui/material";
import { useFetchBusinessListEx } from "../../helpers/businessHelpers";
import { getFileUrl } from "../../helpers/storageHelpers";
// import { BUSINESS_STATUS_COLOR_MAPPING } from "../../config/StyleConfig";

// Define a type for product
interface Product {
  businessId: string;
  productName: string;
  productDescription: string[];
  productImage: string;
  createdAt?: string;
  updatedAt?: string;
  price: number;
}

// Define a type for business with image URL
interface BusinessWithImage extends Record<string, unknown> {
  id: string;
  name: string;
  description?: string;
  category?: string[];
  profilePhoto?: string;
  imageUrl?: string;
  status?: string;
  businessProducts?: Product[];
}

const Explore: React.FC = () => {
  // State for the filter dialog
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(true); // Default to showing only verified businesses
  
  // Data fetching and processing state
  const { businesses: rawBusinesses, loading, error } = useFetchBusinessListEx();
  const [businesses, setBusinesses] = useState<BusinessWithImage[]>([]);
  const [imageLoading, setImageLoading] = useState(true);

  // Toggle the filter dialog
  const handleFilterClick = () => {
    setFilterDialogOpen(true);
  };

  // Close the filter dialog
  const handleCloseFilter = () => {
    setFilterDialogOpen(false);
  };

  // Apply the selected filters
  const handleApplyFilters = () => {
    // Just close the dialog, the filtering will happen automatically
    setFilterDialogOpen(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setShowVerifiedOnly(true); // Reset to default (verified only)
    setFilterDialogOpen(false);
  };

  // Handle category selection changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Remove a single category filter
  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  // Toggle verified only filter
  const handleVerifiedOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowVerifiedOnly(event.target.checked);
  };

  // Remove verified only filter
  const handleRemoveVerifiedOnly = () => {
    setShowVerifiedOnly(false);
  };

  // Extract all unique categories from businesses
  useEffect(() => {
    if (rawBusinesses && rawBusinesses.length > 0) {
      const categories = new Set<string>();
      
      rawBusinesses.forEach(business => {
        if (business.category && Array.isArray(business.category)) {
          business.category.forEach((cat: string) => categories.add(cat));
        }
      });
      
      setAllCategories(Array.from(categories).sort());
    }
  }, [rawBusinesses]);

  // Process businesses and load images
  useEffect(() => {
    const loadBusinessImages = async () => {
      if (!rawBusinesses || rawBusinesses.length === 0) {
        setBusinesses([]);
        setImageLoading(false);
        return;
      }

      try {
        setImageLoading(true);
        const businessesWithImages = await Promise.all(
          rawBusinesses.map(async (business) => {
            // Clone the business object
            const businessWithImage = { ...business } as BusinessWithImage;
            
            // If business has a profilePhoto path, fetch the URL
            if (business.profilePhoto) {
              try {
                const imageUrl = await getFileUrl(business.profilePhoto);
                businessWithImage.imageUrl = imageUrl;
              } catch (imageError) {
                console.error(`Error loading image for business ${business.id}:`, imageError);
                // Keep the business but without image URL
              }
            }
            
            return businessWithImage;
          })
        );
        
        setBusinesses(businessesWithImages);
      } catch (err) {
        console.error("Error processing business images:", err);
      } finally {
        setImageLoading(false);
      }
    };

    loadBusinessImages();
  }, [rawBusinesses]);


  // Function to filter businesses based on search term, verified status, and selected categories
  const filteredBusinesses = businesses.filter((business) => {
    // Verified filter
    if (showVerifiedOnly && business.status !== 'VERIFIED') {
      return false;
    }
    
    // Category filter
    if (selectedCategories.length > 0) {
      const businessCategories = business?.category || [];
      // Check if business has at least one of the selected categories
      const hasSelectedCategory = selectedCategories.some(selectedCat => 
        businessCategories.includes(selectedCat)
      );
      if (!hasSelectedCategory) return false;
    }
    
    // Search term filter
    if (!searchTerm.trim()) return true;
    
    // Check if business has required properties
    const searchableValues = [
      business?.name || '',
      business?.description || '',
      ...(Array.isArray(business?.category) ? business.category : [])
    ];
    
    // Create a search string from name, description, and categories
    const searchString = searchableValues
      .filter(Boolean)  // Remove any undefined or null values
      .join(" ")
      .toLowerCase();
    
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Calculate the number of active filters
  const activeFilterCount = selectedCategories.length + (showVerifiedOnly ? 1 : 0);

  // Create a filter icon with a badge indicator when filters are active
  const filterIcon = (
    <IconButton onClick={handleFilterClick}>
      <Box position="relative">
        <TuneIcon fontSize="medium" />
        {activeFilterCount > 0 && (
          <Box
            position="absolute"
            top={-4}
            right={-4}
            width={16}
            height={16}
            bgcolor="primary.main"
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption" color="white" fontSize={10}>
              {activeFilterCount}
            </Typography>
          </Box>
        )}
      </Box>
    </IconButton>
  );

  if (error) {
    return (
      <MobileLayout title="Market" rightIcon={filterIcon}>
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography color="error">
            Error loading businesses: {error}
          </Typography>
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Market" rightIcon={filterIcon}>
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      
      {/* Active Filters */}
      <Box sx={{ padding: "0 20px", marginBottom: "10px", display: "flex", flexWrap: "wrap", gap: 1 }}>
        {/* Verified filter chip */}
        {showVerifiedOnly && (
          <Chip 
            icon={<VerifiedIcon sx={{ color: "#1976d2" }} />}
            label="Verified Only" 
            size="small"
            color="primary"
            sx={{ 
              fontWeight: "medium", 
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              '& .MuiChip-label': { paddingLeft: 0 }
            }}
            onDelete={handleRemoveVerifiedOnly}
          />
        )}
        
        {/* Category filter chips */}
        {selectedCategories.map(category => (
          <Chip 
            key={category} 
            label={category} 
            size="small"
            sx={{ 
              fontWeight: "medium", 
              backgroundColor: "#e3f2fd", 
              color: "#1976d2",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)" 
            }}
            onDelete={() => handleRemoveCategory(category)}
          />
        ))}
        
        {/* Clear all filters button */}
        {activeFilterCount > 1 && (
          <Chip 
            label="Clear all" 
            size="small"
            color="primary"
            variant="outlined"
            onClick={handleClearFilters}
          />
        )}
      </Box>

      {/* Scrollable Business List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {loading || imageLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <CircularProgress />
          </Box>
        ) : filteredBusinesses.length > 0 ? (
          filteredBusinesses.flatMap((business) => business.businessProducts || []).map((product) => (
            
            <Box key={product.businessId} sx={{ padding: "10px" }}>
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
                  backgroundImage: product.productImage? `url(${product.productImage})` : "none",
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
                  <Typography fontWeight="bold">{product.price}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {product.productDescription || "No description available"}
                </Typography>
                
              </Box>
            </Box>
          )
        
        )


        ) : (
          <Box sx={{ padding: "20px", textAlign: "center" }}>
            <Typography align="center" sx={{ mt: 2, color: "#9e9e9e" }}>
              No results found.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              Try adjusting your filters or search terms.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Category Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={handleCloseFilter} fullWidth maxWidth="xs">
        <DialogTitle>
          Filter Businesses
        </DialogTitle>
        <DialogContent dividers>
          {/* Verified Filter Toggle */}
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight="medium" sx={{ mb: 1 }}>Business Status</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showVerifiedOnly}
                  onChange={handleVerifiedOnlyChange}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>Show verified businesses only</Typography>
                  <VerifiedIcon sx={{ ml: 1, color: "#1976d2", fontSize: "1rem" }} />
                </Box>
              }
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Category Filters */}
          <Typography fontWeight="medium" sx={{ mb: 1 }}>Categories</Typography>
          {allCategories.length === 0 ? (
            <Typography>No categories available</Typography>
          ) : (
            <FormGroup>
              {allCategories.map(category => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                  }
                  label={category}
                />
              ))}
            </FormGroup>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters}>Clear All</Button>
          <Button onClick={handleCloseFilter}>Cancel</Button>
          <Button onClick={handleApplyFilters} color="primary" variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </MobileLayout>
  );
};

export default Explore;