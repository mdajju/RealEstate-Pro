
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createProperty,
  getPropertyTypes,
  getStates,
  getCitiesByState,
  getUsers,
} from "../../api";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  AddHomeWork,
  Apartment,
  Badge,
  CheckCircle,
  Close,
  HomeWork,
  LocationOn,
  Person,
  Save,
  Sell,
  Straighten,
} from "@mui/icons-material";

function CreateProperty() {
  const navigate = useNavigate();

  // =========================================
  // Dropdown Data
  // =========================================

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [owners, setOwners] = useState([]);
  const [agents, setAgents] = useState([]);

  // =========================================
  // Messages
  // =========================================

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================
  // Form State
  // =========================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyTypeId: "",
    ownerId: "",
    agentId: "",
    stateId: "",
    cityId: "",
    address: "",
    latitude: "",
    longitude: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    facing: "",
    status: "AVAILABLE",
    images: [],
    amenities: [],
  });

  // =========================================
  // Load Initial Data
  // =========================================

  useEffect(() => {
    loadInitialData();
  }, []);

  // =========================================
  // Load Cities When State Changes
  // =========================================

  useEffect(() => {
    if (formData.stateId) {
      loadCities(formData.stateId);
    } else {
      setCities([]);
    }
  }, [formData.stateId]);

  // =========================================
  // Load Dropdown Data
  // =========================================

  const loadInitialData = async () => {
    try {
      const [
        propertyTypeRes,
        stateRes,
        usersRes,
      ] = await Promise.all([
        getPropertyTypes(),
        getStates(),
        getUsers(),
      ]);

      if (propertyTypeRes?.success) {
        setPropertyTypes(propertyTypeRes.data || []);
      }

      if (stateRes?.success) {
        setStates(stateRes.data || []);
      }

      if (usersRes?.success) {
        const users = usersRes.data || [];

        setOwners(
          users.filter(
            (user) =>
              user.roleName === "OWNER" ||
              user.role?.roleName === "OWNER"
          )
        );

        setAgents(
          users.filter(
            (user) =>
              user.roleName === "AGENT" ||
              user.role?.roleName === "AGENT"
          )
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load dropdown data.");
    }
  };

  // =========================================
  // Load Cities
  // =========================================

  const loadCities = async (stateId) => {
    try {
      const response = await getCitiesByState(stateId);

      if (response?.success) {
        setCities(response.data || []);
      } else {
        setCities([]);
      }
    } catch (err) {
      console.error(err);
      setCities([]);
    }
  };

  // =========================================
  // Handle Input Change
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // Handle Submit
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...formData,

        latitude: formData.latitude
          ? parseFloat(formData.latitude)
          : null,

        longitude: formData.longitude
          ? parseFloat(formData.longitude)
          : null,

        price: Number(formData.price),

        area: Number(formData.area),

        bedrooms: formData.bedrooms
          ? Number(formData.bedrooms)
          : 0,

        bathrooms: formData.bathrooms
          ? Number(formData.bathrooms)
          : 0,
      };

      const result = await createProperty(payload);

      if (result.success) {
        setMessage(result.message || "Property created successfully.");

        setTimeout(() => {
          navigate("/admin/properties");
        }, 1500);
      } else {
        setError(result.message || "Unable to create property.");
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create property."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // Shared UI Styles
  // =========================================

  const sectionCardSx = {
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
    border: "1px solid #e5eaf2",
    boxShadow: "0 5px 22px rgba(30, 55, 90, 0.045)",
    backgroundColor: "#ffffff",
    height: "100%",
  };

  const sectionTitleSx = {
    fontSize: "1.05rem",
    fontWeight: 800,
    color: "#172b4d",
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#ffffff",
    },
    "& .MuiInputLabel-root": {
      fontWeight: 500,
    },
  };

  const SectionHeader = ({ icon, title, subtitle }) => (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{ mb: 2.5 }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2457d6",
          backgroundColor: "#edf3ff",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography sx={sectionTitleSx}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#7b879b", mt: 0.3 }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Box
      sx={{
        minHeight: "100%",
        backgroundColor: "#f5f7fb",
        p: { xs: 1.5, sm: 2.5, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1250, mx: "auto" }}>

        {/* =========================================
            Page Header
        ========================================= */}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg, #2457d6 0%, #6288f5 100%)",
                  boxShadow: "0 5px 12px rgba(36, 87, 214, 0.22)",
                }}
              >
                <AddHomeWork />
              </Box>

              <Chip
                label="PROPERTY MANAGEMENT"
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: "0.68rem",
                  letterSpacing: 0.7,
                  color: "#2457d6",
                  backgroundColor: "#eaf0ff",
                }}
              />
            </Stack>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                letterSpacing: -0.8,
                color: "#14213d",
                fontSize: { xs: "1.75rem", sm: "2.15rem" },
              }}
            >
              Create Property
            </Typography>

            <Typography
              variant="body2"
              sx={{ mt: 0.8, color: "#748198", maxWidth: 650 }}
            >
              Add a new property to your real estate portfolio.
              Enter the property details, assign its owner, and configure
              its location and pricing.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/admin/properties")}
            sx={{
              alignSelf: { xs: "flex-start", sm: "center" },
              borderRadius: 2,
              px: 2.2,
              py: 1.1,
              textTransform: "none",
              fontWeight: 700,
              borderColor: "#d8e0ed",
              color: "#344563",
              backgroundColor: "#ffffff",
              "&:hover": {
                borderColor: "#2457d6",
                backgroundColor: "#f0f4ff",
              },
            }}
          >
            Back to Properties
          </Button>
        </Stack>

        {/* =========================================
            Status Messages
        ========================================= */}

        {message && (
          <Alert
            severity="success"
            icon={<CheckCircle />}
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
              alignItems: "center",
            }}
          >
            {message}
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
              alignItems: "center",
            }}
          >
            {error}
          </Alert>
        )}

        {/* =========================================
            Form
        ========================================= */}

        <Box component="form" onSubmit={handleSubmit}>

          {/* Basic Information */}

          <Paper sx={{ ...sectionCardSx, mb: 2.5 }}>
            <SectionHeader
              icon={<HomeWork />}
              title="Basic Information"
              subtitle="Provide the primary details of the property."
            />

            <Divider sx={{ mb: 3, borderColor: "#edf0f5" }} />

            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Property Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Premium 3 BHK Apartment"
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Property Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the property, its features, and highlights..."
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Property Type"
                  name="propertyTypeId"
                  value={formData.propertyTypeId}
                  onChange={handleChange}
                  required
                  sx={fieldSx}
                >
                  <MenuItem value="">
                    Select Property Type
                  </MenuItem>

                  {propertyTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.typeName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Property Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  sx={fieldSx}
                >
                  <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
                  <MenuItem value="PENDING_APPROVAL">
                    PENDING APPROVAL
                  </MenuItem>
                  <MenuItem value="SOLD">SOLD</MenuItem>
                  <MenuItem value="RENTED">RENTED</MenuItem>
                  <MenuItem value="REJECTED">REJECTED</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          {/* Ownership & Assignment */}

          <Paper sx={{ ...sectionCardSx, mb: 2.5 }}>
            <SectionHeader
              icon={<Person />}
              title="Ownership & Assignment"
              subtitle="Select the owner and the agent responsible for this property."
            />

            <Divider sx={{ mb: 3, borderColor: "#edf0f5" }} />

            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Property Owner"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleChange}
                  required
                  sx={fieldSx}
                >
                  <MenuItem value="">
                    Select Owner
                  </MenuItem>

                  {owners.map((owner) => (
                    <MenuItem key={owner.id} value={owner.id}>
                      {owner.firstName} {owner.lastName}
                    </MenuItem>
                  ))}
                </TextField>

                <Typography
                  variant="caption"
                  sx={{ color: "#8490a5", display: "block", mt: 1 }}
                >
                  Select the registered owner of this property.
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Assigned Agent (Optional)"
                  name="agentId"
                  value={formData.agentId}
                  onChange={handleChange}
                  sx={fieldSx}
                >
                  <MenuItem value="">
                    Select Agent
                  </MenuItem>

                  {agents.map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.firstName} {agent.lastName}
                    </MenuItem>
                  ))}
                </TextField>

                <Typography
                  variant="caption"
                  sx={{ color: "#8490a5", display: "block", mt: 1 }}
                >
                  You can leave this field empty if no agent is assigned.
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Property Location */}

          <Paper sx={{ ...sectionCardSx, mb: 2.5 }}>
            <SectionHeader
              icon={<LocationOn />}
              title="Property Location"
              subtitle="Set the address and geographical coordinates."
            />

            <Divider sx={{ mb: 3, borderColor: "#edf0f5" }} />

            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="State"
                  name="stateId"
                  value={formData.stateId}
                  onChange={handleChange}
                  required
                  sx={fieldSx}
                >
                  <MenuItem value="">
                    Select State
                  </MenuItem>

                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.stateName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="City"
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  required
                  disabled={!formData.stateId}
                  sx={fieldSx}
                >
                  <MenuItem value="">
                    Select City
                  </MenuItem>

                  {cities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.cityName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Complete Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter house number, street, locality, and postal address"
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  inputProps={{ step: "any" }}
                  placeholder="e.g. 17.9689"
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  inputProps={{ step: "any" }}
                  placeholder="e.g. 79.5941"
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.2,
                    alignItems: "flex-start",
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f4f7ff",
                    border: "1px solid #e0e9ff",
                  }}
                >
                  <LocationOn
                    sx={{ color: "#2457d6", mt: 0.2 }}
                  />

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#254078" }}
                    >
                      Geographic Coordinates
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ color: "#687b9d", lineHeight: 1.7 }}
                    >
                      Latitude and longitude are optional. If provided,
                      enter valid geographical coordinates for the property.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Pricing & Specifications */}

          <Paper sx={{ ...sectionCardSx, mb: 2.5 }}>
            <SectionHeader
              icon={<Sell />}
              title="Pricing & Specifications"
              subtitle="Enter the property value, area, and room details."
            />

            <Divider sx={{ mb: 3, borderColor: "#edf0f5" }} />

            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price (₹)"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 0 }}
                  placeholder="Enter property price"
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Area (Sq. Ft.)"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 0 }}
                  placeholder="Enter property area"
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 1 }}
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 1 }}
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Facing"
                  name="facing"
                  value={formData.facing}
                  onChange={handleChange}
                  placeholder="e.g. EAST"
                  sx={fieldSx}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Form Footer */}

          <Paper
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              border: "1px solid #e5eaf2",
              boxShadow: "0 5px 22px rgba(30, 55, 90, 0.045)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 800, color: "#172b4d" }}
                >
                  Ready to create your property?
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, color: "#8490a5" }}
                >
                  Review the information before submitting.
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                spacing={1.5}
              >
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<Close />}
                  onClick={() => navigate("/admin/properties")}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 700,
                    borderColor: "#d8e0ed",
                    color: "#344563",
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    loading ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <Save />
                    )
                  }
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 800,
                    boxShadow: "0 5px 12px rgba(36, 87, 214, 0.2)",
                    background:
                      "linear-gradient(135deg, #2457d6 0%, #4777ed 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1d46b0 0%, #315fc9 100%)",
                    },
                  }}
                >
                  {loading ? "Creating Property..." : "Create Property"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Footer Note */}

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "#9aa5b5",
            mt: 3,
            mb: 1,
          }}
        >
          RealEstate Pro · Property Management
        </Typography>
      </Box>
    </Box>
  );
}

export default CreateProperty;
