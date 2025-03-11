import React from "react";
import { Box, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import MobileLayout from "./shared/MobileLayout";

const Market: React.FC = () => {
  return (
    <MobileLayout title="Market">
      {/* Market Feature Video Placeholder */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#4caf50",
          height: "200px",
          margin: "10px 20px",
          borderRadius: "10px",
        }}
      >
        <PlayCircleOutlineIcon sx={{ fontSize: "50px", color: "white" }} />
      </Box>

      {/* Hot Deals Placeholder */}
      <Typography variant="h6" sx={{ padding: "10px 20px" }}>
        Hot Deals
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          padding: "10px",
        }}
      >
        {[1, 2, 3].map((item) => (
          <Box
            key={item}
            sx={{
              width: "100px",
              height: "120px",
              backgroundColor: "#e0e0e0",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: "12px" }}>Item #{item}</Typography>
            <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
              $19.99
            </Typography>
          </Box>
        ))}
      </Box>
    </MobileLayout>
  );
};

export default Market;
