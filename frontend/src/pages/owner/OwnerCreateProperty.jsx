import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddHomeIcon from "@mui/icons-material/AddHome";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";

import {
  createProperty,
  getPropertyTypes,
  getStates,
  getCitiesByState,
  uploadPropertyImage,
} from "../../api";


// =====================================================
// OWNER CREATE PROPERTY
// =====================================================

function OwnerCreateProperty() {

  const navigate = useNavigate();


  // =====================================================
  // PAGE STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [uploadingImages, setUploadingImages] = useState(false);

  const [uploadProgress, setUploadProgress] = useState("");


  // =====================================================
  // DROPDOWN DATA
  // =====================================================

  const [propertyTypes, setPropertyTypes] = useState([]);

  const [states, setStates] = useState([]);

  const [cities, setCities] = useState([]);


  // =====================================================
  // SELECTED IMAGES
  // =====================================================

  const [selectedImages, setSelectedImages] = useState([]);


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({

    title: "",

    price: "",

    area: "",

    bedrooms: "",

    bathrooms: "",

    address: "",

    description: "",

    latitude: "",

    longitude: "",

    propertyTypeId: "",

    stateId: "",

    cityId: "",

  });


  // =====================================================
  // LOAD PROPERTY TYPES + STATES
  // =====================================================

  useEffect(() => {

    loadDropdownData();

  }, []);


  // =====================================================
  // LOAD DROPDOWN DATA
  // =====================================================

  const loadDropdownData = async () => {

    try {

      setLoading(true);

      setError("");


      const [
        propertyTypeResponse,
        stateResponse,
      ] = await Promise.all([

        getPropertyTypes(),

        getStates(),

      ]);


      console.log(
        "PROPERTY TYPES RESPONSE:",
        propertyTypeResponse
      );

      console.log(
        "STATES RESPONSE:",
        stateResponse
      );


      // =================================================
      // PROPERTY TYPES
      // =================================================

      let propertyTypeData = [];


      if (
        Array.isArray(
          propertyTypeResponse?.data
        )
      ) {

        propertyTypeData =
          propertyTypeResponse.data;

      } else if (
        Array.isArray(propertyTypeResponse)
      ) {

        propertyTypeData =
          propertyTypeResponse;

      }


      // =================================================
      // STATES
      // =================================================

      let stateData = [];


      if (
        Array.isArray(
          stateResponse?.data
        )
      ) {

        stateData =
          stateResponse.data;

      } else if (
        Array.isArray(stateResponse)
      ) {

        stateData =
          stateResponse;

      }


      setPropertyTypes(
        propertyTypeData
      );

      setStates(
        stateData
      );


    } catch (err) {

      console.error(
        "LOAD DROPDOWN DATA ERROR:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to load property types and states."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // GENERIC INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));


    if (error) {

      setError("");

    }

  };


  // =====================================================
  // STATE CHANGE
  // =====================================================

  const handleStateChange = async (event) => {

    const selectedStateId =
      event.target.value;


    setFormData((previous) => ({

      ...previous,

      stateId:
        selectedStateId,

      cityId: "",

    }));


    setCities([]);

    setError("");


    if (!selectedStateId) {

      return;

    }


    try {

      const response =
        await getCitiesByState(
          selectedStateId
        );


      console.log(
        "CITIES RESPONSE:",
        response
      );


      let cityData = [];


      if (
        Array.isArray(
          response?.data
        )
      ) {

        cityData =
          response.data;

      } else if (
        Array.isArray(response)
      ) {

        cityData =
          response;

      }


      setCities(
        cityData
      );


    } catch (err) {

      console.error(
        "LOAD CITIES ERROR:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to load cities."
      );

    }

  };


  // =====================================================
  // GET LOGGED-IN OWNER ID
  // =====================================================

  const getOwnerId = () => {

    const storedUser =
      localStorage.getItem("user");


    if (!storedUser) {

      return null;

    }


    try {

      const user =
        JSON.parse(storedUser);


      console.log(
        "LOGGED-IN OWNER:",
        user
      );


      return (
        user?.userId ||
        user?.id ||
        user?._id ||
        null
      );


    } catch (err) {

      console.error(
        "INVALID USER DATA:",
        err
      );

      return null;

    }

  };


  // =====================================================
  // IMAGE SELECTION
  // =====================================================

  const handleImageSelect = (event) => {

    const files =
      Array.from(
        event.target.files || []
      );


    if (files.length === 0) {

      return;

    }


    setError("");


    // =================================================
    // VALIDATE FILES
    // =================================================

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];


    const invalidFile =
      files.find(
        (file) =>
          !allowedTypes.includes(
            file.type
          )
      );


    if (invalidFile) {

      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      event.target.value = "";

      return;

    }


    // =================================================
    // FILE SIZE VALIDATION
    // Maximum 5 MB per image
    // =================================================

    const oversizedFile =
      files.find(
        (file) =>
          file.size >
          5 * 1024 * 1024
      );


    if (oversizedFile) {

      setError(
        `Image "${oversizedFile.name}" is larger than 5 MB.`
      );

      event.target.value = "";

      return;

    }


    // =================================================
    // MAXIMUM IMAGE COUNT
    // =================================================

    const totalImages =
      selectedImages.length +
      files.length;


    if (totalImages > 10) {

      setError(
        "You can upload a maximum of 10 images per property."
      );

      event.target.value = "";

      return;

    }


    // =================================================
    // CREATE IMAGE OBJECTS
    // =================================================

    const newImages =
      files.map(
        (file) => ({

          file: file,

          preview:
            URL.createObjectURL(file),

        })
      );


    setSelectedImages(
      (previous) => [
        ...previous,
        ...newImages,
      ]
    );


    // Reset input so same file can
    // be selected again later
    event.target.value = "";

  };


  // =====================================================
  // REMOVE SELECTED IMAGE
  // =====================================================

  const handleRemoveImage = (index) => {

    setSelectedImages(
      (previous) => {

        const image =
          previous[index];


        if (image?.preview) {

          URL.revokeObjectURL(
            image.preview
          );

        }


        return previous.filter(
          (_, imageIndex) =>
            imageIndex !== index
        );

      }
    );

  };


  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {

    if (
      !formData.title.trim()
    ) {

      return "Property title is required.";

    }


    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {

      return "Please enter a valid property price.";

    }


    if (
      !formData.area ||
      Number(formData.area) <= 0
    ) {

      return "Please enter a valid property area.";

    }


    if (
      !formData.propertyTypeId
    ) {

      return "Please select a property type.";

    }


    if (
      !formData.stateId
    ) {

      return "Please select a state.";

    }


    if (
      !formData.cityId
    ) {

      return "Please select a city.";

    }


    if (
      !formData.address.trim()
    ) {

      return "Address is required.";

    }


    return null;

  };


  // =====================================================
  // UPLOAD PROPERTY IMAGES
  // =====================================================

  const uploadImages = async (propertyId) => {

    if (
      !selectedImages.length
    ) {

      console.log(
        "No images selected."
      );

      return;

    }


    setUploadingImages(true);


    try {

      for (
        let index = 0;
        index < selectedImages.length;
        index++
      ) {

        const image =
          selectedImages[index];


        setUploadProgress(
          `Uploading image ${index + 1} of ${selectedImages.length}...`
        );


        console.log(
          `Uploading image ${index + 1}:`,
          image.file.name
        );


        await uploadPropertyImage(

          propertyId,

          image.file,

          index

        );

      }


      setUploadProgress(
        "All property images uploaded successfully."
      );


    } catch (err) {

      console.error(
        "IMAGE UPLOAD ERROR:",
        err
      );


      console.error(
        "IMAGE UPLOAD SERVER RESPONSE:",
        err?.response?.data
      );


      throw new Error(
        err?.response?.data?.message ||
        "Property was created, but image upload failed."
      );


    } finally {

      setUploadingImages(false);

    }

  };


  // =====================================================
  // CREATE PROPERTY
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    try {

      setSaving(true);

      setError("");

      setSuccess("");

      setUploadProgress("");


      // =================================================
      // OWNER
      // =================================================

      const ownerId =
        getOwnerId();


      if (!ownerId) {

        setError(
          "Owner information not found. Please login again."
        );

        return;

      }


      // =================================================
      // VALIDATION
      // =================================================

      const validationError =
        validateForm();


      if (validationError) {

        setError(
          validationError
        );

        return;

      }


      // =================================================
      // PROPERTY REQUEST
      // =================================================

      const propertyData = {

        title:
          formData.title.trim(),

        price:
          Number(formData.price),

        area:
          Number(formData.area),

        bedrooms:
          formData.bedrooms === ""
            ? null
            : Number(formData.bedrooms),

        bathrooms:
          formData.bathrooms === ""
            ? null
            : Number(formData.bathrooms),

        address:
          formData.address.trim(),

        description:
          formData.description.trim(),

        ownerId:
          String(ownerId),

        propertyTypeId:
          String(formData.propertyTypeId),

        stateId:
          String(formData.stateId),

        cityId:
          String(formData.cityId),

        latitude:
          formData.latitude === ""
            ? null
            : Number(formData.latitude),

        longitude:
          formData.longitude === ""
            ? null
            : Number(formData.longitude),

      };


      console.log(
        "================================="
      );

      console.log(
        "CREATE OWNER PROPERTY"
      );

      console.log(
        propertyData
      );

      console.log(
        "================================="
      );


      // =================================================
      // CREATE PROPERTY FIRST
      // =================================================

      const response =
        await createProperty(
          propertyData
        );


      console.log(
        "CREATE PROPERTY RESPONSE:",
        response
      );


      // =================================================
      // GET CREATED PROPERTY ID
      // =================================================

      const createdProperty =
        response?.data?.data ||
        response?.data ||
        response;


      const propertyId =
        createdProperty?.id ||
        createdProperty?._id;


      console.log(
        "CREATED PROPERTY:",
        createdProperty
      );

      console.log(
        "CREATED PROPERTY ID:",
        propertyId
      );


      if (!propertyId) {

        throw new Error(
          "Property was created, but property ID was not returned by the server."
        );

      }


      // =================================================
      // UPLOAD IMAGES
      // =================================================

      if (
        selectedImages.length > 0
      ) {

        await uploadImages(
          propertyId
        );

      }


      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        selectedImages.length > 0
          ? "Property and images created successfully."
          : "Property created successfully."
      );


      // =================================================
      // CLEAN IMAGE PREVIEWS
      // =================================================

      selectedImages.forEach(
        (image) => {

          if (image?.preview) {

            URL.revokeObjectURL(
              image.preview
            );

          }

        }
      );


      setSelectedImages([]);


      // =================================================
      // NAVIGATE
      // =================================================

      setTimeout(() => {

        navigate(
          "/owner/properties"
        );

      }, 1200);


    } catch (err) {

      console.error(
        "CREATE PROPERTY ERROR:",
        err
      );


      console.error(
        "SERVER RESPONSE:",
        err?.response?.data
      );


      const backendData =
        err?.response?.data;


      let errorMessage =
        err?.message ||
        "Failed to create property.";


      if (
        backendData?.message
      ) {

        errorMessage =
          backendData.message;

      } else if (
        backendData?.error
      ) {

        errorMessage =
          backendData.error;

      }


      setError(
        errorMessage
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // CLEANUP IMAGE PREVIEWS
  // =====================================================

  useEffect(() => {

    return () => {

      selectedImages.forEach(
        (image) => {

          if (image?.preview) {

            URL.revokeObjectURL(
              image.preview
            );

          }

        }
      );

    };

  }, [selectedImages]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "60vh",
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
          Loading property form...
        </Typography>

      </Box>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <Box
      sx={{
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >

      {/* =================================================
          BACK
      ================================================= */}

      <Button
        startIcon={
          <ArrowBackIcon />
        }
        onClick={() =>
          navigate(
            "/owner/properties"
          )
        }
        sx={{
          mb: 2,
        }}
      >
        Back to My Properties
      </Button>


      {/* =================================================
          HEADER
      ================================================= */}

      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 1,
        }}
      >
        Add Property
      </Typography>


      <Typography
        color="text.secondary"
        sx={{
          mb: 3,
        }}
      >
        Add a new property to your real estate portfolio.
      </Typography>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>

      )}


      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (

        <Alert
          severity="success"
          sx={{
            mb: 2,
          }}
        >
          {success}
        </Alert>

      )}


      {/* =================================================
          UPLOAD PROGRESS
      ================================================= */}

      {uploadProgress && (

        <Alert
          severity="info"
          sx={{
            mb: 2,
          }}
        >
          {uploadProgress}
        </Alert>

      )}


      {/* =================================================
          FORM CARD
      ================================================= */}

      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
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

          <Box
            component="form"
            onSubmit={handleSubmit}
          >

            <Grid
              container
              spacing={3}
            >

              {/* =================================================
                  TITLE
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  required
                  label="Property Title"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Modern 5BHK Luxury House"
                />

              </Grid>


              {/* =================================================
                  PRICE
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  required
                  label="Price"
                  name="price"
                  type="number"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    min: 1,
                  }}
                  placeholder="10000000"
                />

              </Grid>


              {/* =================================================
                  PROPERTY TYPE
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >

                <FormControl
                  fullWidth
                  required
                >

                  <InputLabel>
                    Property Type
                  </InputLabel>

                  <Select
                    name="propertyTypeId"
                    value={
                      formData.propertyTypeId
                    }
                    label="Property Type"
                    onChange={
                      handleChange
                    }
                  >

                    <MenuItem value="">
                      Select Property Type
                    </MenuItem>


                    {propertyTypes.map(
                      (type) => {

                        const typeId =
                          type?.id ||
                          type?._id;


                        const typeName =
                          type?.name ||
                          type?.propertyTypeName ||
                          type?.typeName ||
                          type?.title ||
                          "Property";


                        return (

                          <MenuItem
                            key={typeId}
                            value={typeId}
                          >
                            {typeName}
                          </MenuItem>

                        );

                      }
                    )}

                  </Select>

                </FormControl>

              </Grid>


              {/* =================================================
                  STATE
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >

                <FormControl
                  fullWidth
                  required
                >

                  <InputLabel>
                    State
                  </InputLabel>

                  <Select
                    name="stateId"
                    value={
                      formData.stateId
                    }
                    label="State"
                    onChange={
                      handleStateChange
                    }
                  >

                    <MenuItem value="">
                      Select State
                    </MenuItem>


                    {states.map(
                      (state) => {

                        const stateId =
                          state?.id ||
                          state?._id;


                        const stateName =
                          state?.name ||
                          state?.stateName ||
                          state?.title ||
                          "State";


                        return (

                          <MenuItem
                            key={stateId}
                            value={stateId}
                          >
                            {stateName}
                          </MenuItem>

                        );

                      }
                    )}

                  </Select>

                </FormControl>

              </Grid>


              {/* =================================================
                  CITY
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >

                <FormControl
                  fullWidth
                  required
                  disabled={
                    !formData.stateId
                  }
                >

                  <InputLabel>
                    City
                  </InputLabel>

                  <Select
                    name="cityId"
                    value={
                      formData.cityId
                    }
                    label="City"
                    onChange={
                      handleChange
                    }
                  >

                    <MenuItem value="">
                      Select City
                    </MenuItem>


                    {cities.map(
                      (city) => {

                        const cityId =
                          city?.id ||
                          city?._id;


                        const cityName =
                          city?.name ||
                          city?.cityName ||
                          city?.title ||
                          "City";


                        return (

                          <MenuItem
                            key={cityId}
                            value={cityId}
                          >
                            {cityName}
                          </MenuItem>

                        );

                      }
                    )}

                  </Select>

                </FormControl>

              </Grid>


              {/* =================================================
                  AREA
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >

                <TextField
                  fullWidth
                  required
                  label="Area (sq.ft)"
                  name="area"
                  type="number"
                  value={
                    formData.area
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    min: 1,
                  }}
                  placeholder="2400"
                />

              </Grid>


              {/* =================================================
                  BEDROOMS
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >

                <TextField
                  fullWidth
                  label="Bedrooms"
                  name="bedrooms"
                  type="number"
                  value={
                    formData.bedrooms
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    min: 0,
                  }}
                  placeholder="5"
                />

              </Grid>


              {/* =================================================
                  BATHROOMS
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >

                <TextField
                  fullWidth
                  label="Bathrooms"
                  name="bathrooms"
                  type="number"
                  value={
                    formData.bathrooms
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    min: 0,
                  }}
                  placeholder="4"
                />

              </Grid>


              {/* =================================================
                  ADDRESS
              ================================================= */}

              <Grid
                size={12}
              >

                <TextField
                  fullWidth
                  required
                  label="Address"
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Madhapur, Hyderabad"
                />

              </Grid>


              {/* =================================================
                  LATITUDE
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Latitude"
                  name="latitude"
                  type="number"
                  value={
                    formData.latitude
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    step: "any",
                  }}
                  placeholder="17.4483"
                />

              </Grid>


              {/* =================================================
                  LONGITUDE
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Longitude"
                  name="longitude"
                  type="number"
                  value={
                    formData.longitude
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    step: "any",
                  }}
                  placeholder="78.3915"
                />

              </Grid>


              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <Grid
                size={12}
              >

                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe the property..."
                />

              </Grid>


              {/* =================================================
                  PROPERTY IMAGES
              ================================================= */}

              <Grid
                size={12}
              >

                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    p: 2,
                    backgroundColor:
                      "background.default",
                  }}
                >

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                      xs: "flex-start",
                      sm: "center",
                    }}
                    spacing={2}
                    sx={{
                      mb: 2,
                    }}
                  >

                    <Box>

                      <Typography
                        variant="h6"
                        fontWeight={600}
                      >
                        Property Images
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Upload up to 10 images. JPG, PNG,
                        JPEG or WEBP. Maximum 5 MB per image.
                      </Typography>

                    </Box>


                    <Button
                      component="label"
                      variant="contained"
                      startIcon={
                        <CloudUploadIcon />
                      }
                      disabled={saving}
                    >

                      Select Images

                      <input
                        hidden
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={
                          handleImageSelect
                        }
                      />

                    </Button>

                  </Stack>


                  {/* =================================================
                      NO IMAGES
                  ================================================= */}

                  {selectedImages.length === 0 && (

                    <Box
                      sx={{
                        border: "2px dashed",
                        borderColor:
                          "divider",
                        borderRadius: 2,
                        py: 5,
                        textAlign: "center",
                      }}
                    >

                      <ImageIcon
                        sx={{
                          fontSize: 55,
                          color:
                            "text.secondary",
                          mb: 1,
                        }}
                      />

                      <Typography
                        color="text.secondary"
                      >
                        No images selected
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Click "Select Images" to
                        add property photos.
                      </Typography>

                    </Box>

                  )}


                  {/* =================================================
                      IMAGE PREVIEWS
                  ================================================= */}

                  {selectedImages.length > 0 && (

                    <Grid
                      container
                      spacing={2}
                    >

                      {selectedImages.map(
                        (image, index) => (

                          <Grid
                            key={`${image.file.name}-${index}`}
                            size={{
                              xs: 12,
                              sm: 6,
                              md: 4,
                              lg: 3,
                            }}
                          >

                            <Box
                              sx={{
                                position:
                                  "relative",
                                borderRadius: 2,
                                overflow:
                                  "hidden",
                                border:
                                  "1px solid",
                                borderColor:
                                  "divider",
                                backgroundColor:
                                  "background.paper",
                              }}
                            >

                              <Box
                                component="img"
                                src={
                                  image.preview
                                }
                                alt={
                                  `Property image ${index + 1}`
                                }
                                sx={{
                                  width: "100%",
                                  height: 180,
                                  objectFit:
                                    "cover",
                                  display:
                                    "block",
                                }}
                              />


                              {/* IMAGE NUMBER */}

                              <Box
                                sx={{
                                  position:
                                    "absolute",
                                  top: 8,
                                  left: 8,
                                  backgroundColor:
                                    "rgba(0,0,0,0.65)",
                                  color:
                                    "white",
                                  px: 1,
                                  py: 0.3,
                                  borderRadius: 1,
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                              >
                                Image {index + 1}
                              </Box>


                              {/* DELETE */}

                              <IconButton
                                onClick={() =>
                                  handleRemoveImage(
                                    index
                                  )
                                }
                                disabled={
                                  saving
                                }
                                sx={{
                                  position:
                                    "absolute",
                                  top: 5,
                                  right: 5,
                                  backgroundColor:
                                    "rgba(255,255,255,0.9)",
                                  "&:hover": {
                                    backgroundColor:
                                      "white",
                                  },
                                }}
                                color="error"
                              >

                                <DeleteIcon />

                              </IconButton>


                              {/* FILE NAME */}

                              <Typography
                                variant="body2"
                                sx={{
                                  px: 1,
                                  py: 1,
                                  overflow:
                                    "hidden",
                                  textOverflow:
                                    "ellipsis",
                                  whiteSpace:
                                    "nowrap",
                                }}
                                title={
                                  image.file.name
                                }
                              >
                                {image.file.name}
                              </Typography>

                            </Box>

                          </Grid>

                        )
                      )}

                    </Grid>

                  )}

                </Card>

              </Grid>


              {/* =================================================
                  BUTTONS
              ================================================= */}

              <Grid
                size={12}
              >

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                >

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      saving
                        ? <CircularProgress
                            size={20}
                            color="inherit"
                          />
                        : <AddHomeIcon />
                    }
                    disabled={
                      saving
                    }
                    size="large"
                  >

                    {uploadingImages
                      ? "Uploading Images..."
                      : saving
                        ? "Creating..."
                        : "Create Property"
                    }

                  </Button>


                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() =>
                      navigate(
                        "/owner/properties"
                      )
                    }
                    disabled={
                      saving
                    }
                  >
                    Cancel
                  </Button>

                </Stack>

              </Grid>

            </Grid>

          </Box>

        </CardContent>

      </Card>

    </Box>

  );

}


export default OwnerCreateProperty;