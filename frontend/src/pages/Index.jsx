import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";

import {
  Search,
  Home,
  Apartment,
  Villa,
  Business,
  LocationOn,
  Security,
  Verified,
  Payments,
  SupportAgent,
  Favorite,
  ArrowForward,
  Login,
  PersonAdd,
} from "@mui/icons-material";

import {
  getProperties,
  getPropertyTypes,
  getStates,
} from "../api";

// =====================================================
// BACKEND
// =====================================================

// =====================================================
// BACKEND CONFIGURATION
// Supports local development and public deployment
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://realestate-pro-backend.onrender.com/api";

const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");
// =====================================================
// FALLBACK / DEMO PROPERTY IMAGES
// =====================================================

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",

  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
];

// =====================================================
// SAFE DEFAULT IMAGE
// =====================================================

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85";

// =====================================================
// BUILD IMAGE URL
// =====================================================

const buildImageUrl = (imageValue) => {
  if (!imageValue) {
    return null;
  }

  const value = String(imageValue).trim();

  if (!value) {
    return null;
  }

  // Already complete URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  // /uploads/image.jpg
  if (value.startsWith("/uploads/")) {
    return `${BACKEND_URL}${value}`;
  }

  // uploads/image.jpg
  if (value.startsWith("uploads/")) {
    return `${BACKEND_URL}/${value}`;
  }

  // /images/image.jpg
  if (value.startsWith("/images/")) {
    return `${BACKEND_URL}${value}`;
  }

  // images/image.jpg
  if (value.startsWith("images/")) {
    return `${BACKEND_URL}/${value}`;
  }

  // /image/image.jpg
  if (value.startsWith("/image/")) {
    return `${BACKEND_URL}${value}`;
  }

  // image/image.jpg
  if (value.startsWith("image/")) {
    return `${BACKEND_URL}/${value}`;
  }

  // Any other backend absolute path
  if (value.startsWith("/")) {
    return `${BACKEND_URL}${value}`;
  }

  // Filename only
  return `${BACKEND_URL}/uploads/${value}`;
};

// =====================================================
// GET PROPERTY IMAGE
// =====================================================

const getPropertyImage = (property, index = 0) => {
  // ---------------------------------------------------
  // Demo property
  // ---------------------------------------------------

  if (
    property?.demo === true &&
    property?.demoImage
  ) {
    return property.demoImage;
  }

  // ---------------------------------------------------
  // No property
  // ---------------------------------------------------

  if (!property) {
    return (
      FALLBACK_IMAGES[
        index % FALLBACK_IMAGES.length
      ] || DEFAULT_IMAGE
    );
  }

  // ---------------------------------------------------
  // Direct image fields
  // ---------------------------------------------------

  const directImage =
    property.imageUrl ||
    property.image ||
    property.propertyImage ||
    property.thumbnail ||
    property.imagePath ||
    property.filePath;

  if (directImage) {
    const url = buildImageUrl(directImage);

    if (url) {
      return url;
    }
  }

  // ---------------------------------------------------
  // imageUrls array
  // ---------------------------------------------------

  if (
    Array.isArray(property.imageUrls) &&
    property.imageUrls.length > 0
  ) {
    const firstImage =
      property.imageUrls[0];

    const url = buildImageUrl(firstImage);

    if (url) {
      return url;
    }
  }

  // ---------------------------------------------------
  // images array
  // ---------------------------------------------------

  if (
    Array.isArray(property.images) &&
    property.images.length > 0
  ) {
    const firstImage =
      property.images[0];

    // images: ["abc.jpg"]
    if (typeof firstImage === "string") {
      const url =
        buildImageUrl(firstImage);

      if (url) {
        return url;
      }
    }

    // images: [{ imageUrl: "/uploads/abc.jpg" }]
    if (
      typeof firstImage === "object" &&
      firstImage !== null
    ) {
      const imageValue =
        firstImage.imageUrl ||
        firstImage.url ||
        firstImage.path ||
        firstImage.filePath ||
        firstImage.image ||
        firstImage.imagePath ||
        firstImage.fileName ||
        firstImage.filename;

      const url =
        buildImageUrl(imageValue);

      if (url) {
        return url;
      }
    }
  }

  // ---------------------------------------------------
  // FALLBACK
  // ---------------------------------------------------

  return (
    FALLBACK_IMAGES[
      index % FALLBACK_IMAGES.length
    ] || DEFAULT_IMAGE
  );
};

// =====================================================
// IMAGE ERROR HANDLER
// =====================================================

