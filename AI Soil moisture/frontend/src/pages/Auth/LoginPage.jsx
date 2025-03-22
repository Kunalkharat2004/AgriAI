import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import GoogleButton from "react-google-button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../http/api";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import app from "../../config/firebase";
import useTokenStore from "../../store/useTokenStore";

// Copyright component
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// Styled components using MUI's styling system
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(14),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

// Firebase auth configuration
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for better UX
  const { setToken, setUserId, setUserRole } = useTokenStore((state) => state);
  const navigate = useNavigate();

  // Mutation for email/password login
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      console.log("Response data:", response.data);
      const { access_token, user_id, role, token, user } = response.data;

      // Use either access_token or token, whichever is available
      const authToken = access_token || token || "";
      const userId = user_id || (user && user.id) || "";
      const userRole = role || (user && user.role) || "";

      console.log(
        "Login successful, token:",
        authToken.substring(0, 10) + "..."
      );
      console.log("User role:", userRole);

      // Store in Zustand
      setToken(authToken);
      setUserId(userId);
      setUserRole(userRole);

      // Also store in localStorage if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem("token", authToken);
        console.log("Token stored in localStorage for remember me");
      }

      toast.success("Login successful!", {
        autoClose: 3000,
      });

      // Redirect based on role
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    },
    onError: () => {
      toast.error("Incorrect email or password", {
        autoClose: 4000,
      });
    },
  });

  // Function for handling Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true); // Set loading state
    try {
      // Try signInWithPopup first, fallback to signInWithRedirect
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // Get Google ID token

      // Send the ID token to the backend for verification
      const response = await fetch(
        "http://localhost:3600/api/users/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Google Sign-In successful!");
        console.log(data);
        const token = data.access_token;
        setToken(token);

        // Extract user role and redirect accordingly
        const role = data.role || (data.user && data.user.role);
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(`Google Sign-In failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during Google Sign-In", error);
      toast.error("Google Sign-In failed!");
    } finally {
      setLoading(false); // Stop loading after the operation
    }
  };

  // Function for handling email/password sign-in
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!emailRef.current.value || !passwordRef.current.value) {
      toast.error("Please fill email and password!", {
        autoClose: 4000,
      });
      return;
    }
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    mutation.mutate({ email, password });
  };

  // Handling remember me option
  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("auth-token");
    }
  };

  return (
    <StyledContainer component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
        </Box>
        <StyledForm noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            inputRef={emailRef}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            inputRef={passwordRef}
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
            }
            label="Remember me"
          />
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleOnSubmit}
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Signing In..." : "Sign In"}
          </StyledButton>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/auth/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </StyledForm>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <ToastContainer />
    </StyledContainer>
  );
}
