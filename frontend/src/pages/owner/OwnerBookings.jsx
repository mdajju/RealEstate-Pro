
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Avatar,
  Stack,
  Badge,
} from "@mui/material";

import {
  Refresh,
  Visibility,
  CheckCircle,
  Cancel,
  DoneAll,
  CalendarMonth,
  Person,
  HomeWork,
  AttachMoney,
  LocationOn,
  Search,
  EventAvailable,
  TrendingUp,
  PendingActions,
  TaskAlt,
  Block,
  ArrowForward,
} from "@mui/icons-material";

import {
  getOwnerBookings,
  getPropertyImages,
  acceptBooking,
  rejectBooking,
  completeBooking,
} from "../../api";

// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL = "https://realestate-pro-backend.onrender.com";

// =====================================================
// GET BOOKING STATUS
// =====================================================

const getBookingStatus = (booking) => {
  const status =
    booking?.status ||
    booking?.bookingStatus ||
    booking?.bookingStatusName ||
    booking?.statusName ||
    "";

  if (!status) {
    return "UNKNOWN";
  }

  return String(status).trim().toUpperCase();
};

// =====================================================
// STATUS LABEL
// =====================================================

const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "PENDING";

    case "ACCEPTED":
      return "ACCEPTED";

    case "REJECTED":
      return "REJECTED";

    case "COMPLETED":
      return "COMPLETED";

    case "CANCELLED":
      return "CANCELLED";

    case "CONFIRMED":
      return "CONFIRMED";

    case "UNKNOWN":
      return "UNKNOWN";

    default:
      return String(status).replace(/_/g, " ");
  }
};

// =====================================================
// STATUS COLOR
// =====================================================

const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "warning";

    case "ACCEPTED":
      return "success";

    case "CONFIRMED":
      return "success";

    case "REJECTED":
      return "error";

    case "COMPLETED":
      return "info";

    case "CANCELLED":
      return "default";

    default:
      return "default";
  }
};

// =====================================================
// PRICE FORMATTER
// =====================================================

const formatPrice = (price) => {
  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return "₹0";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

// =====================================================
// DATE FORMATTER
// =====================================================

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Not specified";
  }

  try {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return String(dateValue);
  }
};

// =====================================================
// NORMALIZE IMAGE URL
// =====================================================

const normalizeImageUrl = (value) => {
  if (!value) {
    return null;
  }

  let imageValue = String(value).trim();

  if (!imageValue) {
    return null;
  }

  if (
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://")
  ) {
    return imageValue;
  }

  if (
    imageValue.startsWith("blob:") ||
    imageValue.startsWith("data:")
  ) {
    return imageValue;
  }

  if (
    imageValue.includes("\\") ||
    /^[A-Za-z]:/.test(imageValue)
  ) {
    imageValue =
      imageValue
        .replace(/\\/g, "/")
        .split("/")
        .pop();

    return `${BACKEND_URL}/uploads/${imageValue}`;
  }

  if (imageValue.startsWith("/")) {
    return `${BACKEND_URL}${imageValue}`;
  }

  if (
    imageValue.startsWith("uploads/")
  ) {
    return `${BACKEND_URL}/${imageValue}`;
  }

  if (
    imageValue.startsWith("api/")
  ) {
    return `${BACKEND_URL}/${imageValue}`;
  }

  return `${BACKEND_URL}/uploads/${imageValue}`;
};

// =====================================================
// EXTRACT IMAGE URL FROM IMAGE OBJECT
// =====================================================

const extractImageUrl = (image) => {
  if (!image) {
    return null;
  }

  if (typeof image === "string") {
    return normalizeImageUrl(image);
  }

  if (typeof image === "object") {
    const possibleValues = [
      image.imageUrl,
      image.url,
      image.path,
      image.imagePath,
      image.filePath,
      image.fileUrl,
      image.image,
      image.src,
      image.location,
      image.fileName,
      image.filename,
      image.name,
    ];

    for (const value of possibleValues) {
      if (value) {
        const normalized =
          normalizeImageUrl(value);

        if (normalized) {
          return normalized;
        }
      }
    }
  }

  return null;
};

// =====================================================
// EXTRACT IMAGE ARRAY FROM API RESPONSE
// =====================================================

