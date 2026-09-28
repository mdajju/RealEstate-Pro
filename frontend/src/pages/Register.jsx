import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";

import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  PersonAddOutlined,
  HomeWorkOutlined,
  VerifiedUserOutlined,
  ArrowBack,
  PhoneOutlined,
  LocationOnOutlined,
  CheckCircleOutlined,
} from "@mui/icons-material";

import { registerUser } from "../api";


// =====================================================
// REGISTER COMPONENT
// =====================================================

function Register() {

  const navigate = useNavigate();


  // ===================================================
  // FORM STATE
  // ===================================================

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    address: "",
  });


  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ===================================================
  // HANDLE CHANGE
  // ===================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );


    setMessage("");
    setSuccess("");
  };


  // ===================================================
  // HANDLE REGISTER
  // ===================================================

  const handleRegister = async (event) => {

    event.preventDefault();

    setMessage("");
    setSuccess("");


    // -------------------------------------------------
    // PASSWORD VALIDATION
    // -------------------------------------------------

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setMessage(
        "Password and confirm password do not match."
      );

      return;
    }


    // -------------------------------------------------
    // PASSWORD LENGTH
    // -------------------------------------------------

    if (
      formData.password.length < 6
    ) {

      setMessage(
        "Password must contain at least 6 characters."
      );

      return;
    }


    // -------------------------------------------------
    // MOBILE VALIDATION
    // -------------------------------------------------

    if (
      !/^[0-9]{10}$/.test(
        formData.mobile.trim()
      )
    ) {

      setMessage(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }


    setLoading(true);


    try {

      // =================================================
      // CUSTOMER REGISTRATION
      // =================================================

      const registrationData = {

        firstName:
          formData.firstName.trim(),

        lastName:
          formData.lastName.trim(),

        email:
          formData.email.trim(),

        mobile:
          formData.mobile.trim(),

        password:
          formData.password,

        address:
          formData.address.trim(),

      };


      console.log(
        "Registration request:",
        registrationData
      );


      const result =
        await registerUser(
          registrationData
        );


      console.log(
        "Registration response:",
        result
      );


      // =================================================
      // SUCCESS
      // =================================================

      if (
        result &&
        result.success === false
      ) {

        setMessage(
          result.message ||
          "Registration failed."
        );

        return;
      }


      setSuccess(
        "Account created successfully. Redirecting to login..."
      );


      // -------------------------------------------------
      // REDIRECT TO LOGIN
      // -------------------------------------------------

      setTimeout(() => {

        navigate(
          "/login",
          {
            replace: true,
            state: {
              message:
                "Registration successful. Please login with your new account.",
            },
          }
        );

      }, 1500);


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      // -------------------------------------------------
      // BACKEND ERROR
      // -------------------------------------------------

      if (error.response) {

        setMessage(
          error.response.data?.message ||
          "Registration failed. Please check your information."
        );

      }

      // -------------------------------------------------
      // NETWORK ERROR
      // -------------------------------------------------

      else {

        setMessage(
          "Unable to connect to the server. Please make sure the backend is running."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        px: {
          xs: 2,
          sm: 3,
          md: 5,
        },

        py: {
          xs: 4,
          md: 6,
        },

        background:
          "linear-gradient(135deg, #06152d 0%, #0c2d52 45%, #0b5f82 100%)",
      }}
    >

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <Box
        sx={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "rgba(0,188,212,0.16)",
          top: -180,
          right: -100,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "rgba(25,118,210,0.20)",
          bottom: -180,
          left: -100,
        }}
      />


      {/* =================================================
          BACK TO HOME
      ================================================= */}

      <Button
        startIcon={<ArrowBack />}
        onClick={() =>
          navigate("/")
        }
        sx={{
          position: "absolute",

          top: {
            xs: 18,
            md: 28,
          },

          left: {
            xs: 18,
            md: 35,
          },

          color: "#fff",

          textTransform: "none",

          fontWeight: 700,

          "&:hover": {
            backgroundColor:
              "rgba(255,255,255,0.1)",
          },
        }}
      >
        Back to Home
      </Button>


      {/* =================================================
          REGISTER CONTAINER
      ================================================= */}

      <Paper
        elevation={24}
        sx={{
          position: "relative",
          zIndex: 2,

          width: "100%",
          maxWidth: 1100,

          overflow: "hidden",

          borderRadius: {
            xs: 4,
            md: 6,
          },

          backgroundColor:
            "rgba(255,255,255,0.98)",
        }}
      >

        <Box
          sx={{
            display: {
              xs: "block",
              md: "grid",
            },

            gridTemplateColumns:
              "0.85fr 1.15fr",
          }}
        >

          {/* =================================================
              LEFT BRAND PANEL
          ================================================= */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },

              flexDirection: "column",
              justifyContent: "space-between",

              minHeight: 700,

              p: 6,

              color: "#fff",

              backgroundImage:
                "linear-gradient(135deg, rgba(4,24,48,0.95), rgba(12,91,125,0.88)), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90')",

              backgroundSize: "cover",

              backgroundPosition: "center",
            }}
          >

            <Box>

              {/* LOGO */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,

                  mb: 6,
                }}
              >

                <Box
                  sx={{
                    width: 52,
                    height: 52,

                    borderRadius: 3,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    background:
                      "linear-gradient(135deg,#1976d2,#00bcd4)",

                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.25)",
                  }}
                >

                  <HomeWorkOutlined
                    sx={{
                      fontSize: 30,
                    }}
                  />

                </Box>


                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                  }}
                >

                  RealEstate

                  <Box
                    component="span"
                    sx={{
                      color: "#4dd0e1",
                    }}
                  >
                    Pro
                  </Box>

                </Typography>

              </Box>


              <Chip
                icon={
                  <PersonAddOutlined />
                }
                label="CREATE YOUR ACCOUNT"
                sx={{
                  color: "#fff",

                  backgroundColor:
                    "rgba(77,208,225,0.16)",

                  border:
                    "1px solid rgba(77,208,225,0.35)",

                  fontWeight: 800,

                  letterSpacing: 0.7,

                  mb: 3,
                }}
              />


              <Typography
                sx={{
                  fontSize: {
                    md: "2.7rem",
                    lg: "3.3rem",
                  },

                  lineHeight: 1.08,

                  fontWeight: 900,

                  letterSpacing: "-1.5px",

                  mb: 3,
                }}
              >

                Start your

                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: "#4dd0e1",
                  }}
                >
                  property journey.
                </Box>

              </Typography>


              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,0.78)",

                  fontSize: "1.05rem",

                  lineHeight: 1.8,

                  maxWidth: 430,
                }}
              >

                Create your RealEstate-Pro
                account and explore properties,
                bookings, payments and more
                from one secure platform.

              </Typography>

            </Box>


            {/* FEATURES */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >

              {[
                "Secure account registration",
                "JWT protected authentication",
                "Easy property & booking management",
              ].map((item) => (

                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >

                  <Box
                    sx={{
                      width: 30,
                      height: 30,

                      borderRadius: "50%",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      backgroundColor:
                        "rgba(77,208,225,0.18)",
                    }}
                  >

                    <CheckCircleOutlined
                      sx={{
                        fontSize: 17,
                        color: "#4dd0e1",
                      }}
                    />

                  </Box>


                  <Typography
                    sx={{
                      color:
                        "rgba(255,255,255,0.8)",

                      fontSize: ".95rem",
                    }}
                  >
                    {item}
                  </Typography>

                </Box>

              ))}

            </Box>

          </Box>


          {/* =================================================
              RIGHT REGISTER PANEL
          ================================================= */}

          <Box
            sx={{
              p: {
                xs: 3,
                sm: 5,
                md: 6,
              },
            }}
          >

            {/* MOBILE LOGO */}

            <Box
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },

                alignItems: "center",
                justifyContent: "center",

                gap: 1,

                mb: 4,
              }}
            >

              <Box
                sx={{
                  width: 48,
                  height: 48,

                  borderRadius: 3,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  color: "#fff",

                  background:
                    "linear-gradient(135deg,#1976d2,#00bcd4)",
                }}
              >

                <HomeWorkOutlined />

              </Box>


              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  color: "#14213d",
                }}
              >

                RealEstate

                <Box
                  component="span"
                  sx={{
                    color: "#1976d2",
                  }}
                >
                  Pro
                </Box>

              </Typography>

            </Box>


            {/* HEADER */}

            <Box
              sx={{
                mb: 3,
              }}
            >

              <Typography
                sx={{
                  color: "#1976d2",

                  fontWeight: 800,

                  letterSpacing: 1,

                  fontSize: ".85rem",

                  mb: 1,
                }}
              >
                NEW ACCOUNT
              </Typography>


              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,

                  color: "#172033",

                  fontSize: {
                    xs: "2rem",
                    md: "2.6rem",
                  },

                  letterSpacing: "-1px",
                }}
              >
                Create Account
              </Typography>


              <Typography
                sx={{
                  color: "#687386",

                  mt: 1,

                  lineHeight: 1.7,
                }}
              >
                Register as a customer and
                start exploring properties.
              </Typography>

            </Box>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {success && (

              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 2,

                  "& .MuiAlert-message": {
                    fontWeight: 600,
                  },
                }}
              >
                {success}
              </Alert>

            )}


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {message && (

              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,

                  "& .MuiAlert-message": {
                    fontWeight: 600,
                  },
                }}
              >
                {message}
              </Alert>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <Box
              component="form"
              onSubmit={handleRegister}
            >

              {/* FIRST + LAST NAME */}

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },

                  gap: 2,

                  mb: 2,
                }}
              >

                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />


                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />

              </Box>


              {/* EMAIL */}

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"

                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">

                      <EmailOutlined
                        sx={{
                          color: "#1976d2",
                        }}
                      />

                    </InputAdornment>
                  ),
                }}

                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
              />


              {/* MOBILE */}

              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                inputProps={{
                  maxLength: 10,
                }}
                autoComplete="tel"

                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">

                      <PhoneOutlined
                        sx={{
                          color: "#1976d2",
                        }}
                      />

                    </InputAdornment>
                  ),
                }}

                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
              />


              {/* ADDRESS */}

              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                multiline
                rows={2}

                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{
                        alignSelf: "flex-start",
                        mt: 1.5,
                      }}
                    >

                      <LocationOnOutlined
                        sx={{
                          color: "#1976d2",
                        }}
                      />

                    </InputAdornment>
                  ),
                }}

                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
              />


              {/* PASSWORD */}

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"

                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">

                      <LockOutlined
                        sx={{
                          color: "#1976d2",
                        }}
                      />

                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">

                      <IconButton
                        onClick={() =>
                          setShowPassword(
                            (previous) =>
                              !previous
                          )
                        }
                        edge="end"
                      >

                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}

                      </IconButton>

                    </InputAdornment>
                  ),
                }}

                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
              />


              {/* CONFIRM PASSWORD */}

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                required
                autoComplete="new-password"

                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">

                      <LockOutlined
                        sx={{
                          color: "#1976d2",
                        }}
                      />

                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">

                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(
                            (previous) =>
                              !previous
                          )
                        }
                        edge="end"
                      >

                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}

                      </IconButton>

                    </InputAdornment>
                  ),
                }}

                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
              />


              {/* REGISTER BUTTON */}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"

                disabled={loading}

                startIcon={
                  loading ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <PersonAddOutlined />
                  )
                }

                sx={{
                  minHeight: 56,

                  borderRadius: 2.5,

                  fontWeight: 900,

                  fontSize: "1rem",

                  textTransform: "none",

                  background:
                    "linear-gradient(135deg,#1976d2,#00a6c7)",

                  boxShadow:
                    "0 10px 25px rgba(25,118,210,0.28)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#1565c0,#0097a7)",
                  },
                }}
              >

                {loading
                  ? "Creating Account..."
                  : "Create Account"}

              </Button>

            </Box>


            {/* =================================================
                LOGIN LINK
            ================================================= */}

            <Divider
              sx={{
                my: 3,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#9aa4b2",
                }}
              >
                Already have an account?
              </Typography>
            </Divider>


            <Button
              fullWidth
              variant="outlined"
              size="large"

              onClick={() =>
                navigate("/login")
              }

              sx={{
                minHeight: 52,

                borderRadius: 2.5,

                borderWidth: 1.5,

                borderColor:
                  "#1976d2",

                color: "#1976d2",

                fontWeight: 800,

                textTransform: "none",

                "&:hover": {
                  borderWidth: 1.5,

                  backgroundColor:
                    "#eef6ff",
                },
              }}
            >
              Already have an account? Sign In
            </Button>


            {/* FOOTER */}

            <Typography
              align="center"
              sx={{
                mt: 3,

                color: "#9aa4b2",

                fontSize: ".82rem",
              }}
            >
              © {new Date().getFullYear()}{" "}
              RealEstate-Pro
            </Typography>

          </Box>

        </Box>

      </Paper>

    </Box>
  );
}


export default Register;