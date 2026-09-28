import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  ArrowBack,
  Refresh,
  ReportProblem,
  Visibility,
  Close,
  Home,
  Person,
  CalendarMonth,
  AdminPanelSettings,
  Description,
} from "@mui/icons-material";

import {
  getOwnerComplaints,
} from "../../api";


// =====================================================
// OWNER COMPLAINTS
// =====================================================

function OwnerComplaints() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);


  // =====================================================
  // GET OWNER ID
  // =====================================================

  const getOwnerId = () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const user =
        JSON.parse(storedUser);

      return (
        user.userId ||
        user.id ||
        user._id ||
        null
      );

    } catch (error) {

      console.error(
        "Failed to read logged-in user:",
        error
      );

      return null;
    }
  };


  // =====================================================
  // FETCH OWNER COMPLAINTS
  // =====================================================

  const fetchComplaints = async () => {

    try {

      setLoading(true);

      setError("");

      const ownerId =
        getOwnerId();


      if (!ownerId) {

        setError(
          "Owner information not found. Please login again."
        );

        return;
      }


      console.log(
        "OWNER COMPLAINTS OWNER ID:",
        ownerId
      );


      const response =
        await getOwnerComplaints(
          ownerId
        );


      console.log(
        "OWNER COMPLAINTS RESPONSE:",
        response
      );


      if (response?.success) {

        setComplaints(
          response.data || []
        );

      } else {

        setError(
          response?.message ||
          "Failed to load complaints."
        );
      }

    } catch (error) {

      console.error(
        "OWNER COMPLAINTS ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load complaints."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchComplaints();

  }, []);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    try {

      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    } catch {

      return date;
    }
  };


  // =====================================================
  // STATUS CONFIG
  // =====================================================

  const getStatusColor = (status) => {

    switch (status) {

      case "PENDING":
        return "warning";

      case "UNDER_REVIEW":
        return "info";

      case "RESOLVED":
        return "success";

      case "REJECTED":
        return "error";

      case "CLOSED":
        return "default";

      default:
        return "default";
    }
  };


  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel = (status) => {

    switch (status) {

      case "UNDER_REVIEW":
        return "Under Review";

      case "PENDING":
        return "Pending";

      case "RESOLVED":
        return "Resolved";

      case "REJECTED":
        return "Rejected";

      case "CLOSED":
        return "Closed";

      default:
        return status || "Unknown";
    }
  };


  // =====================================================
  // OPEN DETAILS
  // =====================================================

  const handleViewDetails = (complaint) => {

    setSelectedComplaint(
      complaint
    );

    setDetailsOpen(true);
  };


  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const handleCloseDetails = () => {

    setDetailsOpen(false);

    setSelectedComplaint(null);
  };


  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const totalComplaints =
    complaints.length;

  const pendingComplaints =
    complaints.filter(
      complaint =>
        complaint.status === "PENDING"
    ).length;

  const underReviewComplaints =
    complaints.filter(
      complaint =>
        complaint.status === "UNDER_REVIEW"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      complaint =>
        complaint.status === "RESOLVED"
    ).length;


  // =====================================================
  // LOADING
  // =====================================================

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
          alignItems="center"
          spacing={2}
        >

          <CircularProgress />

          <Typography
            color="text.secondary"
          >
            Loading complaints...
          </Typography>

        </Stack>

      </Box>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <Box
      sx={{
        p: {
          xs: 2,
          md: 4,
        },

        backgroundColor: "#f5f7fb",

        minHeight: "100vh",
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
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Complaints
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Complaints raised against your properties
          </Typography>

        </Box>


        <Stack
          direction="row"
          spacing={1}
        >

          <Tooltip title="Refresh complaints">

            <IconButton
              onClick={fetchComplaints}
              sx={{
                backgroundColor: "white",
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
          SUMMARY CARDS
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >

        {/* TOTAL */}

        <Card
          sx={{
            borderRadius: 3,
          }}
        >

          <CardContent>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >

              <Avatar
                sx={{
                  bgcolor: "#e3f2fd",
                  color: "#1976d2",
                }}
              >
                <ReportProblem />
              </Avatar>

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  {totalComplaints}
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  Total Complaints
                </Typography>

              </Box>

            </Stack>

          </CardContent>

        </Card>


        {/* PENDING */}

        <Card
          sx={{
            borderRadius: 3,
          }}
        >

          <CardContent>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >

              <Avatar
                sx={{
                  bgcolor: "#fff3e0",
                  color: "#f57c00",
                }}
              >
                <ReportProblem />
              </Avatar>

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  {pendingComplaints}
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  Pending
                </Typography>

              </Box>

            </Stack>

          </CardContent>

        </Card>


        {/* UNDER REVIEW */}

        <Card
          sx={{
            borderRadius: 3,
          }}
        >

          <CardContent>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >

              <Avatar
                sx={{
                  bgcolor: "#e8eaf6",
                  color: "#3f51b5",
                }}
              >
                <ReportProblem />
              </Avatar>

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  {underReviewComplaints}
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  Under Review
                </Typography>

              </Box>

            </Stack>

          </CardContent>

        </Card>


        {/* RESOLVED */}

        <Card
          sx={{
            borderRadius: 3,
          }}
        >

          <CardContent>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >

              <Avatar
                sx={{
                  bgcolor: "#e8f5e9",
                  color: "#2e7d32",
                }}
              >
                <ReportProblem />
              </Avatar>

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  {resolvedComplaints}
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  Resolved
                </Typography>

              </Box>

            </Stack>

          </CardContent>

        </Card>

      </Box>


      {/* =================================================
          NO COMPLAINTS
      ================================================= */}

      {complaints.length === 0 ? (

        <Card
          sx={{
            borderRadius: 3,
            textAlign: "center",
            py: 8,
          }}
        >

          <CardContent>

            <ReportProblem
              sx={{
                fontSize: 65,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={600}
            >
              No Complaints
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
              }}
            >
              No complaints have been raised
              against your properties.
            </Typography>

          </CardContent>

        </Card>

      ) : (

        /* =================================================
           COMPLAINT LIST
        ================================================= */

        <Stack spacing={3}>

          {complaints.map(
            (complaint) => (

              <Card
                key={complaint.id}
                sx={{
                  borderRadius: 3,
                  boxShadow:
                    "0 4px 16px rgba(0,0,0,0.06)",
                }}
              >

                <CardContent>

                  {/* ======================================
                      HEADER
                  ====================================== */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >

                      <Avatar
                        sx={{
                          bgcolor: "#ffebee",
                          color: "#d32f2f",
                        }}
                      >

                        <ReportProblem />

                      </Avatar>


                      <Box>

                        <Typography
                          variant="h6"
                          fontWeight={700}
                        >
                          {complaint.title ||
                            "Complaint"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Created{" "}
                          {formatDate(
                            complaint.createdAt
                          )}
                        </Typography>

                      </Box>

                    </Box>


                    <Chip
                      label={
                        getStatusLabel(
                          complaint.status
                        )
                      }
                      color={
                        getStatusColor(
                          complaint.status
                        )
                      }
                      size="small"
                    />

                  </Box>


                  <Divider
                    sx={{
                      my: 2,
                    }}
                  />


                  {/* ======================================
                      PROPERTY
                  ====================================== */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >

                    <Home
                      fontSize="small"
                      color="action"
                    />

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      Property ID:
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {complaint.propertyId ||
                        "N/A"}
                    </Typography>

                  </Box>


                  {/* ======================================
                      CUSTOMER
                  ====================================== */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >

                    <Person
                      fontSize="small"
                      color="action"
                    />

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      Raised By:
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {complaint.userId ||
                        "N/A"}
                    </Typography>

                  </Box>


                  {/* ======================================
                      DESCRIPTION
                  ====================================== */}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {complaint.description ||
                      "No description provided."}
                  </Typography>


                  {/* ======================================
                      ADMIN REMARK
                  ====================================== */}

                  {complaint.adminRemark && (

                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#f8f9fa",
                        borderLeft:
                          "4px solid #1976d2",
                      }}
                    >

                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          mb: 0.5,
                        }}
                      >
                        Admin Remark
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {complaint.adminRemark}
                      </Typography>

                    </Box>
                  )}


                  {/* ======================================
                      ACTION
                  ====================================== */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 3,
                    }}
                  >

                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() =>
                        handleViewDetails(
                          complaint
                        )
                      }
                    >
                      View Details
                    </Button>

                  </Box>

                </CardContent>

              </Card>

            )
          )}

        </Stack>

      )}


      {/* =================================================
          DETAILS DIALOG
      ================================================= */}

      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
      >

        <DialogTitle>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Complaint Details
            </Typography>

            <IconButton
              onClick={
                handleCloseDetails
              }
            >

              <Close />

            </IconButton>

          </Box>

        </DialogTitle>


        <DialogContent dividers>

          {selectedComplaint && (

            <Stack spacing={3}>

              {/* TITLE */}

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0.5,
                  }}
                >
                  Complaint Title
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {selectedComplaint.title ||
                    "N/A"}
                </Typography>

              </Box>


              {/* STATUS */}

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0.8,
                  }}
                >
                  Status
                </Typography>

                <Chip
                  label={
                    getStatusLabel(
                      selectedComplaint.status
                    )
                  }
                  color={
                    getStatusColor(
                      selectedComplaint.status
                    )
                  }
                />

              </Box>


              {/* PROPERTY */}

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0.5,
                  }}
                >
                  Property ID
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >

                  <Home
                    fontSize="small"
                  />

                  <Typography>
                    {selectedComplaint.propertyId ||
                      "N/A"}
                  </Typography>

                </Stack>

              </Box>


              {/* CUSTOMER */}

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0.5,
                  }}
                >
                  Complaint Raised By
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >

                  <Person
                    fontSize="small"
                  />

                  <Typography
                    sx={{
                      wordBreak: "break-all",
                    }}
                  >
                    {selectedComplaint.userId ||
                      "N/A"}
                  </Typography>

                </Stack>

              </Box>


              {/* DATE */}

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0.5,
                  }}
                >
                  Created At
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >

                  <CalendarMonth
                    fontSize="small"
                  />

                  <Typography>
                    {formatDate(
                      selectedComplaint.createdAt
                    )}
                  </Typography>

                </Stack>

              </Box>


              {/* DESCRIPTION */}

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0.8,
                  }}
                >
                  Description
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f5f7fb",
                  }}
                >

                  <Typography
                    sx={{
                      lineHeight: 1.7,
                    }}
                  >
                    {selectedComplaint.description ||
                      "No description provided."}
                  </Typography>

                </Box>

              </Box>


              {/* ADMIN REMARK */}

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0.8,
                  }}
                >
                  Admin Remark
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#e3f2fd",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                  >

                    <AdminPanelSettings
                      color="primary"
                      fontSize="small"
                    />

                    <Typography
                      sx={{
                        lineHeight: 1.7,
                      }}
                    >
                      {selectedComplaint.adminRemark ||
                        "No admin remark yet."}
                    </Typography>

                  </Stack>

                </Box>

              </Box>


              {/* UPDATED DATE */}

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0.5,
                  }}
                >
                  Last Updated
                </Typography>

                <Typography>
                  {formatDate(
                    selectedComplaint.updatedAt
                  )}
                </Typography>

              </Box>

            </Stack>

          )}

        </DialogContent>


        <DialogActions>

          <Button
            onClick={
              handleCloseDetails
            }
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}


export default OwnerComplaints;