const extractImageArray = (response) => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    Array.isArray(response.data.data)
  ) {
    return response.data.data;
  }

  if (
    response.data &&
    Array.isArray(response.data.content)
  ) {
    return response.data.content;
  }

  if (Array.isArray(response.images)) {
    return response.images;
  }

  if (
    response.data &&
    Array.isArray(response.data.images)
  ) {
    return response.data.images;
  }

  if (Array.isArray(response.content)) {
    return response.content;
  }

  if (
    response.imageUrl ||
    response.url ||
    response.path ||
    response.filePath ||
    response.fileName
  ) {
    return [response];
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    (
      response.data.imageUrl ||
      response.data.url ||
      response.data.path ||
      response.data.filePath ||
      response.data.fileName
    )
  ) {
    return [response.data];
  }

  return [];
};

// =====================================================
// GET PROPERTY ID
// =====================================================

const getPropertyIdFromBooking = (booking) => {
  return (
    booking?.propertyId ||
    booking?.property?.id ||
    booking?.property?.propertyId ||
    booking?.propertyID ||
    null
  );
};

// =====================================================
// GET BOOKING IMAGE
// =====================================================

const getBookingImageFromBooking = (booking) => {
  const property =
    booking?.property || {};

  const images =
    property?.images ||
    booking?.propertyImages ||
    booking?.images;

  if (
    Array.isArray(images) &&
    images.length > 0
  ) {
    for (const image of images) {
      const url =
        extractImageUrl(image);

      if (url) {
        return url;
      }
    }
  }

  const possibleImages = [
    booking?.imageUrl,
    booking?.propertyImage,
    booking?.propertyImageUrl,

    property?.imageUrl,
    property?.image,
    property?.propertyImage,
    property?.propertyImageUrl,
    property?.thumbnail,
  ];

  for (const image of possibleImages) {
    const url =
      extractImageUrl(image);

    if (url) {
      return url;
    }
  }

  return null;
};

// =====================================================
// OWNER BOOKINGS
// =====================================================

