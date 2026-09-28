import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Grid,
} from "@mui/material";

import {
  ArrowBack,
  Person,
  CalendarMonth,
  AttachMoney,
  LocationOn,
  HomeWork,
  Email,
  Phone,
  CheckCircle,
  Cancel,
  DoneAll,
} from "@mui/icons-material";

import {
  getBookingById,
  acceptBooking,
  rejectBooking,
  completeBooking,
  getPropertyImages,
} from "../../api";

// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL = "http://localhost:9090";

// =====================================================
// STATUS
// =====================================================

const getBookingStatus = (booking) => {
  const status =
    booking?.status ||
    booking?.bookingStatus ||
    booking?.bookingStatusName ||
    booking?.statusName ||
    "";

  return status
    ? String(status).trim().toUpperCase()
    : "UNKNOWN";
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

    case "COMPLETED":
      return "info";

    case "REJECTED":
      return "error";

    case "CANCELLED":
      return "default";

    default:
      return "default";
  }
};

// =====================================================
// PRICE
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
// DATE
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
  } catch {
    return String(dateValue);
  }
};

// =====================================================
// IMAGE URL
// =====================================================

const getImageUrl = (image) => {
  if (!image) {
    return null;
  }

  if (typeof image === "string") {
    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${BACKEND_URL}${image}`;
    }

    return `${BACKEND_URL}/${image}`;
  }

  const imageUrl =
    image?.imageUrl ||
    image?.url ||
    image?.path ||
    image?.imagePath ||
    image?.filePath;

  if (!imageUrl) {
    return null;
  }

  if (String(imageUrl).startsWith("http")) {
    return imageUrl;
  }

  if (String(imageUrl).startsWith("/")) {
    return `${BACKEND_URL}${imageUrl}`;
  }

  return `${BACKEND_URL}/${imageUrl}`;
};

// =====================================================
// OWNER BOOKING DETAILS
// =====================================================

function OwnerBookingDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  // ===================================================
  // STATE
  // ===================================================

  const [booking, setBooking] = useState(null);

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [imageLoading, setImageLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  // ===================================================
  // LOAD BOOKING
  // ===================================================

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError("");

      if (!id) {
        setError("Booking ID not found.");
        return;
      }

      console.log(
        "OWNER BOOKING DETAILS ID:",
        id
      );

      const response =
        await getBookingById(id);

      console.log(
        "OWNER BOOKING DETAILS RESPONSE:",
        response
      );

      let data = response;

      if (
        response &&
        response.data
      ) {
        data = response.data;
      }

      setBooking(data);

    } catch (err) {
      console.error(
        "OWNER BOOKING DETAILS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load booking details."
      );

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOAD PROPERTY IMAGES
  // ===================================================

  const loadPropertyImages = async (
    propertyId
  ) => {
    try {
      setImageLoading(true);

      if (!propertyId) {
        setImages([]);
        return;
      }

      console.log(
        "LOADING PROPERTY IMAGES:",
        propertyId
      );

      const response =
        await getPropertyImages(
          propertyId
        );

      console.log(
        "PROPERTY IMAGE RESPONSE:",
        response
      );

      let imageData = [];

      if (
        Array.isArray(response)
      ) {
        imageData = response;
      } else if (
        response &&
        Array.isArray(response.data)
      ) {
        imageData = response.data;
      } else if (
        response &&
        response.data &&
        Array.isArray(
          response.data.content
        )
      ) {
        imageData =
          response.data.content;
      } else if (
        response &&
        Array.isArray(
          response.images
        )
      ) {
        imageData =
          response.images;
      }

      console.log(
        "EXTRACTED PROPERTY IMAGES:",
        imageData
      );

      setImages(imageData);

    } catch (err) {
      console.error(
        "PROPERTY IMAGE LOAD ERROR:",
        err
      );

      setImages([]);

    } finally {
      setImageLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadBooking();
  }, [id]);

  // ===================================================
  // LOAD IMAGES AFTER BOOKING
  // ===================================================

  useEffect(() => {
    if (!booking) {
      return;
    }

    const property =
      booking?.property || {};

    const propertyId =
      booking?.propertyId ||
      property?.id ||
      property?.propertyId;

    if (propertyId) {
      loadPropertyImages(
        propertyId
      );
    } else {
      setImageLoading(false);
    }
  }, [booking]);

  // ===================================================
  // ACTION
  // ===================================================

  const handleAction = async (
    action
  ) => {
    if (!booking) {
      return;
    }

    const bookingId =
      booking?.id ||
      booking?.bookingId;

    if (!bookingId) {
      setError(
        "Booking ID not found."
      );
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      if (action === "ACCEPT") {
        await acceptBooking(
          bookingId
        );
      }

      if (action === "REJECT") {
        await rejectBooking(
          bookingId
        );
      }

      if (action === "COMPLETE") {
        await completeBooking(
          bookingId
        );
      }

      await loadBooking();

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
      setActionLoading(false);
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
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />

        <Typography color="text.secondary">
          Loading booking details...
        </Typography>
      </Box>
    );
  }

  // ===================================================
  // ERROR / NO DATA
  // ===================================================

  if (!booking) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error ||
            "Booking details not found."}
        </Alert>

        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/owner/bookings")
          }
        >
          Back to Bookings
        </Button>
      </Box>
    );
  }

  // ===================================================
  // DATA
  // ===================================================

  const property =
    booking?.property || {};

  const customer =
    booking?.customer ||
    booking?.user ||
    {};

  const propertyId =
    booking?.propertyId ||
    property?.id ||
    property?.propertyId;

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
    getBookingStatus(booking);

  const propertyType =
    booking?.propertyType ||
    property?.propertyType ||
    property?.type ||
    "";

  const bedrooms =
    booking?.bedrooms ||
    property?.bedrooms;

  const bathrooms =
    booking?.bathrooms ||
    property?.bathrooms;

  const area =
    booking?.area ||
    property?.area ||
    property?.areaSqFt;

  const description =
    booking?.propertyDescription ||
    property?.description ||
    "";

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
        maxWidth: 1400,
        mx: "auto",
      }}
    >

      {/* ================================================
          HEADER
      ================================================ */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/owner/bookings")
          }
        >
          Back
        </Button>

        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
            }}
          >
            Booking Details
          </Typography>

          <Typography
            color="text.secondary"
          >
            Complete information about this booking
          </Typography>
        </Box>

      </Box>

      {/* ================================================
          ERROR
      ================================================ */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* ================================================
          STATUS
      ================================================ */}

      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >

        <CardContent>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >

            <Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                }}
              >
                {propertyTitle}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Booking ID:{" "}
                {booking?.id ||
                  booking?.bookingId ||
                  "N/A"}
              </Typography>

            </Box>

            <Chip
              label={status}
              color={getStatusColor(
                status
              )}
              sx={{
                fontWeight: 700,
              }}
            />

          </Box>

        </CardContent>

      </Card>

      {/* ================================================
          PROPERTY + CUSTOMER
      ================================================ */}

      <Grid
        container
        spacing={3}
      >

        {/* ==============================================
            PROPERTY
        ============================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 7,
          }}
        >

          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
            }}
          >

            {/* IMAGE */}

            {imageLoading ? (

              <Box
                sx={{
                  height: 350,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    "action.hover",
                }}
              >
                <CircularProgress />
              </Box>

            ) : images.length > 0 ? (

              <Box
                component="img"
                src={getImageUrl(
                  images[0]
                )}
                alt={propertyTitle}
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
                sx={{
                  width: "100%",
                  height: 350,
                  objectFit: "cover",
                  display: "block",
                }}
              />

            ) : (

              <Box
                sx={{
                  height: 350,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    "action.hover",
                }}
              >

                <HomeWork
                  sx={{
                    fontSize: 90,
                    color:
                      "text.secondary",
                  }}
                />

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Property image unavailable
                </Typography>

              </Box>

            )}

            <CardContent>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                Property Information
              </Typography>

              <Grid
                container
                spacing={2}
              >

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Typography
                    color="text.secondary"
                  >
                    Property
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {propertyTitle}
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Typography
                    color="text.secondary"
                  >
                    Property Type
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {propertyType ||
                      "Not specified"}
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Typography
                    color="text.secondary"
                  >
                    Price
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {formatPrice(price)}
                  </Typography>
                </Grid>

                {bedrooms !==
                  undefined && (
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <Typography
                      color="text.secondary"
                    >
                      Bedrooms
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {bedrooms}
                    </Typography>
                  </Grid>
                )}

                {bathrooms !==
                  undefined && (
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <Typography
                      color="text.secondary"
                    >
                      Bathrooms
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {bathrooms}
                    </Typography>
                  </Grid>
                )}

                {area !==
                  undefined && (
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <Typography
                      color="text.secondary"
                    >
                      Area
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {area} sq.ft
                    </Typography>
                  </Grid>
                )}

                {location && (
                  <Grid
                    size={{
                      xs: 12,
                    }}
                  >

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems:
                          "flex-start",
                      }}
                    >

                      <LocationOn
                        color="action"
                      />

                      <Box>

                        <Typography
                          color="text.secondary"
                        >
                          Location
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {location}
                        </Typography>

                      </Box>

                    </Box>

                  </Grid>
                )}

              </Grid>

              {description && (
                <>
                  <Divider
                    sx={{
                      my: 3,
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Description
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    {description}
                  </Typography>
                </>
              )}

            </CardContent>

          </Card>

        </Grid>

        {/* ==============================================
            CUSTOMER + BOOKING
        ============================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 5,
          }}
        >

          {/* CUSTOMER */}

          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              mb: 3,
            }}
          >

            <CardContent>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                }}
              >
                Customer Information
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                }}
              >

                <Person color="action" />

                <Box>
                  <Typography
                    color="text.secondary"
                  >
                    Name
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {customerName}
                  </Typography>
                </Box>

              </Box>

              {customerEmail && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                  }}
                >

                  <Email color="action" />

                  <Box>
                    <Typography
                      color="text.secondary"
                    >
                      Email
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {customerEmail}
                    </Typography>
                  </Box>

                </Box>
              )}

              {customerMobile && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >

                  <Phone color="action" />

                  <Box>
                    <Typography
                      color="text.secondary"
                    >
                      Mobile
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {customerMobile}
                    </Typography>
                  </Box>

                </Box>
              )}

            </CardContent>

          </Card>

          {/* BOOKING */}

          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              mb: 3,
            }}
          >

            <CardContent>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                }}
              >
                Booking Information
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                }}
              >

                <CalendarMonth
                  color="action"
                />

                <Box>

                  <Typography
                    color="text.secondary"
                  >
                    Visit Date
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {formatDate(
                      visitDate
                    )}
                  </Typography>

                </Box>

              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                }}
              >

                <AttachMoney
                  color="action"
                />

                <Box>

                  <Typography
                    color="text.secondary"
                  >
                    Property Price
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {formatPrice(price)}
                  </Typography>

                </Box>

              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >

                <HomeWork
                  color="action"
                />

                <Box>

                  <Typography
                    color="text.secondary"
                  >
                    Status
                  </Typography>

                  <Chip
                    size="small"
                    label={status}
                    color={getStatusColor(
                      status
                    )}
                  />

                </Box>

              </Box>

            </CardContent>

          </Card>

          {/* ACTIONS */}

          {(status === "PENDING" ||
            status === "ACCEPTED") && (

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
                  Booking Actions
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    flexWrap: "wrap",
                  }}
                >

                  {status === "PENDING" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={
                          <CheckCircle />
                        }
                        onClick={() =>
                          handleAction(
                            "ACCEPT"
                          )
                        }
                        disabled={
                          actionLoading
                        }
                      >
                        Accept
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        startIcon={
                          <Cancel />
                        }
                        onClick={() =>
                          handleAction(
                            "REJECT"
                          )
                        }
                        disabled={
                          actionLoading
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {status === "ACCEPTED" && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={
                        <DoneAll />
                      }
                      onClick={() =>
                        handleAction(
                          "COMPLETE"
                        )
                      }
                      disabled={
                        actionLoading
                      }
                    >
                      Complete
                    </Button>
                  )}

                </Box>

              </CardContent>

            </Card>

          )}

        </Grid>

      </Grid>

    </Box>
  );
}

export default OwnerBookingDetails;