import React from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import StoreIcon from "@mui/icons-material/Store";
import { useNavigate } from "react-router-dom";

const Messages: React.FC = () => {
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
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 20px" }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon fontSize="medium" />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            Messages
          </Typography>
          <Box width="48px" />
        </Box>

        <Box sx={{ flex: 1, width: "100%", padding: "10px", overflowY: "auto" }}>
          <Typography sx={{ padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "10px", marginBottom: "5px" }}>
            Hello! How can I help you?
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", padding: "10px" }}>
          <TextField fullWidth placeholder="Message here..." sx={{ marginRight: "10px" }} />
          <IconButton color="primary">
            <SendIcon />
          </IconButton>
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
          <IconButton color="primary">
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

export default Messages;