const handleImageError = (event, index = 0) => {
  const fallback =
    FALLBACK_IMAGES[
      index % FALLBACK_IMAGES.length
    ] || DEFAULT_IMAGE;

  // First failure
  if (
    event.currentTarget.dataset
      .fallbackApplied !== "true"
  ) {
    event.currentTarget.dataset.fallbackApplied =
      "true";

    event.currentTarget.src = fallback;

    return;
  }

  // Second failure
  event.currentTarget.src = DEFAULT_IMAGE;
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
    return "Price on request";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return price;
  }

  if (numericPrice >= 10000000) {
    return `₹${(
      numericPrice / 10000000
    ).toFixed(2)} Cr`;
  }

  if (numericPrice >= 100000) {
    return `₹${(
      numericPrice / 100000
    ).toFixed(2)} L`;
  }

  return `₹${numericPrice.toLocaleString(
    "en-IN"
  )}`;
};

// =====================================================
// LOCATION HELPER
// =====================================================

const getLocation = (property) => {
  const city =
    property?.cityName ||
    property?.city?.name ||
    property?.city?.cityName ||
    property?.city ||
    "";

  const state =
    property?.stateName ||
    property?.state?.name ||
    property?.state?.stateName ||
    property?.state ||
    "";

  if (city && state) {
    return `${city}, ${state}`;
  }

  return (
    city ||
    state ||
    "Location available"
  );
};

// =====================================================
// PROPERTY TYPE HELPER
// =====================================================

const getPropertyType = (property) => {
  return (
    property?.propertyTypeName ||
    property?.propertyType?.name ||
    property?.propertyType?.propertyTypeName ||
    property?.propertyType ||
    property?.type ||
    "Property"
  );
};

// =====================================================
// NORMALIZE API RESPONSE
// =====================================================

const extractArray = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.content)) {
    return response.content;
  }

  if (
    Array.isArray(
      response?.data?.content
    )
  ) {
    return response.data.content;
  }

  if (
    Array.isArray(
      response?.data?.data
    )
  ) {
    return response.data.data;
  }

  return [];
};

// =====================================================
// DEMO PROPERTIES
// =====================================================

