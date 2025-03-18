import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, InputAdornment, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MobileLayout from "./shared/MobileLayout";
import TuneIcon from "@mui/icons-material/Tune";
import ImageIcon from "@mui/icons-material/Image";
import { IconButton } from "@mui/material";
import { useFetchBusinessListEx } from "../../helpers/businessHelpers";

const Explore: React.FC = () => {
  const icon = (
    <IconButton>
      <TuneIcon fontSize="medium" />
    </IconButton>
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { businesses, loading, error } = useFetchBusinessListEx();

  // Debug: Log the raw businesses data
  useEffect(() => {
    console.log("Raw businesses data:", businesses);
    console.log("Loading state:", loading);
    console.log("Error state:", error);
  }, [businesses, loading, error]);

  // Function to filter businesses based on title, description, or categories
  const filteredBusinesses = businesses.filter((business) => {
    // If searchTerm is empty, return all businesses
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
    
    const result = searchString.includes(searchTerm.toLowerCase());
    console.log(`Business ${business?.name} matches search '${searchTerm}':`, result);
    return result;
  });

  // Debug: Log filtered businesses result
  useEffect(() => {
    console.log("Filtered businesses:", filteredBusinesses);
  }, [filteredBusinesses]);

  if (error) {
    return (
      <MobileLayout title="Businesses" rightIcon={icon}>
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography color="error">
            Error loading businesses: {error}
          </Typography>
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Businesses" rightIcon={icon}>
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

      {/* Debug Info */}
      <Box sx={{ padding: "0 20px", marginBottom: "10px" }}>
        <Typography variant="caption" color="text.secondary">
          Total businesses: {businesses.length}, Filtered: {filteredBusinesses.length}, Loading: {loading.toString()}
        </Typography>
      </Box>

      {/* Scrollable Business List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
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
                  backgroundImage: business.profilePhoto ? `url(${business.profilePhoto})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!business.profilePhoto && (
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
              Try creating some businesses or check if there are any database connectivity issues.
            </Typography>
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
};

export default Explore;