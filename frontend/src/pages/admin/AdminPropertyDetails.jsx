import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  Delete,
  Edit,
  CloudUpload,
  Image as ImageIcon,
} from "@mui/icons-material";

import {
  getPropertyById,
  getPropertyImages,
  uploadPropertyImage,
  deletePropertyImage,
} from "../../api";


function AdminPropertyDetails() {

  // =====================================================
  // ROUTER
  // =====================================================

  const { id } = useParams();

  const navigate = useNavigate();


  // =====================================================
  // PROPERTY STATE
  // =====================================================

  const [property, setProperty] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // IMAGE STATE
  // =====================================================

  const [images, setImages] =
    useState([]);

  const [imagesLoading, setImagesLoading] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [deletingImageId, setDeletingImageId] =
    useState(null);


  // =====================================================
  // MESSAGE STATE
  // =====================================================

  const [successMessage, setSuccessMessage] =
    useState("");

  const [imageError, setImageError] =
    useState("");


  // =====================================================
  // BACKEND URL
  // =====================================================

  const BACKEND_URL =
    "http://localhost:9090";


  // =====================================================
  // LOAD PROPERTY
  // =====================================================

  useEffect(() => {

    const loadProperty = async () => {

      try {

        setLoading(true);

        setError("");

        console.log(
          "Loading property ID:",
          id
        );


        const result =
          await getPropertyById(id);


        console.log(
          "Property details response:",
          result
        );


        if (
          result &&
          result.success
        ) {

          setProperty(result.data);

        } else {

          setError(
            result?.message ||
              "Unable to load property details."
          );

        }

      } catch (err) {

        console.error(
          "Get property details error:",
          err
        );


        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load property details."
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {

      loadProperty();

    } else {

      setError(
        "Property ID is missing."
      );

      setLoading(false);

    }

  }, [id]);


  // =====================================================
  // LOAD PROPERTY IMAGES
  // =====================================================

  useEffect(() => {

    if (!id) {
      return;
    }


    loadPropertyImages();

  }, [id]);


  // =====================================================
  // GET PROPERTY IMAGES
  // =====================================================

  const loadPropertyImages =
    async () => {

      try {

        setImagesLoading(true);

        setImageError("");


        console.log(
          "Loading images for property:",
          id
        );


        const result =
          await getPropertyImages(id);


        console.log(
          "Property images response:",
          result
        );


        if (
          result &&
          result.success
        ) {

          setImages(
            Array.isArray(result.data)
              ? result.data
              : []
          );

        } else {

          setImages([]);

          setImageError(
            result?.message ||
              "Unable to load property images."
          );

        }

      } catch (err) {

        console.error(
          "Get property images error:",
          err
        );


        setImages([]);


        setImageError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load property images."
        );

      } finally {

        setImagesLoading(false);

      }

    };


  // =====================================================
  // SELECT IMAGE
  // =====================================================

  const handleFileChange =
    (event) => {

      const file =
        event.target.files?.[0];


      if (!file) {

        setSelectedFile(null);

        return;

      }


      // -------------------------------------------------
      // Validate image type
      // -------------------------------------------------

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        setImageError(
          "Please select a valid image file."
        );

        setSelectedFile(null);

        return;

      }


      // -------------------------------------------------
      // Validate file size
      // -------------------------------------------------

      const maxSize =
        5 * 1024 * 1024;


      if (
        file.size > maxSize
      ) {

        setImageError(
          "Image size must be less than 5 MB."
        );

        setSelectedFile(null);

        return;

      }


      setImageError("");

      setSuccessMessage("");

      setSelectedFile(file);

    };


  // =====================================================
  // UPLOAD IMAGE
  // =====================================================

  const handleUpload =
    async () => {

      if (!selectedFile) {

        setImageError(
          "Please select an image first."
        );

        return;

      }


      try {

        setUploading(true);

        setImageError("");

        setSuccessMessage("");


        console.log(
          "Uploading image:",
          selectedFile.name
        );


        const displayOrder =
          images.length;


        const result =
          await uploadPropertyImage(
            id,
            selectedFile,
            displayOrder
          );


        console.log(
          "Upload image response:",
          result
        );


        if (
          result &&
          result.success
        ) {

          setSuccessMessage(
            "Property image uploaded successfully."
          );


          setSelectedFile(null);


          // Reset file input
          const fileInput =
            document.getElementById(
              "property-image-upload"
            );


          if (fileInput) {

            fileInput.value = "";

          }


          // Reload images
          await loadPropertyImages();

        } else {

          setImageError(
            result?.message ||
              "Unable to upload property image."
          );

        }

      } catch (err) {

        console.error(
          "Upload property image error:",
          err
        );


        setImageError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to upload property image."
        );

      } finally {

        setUploading(false);

      }

    };


  // =====================================================
  // DELETE IMAGE
  // =====================================================

  const handleDeleteImage =
    async (imageId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this property image?"
        );


      if (!confirmed) {

        return;

      }


      try {

        setDeletingImageId(
          imageId
        );

        setImageError("");

        setSuccessMessage("");


        console.log(
          "Deleting property image:",
          imageId
        );


        const result =
          await deletePropertyImage(
            imageId
          );


        console.log(
          "Delete image response:",
          result
        );


        if (
          result &&
          result.success
        ) {

          setSuccessMessage(
            "Property image deleted successfully."
          );


          // Reload images
          await loadPropertyImages();

        } else {

          setImageError(
            result?.message ||
              "Unable to delete property image."
          );

        }

      } catch (err) {

        console.error(
          "Delete property image error:",
          err
        );


        setImageError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to delete property image."
        );

      } finally {

        setDeletingImageId(null);

      }

    };


  // =====================================================
  // IMAGE URL HELPER
  // =====================================================

  const getImageUrl =
    (imageUrl) => {

      if (!imageUrl) {

        return "";

      }


      // Already complete URL
      if (
        imageUrl.startsWith(
          "http://"
        ) ||
        imageUrl.startsWith(
          "https://"
        )
      ) {

        return imageUrl;

      }


      // Backend relative URL
      if (
        imageUrl.startsWith("/")
      ) {

        return (
          BACKEND_URL +
          imageUrl
        );

      }


      return (
        BACKEND_URL +
        "/" +
        imageUrl
      );

    };


  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice =
    (price) => {

      if (
        price === null ||
        price === undefined ||
        price === ""
      ) {

        return "-";

      }


      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }
      ).format(price);

    };


  // =====================================================
  // LOADING
  // =====================================================

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

        <Typography
          color="text.secondary"
        >
          Loading property details...
        </Typography>

      </Box>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <Box
        sx={{
          p: 3,
        }}
      >

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mb: 2,
          }}
        >
          Property Details
        </Typography>


        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>


        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate(
              "/admin/properties"
            )
          }
        >
          Back to Properties
        </Button>

      </Box>

    );

  }


  // =====================================================
  // PROPERTY NOT FOUND
  // =====================================================

  if (!property) {

    return (

      <Box
        sx={{
          p: 3,
        }}
      >

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mb: 2,
          }}
        >
          Property Details
        </Typography>


        <Alert
          severity="warning"
          sx={{
            mb: 3,
          }}
        >
          Property not found.
        </Alert>


        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate(
              "/admin/properties"
            )
          }
        >
          Back to Properties
        </Button>

      </Box>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
      }}
    >

      {/* =================================================
          PAGE HEADER
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

        <Box>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Property Details
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            View property information and
            manage property images.
          </Typography>

        </Box>


        <Box
          sx={{
            display: "flex",
            gap: 1.5,
          }}
        >

          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() =>
              navigate(
                "/admin/properties"
              )
            }
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Back
          </Button>


          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() =>
              navigate(
                `/admin/properties/${property.id}/edit`
              )
            }
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Edit Property
          </Button>

        </Box>

      </Box>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {successMessage && (

        <Alert
          severity="success"
          sx={{
            mb: 3,
          }}
        >
          {successMessage}
        </Alert>

      )}


      {/* =================================================
          PROPERTY INFORMATION
      ================================================= */}

      <Card
        sx={{
          borderRadius: 3,
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.08)",
          mb: 4,
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              mb: 1,
            }}
          >
            {property.title ||
              "Untitled Property"}
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            {property.description ||
              "No description available."}
          </Typography>


          <Divider
            sx={{
              mb: 3,
            }}
          />


          <Grid
            container
            spacing={3}
          >

            {/* PROPERTY ID */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Property ID
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {property.id || "-"}
              </Typography>

            </Grid>


            {/* PRICE */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Price
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {formatPrice(
                  property.price
                )}
              </Typography>

            </Grid>


            {/* AREA */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Area
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {property.area
                  ? `${property.area} sq.ft`
                  : "-"}
              </Typography>

            </Grid>


            {/* BEDROOMS */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Bedrooms
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {property.bedrooms ??
                  "-"}
              </Typography>

            </Grid>


            {/* BATHROOMS */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Bathrooms
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {property.bathrooms ??
                  "-"}
              </Typography>

            </Grid>


            {/* STATUS */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Status
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {property.status || "-"}
              </Typography>

            </Grid>


            {/* ADDRESS */}

            <Grid
              size={{
                xs: 12,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Address
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {property.address || "-"}
              </Typography>

            </Grid>


            {/* LATITUDE */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Latitude
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {property.latitude ??
                  "-"}
              </Typography>

            </Grid>


            {/* LONGITUDE */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Longitude
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {property.longitude ??
                  "-"}
              </Typography>

            </Grid>


            {/* ACTIVE */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Active
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {property.active
                  ? "Yes"
                  : "No"}
              </Typography>

            </Grid>


            {/* CREATED */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Created At
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {property.createdAt ||
                  "-"}
              </Typography>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =================================================
          PROPERTY IMAGE MANAGEMENT
      ================================================= */}

      <Card
        sx={{
          borderRadius: 3,
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.08)",
          mb: 4,
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >

          {/* IMAGE HEADER */}

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

            <Box>

              <Typography
                variant="h6"
                fontWeight="bold"
              >
                Property Images
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Upload and manage images
                for this property.
              </Typography>

            </Box>


            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >

              <ImageIcon />

              <Typography
                fontWeight="bold"
              >
                {images.length}{" "}
                {images.length === 1
                  ? "Image"
                  : "Images"}
              </Typography>

            </Box>

          </Box>


          <Divider
            sx={{
              mb: 3,
            }}
          />


          {/* IMAGE ERROR */}

          {imageError && (

            <Alert
              severity="error"
              sx={{
                mb: 3,
              }}
            >
              {imageError}
            </Alert>

          )}


          {/* =================================================
              UPLOAD AREA
          ================================================= */}

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor:
                "#fafbff",
            }}
          >

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                mb: 2,
              }}
            >
              Upload New Image
            </Typography>


            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                alignItems: {
                  xs: "stretch",
                  md: "center",
                },
                gap: 2,
              }}
            >

              {/* FILE INPUT */}

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Choose Image

                <input
                  id="property-image-upload"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                />

              </Button>


              {/* SELECTED FILE */}

              <Box
                sx={{
                  flex: 1,
                }}
              >

                {selectedFile ? (

                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak:
                        "break-word",
                    }}
                  >
                    Selected:{" "}
                    <strong>
                      {selectedFile.name}
                    </strong>
                  </Typography>

                ) : (

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No image selected.
                    Maximum size: 5 MB.
                  </Typography>

                )}

              </Box>


              {/* UPLOAD BUTTON */}

              <Button
                variant="contained"
                startIcon={
                  uploading ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <CloudUpload />
                  )
                }
                onClick={
                  handleUpload
                }
                disabled={
                  uploading ||
                  !selectedFile
                }
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  minWidth: 130,
                }}
              >

                {uploading
                  ? "Uploading..."
                  : "Upload"}

              </Button>

            </Box>

          </Paper>


          {/* =================================================
              IMAGE GALLERY
          ================================================= */}

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              mb: 2,
            }}
          >
            Uploaded Images
          </Typography>


          {imagesLoading ? (

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 5,
              }}
            >

              <CircularProgress />

            </Box>

          ) : images.length === 0 ? (

            <Paper
              variant="outlined"
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 2,
              }}
            >

              <ImageIcon
                sx={{
                  fontSize: 50,
                  color: "text.secondary",
                  mb: 1,
                }}
              />

              <Typography
                color="text.secondary"
              >
                No images uploaded for
                this property yet.
              </Typography>

            </Paper>

          ) : (

            <Grid
              container
              spacing={3}
            >

              {images.map(
                (image, index) => (

                  <Grid
                    key={
                      image.id ||
                      index
                    }
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                    }}
                  >

                    <Card
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        height: "100%",
                        position:
                          "relative",
                      }}
                    >

                      {/* IMAGE */}

                      <Box
                        sx={{
                          width: "100%",
                          height: 220,
                          backgroundColor:
                            "#f2f4f8",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          overflow: "hidden",
                        }}
                      >

                        <Box
                          component="img"
                          src={getImageUrl(
                            image.imageUrl
                          )}
                          alt={
                            image.fileName ||
                            `Property image ${
                              index + 1
                            }`
                          }
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit:
                              "cover",
                          }}
                          onError={(
                            event
                          ) => {

                            event.currentTarget.style.display =
                              "none";

                          }}
                        />

                      </Box>


                      {/* IMAGE INFORMATION */}

                      <CardContent>

                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          noWrap
                          title={
                            image.fileName
                          }
                        >
                          {image.fileName ||
                            `Image ${
                              index + 1
                            }`}
                        </Typography>


                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Display Order:{" "}
                          {image.displayOrder ??
                            index}
                        </Typography>


                        <Box
                          sx={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            mt: 1,
                          }}
                        >

                          <Typography
                            variant="caption"
                            color="success.main"
                          >
                            {image.active
                              ? "Active"
                              : "Inactive"}
                          </Typography>


                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDeleteImage(
                                image.id
                              )
                            }
                            disabled={
                              deletingImageId ===
                              image.id
                            }
                            title="Delete image"
                          >

                            {deletingImageId ===
                            image.id ? (

                              <CircularProgress
                                size={20}
                              />

                            ) : (

                              <Delete />

                            )}

                          </IconButton>

                        </Box>

                      </CardContent>

                    </Card>

                  </Grid>

                )
              )}

            </Grid>

          )}

        </CardContent>

      </Card>


      {/* =================================================
          BOTTOM BUTTON
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 4,
        }}
      >

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate(
              "/admin/properties"
            )
          }
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Back to Properties
        </Button>

      </Box>

    </Box>

  );

}


export default AdminPropertyDetails;