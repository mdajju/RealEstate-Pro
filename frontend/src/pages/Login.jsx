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
  LoginOutlined,
  HomeWorkOutlined,
  SecurityOutlined,
  ArrowBack,
  PersonAddOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";

import { loginUser } from "../api";


// =====================================================
// GET ROLE HELPER
// =====================================================

const getUserRole = (user) => {

  if (!user) {
    return "";
  }

  // roleName
  if (typeof user.roleName === "string") {

    return user.roleName
      .trim()
      .toUpperCase();

  }

  // role
  if (typeof user.role === "string") {

    return user.role
      .trim()
      .toUpperCase();

  }

  // role.roleName
  if (
    user.role &&
    typeof user.role.roleName === "string"
  ) {

    return user.role.roleName
      .trim()
      .toUpperCase();

  }

  // role.name
  if (
    user.role &&
    typeof user.role.name === "string"
  ) {

    return user.role.name
      .trim()
      .toUpperCase();

  }

  return "";
};


// =====================================================
// LOGIN COMPONENT
// =====================================================

function Login() {

  const navigate = useNavigate();


  // ===================================================
  // STATE
  // ===================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ===================================================
  // LOGIN
  // ===================================================

  const handleLogin = async (event) => {

    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {

      // =================================================
      // CALL LOGIN API
      // =================================================

      const result =
        await loginUser({
          email: email.trim(),
          password: password,
        });


      console.log(
        "Login response:",
        result
      );


      // =================================================
      // CHECK LOGIN RESPONSE
      // =================================================

      if (
        !result ||
        !result.success
      ) {

        setMessage(
          result?.message ||
          "Login failed. Please check your credentials."
        );

        return;
      }


      // =================================================
      // CHECK USER DATA
      // =================================================

      if (!result.data) {

        setMessage(
          "Login successful, but user data was not returned."
        );

        return;
      }


      // =================================================
      // CHECK TOKEN
      // =================================================

      if (!result.data.token) {

        setMessage(
          "Login successful, but JWT token was not returned."
        );

        return;
      }


      // =================================================
      // GET ROLE
      // =================================================

      const role =
        getUserRole(result.data);


      console.log(
        "Logged-in role:",
        role
      );


      // =================================================
      // CHECK ROLE
      // =================================================

      if (!role) {

        setMessage(
          "Login successful, but user role was not returned."
        );

        return;
      }


      // =================================================
      // SAVE JWT TOKEN
      // =================================================

      localStorage.setItem(
        "token",
        result.data.token
      );


      // =================================================
      // SAVE USER
      // =================================================

      const savedUser = {
        ...result.data,
        roleName: role,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(savedUser)
      );


      console.log(
        "Saved user:",
        savedUser
      );


      // =================================================
      // ROLE BASED REDIRECTION
      // =================================================

      // ADMIN
      if (role === "ADMIN") {

        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

        return;
      }


      // SUPER ADMIN
      if (role === "SUPER_ADMIN") {

        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

        return;
      }


      // CUSTOMER
      if (role === "CUSTOMER") {

        navigate(
          "/customer/dashboard",
          {
            replace: true,
          }
        );

        return;
      }


      // OWNER
      if (role === "OWNER") {

        navigate(
          "/owner/dashboard",
          {
            replace: true,
          }
        );

        return;
      }


      // AGENT
      if (role === "AGENT") {

        navigate(
          "/agent/dashboard",
          {
            replace: true,
          }
        );

        return;
      }


      // =================================================
      // UNKNOWN ROLE
      // =================================================

      setMessage(
        `Login successful, but role "${role}" is not recognized.`
      );

    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      // BACKEND ERROR

      if (error.response) {

        setMessage(
          error.response.data?.message ||
          "Login failed. Please check your credentials."
        );

      }

      // NETWORK ERROR

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
          filter: "blur(2px)",
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
          borderColor:
            "rgba(255,255,255,0.3)",

          textTransform: "none",
          fontWeight: 700,

          px: 2,

          "&:hover": {
            backgroundColor:
              "rgba(255,255,255,0.1)",
          },
        }}
      >
        Back to Home
      </Button>


      {/* =================================================
          MAIN LOGIN CONTAINER
      ================================================= */}

      <Paper
        elevation={24}
        sx={{
          position: "relative",
          zIndex: 2,

          width: "100%",
          maxWidth: 1050,

          minHeight: {
            xs: "auto",
            md: 620,
          },

          display: {
            xs: "block",
            md: "grid",
          },

          gridTemplateColumns:
            "1fr 1fr",

          overflow: "hidden",

          borderRadius: {
            xs: 4,
            md: 6,
          },

          backgroundColor:
            "rgba(255,255,255,0.98)",
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

            p: 6,

            color: "#fff",

            backgroundImage:
              "linear-gradient(135deg, rgba(4,24,48,0.94), rgba(12,91,125,0.88)), url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90')",

            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          {/* LOGO */}

          <Box>

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
                <VerifiedUserOutlined />
              }
              label="SMART REAL ESTATE PLATFORM"
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
                  md: "2.8rem",
                  lg: "3.4rem",
                },

                lineHeight: 1.08,

                fontWeight: 900,

                letterSpacing: "-1.5px",

                mb: 3,
              }}
            >
              Welcome back
              <Box
                component="span"
                sx={{
                  display: "block",
                  color: "#4dd0e1",
                }}
              >
                to your property world.
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
              Access your RealEstate-Pro
              account and manage properties,
              bookings, payments and everything
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
              "Secure JWT authentication",
              "Role-based access control",
              "Property & booking management",
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

                  <VerifiedUserOutlined
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
            RIGHT LOGIN PANEL
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",

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


          {/* LOGIN HEADER */}

          <Box
            sx={{
              mb: 4,
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
              SECURE LOGIN
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
              Sign in
            </Typography>


            <Typography
              sx={{
                color: "#687386",
                mt: 1,
                lineHeight: 1.7,
              }}
            >
              Sign in to continue to your
              RealEstate-Pro account.
            </Typography>

          </Box>


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
              LOGIN FORM
          ================================================= */}

          <Box
            component="form"
            onSubmit={handleLogin}
          >

            {/* EMAIL */}

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="Enter your email"
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
                mb: 2.5,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,

                  "&.Mui-focused fieldset": {
                    borderColor:
                      "#1976d2",
                    borderWidth: 2,
                  },
                },
              }}
            />


            {/* PASSWORD */}

            <TextField
              fullWidth
              label="Password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              required
              autoComplete="current-password"

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
                mb: 3,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,

                  "&.Mui-focused fieldset": {
                    borderColor:
                      "#1976d2",
                    borderWidth: 2,
                  },
                },
              }}
            />


            {/* LOGIN BUTTON */}

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
                  <LoginOutlined />
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

                  boxShadow:
                    "0 14px 30px rgba(25,118,210,0.35)",
                },
              }}
            >

              {loading
                ? "Signing in..."
                : "Sign In"}

            </Button>

          </Box>


          {/* =================================================
              SECURITY MESSAGE
          ================================================= */}

          <Box
            sx={{
              mt: 3,
              p: 2,

              borderRadius: 2.5,

              display: "flex",
              alignItems: "center",
              gap: 1.5,

              backgroundColor:
                "#f4f8fc",

              border:
                "1px solid #e3edf7",
            }}
          >

            <SecurityOutlined
              sx={{
                color: "#1976d2",
              }}
            />

            <Typography
              variant="body2"
              sx={{
                color: "#687386",
                lineHeight: 1.5,
              }}
            >
              Your login session is protected
              using secure JWT authentication.
            </Typography>

          </Box>


          {/* =================================================
              DIVIDER
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
              New to RealEstate-Pro?
            </Typography>
          </Divider>


          {/* =================================================
              REGISTER BUTTON
          ================================================= */}

          <Button
            fullWidth
            variant="outlined"
            size="large"

            startIcon={
              <PersonAddOutlined />
            }

            onClick={() =>
              navigate("/register")
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
            Create New Account
          </Button>


          {/* =================================================
              FOOTER
          ================================================= */}

          <Typography
            align="center"
            sx={{
              mt: 4,
              color: "#9aa4b2",
              fontSize: ".82rem",
            }}
          >
            © {new Date().getFullYear()}{" "}
            RealEstate-Pro
          </Typography>

        </Box>

      </Paper>

    </Box>
  );
}


export default Login;