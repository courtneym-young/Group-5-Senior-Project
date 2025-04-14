import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Button,
  CircularProgress,
  IconButton,
  Avatar,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import MobileLayout from "./shared/MobileLayout";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ImageIcon from "@mui/icons-material/Image";
import ShareIcon from "@mui/icons-material/Share";
import BusinessIcon from "@mui/icons-material/Business";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { getFileUrl } from "../../helpers/storageHelpers";
import { 
  BusinessStatusType, 
  BusinessStatusTypes 
} from "../../types/business-types";
import { BUSINESS_STATUS_COLOR_MAPPING } from "../../config/StyleConfig";
import { formatDate } from "../../helpers/timeHelpers";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useFetchBusinessById } from "../../helpers/businessHelpers";

const dataClient = generateClient<Schema>();

// Define the TypeScript interface for business based on the data structure used in BusinessTable

interface UserRelationship {
  isOwner: boolean;
  isSubscribed: boolean;
  currentUserId: string | null;
}

const BusinessDetails: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
     
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userRelationship, setUserRelationship] = useState<UserRelationship>({
    isOwner: false,
    isSubscribed: false,
    currentUserId: null
  });
  
  // Use the enhanced hook to fetch business details with all related data
  const { business, loading, error } = useFetchBusinessById(businessId || '');
  console.log(business)

  // Check if the current user is the owner or subscribed to this business
  useEffect(() => {
    const determineUserRelationship = async () => {
      try {
        // Get current user attributes
        const userAttributes = await fetchUserAttributes();
        const userSub = userAttributes?.sub?.trim() ?? "";
        
        if (!userSub || !business) return;
        
        // Find user with matching profileOwner from userSub
        const usersList = await dataClient.models.User.list({
          filter: { profileOwner: { eq: userSub } }
        });
        
        if (usersList.data && usersList.data.length > 0) {
          const currentUserId = usersList.data[0].id;
          
          // Check if user is the owner
          const isOwner = business.userId === currentUserId;
          
          // Check if user is subscribed
          const subscriptions = await dataClient.models.UserBusinessSubscription.list({
            filter: { 
              businessId: { eq: businessId },
              userId: { eq: currentUserId }
            }
          });
          
          const isSubscribed = subscriptions.data.length > 0;
          
          setUserRelationship({
            isOwner,
            isSubscribed,
            currentUserId
          });
        }
      } catch (err) {
        console.error("Error determining user relationship:", err);
      }
    };

    determineUserRelationship();
  }, [business, businessId]);

  // Load profile image when business data is available
  useEffect(() => {
    const loadProfileImage = async () => {
      if (business?.profilePhoto) {
        try {
          const url = await getFileUrl(business.profilePhoto);
          setImageUrl(url);
        } catch (imgError) {
          console.error("Error loading business image:", imgError);
        }
      }
    };

    if (business) {
      loadProfileImage();
    }
  }, [business]);

  const toggleSubscription = async () => {
    if (!business || !userRelationship.currentUserId) return;
    
    try {
      if (userRelationship.isSubscribed) {
        // Find and delete subscription
        const subscriptions = await dataClient.models.UserBusinessSubscription.list({
          filter: { 
            businessId: { eq: businessId },
            userId: { eq: userRelationship.currentUserId }
          }
        });

        if (subscriptions.data.length > 0) {
          await dataClient.models.UserBusinessSubscription.delete({
            id: subscriptions.data[0].id,
          });
        }
      } else {
        // Create new subscription
        await dataClient.models.UserBusinessSubscription.create({
          businessId: businessId || "",
          userId: userRelationship.currentUserId,
          subscribedAt: new Date().toISOString(),
        });
      }

      setUserRelationship({
        ...userRelationship,
        isSubscribed: !userRelationship.isSubscribed
      });
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const getStatusChipStyles = (status?: BusinessStatusType) => {
    if (!status) return {};

    return {
      backgroundColor: BUSINESS_STATUS_COLOR_MAPPING[status] || BUSINESS_STATUS_COLOR_MAPPING.UNKNOWN
    };
  };

  if (loading) {
    return (
      <MobileLayout title="Business Details">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      </MobileLayout>
    );
  }

  if (error || !business) {
    return (
      <MobileLayout title="Business Details">
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography color="error">{error || "Business not found"}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/")}
          >
            Back to Businesses
          </Button>
        </Box>
      </MobileLayout>
    );
  }

  // Format address
  const formatAddress = () => {
    const location = business.location || {};
    const parts = [
      location.streetAddress,
      location.secondaryAddress,
      [location.city, location.state].filter(Boolean).join(", "),
      location.zip,
    ].filter(Boolean);

    return parts.join(", ");
  };

  return (
    <MobileLayout title={business.name}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Hero Image */}
        <Box
          sx={{
            height: "200px",
            backgroundColor: "#e0e0e0",
            backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!imageUrl && (
            <ImageIcon fontSize="large" sx={{ color: "#9e9e9e" }} />
          )}

          {/* User relationship indicator */}
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              display: "flex",
              gap: 1,
            }}
          >
            {userRelationship.isOwner && (
              <Chip
                icon={<BusinessIcon />}
                label="You own this"
                size="small"
                sx={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            )}
          </Box>

          {/* Action buttons overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              right: 10,
              display: "flex",
              gap: 1,
            }}
          >
            {!userRelationship.isOwner && (
              <IconButton
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.8)" },
                }}
                onClick={toggleSubscription}
                title={userRelationship.isSubscribed ? "Unsubscribe" : "Subscribe"}
              >
                {userRelationship.isSubscribed ? (
                  <FavoriteIcon sx={{ color: "#f44336" }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            )}

            <IconButton
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.8)" },
              }}
            >
              <ShareIcon />
            </IconButton>
          </Box>

          {/* Verified badge */}
          {business.status === BusinessStatusTypes.VERIFIED && (
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <VerifiedIcon sx={{ color: "#1976d2" }} />
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ padding: "20px", flex: 1, overflowY: "auto" }}>
          {/* Title, Status and Updated Date */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              {business.name}
              {business.status === BusinessStatusTypes.VERIFIED && (
                <VerifiedIcon
                  fontSize="small"
                  sx={{ color: "#1976d2", ml: 1, verticalAlign: "middle" }}
                />
              )}
            </Typography>
            
            <Chip 
              label={business.status || "UNKNOWN"}
              size="small"
              sx={getStatusChipStyles(business.status)}
            />
          </Box>
          
          {/* Last updated date */}
          {business.updatedAt && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Last updated: {formatDate(business.updatedAt)}
            </Typography>
          )}

          {/* Subscription status for non-owners */}
          {!userRelationship.isOwner && userRelationship.currentUserId && (
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={userRelationship.isSubscribed ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                label={userRelationship.isSubscribed ? "Subscribed" : "Not subscribed"}
                size="small"
                color={userRelationship.isSubscribed ? "primary" : "default"}
                sx={{ mb: 1 }}
                onClick={toggleSubscription}
              />
              {userRelationship.isSubscribed && (
                <Typography variant="body2" color="text.secondary">
                  You will receive updates from this business.
                </Typography>
              )}
            </Box>
          )}

          {/* Owner info */}
          {business.user && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: "#1976d2" }}>
                {business.user.firstName?.charAt(0) ||
                  business.user.username?.charAt(0) ||
                  "?"}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Owned by{" "}
                {userRelationship.isOwner ? (
                  <span style={{ fontWeight: "bold" }}>you</span>
                ) : (
                  <a href={`/admin/users/${business.user.id}`}>
                    {business.user?.firstName || "N/A"} {business.user?.lastName || "N/A"}
                  </a>
                )}
              </Typography>
            </Box>
          )}

          {/* Categories */}
          {business.category && business.category.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
              {business.category.map((cat: string, idx: number) => (
                <Chip
                  key={idx}
                  label={cat}
                  size="small"
                  sx={{
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    fontWeight: "medium",
                  }}
                />
              ))}

              {business.isMinorityOwned && (
                <Chip
                  label="Minority-Owned"
                  size="small"
                  sx={{
                    backgroundColor: "#e8f5e9",
                    color: "#2e7d32",
                    fontWeight: "medium",
                  }}
                />
              )}
            </Box>
          )}

          {/* Description */}
          <Typography variant="body1" sx={{ mb: 3 }}>
            {business.description || "No description available."}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Contact Information */}
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Contact Information
          </Typography>

          {/* Address */}
          {business.location && (
            <Box sx={{ display: "flex", mb: 2 }}>
              <LocationOnIcon sx={{ color: "#757575", mr: 2 }} />
              <Box>
                <Typography variant="body1">{formatAddress()}</Typography>
                <Button
                  variant="text"
                  sx={{ p: 0, mt: 0.5, textTransform: "none" }}
                  onClick={() => {
                    const address = encodeURIComponent(formatAddress());
                    window.open(
                      `https://maps.google.com/?q=${address}`,
                      "_blank"
                    );
                  }}
                >
                  View on map
                </Button>
              </Box>
            </Box>
          )}

          {/* Phone */}
          {business.phone && (
            <Box sx={{ display: "flex", mb: 2 }}>
              <PhoneIcon sx={{ color: "#757575", mr: 2 }} />
              <Typography variant="body1">
                <a
                  href={`tel:${business.phone}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {business.phone}
                </a>
              </Typography>
            </Box>
          )}

          {/* Email */}
          {business.email && (
            <Box sx={{ display: "flex", mb: 2 }}>
              <EmailIcon sx={{ color: "#757575", mr: 2 }} />
              <Typography variant="body1">
                <a
                  href={`mailto:${business.email}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {business.email}
                </a>
              </Typography>
            </Box>
          )}

          {/* Website */}
          {business.website && (
            <Box sx={{ display: "flex", mb: 2 }}>
              <LanguageIcon sx={{ color: "#757575", mr: 2 }} />
              <Typography variant="body1">
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {business.website.replace(/^https?:\/\//, "")}
                </a>
              </Typography>
            </Box>
          )}

          {/* Hours */}
          {business.hours && (
            <Box sx={{ display: "flex", mb: 2 }}>
              <AccessTimeIcon sx={{ color: "#757575", mr: 2 }} />
              <Typography variant="body1">{business.hours}</Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Products section placeholder */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Products
            </Typography>
            
            {userRelationship.isOwner && (
              <Button variant="contained" size="small">
                Add Product
              </Button>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              bgcolor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Typography color="text.secondary">Products coming soon</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Reviews section placeholder */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Reviews</span>
            {!userRelationship.isOwner && (
              <Button variant="contained" size="small">
                Write a Review
              </Button>
            )}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              bgcolor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Typography color="text.secondary">No reviews yet</Typography>
          </Box>
        </Box>
      </Box>
    </MobileLayout>
  );
};

export default BusinessDetails;