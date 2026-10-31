import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";

import {
  ArrowBack,
  Edit,
  Delete,
  LocationOn,
  Bed,
  SquareFoot,
  AttachMoney,
  HomeWork,
  Close,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "@mui/icons-material";

import {
  getPropertyById,
  getPropertyImages,
  deleteProperty,
} from "../../api";

// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL = "http://localhost:9090";

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (image) => {
  if (!image) {
    return null;
  }

  // ---------------------------------------------
  // String image
  // ---------------------------------------------

  if (typeof image === "string") {
    const value = image.trim();

    if (!value) {
      return null;
    }

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    if (value.startsWith("/")) {
      return `${BACKEND_URL}${value}`;
    }

    return `${BACKEND_URL}/${value}`;
  }

  // ---------------------------------------------
  // Object image
  // ---------------------------------------------

  const imagePath =
    image?.imageUrl ||
    image?.url ||
    image?.path ||
    image?.imagePath ||
    image?.fileUrl ||
    image?.filePath ||
    image?.image ||
    image?.src;

  if (!imagePath) {
    return null;
  }

  const value = String(imagePath).trim();

  if (!value) {
    return null;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${BACKEND_URL}${value}`;
  }

  return `${BACKEND_URL}/${value}`;
};

// =====================================================
// EXTRACT IMAGES
// =====================================================

const extractImages = (response) => {
  if (!response) {
    return [];
  }

  // ---------------------------------------------
  // response.data
  // ---------------------------------------------

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  // ---------------------------------------------
  // response.data.data
  // ---------------------------------------------

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  // ---------------------------------------------
  // response.images
  // ---------------------------------------------

  if (Array.isArray(response?.images)) {
    return response.images;
  }

  // ---------------------------------------------
  // response.data.images
  // ---------------------------------------------

  if (Array.isArray(response?.data?.images)) {
    return response.data.images;
  }

  // ---------------------------------------------
  // response itself is array
  // ---------------------------------------------

  if (Array.isArray(response)) {
    return response;
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
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));
};

// =====================================================
// STATUS
// =====================================================

const getPropertyStatus = (property) => {
  const status =
    property?.status ||
    property?.propertyStatus ||
    property?.propertyStatusName ||
    property?.statusName ||
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

    default:
      return "default";
  }
};

// =====================================================
// OWNER PROPERTY DETAILS
// =====================================================

function OwnerPropertyDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  // ===================================================
  // STATE
  // ===================================================

  const [property, setProperty] = useState(null);

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [imageLoading, setImageLoading] = useState(true);

  const [error, setError] = useState("");

  // ===================================================
  // IMAGE VIEWER
  // ===================================================

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [selectedImageIndex, setSelectedImageIndex] =
    useState(0);

  // ===================================================
  // DELETE
  // ===================================================

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // ===================================================
  // LOAD PROPERTY
  // ===================================================

  const loadProperty = async () => {
    try {
      setLoading(true);
      setImageLoading(true);
      setError("");

      console.log(
        "LOADING OWNER PROPERTY:",
        id
      );

      // ---------------------------------------------
      // GET PROPERTY
      // ---------------------------------------------

      const propertyResponse =
        await getPropertyById(id);

      console.log(
        "OWNER PROPERTY DETAILS:",
        propertyResponse
      );

      let propertyData =
        propertyResponse?.data ||
        propertyResponse;

      // Sometimes API response is:
      // { data: { data: {...} } }

      if (
        propertyData?.data &&
        !Array.isArray(propertyData.data)
      ) {
        propertyData =
          propertyData.data;
      }

      setProperty(propertyData);

      // ---------------------------------------------
      // GET PROPERTY IMAGES
      // ---------------------------------------------

      try {
        console.log(
          "LOADING PROPERTY IMAGES:",
          id
        );

        const imageResponse =
          await getPropertyImages(id);

        console.log(
          "PROPERTY IMAGES RESPONSE:",
          imageResponse
        );

        const imageData =
          extractImages(imageResponse);

        console.log(
          "EXTRACTED PROPERTY IMAGES:",
          imageData
        );

        setImages(imageData);

      } catch (imageError) {
        console.error(
          "PROPERTY IMAGE API ERROR:",
          imageError
        );

        // -----------------------------------------
        // FALLBACK TO PROPERTY.images
        // -----------------------------------------

        if (
          Array.isArray(
            propertyData?.images
          )
        ) {
          setImages(
            propertyData.images
          );
        } else {
          setImages([]);
        }
      }

    } catch (err) {
      console.error(
        "OWNER PROPERTY DETAILS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load property details."
      );

    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  // ===================================================
  // LOAD
  // ===================================================

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  // ===================================================
  // PREPARE IMAGE URLS
  // ===================================================

  const imageUrls = images
    .map((image) => {
      return getImageUrl(image);
    })
    .filter(Boolean);

  // ===================================================
  // ALSO USE PROPERTY IMAGES IF API DID NOT RETURN
  // ===================================================

  if (
    imageUrls.length === 0 &&
    Array.isArray(property?.images)
  ) {
    property.images.forEach((image) => {
      const url = getImageUrl(image);

      if (
        url &&
        !imageUrls.includes(url)
      ) {
        imageUrls.push(url);
      }
    });
  }

  // ===================================================
  // DEBUG
  // ===================================================

  console.log(
    "FINAL IMAGE URLS:",
    imageUrls
  );

  // ===================================================
  // OPEN IMAGE
  // ===================================================

  const handleOpenImage = (index) => {
    setSelectedImageIndex(index);
    setSelectedImage(
      imageUrls[index]
    );
  };

  // ===================================================
  // NEXT IMAGE
  // ===================================================

  const handleNextImage = () => {
    if (imageUrls.length === 0) {
      return;
    }

    const nextIndex =
      (selectedImageIndex + 1) %
      imageUrls.length;

    setSelectedImageIndex(
      nextIndex
    );

    setSelectedImage(
      imageUrls[nextIndex]
    );
  };

  // ===================================================
  // PREVIOUS IMAGE
  // ===================================================

  const handlePreviousImage = () => {
    if (imageUrls.length === 0) {
      return;
    }

    const previousIndex =
      (selectedImageIndex -
        1 +
        imageUrls.length) %
      imageUrls.length;

    setSelectedImageIndex(
      previousIndex
    );

    setSelectedImage(
      imageUrls[previousIndex]
    );
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await deleteProperty(id);

      setDeleteDialogOpen(false);

      navigate(
        "/owner/properties"
      );

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
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />

        <Typography color="text.secondary">
          Loading property details...
        </Typography>
      </Box>
    );
  }

  // ===================================================
  // ERROR / NO PROPERTY
  // ===================================================

  if (!property) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error ||
            "Property not found."}
        </Alert>

        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate(
              "/owner/properties"
            )
          }
        >
          Back to Properties
        </Button>
      </Box>
    );
  }

  // ===================================================
  // PROPERTY DATA
  // ===================================================

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

  const bathrooms =
    property?.bathrooms;

  const area =
    property?.area ||
    property?.areaSqFt;

  const status =
    getPropertyStatus(property);

  const description =
    property?.description ||
    property?.propertyDescription ||
    "No description available.";

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
          mb: 3,
        }}
      >

        <Button
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate(
              "/owner/properties"
            )
          }
        >
          Back to Properties
        </Button>

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >

          <Button
            variant="outlined"
            color="primary"
            startIcon={<Edit />}
            onClick={() =>
              navigate(
                `/owner/properties/${id}/edit`
              )
            }
          >
            Edit Property
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() =>
              setDeleteDialogOpen(true)
            }
          >
            Delete
          </Button>

        </Box>

      </Box>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* =================================================
          PROPERTY TITLE
      ================================================= */}

      <Card
        elevation={3}
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

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                }}
              >
                {propertyTitle}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                {propertyType}
              </Typography>

            </Box>

            <Chip
              label={
                getStatusLabel(status)
              }
              color={
                getStatusColor(status)
              }
              sx={{
                fontWeight: 700,
              }}
            />

          </Box>

        </CardContent>

      </Card>

      {/* =================================================
          IMAGE GALLERY
      ================================================= */}

      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          mb: 3,
          overflow: "hidden",
        }}
      >

        <CardContent>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >

            <ImageIcon />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Property Images
            </Typography>

            <Chip
              size="small"
              label={`${imageUrls.length} Images`}
              variant="outlined"
            />

          </Box>

          {imageLoading ? (

            <Box
              sx={{
                height: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>

          ) : imageUrls.length > 0 ? (

            <Grid
              container
              spacing={2}
            >

              {imageUrls.map(
                (imageUrl, index) => (

                  <Grid
                    key={`${imageUrl}-${index}`}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                    }}
                  >

                    <Box
                      sx={{
                        position: "relative",
                        height: 250,
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        backgroundColor:
                          "action.hover",

                        "&:hover img": {
                          transform:
                            "scale(1.05)",
                        },
                      }}
                      onClick={() =>
                        handleOpenImage(
                          index
                        )
                      }
                    >

                      <CardMedia
                        component="img"
                        src={imageUrl}
                        alt={`${propertyTitle} ${index + 1}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition:
                            "transform 0.3s",
                        }}
                        onError={(event) => {
                          console.error(
                            "IMAGE LOAD FAILED:",
                            imageUrl
                          );

                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 1,
                          background:
                            "linear-gradient(transparent, rgba(0,0,0,0.7))",
                        }}
                      >

                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Image {index + 1}
                        </Typography>

                      </Box>

                    </Box>

                  </Grid>

                )
              )}

            </Grid>

          ) : (

            <Box
              sx={{
                height: 300,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  "action.hover",
                borderRadius: 2,
              }}
            >

              <HomeWork
                sx={{
                  fontSize: 80,
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
                No Images Available
              </Typography>

              <Typography
                color="text.secondary"
              >
                No images have been uploaded
                for this property.
              </Typography>

            </Box>

          )}

        </CardContent>

      </Card>

      {/* =================================================
          PROPERTY INFORMATION
      ================================================= */}

      <Grid
        container
        spacing={3}
      >

        {/* LEFT */}

        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >

          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              height: "100%",
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
                Property Information
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid
                container
                spacing={3}
              >

                {/* PRICE */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >

                    <AttachMoney />

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Price
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.1rem",
                        }}
                      >
                        {formatPrice(
                          price
                        )}
                      </Typography>

                    </Box>

                  </Box>

                </Grid>

                {/* LOCATION */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >

                    <LocationOn />

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Location
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {location ||
                          "Not specified"}
                      </Typography>

                    </Box>

                  </Box>

                </Grid>

                {/* BEDROOMS */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >

                    <Bed />

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Bedrooms
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {bedrooms ??
                          "Not specified"}
                      </Typography>

                    </Box>

                  </Box>

                </Grid>

                {/* BATHROOMS */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >

                    <HomeWork />

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Bathrooms
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {bathrooms ??
                          "Not specified"}
                      </Typography>

                    </Box>

                  </Box>

                </Grid>

                {/* AREA */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >

                    <SquareFoot />

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Area
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {area
                          ? `${area} sq.ft`
                          : "Not specified"}
                      </Typography>

                    </Box>

                  </Box>

                </Grid>

              </Grid>

            </CardContent>

          </Card>

        </Grid>

        {/* RIGHT */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >

          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              height: "100%",
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
                Description
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.8,
                }}
              >
                {description}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      {/* =================================================
          FULL IMAGE DIALOG
      ================================================= */}

      <Dialog
        open={
          Boolean(selectedImage)
        }
        onClose={() =>
          setSelectedImage(null)
        }
        maxWidth="lg"
        fullWidth
      >

        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            Property Image
          </Typography>

          <IconButton
            onClick={() =>
              setSelectedImage(null)
            }
          >
            <Close />
          </IconButton>

        </DialogTitle>

        <DialogContent
          sx={{
            position: "relative",
            backgroundColor: "#111",
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
          }}
        >

          {selectedImage && (

            <img
              src={selectedImage}
              alt={propertyTitle}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />

          )}

          {imageUrls.length > 1 && (

            <>

              <IconButton
                onClick={
                  handlePreviousImage
                }
                sx={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  backgroundColor:
                    "rgba(255,255,255,0.8)",
                  "&:hover": {
                    backgroundColor:
                      "white",
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={
                  handleNextImage
                }
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  backgroundColor:
                    "rgba(255,255,255,0.8)",
                  "&:hover": {
                    backgroundColor:
                      "white",
                  },
                }}
              >
                <ChevronRight />
              </IconButton>

            </>

          )}

        </DialogContent>

      </Dialog>

      {/* =================================================
          DELETE DIALOG
      ================================================= */}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (!deleteLoading) {
            setDeleteDialogOpen(
              false
            );
          }
        }}
      >

        <DialogTitle>
          Delete Property?
        </DialogTitle>

        <DialogContent>

          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {propertyTitle}
            </strong>
            ?
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
            }}
          >
            This action will deactivate
            the property from the system.
          </Typography>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setDeleteDialogOpen(
                false
              )
            }
            disabled={
              deleteLoading
            }
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={
              deleteLoading
            }
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

export default OwnerPropertyDetails;