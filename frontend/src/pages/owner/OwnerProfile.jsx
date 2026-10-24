
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";

import {
  Person,
  Edit,
  Save,
  Cancel,
  Refresh,
  ArrowBack,
  Verified,
  Lock,
  Badge,
  Email,
  Phone,
  Home,
  PhotoCamera,
  Close,
  CloudUpload,
  Security,
  AccountCircle,
  CheckCircle,
} from "@mui/icons-material";

import {
  getCustomerProfile,
  updateCustomerProfile,
  uploadProfileImage,
} from "../../api";

// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL = "https://realestate-pro-backend.onrender.com";

// =====================================================
// OWNER PROFILE
// =====================================================

function OwnerProfile() {

  const navigate = useNavigate();

  // ===================================================
  // FILE INPUT REF
  // ===================================================

  const fileInputRef = useRef(null);

  // ===================================================
  // STATE
  // ===================================================

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [imagePreview, setImagePreview] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);

  // ===================================================
  // GET PROFILE IMAGE URL
  // ===================================================

  const getProfileImageUrl = (profileImage) => {

    if (!profileImage) {
      return "";
    }

    if (profileImage.startsWith("blob:")) {
      return profileImage;
    }

    if (
      profileImage.startsWith("http://") ||
      profileImage.startsWith("https://")
    ) {
      return profileImage;
    }

    if (profileImage.startsWith("/uploads/")) {
      return `${BACKEND_URL}${profileImage}`;
    }

    if (profileImage.startsWith("uploads/")) {
      return `${BACKEND_URL}/${profileImage}`;
    }

    return `${BACKEND_URL}/uploads/${profileImage}`;
  };

  // ===================================================
  // GET INITIALS
  // ===================================================

  const getInitials = () => {

    const first =
      profile?.firstName?.charAt(0) || "";

    const last =
      profile?.lastName?.charAt(0) || "";

    const initials =
      `${first}${last}`.toUpperCase();

    return initials || "O";
  };

  // ===================================================
  // FETCH OWNER PROFILE
  // ===================================================

  const fetchProfile = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await getCustomerProfile();

      console.log(
        "OWNER PROFILE RESPONSE:",
        response
      );

      if (response?.success) {

        const user =
          response.data;

        setProfile(user);

        setFormData({
          firstName:
            user?.firstName || "",

          lastName:
            user?.lastName || "",

          email:
            user?.email || "",

          mobile:
            user?.mobile || "",

          address:
            user?.address || "",
        });

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

      } else {

        setError(
          response?.message ||
          "Failed to load profile."
        );
      }

    } catch (error) {

      console.error(
        "OWNER PROFILE ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load profile."
      );

    } finally {

      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    fetchProfile();

  }, []);

  // ===================================================
  // HANDLE INPUT
  // ===================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      previous => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // ===================================================
  // START EDIT
  // ===================================================

  const handleEdit = () => {

    setError("");

    setSuccess("");

    setEditing(true);
  };

  // ===================================================
  // CANCEL EDIT
  // ===================================================

  const handleCancel = () => {

    setFormData({

      firstName:
        profile?.firstName || "",

      lastName:
        profile?.lastName || "",

      email:
        profile?.email || "",

      mobile:
        profile?.mobile || "",

      address:
        profile?.address || "",
    });

    setEditing(false);

    setError("");

    setSuccess("");
  };

  // ===================================================
  // SAVE PROFILE
  // ===================================================

  const handleSave = async () => {

    try {

      setSaving(true);

      setError("");

      setSuccess("");

      const response =
        await updateCustomerProfile({

          firstName:
            formData.firstName,

          lastName:
            formData.lastName,

          email:
            formData.email,

          mobile:
            formData.mobile,

          address:
            formData.address,

          profileImage:
            profile?.profileImage || "",
        });

      console.log(
        "UPDATE OWNER PROFILE RESPONSE:",
        response
      );

      if (response?.success) {

        const updatedUser =
          response.data;

        setProfile(updatedUser);

        setFormData({

          firstName:
            updatedUser?.firstName || "",

          lastName:
            updatedUser?.lastName || "",

          email:
            updatedUser?.email || "",

          mobile:
            updatedUser?.mobile || "",

          address:
            updatedUser?.address || "",
        });

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setEditing(false);

        setSuccess(
          "Profile updated successfully."
        );

      } else {

        setError(
          response?.message ||
          "Failed to update profile."
        );
      }

    } catch (error) {

      console.error(
        "UPDATE OWNER PROFILE ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile."
      );

    } finally {

      setSaving(false);
    }
  };

  // ===================================================
  // OPEN FILE SELECTOR
  // ===================================================

  const handleChooseImage = () => {

    if (uploadingImage) {
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ===================================================
  // HANDLE IMAGE SELECTION
  // ===================================================

  const handleImageChange = async (event) => {

    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {

      setError(
        "Please select a valid image file."
      );

      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {

      setError(
        "Image size must be less than 5 MB."
      );

      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setError("");

    setSuccess("");

    try {

      setUploadingImage(true);

      const response =
        await uploadProfileImage(file);

      console.log(
        "PROFILE IMAGE UPLOAD RESPONSE:",
        response
      );

      if (response?.success) {

        const updatedUser =
          response.data;

        setProfile(updatedUser);

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setImagePreview("");

        setSuccess(
          "Profile image uploaded successfully."
        );

      } else {

        setError(
          response?.message ||
          "Failed to upload profile image."
        );

        setImagePreview("");
      }

    } catch (error) {

      console.error(
        "PROFILE IMAGE UPLOAD ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload profile image."
      );

      setImagePreview("");

    } finally {

      setUploadingImage(false);
    }
  };

  // ===================================================
  // IMAGE ERROR HANDLER
  // ===================================================

  const handleImageError = (event) => {

    event.currentTarget.style.display =
      "none";
  };

  // ===================================================
  // OPEN IMAGE PREVIEW
  // ===================================================

  const handleOpenPreview = () => {

    const image =
      imagePreview ||
      getProfileImageUrl(
        profile?.profileImage
      );

    if (!image) {
      return;
    }

    setPreviewOpen(true);
  };

  // ===================================================
  // CLOSE IMAGE PREVIEW
  // ===================================================

  const handleClosePreview = () => {

    setPreviewOpen(false);
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f5f7fb 0%, #eef4ff 100%)",
        }}
      >

        <Stack
          spacing={2}
          alignItems="center"
        >

          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #1976d2, #42a5f5)",
              boxShadow:
                "0 15px 35px rgba(25,118,210,0.25)",
            }}
          >

            <CircularProgress
              size={38}
              thickness={4}
              sx={{
                color: "#ffffff",
              }}
            />

          </Box>

          <Typography
            color="text.secondary"
            fontWeight={500}
          >
            Loading your profile...
          </Typography>

        </Stack>

      </Box>
    );
  }

  // ===================================================
  // IMAGE TO DISPLAY
  // ===================================================

  const displayedImage =
    imagePreview ||
    getProfileImageUrl(
      profile?.profileImage
    );

  // ===================================================
  // FULL NAME
  // ===================================================

  const fullName =
    `${profile?.firstName || ""} ${
      profile?.lastName || ""
    }`.trim() || "Owner";

  // ===================================================
  // MAIN UI
  // ===================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f6f8fc 0%, #eef4ff 50%, #f8fafc 100%)",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
        }}
      >

        <Card
          sx={{
            mb: 3,
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow:
              "0 10px 35px rgba(30,60,90,0.08)",
          }}
        >

          <Box
            sx={{
              position: "relative",
              minHeight: {
                xs: 220,
                md: 200,
              },
              p: {
                xs: 3,
                md: 4,
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 3,
              flexWrap: "wrap",
              background:
                "linear-gradient(135deg, #0d47a1 0%, #1976d2 45%, #42a5f5 100%)",
              overflow: "hidden",
            }}
          >

            {/* Decorative circles */}

            <Box
              sx={{
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.08)",
                right: -80,
                top: -120,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.07)",
                left: "45%",
                bottom: -100,
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 2,
              }}
            >

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >

                <Avatar
                  src={displayedImage}
                  sx={{
                    width: {
                      xs: 70,
                      md: 82,
                    },
                    height: {
                      xs: 70,
                      md: 82,
                    },
                    fontSize: 28,
                    fontWeight: 700,
                    border:
                      "4px solid rgba(255,255,255,0.75)",
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,0.18)",
                    background:
                      "linear-gradient(135deg, #ffffff, #e3f2fd)",
                    color: "#1565c0",
                  }}
                  imgProps={{
                    onError: handleImageError,
                  }}
                >
                  {!displayedImage &&
                    getInitials()}
                </Avatar>

                <Box>

                  <Typography
                    variant="overline"
                    sx={{
                      color:
                        "rgba(255,255,255,0.75)",
                      fontWeight: 700,
                      letterSpacing: 1.5,
                    }}
                  >
                    OWNER ACCOUNT
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{
                      color: "#ffffff",
                      lineHeight: 1.15,
                      fontSize: {
                        xs: "1.8rem",
                        md: "2.25rem",
                      },
                    }}
                  >
                    {fullName}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      mt: 1,
                      flexWrap: "wrap",
                    }}
                  >

                    <Chip
                      size="small"
                      label={
                        profile?.status ||
                        "ACTIVE"
                      }
                      sx={{
                        color: "#ffffff",
                        fontWeight: 700,
                        backgroundColor:
                          "rgba(255,255,255,0.16)",
                        border:
                          "1px solid rgba(255,255,255,0.25)",
                      }}
                    />

                    <Chip
                      size="small"
                      icon={
                        <Verified
                          sx={{
                            color:
                              "#ffffff !important",
                          }}
                        />
                      }
                      label="Verified"
                      sx={{
                        color: "#ffffff",
                        fontWeight: 700,
                        backgroundColor:
                          "rgba(255,255,255,0.16)",
                        border:
                          "1px solid rgba(255,255,255,0.25)",
                      }}
                    />

                  </Stack>

                </Box>

              </Stack>

            </Box>

            {/* Header actions */}

            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                position: "relative",
                zIndex: 2,
              }}
            >

              <Tooltip title="Refresh profile">

                <IconButton
                  onClick={fetchProfile}
                  disabled={
                    uploadingImage ||
                    saving
                  }
                  sx={{
                    width: 48,
                    height: 48,
                    color: "#ffffff",
                    backgroundColor:
                      "rgba(255,255,255,0.14)",
                    border:
                      "1px solid rgba(255,255,255,0.25)",
                    "&:hover": {
                      backgroundColor:
                        "rgba(255,255,255,0.24)",
                    },
                  }}
                >

                  <Refresh />

                </IconButton>

              </Tooltip>

              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={() =>
                  navigate("/owner/dashboard")
                }
                sx={{
                  px: 2.5,
                  height: 48,
                  borderRadius: 2.5,
                  color: "#1565c0",
                  backgroundColor:
                    "#ffffff",
                  fontWeight: 700,
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.12)",
                  "&:hover": {
                    backgroundColor:
                      "#f5f5f5",
                  },
                }}
              >
                Dashboard
              </Button>

            </Stack>

          </Box>

        </Card>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2.5,
              boxShadow:
                "0 5px 18px rgba(211,47,47,0.08)",
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>

        )}

        {success && (

          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2.5,
              boxShadow:
                "0 5px 18px rgba(46,125,50,0.08)",
            }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>

        )}

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <Grid
          container
          spacing={3}
          alignItems="stretch"
        >

          {/* =================================================
              LEFT PROFILE CARD
          ================================================= */}

          <Grid
            item
            xs={12}
            md={5}
          >

            <Card
              sx={{
                borderRadius: 4,
                height: "100%",
                overflow: "hidden",
                border:
                  "1px solid rgba(25,118,210,0.08)",
                boxShadow:
                  "0 10px 35px rgba(30,60,90,0.07)",
              }}
            >

              {/* Profile card top banner */}

              <Box
                sx={{
                  height: 115,
                  background:
                    "linear-gradient(135deg, #1565c0, #42a5f5)",
                  position: "relative",
                }}
              >

                <Box
                  sx={{
                    position: "absolute",
                    width: 170,
                    height: 170,
                    borderRadius: "50%",
                    right: -50,
                    top: -90,
                    background:
                      "rgba(255,255,255,0.09)",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    left: -35,
                    bottom: -70,
                    background:
                      "rgba(255,255,255,0.08)",
                  }}
                />

              </Box>

              <CardContent
                sx={{
                  px: {
                    xs: 3,
                    md: 4,
                  },
                  pb: 4,
                  pt: 0,
                }}
              >

                {/* =================================================
                    PROFILE IMAGE
                ================================================= */}

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: -7,
                    position: "relative",
                  }}
                >

                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >

                    <Avatar
                      src={displayedImage}
                      alt={fullName}
                      imgProps={{
                        onError:
                          handleImageError,
                      }}
                      onClick={
                        displayedImage
                          ? handleOpenPreview
                          : undefined
                      }
                      sx={{
                        width: 150,
                        height: 150,
                        fontSize: 48,
                        fontWeight: 800,
                        cursor:
                          displayedImage
                            ? "pointer"
                            : "default",
                        background:
                          "linear-gradient(135deg, #e3f2fd, #ffffff)",
                        color: "#1565c0",
                        border:
                          "7px solid #ffffff",
                        boxShadow:
                          "0 12px 35px rgba(25,118,210,0.22)",
                      }}
                    >

                      {!displayedImage &&
                        getInitials()}

                    </Avatar>

                    {/* Upload button */}

                    <Tooltip
                      title={
                        uploadingImage
                          ? "Uploading..."
                          : "Change profile image"
                      }
                    >

                      <IconButton
                        onClick={
                          handleChooseImage
                        }
                        disabled={
                          uploadingImage
                        }
                        sx={{
                          position:
                            "absolute",
                          bottom: 4,
                          right: 3,
                          width: 46,
                          height: 46,
                          backgroundColor:
                            "#1976d2",
                          color: "#ffffff",
                          border:
                            "3px solid white",
                          boxShadow:
                            "0 5px 15px rgba(25,118,210,0.35)",
                          "&:hover": {
                            backgroundColor:
                              "#0d47a1",
                          },
                        }}
                      >

                        {uploadingImage ? (

                          <CircularProgress
                            size={22}
                            color="inherit"
                          />

                        ) : (

                          <PhotoCamera />

                        )}

                      </IconButton>

                    </Tooltip>

                  </Box>

                  {/* Hidden input */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    style={{
                      display: "none",
                    }}
                    onChange={
                      handleImageChange
                    }
                  />

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={
                      uploadingImage ? (
                        <CircularProgress
                          size={16}
                        />
                      ) : (
                        <CloudUpload />
                      )
                    }
                    onClick={
                      handleChooseImage
                    }
                    disabled={
                      uploadingImage
                    }
                    sx={{
                      mt: 2,
                      mb: 1,
                      borderRadius: 2,
                      px: 2,
                      fontWeight: 700,
                      borderWidth: 1.5,
                      "&:hover": {
                        borderWidth: 1.5,
                      },
                    }}
                  >

                    {uploadingImage
                      ? "Uploading..."
                      : "Change Profile Image"}

                  </Button>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    textAlign="center"
                  >
                    JPG, JPEG, PNG or WEBP
                    <br />
                    Maximum size: 5 MB
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    textAlign="center"
                    sx={{
                      mt: 2,
                      color: "#172b4d",
                    }}
                  >
                    {fullName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                      textTransform:
                        "uppercase",
                      letterSpacing: 1,
                      fontWeight: 600,
                    }}
                  >
                    {profile?.roleName ||
                      profile?.role?.name ||
                      "OWNER"}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      mt: 2,
                    }}
                  >

                    <Chip
                      label={
                        profile?.status ||
                        "ACTIVE"
                      }
                      color="success"
                      size="small"
                      icon={
                        <CheckCircle />
                      }
                      sx={{
                        fontWeight: 700,
                      }}
                    />

                    {profile?.verified !== false && (

                      <Chip
                        icon={
                          <Verified />
                        }
                        label="Verified"
                        color="primary"
                        size="small"
                        sx={{
                          fontWeight: 700,
                        }}
                      />

                    )}

                  </Stack>

                </Box>

                <Divider
                  sx={{
                    my: 3,
                  }}
                />

                {/* =================================================
                    ACCOUNT DETAILS
                ================================================= */}

                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={800}
                  letterSpacing={1.2}
                >
                  ACCOUNT INFORMATION
                </Typography>

                <Stack
                  spacing={1.5}
                  sx={{
                    mt: 1.5,
                  }}
                >

                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.8,
                      borderRadius: 2.5,
                      backgroundColor:
                        "#f7f9fc",
                      border:
                        "1px solid #edf0f5",
                    }}
                  >

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >

                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          backgroundColor:
                            "#e3f2fd",
                          color: "#1976d2",
                        }}
                      >
                        <Badge />
                      </Avatar>

                      <Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Account Role
                        </Typography>

                        <Typography
                          fontWeight={700}
                        >
                          {profile?.roleName ||
                            profile?.role?.name ||
                            "OWNER"}
                        </Typography>

                      </Box>

                    </Stack>

                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.8,
                      borderRadius: 2.5,
                      backgroundColor:
                        "#f7f9fc",
                      border:
                        "1px solid #edf0f5",
                    }}
                  >

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >

                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          backgroundColor:
                            "#e8f5e9",
                          color: "#2e7d32",
                        }}
                      >
                        <Lock />
                      </Avatar>

                      <Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Account Status
                        </Typography>

                        <Typography
                          fontWeight={700}
                        >
                          {profile?.status ||
                            "ACTIVE"}
                        </Typography>

                      </Box>

                    </Stack>

                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.8,
                      borderRadius: 2.5,
                      backgroundColor:
                        "#f7f9fc",
                      border:
                        "1px solid #edf0f5",
                    }}
                  >

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >

                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          backgroundColor:
                            "#fff8e1",
                          color: "#f57f17",
                        }}
                      >
                        <Security />
                      </Avatar>

                      <Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Verification
                        </Typography>

                        <Typography
                          fontWeight={700}
                        >
                          {profile?.verified
                            ? "Verified"
                            : "Not Verified"}
                        </Typography>

                      </Box>

                    </Stack>

                  </Paper>

                </Stack>

              </CardContent>

            </Card>

          </Grid>

          {/* =================================================
              RIGHT PERSONAL INFORMATION
          ================================================= */}

          <Grid
            item
            xs={12}
            md={7}
          >

            <Card
              sx={{
                borderRadius: 4,
                height: "100%",
                border:
                  "1px solid rgba(25,118,210,0.08)",
                boxShadow:
                  "0 10px 35px rgba(30,60,90,0.07)",
              }}
            >

              <CardContent
                sx={{
                  p: {
                    xs: 3,
                    md: 4,
                  },
                }}
              >

                {/* Header */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >

                    <Avatar
                      sx={{
                        width: 54,
                        height: 54,
                        background:
                          "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                        color: "#1565c0",
                      }}
                    >
                      <AccountCircle
                        sx={{
                          fontSize: 30,
                        }}
                      />
                    </Avatar>

                    <Box>

                      <Typography
                        variant="h5"
                        fontWeight={800}
                        color="#172b4d"
                      >
                        Personal Information
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          mt: 0.4,
                        }}
                      >
                        View and update your account details
                      </Typography>

                    </Box>

                  </Stack>

                  {!editing && (

                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={handleEdit}
                      sx={{
                        borderRadius: 2.5,
                        px: 2.5,
                        py: 1.1,
                        fontWeight: 700,
                        boxShadow:
                          "0 7px 18px rgba(25,118,210,0.25)",
                      }}
                    >
                      Edit Profile
                    </Button>

                  )}

                </Box>

                <Divider
                  sx={{
                    mb: 3.5,
                  }}
                />

                {/* =================================================
                    FORM
                ================================================= */}

                <Grid
                  container
                  spacing={2.5}
                >

                  {/* FIRST NAME */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                  >

                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={
                        formData.firstName
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                      InputProps={{
                        startAdornment: (
                          <Person
                            sx={{
                              mr: 1,
                              color:
                                "text.secondary",
                            }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root":
                          {
                            borderRadius: 2.5,
                            backgroundColor:
                              editing
                                ? "#ffffff"
                                : "#f8fafc",
                          },
                      }}
                    />

                  </Grid>

                  {/* LAST NAME */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                  >

                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={
                        formData.lastName
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                      sx={{
                        "& .MuiOutlinedInput-root":
                          {
                            borderRadius: 2.5,
                            backgroundColor:
                              editing
                                ? "#ffffff"
                                : "#f8fafc",
                          },
                      }}
                    />

                  </Grid>

                  {/* EMAIL */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                  >

                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={
                        formData.email
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                      InputProps={{
                        startAdornment: (
                          <Email
                            sx={{
                              mr: 1,
                              color:
                                "text.secondary",
                            }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root":
                          {
                            borderRadius: 2.5,
                            backgroundColor:
                              editing
                                ? "#ffffff"
                                : "#f8fafc",
                          },
                      }}
                    />

                  </Grid>

                  {/* MOBILE */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                  >

                    <TextField
                      fullWidth
                      label="Mobile"
                      name="mobile"
                      value={
                        formData.mobile
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                      InputProps={{
                        startAdornment: (
                          <Phone
                            sx={{
                              mr: 1,
                              color:
                                "text.secondary",
                            }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root":
                          {
                            borderRadius: 2.5,
                            backgroundColor:
                              editing
                                ? "#ffffff"
                                : "#f8fafc",
                          },
                      }}
                    />

                  </Grid>

                  {/* ADDRESS */}

                  <Grid
                    item
                    xs={12}
                  >

                    <TextField
                      fullWidth
                      multiline
                      minRows={5}
                      label="Address"
                      name="address"
                      value={
                        formData.address
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                      InputProps={{
                        startAdornment: (
                          <Home
                            sx={{
                              mr: 1,
                              mt: 1,
                              color:
                                "text.secondary",
                            }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root":
                          {
                            borderRadius: 2.5,
                            backgroundColor:
                              editing
                                ? "#ffffff"
                                : "#f8fafc",
                          },
                      }}
                    />

                  </Grid>

                </Grid>

                {/* =================================================
                    SAVE / CANCEL
                ================================================= */}

                {editing && (

                  <Paper
                    elevation={0}
                    sx={{
                      mt: 3,
                      p: 2,
                      borderRadius: 2.5,
                      backgroundColor:
                        "#f5f9ff",
                      border:
                        "1px solid #dbeafe",
                    }}
                  >

                    <Stack
                      direction={{
                        xs: "column-reverse",
                        sm: "row",
                      }}
                      spacing={1.5}
                      justifyContent="flex-end"
                    >

                      <Button
                        variant="outlined"
                        startIcon={
                          <Cancel />
                        }
                        onClick={
                          handleCancel
                        }
                        disabled={saving}
                        sx={{
                          borderRadius: 2,
                          px: 2.5,
                          fontWeight: 700,
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant="contained"
                        startIcon={
                          saving ? (
                            <CircularProgress
                              size={18}
                              color="inherit"
                            />
                          ) : (
                            <Save />
                          )
                        }
                        onClick={
                          handleSave
                        }
                        disabled={saving}
                        sx={{
                          borderRadius: 2,
                          px: 2.8,
                          fontWeight: 700,
                          boxShadow:
                            "0 6px 16px rgba(25,118,210,0.22)",
                        }}
                      >
                        {saving
                          ? "Saving..."
                          : "Save Changes"}
                      </Button>

                    </Stack>

                  </Paper>

                )}

              </CardContent>

            </Card>

          </Grid>

        </Grid>

        {/* =================================================
            PROFILE IMAGE INFORMATION
        ================================================= */}

        <Card
          sx={{
            mt: 3,
            borderRadius: 4,
            overflow: "hidden",
            border:
              "1px solid rgba(25,118,210,0.08)",
            boxShadow:
              "0 10px 35px rgba(30,60,90,0.07)",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
            }}
          >

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              justifyContent="space-between"
            >

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >

                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    background:
                      "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                    color: "#1976d2",
                  }}
                >
                  <PhotoCamera />
                </Avatar>

                <Box>

                  <Typography
                    fontWeight={800}
                    fontSize="1.05rem"
                  >
                    Profile Image
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.3,
                    }}
                  >
                    Keep your owner profile professional
                    with a clear profile image.
                  </Typography>

                  {profile?.profileImage && (

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 0.6,
                        display: "block",
                        wordBreak:
                          "break-all",
                      }}
                    >
                      Current image:{" "}
                      {profile.profileImage}
                    </Typography>

                  )}

                </Box>

              </Stack>

              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={
                  handleChooseImage
                }
                disabled={
                  uploadingImage
                }
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  whiteSpace:
                    "nowrap",
                }}
              >
                Upload New Image
              </Button>

            </Stack>

          </CardContent>

        </Card>

      </Box>

      {/* =================================================
          IMAGE PREVIEW DIALOG
      ================================================= */}

      <Dialog
        open={previewOpen}
        onClose={
          handleClosePreview
        }
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
          },
        }}
      >

        <DialogTitle
          sx={{
            background:
              "linear-gradient(135deg, #0d47a1, #1976d2)",
            color: "#ffffff",
            p: 2.5,
          }}
        >

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >

              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  backgroundColor:
                    "rgba(255,255,255,0.15)",
                  color: "#ffffff",
                }}
              >
                <PhotoCamera />
              </Avatar>

              <Typography
                variant="h6"
                fontWeight={800}
              >
                Profile Image
              </Typography>

            </Stack>

            <IconButton
              onClick={
                handleClosePreview
              }
              sx={{
                color: "#ffffff",
                "&:hover": {
                  backgroundColor:
                    "rgba(255,255,255,0.12)",
                },
              }}
            >
              <Close />
            </IconButton>

          </Box>

        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            p: {
              xs: 2,
              md: 4,
            },
            backgroundColor:
              "#f5f7fb",
          }}
        >

          <Box
            sx={{
              p: 1,
              borderRadius: 3,
              backgroundColor:
                "#ffffff",
              boxShadow:
                "0 12px 35px rgba(0,0,0,0.12)",
              maxWidth: "100%",
            }}
          >

            <Box
              component="img"
              src={
                imagePreview ||
                getProfileImageUrl(
                  profile?.profileImage
                )
              }
              alt="Owner Profile"
              sx={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "60vh",
                borderRadius: 2.5,
                objectFit: "contain",
              }}
            />

          </Box>

        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            backgroundColor:
              "#f5f7fb",
          }}
        >

          <Button
            onClick={
              handleClosePreview
            }
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 700,
            }}
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}

export default OwnerProfile;
