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
} from "@mui/icons-material";

import {
  getCustomerProfile,
  updateCustomerProfile,
  uploadProfileImage,
} from "../../api";

// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL = "http://localhost:9090";

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

    // Blob URL
    if (profileImage.startsWith("blob:")) {
      return profileImage;
    }

    // Already complete URL
    if (
      profileImage.startsWith("http://") ||
      profileImage.startsWith("https://")
    ) {
      return profileImage;
    }

    // Already starts with /uploads
    if (profileImage.startsWith("/uploads/")) {
      return `${BACKEND_URL}${profileImage}`;
    }

    // Already starts with uploads/
    if (profileImage.startsWith("uploads/")) {
      return `${BACKEND_URL}/${profileImage}`;
    }

    // Filename only
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

        // Save latest user
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

          // Preserve existing image
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

    // Reset input
    event.target.value = "";

    if (!file) {
      return;
    }

    // =================================================
    // VALIDATE FILE TYPE
    // =================================================

    if (!file.type.startsWith("image/")) {

      setError(
        "Please select a valid image file."
      );

      return;
    }

    // =================================================
    // VALIDATE FILE SIZE
    // =================================================

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {

      setError(
        "Image size must be less than 5 MB."
      );

      return;
    }

    // =================================================
    // LOCAL PREVIEW
    // =================================================

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setError("");

    setSuccess("");

    // =================================================
    // UPLOAD
    // =================================================

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

        // ---------------------------------------------
        // Update profile
        // ---------------------------------------------

        setProfile(updatedUser);

        // ---------------------------------------------
        // Update localStorage
        // ---------------------------------------------

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        // ---------------------------------------------
        // Clear temporary preview
        // ---------------------------------------------

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
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <Stack
          spacing={2}
          alignItems="center"
        >

          <CircularProgress />

          <Typography
            color="text.secondary"
          >
            Loading profile...
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
  // MAIN UI
  // ===================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        p: {
          xs: 2,
          md: 4,
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
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            My Profile
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Manage your owner account information
          </Typography>

        </Box>

        <Stack
          direction="row"
          spacing={1}
        >

          <Tooltip title="Refresh profile">

            <IconButton
              onClick={fetchProfile}
              disabled={uploadingImage || saving}
              sx={{
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
              }}
            >

              <Refresh />

            </IconButton>

          </Tooltip>

          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() =>
              navigate("/owner/dashboard")
            }
          >
            Dashboard
          </Button>

        </Stack>

      </Box>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 3,
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
          }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>

      )}

      {/* =================================================
          PROFILE CONTENT
      ================================================= */}

      <Grid
        container
        spacing={3}
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
              borderRadius: 3,
              height: "100%",
              boxShadow:
                "0 4px 18px rgba(0,0,0,0.06)",
            }}
          >

            <CardContent
              sx={{
                p: 4,
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
                }}
              >

                <Box
                  sx={{
                    position: "relative",
                    mb: 2,
                  }}
                >

                  {/* ============================================
                      AVATAR
                  ============================================ */}

                  <Avatar
                    src={displayedImage}
                    alt={
                      `${profile?.firstName || ""} ${
                        profile?.lastName || ""
                      }`
                    }
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
                      fontWeight: 700,
                      cursor:
                        displayedImage
                          ? "pointer"
                          : "default",
                      background:
                        "linear-gradient(135deg, #1976d2, #42a5f5)",
                    }}
                  >

                    {!displayedImage &&
                      getInitials()}

                  </Avatar>

                  {/* ============================================
                      UPLOAD BUTTON
                  ============================================ */}

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
                        position: "absolute",
                        bottom: 5,
                        right: 5,
                        width: 44,
                        height: 44,
                        backgroundColor:
                          "#1976d2",
                        color: "#ffffff",
                        border:
                          "3px solid white",
                        "&:hover": {
                          backgroundColor:
                            "#1565c0",
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

                {/* =================================================
                    HIDDEN FILE INPUT
                ================================================= */}

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

                {/* =================================================
                    CHANGE IMAGE BUTTON
                ================================================= */}

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
                    mb: 2,
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

                {/* =================================================
                    NAME
                ================================================= */}

                <Typography
                  variant="h5"
                  fontWeight={700}
                  textAlign="center"
                  sx={{
                    mt: 3,
                  }}
                >

                  {profile?.firstName || ""}
                  {" "}
                  {profile?.lastName || ""}

                </Typography>

                {/* =================================================
                    ROLE
                ================================================= */}

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    textTransform: "uppercase",
                  }}
                >

                  {profile?.roleName ||
                    profile?.role?.name ||
                    "OWNER"}

                </Typography>

                {/* =================================================
                    STATUS
                ================================================= */}

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
                  />

                  {profile?.verified !== false && (

                    <Chip
                      icon={<Verified />}
                      label="Verified"
                      color="primary"
                      size="small"
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

              <Stack
                spacing={2.5}
              >

                {/* ROLE */}

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >

                  <Badge
                    color="action"
                  />

                  <Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Account Role
                    </Typography>

                    <Typography
                      fontWeight={600}
                    >
                      {profile?.roleName ||
                        profile?.role?.name ||
                        "OWNER"}
                    </Typography>

                  </Box>

                </Stack>

                {/* STATUS */}

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >

                  <Lock
                    color="action"
                  />

                  <Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Account Status
                    </Typography>

                    <Typography
                      fontWeight={600}
                    >
                      {profile?.status ||
                        "ACTIVE"}
                    </Typography>

                  </Box>

                </Stack>

                {/* VERIFICATION */}

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >

                  <Verified
                    color="action"
                  />

                  <Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Verification
                    </Typography>

                    <Typography
                      fontWeight={600}
                    >
                      {profile?.verified
                        ? "Verified"
                        : "Not Verified"}
                    </Typography>

                  </Box>

                </Stack>

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
              borderRadius: 3,
              boxShadow:
                "0 4px 18px rgba(0,0,0,0.06)",
            }}
          >

            <CardContent
              sx={{
                p: 4,
              }}
            >

              {/* HEADER */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "flex-start",
                  gap: 2,
                  mb: 3,
                }}
              >

                <Box>

                  <Typography
                    variant="h5"
                    fontWeight={600}
                  >
                    Personal Information
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    View and update your account details
                  </Typography>

                </Box>

                {!editing && (

                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </Button>

                )}

              </Box>

              <Divider
                sx={{
                  mb: 3,
                }}
              />

              {/* FORM */}

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
                    minRows={4}
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
                  />

                </Grid>

              </Grid>

              {/* SAVE / CANCEL */}

              {editing && (

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{
                    mt: 3,
                  }}
                >

                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={
                      handleCancel
                    }
                    disabled={saving}
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
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>

                </Stack>

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
          borderRadius: 3,
          boxShadow:
            "0 4px 18px rgba(0,0,0,0.06)",
        }}
      >

        <CardContent
          sx={{
            p: 3,
          }}
        >

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >

            <Avatar
              sx={{
                backgroundColor:
                  "#e3f2fd",
                color: "#1976d2",
              }}
            >
              <PhotoCamera />
            </Avatar>

            <Box>

              <Typography
                fontWeight={700}
              >
                Profile Image
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Upload a new owner image using
                the camera button above.
              </Typography>

              {profile?.profileImage && (

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    wordBreak: "break-all",
                  }}
                >
                  Image:{" "}
                  {profile.profileImage}
                </Typography>

              )}

            </Box>

          </Stack>

        </CardContent>

      </Card>

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
      >

        <DialogTitle>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Profile Image
            </Typography>

            <IconButton
              onClick={
                handleClosePreview
              }
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
            p: 4,
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
              maxWidth: "100%",
              maxHeight: "60vh",
              borderRadius: 3,
              objectFit: "contain",
            }}
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={
              handleClosePreview
            }
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}

export default OwnerProfile;