const DEMO_PROPERTIES = [
  {
    id: "demo-1",
    title: "Luxury 3BHK Apartment",
    propertyTypeName: "APARTMENT",
    cityName: "Hyderabad",
    stateName: "Telangana",
    price: 8500000,
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[0],
  },

  {
    id: "demo-2",
    title: "Modern 4BHK Luxury House",
    propertyTypeName: "HOUSE",
    cityName: "Hyderabad",
    stateName: "Telangana",
    price: 12000000,
    bedrooms: 4,
    bathrooms: 4,
    area: 2400,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[1],
  },

  {
    id: "demo-3",
    title: "Luxury Villa",
    propertyTypeName: "VILLA",
    cityName: "Warangal",
    stateName: "Telangana",
    price: 8500000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[2],
  },

  {
    id: "demo-4",
    title: "Premium Family Villa",
    propertyTypeName: "VILLA",
    cityName: "Hyderabad",
    stateName: "Telangana",
    price: 15000000,
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[3],
  },

  {
    id: "demo-5",
    title: "Modern City Apartment",
    propertyTypeName: "APARTMENT",
    cityName: "Hyderabad",
    stateName: "Telangana",
    price: 6500000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1450,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[4],
  },

  {
    id: "demo-6",
    title: "Premium Commercial Space",
    propertyTypeName: "COMMERCIAL",
    cityName: "Hyderabad",
    stateName: "Telangana",
    price: 18000000,
    bedrooms: 0,
    bathrooms: 2,
    area: 3200,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[5],
  },

  {
    id: "demo-7",
    title: "Elegant 3BHK Family Home",
    propertyTypeName: "HOUSE",
    cityName: "Secunderabad",
    stateName: "Telangana",
    price: 9200000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[6],
  },

  {
    id: "demo-8",
    title: "Modern Premium Apartment",
    propertyTypeName: "APARTMENT",
    cityName: "Bengaluru",
    stateName: "Karnataka",
    price: 10500000,
    bedrooms: 3,
    bathrooms: 3,
    area: 1950,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[7],
  },

  {
    id: "demo-9",
    title: "Contemporary Luxury Villa",
    propertyTypeName: "VILLA",
    cityName: "Hyderabad",
    stateName: "Telangana",
    price: 17500000,
    bedrooms: 4,
    bathrooms: 5,
    area: 3100,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[8],
  },

  {
    id: "demo-10",
    title: "Spacious 2BHK Apartment",
    propertyTypeName: "APARTMENT",
    cityName: "Warangal",
    stateName: "Telangana",
    price: 5200000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1350,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[9],
  },

  {
    id: "demo-11",
    title: "Premium Urban Residence",
    propertyTypeName: "HOUSE",
    cityName: "Pune",
    stateName: "Maharashtra",
    price: 11500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2600,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[10],
  },

  {
    id: "demo-12",
    title: "Luxury Modern Residence",
    propertyTypeName: "VILLA",
    cityName: "Chennai",
    stateName: "Tamil Nadu",
    price: 13500000,
    bedrooms: 4,
    bathrooms: 4,
    area: 2750,
    status: "AVAILABLE",
    demo: true,
    demoImage: FALLBACK_IMAGES[11],
  },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

function Index() {
  const navigate = useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [properties, setProperties] =
    useState([]);

  const [propertyTypes, setPropertyTypes] =
    useState([]);

  const [states, setStates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // SEARCH
  // ===================================================

  const [searchText, setSearchText] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("");

  const [selectedState, setSelectedState] =
    useState("");

  // ===================================================
  // LOAD HOME DATA
  // ===================================================

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      setError("");

      // =================================================
      // PROPERTIES
      // =================================================

      try {
        const propertiesResponse =
          await getProperties();

        const propertyData =
          extractArray(
            propertiesResponse
          );

        console.log(
          "Homepage API properties:",
          propertyData
        );

        if (propertyData.length > 0) {
          /*
           * IMPORTANT:
           * Combine backend properties with demo
           * properties so the homepage always has
           * enough cards/images while the image
           * upload module is still being completed.
           */
          setProperties([
            ...propertyData,
            ...DEMO_PROPERTIES,
          ]);
        } else {
          setProperties(
            DEMO_PROPERTIES
          );
        }
      } catch (err) {
        console.error(
          "Homepage properties API error:",
          err
        );

        setProperties(
          DEMO_PROPERTIES
        );
      }

      // =================================================
      // PROPERTY TYPES
      // =================================================

      try {
        const typesResponse =
          await getPropertyTypes();

        const typeData =
          extractArray(
            typesResponse
          );

        if (typeData.length > 0) {
          setPropertyTypes(
            typeData
          );
        } else {
          setPropertyTypes([
            {
              id: "APARTMENT",
              name: "APARTMENT",
            },
            {
              id: "VILLA",
              name: "VILLA",
            },
            {
              id: "HOUSE",
              name: "HOUSE",
            },
            {
              id: "PLOT",
              name: "PLOT",
            },
            {
              id: "COMMERCIAL",
              name: "COMMERCIAL",
            },
          ]);
        }
      } catch (err) {
        console.error(
          "Property types API error:",
          err
        );

        setPropertyTypes([
          {
            id: "APARTMENT",
            name: "APARTMENT",
          },
          {
            id: "VILLA",
            name: "VILLA",
          },
          {
            id: "HOUSE",
            name: "HOUSE",
          },
          {
            id: "PLOT",
            name: "PLOT",
          },
          {
            id: "COMMERCIAL",
            name: "COMMERCIAL",
          },
        ]);
      }

      // =================================================
      // STATES
      // =================================================

      try {
        const statesResponse =
          await getStates();

        const stateData =
          extractArray(
            statesResponse
          );

        if (stateData.length > 0) {
          setStates(
            stateData
          );
        } else {
          setStates([
            {
              id: "telangana",
              stateName: "Telangana",
              name: "Telangana",
            },
          ]);
        }
      } catch (err) {
        console.error(
          "States API error:",
          err
        );

        setStates([
          {
            id: "telangana",
            stateName: "Telangana",
            name: "Telangana",
          },
        ]);
      }

      setLoading(false);
    };

    loadHomeData();
  }, []);

  // ===================================================
  // FEATURED PROPERTIES
  // ===================================================

  const featuredProperties =
    useMemo(() => {
      if (!Array.isArray(properties)) {
        return [];
      }

      return properties
        .filter(
          (property) =>
            property?.active !== false &&
            property?.status !== "INACTIVE"
        )
        .slice(0, 12);
    }, [properties]);

  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearch = () => {
    const params =
      new URLSearchParams();

    if (searchText.trim()) {
      params.set(
        "search",
        searchText.trim()
      );
    }

    if (selectedType) {
      params.set(
        "propertyType",
        selectedType
      );
    }

    if (selectedState) {
      params.set(
        "state",
        selectedState
      );
    }

    const queryString =
      params.toString();

    navigate(
      `/customer/properties${
        queryString
          ? `?${queryString}`
          : ""
      }`
    );
  };

  // ===================================================
  // PROPERTY TYPE ICONS
  // ===================================================

  const typeIcons = {
    APARTMENT: <Apartment />,
    VILLA: <Villa />,
    HOUSE: <Home />,
    PLOT: <LocationOn />,
    COMMERCIAL: <Business />,
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
      }}
    >
      {/* =================================================
          NAVBAR
      ================================================= */}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              minHeight: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* LOGO */}

            <Box
              onClick={() =>
                navigate("/")
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg,#1976d2,#00bcd4)",
                  color: "#fff",
                }}
              >
                <Home />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                }}
              >
                RealEstate
                <Box
                  component="span"
                  sx={{
                    color: "#4dd0e1",
                  }}
                >
                  Pro
                </Box>
              </Typography>
            </Box>

            {/* NAVIGATION */}

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                }}
                onClick={() =>
                  navigate(
                    "/customer/properties"
                  )
                }
              >
                Properties
              </Button>

              <Button
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                }}
                onClick={() =>
                  document
                    .getElementById(
                      "features"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Features
              </Button>

              <Button
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                }}
                onClick={() =>
                  document
                    .getElementById(
                      "about"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                About
              </Button>

              <Button
                startIcon={<Login />}
                variant="outlined"
                onClick={() =>
                  navigate("/login")
                }
                sx={{
                  ml: 1,
                  color: "#fff",
                  borderColor:
                    "rgba(255,255,255,0.7)",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#fff",
                    backgroundColor:
                      "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Login
              </Button>

              <Button
                startIcon={<PersonAdd />}
                variant="contained"
                onClick={() =>
                  navigate(
                    "/register"
                  )
                }
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg,#1976d2,#00a6c7)",
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.2)",
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* =================================================
          HERO
      ================================================= */}

      <Box
        sx={{
          minHeight: {
            xs: 700,
            md: 760,
          },
          display: "flex",
          alignItems: "center",
          position: "relative",
          backgroundImage:
            "linear-gradient(90deg, rgba(4,18,38,0.90) 0%, rgba(4,18,38,0.65) 50%, rgba(4,18,38,0.25) 100%), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              maxWidth: 850,
              pt: {
                xs: 8,
                md: 10,
              },
            }}
          >
            <Chip
              label="SMART REAL ESTATE PLATFORM"
              sx={{
                mb: 3,
                px: 1,
                fontWeight: 800,
                letterSpacing: 1,
                color: "#fff",
                backgroundColor:
                  "rgba(25,118,210,0.85)",
              }}
            />

            <Typography
              component="h1"
              sx={{
                color: "#fff",
                fontWeight: 900,
                fontSize: {
                  xs: "2.8rem",
                  sm: "4rem",
                  md: "5.2rem",
                },
                lineHeight: 1.05,
                letterSpacing: "-2px",
                mb: 3,
              }}
            >
              Find a place
              <br />

              <Box
                component="span"
                sx={{
                  color: "#4dd0e1",
                }}
              >
                you'll love.
              </Box>
            </Typography>

            <Typography
              sx={{
                color:
                  "rgba(255,255,255,0.88)",
                fontSize: {
                  xs: "1rem",
                  md: "1.25rem",
                },
                lineHeight: 1.7,
                maxWidth: 700,
                mb: 4,
              }}
            >
              Discover apartments,
              villas, houses, plots
              and commercial properties
              with RealEstate-Pro — a
              complete digital real
              estate management platform.
            </Typography>

            {/* SEARCH */}

            <Paper
              elevation={12}
              sx={{
                p: {
                  xs: 2,
                  md: 2.5,
                },
                borderRadius: 4,
                maxWidth: 950,
                backgroundColor:
                  "rgba(255,255,255,0.98)",
              }}
            >
              <Grid
                container
                spacing={1.5}
                sx={{
                  alignItems: "center",
                }}
              >
                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <TextField
                    fullWidth
                    value={searchText}
                    onChange={(e) =>
                      setSearchText(
                        e.target.value
                      )
                    }
                    placeholder="Search city, property..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 2.5,
                  }}
                >
                  <TextField
                    fullWidth
                    select
                    label="Property Type"
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value="">
                      All Types
                    </MenuItem>

                    {propertyTypes.map(
                      (
                        type,
                        index
                      ) => {
                        const typeName =
                          type.name ||
                          type.propertyTypeName ||
                          type.propertyType ||
                          "Property";

                        const typeId =
                          type.id ||
                          type._id ||
                          typeName ||
                          index;

                        return (
                          <MenuItem
                            key={typeId}
                            value={typeName}
                          >
                            {typeName}
                          </MenuItem>
                        );
                      }
                    )}
                  </TextField>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 2.5,
                  }}
                >
                  <TextField
                    fullWidth
                    select
                    label="Location"
                    value={selectedState}
                    onChange={(e) =>
                      setSelectedState(
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value="">
                      All Locations
                    </MenuItem>

                    {states.map(
                      (
                        state,
                        index
                      ) => {
                        const stateName =
                          state.stateName ||
                          state.name ||
                          state.state ||
                          "State";

                        const stateId =
                          state.id ||
                          state._id ||
                          stateName ||
                          index;

                        return (
                          <MenuItem
                            key={stateId}
                            value={stateName}
                          >
                            {stateName}
                          </MenuItem>
                        );
                      }
                    )}
                  </TextField>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 3,
                  }}
                >
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleSearch}
                    sx={{
                      minHeight: 56,
                      borderRadius: 2,
                      fontWeight: 800,
                      fontSize: "1rem",
                      background:
                        "linear-gradient(135deg,#1976d2,#00a6c7)",
                    }}
                  >
                    Search Properties
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* HERO STATS */}

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 5,
                mt: 5,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#fff",
                    fontWeight: 900,
                  }}
                >
                  {featuredProperties.length}+
                </Typography>

                <Typography
                  sx={{
                    color:
                      "rgba(255,255,255,0.75)",
                  }}
                >
                  Properties
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#fff",
                    fontWeight: 900,
                  }}
                >
                  {propertyTypes.length}+
                </Typography>

                <Typography
                  sx={{
                    color:
                      "rgba(255,255,255,0.75)",
                  }}
                >
                  Property Types
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#fff",
                    fontWeight: 900,
                  }}
                >
                  24/7
                </Typography>

                <Typography
                  sx={{
                    color:
                      "rgba(255,255,255,0.75)",
                  }}
                >
                  Digital Access
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* =================================================
          PROPERTY TYPES
      ================================================= */}

      <Box
        sx={{
          py: {
            xs: 7,
            md: 10,
          },
          backgroundColor: "#fff",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
            }}
          >
            <Typography
              sx={{
                color: "#1976d2",
                fontWeight: 800,
                letterSpacing: 1,
                mb: 1,
              }}
            >
              EXPLORE PROPERTIES
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#172033",
              }}
            >
              Find your perfect property
            </Typography>

            <Typography
              sx={{
                color: "#687386",
                mt: 2,
                maxWidth: 700,
                mx: "auto",
              }}
            >
              Browse properties based on
              your lifestyle, investment
              goals and requirements.
            </Typography>
          </Box>

          <Grid
            container
            spacing={3}
          >
            {propertyTypes
              .slice(0, 5)
              .map(
                (
                  type,
                  index
                ) => {
                  const typeName =
                    type.name ||
                    type.propertyTypeName ||
                    type.propertyType ||
                    "Property";

                  const icon =
                    typeIcons[
                      String(
                        typeName
                      ).toUpperCase()
                    ] || (
                      <Home />
                    );

                  return (
                    <Grid
                      key={
                        type.id ||
                        type._id ||
                        typeName ||
                        index
                      }
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 2.4,
                      }}
                    >
                      <Card
                        onClick={() =>
                          navigate(
                            `/customer/properties?propertyType=${encodeURIComponent(
                              typeName
                            )}`
                          )
                        }
                        sx={{
                          height: "100%",
                          borderRadius: 4,
                          cursor: "pointer",
                          transition:
                            "all .3s ease",
                          border:
                            "1px solid #e8edf5",
                          "&:hover": {
                            transform:
                              "translateY(-8px)",
                            boxShadow:
                              "0 18px 45px rgba(25,118,210,.14)",
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            textAlign:
                              "center",
                            py: 4,
                          }}
                        >
                          <Box
                            sx={{
                              width: 65,
                              height: 65,
                              mx: "auto",
                              mb: 2,
                              borderRadius:
                                "50%",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              color:
                                "#1976d2",
                              background:
                                "#eaf3ff",
                            }}
                          >
                            {icon}
                          </Box>

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight:
                                800,
                            }}
                          >
                            {typeName}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              color:
                                "#7b8494",
                            }}
                          >
                            Explore properties
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                }
              )}
          </Grid>
        </Container>
      </Box>

      {/* =================================================
          FEATURED PROPERTIES
      ================================================= */}

      <Box
        sx={{
          py: {
            xs: 7,
            md: 10,
          },
          backgroundColor:
            "#f7f9fc",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
              justifyContent:
                "space-between",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: 2,
              mb: 5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#1976d2",
                  fontWeight: 800,
                  letterSpacing: 1,
                }}
              >
                FEATURED LISTINGS
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: "#172033",
                  mt: 1,
                }}
              >
                Properties you'll love
              </Typography>
            </Box>

            <Button
              endIcon={<ArrowForward />}
              variant="outlined"
              onClick={() =>
                navigate(
                  "/customer/properties"
                )
              }
              sx={{
                fontWeight: 700,
              }}
            >
              View All Properties
            </Button>
          </Box>

          {loading ? (
            <Box
              sx={{
                minHeight: 250,
                display: "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : featuredProperties.length ===
            0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
              >
                No properties available.
              </Typography>
            </Box>
          ) : (
            <Grid
              container
              spacing={3}
            >
              {featuredProperties.map(
                (
                  property,
                  index
                ) => {
                  const propertyId =
                    property.id ||
                    property._id;

                  const isDemo =
                    property.demo === true;

                  const imageUrl =
                    getPropertyImage(
                      property,
                      index
                    );

                  return (
                    <Grid
                      key={
                        propertyId ||
                        `property-${index}`
                      }
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: 4,
                          overflow: "hidden",
                          transition:
                            "all .3s ease",
                          border:
                            "1px solid #e7ebf1",
                          "&:hover": {
                            transform:
                              "translateY(-7px)",
                            boxShadow:
                              "0 20px 45px rgba(0,0,0,.12)",
                          },
                        }}
                      >
                        {/* IMAGE */}

                        <Box
                          sx={{
                            position:
                              "relative",
                            backgroundColor:
                              "#e9eef5",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="250"
                            src={imageUrl}
                            image={imageUrl}
                            alt={
                              property.title ||
                              "Real estate property"
                            }
                            sx={{
                              width: "100%",
                              height: 250,
                              objectFit:
                                "cover",
                              display:
                                "block",
                              backgroundColor:
                                "#e9eef5",
                            }}
                            onError={(event) =>
                              handleImageError(
                                event,
                                index
                              )
                            }
                          />

                          {/* STATUS */}

                          <Chip
                            label={
                              property.status ||
                              "AVAILABLE"
                            }
                            size="small"
                            sx={{
                              position:
                                "absolute",
                              top: 15,
                              left: 15,
                              fontWeight:
                                800,
                              color: "#fff",
                              backgroundColor:
                                property.status ===
                                "SOLD"
                                  ? "#d32f2f"
                                  : "#2e7d32",
                            }}
                          />

                          {/* DEMO LABEL */}

                          {isDemo && (
                            <Chip
                              label="Demo"
                              size="small"
                              sx={{
                                position:
                                  "absolute",
                                bottom: 15,
                                left: 15,
                                fontWeight:
                                  800,
                                color:
                                  "#fff",
                                backgroundColor:
                                  "rgba(25,118,210,.9)",
                              }}
                            />
                          )}

                          {/* FAVORITE */}

                          <Box
                            sx={{
                              position:
                                "absolute",
                              top: 12,
                              right: 12,
                              width: 38,
                              height: 38,
                              borderRadius:
                                "50%",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              backgroundColor:
                                "rgba(255,255,255,.95)",
                            }}
                          >
                            <Favorite
                              sx={{
                                color:
                                  "#e53935",
                                fontSize: 20,
                              }}
                            />
                          </Box>
                        </Box>

                        {/* CONTENT */}

                        <CardContent
                          sx={{
                            p: 3,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight:
                                800,
                              mb: 1,
                            }}
                          >
                            {property.title ||
                              property.name ||
                              `${getPropertyType(
                                property
                              )} Property`}
                          </Typography>

                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 0.5,
                              color:
                                "#687386",
                              mb: 2,
                            }}
                          >
                            <LocationOn
                              sx={{
                                fontSize:
                                  18,
                              }}
                            />

                            <Typography
                              variant="body2"
                            >
                              {getLocation(
                                property
                              )}
                            </Typography>
                          </Box>

                          <Typography
                            variant="h5"
                            sx={{
                              color:
                                "#1976d2",
                              fontWeight:
                                900,
                              mb: 2,
                            }}
                          >
                            {formatPrice(
                              property.price
                            )}
                          </Typography>

                          <Divider
                            sx={{
                              mb: 2,
                            }}
                          />

                          <Box
                            sx={{
                              display:
                                "flex",
                              gap: 2,
                              flexWrap:
                                "wrap",
                              mb: 2,
                            }}
                          >
                            {property.bedrooms !==
                              undefined && (
                              <Typography
                                variant="body2"
                              >
                                🛏{" "}
                                {
                                  property.bedrooms
                                }{" "}
                                Beds
                              </Typography>
                            )}

                            {property.bathrooms !==
                              undefined && (
                              <Typography
                                variant="body2"
                              >
                                🛁{" "}
                                {
                                  property.bathrooms
                                }{" "}
                                Baths
                              </Typography>
                            )}

                            {property.area !==
                              undefined && (
                              <Typography
                                variant="body2"
                              >
                                📐{" "}
                                {
                                  property.area
                                }{" "}
                                sq.ft
                              </Typography>
                            )}
                          </Box>

                          <Button
                            fullWidth
                            variant="contained"
                            endIcon={
                              <ArrowForward />
                            }
                            onClick={() => {
                              if (isDemo) {
                                navigate(
                                  "/customer/properties"
                                );
                                return;
                              }

                              navigate(
                                `/customer/properties/${propertyId}`
                              );
                            }}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 800,
                            }}
                          >
                            View Property
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                }
              )}
            </Grid>
          )}
        </Container>
      </Box>

      {/* =================================================
          FEATURES
      ================================================= */}

      <Box
        id="features"
        sx={{
          py: {
            xs: 7,
            md: 10,
          },
          backgroundColor: "#fff",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
            }}
          >
            <Typography
              sx={{
                color: "#1976d2",
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              WHY REAL ESTATE PRO
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#172033",
                mt: 1,
              }}
            >
              Everything you need in one place
            </Typography>
          </Box>

          <Grid
            container
            spacing={3}
          >
            {[
              {
                icon: <Verified />,
                title:
                  "Verified Properties",
                text:
                  "Manage property listings with structured information, availability and property images.",
              },
              {
                icon: <Security />,
                title:
                  "Secure Platform",
                text:
                  "JWT based authentication and role-based access for Admin, Owner and Customer users.",
              },
              {
                icon: <Payments />,
                title:
                  "Digital Payments",
                text:
                  "Manage property booking payments with multiple payment methods and payment statuses.",
              },
              {
                icon: <Favorite />,
                title:
                  "Favourites & Reviews",
                text:
                  "Customers can save properties, review properties and manage their real estate activity.",
              },
              {
                icon: <SupportAgent />,
                title:
                  "Complaints & Support",
                text:
                  "Submit and manage complaints while keeping communication organized through notifications.",
              },
              {
                icon: <Home />,
                title:
                  "Complete Property Management",
                text:
                  "Owners and administrators can manage properties, bookings, inquiries and related activities.",
              },
            ].map(
              (feature) => (
                <Grid
                  key={
                    feature.title
                  }
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      p: 1,
                      border:
                        "1px solid #e7ebf1",
                      transition:
                        "all .3s ease",
                      "&:hover": {
                        transform:
                          "translateY(-6px)",
                        boxShadow:
                          "0 18px 40px rgba(25,118,210,.12)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 55,
                          height: 55,
                          borderRadius: 3,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          color:
                            "#1976d2",
                          background:
                            "#eaf3ff",
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight:
                            800,
                          mb: 1,
                        }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            "#687386",
                          lineHeight:
                            1.7,
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Box>

      {/* =================================================
          ROLE SECTION
      ================================================= */}

      <Box
        sx={{
          py: {
            xs: 7,
            md: 10,
          },
          background:
            "linear-gradient(135deg,#071b34,#123f68)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
            }}
          >
            <Typography
              sx={{
                color: "#4dd0e1",
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              ONE PLATFORM
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#fff",
                fontWeight: 900,
                mt: 1,
              }}
            >
              Built for every role
            </Typography>
          </Box>

          <Grid
            container
            spacing={3}
          >
            {[
              {
                role: "Customer",
                title:
                  "Find & Book Properties",
                text:
                  "Search properties, view details, book visits, make payments, save favourites, submit reviews and manage notifications.",
                action:
                  "/customer/properties",
                button:
                  "Explore Properties",
              },
              {
                role: "Owner",
                title:
                  "Manage Your Properties",
                text:
                  "Manage property listings, images, bookings, inquiries, payments, reviews and owner dashboard information.",
                action: "/login",
                button:
                  "Owner Login",
              },
              {
                role: "Admin",
                title:
                  "Control the Platform",
                text:
                  "Manage users, properties, bookings, payments, complaints, locations, notifications and platform dashboards.",
                action: "/login",
                button:
                  "Admin Login",
              },
            ].map(
              (item) => (
                <Grid
                  key={item.role}
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <Paper
                    sx={{
                      height: "100%",
                      p: 4,
                      borderRadius: 4,
                      backgroundColor:
                        "rgba(255,255,255,.08)",
                      border:
                        "1px solid rgba(255,255,255,.14)",
                      color: "#fff",
                    }}
                  >
                    <Chip
                      label={
                        item.role
                      }
                      sx={{
                        color:
                          "#fff",
                        fontWeight:
                          800,
                        backgroundColor:
                          "rgba(77,208,225,.18)",
                        mb: 2,
                      }}
                    />

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight:
                          900,
                        mb: 2,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "rgba(255,255,255,.75)",
                        lineHeight:
                          1.8,
                        mb: 3,
                      }}
                    >
                      {item.text}
                    </Typography>

                    <Button
                      variant="contained"
                      endIcon={
                        <ArrowForward />
                      }
                      onClick={() =>
                        navigate(
                          item.action
                        )
                      }
                      sx={{
                        fontWeight:
                          800,
                        backgroundColor:
                          "#1976d2",
                      }}
                    >
                      {item.button}
                    </Button>
                  </Paper>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Box>

      {/* =================================================
          ABOUT / CTA
      ================================================= */}

      <Box
        id="about"
        sx={{
          py: {
            xs: 7,
            md: 10,
          },
          backgroundColor:
            "#f7f9fc",
        }}
      >
        <Container maxWidth="lg">
          <Paper
            sx={{
              borderRadius: 5,
              overflow: "hidden",
              background:
                "linear-gradient(135deg,#1976d2,#00a6c7)",
              color: "#fff",
              p: {
                xs: 4,
                md: 7,
              },
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 2,
              }}
            >
              Ready to find your next property?
            </Typography>

            <Typography
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.7,
                maxWidth: 700,
                mx: "auto",
                color:
                  "rgba(255,255,255,.9)",
                mb: 4,
              }}
            >
              Explore available
              properties and
              experience a complete
              digital real estate
              platform built for
              customers, owners and
              administrators.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                size="large"
                variant="contained"
                onClick={() =>
                  navigate(
                    "/customer/properties"
                  )
                }
                endIcon={
                  <ArrowForward />
                }
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 900,
                  color: "#1976d2",
                  backgroundColor:
                    "#fff",
                  "&:hover": {
                    backgroundColor:
                      "#f4f7fa",
                  },
                }}
              >
                Browse Properties
              </Button>

              <Button
                size="large"
                variant="outlined"
                onClick={() =>
                  navigate("/login")
                }
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  color: "#fff",
                  borderColor:
                    "rgba(255,255,255,.7)",
                  fontWeight: 900,
                }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Box
        sx={{
          backgroundColor:
            "#07111f",
          color: "#fff",
          py: 6,
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={5}
          >
            <Grid
              size={{
                xs: 12,
                md: 5,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  mb: 2,
                }}
              >
                RealEstate
                <Box
                  component="span"
                  sx={{
                    color:
                      "#4dd0e1",
                  }}
                >
                  Pro
                </Box>
              </Typography>

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,.65)",
                  lineHeight: 1.8,
                  maxWidth: 500,
                }}
              >
                A complete
                enterprise-style
                real estate
                management
                platform for
                customers,
                property owners
                and administrators.
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 6,
                sm: 3,
                md: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                Platform
              </Typography>

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,.6)",
                  mb: 1,
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(
                    "/customer/properties"
                  )
                }
              >
                Properties
              </Typography>

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,.6)",
                  mb: 1,
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate("/login")
                }
              >
                Login
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 6,
                sm: 3,
                md: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                Services
              </Typography>

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,.6)",
                  mb: 1,
                }}
              >
                Property Management
              </Typography>

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,.6)",
                  mb: 1,
                }}
              >
                Property Booking
              </Typography>

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,.6)",
                }}
              >
                Digital Payments
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                RealEstate-Pro
              </Typography>

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,.6)",
                  lineHeight: 1.8,
                }}
              >
                Discover properties.
                <br />
                Connect with owners.
                <br />
                Manage everything digitally.
              </Typography>
            </Grid>
          </Grid>

          <Divider
            sx={{
              my: 4,
              borderColor:
                "rgba(255,255,255,.12)",
            }}
          />

          <Typography
            align="center"
            sx={{
              color:
                "rgba(255,255,255,.5)",
              fontSize: ".9rem",
            }}
          >
            ©{" "}
            {new Date().getFullYear()}{" "}
            RealEstate-Pro.
            All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Index;