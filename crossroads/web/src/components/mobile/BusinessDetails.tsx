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
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { getFileUrl } from "../../helpers/storageHelpers";
import {
  BusinessStatusType,
  BusinessStatusTypes,
} from "../../types/business-types";
import { BUSINESS_STATUS_COLOR_MAPPING } from "../../config/StyleConfig";
import { formatDate } from "../../helpers/timeHelpers";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useFetchBusinessById } from "../../helpers/businessHelpers";
import { ReviewsSection } from "./AddBusinessReviewSection";
import ProductForm from "./ProductForm";
import BusinessPostForm from "./BusinessPostForm";

const dataClient = generateClient<Schema>();

// Define the TypeScript interface for business based on the data structure used in BusinessTable

interface UserRelationship {
  isOwner: boolean;
  isSubscribed: boolean;
  currentUserId: string | null;
  userRole: "owner" | "subscriber" | "viewer";
}

const BusinessDetails: React.FC = () => {
  const [openProductForm, setOpenProductForm] = useState(false);
  const [openPostForm, setOpenPostForm] = useState(false);
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [postImages, setPostImages] = useState<Record<string, string[]>>({});
  const [productImages, setProductImages] = useState<Record<string, string>>(
    {}
  );
  const [userRelationship, setUserRelationship] = useState<UserRelationship>({
    isOwner: false,
    isSubscribed: false,
    currentUserId: null,
    userRole: "viewer",
  });

  // Use the enhanced hook to fetch business details with all related data
  const { business, loading, error, refetch } = useFetchBusinessById(businessId || "");

  // Check if the current user is the owner or subscribed to this business
  useEffect(() => {
    const determineUserRelationship = async () => {
      try {
        // Get current user attributes
        const userAttributes = await fetchUserAttributes();
        const userSub = userAttributes?.sub?.trim() ?? "";

        if (!userSub || !business) {
          return;
        }

        // Find user with matching profileOwner from userSub
        const usersList = await dataClient.models.User.list({
          filter: { profileOwner: { contains: userSub } },
        });

        if (usersList.data && usersList.data.length > 0) {
          const currentUserId = usersList.data[0].id;

          // Check if user is the owner
          const isOwner = business.userId === currentUserId;

          // Check if user is subscribed
          const subscriptions =
            await dataClient.models.UserBusinessSubscription.list({
              filter: {
                businessId: { eq: businessId },
                userId: { eq: currentUserId },
              },
            });

          const isSubscribed = subscriptions.data.length > 0;

          // Determine user role
          let userRole: "owner" | "subscriber" | "viewer" = "viewer";
          if (isOwner) {
            userRole = "owner";
          } else if (isSubscribed) {
            userRole = "subscriber";
          }

          setUserRelationship({
            isOwner,
            isSubscribed,
            currentUserId,
            userRole,
          });
        }
      } catch (err) {
        console.error("Error determining user relationship:", err);
      }
    };

    determineUserRelationship();
  }, [business, businessId]);

  const handleOpenProductForm = () => {
    setOpenProductForm(true);
  };

  const handleCloseProductForm = () => {
    setOpenProductForm(false);
  };

  const handleOpenPostForm = () => {
    setOpenPostForm(true);
  };

  const handleClosePostForm = () => {
    setOpenPostForm(false);
  };

  // Load profile image when business data is available
  // Load all images when business data is available
  useEffect(() => {
    const loadImages = async () => {
      if (!business) return;

      // Load profile image
      if (business.profilePhoto) {
        try {
          const url = await getFileUrl(business.profilePhoto);
          setImageUrl(url);
        } catch (imgError) {
          console.error("Error loading business image:", imgError);
        }
      }

      // Load post images
      if (business.businessOwnerPosts) {
        const postImagesMap: Record<string, string[]> = {};
        for (const post of business.businessOwnerPosts) {
          if (post.images && post.images.length > 0) {
            try {
              const urls = await Promise.all(
                post.images.map((imgPath) => getFileUrl(imgPath))
              );
              postImagesMap[post.id] = urls;
            } catch (error) {
              console.error("Error loading post images:", error);
            }
          }
        }
        setPostImages(postImagesMap);
      }

      // Load product images
      if (business.businessProducts) {
        const productImagesMap: Record<string, string> = {};
        for (const product of business.businessProducts) {
          if (product.productImage) {
            try {
              const url = await getFileUrl(product.productImage);
              productImagesMap[product.id] = url;
            } catch (error) {
              console.error("Error loading product image:", error);
            }
          }
        }
        setProductImages(productImagesMap);
      }
    };

    loadImages();
  }, [business]);

  const toggleSubscription = async () => {
    if (!business || !userRelationship.currentUserId) {
      return;
    }

    try {
      if (userRelationship.isSubscribed) {
        // Find and delete subscription
        const subscriptions =
          await dataClient.models.UserBusinessSubscription.list({
            filter: {
              businessId: { eq: businessId },
              userId: { eq: userRelationship.currentUserId },
            },
          });

        if (subscriptions.data.length > 0) {
          await dataClient.models.UserBusinessSubscription.delete({
            id: subscriptions.data[0].id,
          });
        }

        setUserRelationship({
          ...userRelationship,
          isSubscribed: false,
          userRole: "viewer",
        });
      } else {
        // Create new subscription
        await dataClient.models.UserBusinessSubscription.create({
          businessId: businessId || "",
          userId: userRelationship.currentUserId,
          subscribedAt: new Date().toISOString(),
        });

        setUserRelationship({
          ...userRelationship,
          isSubscribed: true,
          userRole: "subscriber",
        });
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const getStatusChipStyles = (status?: BusinessStatusType) => {
    if (!status) {
      return {};
    }

    return {
      backgroundColor:
        BUSINESS_STATUS_COLOR_MAPPING[status] ||
        BUSINESS_STATUS_COLOR_MAPPING.UNKNOWN,
    };
  };

  const getUserBadge = () => {
    switch (userRelationship.userRole) {
      case "owner":
        return (
          <Chip
            icon={<BusinessIcon />}
            label="Owner"
            size="small"
            sx={{
              backgroundColor: "#FFD700", // Gold color for owners
              color: "#333",
              fontWeight: "bold",
            }}
          />
        );
      case "subscriber":
        return (
          <Chip
            icon={<FavoriteIcon />}
            label="Subscriber"
            size="small"
            sx={{
              backgroundColor: "#8c9eff", // Purple/blue for subscribers
              color: "white",
              fontWeight: "bold",
            }}
          />
        );
      case "viewer":
      default:
        return (
          <Chip
            icon={<VisibilityIcon />}
            label="Viewer"
            size="small"
            sx={{
              backgroundColor: "#e0e0e0", // Gray for viewers
              color: "#555",
              fontWeight: "medium",
            }}
          />
        );
    }
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

          {/* User badge */}
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              display: "flex",
              gap: 1,
            }}
          >
            {getUserBadge()}
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
                title={
                  userRelationship.isSubscribed ? "Unsubscribe" : "Subscribe"
                }
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
              <Button
                variant={
                  userRelationship.isSubscribed ? "contained" : "outlined"
                }
                size="small"
                startIcon={
                  userRelationship.isSubscribed ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )
                }
                onClick={toggleSubscription}
                sx={{ mb: 1 }}
              >
                {userRelationship.isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
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
                  <a>
                    {business.user?.firstName || "N/A"}{" "}
                    {business.user?.lastName || "N/A"}
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

          {/* Owner Posts Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Recent Updates
            </Typography>

            {userRelationship.isOwner && (
              <Button
                variant="contained"
                size="small"
                onClick={handleOpenPostForm}
              >
                New Post
              </Button>
            )}
          </Box>

          {business.businessOwnerPosts &&
          business.businessOwnerPosts.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              {business.businessOwnerPosts.map((post) => (
                <Paper key={post.id} sx={{ p: 2, mb: 2, borderRadius: "8px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      src={post.user?.profilePhoto}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    >
                      {post.user?.firstName?.charAt(0) ||
                        post.user?.username?.charAt(0) ||
                        "?"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {post.user?.firstName} {post.user?.lastName}
                        {post.user?.username && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ ml: 1, color: "text.secondary" }}
                          >
                            @{post.user.username}
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(post.createdAt || "")}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {post.content}
                  </Typography>

                  {postImages[post.id] && postImages[post.id].length > 0 && (
                    <Box
                      sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      {postImages[post.id].map((img, idx) => (
                        <Box
                          key={idx}
                          component="img"
                          src={img}
                          sx={{
                            width:
                              postImages[post.id].length === 1
                                ? "100%"
                                : "calc(50% - 4px)",
                            borderRadius: "4px",
                            maxHeight: "200px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                bgcolor: "#f5f5f5",
                borderRadius: "8px",
                mb: 3,
              }}
            >
              <Typography color="text.secondary">No updates yet</Typography>
            </Box>
          )}

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

          {/* Products section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Products
            </Typography>

            {userRelationship.isOwner && (
              <Button
                variant="contained"
                size="small"
                onClick={handleOpenProductForm}
              >
                Add Product
              </Button>
            )}
          </Box>

          {business.businessProducts && business.businessProducts.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {business.businessProducts.map((product) => (
                <Grid item xs={12} sm={6} key={product.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={productImages[product.id] || ""}
                      alt={product.productName}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{ fontWeight: "medium" }}
                        >
                          {product.productName}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="primary"
                          fontWeight="bold"
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                      </Box>

                      {product.productDescription && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {product.productDescription}
                        </Typography>
                      )}

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ShoppingCartIcon />}
                        sx={{ mt: 2 }}
                      >
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                bgcolor: "#f5f5f5",
                borderRadius: "8px",
                mb: 3,
              }}
            >
              <Typography color="text.secondary">
                No products available
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Review Section */}
          <ReviewsSection
            business={business}
            userRelationship={userRelationship}
            refreshBusiness={refetch}
          />
          {userRelationship.isOwner && (
            <ProductForm
              userId={userRelationship.currentUserId || ""}
              businessId={business.id}
              open={openProductForm}
              onClose={() => {
                handleCloseProductForm();
                refetch(); // Refresh data after form closes
              }}
            />
          )}

          {userRelationship.isOwner && business.user && (
            <BusinessPostForm
              businessId={business.id}
              userId={userRelationship.currentUserId || ""}
              userProfile={{
                firstName: business.user?.firstName,
                lastName: business.user?.lastName,
                username: business.user?.username,
                profilePhoto: business.user?.profilePhoto,
              }}
              open={openPostForm}
              onClose={() => {
                handleClosePostForm();
                refetch(); // Refresh data after form closes
              }}
            />
          )}
        </Box>
      </Box>
    </MobileLayout>
  );
};

export default BusinessDetails;
