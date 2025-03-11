import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TuneIcon from "@mui/icons-material/Tune";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import StoreIcon from "@mui/icons-material/Store";
import ImageIcon from "@mui/icons-material/Image";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Function to filter businesses based on title, description, or keywords
  const filteredBusinesses = businesses.filter((business) =>
    [business.name, business.description, ...business.keywords]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Mobile App Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "375px",
          height: "800px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Navigation (Back & Filter) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon fontSize="medium" />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            Businesses
          </Typography>
          <IconButton>
            <TuneIcon fontSize="medium" />
          </IconButton>
        </Box>

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

        {/* Bottom Navigation Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "10px 0",
            borderTop: "1px solid #ddd",
            backgroundColor: "white",
            boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <IconButton color="primary" onClick={() => navigate("/explore")}>
            <HomeIcon fontSize="large" />
          </IconButton>
          <IconButton onClick={() => navigate("/search")}>
            <SearchIcon fontSize="large" />
          </IconButton>
          <IconButton onClick={() => navigate("/add-business")}>
            <AddIcon fontSize="large" />
          </IconButton>
          <IconButton onClick={() => navigate("/messages")}>
            <ChatIcon fontSize="large" />
          </IconButton>
          <IconButton onClick={() => navigate("/market")}>
            <StoreIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Explore;