function OwnerBookings() {
  const navigate = useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [bookings, setBookings] =
    useState([]);

  const [filteredBookings, setFilteredBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // ===================================================
  // ACTION DIALOG
  // ===================================================

  const [actionDialogOpen, setActionDialogOpen] =
    useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [selectedAction, setSelectedAction] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  // ===================================================
  // LOAD PROPERTY IMAGES
  // ===================================================

  const loadPropertyImages =
    async (bookingList) => {

      console.log(
        "========================================"
      );

      console.log(
        "LOADING PROPERTY IMAGES..."
      );

      console.log(
        "BOOKING COUNT:",
        bookingList.length
      );

      console.log(
        "========================================"
      );

      const bookingsWithImages =
        await Promise.all(
          bookingList.map(
            async (booking) => {

              const propertyId =
                getPropertyIdFromBooking(
                  booking
                );

              const bookingId =
                booking?.id ||
                booking?.bookingId;

              const existingImage =
                getBookingImageFromBooking(
                  booking
                );

              if (existingImage) {

                console.log(
                  "IMAGE ALREADY FOUND:",
                  {
                    bookingId,
                    propertyId,
                    image:
                      existingImage,
                  }
                );

                return {
                  ...booking,
                  propertyImageUrl:
                    existingImage,
                };
              }

              if (!propertyId) {

                console.warn(
                  "NO PROPERTY ID:",
                  {
                    bookingId,
                    booking,
                  }
                );

                return {
                  ...booking,
                  propertyImageUrl:
                    null,
                };
              }

              try {

                console.log(
                  "GETTING PROPERTY IMAGES:",
                  propertyId
                );

                const response =
                  await getPropertyImages(
                    propertyId
                  );

                console.log(
                  "PROPERTY IMAGE RESPONSE:",
                  propertyId,
                  response
                );

                const imageArray =
                  extractImageArray(
                    response
                  );

                console.log(
                  "EXTRACTED PROPERTY IMAGES:",
                  propertyId,
                  imageArray
                );

                let imageUrl = null;

                for (
                  const image
                  of imageArray
                ) {

                  const url =
                    extractImageUrl(
                      image
                    );

                  console.log(
                    "IMAGE OBJECT:",
                    image
                  );

                  console.log(
                    "EXTRACTED IMAGE URL:",
                    url
                  );

                  if (url) {
                    imageUrl = url;
                    break;
                  }
                }

                console.log(
                  "FINAL IMAGE URL:",
                  propertyId,
                  imageUrl
                );

                return {
                  ...booking,
                  propertyImageUrl:
                    imageUrl,
                };

              } catch (imageError) {

                console.error(
                  "PROPERTY IMAGE LOAD ERROR:",
                  {
                    propertyId,
                    bookingId,
                    error:
                      imageError,
                  }
                );

                return {
                  ...booking,
                  propertyImageUrl:
                    null,
                };
              }
            }
          )
        );

      console.log(
        "========================================"
      );

      console.log(
        "BOOKINGS WITH IMAGES:",
        bookingsWithImages
      );

      console.log(
        "========================================"
      );

      bookingsWithImages.forEach(
        (booking) => {

          console.log(
            "IMAGE CHECK:",
            {
              bookingId:
                booking?.id ||
                booking?.bookingId,

              propertyId:
                getPropertyIdFromBooking(
                  booking
                ),

              image:
                booking?.propertyImageUrl,
            }
          );
        }
      );

      return bookingsWithImages;
    };

  // ===================================================
  // LOAD OWNER BOOKINGS
  // ===================================================

  const loadBookings = async () => {

    try {

      setLoading(true);
      setError("");

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
        user.userId ||
        user.id;

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

      const response =
        await getOwnerBookings(
          ownerId
        );

      console.log(
        "OWNER BOOKINGS RESPONSE:",
        response
      );

      let data = [];

      if (
        response &&
        Array.isArray(response.data)
      ) {

        data = response.data;

      } else if (
        Array.isArray(response)
      ) {

        data = response;

      } else if (
        response &&
        response.data &&
        Array.isArray(
          response.data.content
        )
      ) {

        data =
          response.data.content;

      } else if (
        response &&
        Array.isArray(
          response.content
        )
      ) {

        data =
          response.content;
      }

      console.log(
        "OWNER BOOKINGS:",
        data
      );

      data.forEach(
        (booking) => {

          console.log(
            "BOOKING DEBUG:",
            {
              id:
                booking?.id ||
                booking?.bookingId,

              status:
                booking?.status ||
                booking?.bookingStatus,

              customerId:
                booking?.customerId,

              customer:
                booking?.customer,

              propertyId:
                booking?.propertyId,

              property:
                booking?.property,

              visitDate:
                booking?.visitDate,

              price:
                booking?.propertyPrice ||
                booking?.price,

              propertyIdResolved:
                getPropertyIdFromBooking(
                  booking
                ),
            }
          );
        }
      );

      const bookingsWithImages =
        await loadPropertyImages(
          data
        );

      setBookings(
        bookingsWithImages
      );

      setFilteredBookings(
        bookingsWithImages
      );

    } catch (err) {

      console.error(
        "OWNER BOOKINGS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load owner bookings."
      );

    } finally {

      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    loadBookings();

  }, []);

  // ===================================================
  // SEARCH + FILTER
  // ===================================================

  useEffect(() => {

    let result =
      [...bookings];

    const searchValue =
      search
        .trim()
        .toLowerCase();

    if (searchValue) {

      result =
        result.filter(
          (booking) => {

            const property =
              booking?.property ||
              {};

            const customer =
              booking?.customer ||
              booking?.user ||
              {};

            const propertyTitle =
              booking?.propertyTitle ||
              property?.title ||
              property?.propertyTitle ||
              "";

            const customerName =
              booking?.customerName ||
              customer?.name ||
              [
                customer?.firstName,
                customer?.lastName,
              ]
                .filter(Boolean)
                .join(" ");

            const customerEmail =
              booking?.customerEmail ||
              customer?.email ||
              "";

            const customerMobile =
              booking?.customerMobile ||
              customer?.mobile ||
              customer?.phone ||
              "";

            const city =
              booking?.cityName ||
              property?.cityName ||
              property?.city?.name ||
              "";

            return (
              String(
                propertyTitle
              )
                .toLowerCase()
                .includes(searchValue) ||

              String(
                customerName
              )
                .toLowerCase()
                .includes(searchValue) ||

              String(
                customerEmail
              )
                .toLowerCase()
                .includes(searchValue) ||

              String(
                customerMobile
              )
                .toLowerCase()
                .includes(searchValue) ||

              String(
                city
              )
                .toLowerCase()
                .includes(searchValue)
            );
          }
        );
    }

    if (
      statusFilter !== "ALL"
    ) {

      result =
        result.filter(
          (booking) =>
            getBookingStatus(
              booking
            ) === statusFilter
        );
    }

    setFilteredBookings(
      result
    );

  }, [
    search,
    statusFilter,
    bookings,
  ]);

  // ===================================================
  // OPEN ACTION DIALOG
  // ===================================================

  const openActionDialog = (
    booking,
    action
  ) => {

    setSelectedBooking(
      booking
    );

    setSelectedAction(
      action
    );

    setActionDialogOpen(
      true
    );
  };

  // ===================================================
  // CLOSE ACTION DIALOG
  // ===================================================

  const closeActionDialog = () => {

    if (actionLoading) {
      return;
    }

    setActionDialogOpen(
      false
    );

    setSelectedBooking(
      null
    );

    setSelectedAction(
      ""
    );
  };

  // ===================================================
  // CONFIRM ACTION
  // ===================================================

  const handleActionConfirm =
    async () => {

      if (!selectedBooking) {
        return;
      }

      const bookingId =
        selectedBooking?.id ||
        selectedBooking?.bookingId;

      if (!bookingId) {

        setError(
          "Booking ID not found."
        );

        return;
      }

      try {

        setActionLoading(
          true
        );

        setError("");

        if (
          selectedAction ===
          "ACCEPT"
        ) {

          await acceptBooking(
            bookingId
          );
        }

        if (
          selectedAction ===
          "REJECT"
        ) {

          await rejectBooking(
            bookingId
          );
        }

        if (
          selectedAction ===
          "COMPLETE"
        ) {

          await completeBooking(
            bookingId
          );
        }

        setActionDialogOpen(
          false
        );

        setSelectedBooking(
          null
        );

        setSelectedAction(
          ""
        );

        await loadBookings();

      } catch (err) {

        console.error(
          "BOOKING ACTION ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
          "Failed to update booking."
        );

      } finally {

        setActionLoading(
          false
        );
      }
    };

  // ===================================================
  // ACTION TITLE
  // ===================================================

  const getActionTitle = () => {

    switch (
      selectedAction
    ) {

      case "ACCEPT":
        return "Accept Booking?";

      case "REJECT":
        return "Reject Booking?";

      case "COMPLETE":
        return "Complete Booking?";

      default:
        return "Update Booking?";
    }
  };

  // ===================================================
  // ACTION MESSAGE
  // ===================================================

  const getActionMessage = () => {

    const title =
      selectedBooking?.propertyTitle ||
      selectedBooking?.property?.title ||
      "this property";

    switch (
      selectedAction
    ) {

      case "ACCEPT":

        return `Are you sure you want to accept the booking for ${title}?`;

      case "REJECT":

        return `Are you sure you want to reject the booking for ${title}?`;

      case "COMPLETE":

        return `Mark the booking for ${title} as completed?`;

      default:

        return "Are you sure you want to continue?";
    }
  };

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
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        }}
      >

        <CircularProgress size={48} />

        <Typography
          color="text.secondary"
          sx={{
            fontWeight: 600,
          }}
        >
          Loading your bookings...
        </Typography>

      </Box>
    );
  }

  // ===================================================
  // MAIN UI
  // ===================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
        }}
      >

        <Box
          sx={{
            p: {
              xs: 2.5,
              md: 3.5,
            },
            display: "flex",
            justifyContent:
              "space-between",
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

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 0.5,
              }}
            >

              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                }}
              >
                <EventAvailable />
              </Avatar>

              <Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: -0.5,
                  }}
                >
                  Bookings
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: 14,
                  }}
                >
                  Manage customer bookings
                  for your properties
                </Typography>

              </Box>

            </Box>

          </Box>

          <Tooltip title="Refresh Bookings">

            <IconButton
              onClick={loadBookings}
              disabled={loading}
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                border: "1px solid",
                borderColor:
                  "divider",
                backgroundColor:
                  "background.paper",
                "&:hover": {
                  backgroundColor:
                    "action.hover",
                  transform:
                    "rotate(45deg)",
                },
                transition:
                  "all 0.25s ease",
              }}
            >

              <Refresh />

            </IconButton>

          </Tooltip>

        </Box>

      </Card>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor:
              "error.light",
          }}
        >
          {error}
        </Alert>

      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
        }}
      >

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >

          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                "divider",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            }}
          >

            <CardContent
              sx={{
                p: 2.5,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
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
                    Total Bookings
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mt: 0.5,
                    }}
                  >
                    {bookings.length}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    All customer requests
                  </Typography>

                </Box>

                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                  }}
                >
                  <CalendarMonth />
                </Avatar>

              </Box>

            </CardContent>

          </Card>

        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >

          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                "warning.light",
              background:
                "linear-gradient(135deg, #fffdf5 0%, #fff8e1 100%)",
            }}
          >

            <CardContent
              sx={{
                p: 2.5,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
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
                    Pending
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mt: 0.5,
                    }}
                  >
                    {
                      bookings.filter(
                        (booking) =>
                          getBookingStatus(
                            booking
                          ) ===
                          "PENDING"
                      ).length
                    }
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Need your attention
                  </Typography>

                </Box>

                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                  }}
                >
                  <PendingActions />
                </Avatar>

              </Box>

            </CardContent>

          </Card>

        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >

          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                "success.light",
              background:
                "linear-gradient(135deg, #f5fff8 0%, #ecfdf3 100%)",
            }}
          >

            <CardContent
              sx={{
                p: 2.5,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
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
                    Accepted
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mt: 0.5,
                    }}
                  >
                    {
                      bookings.filter(
                        (booking) =>
                          getBookingStatus(
                            booking
                          ) ===
                          "ACCEPTED"
                      ).length
                    }
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Active bookings
                  </Typography>

                </Box>

                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                  }}
                >
                  <CheckCircle />
                </Avatar>

              </Box>

            </CardContent>

          </Card>

        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >

          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                "info.light",
              background:
                "linear-gradient(135deg, #f5fbff 0%, #eaf7ff 100%)",
            }}
          >

            <CardContent
              sx={{
                p: 2.5,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
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
                    Completed
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mt: 0.5,
                    }}
                  >
                    {
                      bookings.filter(
                        (booking) =>
                          getBookingStatus(
                            booking
                          ) ===
                          "COMPLETED"
                      ).length
                    }
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
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                  }}
                >
                  <TaskAlt />
                </Avatar>

              </Box>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          mb: 3,
          border: "1px solid",
          borderColor:
            "divider",
          backgroundColor:
            "background.paper",
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 2.5,
            },
          }}
        >

          <Grid
            container
            spacing={2}
          >

            <Grid
              size={{
                xs: 12,
                md: 8,
              }}
            >

              <TextField
                fullWidth
                label="Search Bookings"
                placeholder="Search by property, customer, email, mobile or city..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                InputProps={{
                  startAdornment: (
                    <Search
                      sx={{
                        mr: 1,
                        color:
                          "text.secondary",
                      }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      borderRadius: 2.5,
                    },
                }}
              />

            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >

              <TextField
                select
                fullWidth
                label="Filter by Status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      borderRadius: 2.5,
                    },
                }}
              >

                <MenuItem value="ALL">
                  All Bookings
                </MenuItem>

                <MenuItem value="PENDING">
                  Pending
                </MenuItem>

                <MenuItem value="ACCEPTED">
                  Accepted
                </MenuItem>

                <MenuItem value="REJECTED">
                  Rejected
                </MenuItem>

                <MenuItem value="COMPLETED">
                  Completed
                </MenuItem>

                <MenuItem value="CANCELLED">
                  Cancelled
                </MenuItem>

              </TextField>

            </Grid>

          </Grid>

        </CardContent>

      </Card>

      {/* =================================================
          SUMMARY FILTER CHIPS
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          mb: 3,
          alignItems: "center",
        }}
      >

        <Chip
          icon={
            <CalendarMonth />
          }
          label={`${filteredBookings.length} Bookings`}
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderRadius: 2,
          }}
        />

        <Chip
          icon={<PendingActions />}
          label={`Pending: ${
            bookings.filter(
              (booking) =>
                getBookingStatus(
                  booking
                ) === "PENDING"
            ).length
          }`}
          color="warning"
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderRadius: 2,
          }}
        />

        <Chip
          icon={<CheckCircle />}
          label={`Accepted: ${
            bookings.filter(
              (booking) =>
                getBookingStatus(
                  booking
                ) === "ACCEPTED"
            ).length
          }`}
          color="success"
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderRadius: 2,
          }}
        />

        <Chip
          icon={<DoneAll />}
          label={`Completed: ${
            bookings.filter(
              (booking) =>
                getBookingStatus(
                  booking
                ) === "COMPLETED"
            ).length
          }`}
          color="info"
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderRadius: 2,
          }}
        />

      </Box>

      {/* =================================================
          NO BOOKINGS
      ================================================= */}

      {filteredBookings.length ===
      0 ? (

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            textAlign: "center",
            py: 10,
            border: "1px solid",
            borderColor:
              "divider",
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >

          <CardContent>

            <Avatar
              sx={{
                width: 90,
                height: 90,
                mx: "auto",
                mb: 2,
                borderRadius: 3,
              }}
            >
              <EventAvailable
                sx={{
                  fontSize: 48,
                }}
              />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
              }}
            >
              No bookings found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                maxWidth: 500,
                mx: "auto",
              }}
            >

              {bookings.length ===
              0
                ? "Customers have not booked any of your properties yet."
                : "Try changing your search or status filter."}

            </Typography>

          </CardContent>

        </Card>

      ) : (

        /* =================================================
           BOOKING CARDS
        ================================================= */

        <Grid
          container
          spacing={3}
        >

          {filteredBookings.map(
            (booking) => {

              const bookingId =
                booking?.id ||
                booking?.bookingId;

              const property =
                booking?.property ||
                {};

              const customer =
                booking?.customer ||
                booking?.user ||
                {};

              const propertyTitle =
                booking?.propertyTitle ||
                property?.title ||
                property?.propertyTitle ||
                "Property";

              const customerName =
                booking?.customerName ||
                customer?.name ||
                [
                  customer?.firstName,
                  customer?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                "Customer";

              const customerEmail =
                booking?.customerEmail ||
                customer?.email ||
                "";

              const customerMobile =
                booking?.customerMobile ||
                customer?.mobile ||
                customer?.phone ||
                "";

              const visitDate =
                booking?.visitDate ||
                booking?.bookingDate ||
                booking?.date;

              const price =
                booking?.propertyPrice ||
                booking?.price ||
                property?.price;

              const city =
                booking?.cityName ||
                property?.cityName ||
                property?.city?.name ||
                "";

              const state =
                booking?.stateName ||
                property?.stateName ||
                property?.state?.name ||
                "";

              const location =
                [city, state]
                  .filter(Boolean)
                  .join(", ");

              const status =
                getBookingStatus(
                  booking
                );

              const image =
                booking?.propertyImageUrl ||
                getBookingImageFromBooking(
                  booking
                );

              console.log(
                "CARD IMAGE:",
                {
                  bookingId,
                  propertyId:
                    getPropertyIdFromBooking(
                      booking
                    ),
                  image,
                }
              );

              return (

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                    lg: 4,
                  }}
                  key={bookingId}
                >

                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection:
                        "column",
                      borderRadius: 4,
                      overflow:
                        "hidden",
                      border: "1px solid",
                      borderColor:
                        "divider",
                      backgroundColor:
                        "background.paper",
                      transition:
                        "all 0.3s ease",

                      "&:hover": {
                        transform:
                          "translateY(-7px)",
                        boxShadow:
                          "0 16px 40px rgba(15,23,42,0.12)",
                        borderColor:
                          "primary.light",
                      },
                    }}
                  >

                    {/* =================================
                        PROPERTY IMAGE
                    ================================= */}

                    <Box
                      sx={{
                        position:
                          "relative",
                        width:
                          "100%",
                        height: 220,
                        background:
                          "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)",
                        overflow:
                          "hidden",
                      }}
                    >

                      {image ? (

                        <Box
                          component="img"
                          src={image}
                          alt={
                            propertyTitle
                          }
                          onError={(
                            event
                          ) => {

                            console.error(
                              "IMAGE FAILED TO LOAD:",
                              {
                                bookingId,
                                propertyId:
                                  getPropertyIdFromBooking(
                                    booking
                                  ),
                                image,
                              }
                            );

                            event.currentTarget.style.display =
                              "none";

                            const fallback =
                              event
                                .currentTarget
                                .parentElement
                                ?.querySelector(
                                  ".image-fallback"
                                );

                            if (
                              fallback
                            ) {
                              fallback.style.display =
                                "flex";
                            }
                          }}
                          sx={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "cover",
                            display:
                              "block",
                            transition:
                              "transform 0.5s ease",

                            "&:hover": {
                              transform:
                                "scale(1.06)",
                            },
                          }}
                        />

                      ) : null}

                      {/* IMAGE GRADIENT */}

                      {image && (

                        <Box
                          sx={{
                            position:
                              "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.45))",
                            pointerEvents:
                              "none",
                          }}
                        />

                      )}

                      {/* STATUS */}

                      <Chip
                        size="small"
                        label={getStatusLabel(
                          status
                        )}
                        color={getStatusColor(
                          status
                        )}
                        sx={{
                          position:
                            "absolute",
                          top: 14,
                          right: 14,
                          fontWeight: 800,
                          borderRadius: 2,
                          backdropFilter:
                            "blur(8px)",
                          boxShadow:
                            "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      />

                      {/* BOOKING ID */}

                      <Paper
                        elevation={0}
                        sx={{
                          position:
                            "absolute",
                          bottom: 12,
                          left: 12,
                          px: 1.5,
                          py: 0.7,
                          borderRadius: 2,
                          backgroundColor:
                            "rgba(0,0,0,0.55)",
                          color:
                            "white",
                          backdropFilter:
                            "blur(8px)",
                        }}
                      >

                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          Booking #
                          {String(
                            bookingId
                          ).slice(
                            -6
                          )}
                        </Typography>

                      </Paper>

                      {/* FALLBACK */}

                      <Box
                        className="image-fallback"
                        sx={{
                          position:
                            "absolute",
                          inset: 0,
                          display:
                            image
                              ? "none"
                              : "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          flexDirection:
                            "column",
                          background:
                            "linear-gradient(135deg, #eef2f7 0%, #f8fafc 100%)",
                        }}
                      >

                        <HomeWork
                          sx={{
                            fontSize: 70,
                            color:
                              "text.secondary",
                          }}
                        />

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                            fontWeight: 600,
                          }}
                        >
                          Property Image
                          Unavailable
                        </Typography>

                      </Box>

                    </Box>

                    {/* =================================
                        BOOKING CONTENT
                    ================================= */}

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 2.5,
                      }}
                    >

                      {/* TITLE */}

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight:
                            800,
                          lineHeight:
                            1.3,
                          mb: 2,
                          minHeight: 45,
                        }}
                      >
                        {propertyTitle}
                      </Typography>

                      {/* CUSTOMER */}

                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          mb: 1.5,
                          borderRadius: 2.5,
                          backgroundColor:
                            "action.hover",
                        }}
                      >

                        <Box
                          sx={{
                            display:
                              "flex",
                            gap: 1.2,
                          }}
                        >

                          <Avatar
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: 2,
                            }}
                          >
                            <Person
                              fontSize="small"
                            />
                          </Avatar>

                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontWeight:
                                  600,
                              }}
                            >
                              CUSTOMER
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight:
                                  700,
                              }}
                            >
                              {customerName}
                            </Typography>

                            {customerEmail && (

                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                noWrap
                              >
                                {customerEmail}
                              </Typography>

                            )}

                            {customerMobile && (

                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {customerMobile}
                              </Typography>

                            )}

                          </Box>

                        </Box>

                      </Paper>

                      {/* VISIT DATE */}

                      <Box
                        sx={{
                          display:
                            "flex",
                          gap: 1.2,
                          mb: 1.5,
                        }}
                      >

                        <CalendarMonth
                          fontSize="small"
                          color="action"
                        />

                        <Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontWeight:
                                600,
                            }}
                          >
                            VISIT DATE
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                600,
                            }}
                          >
                            {formatDate(
                              visitDate
                            )}
                          </Typography>

                        </Box>

                      </Box>

                      {/* PRICE */}

                      <Box
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 1.2,
                          mb: 1.5,
                        }}
                      >

                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: 2,
                          }}
                        >
                          <AttachMoney
                            fontSize="small"
                          />
                        </Avatar>

                        <Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontWeight:
                                600,
                            }}
                          >
                            PROPERTY PRICE
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight:
                                800,
                              fontSize:
                                17,
                            }}
                          >
                            {formatPrice(
                              price
                            )}
                          </Typography>

                        </Box>

                      </Box>

                      {/* LOCATION */}

                      {location && (

                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >

                          <LocationOn
                            fontSize="small"
                            color="action"
                          />

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {location}
                          </Typography>

                        </Box>

                      )}

                    </CardContent>

                    <Divider />

                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <Box
                      sx={{
                        p: 1.5,
                        display:
                          "flex",
                        gap: 1,
                        flexWrap:
                          "wrap",
                        backgroundColor:
                          "rgba(248,250,252,0.7)",
                      }}
                    >

                      <Button
                        variant="outlined"
                        startIcon={
                          <Visibility />
                        }
                        endIcon={
                          <ArrowForward
                            sx={{
                              fontSize:
                                16,
                            }}
                          />
                        }
                        onClick={() =>
                          navigate(
                            `/owner/bookings/${bookingId}`
                          )
                        }
                        sx={{
                          flex: 1,
                          minWidth:
                            100,
                          borderRadius: 2,
                          fontWeight:
                            700,
                        }}
                      >
                        View
                      </Button>

                      {/* PENDING */}

                      {status ===
                        "PENDING" && (

                        <>

                          <Tooltip
                            title="Accept Booking"
                          >

                            <IconButton
                              color="success"
                              onClick={() =>
                                openActionDialog(
                                  booking,
                                  "ACCEPT"
                                )
                              }
                              sx={{
                                borderRadius:
                                  2,
                                border:
                                  "1px solid",
                                borderColor:
                                  "success.light",
                                backgroundColor:
                                  "success.50",
                              }}
                            >
                              <CheckCircle />
                            </IconButton>

                          </Tooltip>

                          <Tooltip
                            title="Reject Booking"
                          >

                            <IconButton
                              color="error"
                              onClick={() =>
                                openActionDialog(
                                  booking,
                                  "REJECT"
                                )
                              }
                              sx={{
                                borderRadius:
                                  2,
                                border:
                                  "1px solid",
                                borderColor:
                                  "error.light",
                              }}
                            >
                              <Cancel />
                            </IconButton>

                          </Tooltip>

                        </>

                      )}

                      {/* ACCEPTED */}

                      {status ===
                        "ACCEPTED" && (

                        <Tooltip
                          title="Complete Booking"
                        >

                          <IconButton
                            color="primary"
                            onClick={() =>
                              openActionDialog(
                                booking,
                                "COMPLETE"
                              )
                            }
                            sx={{
                              borderRadius:
                                2,
                              border:
                                "1px solid",
                              borderColor:
                                "primary.light",
                            }}
                          >
                            <DoneAll />
                          </IconButton>

                        </Tooltip>

                      )}

                    </Box>

                  </Card>

                </Grid>
              );
            }
          )}

        </Grid>
      )}

      {/* =================================================
          ACTION CONFIRMATION DIALOG
      ================================================= */}

      <Dialog
        open={actionDialogOpen}
        onClose={
          closeActionDialog
        }
        PaperProps={{
          sx: {
            borderRadius: 4,
            minWidth: {
              xs: "90%",
              sm: 430,
            },
          },
        }}
      >

        <DialogTitle
          sx={{
            fontWeight: 800,
            pb: 1,
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >

            <Avatar
              sx={{
                borderRadius: 2,
              }}
            >
              {selectedAction ===
              "ACCEPT" ? (
                <CheckCircle />
              ) : selectedAction ===
                "REJECT" ? (
                <Cancel />
              ) : (
                <DoneAll />
              )}
            </Avatar>

            {getActionTitle()}

          </Box>

        </DialogTitle>

        <DialogContent>

          <DialogContentText
            sx={{
              lineHeight: 1.7,
            }}
          >
            {getActionMessage()}
          </DialogContentText>

        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            pt: 1,
          }}
        >

          <Button
            onClick={
              closeActionDialog
            }
            disabled={
              actionLoading
            }
            sx={{
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color={
              selectedAction ===
              "REJECT"
                ? "error"
                : "primary"
            }
            onClick={
              handleActionConfirm
            }
            disabled={
              actionLoading
            }
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
            }}
          >
            {actionLoading
              ? "Updating..."
              : "Confirm"}
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}

export default OwnerBookings;
