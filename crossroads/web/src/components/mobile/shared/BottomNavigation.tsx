import React from "react";
import { Box, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import StoreIcon from "@mui/icons-material/Store";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper to determine if a path is active
  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    return currentPath === path;
  };

  return (
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
      <IconButton 
        onClick={() => navigate("/")} 
        color={isActive("/") ? "primary" : "default"}
      >
        <HomeIcon fontSize="large" />
      </IconButton>
      <IconButton 
        onClick={() => navigate("/search")} 
        color={isActive("/search") ? "primary" : "default"}
      >
        <SearchIcon fontSize="large" />
      </IconButton>
      <IconButton 
        onClick={() => navigate("/add-business")} 
        color={isActive("/add-business") ? "primary" : "default"}
      >
        <AddIcon fontSize="large" />
      </IconButton>
      <IconButton 
        onClick={() => navigate("/messages")} 
        color={isActive("/messages") ? "primary" : "default"}
      >
        <ChatIcon fontSize="large" />
      </IconButton>
      <IconButton 
        onClick={() => navigate("/market")} 
        color={isActive("/market") ? "primary" : "default"}
      >
        <StoreIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default BottomNavigation;