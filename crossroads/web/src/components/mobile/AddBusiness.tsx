import React from "react";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import MobileLayout from "./shared/MobileLayout";

const AddBusiness: React.FC = () => {
  return (
    <MobileLayout title="Businesses">
      <Box sx={{ width: "100%", padding: "0 20px", overflowY: "auto" }}>
        <TextField
          fullWidth
          placeholder="Business Name"
          sx={{ marginBottom: "10px" }}
        />
        <TextField
          fullWidth
          placeholder="Business Email"
          sx={{ marginBottom: "10px" }}
        />
        <TextField
          fullWidth
          placeholder="Keywords"
          sx={{ marginBottom: "10px" }}
        />
        <TextField
          fullWidth
          placeholder="Location"
          sx={{ marginBottom: "10px" }}
        />
        <TextField
          fullWidth
          placeholder="Instagram Handle"
          sx={{ marginBottom: "10px" }}
        />
        <TextField fullWidth placeholder="Tags" sx={{ marginBottom: "10px" }} />

        <FormControlLabel
          control={<Checkbox />}
          label="I am registering this business on behalf of someone else"
        />
        <FormControlLabel
          control={<Checkbox />}
          label="I would like to receive promotional information"
        />

        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{ marginTop: "20px" }}
        >
          Register Business
        </Button>
      </Box>
    </MobileLayout>
  );
};

export default AddBusiness;
