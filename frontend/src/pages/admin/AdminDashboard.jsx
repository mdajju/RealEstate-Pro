
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

import { getAdminDashboard } from "../../api";

function AdminDashboard() {
  // =====================================================
  // STATE
  // =====================================================

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =====================================================
  // FETCH ADMIN DASHBOARD
  // =====================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminDashboard();

      console.log("Admin Dashboard Response:", response);

      // Backend returns:
      // {
      //   success: true,
      //   message: "...",
      //   data: {...}
      // }

      if (response?.success && response?.data) {
        setDashboard(response.data);
      } else if (response?.data) {
        setDashboard(response.data);
      } else {
        setDashboard(response);
      }
    } catch (err) {
      console.error("Admin Dashboard Error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to load admin dashboard.");
      }
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
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
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
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>

        <Button
          variant="contained"
          onClick={fetchDashboard}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  // =====================================================
  // SAFE DATA
  // =====================================================

  const data = dashboard || {};

  // =====================================================
  // DASHBOARD UI
  // =====================================================

  return (
    <Box p={3}>

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Admin Dashboard
          </Typography>

          <Typography
            color="text.secondary"
            mt={1}
          >
            Welcome to your RealEstate Pro admin dashboard
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={fetchDashboard}
        >
          Refresh
        </Button>
      </Box>


      {/* =================================================
          USER STATISTICS
      ================================================= */}

      <Typography
        variant="h6"
        fontWeight="bold"
        mt={4}
        mb={2}
      >
        User Statistics
      </Typography>

      <Grid
        container
        spacing={3}
      >

        {/* Total Users */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Total Users
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.totalUsers ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Owners */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Owners
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.totalOwners ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Customers */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Customers
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.totalCustomers ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Agents */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Agents
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.totalAgents ?? 0}
            </Typography>
          </Paper>
        </Grid>

      </Grid>


      {/* =================================================
          PROPERTY STATISTICS
      ================================================= */}

      <Typography
        variant="h6"
        fontWeight="bold"
        mt={5}
        mb={2}
      >
        Property Statistics
      </Typography>

      <Grid
        container
        spacing={3}
      >

        {/* Total Properties */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Total Properties
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.totalProperties ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Approved Properties */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Approved
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.approvedProperties ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Pending Properties */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Pending
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.pendingProperties ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Rejected Properties */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Rejected
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.rejectedProperties ?? 0}
            </Typography>
          </Paper>
        </Grid>

      </Grid>


      {/* =================================================
          BOOKING STATISTICS
      ================================================= */}

      <Typography
        variant="h6"
        fontWeight="bold"
        mt={5}
        mb={2}
      >
        Booking Statistics
      </Typography>

      <Grid
        container
        spacing={3}
      >

        {/* Total Bookings */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Total Bookings
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.totalBookings ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Pending */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Pending
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.pendingBookings ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Accepted */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Accepted
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.acceptedBookings ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Completed */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Completed
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.completedBookings ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Cancelled */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Cancelled
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.cancelledBookings ?? 0}
            </Typography>
          </Paper>
        </Grid>

      </Grid>


      {/* =================================================
          ENGAGEMENT STATISTICS
      ================================================= */}

      <Typography
        variant="h6"
        fontWeight="bold"
        mt={5}
        mb={2}
      >
        Engagement Statistics
      </Typography>

      <Grid
        container
        spacing={3}
      >

        {/* Reviews */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Total Reviews
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.totalReviews ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Average Rating */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Average Rating
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {Number(data.averageRating ?? 0).toFixed(1)}
              {" ★"}
            </Typography>
          </Paper>
        </Grid>


        {/* Inquiries */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Total Inquiries
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.totalInquiries ?? 0}
            </Typography>
          </Paper>
        </Grid>


        {/* Favourites */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Total Favourites
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {data.totalFavourites ?? 0}
            </Typography>
          </Paper>
        </Grid>

      </Grid>

    </Box>
  );
}

export default AdminDashboard;
