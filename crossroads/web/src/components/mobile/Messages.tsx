import React from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MobileLayout from "./shared/MobileLayout";

const Messages: React.FC = () => {
  return (
    <MobileLayout title="Messages">
      <Box sx={{ flex: 1, width: "100%", padding: "10px", overflowY: "auto" }}>
        <Typography
          sx={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            marginBottom: "5px",
          }}
        >
          Hello! How can I help you?
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", padding: "10px" }}>
        <TextField
          fullWidth
          placeholder="Message here..."
          sx={{ marginRight: "10px" }}
        />
        <IconButton color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </MobileLayout>
  );
};

export default Messages;
