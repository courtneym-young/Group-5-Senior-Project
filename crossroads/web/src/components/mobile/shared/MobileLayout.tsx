import React, { ReactNode } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

interface MobileLayoutProps {
  title: string;
  children: ReactNode;
  rightIcon?: ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  title, 
  children, 
  rightIcon 
}) => {
  const navigate = useNavigate();

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
        {/* Top Navigation */}
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
            {title}
          </Typography>
          {rightIcon ? rightIcon : <Box width="48px" />}
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {children}
        </Box>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </Box>
    </Box>
  );
};

export default MobileLayout;