import React from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import StoreIcon from "@mui/icons-material/Store";
import { useNavigate } from "react-router-dom";

const AddBusiness: React.FC = () => {
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
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 20px" }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon fontSize="medium" />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            Business Sign Up
          </Typography>
          <Box width="48px" />
        </Box>

        <Box sx={{ width: "100%", padding: "0 20px", overflowY: "auto" }}>
          <TextField fullWidth placeholder="Business Name" sx={{ marginBottom: "10px" }} />
          <TextField fullWidth placeholder="Business Email" sx={{ marginBottom: "10px" }} />
          <TextField fullWidth placeholder="Keywords" sx={{ marginBottom: "10px" }} />
          <TextField fullWidth placeholder="Location" sx={{ marginBottom: "10px" }} />
          <TextField fullWidth placeholder="Instagram Handle" sx={{ marginBottom: "10px" }} />
          <TextField fullWidth placeholder="Tags" sx={{ marginBottom: "10px" }} />

          <FormControlLabel control={<Checkbox />} label="I am registering this business on behalf of someone else" />
          <FormControlLabel control={<Checkbox />} label="I would like to receive promotional information" />

          <Button fullWidth variant="contained" color="success" sx={{ marginTop: "20px" }}>
            Register Business
          </Button>
        </Box>

        {/* Bottom Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0", borderTop: "1px solid #ddd", backgroundColor: "white", width: "100%" }}>
          <IconButton onClick={() => navigate("/explore")}>
            <HomeIcon fontSize="large" />
          </IconButton>
          <IconButton onClick={() => navigate("/search")}>
            <SearchIcon fontSize="large" />
          </IconButton>
          <IconButton color="primary">
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

export default AddBusiness;