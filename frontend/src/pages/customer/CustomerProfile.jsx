import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Chip,
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

const BACKEND_URL =
  "http://localhost:9090";


// =====================================================
// CUSTOMER PROFILE
// =====================================================

function CustomerProfile() {

  // ===================================================
  // FILE INPUT REF
  // ===================================================

  const fileInputRef =
    useRef(null);


  // ===================================================
  // STATE
  // ===================================================

  const [profile, setProfile] =
    useState(null);

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      address: "",
    });

  const [editing, setEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [imagePreview, setImagePreview] =
    useState("");

  const [previewOpen, setPreviewOpen] =
    useState(false);


  // ===================================================
  // GET PROFILE IMAGE URL
  // ===================================================

  const getProfileImageUrl =
    (profileImage) => {

      if (!profileImage) {
        return "";
      }


      // -----------------------------------------------
      // Blob URL
      // -----------------------------------------------

      if (
        profileImage.startsWith(
          "blob:"
        )
      ) {

        return profileImage;

      }


      // -----------------------------------------------
      // Complete URL
      // -----------------------------------------------

      if (
        profileImage.startsWith(
          "http://"
        ) ||
        profileImage.startsWith(
          "https://"
        )
      ) {

        return profileImage;

      }


      // -----------------------------------------------
      // /uploads/filename
      // -----------------------------------------------

      if (
        profileImage.startsWith(
          "/uploads/"
        )
      ) {

        return (
          `${BACKEND_URL}${profileImage}`
        );

      }


      // -----------------------------------------------
      // uploads/filename
      // -----------------------------------------------

      if (
        profileImage.startsWith(
          "uploads/"
        )
      ) {

        return (
          `${BACKEND_URL}/${profileImage}`
        );

      }


      // -----------------------------------------------
      // Filename only
      // -----------------------------------------------

      return (
        `${BACKEND_URL}/uploads/${profileImage}`
      );

    };


  // ===================================================
  // GET LOGGED-IN USER
  // ===================================================

  const getLoggedInUser =
    () => {

      const savedUser =
        localStorage.getItem(
          "user"
        );

      if (!savedUser) {
        return {};
      }


      try {

        return JSON.parse(
          savedUser
        );

      } catch (error) {

        console.error(
          "Unable to read user from localStorage:",
          error
        );

        return {};

      }

    };


  // ===================================================
  // GET INITIALS
  // ===================================================

  const getInitials =
    () => {

      const first =
        profile?.firstName?.charAt(0) ||
        "";

      const last =
        profile?.lastName?.charAt(0) ||
        "";

      const initials =
        `${first}${last}`.toUpperCase();

      return initials || "C";

    };


  // ===================================================
  // FETCH PROFILE
  // ===================================================

  const fetchProfile =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await getCustomerProfile();


        console.log(
          "CUSTOMER PROFILE RESPONSE:",
          response
        );


        // ---------------------------------------------
        // HANDLE ApiResponse
        // ---------------------------------------------

        const user =
          response?.data ||
          response;


        if (!user) {

          throw new Error(
            "Customer profile data not found."
          );

        }


        // ---------------------------------------------
        // SET PROFILE
        // ---------------------------------------------

        setProfile(user);


        // ---------------------------------------------
        // SET FORM DATA
        // ---------------------------------------------

        setFormData({

          firstName:
            user?.firstName ||
            "",

          lastName:
            user?.lastName ||
            "",

          email:
            user?.email ||
            "",

          mobile:
            user?.mobile ||
            "",

          address:
            user?.address ||
            "",

        });


        // ---------------------------------------------
        // SAVE LATEST USER
        // ---------------------------------------------

        const oldUser =
          getLoggedInUser();


        const updatedLocalUser = {

          ...oldUser,

          ...user,

          id:
            user?.id ||
            oldUser?.id ||
            oldUser?.userId,

          userId:
            user?.id ||
            oldUser?.userId ||
            oldUser?.id,

        };


        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedLocalUser
          )
        );


      } catch (error) {

        console.error(
          "CUSTOMER PROFILE ERROR:",
          error
        );


        setError(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load customer profile."
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

  const handleChange =
    (event) => {

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


      setError("");

      setSuccess("");

    };


  // ===================================================
  // VALIDATE FORM
  // ===================================================

  const validateForm =
    () => {

      const firstName =
        formData.firstName.trim();

      const lastName =
        formData.lastName.trim();

      const email =
        formData.email.trim();

      const mobile =
        formData.mobile.trim();

      const address =
        formData.address.trim();


      if (!firstName) {

        setError(
          "First name is required."
        );

        return false;

      }


      if (
        firstName.length < 2
      ) {

        setError(
          "First name must contain at least 2 characters."
        );

        return false;

      }


      if (!lastName) {

        setError(
          "Last name is required."
        );

        return false;

      }


      if (!email) {

        setError(
          "Email is required."
        );

        return false;

      }


      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email
        )
      ) {

        setError(
          "Enter a valid email address."
        );

        return false;

      }


      if (!mobile) {

        setError(
          "Mobile number is required."
        );

        return false;

      }


      if (
        !/^[6-9]\d{9}$/.test(
          mobile
        )
      ) {

        setError(
          "Enter a valid 10-digit Indian mobile number."
        );

        return false;

      }


      if (!address) {

        setError(
          "Address is required."
        );

        return false;

      }


      if (
        address.length < 5
      ) {

        setError(
          "Address must contain at least 5 characters."
        );

        return false;

      }


      return true;

    };


  // ===================================================
  // START EDIT
  // ===================================================

  const handleEdit =
    () => {

      setError("");

      setSuccess("");

      setEditing(true);

    };


  // ===================================================
  // CANCEL EDIT
  // ===================================================

  const handleCancel =
    () => {

      setFormData({

        firstName:
          profile?.firstName ||
          "",

        lastName:
          profile?.lastName ||
          "",

        email:
          profile?.email ||
          "",

        mobile:
          profile?.mobile ||
          "",

        address:
          profile?.address ||
          "",

      });


      setEditing(false);

      setError("");

      setSuccess("");

    };


  // ===================================================
  // SAVE PROFILE
  // ===================================================

  const handleSave =
    async () => {

      if (!validateForm()) {
        return;
      }


      try {

        setSaving(true);

        setError("");

        setSuccess("");


        // ---------------------------------------------
        // UPDATE DATA
        // ---------------------------------------------

        const updateData = {

          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName.trim(),

          email:
            formData.email.trim(),

          mobile:
            formData.mobile.trim(),

          address:
            formData.address.trim(),

          // Preserve existing image
          profileImage:
            profile?.profileImage ||
            "",

        };


        console.log(
          "UPDATING CUSTOMER PROFILE:",
          updateData
        );


        // ---------------------------------------------
        // API
        // ---------------------------------------------

        const response =
          await updateCustomerProfile(
            updateData
          );


        console.log(
          "UPDATED CUSTOMER PROFILE RESPONSE:",
          response
        );


        const updatedUser =
          response?.data ||
          response;


        if (!updatedUser) {

          throw new Error(
            "Updated customer information was not returned by the server."
          );

        }


        // ---------------------------------------------
        // UPDATE PROFILE
        // ---------------------------------------------

        setProfile(
          updatedUser
        );


        // ---------------------------------------------
        // UPDATE FORM
        // ---------------------------------------------

        setFormData({

          firstName:
            updatedUser?.firstName ||
            updateData.firstName,

          lastName:
            updatedUser?.lastName ||
            updateData.lastName,

          email:
            updatedUser?.email ||
            updateData.email,

          mobile:
            updatedUser?.mobile ||
            updateData.mobile,

          address:
            updatedUser?.address ||
            updateData.address,

        });


        // ---------------------------------------------
        // UPDATE LOCAL STORAGE
        // ---------------------------------------------

        const oldUser =
          getLoggedInUser();


        const updatedLocalUser = {

          ...oldUser,

          ...updatedUser,

          id:
            updatedUser?.id ||
            oldUser?.id ||
            oldUser?.userId,

          userId:
            updatedUser?.id ||
            oldUser?.userId ||
            oldUser?.id,

        };


        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedLocalUser
          )
        );


        // ---------------------------------------------
        // EXIT EDIT MODE
        // ---------------------------------------------

        setEditing(false);

        setSuccess(
          "Profile updated successfully."
        );


      } catch (error) {

        console.error(
          "UPDATE CUSTOMER PROFILE ERROR:",
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

  const handleChooseImage =
    () => {

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

  const handleImageChange =
    async (event) => {

      const file =
        event.target.files?.[0];


      // ---------------------------------------------
      // RESET FILE INPUT
      // ---------------------------------------------

      event.target.value = "";


      if (!file) {
        return;
      }


      // ---------------------------------------------
      // VALIDATE IMAGE TYPE
      // ---------------------------------------------

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        setError(
          "Please select a valid image file."
        );

        return;

      }


      // ---------------------------------------------
      // ALLOWED TYPES
      // ---------------------------------------------

      const allowedTypes = [

        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",

      ];


      if (
        !allowedTypes.includes(
          file.type
        )
      ) {

        setError(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        );

        return;

      }


      // ---------------------------------------------
      // FILE SIZE
      // ---------------------------------------------

      const maxSize =
        5 * 1024 * 1024;


      if (
        file.size > maxSize
      ) {

        setError(
          "Image size must be less than 5 MB."
        );

        return;

      }


      // ---------------------------------------------
      // CREATE LOCAL PREVIEW
      // ---------------------------------------------

      const previewUrl =
        URL.createObjectURL(
          file
        );


      setImagePreview(
        previewUrl
      );

      setError("");

      setSuccess("");


      // ---------------------------------------------
      // UPLOAD
      // ---------------------------------------------

      try {

        setUploadingImage(
          true
        );


        const response =
          await uploadProfileImage(
            file
          );


        console.log(
          "PROFILE IMAGE UPLOAD RESPONSE:",
          response
        );


        const updatedUser =
          response?.data ||
          response;


        if (!updatedUser) {

          throw new Error(
            "Updated customer profile was not returned by the server."
          );

        }


        // -------------------------------------------
        // UPDATE PROFILE
        // -------------------------------------------

        setProfile(
          updatedUser
        );


        // -------------------------------------------
        // UPDATE FORM
        // -------------------------------------------

        setFormData({

          firstName:
            updatedUser?.firstName ||
            formData.firstName,

          lastName:
            updatedUser?.lastName ||
            formData.lastName,

          email:
            updatedUser?.email ||
            formData.email,

          mobile:
            updatedUser?.mobile ||
            formData.mobile,

          address:
            updatedUser?.address ||
            formData.address,

        });


        // -------------------------------------------
        // UPDATE LOCAL STORAGE
        // -------------------------------------------

        const oldUser =
          getLoggedInUser();


        const updatedLocalUser = {

          ...oldUser,

          ...updatedUser,

          id:
            updatedUser?.id ||
            oldUser?.id ||
            oldUser?.userId,

          userId:
            updatedUser?.id ||
            oldUser?.userId ||
            oldUser?.id,

        };


        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedLocalUser
          )
        );


        // -------------------------------------------
        // CLEAR TEMPORARY PREVIEW
        // -------------------------------------------

        setImagePreview("");


        setSuccess(
          "Profile image uploaded successfully."
        );


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

        setUploadingImage(
          false
        );

      }

    };


  // ===================================================
  // IMAGE ERROR
  // ===================================================

  const handleImageError =
    (event) => {

      event.currentTarget.style.display =
        "none";

    };


  // ===================================================
  // OPEN IMAGE PREVIEW
  // ===================================================

  const handleOpenPreview =
    () => {

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

  const handleClosePreview =
    () => {

      setPreviewOpen(false);

    };


  // ===================================================
  // LOADING SCREEN
  // ===================================================

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "70vh",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",
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
  // DISPLAY IMAGE
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

        backgroundColor:
          "#f5f7fb",

        p: {
          xs: 2,

          md: 4,
        },
      }}
    >

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          mb: 4,

          flexWrap:
            "wrap",

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
            Manage your customer account information
          </Typography>

        </Box>


        {/* REFRESH */}

        <Tooltip
          title="Refresh profile"
        >

          <IconButton
            onClick={
              fetchProfile
            }
            disabled={
              uploadingImage ||
              saving
            }
            sx={{
              backgroundColor:
                "#ffffff",

              border:
                "1px solid #e0e0e0",

              "&:hover": {
                backgroundColor:
                  "#f5f5f5",
              },
            }}
          >

            <Refresh />

          </IconButton>

        </Tooltip>

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
          onClose={() =>
            setError("")
          }
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
          onClose={() =>
            setSuccess("")
          }
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
      >

        {/* =================================================
            LEFT PROFILE CARD
        ================================================= */}

        <Grid
          size={{
            xs: 12,
            md: 5,
          }}
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

              {/* ===========================================
                  PROFILE IMAGE
              =========================================== */}

              <Box
                sx={{
                  display: "flex",

                  flexDirection:
                    "column",

                  alignItems:
                    "center",
                }}
              >

                <Box
                  sx={{
                    position:
                      "relative",

                    mb: 2,
                  }}
                >

                  {/* AVATAR */}

                  <Avatar
                    src={
                      displayedImage
                    }
                    alt={
                      `${profile?.firstName || ""} ${profile?.lastName || ""}`
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


                  {/* CAMERA BUTTON */}

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

                        bottom: 5,

                        right: 5,

                        width: 44,

                        height: 44,

                        backgroundColor:
                          "#1976d2",

                        color:
                          "#ffffff",

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


                {/* =========================================
                    HIDDEN FILE INPUT
                ========================================= */}

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  style={{
                    display: "none",
                  }}
                  onChange={
                    handleImageChange
                  }
                />


                {/* =========================================
                    CHANGE IMAGE BUTTON
                ========================================= */}

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

                    textTransform:
                      "none",
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


                {/* NAME */}

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


                {/* ROLE */}

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,

                    textTransform:
                      "uppercase",
                  }}
                >

                  {profile?.roleName ||
                    profile?.role?.name ||
                    "CUSTOMER"}

                </Typography>


                {/* STATUS + VERIFIED */}

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
                      icon={
                        <Verified />
                      }
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


              {/* ===========================================
                  ACCOUNT DETAILS
              =========================================== */}

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
                        "CUSTOMER"}
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
          size={{
            xs: 12,
            md: 7,
          }}
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

                  flexWrap:
                    "wrap",
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
                    View and update your customer account details
                  </Typography>

                </Box>


                {!editing && (

                  <Button
                    variant="contained"
                    startIcon={
                      <Edit />
                    }
                    onClick={
                      handleEdit
                    }
                    sx={{
                      textTransform:
                        "none",
                    }}
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


              {/* =========================================
                  FORM
              ========================================= */}

              <Grid
                container
                spacing={2.5}
              >

                {/* FIRST NAME */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
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
                    disabled={
                      !editing ||
                      saving
                    }
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
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
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
                    disabled={
                      !editing ||
                      saving
                    }
                  />

                </Grid>


                {/* EMAIL */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
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
                    disabled={
                      !editing ||
                      saving
                    }
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
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >

                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobile"
                    value={
                      formData.mobile
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editing ||
                      saving
                    }
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
                  size={{
                    xs: 12,
                  }}
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
                    disabled={
                      !editing ||
                      saving
                    }
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


              {/* =========================================
                  SAVE / CANCEL
              ========================================= */}

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
                    startIcon={
                      <Cancel />
                    }
                    onClick={
                      handleCancel
                    }
                    disabled={
                      saving
                    }
                    sx={{
                      textTransform:
                        "none",
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
                    disabled={
                      saving
                    }
                    sx={{
                      textTransform:
                        "none",
                    }}
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

                color:
                  "#1976d2",
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
                Upload a new customer profile image using
                the camera button above.
              </Typography>


              {profile?.profileImage && (

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,

                    wordBreak:
                      "break-all",
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

              alignItems:
                "center",
            }}
          >

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Customer Profile Image
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

            alignItems:
              "center",

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
            alt="Customer Profile"
            sx={{
              maxWidth:
                "100%",

              maxHeight:
                "60vh",

              borderRadius: 3,

              objectFit:
                "contain",
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


// =====================================================
// EXPORT
// =====================================================

export default CustomerProfile;