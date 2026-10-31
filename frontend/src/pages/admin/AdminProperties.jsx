
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
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
  AddHomeWork,
  Apartment,
  AttachMoney,
  CheckCircle,
  Delete,
  Edit,
  HomeWork,
  LocationOn,
  Refresh,
  Search,
  Visibility,
  Villa,
  WarningAmber,
} from "@mui/icons-material";

import {
  getProperties,
  getPropertyImages,
  deleteProperty,
} from "../../api";

// =====================================================
// BACKEND URL
// Uses VITE_API_BASE_URL when configured.
// Defaults to your existing local Spring Boot backend.
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:9090/api";

const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");

// =====================================================
// BUILD IMAGE URL
// =====================================================

const buildImageUrl = (imageValue) => {
  if (
    imageValue === null ||
    imageValue === undefined
  ) {
    return null;
  }

  const value = String(imageValue).trim();

  if (!value) {
    return null;
  }

  // Already a complete URL
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Base64 or other data URL
  if (value.startsWith("data:")) {
    return value;
  }

  // Protocol-relative URL
  if (value.startsWith("//")) {
    return `${window.location.protocol}${value}`;
  }

  // Relative URL: /uploads/example.jpg
  if (value.startsWith("/")) {
    return `${BACKEND_URL}${value}`;
  }

  // Relative path: uploads/example.jpg
  return `${BACKEND_URL}/${value}`;
};

// =====================================================
// GET IMAGE URL FROM A PROPERTY IMAGE OBJECT
// =====================================================

const getImageUrlFromImage = (image) => {
  if (!image) {
    return null;
  }

  // Backend may return the image itself as a string.
  if (typeof image === "string") {
    return buildImageUrl(image);
  }

  // Common image URL/path fields.
  const imageValue =
    image.imageUrl ||
    image.url ||
    image.path ||
    image.filePath ||
    image.imagePath ||
    image.src;

  if (imageValue) {
    return buildImageUrl(imageValue);
  }

  // Some APIs return only the stored filename.
  const fileName =
    image.fileName ||
    image.filename;

  if (fileName) {
    const normalizedFileName = String(fileName).replace(
      /^\/?uploads\//i,
      ""
    );

    return buildImageUrl(
      `/uploads/${normalizedFileName}`
    );
  }

  return null;
};

// =====================================================
// GET PROPERTY IMAGE
// Supports images returned directly with the property
// or separately by the property-images API.
// =====================================================

const getPropertyImage = (property) => {
  if (
    property?.images &&
    Array.isArray(property.images) &&
    property.images.length > 0
  ) {
    for (const image of property.images) {
      const imageUrl = getImageUrlFromImage(image);

      if (imageUrl) {
        return imageUrl;
      }
    }
  }

  // Support APIs that return one image field directly.
  const directImage =
    property?.imageUrl ||
    property?.image ||
    property?.propertyImage ||
    property?.thumbnail ||
    property?.imagePath ||
    property?.filePath;

  if (directImage) {
    return buildImageUrl(directImage);
  }

  return null;
};

// =====================================================
// NORMALIZE PROPERTY IMAGE API RESPONSE
// =====================================================

const normalizeImagesResponse = (response) => {
  // Response is already an array.
  if (Array.isArray(response)) {
    return response;
  }

  // Common API helper format:
  // { success: true, data: [...] }
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  // Axios response containing the API response:
  // { data: { success: true, data: [...] } }
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  // Other possible response formats.
  if (Array.isArray(response?.images)) {
    return response.images;
  }

  if (Array.isArray(response?.data?.images)) {
    return response.data.images;
  }

  return [];
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
    return "Not specified";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return price;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

// =====================================================
// PROPERTY STATUS COLOR
// =====================================================

const getStatusColor = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "AVAILABLE":
    case "APPROVED":
    case "ACTIVE":
      return "success";

    case "PENDING":
    case "PENDING_APPROVAL":
    case "UNDER_REVIEW":
      return "warning";

    case "REJECTED":
    case "INACTIVE":
    case "SOLD":
      return "error";

    case "BOOKED":
    case "RESERVED":
      return "info";

    default:
      return "default";
  }
};

// =====================================================
// ADMIN PROPERTIES
// =====================================================

function AdminProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ===================================================
  // LOAD IMAGES FOR ONE PROPERTY
  // ===================================================

  const loadPropertyImages = async (property) => {
    if (!property?.id) {
      return property;
    }

    try {
      console.log(
        "Loading images for property:",
        property.id
      );

      const response = await getPropertyImages(property.id);

      console.log(
        "Property image API response:",
        property.id,
        response
      );

      const apiImages = normalizeImagesResponse(response);

      // Prefer images from the dedicated image API.
      // If it returns no images, preserve any images
      // already included in the property response.
      const existingImages = Array.isArray(property.images)
        ? property.images
        : [];

      const images =
        apiImages.length > 0
          ? apiImages
          : existingImages;

      console.log(
        "Property images loaded:",
        property.id,
        images
      );

      return {
        ...property,
        images,
      };
    } catch (err) {
      console.error(
        `Failed to load images for property ${property.id}:`,
        err
      );

      // An image-loading failure should not prevent
      // the property itself from appearing.
      return {
        ...property,
        images: Array.isArray(property.images)
          ? property.images
          : [],
      };
    }
  };

  // ===================================================
  // LOAD PROPERTIES AND THEIR IMAGES
  // ===================================================

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProperties();

      console.log("Properties response:", result);

      let propertyData = [];

      if (Array.isArray(result?.data)) {
        propertyData = result.data;
      } else if (Array.isArray(result)) {
        propertyData = result;
      } else if (Array.isArray(result?.data?.data)) {
        propertyData = result.data.data;
      }

      if (
        result?.success === false &&
        propertyData.length === 0
      ) {
        setError(
          result.message || "Unable to load properties."
        );

        setProperties([]);
        return;
      }

      // Load image records for every property.
      // Promise.all preserves the original property order.
      const propertiesWithImages = await Promise.all(
        propertyData.map((property) =>
          loadPropertyImages(property)
        )
      );

      console.log(
        "Properties with images:",
        propertiesWithImages
      );

      setProperties(propertiesWithImages);
    } catch (err) {
      console.error("Get properties error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadProperties();
  }, []);

  // ===================================================
  // DELETE PROPERTY
  // ===================================================

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setMessage("");
      setError("");

      const result = await deleteProperty(id);

      console.log("Delete property response:", result);

      if (result.success) {
        setMessage(
          result.message ||
            "Property deleted successfully."
        );

        // Remove deleted property from the current list.
        setProperties((previous) =>
          previous.filter(
            (property) => property.id !== id
          )
        );
      } else {
        setError(
          result.message ||
            "Property deletion failed."
        );
      }
    } catch (err) {
      console.error("Delete property error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete property."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ===================================================
  // PROPERTY ICON
  // ===================================================

  const getPropertyIcon = (property) => {
    const type = String(
      property.propertyTypeName ||
        property.propertyType?.name ||
        property.propertyType ||
        property.type ||
        ""
    ).toUpperCase();

    if (type.includes("VILLA")) {
      return <Villa />;
    }

    if (
      type.includes("APARTMENT") ||
      type.includes("FLAT")
    ) {
      return <Apartment />;
    }

    return <HomeWork />;
  };

  // ===================================================
  // ADDRESS
  // ===================================================

  const getAddress = (property) => {
    if (typeof property.address === "string") {
      return property.address || "Address not specified";
    }

    if (
      property.address &&
      typeof property.address === "object"
    ) {
      return [
        property.address.street,
        property.address.city,
        property.address.state,
        property.address.zipCode,
      ]
        .filter(Boolean)
        .join(", ") || "Address not specified";
    }

    // Support address information stored in separate fields.
    const addressParts = [
      property.street,
      property.cityName,
      property.stateName,
      property.zipCode,
    ].filter(Boolean);

    return (
      addressParts.join(", ") ||
      "Address not specified"
    );
  };

  // ===================================================
  // SEARCH
  // ===================================================

  const filteredProperties = properties.filter((property) => {
    const searchableText = [
      property.title,
      property.id,
      property.description,
      property.status,
      property.address,
      property.propertyTypeName,
      property.propertyType?.name,
      property.propertyType,
      property.type,
    ]
      .map((value) =>
        typeof value === "object"
          ? JSON.stringify(value)
          : String(value || "")
      )
      .join(" ")
      .toLowerCase();

    return searchableText.includes(
      searchTerm.toLowerCase()
    );
  });

  // ===================================================
  // STATISTICS
  // ===================================================

  const activeProperties = properties.filter(
    (property) => property.active
  ).length;

  const inactiveProperties = properties.filter(
    (property) => !property.active
  ).length;

  const availableProperties = properties.filter(
    (property) =>
      String(property.status || "").toUpperCase() ===
      "AVAILABLE"
  ).length;

  // ===================================================
  // LOADING
  // ===================================================

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
          Loading properties...
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Please wait while we retrieve your property records.
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
              sx={{ mb: 1 }}
            >
              <Avatar
                sx={{
                  width: 54,
                  height: 54,
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                }}
              >
                <HomeWork fontSize="large" />
              </Avatar>

              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    fontSize: {
                      xs: "1.6rem",
                      md: "2rem",
                    },
                  }}
                >
                  Property Management
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  RealEstate Pro · Admin Console
                </Typography>
              </Box>
            </Stack>

            <Typography
              variant="body1"
              sx={{
                mt: 2,
                maxWidth: 600,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Manage property listings, review property details,
              update records, and maintain your real estate inventory.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadProperties}
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.6)",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<AddHomeWork />}
              onClick={() =>
                navigate("/admin/properties/create")
              }
              sx={{
                bgcolor: "#fff",
                color: "#1769aa",
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#eaf4ff",
                  boxShadow: "none",
                },
              }}
            >
              Add Property
            </Button>
          </Stack>
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
        {/* TOTAL PROPERTIES */}

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
                    Total Properties
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ mt: 1, color: "#163a5f" }}
                  >
                    {properties.length}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    All property records
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
                  <HomeWork />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ACTIVE PROPERTIES */}

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
                    Active Properties
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ mt: 1, color: "#16834a" }}
                  >
                    {activeProperties}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Marked as active
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

        {/* AVAILABLE PROPERTIES */}

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
                    Available Properties
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ mt: 1, color: "#087e8b" }}
                  >
                    {availableProperties}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Status: AVAILABLE
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
                  <Apartment />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* INACTIVE PROPERTIES */}

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
                    Inactive Properties
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ mt: 1, color: "#c62828" }}
                  >
                    {inactiveProperties}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Marked as inactive
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 54,
                    height: 54,
                    bgcolor: "#ffebee",
                    color: "#c62828",
                  }}
                >
                  <WarningAmber />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* PROPERTY LIST */}

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
                Property Listings
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Browse and manage your property inventory.
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search properties..."
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

          {/* NO PROPERTIES */}

          {properties.length === 0 ? (
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
                <HomeWork sx={{ fontSize: 38 }} />
              </Avatar>

              <Typography variant="h6" fontWeight={700}>
                No properties found
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 3 }}
              >
                Start by adding your first property listing.
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddHomeWork />}
                onClick={() =>
                  navigate("/admin/properties/create")
                }
              >
                Add Property
              </Button>
            </Box>
          ) : filteredProperties.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 7, px: 2 }}>
              <Search
                sx={{
                  fontSize: 48,
                  color: "#90a4ae",
                  mb: 1,
                }}
              />

              <Typography variant="h6" fontWeight={700}>
                No matching properties
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 2 }}
              >
                Try a different search term.
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
                  <strong>{filteredProperties.length}</strong>{" "}
                  of <strong>{properties.length}</strong> properties
                </Typography>

                <Chip
                  size="small"
                  label={`${filteredProperties.length} listings`}
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Grid container spacing={2.5}>
                {filteredProperties.map((property) => {
                  const image = getPropertyImage(property);

                  const propertyTitle =
                    property.title ||
                    property.propertyTitle ||
                    "Untitled Property";

                  const imageCount = Array.isArray(property.images)
                    ? property.images.length
                    : 0;

                  return (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      xl={4}
                      key={property.id}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 3,
                          border: "1px solid #e5eaf1",
                          overflow: "hidden",
                          transition: "all 0.25s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow:
                              "0 14px 32px rgba(16,42,67,0.10)",
                            borderColor: "#bbd7f5",
                          },
                        }}
                      >
                        {/* =====================================
                            PROPERTY IMAGE
                        ===================================== */}

                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: 230,
                            overflow: "hidden",
                            background:
                              "linear-gradient(135deg, #e0e7ff, #f1f5f9)",
                          }}
                        >
                          {/* Fallback remains visible if the image
                              URL is missing or the image fails. */}

                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                              color: "#7890a4",
                            }}
                          >
                            <HomeWork sx={{ fontSize: 64 }} />

                            <Typography
                              variant="body2"
                              fontWeight={600}
                            >
                              Property image unavailable
                            </Typography>
                          </Box>

                          {image && (
                            <CardMedia
                              component="img"
                              image={image}
                              alt={propertyTitle}
                              loading="lazy"
                              onLoad={() => {
                                console.log(
                                  "Property image loaded:",
                                  property.id,
                                  image
                                );
                              }}
                              onError={(event) => {
                                console.error(
                                  "Property image failed to load:",
                                  {
                                    propertyId: property.id,
                                    imageUrl: image,
                                  }
                                );

                                // Hide the broken image so that
                                // the fallback behind it is visible.
                                event.currentTarget.style.display =
                                  "none";
                              }}
                              sx={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                zIndex: 1,
                                transition:
                                  "transform 0.5s ease",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                },
                              }}
                            />
                          )}

                          {/* Image gradient */}

                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              zIndex: 2,
                              pointerEvents: "none",
                              background:
                                "linear-gradient(to bottom, rgba(15,23,42,0.12), transparent 45%, rgba(15,23,42,0.55))",
                            }}
                          />

                          {/* Property type badge */}

                          <Box
                            sx={{
                              position: "absolute",
                              top: 14,
                              left: 14,
                              zIndex: 3,
                            }}
                          >
                            <Chip
                              icon={getPropertyIcon(property)}
                              label={
                                property.propertyTypeName ||
                                property.propertyType?.name ||
                                property.propertyType?.typeName ||
                                property.propertyType ||
                                property.type ||
                                "Property"
                              }
                              size="small"
                              sx={{
                                color: "#fff",
                                background:
                                  "rgba(15,23,42,0.75)",
                                backdropFilter: "blur(8px)",
                                fontWeight: 700,
                                border:
                                  "1px solid rgba(255,255,255,0.2)",
                                "& .MuiChip-icon": {
                                  color: "#fff",
                                },
                              }}
                            />
                          </Box>

                          {/* Image count */}

                          {imageCount > 0 && (
                            <Box
                              sx={{
                                position: "absolute",
                                right: 14,
                                bottom: 14,
                                zIndex: 3,
                              }}
                            >
                              <Chip
                                size="small"
                                label={`📷 ${imageCount}`}
                                sx={{
                                  color: "#fff",
                                  background:
                                    "rgba(15,23,42,0.75)",
                                  backdropFilter: "blur(8px)",
                                  fontWeight: 700,
                                }}
                              />
                            </Box>
                          )}
                        </Box>

                        {/* =====================================
                            PROPERTY CARD HEADER
                        ===================================== */}

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
                            spacing={1.5}
                          >
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: "#dcecff",
                                color: "#1769aa",
                              }}
                            >
                              {getPropertyIcon(property)}
                            </Avatar>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="h6"
                                fontWeight={800}
                                sx={{
                                  color: "#163a5f",
                                  fontSize: "1.05rem",
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {propertyTitle}
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
                                ID: {property.id}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                            sx={{ mt: 2 }}
                          >
                            <Chip
                              size="small"
                              label={property.status || "Unknown"}
                              color={getStatusColor(property.status)}
                              sx={{ fontWeight: 700 }}
                            />

                            <Chip
                              size="small"
                              label={
                                property.active ? "Active" : "Inactive"
                              }
                              color={
                                property.active ? "success" : "default"
                              }
                              variant="outlined"
                            />
                          </Stack>
                        </Box>

                        {/* =====================================
                            PROPERTY CARD DETAILS
                        ===================================== */}

                        <CardContent
                          sx={{
                            p: 2.5,
                            flexGrow: 1,
                            "&:last-child": { pb: 2.5 },
                          }}
                        >
                          <Stack spacing={2}>
                            {/* DESCRIPTION */}

                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={700}
                                sx={{
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                }}
                              >
                                Description
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 0.5,
                                  color: "#526477",
                                  lineHeight: 1.7,
                                  overflowWrap: "anywhere",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {property.description ||
                                  "No description available."}
                              </Typography>
                            </Box>

                            <Divider />

                            {/* PRICE AND AREA */}

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="flex-start"
                                >
                                  <Avatar
                                    sx={{
                                      width: 34,
                                      height: 34,
                                      bgcolor: "#e8f5e9",
                                      color: "#2e7d32",
                                    }}
                                  >
                                    <AttachMoney fontSize="small" />
                                  </Avatar>

                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Price
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      fontWeight={800}
                                      sx={{
                                        color: "#237647",
                                        overflowWrap: "anywhere",
                                      }}
                                    >
                                      {formatPrice(property.price)}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="flex-start"
                                >
                                  <Avatar
                                    sx={{
                                      width: 34,
                                      height: 34,
                                      bgcolor: "#fff3e0",
                                      color: "#ef6c00",
                                    }}
                                  >
                                    <Apartment fontSize="small" />
                                  </Avatar>

                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Area
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      fontWeight={700}
                                      sx={{ overflowWrap: "anywhere" }}
                                    >
                                      {property.area !== null &&
                                      property.area !== undefined &&
                                      property.area !== ""
                                        ? property.area
                                        : "Not specified"}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Grid>
                            </Grid>

                            {/* ADDRESS */}

                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="flex-start"
                            >
                              <LocationOn
                                sx={{
                                  fontSize: 21,
                                  color: "#607d8b",
                                  mt: 0.2,
                                }}
                              />

                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Address
                                </Typography>

                                <Typography
                                  variant="body2"
                                  sx={{
                                    mt: 0.3,
                                    color: "#526477",
                                    overflowWrap: "anywhere",
                                  }}
                                >
                                  {getAddress(property)}
                                </Typography>
                              </Box>
                            </Stack>
                          </Stack>
                        </CardContent>

                        {/* =====================================
                            PROPERTY ACTIONS
                        ===================================== */}

                        <Divider />

                        <Box sx={{ p: 2 }}>
                          <Grid container spacing={1}>
                            <Grid item xs={4}>
                              <Button
                                fullWidth
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() =>
                                  navigate(
                                    `/admin/properties/${property.id}`
                                  )
                                }
                                sx={{
                                  minWidth: 0,
                                  textTransform: "none",
                                  borderRadius: 2,
                                }}
                              >
                                View
                              </Button>
                            </Grid>

                            <Grid item xs={4}>
                              <Button
                                fullWidth
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() =>
                                  navigate(
                                    `/admin/properties/${property.id}/edit`
                                  )
                                }
                                sx={{
                                  minWidth: 0,
                                  textTransform: "none",
                                  borderRadius: 2,
                                }}
                              >
                                Edit
                              </Button>
                            </Grid>

                            <Grid item xs={4}>
                              <Button
                                fullWidth
                                size="small"
                                variant="contained"
                                color="error"
                                startIcon={
                                  deletingId === property.id ? (
                                    <CircularProgress
                                      size={15}
                                      color="inherit"
                                    />
                                  ) : (
                                    <Delete />
                                  )
                                }
                                onClick={() =>
                                  handleDelete(
                                    property.id,
                                    property.title ||
                                      property.propertyTitle ||
                                      "this property"
                                  )
                                }
                                disabled={
                                  deletingId === property.id
                                }
                                sx={{
                                  minWidth: 0,
                                  textTransform: "none",
                                  borderRadius: 2,
                                  boxShadow: "none",
                                  "&:hover": {
                                    boxShadow: "none",
                                  },
                                }}
                              >
                                {deletingId === property.id
                                  ? "Wait"
                                  : "Delete"}
                              </Button>
                            </Grid>
                          </Grid>
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

      {/* FOOTER NOTE */}

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
          Property management · RealEstate Pro Admin
        </Typography>
      </Stack>
    </Box>
  );
}

export default AdminProperties;
