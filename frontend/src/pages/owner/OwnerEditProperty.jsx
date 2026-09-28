import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import {
  getPropertyById,
  updateProperty,
  getPropertyTypes,
  getStates,
  getCitiesByState,
} from "../../api";

function OwnerEditProperty() {

  const { id } = useParams();

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  const [propertyTypes, setPropertyTypes] = useState([]);

  const [states, setStates] = useState([]);

  const [cities, setCities] = useState([]);


  const [formData, setFormData] = useState({

    title: "",

    price: "",

    area: "",

    bedrooms: "",

    bathrooms: "",

    address: "",

    description: "",

    ownerId: "",

    propertyTypeId: "",

    stateId: "",

    cityId: "",

    latitude: "",

    longitude: "",

    status: "",

  });


  // =====================================================
  // LOAD PROPERTY + DROPDOWNS
  // =====================================================

  useEffect(() => {

    loadProperty();

  }, [id]);


  const loadProperty = async () => {

    try {

      setLoading(true);

      setError("");


      // -------------------------------------------------
      // LOAD PROPERTY
      // -------------------------------------------------

      const propertyResponse =
        await getPropertyById(id);


      const property =
        propertyResponse?.data ||
        propertyResponse;


      console.log(
        "OWNER EDIT PROPERTY:",
        property
      );


      // -------------------------------------------------
      // LOAD PROPERTY TYPES
      // -------------------------------------------------

      const propertyTypesResponse =
        await getPropertyTypes();


      const propertyTypesData =
        propertyTypesResponse?.data ||
        propertyTypesResponse ||
        [];


      setPropertyTypes(
        Array.isArray(propertyTypesData)
          ? propertyTypesData
          : []
      );


      // -------------------------------------------------
      // LOAD STATES
      // -------------------------------------------------

      const statesResponse =
        await getStates();


      const statesData =
        statesResponse?.data ||
        statesResponse ||
        [];


      setStates(
        Array.isArray(statesData)
          ? statesData
          : []
      );


      // -------------------------------------------------
      // GET IDS
      // -------------------------------------------------

      const ownerId =
        property?.ownerId ||
        property?.owner?.id ||
        "";

      const propertyTypeId =
        property?.propertyTypeId ||
        property?.propertyType?.id ||
        "";

      const stateId =
        property?.stateId ||
        property?.state?.id ||
        "";

      const cityId =
        property?.cityId ||
        property?.city?.id ||
        "";


      // -------------------------------------------------
      // LOAD CITIES
      // -------------------------------------------------

      if (stateId) {

        try {

          const citiesResponse =
            await getCitiesByState(stateId);


          const citiesData =
            citiesResponse?.data ||
            citiesResponse ||
            [];


          setCities(
            Array.isArray(citiesData)
              ? citiesData
              : []
          );

        } catch (cityError) {

          console.error(
            "Failed to load cities:",
            cityError
          );

          setCities([]);

        }
      }


      // -------------------------------------------------
      // SET FORM DATA
      // -------------------------------------------------

      setFormData({

        title:
          property?.title ||
          property?.propertyTitle ||
          "",

        price:
          property?.price ??
          "",

        area:
          property?.area ??
          "",

        bedrooms:
          property?.bedrooms ??
          "",

        bathrooms:
          property?.bathrooms ??
          "",

        address:
          property?.address ||
          "",

        description:
          property?.description ||
          "",

        ownerId,

        propertyTypeId,

        stateId,

        cityId,

        latitude:
          property?.latitude ??
          "",

        longitude:
          property?.longitude ??
          "",

        status:
          property?.status ||
          "",

      });

    } catch (err) {

      console.error(
        "Failed to load property:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to load property."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );

  };


  // =====================================================
  // STATE CHANGE
  // =====================================================

  const handleStateChange = async (event) => {

    const stateId =
      event.target.value;


    setFormData(
      (previous) => ({

        ...previous,

        stateId,

        cityId: "",

      })
    );


    setCities([]);


    if (!stateId) {

      return;

    }


    try {

      const response =
        await getCitiesByState(stateId);


      const data =
        response?.data ||
        response ||
        [];


      setCities(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load cities:",
        err
      );


      setError(
        "Failed to load cities."
      );

    }

  };


  // =====================================================
  // UPDATE PROPERTY
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      // -------------------------------------------------
      // VALIDATE REQUIRED IDS
      // -------------------------------------------------

      if (!formData.ownerId) {

        setError(
          "Owner information is missing."
        );

        setSaving(false);

        return;

      }


      if (!formData.propertyTypeId) {

        setError(
          "Property type is required."
        );

        setSaving(false);

        return;

      }


      if (!formData.stateId) {

        setError(
          "State is required."
        );

        setSaving(false);

        return;

      }


      if (!formData.cityId) {

        setError(
          "City is required."
        );

        setSaving(false);

        return;

      }


      // -------------------------------------------------
      // BUILD REQUEST
      // -------------------------------------------------

      const propertyData = {

        title:
          formData.title,

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
          formData.address,

        description:
          formData.description,

        ownerId:
          formData.ownerId,

        propertyTypeId:
          formData.propertyTypeId,

        stateId:
          formData.stateId,

        cityId:
          formData.cityId,

        latitude:
          formData.latitude === ""
            ? null
            : Number(formData.latitude),

        longitude:
          formData.longitude === ""
            ? null
            : Number(formData.longitude),

        status:
          formData.status,

      };


      console.log(
        "UPDATE OWNER PROPERTY REQUEST:",
        propertyData
      );


      // -------------------------------------------------
      // API CALL
      // -------------------------------------------------

      await updateProperty(
        id,
        propertyData
      );


      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setSuccess(
        "Property updated successfully."
      );


      // -------------------------------------------------
      // NAVIGATE AFTER UPDATE
      // -------------------------------------------------

      setTimeout(() => {

        navigate(
          `/owner/properties/${id}`
        );

      }, 1000);

    } catch (err) {

      console.error(
        "Update property failed:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to update property."
      );

    } finally {

      setSaving(false);

    }

  };


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
        }}
      >

        <CircularProgress />

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
          BACK BUTTON
      ================================================= */}

      <Button
        startIcon={
          <ArrowBackIcon />
        }
        onClick={() =>
          navigate(
            `/owner/properties/${id}`
          )
        }
        sx={{
          mb: 2,
        }}
      >
        Back to Property
      </Button>


      {/* =================================================
          TITLE
      ================================================= */}

      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 1,
        }}
      >
        Edit Property
      </Typography>


      <Typography
        color="text.secondary"
        sx={{
          mb: 3,
        }}
      >
        Update your property information.
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
          FORM CARD
      ================================================= */}

      <Card>

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
                />

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
                />

              </Grid>


              {/* =================================================
                  PROPERTY TYPE
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
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

                    {propertyTypes.map(
                      (type) => (

                        <MenuItem
                          key={type.id}
                          value={type.id}
                        >

                          {type.name ||
                            type.typeName ||
                            type.propertyTypeName}

                        </MenuItem>

                      )
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
                  md: 6,
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

                    {states.map(
                      (state) => (

                        <MenuItem
                          key={state.id}
                          value={state.id}
                        >

                          {state.name ||
                            state.stateName}

                        </MenuItem>

                      )
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
                  md: 6,
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

                    {cities.map(
                      (city) => (

                        <MenuItem
                          key={city.id}
                          value={city.id}
                        >

                          {city.name ||
                            city.cityName}

                        </MenuItem>

                      )
                    )}

                  </Select>

                </FormControl>

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
                  type="number"
                  label="Latitude"
                  name="latitude"
                  value={
                    formData.latitude
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    step: "any",
                  }}
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
                  type="number"
                  label="Longitude"
                  name="longitude"
                  value={
                    formData.longitude
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    step: "any",
                  }}
                />

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
                      <SaveIcon />
                    }
                    disabled={saving}
                  >

                    {saving
                      ? "Saving..."
                      : "Save Changes"}

                  </Button>


                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        `/owner/properties/${id}`
                      )
                    }
                    disabled={saving}
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

export default OwnerEditProperty;