import { useRef, useState } from "react";
import { IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../http/api";
import { useNavigate } from "react-router-dom";
import useTokenStore from "../../store/useTokenStore";

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

const theme = createTheme();

export default function SignUp() {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [role, setRole] = useState("farmer");
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [languages, setLanguages] = useState("");
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const { setToken, setUserId, setUserRole } = useTokenStore((state) => state);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      const token = response.data.access_token;
      const userId = response.data.user_id;
      const userRole = response.data.role;
      setToken(token);
      setUserId(userId);
      setUserRole(userRole || "");
      navigate("/");
    },
    onError: () => {
      toast.error("Something went wrong!", {
        autoClose: 4000,
      });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password || !firstName || !lastName) {
      toast.error("Please fill all fields!", {
        autoClose: 4000,
      });
      return;
    }

    const name = `${firstName} ${lastName}`;
    const isWithPhoto = Boolean(photoFile);
    
    if (isWithPhoto) {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("password", password);
      form.append("role", role);
      form.append("photo", photoFile);
      if (role === "expert") {
        form.append("expertProfile[specialization]", specialization);
        form.append(
          "expertProfile[experienceYears]",
          String(Number(experienceYears) || 0)
        );
        languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean)
          .forEach((lang, idx) =>
            form.append(`expertProfile[languages][${idx}]`, lang)
          );
        form.append("expertProfile[availability]", availability);
        form.append("expertProfile[location]", location);
      }
      mutation.mutate(form);
    } else {
      const payload = { email, password, name, role };
      if (role === "expert") {
        payload.expertProfile = {
          specialization,
          experienceYears: Number(experienceYears) || 0,
          languages: languages
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean),
          availability,
          location,
        };
      }
      mutation.mutate(payload);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  inputRef={firstNameRef}
                  autoComplete="fname"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  inputRef={lastNameRef}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar src={photoPreview || undefined} alt="Profile" />
                  <label htmlFor="upload-photo">
                    <input
                      style={{ display: "none" }}
                      id="upload-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setPhotoFile(f);
                        if (f) {
                          const reader = new FileReader();
                          reader.onload = () =>
                            setPhotoPreview(
                              typeof reader.result === "string" ? reader.result : ""
                            );
                          reader.readAsDataURL(f);
                        } else {
                          setPhotoPreview("");
                        }
                      }}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      Upload profile photo (optional)
                    </Typography>
                  </label>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputRef={emailRef}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant={role === "farmer" ? "contained" : "outlined"}
                    onClick={() => setRole("farmer")}
                  >
                    Register as Farmer
                  </Button>
                  <Button
                    variant={role === "expert" ? "contained" : "outlined"}
                    onClick={() => setRole("expert")}
                  >
                    Register as Expert
                  </Button>
                </Box>
              </Grid>
              {role === "expert" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Specialization (e.g., Soil Science)"
                      fullWidth
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Experience (years)"
                      type="number"
                      fullWidth
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Languages (comma separated)"
                      fullWidth
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Availability (e.g., Mon–Sat, 10:00–18:00)"
                      fullWidth
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Location"
                      fullWidth
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  inputRef={passwordRef}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                <Link href="/auth/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box mt={5}>
          <Copyright />
        </Box>
        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
}