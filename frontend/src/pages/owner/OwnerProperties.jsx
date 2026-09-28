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
          Loading your properties...
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
          justifyContent: "space-between",
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
            My Properties
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Manage your real estate properties
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Tooltip title="Refresh">
            <IconButton
              onClick={
                loadProperties
              }
              disabled={loading}
            >
              <Refresh />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddHome />}
            onClick={() =>
              navigate(
                "/owner/properties/create"
              )
            }
          >
            Add Property
          </Button>
        </Box>
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
                label="Search Properties"
                placeholder="Search by title, city, state or type..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
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
          SUMMARY
      ================================================= */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Chip
          icon={<HomeWork />}
          label={`${filteredProperties.length} Properties`}
          variant="outlined"
        />

        {statusFilter !== "ALL" && (
          <Chip
            label={getStatusLabel(
              statusFilter
            )}
            color={getStatusColor(
              statusFilter
            )}
          />
        )}
      </Box>

      {/* =================================================
          NO PROPERTIES
      ================================================= */}

      {filteredProperties.length === 0 ? (
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            textAlign: "center",
            py: 8,
          }}
        >
          <CardContent>
            <HomeWork
              sx={{
                fontSize: 70,
                color: "text.secondary",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              No properties found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                mb: 3,
              }}
            >
              {properties.length === 0
                ? "You have not added any properties yet."
                : "Try changing your search or status filter."}
            </Typography>

            {properties.length === 0 && (
              <Button
                variant="contained"
                startIcon={<AddHome />}
                onClick={() =>
                  navigate(
                    "/owner/properties/create"
                  )
                }
              >
                Add Your First Property
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
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "0.3s",

                      "&:hover": {
                        transform:
                          "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    {/* =========================================
                        IMAGE
                    ========================================= */}

                    {image ? (
                      <CardMedia
                        component="img"
                        height="210"
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
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 210,
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          backgroundColor:
                            "action.hover",
                        }}
                      >
                        <HomeWork
                          sx={{
                            fontSize: 70,
                            color:
                              "text.secondary",
                          }}
                        />
                      </Box>
                    )}

                    {/* =========================================
                        CONTENT
                    ========================================= */}

                    <CardContent
                      sx={{
                        flexGrow: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            lineHeight: 1.3,
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

                      {/* TYPE */}

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1.5,
                        }}
                      >
                        {propertyType}
                      </Typography>

                      {/* PRICE */}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 0.5,
                          mb: 1,
                        }}
                      >
                        <AttachMoney
                          fontSize="small"
                        />

                        <Typography
                          sx={{
                            fontWeight: 700,
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
                            display: "flex",
                            alignItems:
                              "center",
                            gap: 0.5,
                            mb: 1,
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

                      {/* BEDROOMS + AREA */}

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          mt: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        {bedrooms !==
                          undefined &&
                          bedrooms !==
                            null && (
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: 0.5,
                              }}
                            >
                              <Bed fontSize="small" />

                              <Typography variant="body2">
                                {bedrooms} Beds
                              </Typography>
                            </Box>
                          )}

                        {area !==
                          undefined &&
                          area !==
                            null && (
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: 0.5,
                              }}
                            >
                              <SquareFoot fontSize="small" />

                              <Typography variant="body2">
                                {area} sq.ft
                              </Typography>
                            </Box>
                          )}
                      </Box>

                      {/* IMAGE COUNT */}

                      {Array.isArray(
                        property?.images
                      ) &&
                        property.images
                          .length > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display:
                                "block",
                              mt: 2,
                            }}
                          >
                            📷{" "}
                            {
                              property
                                .images
                                .length
                            }{" "}
                            image
                            {property
                              .images
                              .length !==
                            1
                              ? "s"
                              : ""}
                          </Typography>
                        )}
                    </CardContent>

                    <Divider />

                    {/* =========================================
                        ACTIONS
                    ========================================= */}

                    <Box
                      sx={{
                        p: 1.5,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={
                          <Visibility />
                        }
                        onClick={() =>
                          navigate(
                            `/owner/properties/${property.id}`
                          )
                        }
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
      >
        <DialogTitle>
          Delete Property?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>
              {selectedProperty?.title ||
                selectedProperty?.propertyTitle ||
                "this property"}
            </strong>
            ?

            <br />
            <br />

            This action will deactivate the
            property from the system.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleDeleteCancel
            }
            disabled={deleteLoading}
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
          >
            {deleteLoading
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OwnerProperties;