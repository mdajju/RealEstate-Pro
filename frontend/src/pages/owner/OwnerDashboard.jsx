
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Divider,
} from "@mui/material";

import {
  Home,
  HomeWork,
  PendingActions,
  Event,
  HourglassEmpty,
  CheckCircle,
  Cancel,
  Reviews,
  Star,
  Message,
  AddHome,
  Visibility,
} from "@mui/icons-material";

import { getOwnerDashboard } from "../../api";


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        borderRadius: 3,
        transition: "0.3s",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mt: 1,
              }}
            >
              {value}
            </Typography>

          </Box>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "action.hover",
            }}
          >
            {icon}
          </Box>

        </Box>

      </CardContent>
    </Card>
  );
}


// =====================================================
// OWNER DASHBOARD
// =====================================================

function OwnerDashboard() {

  const navigate = useNavigate();


  // ===================================================
  // STATE
  // ===================================================

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ===================================================
  // LOAD DASHBOARD
  // ===================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);
        setError("");


        // ---------------------------------------------
        // GET LOGGED-IN USER
        // ---------------------------------------------

        const storedUser =
          localStorage.getItem("user");


        if (!storedUser) {

          setError(
            "Owner information not found. Please login again."
          );

          return;
        }


        const user =
          JSON.parse(storedUser);


        const ownerId =
          user.userId || user.id;


        if (!ownerId) {

          setError(
            "Owner ID not found. Please login again."
          );

          return;
        }


        console.log(
          "OWNER ID:",
          ownerId
        );


        // ---------------------------------------------
        // CALL BACKEND
        // ---------------------------------------------

        const response =
          await getOwnerDashboard(ownerId);


        console.log(
          "OWNER DASHBOARD RESPONSE:",
          response
        );


        // ---------------------------------------------
        // HANDLE API RESPONSE
        // ---------------------------------------------

        if (
          response &&
          response.data
        ) {

          setDashboard(
            response.data
          );

        } else {

          setDashboard(
            response
          );

        }

      } catch (err) {

        console.error(
          "OWNER DASHBOARD ERROR:",
          err
        );


        setError(
          err?.response?.data?.message ||
          "Failed to load owner dashboard."
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, []);


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >

        <CircularProgress />

        <Typography
          color="text.secondary"
        >
          Loading owner dashboard...
        </Typography>

      </Box>

    );

  }


  // ===================================================
  // ERROR
  // ===================================================

  if (error) {

    return (

      <Box sx={{ p: 3 }}>

        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>

        <Button
          variant="contained"
          onClick={() =>
            window.location.reload()
          }
        >
          Try Again
        </Button>

      </Box>

    );

  }


  // ===================================================
  // NO DATA
  // ===================================================

  if (!dashboard) {

    return (

      <Box sx={{ p: 3 }}>

        <Alert severity="warning">
          No dashboard data available.
        </Alert>

      </Box>

    );

  }


  // ===================================================
  // DASHBOARD
  // ===================================================

  return (

    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >

      {/* =================================================
          HEADER
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
            sx={{
              fontWeight: 800,
            }}
          >
            Owner Dashboard
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage your properties, bookings and
            customer activity.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={<AddHome />}
          onClick={() =>
            navigate("/owner/properties/create")
          }
        >
          Add Property
        </Button>

      </Box>


      {/* =================================================
          PROPERTY STATISTICS
      ================================================= */}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Property Overview
      </Typography>


      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
      >

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >

          <StatCard
            title="Total Properties"
            value={
              dashboard.totalProperties ?? 0
            }
            icon={
              <Home />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >

          <StatCard
            title="Active Properties"
            value={
              dashboard.activeProperties ?? 0
            }
            icon={
              <CheckCircle />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >

          <StatCard
            title="Pending Properties"
            value={
              dashboard.pendingProperties ?? 0
            }
            icon={
              <PendingActions />
            }
          />

        </Grid>

      </Grid>


      {/* =================================================
          BOOKING STATISTICS
      ================================================= */}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Booking Overview
      </Typography>


      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
      >

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <StatCard
            title="Total Bookings"
            value={
              dashboard.totalBookings ?? 0
            }
            icon={
              <Event />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <StatCard
            title="Pending Bookings"
            value={
              dashboard.pendingBookings ?? 0
            }
            icon={
              <HourglassEmpty />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <StatCard
            title="Accepted Bookings"
            value={
              dashboard.acceptedBookings ?? 0
            }
            icon={
              <CheckCircle />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <StatCard
            title="Completed Bookings"
            value={
              dashboard.completedBookings ?? 0
            }
            icon={
              <HomeWork />
            }
          />

        </Grid>

      </Grid>


      {/* =================================================
          CANCELLED BOOKINGS
      ================================================= */}

      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
      >

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <StatCard
            title="Cancelled Bookings"
            value={
              dashboard.cancelledBookings ?? 0
            }
            icon={
              <Cancel />
            }
          />

        </Grid>

      </Grid>


      {/* =================================================
          REVIEWS / RATING / INQUIRIES
      ================================================= */}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Customer Activity
      </Typography>


      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
      >

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >

          <StatCard
            title="Total Reviews"
            value={
              dashboard.totalReviews ?? 0
            }
            icon={
              <Reviews />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >

          <StatCard
            title="Average Rating"
            value={
              Number(
                dashboard.averageRating ?? 0
              ).toFixed(1)
            }
            icon={
              <Star />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >

          <StatCard
            title="Total Inquiries"
            value={
              dashboard.totalInquiries ?? 0
            }
            icon={
              <Message />
            }
          />

        </Grid>

      </Grid>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Quick Actions
          </Typography>

          <Divider sx={{ mb: 3 }} />


          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >

            <Button
              variant="contained"
              startIcon={<AddHome />}
              onClick={() =>
                navigate(
                  "/owner/properties/create"
                )
              }
            >
              Add Property
            </Button>


            <Button
              variant="outlined"
              startIcon={<Home />}
              onClick={() =>
                navigate(
                  "/owner/properties"
                )
              }
            >
              My Properties
            </Button>


            <Button
              variant="outlined"
              startIcon={<Event />}
              onClick={() =>
                navigate(
                  "/owner/bookings"
                )
              }
            >
              My Bookings
            </Button>


            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() =>
                navigate(
                  "/owner/payments"
                )
              }
            >
              Payments
            </Button>

          </Box>

        </CardContent>

      </Card>


      {/* =================================================
          STATUS SUMMARY
      ================================================= */}

      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Current Status
          </Typography>


          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >

            <Chip
              label={
                `Active Properties: ${
                  dashboard.activeProperties ?? 0
                }`
              }
              color="success"
              variant="outlined"
            />


            <Chip
              label={
                `Pending Properties: ${
                  dashboard.pendingProperties ?? 0
                }`
              }
              color="warning"
              variant="outlined"
            />


            <Chip
              label={
                `Pending Bookings: ${
                  dashboard.pendingBookings ?? 0
                }`
              }
              color="warning"
              variant="outlined"
            />


            <Chip
              label={
                `Accepted Bookings: ${
                  dashboard.acceptedBookings ?? 0
                }`
              }
              color="info"
              variant="outlined"
            />

          </Box>

        </CardContent>

      </Card>

    </Box>

  );
}


export default OwnerDashboard;
