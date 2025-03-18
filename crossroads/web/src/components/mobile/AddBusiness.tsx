import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  LinearProgress,
  SelectChangeEvent,
} from "@mui/material";
import MobileLayout from "./shared/MobileLayout";
import { CreateBusinessAsUserFormData } from "../../types/business-types";
import { BUSINESS_CATEGORIES } from "../../config/BusinessConfig";
import { uploadBusinessImage } from "../../helpers/storageHelpers";
import { generateClient } from "aws-amplify/data";
import { useFetchUserById } from "../../helpers/userHelpers";
import type { Schema } from "../../../amplify/data/resource";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useCreateBusinessAsUser } from "../../helpers/businessHelpers";

const client = generateClient<Schema>();

// Modified function to create business directly instead of using the helper
const AddBusiness: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [formData, setFormData] = useState<CreateBusinessAsUserFormData & { userId: string }>({
    name: "",
    email: "",
    userId: "",
    description: "",
    category: [],
    location: {
      streetAddress: "",
      city: "",
      state: "",
      zip: "",
      secondaryAddress: "",
    },
    phone: "",
    website: "",
    hours: "",
    profilePhoto: "",
    isMinorityOwned: false,
  });

  const [keywords, setKeywords] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [actingOnBehalfOfOthers, setActingOnBehalfOfOthers] = useState<boolean>(false);
  const [receivePromotions, setReceivePromotions] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetchingUser, setFetchingUser] = useState<boolean>(true);
  
  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current user's ID using attributes
  useEffect(() => {
    const getUserId = async () => {
      setFetchingUser(true);
      try {
        const attributes = await fetchUserAttributes();
        if (attributes.sub) {
          // Find user with matching profileOwner
          const usersList = await client.models.User.list({
            filter: {
              profileOwner: {
                eq: attributes.sub,
              },
            },
          });

          if (usersList.data && usersList.data.length > 0) {
            const uid = usersList.data[0].id;
            setUserId(uid);
            
            // Update formData with the user ID
            setFormData(prev => ({
              ...prev,
              userId: uid
            }));
          } else {
            // setError("User profile not found");
          }
        }
      } catch (err) {
        console.error("Error fetching user ID:", err);
        setError("Failed to fetch user details");
      } finally {
        setFetchingUser(false);
      }
    };

    getUserId();
  }, []);

  // Fetch user details after we have their ID
  const { loading: userLoading } = useFetchUserById(userId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "actingOnBehalfOfOthers") {
      setActingOnBehalfOfOthers(checked);
    } else if (name === "receivePromotions") {
      setReceivePromotions(checked);
    } else if (name === "isMinorityOwned") {
      setFormData({
        ...formData,
        isMinorityOwned: checked,
      });
    }
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    
    const selectedCategories = typeof value === 'string' ? value.split(',') : value;
    setTags(selectedCategories);
    
    // Update formData with selected categories
    setFormData({
      ...formData,
      category: selectedCategories,
    });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setError("Please select an image file");
        return;
      }
      
      setSelectedImage(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to clear selected image
  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate that userId exists before submitting
      // if (!formData.userId) {
      //   throw new Error("User information not available. Please try again later.");
      // }
      
      // Validate required fields
      if (!formData.name) {
        throw new Error("Business name is required");
      }
      
      if (!formData.email) {
        throw new Error("Business email is required");
      }
      
      if (!formData.phone) {
        throw new Error("Phone number is required");
      }
      
      if (!formData.location.city || !formData.location.state) {
        throw new Error("City and state are required");
      }
      
      // Add keywords to category if not already included
      if (keywords) {
        const keywordArray = keywords.split(",").map(k => k.trim());
        const updatedCategory = [...(formData.category || [])];
        
        keywordArray.forEach(keyword => {
          if (!updatedCategory.includes(keyword)) {
            updatedCategory.push(keyword);
          }
        });
        
        formData.category = updatedCategory;
      }
      
      // Handle image upload if present
      let updatedFormData = { ...formData };
      if (selectedImage) {
        try {
          // Generate a unique business ID for the upload path
          const tempBusinessId = `temp-${Date.now()}`;
          
          // Upload the image
          const imagePath = await uploadBusinessImage(
            selectedImage,
            tempBusinessId,
            (progress) => {
              const percentage = Math.round((progress.transferredBytes / progress.totalBytes) * 100);
              setUploadProgress(percentage);
            }
          );
          
          // Update form data with the image path
          updatedFormData = {
            ...updatedFormData,
            profilePhoto: imagePath
          };
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error("Failed to upload image. Please try again.");
        }
      }
      
      // Create the business using our direct function instead of the helper
      await useCreateBusinessAsUser(updatedFormData);
      
      setSuccess(true);
      // Reset form after successful submission
      setFormData({
        name: "",
        userId: "",
        email: "",
        description: "",
        category: [],
        location: {
          streetAddress: "",
          city: "",
          state: "",
          zip: "",
          secondaryAddress: "",
        },
        phone: "",
        website: "",
        hours: "",
        profilePhoto: "",
        isMinorityOwned: false,
      });
      setKeywords("");
      setTags([]);
      setActingOnBehalfOfOthers(false);
      setReceivePromotions(false);
      clearSelectedImage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register business");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching user data
  if (fetchingUser) {
    return (
      <MobileLayout title="Add Business">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading user data...
          </Typography>
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Add Business">
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ width: "100%", padding: "0 20px", overflowY: "auto" }}
      >
        {error && <Alert severity="error" sx={{ marginBottom: "10px" }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ marginBottom: "10px" }}>Business registered successfully! It is now pending review.</Alert>}
        
        <TextField
          required
          fullWidth
          name="name"
          label="Business Name"
          placeholder="Business Name"
          value={formData.name}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
        />
        
        <TextField
          required
          fullWidth
          name="email"
          label="Business Email"
          placeholder="Business Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
        />
        
        <TextField
          fullWidth
          name="keywords"
          label="Keywords (comma separated)"
          placeholder="Keywords"
          value={keywords}
          onChange={handleKeywordsChange}
          sx={{ marginBottom: "10px" }}
          helperText="Additional keywords for the business"
        />
        
        <FormControl fullWidth sx={{ marginBottom: "10px" }}>
          <InputLabel id="category-select-label">Business Categories</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            multiple
            value={tags}
            onChange={handleCategoryChange}
            input={<OutlinedInput id="select-multiple-chip" label="Business Categories" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {BUSINESS_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Business Image Upload Section */}
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Business Profile Image</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
          {imagePreview ? (
            <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
              <img 
                src={imagePreview} 
                alt="Business profile preview" 
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
              />
              <Button 
                variant="outlined" 
                color="error" 
                size="small" 
                onClick={clearSelectedImage}
                sx={{ mt: 1 }}
              >
                Remove Image
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              component="label"
              sx={{ width: '100%', height: '120px', display: 'flex', flexDirection: 'column' }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Click to upload business image
              </Typography>
              <Typography variant="caption" color="text.secondary">
                JPEG, PNG, WebP • Max 5MB
              </Typography>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </Button>
          )}
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                Uploading: {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Location</Typography>
        
        <TextField
          fullWidth
          name="location.streetAddress"
          label="Street Address"
          placeholder="Street Address"
          value={formData.location.streetAddress}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
        />
        
        <TextField
          fullWidth
          name="location.secondaryAddress"
          label="Address Line 2 (Optional)"
          placeholder="Address Line 2"
          value={formData.location.secondaryAddress}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
        />
        
        <TextField
          required
          fullWidth
          name="location.city"
          label="City"
          placeholder="City"
          value={formData.location.city}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
        />
        
        <TextField
          required
          fullWidth
          name="location.state"
          label="State"
          placeholder="State"
          value={formData.location.state}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
        />
        
        <TextField
          fullWidth
          name="location.zip"
          label="ZIP Code"
          placeholder="ZIP Code"
          value={formData.location.zip}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
        />
        
        <TextField
          required
          fullWidth
          name="phone"
          label="Phone Number"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
        />
        
        <TextField
          fullWidth
          name="website"
          label="Website"
          placeholder="Website"
          value={formData.website}
          onChange={handleInputChange}
          sx={{ marginBottom: "10px" }}
        />
        
        <TextField
          fullWidth
          multiline
          rows={3}
          name="description"
          label="Business Description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          sx={{ marginBottom: "15px" }}
        />
        
        <FormControlLabel
          control={
            <Checkbox 
              name="isMinorityOwned"
              checked={formData.isMinorityOwned}
              onChange={handleCheckboxChange}
            />
          }
          label="This is a minority-owned business"
        />
        
        <FormControlLabel
          control={
            <Checkbox 
              name="actingOnBehalfOfOthers"
              checked={actingOnBehalfOfOthers}
              onChange={handleCheckboxChange}
            />
          }
          label="I am registering this business on behalf of someone else"
        />
        
        <FormControlLabel
          control={
            <Checkbox 
              name="receivePromotions"
              checked={receivePromotions}
              onChange={handleCheckboxChange}
            />
          }
          label="I would like to receive promotional information"
        />

        <Button
          fullWidth
          variant="contained"
          color="success"
          type="submit"
          disabled={loading || userLoading}
          sx={{ marginTop: "20px", marginBottom: "20px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Register Business"}
        </Button>
      </Box>
    </MobileLayout>
  );
};

export default AddBusiness;