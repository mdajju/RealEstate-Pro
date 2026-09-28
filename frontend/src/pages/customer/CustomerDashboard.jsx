import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Divider,
} from "@mui/material";

import {
  CalendarMonth,
  EventAvailable,
  CheckCircle,
  Cancel,
  Favorite,
  Notifications,
  HomeWork,
  ArrowForward,
  Search,
  Star,
} from "@mui/icons-material";

import {
  useNavigate,
} from "react-router-dom";

import {
  getCustomerDashboard,
} from "../../api";


function CustomerDashboard() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // USER
  // =====================================================

  const savedUser =
    localStorage.getItem("user");

  let user = {};

  try {

    user = savedUser
      ? JSON.parse(savedUser)
      : {};

  } catch (error) {

    console.error(
      "Unable to read user:",
      error
    );

  }


  const firstName =
    user.firstName ||
    user.name ||
    "Customer";


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    fetchDashboard();

  }, []);


  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboard = async () => {

    try {

      setLoading(true);

      setError("");


      const savedUser =
        localStorage.getItem("user");


      if (!savedUser) {

        setError(
          "User information not found. Please login again."
        );

        return;

      }


      const currentUser =
        JSON.parse(savedUser);


      const customerId =
        currentUser.id ||
        currentUser.userId;


      if (!customerId) {

        setError(
          "Customer ID not found. Please login again."
        );

        return;

      }


      const response =
        await getCustomerDashboard(
          customerId
        );


      console.log(
        "Customer Dashboard Response:",
        response
      );


      if (response?.data) {

        setDashboard(
          response.data
        );

      } else {

        setDashboard(
          response
        );

      }

    } catch (error) {

      console.error(
        "Customer Dashboard Error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Failed to load customer dashboard."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <CircularProgress />

      </Box>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <Box>

        <Alert severity="error">
          {error}
        </Alert>

      </Box>

    );

  }


  const data =
    dashboard || {};


  // =====================================================
  // STAT CARDS
  // =====================================================

  const stats = [

    {
      title: "Total Bookings",
      value: data.totalBookings ?? 0,
      subtitle: "All time bookings",
      icon: <CalendarMonth />,
      background: "#eaf2ff",
      iconBackground: "#3769e8",
    },

    {
      title: "Upcoming Visits",
      value: data.upcomingVisits ?? 0,
      subtitle: "Scheduled visits",
      icon: <EventAvailable />,
      background: "#eafaf2",
      iconBackground: "#20a464",
    },

    {
      title: "Completed",
      value: data.completedBookings ?? 0,
      subtitle: "Successfully completed",
      icon: <CheckCircle />,
      background: "#f3edff",
      iconBackground: "#7b4de8",
    },

    {
      title: "Cancelled",
      value: data.cancelledBookings ?? 0,
      subtitle: "Cancelled bookings",
      icon: <Cancel />,
      background: "#fff0f0",
      iconBackground: "#e53935",
    },

    {
      title: "Favourite Properties",
      value: data.favouriteProperties ?? 0,
      subtitle: "Saved properties",
      icon: <Favorite />,
      background: "#fff8e5",
      iconBackground: "#f5a900",
    },

    {
      title: "Notifications",
      value: data.notifications ?? 0,
      subtitle: "Unread notifications",
      icon: <Notifications />,
      background: "#eaf9fa",
      iconBackground: "#0e9aa7",
    },

  ];


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <Box>

      {/* =================================================
          WELCOME SECTION
      ================================================= */}

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight="800"
            color="#172b4d"
            sx={{
              fontSize: {
                xs: "28px",
                md: "34px",
              },
            }}
          >
            👋 Welcome, {firstName}!
          </Typography>


          <Typography
            color="text.secondary"
            mt={1}
          >
            Here's what's happening with your
            real estate journey.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={() =>
            navigate(
              "/customer/properties"
            )
          }
          sx={{
            backgroundColor: "#3769e8",
            borderRadius: 2,
            px: 3,
            py: 1.2,
            textTransform: "none",
            fontWeight: "bold",

            "&:hover": {
              backgroundColor: "#2857cf",
            },
          }}
        >
          Browse Properties
        </Button>

      </Box>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <Grid
        container
        spacing={2.5}
        mb={4}
      >

        {stats.map((stat) => (

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={2}
            key={stat.title}
          >

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                minHeight: 155,
                borderRadius: 3,
                backgroundColor:
                  stat.background,

                border:
                  "1px solid rgba(0,0,0,0.04)",

                transition:
                  "transform 0.2s ease",

                "&:hover": {
                  transform:
                    "translateY(-4px)",
                },
              }}
            >

              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  backgroundColor:
                    stat.iconBackground,
                  mb: 2,
                }}
              >
                {stat.icon}
              </Avatar>


              <Typography
                fontWeight="600"
                color="#243b53"
                fontSize={14}
              >
                {stat.title}
              </Typography>


              <Typography
                variant="h4"
                fontWeight="800"
                color="#172b4d"
                mt={0.5}
              >
                {stat.value}
              </Typography>


              <Typography
                fontSize={12}
                color="text.secondary"
                mt={0.5}
              >
                {stat.subtitle}
              </Typography>

            </Paper>

          </Grid>

        ))}

      </Grid>


      {/* =================================================
          LOWER SECTION
      ================================================= */}

      <Grid
        container
        spacing={3}
      >

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <Grid
          item
          xs={12}
          md={7}
        >

          <Paper
            elevation={0}
            sx={{
              backgroundColor: "white",
              borderRadius: 3,
              border:
                "1px solid #e7eaf0",
              overflow: "hidden",
            }}
          >

            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >

              <Box>

                <Typography
                  variant="h6"
                  fontWeight="800"
                  color="#172b4d"
                >
                  Quick Actions
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={14}
                  mt={0.5}
                >
                  Manage your real estate activities
                </Typography>

              </Box>

              <HomeWork
                sx={{
                  color: "#3769e8",
                  fontSize: 30,
                }}
              />

            </Box>


            <Divider />


            <Box
              sx={{
                p: 3,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >

              {/* Properties */}

              <Paper
                elevation={0}
                onClick={() =>
                  navigate(
                    "/customer/properties"
                  )
                }
                sx={{
                  p: 2.5,
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 2,
                  cursor: "pointer",

                  "&:hover": {
                    borderColor:
                      "#3769e8",
                    backgroundColor:
                      "#f7f9ff",
                  },
                }}
              >

                <HomeWork
                  sx={{
                    color: "#3769e8",
                    mb: 1,
                  }}
                />

                <Typography
                  fontWeight="700"
                >
                  Explore Properties
                </Typography>

                <Typography
                  fontSize={13}
                  color="text.secondary"
                  mt={0.5}
                >
                  Find your perfect property
                </Typography>

                <ArrowForward
                  sx={{
                    fontSize: 18,
                    mt: 1,
                    color: "#3769e8",
                  }}
                />

              </Paper>


              {/* Bookings */}

              <Paper
                elevation={0}
                onClick={() =>
                  navigate(
                    "/customer/bookings"
                  )
                }
                sx={{
                  p: 2.5,
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 2,
                  cursor: "pointer",

                  "&:hover": {
                    borderColor:
                      "#20a464",
                    backgroundColor:
                      "#f5fff9",
                  },
                }}
              >

                <CalendarMonth
                  sx={{
                    color: "#20a464",
                    mb: 1,
                  }}
                />

                <Typography
                  fontWeight="700"
                >
                  My Bookings
                </Typography>

                <Typography
                  fontSize={13}
                  color="text.secondary"
                  mt={0.5}
                >
                  View and manage bookings
                </Typography>

                <ArrowForward
                  sx={{
                    fontSize: 18,
                    mt: 1,
                    color: "#20a464",
                  }}
                />

              </Paper>


              {/* Notifications */}

              <Paper
                elevation={0}
                onClick={() =>
                  navigate(
                    "/customer/notifications"
                  )
                }
                sx={{
                  p: 2.5,
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 2,
                  cursor: "pointer",

                  "&:hover": {
                    borderColor:
                      "#0e9aa7",
                    backgroundColor:
                      "#f4ffff",
                  },
                }}
              >

                <Notifications
                  sx={{
                    color: "#0e9aa7",
                    mb: 1,
                  }}
                />

                <Typography
                  fontWeight="700"
                >
                  Notifications
                </Typography>

                <Typography
                  fontSize={13}
                  color="text.secondary"
                  mt={0.5}
                >
                  Check your latest updates
                </Typography>

                <ArrowForward
                  sx={{
                    fontSize: 18,
                    mt: 1,
                    color: "#0e9aa7",
                  }}
                />

              </Paper>


              {/* Reviews */}

              <Paper
                elevation={0}
                onClick={() =>
                  navigate(
                    "/customer/reviews"
                  )
                }
                sx={{
                  p: 2.5,
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 2,
                  cursor: "pointer",

                  "&:hover": {
                    borderColor:
                      "#f5a900",
                    backgroundColor:
                      "#fffdf5",
                  },
                }}
              >

                <Star
                  sx={{
                    color: "#f5a900",
                    mb: 1,
                  }}
                />

                <Typography
                  fontWeight="700"
                >
                  Reviews
                </Typography>

                <Typography
                  fontSize={13}
                  color="text.secondary"
                  mt={0.5}
                >
                  Manage your property reviews
                </Typography>

                <ArrowForward
                  sx={{
                    fontSize: 18,
                    mt: 1,
                    color: "#f5a900",
                  }}
                />

              </Paper>

            </Box>

          </Paper>

        </Grid>


        {/* =================================================
            FIND PROPERTY CARD
        ================================================= */}

        <Grid
          item
          xs={12}
          md={5}
        >

          <Paper
            elevation={0}
            sx={{
              minHeight: 300,
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",

              background:
                "linear-gradient(135deg, #16213e 0%, #294c83 100%)",

              color: "white",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 4,
            }}
          >

            <Box
              sx={{
                position: "absolute",
                right: -50,
                top: -50,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.08)",
              }}
            />


            <HomeWork
              sx={{
                fontSize: 48,
                mb: 2,
                position: "relative",
              }}
            />


            <Typography
              variant="h5"
              fontWeight="800"
              position="relative"
            >
              Find Your Perfect Property
            </Typography>


            <Typography
              mt={1.5}
              sx={{
                color:
                  "rgba(255,255,255,0.78)",
                lineHeight: 1.7,
                position: "relative",
              }}
            >
              Explore available properties,
              discover your dream home and
              schedule a visit.
            </Typography>


            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() =>
                navigate(
                  "/customer/properties"
                )
              }
              sx={{
                alignSelf: "flex-start",
                mt: 3,
                backgroundColor: "white",
                color: "#172b4d",
                textTransform: "none",
                fontWeight: "bold",
                px: 2.5,

                "&:hover": {
                  backgroundColor:
                    "#f2f4f8",
                },
              }}
            >
              Browse Properties
            </Button>

          </Paper>

        </Grid>


        {/* =================================================
            ACCOUNT SUMMARY
        ================================================= */}

        <Grid
          item
          xs={12}
        >

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border:
                "1px solid #e7eaf0",
              backgroundColor: "white",
            }}
          >

            <Box
              display="flex"
              alignItems="center"
              gap={2}
            >

              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  backgroundColor:
                    "#3769e8",
                }}
              >
                {firstName
                  .charAt(0)
                  .toUpperCase()}
              </Avatar>


              <Box flex={1}>

                <Typography
                  fontWeight="800"
                  color="#172b4d"
                >
                  {firstName}'s Real Estate Activity
                </Typography>

                <Typography
                  fontSize={13}
                  color="text.secondary"
                >
                  Keep exploring properties and
                  managing your bookings.
                </Typography>

              </Box>


              <Button
                variant="outlined"
                endIcon={<ArrowForward />}
                onClick={() =>
                  navigate(
                    "/customer/properties"
                  )
                }
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Explore
              </Button>

            </Box>

          </Paper>

        </Grid>

      </Grid>

    </Box>

  );

}


export default CustomerDashboard;