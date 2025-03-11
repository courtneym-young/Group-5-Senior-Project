import React, { useState } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MobileLayout from "./shared/MobileLayout";
import TuneIcon from "@mui/icons-material/Tune";
import ImageIcon from "@mui/icons-material/Image";
import {IconButton} from "@mui/material";

// Simulated Business Data
const businesses = [
  {
    id: 1,
    name: "Glamour Hair Salon",
    description: "Premium hair styling and treatments.",
    keywords: ["hair", "salon", "styling", "beauty"],
  },
  {
    id: 2,
    name: "Fresh Cuts Barbershop",
    description: "Classic and modern cuts for all ages.",
    keywords: ["barber", "barbershop", "cuts", "hair"],
  },
  {
    id: 3,
    name: "Urban Trend Clothing",
    description: "Trendy streetwear and fashion.",
    keywords: ["clothing", "fashion", "clothes", "apparel"],
  },
  {
    id: 4,
    name: "Glow Esthetics",
    description: "Professional skincare and facials.",
    keywords: ["esthetician", "skincare", "facials", "skin"],
  },
];

const Explore: React.FC = () => {
  const icon = (
    <IconButton>
      <TuneIcon fontSize="medium" />
    </IconButton>
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Function to filter businesses based on title, description, or keywords
  const filteredBusinesses = businesses.filter((business) =>
    [business.name, business.description, ...business.keywords]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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

      {/* Scrollable Business List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <Box key={business.id} sx={{ padding: "10px" }}>
              {/* Grey Box with Image Icon */}
              <Box
                sx={{
                  width: "100%",
                  height: "300px",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "12px",
                }}
              >
                <ImageIcon fontSize="large" sx={{ color: "#9e9e9e" }} />
              </Box>
              {/* Business Details */}
              <Box sx={{ padding: "10px" }}>
                <Typography fontWeight="bold">{business.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {business.description}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography align="center" sx={{ mt: 2, color: "#9e9e9e" }}>
            No results found.
          </Typography>
        )}
      </Box>
    </MobileLayout>
  );
};

export default Explore;
