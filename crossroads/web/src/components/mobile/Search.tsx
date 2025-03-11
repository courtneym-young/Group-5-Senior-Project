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
import { useNavigate } from "react-router-dom";

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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
      {/* Mobile Container (Now Fully Centered) */}
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
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Top Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 20px" }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon fontSize="medium" />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            Search
          </Typography>
          <IconButton>
            <TuneIcon fontSize="medium" />
          </IconButton>
        </Box>

        {/* Search Bar */}
        <Box sx={{ width: "100%", padding: "0 20px", marginBottom: "10px" }}>
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

        {/* Placeholder Search Results */}
        <Box sx={{ flex: 1, width: "100%", padding: "10px", overflowY: "auto" }}>
          {Array(5)
            .fill("Search result")
            .map((result, index) => (
              <Typography key={index} sx={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                {result}
              </Typography>
            ))}
        </Box>

        {/* Bottom Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "10px 0",
            borderTop: "1px solid #ddd",
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <IconButton onClick={() => navigate("/")}>
            <HomeIcon fontSize="large" />
          </IconButton>
          <IconButton color="primary">
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

export default Search;