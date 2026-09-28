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

const BACKEND_URL = "http://localhost:9090";

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

  // ---------------------------------------------------
  // Already full URL
  // ---------------------------------------------------

  if (
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://")
  ) {
    return imageValue;
  }

  // ---------------------------------------------------
  // Blob / data URL
  // ---------------------------------------------------

  if (
    imageValue.startsWith("blob:") ||
    imageValue.startsWith("data:")
  ) {
    return imageValue;
  }

  // ---------------------------------------------------
  // Windows path
  // Example:
  // C:\uploads\house.jpg
  // ---------------------------------------------------

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

  // ---------------------------------------------------
  // Starts with slash
  // Example:
  // /uploads/house.jpg
  // /images/house.jpg
  // /api/...
  // ---------------------------------------------------

  if (imageValue.startsWith("/")) {
    return `${BACKEND_URL}${imageValue}`;
  }

  // ---------------------------------------------------
  // uploads/house.jpg
  // ---------------------------------------------------

  if (
    imageValue.startsWith("uploads/")
  ) {
    return `${BACKEND_URL}/${imageValue}`;
  }

  // ---------------------------------------------------
  // api/... path
  // ---------------------------------------------------

  if (
    imageValue.startsWith("api/")
  ) {
    return `${BACKEND_URL}/${imageValue}`;
  }

  // ---------------------------------------------------
  // Otherwise assume it is a filename
  // ---------------------------------------------------

  return `${BACKEND_URL}/uploads/${imageValue}`;
};

// =====================================================
// EXTRACT IMAGE URL FROM IMAGE OBJECT
// =====================================================

const extractImageUrl = (image) => {
  if (!image) {
    return null;
  }

  // ---------------------------------------------------
  // String image
  // ---------------------------------------------------

  if (typeof image === "string") {
    return normalizeImageUrl(image);
  }

  // ---------------------------------------------------
  // Object image
  // ---------------------------------------------------

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

  // ---------------------------------------------------
  // Direct array
  // ---------------------------------------------------

  if (Array.isArray(response)) {
    return response;
  }

  // ---------------------------------------------------
  // Common Spring Boot response structures
  // ---------------------------------------------------

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

  // ---------------------------------------------------
  // Single image object
  // ---------------------------------------------------

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

  // ---------------------------------------------------
  // Images already included in booking
  // ---------------------------------------------------

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

  // ---------------------------------------------------
  // Single image fields
  // ---------------------------------------------------

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

              // ------------------------------------------------
              // First check if booking already has an image
              // ------------------------------------------------

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

              // ------------------------------------------------
              // Property ID required
              // ------------------------------------------------

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

                // ------------------------------------------------
                // Extract first valid image URL
                // ------------------------------------------------

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

      // ------------------------------------------------
      // GET BOOKINGS
      // ------------------------------------------------

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

      // ------------------------------------------------
      // DEBUG BOOKINGS
      // ------------------------------------------------

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

      // ------------------------------------------------
      // LOAD IMAGES
      // ------------------------------------------------

      const bookingsWithImages =
        await loadPropertyImages(
          data
        );

      // ------------------------------------------------
      // SAVE BOOKINGS
      // ------------------------------------------------

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
        }}
      >

        <CircularProgress />

        <Typography color="text.secondary">
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
          mb: 4,
        }}
      >

        <Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
            }}
          >
            Bookings
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Manage customer bookings
            for your properties
          </Typography>

        </Box>

        <Tooltip title="Refresh Bookings">

          <IconButton
            onClick={loadBookings}
            disabled={loading}
            sx={{
              border: 1,
              borderColor:
                "divider",
            }}
          >

            <Refresh />

          </IconButton>

        </Tooltip>

      </Box>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          mb: 4,
        }}
      >

        <CardContent>

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
          SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          mb: 3,
        }}
      >

        <Chip
          icon={
            <CalendarMonth />
          }
          label={`${filteredBookings.length} Bookings`}
          variant="outlined"
        />

        <Chip
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
        />

        <Chip
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
        />

        <Chip
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
        />

      </Box>

      {/* =================================================
          NO BOOKINGS
      ================================================= */}

      {filteredBookings.length ===
      0 ? (

        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            textAlign: "center",
            py: 8,
          }}
        >

          <CardContent>

            <EventAvailable
              sx={{
                fontSize: 70,
                color:
                  "text.secondary",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              No bookings found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
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
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection:
                        "column",
                      borderRadius: 3,
                      overflow:
                        "hidden",
                      transition:
                        "0.3s",

                      "&:hover": {
                        transform:
                          "translateY(-4px)",
                        boxShadow: 6,
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
                        height: 190,
                        backgroundColor:
                          "#f5f5f5",
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
                          }}
                        />

                      ) : null}

                      {/* =================================
                          FALLBACK
                      ================================= */}

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
                          backgroundColor:
                            "#f5f5f5",
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
                      }}
                    >

                      {/* TITLE + STATUS */}

                      <Box
                        sx={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap: 1,
                          mb: 2,
                        }}
                      >

                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight:
                              700,
                            lineHeight:
                              1.3,
                          }}
                        >
                          {propertyTitle}
                        </Typography>

                        <Chip
                          size="small"
                          label={getStatusLabel(
                            status
                          )}
                          color={getStatusColor(
                            status
                          )}
                        />

                      </Box>

                      {/* CUSTOMER */}

                      <Box
                        sx={{
                          display:
                            "flex",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >

                        <Person
                          fontSize="small"
                          color="action"
                        />

                        <Box>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                600,
                            }}
                          >
                            Customer
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {customerName}
                          </Typography>

                          {customerEmail && (

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
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

                      {/* VISIT DATE */}

                      <Box
                        sx={{
                          display:
                            "flex",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >

                        <CalendarMonth
                          fontSize="small"
                          color="action"
                        />

                        <Box>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                600,
                            }}
                          >
                            Visit Date
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
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
                          gap: 1,
                          mb: 1.5,
                        }}
                      >

                        <AttachMoney
                          fontSize="small"
                        />

                        <Typography
                          sx={{
                            fontWeight:
                              700,
                          }}
                        >
                          {formatPrice(
                            price
                          )}
                        </Typography>

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
                          }}
                        >

                          <LocationOn
                            fontSize="small"
                            color="action"
                          />

                          <Typography
                            variant="body2"
                            color="text.secondary"
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
                      }}
                    >

                      <Button
                        variant="outlined"
                        startIcon={
                          <Visibility />
                        }
                        onClick={() =>
                          navigate(
                            `/owner/bookings/${bookingId}`
                          )
                        }
                        sx={{
                          flex: 1,
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
      >

        <DialogTitle>
          {getActionTitle()}
        </DialogTitle>

        <DialogContent>

          <DialogContentText>
            {getActionMessage()}
          </DialogContentText>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={
              closeActionDialog
            }
            disabled={
              actionLoading
            }
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