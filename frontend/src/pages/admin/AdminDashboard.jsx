
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
  Chip,
} from "@mui/material";


import {
  People,
  Person,
  SupportAgent,
  HomeWork,
  CheckCircle,
  PendingActions,
  Cancel,
  CalendarMonth,
  EventAvailable,
  Star,
  RateReview,
  Favorite,
  QuestionAnswer,
  Refresh,
  ArrowForward,
  Dashboard,
  TrendingUp,
  AddHomeWork,
  ManageAccounts,
  ReceiptLong,
  ReportProblem,
  NotificationsActive,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { getAdminDashboard } from "../../api";

function AdminDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // USER
  // =====================================================

  let user = {};

  try {
    const savedUser = localStorage.getItem("user");
    user = savedUser ? JSON.parse(savedUser) : {};
  } catch (err) {
    console.error("Unable to read logged-in user:", err);
  }

  const firstName =
    user.firstName ||
    user.name ||
    user.username ||
    "Admin";

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getAdminDashboard();

      console.log("Admin Dashboard Response:", response);

      if (response?.success && response?.data) {
        setDashboard(response.data);
      } else if (response?.data) {
        setDashboard(response.data);
      } else {
        setDashboard(response);
      }
    } catch (err) {
      console.error("Admin Dashboard Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load admin dashboard. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "65vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={44} />

        <Typography color="text.secondary">
          Loading your admin dashboard...
        </Typography>
      </Box>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !dashboard) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>

        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => fetchDashboard()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  const data = dashboard || {};

  // =====================================================
  // STAT CARD DATA
  // =====================================================

  const sections = [
    {
      title: "User Statistics",
      description: "Monitor registered users and account distribution.",
      cards: [
        {
          title: "Total Users",
          value: data.totalUsers ?? 0,
          subtitle: "Registered accounts",
          icon: <People />,
          background: "#eaf2ff",
          iconBackground: "#3769e8",
        },
        {
          title: "Owners",
          value: data.totalOwners ?? 0,
          subtitle: "Property owners",
          icon: <Person />,
          background: "#eafaf2",
          iconBackground: "#20a464",
        },
        {
          title: "Customers",
          value: data.totalCustomers ?? 0,
          subtitle: "Registered customers",
          icon: <Person />,
          background: "#f3edff",
          iconBackground: "#7b4de8",
        },
        {
          title: "Agents",
          value: data.totalAgents ?? 0,
          subtitle: "Real estate agents",
          icon: <SupportAgent />,
          background: "#fff5e8",
          iconBackground: "#e99518",
        },
      ],
    },
    {
      title: "Property Statistics",
      description: "Track listings and property approval status.",
      cards: [
        {
          title: "Total Properties",
          value: data.totalProperties ?? 0,
          subtitle: "All property listings",
          icon: <HomeWork />,
          background: "#eaf2ff",
          iconBackground: "#3769e8",
        },
        {
          title: "Approved",
          value: data.approvedProperties ?? 0,
          subtitle: "Approved properties",
          icon: <CheckCircle />,
          background: "#eafaf2",
          iconBackground: "#20a464",
        },
        {
          title: "Pending",
          value: data.pendingProperties ?? 0,
          subtitle: "Awaiting approval",
          icon: <PendingActions />,
          background: "#fff8e5",
          iconBackground: "#f5a900",
        },
        {
          title: "Rejected",
          value: data.rejectedProperties ?? 0,
          subtitle: "Rejected listings",
          icon: <Cancel />,
          background: "#fff0f0",
          iconBackground: "#e53935",
        },
      ],
    },
    {
      title: "Booking Statistics",
      description: "Keep track of customer property bookings.",
      cards: [
        {
          title: "Total Bookings",
          value: data.totalBookings ?? 0,
          subtitle: "All bookings",
          icon: <CalendarMonth />,
          background: "#eaf2ff",
          iconBackground: "#3769e8",
        },
        {
          title: "Pending",
          value: data.pendingBookings ?? 0,
          subtitle: "Awaiting a decision",
          icon: <PendingActions />,
          background: "#fff8e5",
          iconBackground: "#f5a900",
        },
        {
          title: "Accepted",
          value: data.acceptedBookings ?? 0,
          subtitle: "Confirmed bookings",
          icon: <EventAvailable />,
          background: "#eafaf2",
          iconBackground: "#20a464",
        },
        {
          title: "Completed",
          value: data.completedBookings ?? 0,
          subtitle: "Completed bookings",
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
      ],
    },
    {
      title: "Engagement Statistics",
      description: "Understand activity across the platform.",
      cards: [
        {
          title: "Total Reviews",
          value: data.totalReviews ?? 0,
          subtitle: "Customer reviews",
          icon: <RateReview />,
          background: "#fff8e5",
          iconBackground: "#f5a900",
        },
        {
          title: "Average Rating",
          value: Number(data.averageRating ?? 0).toFixed(1),
          subtitle: "Out of 5 stars",
          icon: <Star />,
          background: "#fff5e8",
          iconBackground: "#e99518",
        },
        {
          title: "Total Inquiries",
          value: data.totalInquiries ?? 0,
          subtitle: "Property inquiries",
          icon: <QuestionAnswer />,
          background: "#eaf9fa",
          iconBackground: "#0e9aa7",
        },
        {
          title: "Total Favourites",
          value: data.totalFavourites ?? 0,
          subtitle: "Saved properties",
          icon: <Favorite />,
          background: "#fff0f5",
          iconBackground: "#d94685",
        },
      ],
    },
  ];

  // =====================================================
  // STATISTIC CARD
  // =====================================================

  const renderStatCard = (stat) => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      key={stat.title}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          minHeight: 170,
          height: "100%",
          borderRadius: 3,
          backgroundColor: stat.background,
          border: "1px solid rgba(0,0,0,0.04)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 10px 28px rgba(23,43,77,0.09)",
          },
        }}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
            mb: 2,
            backgroundColor: stat.iconBackground,
          }}
        >
          {stat.icon}
        </Avatar>

        <Typography
          sx={{
            color: "#43536b",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {stat.title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            color: "#172b4d",
            fontWeight: 800,
            mt: 0.5,
            lineHeight: 1.3,
            overflowWrap: "anywhere",
          }}
        >
          {stat.value}
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            color: "#68778d",
            mt: 0.7,
          }}
        >
          {stat.subtitle}
        </Typography>
      </Paper>
    </Grid>
  );

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage user accounts.",
      icon: <ManageAccounts />,
      color: "#3769e8",
      background: "#eaf2ff",
      path: "/admin/users",
    },
    {
      title: "Manage Properties",
      description: "Review and maintain property listings.",
      icon: <HomeWork />,
      color: "#20a464",
      background: "#eafaf2",
      path: "/admin/properties",
    },
    {
      title: "Manage Bookings",
      description: "Review customer booking requests.",
      icon: <CalendarMonth />,
      color: "#7b4de8",
      background: "#f3edff",
      path: "/admin/bookings",
    },
    {
      title: "Payments",
      description: "Review property payment records.",
      icon: <ReceiptLong />,
      color: "#0e9aa7",
      background: "#eaf9fa",
      path: "/admin/payments",
    },
    {
      title: "Complaints",
      description: "Review and manage complaints.",
      icon: <ReportProblem />,
      color: "#e99518",
      background: "#fff5e8",
      path: "/admin/complaints",
    },
    {
      title: "Notifications",
      description: "View platform notifications.",
      icon: <NotificationsActive />,
      color: "#d94685",
      background: "#fff0f5",
      path: "/admin/notifications",
    },
  ];

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        color: "#172b4d",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.8,
            }}
          >
            <Dashboard sx={{ color: "#3769e8", fontSize: 29 }} />

            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: 25, md: 32 },
                fontWeight: 800,
                color: "#172b4d",
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>

          <Typography color="text.secondary">
            Monitor your RealEstate Pro platform at a glance.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          disabled={refreshing}
          onClick={() => fetchDashboard(true)}
          sx={{
            borderRadius: 2,
            px: 2.5,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </Box>

      {error && (
        <Alert
          severity="warning"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => fetchDashboard(true)}
            >
              Retry
            </Button>
          }
        >
          {error} Showing the last successfully loaded data.
        </Alert>
      )}

      {/* WELCOME BANNER */}

      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          color: "white",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(120deg, #16213e 0%, #294c83 58%, #3769e8 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: -45,
            top: -85,
            width: 230,
            height: 230,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            right: 100,
            bottom: -115,
            width: 190,
            height: 190,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Chip
            icon={<TrendingUp />}
            label="Platform Overview"
            sx={{
              mb: 2,
              color: "white",
              backgroundColor: "rgba(255,255,255,0.14)",
              "& .MuiChip-icon": { color: "white" },
              fontWeight: 600,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 25, md: 34 },
            }}
          >
            👋 Welcome back, {firstName}!
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              maxWidth: 650,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            Manage users, oversee property listings, track bookings,
            and monitor activity across your real estate platform.
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddHomeWork />}
            endIcon={<ArrowForward />}
            onClick={() => navigate("/admin/properties/create")}
            sx={{
              mt: 3,
              py: 1.2,
              px: 2.5,
              color: "#172b4d",
              backgroundColor: "white",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                backgroundColor: "#f1f5ff",
              },
            }}
          >
            Add Property
          </Button>
        </Box>
      </Paper>

      {/* STATISTIC SECTIONS */}

      {sections.map((section, index) => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#172b4d",
              }}
            >
              {section.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {section.description}
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {section.cards.map(renderStatCard)}
          </Grid>

          {index !== sections.length - 1 && (
            <Divider sx={{ mt: 3, borderColor: "#e7eaf0" }} />
          )}
        </Box>
      ))}

      {/* QUICK ACTIONS */}

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          backgroundColor: "white",
          border: "1px solid #e7eaf0",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "#172b4d" }}
            >
              Quick Actions
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Access your frequently used administration pages.
            </Typography>
          </Box>

          <Dashboard
            sx={{ fontSize: 32, color: "#3769e8", flexShrink: 0 }}
          />
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {quickActions.map((action) => (
              <Grid item xs={12} sm={6} md={4} key={action.title}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(action.path)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(action.path);
                    }
                  }}
                  sx={{
                    p: 2.5,
                    height: "100%",
                    minHeight: 155,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2.5,
                    cursor: "pointer",
                    transition:
                      "transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      borderColor: action.color,
                      backgroundColor: action.background,
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${action.color}`,
                      outlineOffset: 2,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      mb: 1.5,
                      color: action.color,
                      backgroundColor: action.background,
                    }}
                  >
                    {action.icon}
                  </Avatar>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#243b53",
                    }}
                  >
                    {action.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, lineHeight: 1.6 }}
                  >
                    {action.description}
                  </Typography>

                  <ArrowForward
                    sx={{
                      fontSize: 19,
                      mt: 1.2,
                      color: action.color,
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* FOOTER SUMMARY */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #e7eaf0",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              width: 52,
              height: 52,
              backgroundColor: "#3769e8",
            }}
          >
            {firstName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 800,
                color: "#172b4d",
              }}
            >
              {firstName}'s Administration Workspace
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Keep your platform organized and monitor activity
              through the administration tools.
            </Typography>
          </Box>

          <Chip
            label="Admin"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminDashboard;
