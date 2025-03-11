import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import StoreIcon from "@mui/icons-material/Store";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useNavigate } from "react-router-dom";

const Market: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", backgroundColor: "#f5f5f5" }}>
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
            Market
          </Typography>
          <Box width="48px" />
        </Box>

        {/* Market Feature Video Placeholder */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#4caf50", height: "200px", margin: "10px 20px", borderRadius: "10px" }}>
          <PlayCircleOutlineIcon sx={{ fontSize: "50px", color: "white" }} />
        </Box>

        {/* Hot Deals Placeholder */}
        <Typography variant="h6" sx={{ padding: "10px 20px" }}>
          Hot Deals
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", padding: "10px" }}>
          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ width: "100px", height: "120px", backgroundColor: "#e0e0e0", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ fontSize: "12px" }}>Item #{item}</Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>$19.99</Typography>
            </Box>
          ))}
        </Box>

        {/* Bottom Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0", borderTop: "1px solid #ddd", backgroundColor: "white", width: "100%" }}>
          <IconButton onClick={() => navigate("/")}>
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
          <IconButton color="primary">
            <StoreIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Market;