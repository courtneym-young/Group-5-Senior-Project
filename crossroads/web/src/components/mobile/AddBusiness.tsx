import React, { useState } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import MobileLayout from "./shared/MobileLayout";
import { useCreateBusinessAsUser } from "../../helpers/businessHelpers";
import { CreateBusinessAsUserFormData } from "../../types/business-types";
import {BUSINESS_CATEGORIES} from "../../config/BusinessConfig"


const AddBusiness: React.FC = () => {
  const [formData, setFormData] = useState<CreateBusinessAsUserFormData>({
    name: "",
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

  const [keywords, setKeywords] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [actingOnBehalfOfOthers, setActingOnBehalfOfOthers] = useState<boolean>(false);
  const [receivePromotions, setReceivePromotions] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
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
      
      // Create the business using the helper function

      // eslint-disable-next-line react-hooks/rules-of-hooks
      await useCreateBusinessAsUser(formData);
      
      setSuccess(true);
      // Reset form after successful submission
      setFormData({
        name: "",
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register business");
    } finally {
      setLoading(false);
    }
  };

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
          label="Website *"
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
          label="Business Description *"
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
          disabled={loading}
          sx={{ marginTop: "20px", marginBottom: "20px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Register Business"}
        </Button>
      </Box>
    </MobileLayout>
  );
};

export default AddBusiness;