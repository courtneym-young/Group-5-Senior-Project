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
  Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MobileLayout from "./shared/MobileLayout";
import TuneIcon from "@mui/icons-material/Tune";
import ImageIcon from "@mui/icons-material/Image";
import { IconButton } from "@mui/material";
import { useFetchBusinessListEx } from "../../helpers/businessHelpers";
import { getFileUrl } from "../../helpers/storageHelpers";

// Define a type for business with image URL
interface BusinessWithImage extends Record<string, unknown> {
  id: string;
  name: string;
  description?: string;
  category?: string[];
  profilePhoto?: string;
  imageUrl?: string;
}

const Explore: React.FC = () => {
  // State for the filter dialog
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
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


  // Function to filter businesses based on search term and selected categories
  const filteredBusinesses = businesses.filter((business) => {
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

  // Create a filter icon with a badge indicator when filters are active
  const filterIcon = (
    <IconButton onClick={handleFilterClick}>
      <Box position="relative">
        <TuneIcon fontSize="medium" />
        {selectedCategories.length > 0 && (
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
              {selectedCategories.length}
            </Typography>
          </Box>
        )}
      </Box>
    </IconButton>
  );

  if (error) {
    return (
      <MobileLayout title="Businesses" rightIcon={filterIcon}>
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography color="error">
            Error loading businesses: {error}
          </Typography>
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Businesses" rightIcon={filterIcon}>
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
      {selectedCategories.length > 0 && (
        <Box sx={{ padding: "0 20px", marginBottom: "10px", display: "flex", flexWrap: "wrap", gap: 1 }}>
          {selectedCategories.map(category => (
            <Chip 
              key={category} 
              label={category} 
              size="small" 
              onDelete={() => handleRemoveCategory(category)}
            />
          ))}
          {selectedCategories.length > 1 && (
            <Chip 
              label="Clear all" 
              size="small"
              color="primary"
              variant="outlined"
              onClick={handleClearFilters}
            />
          )}
        </Box>
      )}

      {/* Scrollable Business List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {loading || imageLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <CircularProgress />
          </Box>
        ) : filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <Box key={business.id} sx={{ padding: "10px" }}>
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
                  backgroundImage: business.imageUrl ? `url(${business.imageUrl})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!business.imageUrl && (
                  <ImageIcon fontSize="large" sx={{ color: "#9e9e9e" }} />
                )}
              </Box>
              {/* Business Details */}
              <Box sx={{ padding: "10px" }}>
                <Typography fontWeight="bold">{business.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {business.description || "No description available"}
                </Typography>
                {business.category && business.category.length > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    {business.category.join(", ")}
                  </Typography>
                )}
              </Box>
            </Box>
          ))
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
          Filter by Category
        </DialogTitle>
        <DialogContent dividers>
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