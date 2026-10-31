
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
} from "../../api";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  CalendarMonth,
  CheckCircle,
  Cancel,
  HourglassTop,
  Refresh,
  Search,
  Visibility,
  HomeWork,
  Person,
  AssignmentTurnedIn,
  Schedule,
  MessageOutlined,
  VerifiedUser,
  AdminPanelSettings,
} from "@mui/icons-material";

function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [actionId, setActionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // =========================================
  // LOAD ALL BOOKINGS
  // =========================================

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAllBookings();

      console.log("Bookings response:", result);

      if (result.success) {
        setBookings(result.data || []);
      } else {
        setError(
          result.message ||
            "Unable to load bookings."
        );
      }
    } catch (err) {
      console.error(
        "Get bookings error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // ACCEPT BOOKING
  // =========================================

  const handleAccept = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(bookingId);
      setMessage("");
      setError("");

      const result =
        await acceptBooking(bookingId);

      console.log(
        "Accept booking response:",
        result
      );

      if (result.success) {
        setMessage(
          result.message ||
            "Booking accepted successfully."
        );

        await loadBookings();
      } else {
        setError(
          result.message ||
            "Unable to accept booking."
        );
      }
    } catch (err) {
      console.error(
        "Accept booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to accept booking."
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================================
  // REJECT BOOKING
  // =========================================

  const handleReject = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(bookingId);
      setMessage("");
      setError("");

      const result =
        await rejectBooking(bookingId);

      console.log(
        "Reject booking response:",
        result
      );

      if (result.success) {
        setMessage(
          result.message ||
            "Booking rejected successfully."
        );

        await loadBookings();
      } else {
        setError(
          result.message ||
            "Unable to reject booking."
        );
      }
    } catch (err) {
      console.error(
        "Reject booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to reject booking."
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================================
  // COMPLETE BOOKING
  // =========================================

  const handleComplete = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to complete this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(bookingId);
      setMessage("");
      setError("");

      const result =
        await completeBooking(bookingId);

      console.log(
        "Complete booking response:",
        result
      );

      if (result.success) {
        setMessage(
          result.message ||
            "Booking completed successfully."
        );

        await loadBookings();
      } else {
        setError(
          result.message ||
            "Unable to complete booking."
        );
      }
    } catch (err) {
      console.error(
        "Complete booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to complete booking."
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {
    const normalizedStatus =
      String(status || "").toUpperCase();

    if (normalizedStatus === "ACCEPTED") {
      return {
        color: "success",
        backgroundColor: "#e8f5e9",
      };
    }

    if (normalizedStatus === "REJECTED") {
      return {
        color: "error",
        backgroundColor: "#ffebee",
      };
    }

    if (normalizedStatus === "CANCELLED") {
      return {
        color: "default",
        backgroundColor: "#eceff1",
      };
    }

    if (normalizedStatus === "COMPLETED") {
      return {
        color: "info",
        backgroundColor: "#e3f2fd",
      };
    }

    if (normalizedStatus === "PENDING") {
      return {
        color: "warning",
        backgroundColor: "#fff3e0",
      };
    }

    return {
      color: "default",
      backgroundColor: "#f5f5f5",
    };
  };

  const getStatusIcon = (status) => {
    const normalizedStatus =
      String(status || "").toUpperCase();

    if (normalizedStatus === "ACCEPTED") {
      return <CheckCircle fontSize="small" />;
    }

    if (normalizedStatus === "REJECTED") {
      return <Cancel fontSize="small" />;
    }

    if (normalizedStatus === "CANCELLED") {
      return <Cancel fontSize="small" />;
    }

    if (normalizedStatus === "COMPLETED") {
      return <AssignmentTurnedIn fontSize="small" />;
    }

    if (normalizedStatus === "PENDING") {
      return <HourglassTop fontSize="small" />;
    }

    return <CalendarMonth fontSize="small" />;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================
  // SUMMARY COUNTS
  // =========================================

  const pendingBookings = bookings.filter(
    (booking) =>
      String(booking.status || "").toUpperCase() ===
      "PENDING"
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) =>
      String(booking.status || "").toUpperCase() ===
      "ACCEPTED"
  ).length;

  const completedBookings = bookings.filter(
    (booking) =>
      String(booking.status || "").toUpperCase() ===
      "COMPLETED"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) =>
      String(booking.status || "").toUpperCase() ===
      "REJECTED"
  ).length;

  // =========================================
  // SEARCH
  // =========================================

  const filteredBookings = bookings.filter((booking) => {
    const searchableText = [
      booking.id,
      booking.propertyId,
      booking.propertyTitle,
      booking.customerId,
      booking.customerName,
      booking.ownerId,
      booking.ownerName,
      booking.bookingDate,
      booking.message,
      booking.status,
    ]
      .map((value) => String(value || ""))
      .join(" ")
      .toLowerCase();

    return searchableText.includes(
      searchTerm.trim().toLowerCase()
    );
  });

  // =========================================
  // REUSABLE INFORMATION ITEM
  // =========================================

  const InfoItem = ({ icon, label, value }) => (
    <Stack
      direction="row"
      spacing={1.2}
      alignItems="flex-start"
      sx={{ minWidth: 0 }}
    >
      <Avatar
        sx={{
          width: 35,
          height: 35,
          bgcolor: "#edf4ff",
          color: "#1769aa",
        }}
      >
        {icon}
      </Avatar>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ display: "block" }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            mt: 0.3,
            color: "#26384a",
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap",
          }}
        >
          {value || "-"}
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
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#f5f7fb",
        }}
      >
        <CircularProgress size={48} />

        <Typography
          variant="h6"
          fontWeight={700}
          color="text.secondary"
        >
          Loading bookings...
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Please wait while we retrieve booking records.
        </Typography>
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
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* PAGE HEADER */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 3,
          borderRadius: 4,
          color: "#fff",
          background:
            "linear-gradient(135deg, #102a43 0%, #1769aa 55%, #42a5f5 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.07)",
            top: -100,
            right: -50,
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={3}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <Avatar
                sx={{
                  width: 54,
                  height: 54,
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                }}
              >
                <CalendarMonth fontSize="large" />
              </Avatar>

              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    fontSize: { xs: "1.6rem", md: "2rem" },
                  }}
                >
                  Booking Management
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.82)" }}
                >
                  RealEstate Pro · Admin Console
                </Typography>
              </Box>
            </Stack>

            <Typography
              variant="body1"
              sx={{
                mt: 2,
                maxWidth: 620,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Monitor property bookings, review customer requests,
              and manage booking approvals from one place.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadBookings}
            sx={{
              color: "#fff",
              borderColor: "rgba(255,255,255,0.6)",
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Refresh Bookings
          </Button>
        </Stack>
      </Paper>

      {/* SUCCESS MESSAGE */}

      {message && (
        <Alert
          severity="success"
          onClose={() => setMessage("")}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {message}
        </Alert>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* SUMMARY CARDS */}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* TOTAL */}

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid #e7edf5",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 28px rgba(16,42,67,0.08)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Total Bookings
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ mt: 1, color: "#163a5f" }}
                  >
                    {bookings.length}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    All booking records
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 54,
                    height: 54,
                    bgcolor: "#e3f2fd",
                    color: "#1565c0",
                  }}
                >
                  <CalendarMonth />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* PENDING */}

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid #e7edf5",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 28px rgba(16,42,67,0.08)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Pending Bookings
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ mt: 1, color: "#ed6c02" }}
                  >
                    {pendingBookings}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Awaiting your decision
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 54,
                    height: 54,
                    bgcolor: "#fff3e0",
                    color: "#ed6c02",
                  }}
                >
                  <HourglassTop />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ACCEPTED */}

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid #e7edf5",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 28px rgba(16,42,67,0.08)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Accepted Bookings
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ mt: 1, color: "#16834a" }}
                  >
                    {acceptedBookings}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Approved requests
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 54,
                    height: 54,
                    bgcolor: "#e5f7ed",
                    color: "#16834a",
                  }}
                >
                  <CheckCircle />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* COMPLETED */}

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid #e7edf5",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 28px rgba(16,42,67,0.08)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Completed Bookings
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ mt: 1, color: "#087e8b" }}
                  >
                    {completedBookings}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Successfully completed
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 54,
                    height: 54,
                    bgcolor: "#e0f7fa",
                    color: "#00838f",
                  }}
                >
                  <AssignmentTurnedIn />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* BOOKING LIST */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e7edf5",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 2.5 }}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
                color="#163a5f"
              >
                All Bookings
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                View booking details and manage request status.
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              sx={{
                width: { xs: "100%", sm: 300 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#fff",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Divider sx={{ mb: 2.5 }} />

          {/* NO BOOKINGS */}

          {bookings.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 76,
                  height: 76,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "#eaf2fb",
                  color: "#1769aa",
                }}
              >
                <CalendarMonth sx={{ fontSize: 38 }} />
              </Avatar>

              <Typography variant="h6" fontWeight={700}>
                No bookings found
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 3 }}
              >
                Booking requests will appear here when available.
              </Typography>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadBookings}
              >
                Refresh Bookings
              </Button>
            </Box>
          ) : filteredBookings.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 7,
                px: 2,
              }}
            >
              <Search
                sx={{
                  fontSize: 48,
                  color: "#90a4ae",
                  mb: 1,
                }}
              />

              <Typography variant="h6" fontWeight={700}>
                No matching bookings
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 2 }}
              >
                Try searching by booking ID, property, customer,
                owner, or status.
              </Typography>

              <Button
                variant="outlined"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </Box>
          ) : (
            <>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Showing{" "}
                  <strong>{filteredBookings.length}</strong>{" "}
                  of <strong>{bookings.length}</strong> bookings
                </Typography>

                <Chip
                  size="small"
                  label={`${filteredBookings.length} bookings`}
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Grid container spacing={2.5}>
                {filteredBookings.map((booking) => {
                  const normalizedStatus = String(
                    booking.status || ""
                  ).toUpperCase();

                  const statusStyle = getStatusStyle(
                    booking.status
                  );

                  return (
                    <Grid
                      item
                      xs={12}
                      lg={6}
                      key={booking.id}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 3,
                          border: "1px solid #e5eaf1",
                          transition: "all 0.25s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow:
                              "0 14px 32px rgba(16,42,67,0.10)",
                            borderColor: "#bbd7f5",
                          },
                        }}
                      >
                        {/* BOOKING CARD HEADER */}

                        <Box
                          sx={{
                            p: 2.5,
                            background:
                              "linear-gradient(135deg, #f1f7ff 0%, #ffffff 100%)",
                            borderBottom: "1px solid #edf1f6",
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="flex-start"
                            justifyContent="space-between"
                            spacing={2}
                          >
                            <Stack
                              direction="row"
                              spacing={1.5}
                              sx={{ minWidth: 0 }}
                            >
                              <Avatar
                                sx={{
                                  width: 48,
                                  height: 48,
                                  bgcolor: "#dcecff",
                                  color: "#1769aa",
                                }}
                              >
                                <CalendarMonth />
                              </Avatar>

                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  variant="h6"
                                  fontWeight={800}
                                  sx={{
                                    color: "#163a5f",
                                    fontSize: "1.05rem",
                                    overflowWrap: "anywhere",
                                  }}
                                >
                                  Booking Details
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "block",
                                    mt: 0.5,
                                    overflowWrap: "anywhere",
                                  }}
                                >
                                  Booking ID: {booking.id}
                                </Typography>
                              </Box>
                            </Stack>

                            <Chip
                              icon={getStatusIcon(booking.status)}
                              label={booking.status || "-"}
                              color={statusStyle.color}
                              sx={{
                                fontWeight: 700,
                                flexShrink: 0,
                                maxWidth: "45%",
                                "& .MuiChip-label": {
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                },
                              }}
                            />
                          </Stack>
                        </Box>

                        {/* BOOKING INFORMATION */}

                        <CardContent
                          sx={{
                            p: 2.5,
                            flexGrow: 1,
                            "&:last-child": { pb: 2.5 },
                          }}
                        >
                          <Stack spacing={2.5}>
                            {/* PROPERTY */}

                            <Box>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ mb: 1.5 }}
                              >
                                <HomeWork
                                  sx={{ color: "#1769aa" }}
                                />

                                <Typography
                                  variant="subtitle2"
                                  fontWeight={800}
                                  color="#163a5f"
                                >
                                  Property Information
                                </Typography>
                              </Stack>

                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <InfoItem
                                    icon={<HomeWork fontSize="small" />}
                                    label="Property Title"
                                    value={booking.propertyTitle}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <InfoItem
                                    icon={<VerifiedUser fontSize="small" />}
                                    label="Property ID"
                                    value={booking.propertyId}
                                  />
                                </Grid>
                              </Grid>
                            </Box>

                            <Divider />

                            {/* CUSTOMER AND OWNER */}

                            <Box>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ mb: 1.5 }}
                              >
                                <Person
                                  sx={{ color: "#1769aa" }}
                                />

                                <Typography
                                  variant="subtitle2"
                                  fontWeight={800}
                                  color="#163a5f"
                                >
                                  Customer & Owner
                                </Typography>
                              </Stack>

                              <Grid container spacing={2.5}>
                                <Grid item xs={12} sm={6}>
                                  <InfoItem
                                    icon={<Person fontSize="small" />}
                                    label="Customer Name"
                                    value={booking.customerName}
                                  />

                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      display: "block",
                                      ml: 5.7,
                                      mt: 0.5,
                                      overflowWrap: "anywhere",
                                    }}
                                  >
                                    ID: {booking.customerId || "-"}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <InfoItem
                                    icon={<AdminPanelSettings fontSize="small" />}
                                    label="Owner Name"
                                    value={booking.ownerName}
                                  />

                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      display: "block",
                                      ml: 5.7,
                                      mt: 0.5,
                                      overflowWrap: "anywhere",
                                    }}
                                  >
                                    ID: {booking.ownerId || "-"}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>

                            <Divider />

                            {/* DATE AND MESSAGE */}

                            <Grid container spacing={2.5}>
                              <Grid item xs={12} sm={6}>
                                <InfoItem
                                  icon={<Schedule fontSize="small" />}
                                  label="Booking Date"
                                  value={formatDate(booking.bookingDate)}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <InfoItem
                                  icon={<CalendarMonth fontSize="small" />}
                                  label="Created At"
                                  value={formatDate(booking.createdAt)}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <InfoItem
                                  icon={<MessageOutlined fontSize="small" />}
                                  label="Customer Message"
                                  value={booking.message}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <InfoItem
                                  icon={<Refresh fontSize="small" />}
                                  label="Last Updated"
                                  value={formatDate(booking.updatedAt)}
                                />
                              </Grid>
                            </Grid>
                          </Stack>
                        </CardContent>

                        {/* ACTION BUTTONS */}

                        <Divider />

                        <Box sx={{ p: 2 }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                          >
                            <Button
                              variant="outlined"
                              startIcon={<Visibility />}
                              onClick={() =>
                                navigate(
                                  `/admin/bookings/${booking.id}`
                                )
                              }
                              sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                flexGrow: 1,
                              }}
                            >
                              View Details
                            </Button>

                            {normalizedStatus === "PENDING" && (
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  startIcon={
                                    actionId === booking.id ? (
                                      <CircularProgress
                                        size={16}
                                        color="inherit"
                                      />
                                    ) : (
                                      <CheckCircle />
                                    )
                                  }
                                  onClick={() =>
                                    handleAccept(booking.id)
                                  }
                                  disabled={actionId !== null}
                                  sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    flexGrow: 1,
                                    boxShadow: "none",
                                  }}
                                >
                                  {actionId === booking.id
                                    ? "Processing..."
                                    : "Accept"}
                                </Button>

                                <Button
                                  variant="contained"
                                  color="error"
                                  startIcon={<Cancel />}
                                  onClick={() =>
                                    handleReject(booking.id)
                                  }
                                  disabled={actionId !== null}
                                  sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    flexGrow: 1,
                                    boxShadow: "none",
                                  }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}

                            {normalizedStatus === "ACCEPTED" && (
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={
                                  actionId === booking.id ? (
                                    <CircularProgress
                                      size={16}
                                      color="inherit"
                                    />
                                  ) : (
                                    <AssignmentTurnedIn />
                                  )
                                }
                                onClick={() =>
                                  handleComplete(booking.id)
                                }
                                disabled={actionId !== null}
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 2,
                                  flexGrow: 1,
                                  boxShadow: "none",
                                }}
                              >
                                {actionId === booking.id
                                  ? "Processing..."
                                  : "Complete Booking"}
                              </Button>
                            )}
                          </Stack>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </Box>
      </Paper>

      {/* FOOTER */}

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 2.5, px: 0.5 }}
      >
        <CheckCircle
          sx={{ fontSize: 17, color: "#16834a" }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Booking management · RealEstate Pro Admin
        </Typography>
      </Stack>
    </Box>
  );
}

export default AdminBookings;
