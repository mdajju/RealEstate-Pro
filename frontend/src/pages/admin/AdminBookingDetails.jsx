import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../../api";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  CalendarMonth,
  CheckCircle,
  EventAvailable,
  HomeWork,
  Person,
  Refresh,
  Schedule,
  Tag,
  Visibility,
} from "@mui/icons-material";

function AdminBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD BOOKING
  // =========================================

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getBookingById(id);

      console.log("Booking details response:", result);

      if (result.success) {
        setBooking(result.data);
      } else {
        setError(
          result.message || "Unable to load booking details."
        );
      }
    } catch (err) {
      console.error("Get booking details error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load booking details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "").toUpperCase();

    if (normalizedStatus === "ACCEPTED") {
      return {
        color: "green",
        fontWeight: "bold",
      };
    }

    if (normalizedStatus === "REJECTED") {
      return {
        color: "red",
        fontWeight: "bold",
      };
    }

    if (normalizedStatus === "CANCELLED") {
      return {
        color: "gray",
        fontWeight: "bold",
      };
    }

    if (normalizedStatus === "COMPLETED") {
      return {
        color: "blue",
        fontWeight: "bold",
      };
    }

    if (normalizedStatus === "PENDING") {
      return {
        color: "orange",
        fontWeight: "bold",
      };
    }

    return {
      fontWeight: "bold",
    };
  };

  // =========================================
  // UI HELPERS
  // =========================================

  const getStatusColor = (status) => {
    const normalizedStatus = String(status || "").toUpperCase();

    switch (normalizedStatus) {
      case "ACCEPTED":
        return "success";
      case "REJECTED":
        return "error";
      case "CANCELLED":
        return "default";
      case "COMPLETED":
        return "info";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const cardSx = {
    height: "100%",
    p: { xs: 2.2, sm: 3 },
    borderRadius: 3,
    border: "1px solid #e5eaf2",
    backgroundColor: "#ffffff",
    boxShadow: "0 5px 20px rgba(15, 23, 42, 0.035)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 9px 25px rgba(15, 23, 42, 0.07)",
    },
  };

  const DetailRow = ({ label, value, icon }) => (
    <Box sx={{ py: 1.5 }}>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
      >
        {icon && (
          <Box
            sx={{
              mt: 0.2,
              color: "#64748b",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#64748b",
              fontWeight: 600,
              mb: 0.5,
              letterSpacing: 0.25,
            }}
          >
            {label}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#172554",
              fontWeight: 650,
              overflowWrap: "anywhere",
              lineHeight: 1.7,
            }}
          >
            {value === null || value === undefined || value === ""
              ? "-"
              : value}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mt: 1.5, borderColor: "#eef2f7" }} />
    </Box>
  );

  const SectionHeader = ({ icon, title, subtitle }) => (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{ mb: 2 }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2.5,
          color: "#2563eb",
          backgroundColor: "#eff6ff",
        }}
      >
        {icon}
      </Avatar>

      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: 17,
            color: "#172554",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#64748b", mt: 0.3 }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f7fb",
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 400,
            p: 5,
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #e5eaf2",
          }}
        >
          <CircularProgress
            size={46}
            thickness={4}
            sx={{ color: "#2563eb", mb: 2 }}
          />

          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#172554" }}
          >
            Loading Booking
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 1, color: "#64748b" }}
          >
            Retrieving booking details. Please wait...
          </Typography>
        </Paper>
      </Box>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          backgroundColor: "#f5f7fb",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid #fee2e2",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                color: "#dc2626",
                backgroundColor: "#fef2f2",
                fontSize: 30,
              }}
            >
              !
            </Avatar>

            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#172554", mb: 2 }}
            >
              Unable to Load Booking
            </Typography>

            <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
              {error}
            </Alert>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent="center"
            >
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={loadBooking}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Try Again
              </Button>

              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/admin/bookings")}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Back to Bookings
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }

  // =========================================
  // BOOKING NOT FOUND
  // =========================================

  if (!booking) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          backgroundColor: "#f5f7fb",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 700,
            mx: "auto",
            mt: 4,
            p: 5,
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #e5eaf2",
          }}
        >
          <HomeWork
            sx={{ fontSize: 54, color: "#94a3b8", mb: 2 }}
          />

          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#172554" }}
          >
            Booking Not Found
          </Typography>

          <Typography
            sx={{ color: "#64748b", my: 2 }}
          >
            We could not find a booking associated with this ID.
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/admin/bookings")}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Back to Bookings
          </Button>
        </Paper>
      </Box>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        p: { xs: 1.5, sm: 2.5, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* HEADER */}

        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 2.5, sm: 4 },
            mb: 3,
            borderRadius: 4,
            color: "#ffffff",
            background:
              "linear-gradient(120deg, #172554 0%, #1d4ed8 58%, #4f46e5 100%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 240,
              height: 240,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.07)",
              right: -65,
              top: -110,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Chip
                size="small"
                label="BOOKING MANAGEMENT"
                sx={{
                  color: "#ffffff",
                  backgroundColor: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontWeight: 700,
                  letterSpacing: 0.4,
                }}
              />

              <Chip
                size="small"
                label={`ID: ${booking.id || id}`}
                sx={{
                  color: "#dbeafe",
                  backgroundColor: "rgba(15,23,42,0.18)",
                  fontWeight: 700,
                  maxWidth: 180,
                }}
              />
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: -0.8,
                    fontSize: { xs: 27, sm: 34 },
                  }}
                >
                  Booking Details
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#dbeafe",
                    mt: 1,
                    lineHeight: 1.7,
                  }}
                >
                  Review booking status, property information, and customer
                  details.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/admin/bookings")}
                sx={{
                  flexShrink: 0,
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.55)",
                  borderRadius: 2.5,
                  px: 2.5,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#ffffff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Back to Bookings
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* BOOKING SUMMARY */}

        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                ...cardSx,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 2.5,
                  color: "#2563eb",
                  backgroundColor: "#eff6ff",
                }}
              >
                <EventAvailable />
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontWeight: 600 }}
                >
                  Booking Status
                </Typography>

                <Chip
                  label={booking.status || "Unknown"}
                  color={getStatusColor(booking.status)}
                  size="small"
                  sx={{
                    mt: 0.8,
                    fontWeight: 800,
                    textTransform: "capitalize",
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                ...cardSx,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 2.5,
                  color: "#7c3aed",
                  backgroundColor: "#f5f3ff",
                }}
              >
                <CalendarMonth />
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontWeight: 600 }}
                >
                  Booking Date
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 0.5,
                    color: "#172554",
                    fontWeight: 800,
                    overflowWrap: "anywhere",
                  }}
                >
                  {formatDate(booking.bookingDate)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                ...cardSx,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 2.5,
                  color: "#0f766e",
                  backgroundColor: "#f0fdfa",
                }}
              >
                <Tag />
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontWeight: 600 }}
                >
                  Booking Reference
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 0.5,
                    color: "#172554",
                    fontWeight: 800,
                    overflowWrap: "anywhere",
                  }}
                >
                  {booking.id || id}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* DETAILS GRID */}

        <Grid container spacing={2.5}>
          {/* BOOKING INFORMATION */}

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<CheckCircle />}
                title="Booking Information"
                subtitle="Booking reference and activity details"
              />

              <DetailRow
                label="Booking ID"
                value={booking.id}
                icon={<Tag fontSize="small" />}
              />

              <Box sx={{ py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircle
                    fontSize="small"
                    sx={{ color: "#64748b" }}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#64748b",
                        fontWeight: 600,
                        mb: 0.7,
                      }}
                    >
                      Current Status
                    </Typography>

                    <Chip
                      label={booking.status || "-"}
                      color={getStatusColor(booking.status)}
                      size="small"
                      sx={{ fontWeight: 800 }}
                    />
                  </Box>
                </Stack>
              </Box>

              <Divider sx={{ borderColor: "#eef2f7" }} />

              <DetailRow
                label="Booking Date"
                value={formatDate(booking.bookingDate)}
                icon={<CalendarMonth fontSize="small" />}
              />

              <DetailRow
                label="Message"
                value={booking.message}
              />

              <DetailRow
                label="Created At"
                value={formatDate(booking.createdAt)}
                icon={<Schedule fontSize="small" />}
              />

              <DetailRow
                label="Updated At"
                value={formatDate(booking.updatedAt)}
                icon={<Schedule fontSize="small" />}
              />
            </Paper>
          </Grid>

          {/* PROPERTY INFORMATION */}

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<HomeWork />}
                title="Property Information"
                subtitle="Property associated with this booking"
              />

              <DetailRow
                label="Property ID"
                value={booking.propertyId}
                icon={<Tag fontSize="small" />}
              />

              <DetailRow
                label="Property Title"
                value={booking.propertyTitle}
                icon={<HomeWork fontSize="small" />}
              />

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", lineHeight: 1.8 }}
                >
                  This booking is linked to the property identified above.
                  Use the booking list to return to the booking management
                  screen.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* CUSTOMER INFORMATION */}

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<Person />}
                title="Customer Information"
                subtitle="Customer who made the booking"
              />

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: "#eff6ff",
                }}
              >
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    color: "#ffffff",
                    fontWeight: 800,
                    background:
                      "linear-gradient(135deg, #2563eb, #4f46e5)",
                  }}
                >
                  {(booking.customerName || "C")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#172554",
                      fontWeight: 800,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {booking.customerName || "Customer"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b" }}
                  >
                    Booking customer
                  </Typography>
                </Box>
              </Stack>

              <DetailRow
                label="Customer ID"
                value={booking.customerId}
                icon={<Tag fontSize="small" />}
              />

              <DetailRow
                label="Customer Name"
                value={booking.customerName}
                icon={<Person fontSize="small" />}
              />
            </Paper>
          </Grid>

          {/* OWNER INFORMATION */}

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<HomeWork />}
                title="Owner Information"
                subtitle="Owner associated with the property"
              />

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: "#f0fdfa",
                }}
              >
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    color: "#ffffff",
                    fontWeight: 800,
                    background:
                      "linear-gradient(135deg, #0f766e, #14b8a6)",
                  }}
                >
                  {(booking.ownerName || "O")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#134e4a",
                      fontWeight: 800,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {booking.ownerName || "Property Owner"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b" }}
                  >
                    Property owner
                  </Typography>
                </Box>
              </Stack>

              <DetailRow
                label="Owner ID"
                value={booking.ownerId}
                icon={<Tag fontSize="small" />}
              />

              <DetailRow
                label="Owner Name"
                value={booking.ownerName}
                icon={<Person fontSize="small" />}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* FOOTER */}

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: { xs: 2.5, sm: 3 },
            borderRadius: 3,
            border: "1px solid #e5eaf2",
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ color: "#172554", fontWeight: 800 }}
              >
                Booking overview complete
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 0.5, color: "#64748b" }}
              >
                Review the information above or return to booking management.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Visibility />}
              onClick={() => navigate("/admin/bookings")}
              sx={{
                borderRadius: 2.5,
                px: 3,
                py: 1.3,
                fontWeight: 800,
                textTransform: "none",
                background:
                  "linear-gradient(135deg, #2563eb, #4f46e5)",
                boxShadow: "0 5px 14px rgba(37, 99, 235, 0.2)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1d4ed8, #4338ca)",
                },
              }}
            >
              Back to Bookings
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="caption"
            sx={{ color: "#94a3b8" }}
          >
            RealEstate Pro · Admin Booking Management · Reference: {id}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default AdminBookingDetails;