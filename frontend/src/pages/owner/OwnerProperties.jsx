
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  TextField,
  MenuItem,
  InputAdornment,
  Avatar,
  Paper,
  Stack,
  LinearProgress,
} from "@mui/material";

import {
  AddHome,
  Edit,
  Delete,
  Visibility,
  Refresh,
  HomeWork,
  LocationOn,
  Bed,
  SquareFoot,
  AttachMoney,
  Search,
  Apartment,
  TrendingUp,
  Inventory2,
  CheckCircle,
  PendingActions,
  Close,
  CalendarMonth,
  MoreHoriz,
} from "@mui/icons-material";

import {
  getProperties,
  getPropertyImages,
  deleteProperty,
} from "../../api";

// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL = "http://localhost:9090";

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

  // data URL
  if (value.startsWith("data:")) {
    return value;
  }

  // /uploads/xxx.jpg
  if (value.startsWith("/")) {
    return `${BACKEND_URL}${value}`;
  }

  // uploads/xxx.jpg
  return `${BACKEND_URL}/${value}`;
};

// =====================================================
// PROPERTY IMAGE HELPER
// =====================================================

const getPropertyImage = (property) => {
  // ---------------------------------------------------
  // 1. images array
  // ---------------------------------------------------

  if (
    property?.images &&
    Array.isArray(property.images) &&
    property.images.length > 0
  ) {
    const firstImage = property.images[0];

    // String image
    if (typeof firstImage === "string") {
      return buildImageUrl(firstImage);
    }

    // Possible backend image object fields
    if (firstImage?.imageUrl) {
      return buildImageUrl(firstImage.imageUrl);
    }

    if (firstImage?.url) {
      return buildImageUrl(firstImage.url);
    }

    if (firstImage?.path) {
      return buildImageUrl(firstImage.path);
    }

    if (firstImage?.filePath) {
      return buildImageUrl(firstImage.filePath);
    }

    if (firstImage?.imagePath) {
      return buildImageUrl(firstImage.imagePath);
    }

    if (firstImage?.filename) {
      return buildImageUrl(
        `/uploads/${firstImage.filename}`
      );
    }

    if (firstImage?.fileName) {
      return buildImageUrl(
        `/uploads/${firstImage.fileName}`
      );
    }
  }

  // ---------------------------------------------------
  // 2. Direct property image fields
  // ---------------------------------------------------

  const image =
    property?.imageUrl ||
    property?.image ||
    property?.propertyImage ||
    property?.thumbnail ||
    property?.imagePath ||
    property?.filePath;

  if (image) {
    return buildImageUrl(image);
  }

  return null;
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
// NORMALIZE STATUS
// =====================================================

const getPropertyStatus = (property) => {
  const status =
    property?.status ||
    property?.propertyStatus ||
    property?.propertyStatusName ||
    property?.statusName ||
    property?.property?.status ||
    "";

  if (!status) {
    return "UNKNOWN";
  }

  return String(status)
    .trim()
    .toUpperCase();
};

// =====================================================
// STATUS LABEL
// =====================================================

const getStatusLabel = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "AVAILABLE";

    case "PENDING_APPROVAL":
      return "PENDING APPROVAL";

    case "BOOKED":
      return "BOOKED";

    case "SOLD":
      return "SOLD";

    case "REJECTED":
      return "REJECTED";

    case "INACTIVE":
      return "INACTIVE";

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
    case "AVAILABLE":
      return "success";

    case "PENDING_APPROVAL":
      return "warning";

    case "BOOKED":
      return "info";

    case "SOLD":
      return "secondary";

    case "REJECTED":
      return "error";

    case "INACTIVE":
      return "default";

    case "UNKNOWN":
      return "default";

    default:
      return "default";
  }
};

// =====================================================
// OWNER PROPERTIES
// =====================================================

