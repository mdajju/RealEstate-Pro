import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyById, updateProperty } from "../../api";

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

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [property, setProperty] = useState({
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
  // LOAD PROPERTY
  // =========================================

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getPropertyById(id);

        console.log("Property response:", result);

        if (result.success) {
          const data = result.data;

          setProperty({
            title: data.title || "",
            description: data.description || "",
            propertyTypeId: data.propertyTypeId || "",
            ownerId: data.ownerId || "",
            agentId: data.agentId || "",
            stateId: data.stateId || "",
            cityId: data.cityId || "",
            address: data.address || "",
            latitude: data.latitude ?? "",
            longitude: data.longitude ?? "",
            price: data.price ?? "",
            area: data.area ?? "",
            bedrooms: data.bedrooms ?? "",
            bathrooms: data.bathrooms ?? "",
            facing: data.facing || "",
            status: data.status || "AVAILABLE",
            images: data.images || [],
            amenities: data.amenities || [],
          });
        } else {
          setError(result.message || "Unable to load property.");
        }
      } catch (err) {
        console.error("Get property error:", err);

        setError(
          err.response?.data?.message || "Failed to load property."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProperty();
    }
  }, [id]);

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProperty((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE UPDATE
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const requestData = {
        title: property.title,
        description: property.description,
        propertyTypeId: property.propertyTypeId,
        ownerId: property.ownerId,
        agentId: property.agentId || null,
        stateId: property.stateId,
        cityId: property.cityId,
        address: property.address,

        latitude:
          property.latitude === "" ? null : Number(property.latitude),

        longitude:
          property.longitude === "" ? null : Number(property.longitude),

        price: Number(property.price),
        area: Number(property.area),

        bedrooms:
          property.bedrooms === "" ? null : Number(property.bedrooms),

        bathrooms:
          property.bathrooms === "" ? null : Number(property.bathrooms),

        facing: property.facing || null,
        status: property.status,
        images: property.images,
        amenities: property.amenities,
      };

      console.log("Update property request:", requestData);

      const result = await updateProperty(id, requestData);

      console.log("Update property response:", result);

      if (result.success) {
        setMessage("Property updated successfully!");

        setTimeout(() => {
          navigate("/admin/properties");
        }, 1000);
      } else {
        setError(result.message || "Property update failed.");
      }
    } catch (err) {
      console.error("Update property error:", err);

      setError(
        err.response?.data?.message || "Failed to update property."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // REUSABLE FIELD STYLES
  // =========================================

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#ffffff",
      transition: "all 0.2s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#64748b",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#2563eb",
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#2563eb",
    },
  };

  const sectionSx = {
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
    border: "1px solid #e5eaf2",
    boxShadow: "0 4px 18px rgba(15, 23, 42, 0.035)",
    backgroundColor: "#ffffff",
  };

  const SectionHeading = ({ number, title, subtitle }) => (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
      <Box
        sx={{
          width: 42,
          height: 42,
          flexShrink: 0,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563eb, #4f46e5)",
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 800,
          boxShadow: "0 5px 12px rgba(37, 99, 235, 0.2)",
        }}
      >
        {number}
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: "#172554", fontSize: 17 }}
        >
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.3 }}>
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f7fb",
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 5,
            borderRadius: 4,
            textAlign: "center",
            border: "1px solid #e5eaf2",
          }}
        >
          <CircularProgress
            size={48}
            thickness={4}
            sx={{ color: "#2563eb", mb: 2 }}
          />

          <Typography variant="h6" sx={{ fontWeight: 800, color: "#172554" }}>
            Loading Property
          </Typography>

          <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
            Please wait while we retrieve the property details.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        p: { xs: 1.5, sm: 2.5, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* PAGE HEADER */}

        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 2.5, sm: 4 },
            mb: 3,
            borderRadius: 4,
            color: "#ffffff",
            background:
              "linear-gradient(120deg, #172554 0%, #1d4ed8 58%, #4f46e5 100%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 230,
              height: 230,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.07)",
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
              border: "1px solid rgba(255,255,255,0.15)",
              right: 80,
              bottom: -100,
            }}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Chip
                  label="PROPERTY MANAGEMENT"
                  size="small"
                  sx={{
                    color: "#ffffff",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                  }}
                />

                <Chip
                  label={`ID: ${id}`}
                  size="small"
                  sx={{
                    color: "#dbeafe",
                    backgroundColor: "rgba(15,23,42,0.18)",
                    fontWeight: 600,
                    maxWidth: 180,
                  }}
                />
              </Stack>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  letterSpacing: -0.8,
                  fontSize: { xs: 27, sm: 34 },
                }}
              >
                Edit Property
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#dbeafe",
                  mt: 1,
                  maxWidth: 620,
                  lineHeight: 1.7,
                }}
              >
                Update property information, ownership, location, pricing, and
                availability from one place.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              onClick={() => navigate("/admin/properties")}
              sx={{
                flexShrink: 0,
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.55)",
                borderRadius: 2.5,
                px: 2.5,
                py: 1.2,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#ffffff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              ← Back to Properties
            </Button>
          </Stack>
        </Paper>

        {/* STATUS MESSAGES */}

        {message && (
          <Alert
            severity="success"
            onClose={() => setMessage("")}
            sx={{ mb: 2.5, borderRadius: 2.5 }}
          >
            {message}
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 2.5, borderRadius: 2.5 }}
          >
            {error}
          </Alert>
        )}

        {/* FORM */}

        <Box component="form" onSubmit={handleSubmit} noValidate={false}>
          <Stack spacing={2.5}>
            {/* SECTION 1: BASIC INFORMATION */}

            <Paper elevation={0} sx={sectionSx}>
              <SectionHeading
                number="01"
                title="Basic Information"
                subtitle="Enter the main details that describe this property."
              />

              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Property Title"
                    name="title"
                    value={property.title}
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
                    value={property.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe the property, facilities, and key features..."
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Property Type ID"
                    name="propertyTypeId"
                    value={property.propertyTypeId}
                    onChange={handleChange}
                    required
                    helperText="Enter the existing property type ID."
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Property Status"
                    name="status"
                    value={property.status}
                    onChange={handleChange}
                    sx={fieldSx}
                  >
                    <MenuItem value="AVAILABLE">Available</MenuItem>
                    <MenuItem value="SOLD">Sold</MenuItem>
                    <MenuItem value="RENTED">Rented</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            {/* SECTION 2: OWNERSHIP */}

            <Paper elevation={0} sx={sectionSx}>
              <SectionHeading
                number="02"
                title="Ownership & Assignment"
                subtitle="Manage the owner and the agent associated with this property."
              />

              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Owner ID"
                    name="ownerId"
                    value={property.ownerId}
                    onChange={handleChange}
                    required
                    helperText="The ID of the property owner."
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Agent ID"
                    name="agentId"
                    value={property.agentId}
                    onChange={handleChange}
                    helperText="Optional. Leave empty if no agent is assigned."
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* SECTION 3: LOCATION */}

            <Paper elevation={0} sx={sectionSx}>
              <SectionHeading
                number="03"
                title="Property Location"
                subtitle="Update the address and geographic coordinates."
              />

              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Property Address"
                    name="address"
                    value={property.address}
                    onChange={handleChange}
                    required
                    placeholder="Street, area, landmark, or complete address"
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State ID"
                    name="stateId"
                    value={property.stateId}
                    onChange={handleChange}
                    required
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City ID"
                    name="cityId"
                    value={property.cityId}
                    onChange={handleChange}
                    required
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Latitude"
                    name="latitude"
                    value={property.latitude}
                    onChange={handleChange}
                    inputProps={{ step: "any", min: -90, max: 90 }}
                    helperText="Optional geographic latitude (-90 to 90)."
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Longitude"
                    name="longitude"
                    value={property.longitude}
                    onChange={handleChange}
                    inputProps={{ step: "any", min: -180, max: 180 }}
                    helperText="Optional geographic longitude (-180 to 180)."
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* SECTION 4: PRICING AND SIZE */}

            <Paper elevation={0} sx={sectionSx}>
              <SectionHeading
                number="04"
                title="Pricing & Property Size"
                subtitle="Set the current price and area of the property."
              />

              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Property Price (₹)"
                    name="price"
                    value={property.price}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 0, step: "any" }}
                    sx={fieldSx}
                  />

                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "#64748b" }}
                  >
                    Current price:{" "}
                    <Box
                      component="span"
                      sx={{ color: "#15803d", fontWeight: 800 }}
                    >
                      ₹
                      {Number(property.price || 0).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </Box>
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Area (sq. ft. or project unit)"
                    name="area"
                    value={property.area}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 0, step: "any" }}
                    helperText="Use the same area unit expected by your backend."
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* SECTION 5: PROPERTY FEATURES */}

            <Paper elevation={0} sx={sectionSx}>
              <SectionHeading
                number="05"
                title="Property Features"
                subtitle="Update the room count and property-facing direction."
              />

              <Grid container spacing={2.5}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Bedrooms"
                    name="bedrooms"
                    value={property.bedrooms}
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
                    value={property.bathrooms}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: 1 }}
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Facing Direction"
                    name="facing"
                    value={property.facing}
                    onChange={handleChange}
                    sx={fieldSx}
                  >
                    <MenuItem value="">Not specified</MenuItem>
                    <MenuItem value="NORTH">North</MenuItem>
                    <MenuItem value="SOUTH">South</MenuItem>
                    <MenuItem value="EAST">East</MenuItem>
                    <MenuItem value="WEST">West</MenuItem>
                    <MenuItem value="NORTH_EAST">North-East</MenuItem>
                    <MenuItem value="NORTH_WEST">North-West</MenuItem>
                    <MenuItem value="SOUTH_EAST">South-East</MenuItem>
                    <MenuItem value="SOUTH_WEST">South-West</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            {/* FORM FOOTER */}

            <Paper
              elevation={0}
              sx={{
                ...sectionSx,
                background:
                  "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 800, color: "#172554" }}
                  >
                    Ready to save your changes?
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mt: 0.5 }}
                  >
                    Review the information before updating this property.
                  </Typography>
                </Box>

                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  spacing={1.5}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={saving}
                    onClick={() => navigate("/admin/properties")}
                    sx={{
                      borderRadius: 2.5,
                      px: 3,
                      py: 1.3,
                      fontWeight: 700,
                      textTransform: "none",
                      color: "#334155",
                      borderColor: "#cbd5e1",
                      "&:hover": {
                        borderColor: "#64748b",
                        backgroundColor: "#f1f5f9",
                      },
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    sx={{
                      borderRadius: 2.5,
                      px: 3.5,
                      py: 1.3,
                      fontWeight: 800,
                      textTransform: "none",
                      minWidth: 190,
                      background:
                        "linear-gradient(135deg, #2563eb, #4f46e5)",
                      boxShadow: "0 5px 14px rgba(37, 99, 235, 0.22)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #1d4ed8, #4338ca)",
                        boxShadow: "0 7px 18px rgba(37, 99, 235, 0.3)",
                      },
                    }}
                  >
                    {saving ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <CircularProgress
                          size={18}
                          sx={{ color: "#ffffff" }}
                        />
                        <span>Updating...</span>
                      </Stack>
                    ) : (
                      "✓ Update Property"
                    )}
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", display: "block" }}
              >
                RealEstate Pro · Property Management · Property ID: {id}
              </Typography>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default EditProperty;