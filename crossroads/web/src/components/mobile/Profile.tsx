import React from "react";
import { Box, Typography, Button, Avatar, Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MobileLayout from "./shared/MobileLayout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useFetchUserAttributes } from "../../helpers/userHelpers"; 

const Profile: React.FC = () => {
    const { userAttributes, loading, error } = useFetchUserAttributes();
    const { signOut } = useAuthenticator((context) => [context.signOut]);
  
    const handleSignOut = () => {
      signOut();
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    return (
      <MobileLayout title="Profile">
        <Box sx={{ width: "100%", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Profile Header */}
          <Avatar 
            sx={{ width: 80, height: 80, bgcolor: "primary.main", marginBottom: 2 }}
          >
            {userAttributes?.username ? userAttributes.username.charAt(0).toUpperCase() : "U"}
          </Avatar>
          
          <Typography variant="h6" fontWeight="bold">
            {userAttributes?.name || userAttributes?.username || "User"}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {userAttributes?.email || "No email provided"}
          </Typography>
          
          <Divider sx={{ width: "100%", mb: 2 }} />
          
          {/* Profile Options */}
          <List sx={{ width: "100%" }}>
            <ListItem 
              component="button" // Updated here
              sx={{ borderRadius: "10px", mb: 1 }}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="My Account" />
            </ListItem>
            
            <ListItem 
              component="button" // Updated here
              sx={{ borderRadius: "10px", mb: 1 }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            
            <ListItem 
              component="button" // Updated here
              sx={{ borderRadius: "10px", mb: 1 }}
            >
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Help & Support" />
            </ListItem>
          </List>
          
          <Box sx={{ mt: "auto", width: "100%", padding: "20px 0" }}>
            <Button 
              variant="outlined" 
              color="error" 
              fullWidth 
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
              sx={{ borderRadius: "10px", padding: "10px" }}
            >
              Log Out
            </Button>
          </Box>
        </Box>
      </MobileLayout>
    );
  };
  
  export default Profile;