function OwnerProperties() {
  const navigate = useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [properties, setProperties] = useState([]);

  const [filteredProperties, setFilteredProperties] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  // ===================================================
  // DELETE DIALOG
  // ===================================================

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedProperty, setSelectedProperty] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // ===================================================
  // LOAD PROPERTY IMAGES
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

      const response =
        await getPropertyImages(property.id);

      console.log(
        "IMAGE RESPONSE:",
        property.id,
        response
      );

      let images = [];

      // -----------------------------------------------
      // Possible response formats
      // -----------------------------------------------

      if (
        response &&
        Array.isArray(response.data)
      ) {
        images = response.data;
      } else if (
        Array.isArray(response)
      ) {
        images = response;
      } else if (
        response?.data?.data &&
        Array.isArray(response.data.data)
      ) {
        images = response.data.data;
      }

      console.log(
        "PROPERTY IMAGES:",
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

      // Don't fail the entire property page
      return {
        ...property,
        images: [],
      };
    }
  };

  // ===================================================
  // LOAD PROPERTIES
  // ===================================================

  const loadProperties = async () => {
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

      // =================================================
      // GET ALL PROPERTIES
      // =================================================

      const response =
        await getProperties();

      console.log(
        "ALL PROPERTIES RESPONSE:",
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
      }

      console.log(
        "TOTAL PROPERTIES:",
        data.length
      );

      // =================================================
      // FILTER OWNER PROPERTIES
      // =================================================

      const ownerProperties =
        data.filter((property) => {
          const propertyOwnerId =
            property?.ownerId ||
            property?.owner?.id ||
            property?.owner?.userId ||
            property?.user?.id;

          return (
            String(propertyOwnerId) ===
            String(ownerId)
          );
        });

      console.log(
        "OWNER PROPERTIES BEFORE IMAGES:",
        ownerProperties
      );

      // =================================================
      // LOAD IMAGES FOR EACH PROPERTY
      // =================================================

      const propertiesWithImages =
        await Promise.all(
          ownerProperties.map(
            async (property) => {
              return await loadPropertyImages(
                property
              );
            }
          )
        );

      console.log(
        "OWNER PROPERTIES WITH IMAGES:",
        propertiesWithImages
      );

      // =================================================
      // DEBUG STATUS
      // =================================================

      propertiesWithImages.forEach(
        (property) => {
          console.log(
            "PROPERTY DEBUG:",
            {
              id: property?.id,

              title:
                property?.title ||
                property?.propertyTitle,

              status:
                property?.status,

              images:
                property?.images,

              imageCount:
                Array.isArray(
                  property?.images
                )
                  ? property.images.length
                  : 0,
            }
          );
        }
      );

      setProperties(
        propertiesWithImages
      );

      setFilteredProperties(
        propertiesWithImages
      );
    } catch (err) {
      console.error(
        "OWNER PROPERTIES ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load owner properties."
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
  // SEARCH + FILTER
  // ===================================================

  useEffect(() => {
    let result = [...properties];

    const searchValue =
      search
        .trim()
        .toLowerCase();

    // =================================================
    // SEARCH
    // =================================================

    if (searchValue) {
      result = result.filter(
        (property) => {
          const title =
            property?.title ||
            property?.propertyTitle ||
            "";

          const city =
            property?.cityName ||
            property?.city?.name ||
            property?.city?.cityName ||
            "";

          const state =
            property?.stateName ||
            property?.state?.name ||
            property?.state?.stateName ||
            "";

          const type =
            property?.propertyTypeName ||
            property?.propertyType?.name ||
            property?.propertyType?.typeName ||
            property?.type ||
            "";

          return (
            String(title)
              .toLowerCase()
              .includes(searchValue) ||

            String(city)
              .toLowerCase()
              .includes(searchValue) ||

            String(state)
              .toLowerCase()
              .includes(searchValue) ||

            String(type)
              .toLowerCase()
              .includes(searchValue)
          );
        }
      );
    }

    // =================================================
    // STATUS FILTER
    // =================================================

    if (statusFilter !== "ALL") {
      result = result.filter(
        (property) => {
          return (
            getPropertyStatus(
              property
            ) === statusFilter
          );
        }
      );
    }

    setFilteredProperties(result);
  }, [
    search,
    statusFilter,
    properties,
  ]);

  // ===================================================
  // DELETE CLICK
  // ===================================================

  const handleDeleteClick = (
    property
  ) => {
    setSelectedProperty(property);

    setDeleteDialogOpen(true);
  };

  // ===================================================
  // DELETE CANCEL
  // ===================================================

  const handleDeleteCancel = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteDialogOpen(false);

    setSelectedProperty(null);
  };

  // ===================================================
  // DELETE CONFIRM
  // ===================================================

  const handleDeleteConfirm =
    async () => {
      if (!selectedProperty?.id) {
        return;
      }

      try {
        setDeleteLoading(true);

        await deleteProperty(
          selectedProperty.id
        );

        setDeleteDialogOpen(false);

        setSelectedProperty(null);

        await loadProperties();
      } catch (err) {
        console.error(
          "DELETE PROPERTY ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to delete property."
        );
      } finally {
        setDeleteLoading(false);
      }
    };

  // ===================================================
  // STATISTICS
  // ===================================================

  const totalProperties =
    properties.length;

  const availableProperties =
    properties.filter(
      (property) =>
        getPropertyStatus(property) ===
        "AVAILABLE"
    ).length;

  const pendingProperties =
    properties.filter(
      (property) =>
        getPropertyStatus(property) ===
        "PENDING_APPROVAL"
    ).length;

  const soldProperties =
    properties.filter(
      (property) =>
        getPropertyStatus(property) ===
        "SOLD"
    ).length;

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
        <Box
          sx={{
            width: 78,
            height: 78,
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #2563eb, #7c3aed)",
            boxShadow:
              "0 16px 40px rgba(37,99,235,0.25)",
          }}
        >
          <HomeWork
            sx={{
              color: "white",
              fontSize: 38,
            }}
          />
        </Box>

        <CircularProgress
          size={28}
          thickness={4}
        />

        <Typography
          sx={{
            fontWeight: 700,
            color: "#334155",
          }}
        >
          Loading your properties...
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Preparing your real estate portfolio
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
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
      }}
    >
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          mb: 3,
          p: {
            xs: 2.5,
            md: 4,
          },
          color: "white",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #7c3aed 100%)",
          boxShadow:
            "0 20px 50px rgba(15,23,42,0.18)",
        }}
      >
        {/* Decorative circles */}

        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.07)",
            right: -70,
            top: -100,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.05)",
            right: 130,
            bottom: -100,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
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
            gap: 3,
          }}
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
                  width: 48,
                  height: 48,
                  background:
                    "rgba(255,255,255,0.15)",
                  backdropFilter:
                    "blur(10px)",
                }}
              >
                <HomeWork />
              </Avatar>

              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    opacity: 0.75,
                    letterSpacing: 2,
                  }}
                >
                  OWNER PORTFOLIO
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.15,
                  }}
                >
                  My Properties
                </Typography>
              </Box>
            </Stack>

            <Typography
              sx={{
                maxWidth: 620,
                color:
                  "rgba(255,255,255,0.78)",
                mt: 1.5,
              }}
            >
              Manage, monitor and showcase
              all your real estate properties
              from one powerful workspace.
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
            sx={{
              width: {
                xs: "100%",
                md: "auto",
              },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadProperties}
              disabled={loading}
              sx={{
                color: "white",
                borderColor:
                  "rgba(255,255,255,0.35)",
                borderRadius: 2.5,
                px: 2.5,
                py: 1.2,
                fontWeight: 700,
                "&:hover": {
                  borderColor: "white",
                  background:
                    "rgba(255,255,255,0.08)",
                },
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<AddHome />}
              onClick={() =>
                navigate(
                  "/owner/properties/create"
                )
              }
              sx={{
                px: 2.5,
                py: 1.2,
                borderRadius: 2.5,
                fontWeight: 800,
                background: "white",
                color: "#1d4ed8",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.15)",
                "&:hover": {
                  background: "#f8fafc",
                  transform:
                    "translateY(-2px)",
                },
              }}
            >
              Add Property
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setError("")}
          sx={{
            mb: 3,
            borderRadius: 3,
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
        sx={{ mb: 3 }}
      >
        {/* TOTAL */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border:
                "1px solid rgba(148,163,184,0.18)",
              background:
                "rgba(255,255,255,0.85)",
              backdropFilter:
                "blur(12px)",
              transition: "0.3s",
              "&:hover": {
                transform:
                  "translateY(-4px)",
                boxShadow:
                  "0 15px 35px rgba(15,23,42,0.10)",
              },
            }}
          >
            <CardContent>
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
                    sx={{
                      mt: 0.5,
                      fontWeight: 900,
                    }}
                  >
                    {totalProperties}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#dbeafe",
                    color: "#2563eb",
                  }}
                >
                  <Inventory2 />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* AVAILABLE */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border:
                "1px solid rgba(148,163,184,0.18)",
              background:
                "rgba(255,255,255,0.85)",
              backdropFilter:
                "blur(12px)",
              transition: "0.3s",
              "&:hover": {
                transform:
                  "translateY(-4px)",
                boxShadow:
                  "0 15px 35px rgba(22,163,74,0.12)",
              },
            }}
          >
            <CardContent>
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
                    Available
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      mt: 0.5,
                      fontWeight: 900,
                      color: "#16a34a",
                    }}
                  >
                    {availableProperties}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#dcfce7",
                    color: "#16a34a",
                  }}
                >
                  <CheckCircle />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* PENDING */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border:
                "1px solid rgba(148,163,184,0.18)",
              background:
                "rgba(255,255,255,0.85)",
              backdropFilter:
                "blur(12px)",
              transition: "0.3s",
              "&:hover": {
                transform:
                  "translateY(-4px)",
                boxShadow:
                  "0 15px 35px rgba(234,179,8,0.12)",
              },
            }}
          >
            <CardContent>
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
                    Pending Approval
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      mt: 0.5,
                      fontWeight: 900,
                      color: "#d97706",
                    }}
                  >
                    {pendingProperties}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#fef3c7",
                    color: "#d97706",
                  }}
                >
                  <PendingActions />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* SOLD */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border:
                "1px solid rgba(148,163,184,0.18)",
              background:
                "rgba(255,255,255,0.85)",
              backdropFilter:
                "blur(12px)",
              transition: "0.3s",
              "&:hover": {
                transform:
                  "translateY(-4px)",
                boxShadow:
                  "0 15px 35px rgba(124,58,237,0.12)",
              },
            }}
          >
            <CardContent>
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
                    Sold Properties
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      mt: 0.5,
                      fontWeight: 900,
                      color: "#7c3aed",
                    }}
                  >
                    {soldProperties}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#ede9fe",
                    color: "#7c3aed",
                  }}
                >
                  <TrendingUp />
                </Avatar>
              </Stack>
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
          border:
            "1px solid rgba(148,163,184,0.18)",
          background:
            "rgba(255,255,255,0.9)",
          backdropFilter:
            "blur(12px)",
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
            alignItems="center"
          >
            <Grid
              size={{
                xs: 12,
                md: 8,
              }}
            >
              <TextField
                fullWidth
                label="Search Properties"
                placeholder="Search by title, city, state or property type..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment:
                    search && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setSearch("")
                          }
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      borderRadius: 2.5,
                      background:
                        "#f8fafc",
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
                      background:
                        "#f8fafc",
                    },
                }}
              >
                <MenuItem value="ALL">
                  All Statuses
                </MenuItem>

                <MenuItem value="AVAILABLE">
                  Available
                </MenuItem>

                <MenuItem value="PENDING_APPROVAL">
                  Pending Approval
                </MenuItem>

                <MenuItem value="BOOKED">
                  Booked
                </MenuItem>

                <MenuItem value="SOLD">
                  Sold
                </MenuItem>

                <MenuItem value="REJECTED">
                  Rejected
                </MenuItem>

                <MenuItem value="INACTIVE">
                  Inactive
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* =================================================
          SUMMARY BAR
      ================================================= */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          <Chip
            icon={<HomeWork />}
            label={`${filteredProperties.length} Properties`}
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              background:
                "rgba(255,255,255,0.7)",
            }}
          />

          {statusFilter !== "ALL" && (
            <Chip
              label={getStatusLabel(
                statusFilter
              )}
              color={getStatusColor(
                statusFilter
              )}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
              }}
            />
          )}
        </Stack>

        {search && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Searching for{" "}
            <strong>
              "{search}"
            </strong>
          </Typography>
        )}
      </Box>

      {/* =================================================
          NO PROPERTIES
      ================================================= */}

      {filteredProperties.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            textAlign: "center",
            py: 9,
            px: 2,
            border:
              "1px solid rgba(148,163,184,0.18)",
            background:
              "rgba(255,255,255,0.85)",
          }}
        >
          <CardContent>
            <Box
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 3,
                borderRadius: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #dbeafe, #ede9fe)",
              }}
            >
              <HomeWork
                sx={{
                  fontSize: 52,
                  color: "#4f46e5",
                }}
              />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
              }}
            >
              No properties found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                mb: 3,
                maxWidth: 520,
                mx: "auto",
              }}
            >
              {properties.length === 0
                ? "You have not added any properties yet. Start building your real estate portfolio today."
                : "No properties match your current search or status filter. Try changing your filters."}
            </Typography>

            {properties.length === 0 ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddHome />}
                onClick={() =>
                  navigate(
                    "/owner/properties/create"
                  )
                }
                sx={{
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.3,
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #2563eb, #7c3aed)",
                  boxShadow:
                    "0 10px 25px rgba(37,99,235,0.25)",
                }}
              >
                Add Your First Property
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 700,
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid
          container
          spacing={3}
        >
          {filteredProperties.map(
            (property) => {
              const image =
                getPropertyImage(
                  property
                );

              const propertyTitle =
                property?.title ||
                property?.propertyTitle ||
                "Untitled Property";

              const propertyType =
                property?.propertyTypeName ||
                property?.propertyType?.name ||
                property?.propertyType?.typeName ||
                property?.type ||
                "Property";

              const city =
                property?.cityName ||
                property?.city?.name ||
                property?.city?.cityName ||
                "";

              const state =
                property?.stateName ||
                property?.state?.name ||
                property?.state?.stateName ||
                "";

              const location =
                [city, state]
                  .filter(Boolean)
                  .join(", ");

              const price =
                property?.price;

              const bedrooms =
                property?.bedrooms;

              const area =
                property?.area ||
                property?.areaSqFt;

              const status =
                getPropertyStatus(
                  property
                );

              return (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 4,
                  }}
                  key={property.id}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection:
                        "column",
                      borderRadius: 4,
                      overflow: "hidden",
                      border:
                        "1px solid rgba(148,163,184,0.18)",
                      background:
                        "rgba(255,255,255,0.95)",
                      boxShadow:
                        "0 10px 30px rgba(15,23,42,0.07)",
                      transition:
                        "all 0.35s ease",

                      "&:hover": {
                        transform:
                          "translateY(-8px)",
                        boxShadow:
                          "0 24px 55px rgba(15,23,42,0.15)",
                      },
                    }}
                  >
                    {/* =========================================
                        IMAGE
                    ========================================= */}

                    <Box
                      sx={{
                        position:
                          "relative",
                        height: 230,
                        overflow:
                          "hidden",
                        background:
                          "linear-gradient(135deg, #e2e8f0, #f1f5f9)",
                      }}
                    >
                      {image ? (
                        <CardMedia
                          component="img"
                          height="230"
                          image={image}
                          alt={propertyTitle}
                          onError={(
                            event
                          ) => {
                            console.error(
                              "IMAGE LOAD FAILED:",
                              image
                            );

                            event.currentTarget.style.display =
                              "none";
                          }}
                          sx={{
                            height: "100%",
                            width: "100%",
                            objectFit:
                              "cover",
                            transition:
                              "transform 0.5s ease",

                            "&:hover": {
                              transform:
                                "scale(1.06)",
                            },
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: "100%",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              "linear-gradient(135deg, #e0e7ff, #f1f5f9)",
                          }}
                        >
                          <HomeWork
                            sx={{
                              fontSize: 78,
                              color:
                                "#94a3b8",
                            }}
                          />
                        </Box>
                      )}

                      {/* Image gradient */}

                      <Box
                        sx={{
                          position:
                            "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to bottom, rgba(15,23,42,0.12), transparent 45%, rgba(15,23,42,0.55))",
                          pointerEvents:
                            "none",
                        }}
                      />

                      {/* Status */}

                      <Box
                        sx={{
                          position:
                            "absolute",
                          top: 14,
                          left: 14,
                          zIndex: 2,
                        }}
                      >
                        <Chip
                          size="small"
                          label={getStatusLabel(
                            status
                          )}
                          color={getStatusColor(
                            status
                          )}
                          sx={{
                            fontWeight: 800,
                            borderRadius: 1.5,
                            boxShadow:
                              "0 5px 15px rgba(0,0,0,0.15)",
                            backdropFilter:
                              "blur(8px)",
                          }}
                        />
                      </Box>

                      {/* Property Type */}

                      <Box
                        sx={{
                          position:
                            "absolute",
                          bottom: 14,
                          left: 14,
                          zIndex: 2,
                        }}
                      >
                        <Chip
                          icon={
                            <Apartment
                              sx={{
                                fontSize:
                                  17,
                              }}
                            />
                          }
                          label={
                            propertyType
                          }
                          size="small"
                          sx={{
                            color:
                              "white",
                            background:
                              "rgba(15,23,42,0.72)",
                            backdropFilter:
                              "blur(8px)",
                            fontWeight: 700,
                            border:
                              "1px solid rgba(255,255,255,0.15)",
                          }}
                        />
                      </Box>

                      {/* Image count */}

                      {Array.isArray(
                        property?.images
                      ) &&
                        property.images
                          .length >
                          0 && (
                          <Box
                            sx={{
                              position:
                                "absolute",
                              bottom: 14,
                              right: 14,
                              zIndex: 2,
                            }}
                          >
                            <Chip
                              label={`📷 ${property.images.length}`}
                              size="small"
                              sx={{
                                color:
                                  "white",
                                background:
                                  "rgba(15,23,42,0.72)",
                                backdropFilter:
                                  "blur(8px)",
                                fontWeight: 700,
                              }}
                            />
                          </Box>
                        )}
                    </Box>

                    {/* =========================================
                        CONTENT
                    ========================================= */}

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
                          fontWeight: 900,
                          lineHeight: 1.25,
                          mb: 0.8,
                          display:
                            "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient:
                            "vertical",
                          overflow:
                            "hidden",
                        }}
                      >
                        {propertyTitle}
                      </Typography>

                      {/* LOCATION */}

                      {location && (
                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 0.6,
                            mb: 2,
                          }}
                        >
                          <LocationOn
                            sx={{
                              fontSize: 18,
                              color:
                                "#ef4444",
                            }}
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

                      {/* PRICE */}

                      <Box
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          mb: 2,
                          p: 1.5,
                          borderRadius: 2.5,
                          background:
                            "linear-gradient(135deg, #eff6ff, #eef2ff)",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={600}
                          >
                            LISTING PRICE
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight: 900,
                              fontSize:
                                "1.15rem",
                              color:
                                "#1d4ed8",
                            }}
                          >
                            {formatPrice(
                              price
                            )}
                          </Typography>
                        </Box>

                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            bgcolor:
                              "#dbeafe",
                            color:
                              "#2563eb",
                          }}
                        >
                          <AttachMoney
                            fontSize="small"
                          />
                        </Avatar>
                      </Box>

                      {/* DETAILS */}

                      <Box
                        sx={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "1fr 1fr",
                          gap: 1,
                        }}
                      >
                        {bedrooms !==
                          undefined &&
                          bedrooms !==
                            null && (
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.2,
                                borderRadius:
                                  2,
                                background:
                                  "#f8fafc",
                                border:
                                  "1px solid #e2e8f0",
                              }}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Bed
                                  sx={{
                                    fontSize:
                                      20,
                                    color:
                                      "#6366f1",
                                  }}
                                />

                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Bedrooms
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    fontWeight={800}
                                  >
                                    {
                                      bedrooms
                                    }{" "}
                                    Beds
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          )}

                        {area !==
                          undefined &&
                          area !==
                            null && (
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.2,
                                borderRadius:
                                  2,
                                background:
                                  "#f8fafc",
                                border:
                                  "1px solid #e2e8f0",
                              }}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <SquareFoot
                                  sx={{
                                    fontSize:
                                      20,
                                    color:
                                      "#0891b2",
                                  }}
                                />

                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Area
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    fontWeight={800}
                                  >
                                    {area}{" "}
                                    sq.ft
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          )}
                      </Box>

                      {/* Bottom status information */}

                      <Box
                        sx={{
                          mt: 2,
                          pt: 1.5,
                          borderTop:
                            "1px dashed #e2e8f0",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Property ID
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color:
                              "#475569",
                            maxWidth:
                              130,
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                          }}
                        >
                          {property.id}
                        </Typography>
                      </Box>
                    </CardContent>

                    <Divider />

                    {/* =========================================
                        ACTIONS
                    ========================================= */}

                    <Box
                      sx={{
                        p: 1.5,
                        display:
                          "flex",
                        gap: 1,
                        background:
                          "#fafafa",
                      }}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={
                          <Visibility />
                        }
                        onClick={() =>
                          navigate(
                            `/owner/properties/${property.id}`
                          )
                        }
                        sx={{
                          borderRadius: 2,
                          fontWeight: 800,
                          py: 1.1,
                          background:
                            "linear-gradient(135deg, #2563eb, #4f46e5)",
                          boxShadow:
                            "none",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #1d4ed8, #4338ca)",
                            boxShadow:
                              "0 8px 18px rgba(37,99,235,0.22)",
                          },
                        }}
                      >
                        View
                      </Button>

                      <Tooltip title="Edit Property">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(
                              `/owner/properties/${property.id}/edit`
                            )
                          }
                          sx={{
                            border:
                              "1px solid #dbeafe",
                            borderRadius: 2,
                            background:
                              "#eff6ff",
                            "&:hover": {
                              background:
                                "#dbeafe",
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Property">
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDeleteClick(
                              property
                            )
                          }
                          sx={{
                            border:
                              "1px solid #fecaca",
                            borderRadius: 2,
                            background:
                              "#fef2f2",
                            "&:hover": {
                              background:
                                "#fee2e2",
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              );
            }
          )}
        </Grid>
      )}

      {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

      <Dialog
        open={deleteDialogOpen}
        onClose={
          handleDeleteCancel
        }
        PaperProps={{
          sx: {
            borderRadius: 4,
            minWidth: {
              xs: "90%",
              sm: 450,
            },
            overflow: "hidden",
          },
        }}
      >
        {/* Dialog Header */}

        <Box
          sx={{
            p: 2.5,
            background:
              "linear-gradient(135deg, #fff1f2, #fef2f2)",
            borderBottom:
              "1px solid #fee2e2",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Avatar
              sx={{
                bgcolor: "#fee2e2",
                color: "#dc2626",
              }}
            >
              <Delete />
            </Avatar>

            <DialogTitle
              sx={{
                p: 0,
                fontWeight: 900,
              }}
            >
              Delete Property?
            </DialogTitle>
          </Stack>
        </Box>

        <DialogContent
          sx={{
            p: 3,
          }}
        >
          <DialogContentText
            sx={{
              color: "#475569",
              lineHeight: 1.7,
            }}
          >
            Are you sure you want to delete{" "}
            <strong
              style={{
                color: "#0f172a",
              }}
            >
              {selectedProperty?.title ||
                selectedProperty?.propertyTitle ||
                "this property"}
            </strong>
            ?

            <br />
            <br />

            This action will deactivate the
            property from the system. The
            property will no longer be
            available as an active listing.
          </DialogContentText>

          {selectedProperty && (
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                background:
                  "#f8fafc",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <HomeWork
                  sx={{
                    color:
                      "#64748b",
                  }}
                />

                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={800}
                  >
                    Property selected
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    ID:{" "}
                    {
                      selectedProperty.id
                    }
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            pt: 0.5,
            gap: 1,
          }}
        >
          <Button
            onClick={
              handleDeleteCancel
            }
            disabled={deleteLoading}
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 2.5,
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={
              handleDeleteConfirm
            }
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <Delete />
              )
            }
            sx={{
              borderRadius: 2,
              fontWeight: 800,
              px: 2.5,
            }}
          >
            {deleteLoading
              ? "Deleting..."
              : "Delete Property"}
          </Button>
        </DialogActions>

        {deleteLoading && (
          <LinearProgress
            color="error"
          />
        )}
      </Dialog>
    </Box>
  );
}

export default OwnerProperties;
