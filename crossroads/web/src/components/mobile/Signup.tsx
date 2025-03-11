import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
// import GoogleIcon from "@mui/icons-material/Google";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import AppleIcon from "@mui/icons-material/Apple";
// import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
// import { initializeApp } from "firebase/app";

// Firebase configuration (Replace with actual Firebase config if used in the future)
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// Initialize Firebase (Commented Out Until Ready)
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

const Signup: React.FC = () => {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    subscribeNewsletter: false,
    showPassword: false,
  });

  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation regex (8+ chars, 1 uppercase, 1 number, 1 special char)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Simulated database for uniqueness check
  // const existingEmails = ["test@example.com", "user1@example.com"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setFormState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!emailRegex.test(formState.email)) {
      setError("Invalid email format.");
      return;
    }
  
    if (!passwordRegex.test(formState.password)) {
      setError(
        "Password must be at least 8 characters, contain 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }
  
    if (formState.password !== formState.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    // Retrieve existing users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
  
    // Check if the email already exists
    if (storedUsers.some((user: any) => user.email === formState.email)) {
      setError("An account with this email already exists.");
      return;
    }
  
    // Save the new user to localStorage
    const newUser = {
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.email,
      password: formState.password, // ⚠️ In real apps, NEVER store plain text passwords! Use hashing.
    };
  
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));
  
    setError("");
    setOpenSnackbar(true);
  };
  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw", // Ensures full width
        backgroundColor: "#f9f9f9", // Light background
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "375px", // Standard mobile app width
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow effect
        }}
      >
        {/* Title */}
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          User Sign Up
        </Typography>
  
        <form onSubmit={handleSignup} style={{ width: "100%" }}>
          <TextField fullWidth label="First Name" name="firstName" value={formState.firstName} onChange={handleInputChange} required margin="normal" />
          <TextField fullWidth label="Last Name" name="lastName" value={formState.lastName} onChange={handleInputChange} required margin="normal" />
          <TextField fullWidth label="Email" type="email" name="email" value={formState.email} onChange={handleInputChange} required margin="normal" />
  
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={formState.showPassword ? "text" : "password"}
            value={formState.password}
            onChange={handleInputChange}
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
  
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={formState.showPassword ? "text" : "password"}
            value={formState.confirmPassword}
            onChange={handleInputChange}
            required
            margin="normal"
          />
  
          <FormControlLabel
            control={<Checkbox name="subscribeNewsletter" checked={formState.subscribeNewsletter} onChange={handleInputChange} />}
            label="I would like to receive your newsletter and other promotional information."
          />
  
          {error && <Typography color="error">{error}</Typography>}
  
          {/* Sign Up Button */}
          <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2, borderRadius: "24px", padding: "12px" }}>
            Sign Up
          </Button>
  
          <Typography align="center" sx={{ mt: 2 }}>
            <Link onClick={() => navigate("/login")} color="success" underline="hover" style={{ cursor: "pointer" }}>
              Login
            </Link>
          </Typography>
        </form>
      </Box>
  
      {/* Account Confirmation Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Account created successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;