import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import MobileLayout from "./shared/MobileLayout";

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const icon = (
    <IconButton>
      <TuneIcon fontSize="medium" />
    </IconButton>
  );

  return (
    <MobileLayout title="Search" rightIcon={icon}>
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
            <Typography
              key={index}
              sx={{ padding: "10px", borderBottom: "1px solid #ddd" }}
            >
              {result}
            </Typography>
          ))}
      </Box>
    </MobileLayout>
  );
};

export default Search;
