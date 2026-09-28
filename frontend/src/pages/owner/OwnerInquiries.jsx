import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Tooltip,
  InputAdornment,
  Stack,
} from "@mui/material";

import {
  Search,
  Refresh,
  Visibility,
  CheckCircle,
  Cancel,
  Close,
  Delete,
  Person,
  HomeWork,
  CalendarMonth,
  AttachMoney,
  Email,
  Phone,
  Message,
  LocationOn,
  ArrowBack,
} from "@mui/icons-material";

import {
  getOwnerInquiries,
  acceptInquiry,
  rejectInquiry,
  closeInquiry,
  deleteInquiry,
} from "../../api";

import { useNavigate } from "react-router-dom";


// =====================================================
// COMPONENT
// =====================================================

function OwnerInquiries() {

  const navigate = useNavigate();


  // =====================================================
  // USER
  // =====================================================

  const savedUser =
    localStorage.getItem("user");

  let user = {};

  try {

    user = savedUser
      ? JSON.parse(savedUser)
      : {};

  } catch (error) {

    console.error(
      "Unable to read user:",
      error
    );

  }


  const ownerId =
    user.userId ||
    user.id;


  // =====================================================
  // STATE
  // =====================================================

  const [inquiries, setInquiries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedInquiry, setSelectedInquiry] =
    useState(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [processingId, setProcessingId] =
    useState(null);


  // =====================================================
  // LOAD INQUIRIES
  // =====================================================

  const loadInquiries = async () => {

    if (!ownerId) {

      setError(
        "Owner information not found. Please login again."
      );

      setLoading(false);

      return;
    }


    try {

      setLoading(true);

      setError("");

      const response =
        await getOwnerInquiries(ownerId);


      console.log(
        "OWNER INQUIRIES RESPONSE:",
        response
      );


      const data =
        response?.data?.data ??
        response?.data ??
        [];


      setInquiries(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Owner inquiries error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load owner inquiries."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadInquiries();

  }, [ownerId]);


  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  useEffect(() => {

    if (!success) {
      return;
    }

    const timer =
      setTimeout(() => {
        setSuccess("");
      }, 3000);

    return () =>
      clearTimeout(timer);

  }, [success]);


  // =====================================================
  // STATUS COLOR
  // =====================================================

  const getStatusColor = (status) => {

    switch (status) {

      case "PENDING":
        return "warning";

      case "ACCEPTED":
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

      case "PENDING":
        return "Pending";

      case "ACCEPTED":
        return "Accepted";

      case "REJECTED":
        return "Rejected";

      case "CLOSED":
        return "Closed";

      default:
        return status || "Unknown";

    }

  };


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

    } catch (error) {

      return date;

    }

  };


  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {

    if (
      price === null ||
      price === undefined
    ) {
      return "N/A";
    }

    return `₹${Number(price).toLocaleString(
      "en-IN"
    )}`;

  };


  // =====================================================
  // FILTERED INQUIRIES
  // =====================================================

  const filteredInquiries = useMemo(() => {

    return inquiries.filter((inquiry) => {

      const searchText =
        search
          .toLowerCase()
          .trim();


      const matchesSearch =
        !searchText ||
        inquiry.propertyTitle
          ?.toLowerCase()
          .includes(searchText) ||
        inquiry.customerName
          ?.toLowerCase()
          .includes(searchText) ||
        inquiry.message
          ?.toLowerCase()
          .includes(searchText) ||
        inquiry.propertyAddress
          ?.toLowerCase()
          .includes(searchText);


      const matchesStatus =
        statusFilter === "ALL" ||
        inquiry.status === statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    inquiries,
    search,
    statusFilter,
  ]);


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalCount =
    inquiries.length;

  const pendingCount =
    inquiries.filter(
      (item) =>
        item.status === "PENDING"
    ).length;

  const acceptedCount =
    inquiries.filter(
      (item) =>
        item.status === "ACCEPTED"
    ).length;

  const rejectedCount =
    inquiries.filter(
      (item) =>
        item.status === "REJECTED"
    ).length;

  const closedCount =
    inquiries.filter(
      (item) =>
        item.status === "CLOSED"
    ).length;


  // =====================================================
  // OPEN DETAILS
  // =====================================================

  const handleView = (inquiry) => {

    setSelectedInquiry(inquiry);

    setDetailsOpen(true);

  };


  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const handleCloseDetails = () => {

    setDetailsOpen(false);

    setSelectedInquiry(null);

  };


  // =====================================================
  // ACCEPT
  // =====================================================

  const handleAccept = async (inquiryId) => {

    try {

      setProcessingId(inquiryId);

      setError("");

      await acceptInquiry(inquiryId);

      setSuccess(
        "Inquiry accepted successfully."
      );


      setDetailsOpen(false);

      setSelectedInquiry(null);


      await loadInquiries();

    } catch (err) {

      console.error(
        "Accept inquiry error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to accept inquiry."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // REJECT
  // =====================================================

  const handleReject = async (inquiryId) => {

    try {

      setProcessingId(inquiryId);

      setError("");

      await rejectInquiry(inquiryId);

      setSuccess(
        "Inquiry rejected successfully."
      );


      setDetailsOpen(false);

      setSelectedInquiry(null);


      await loadInquiries();

    } catch (err) {

      console.error(
        "Reject inquiry error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to reject inquiry."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // CLOSE INQUIRY
  // =====================================================

  const handleCloseInquiry = async (inquiryId) => {

    try {

      setProcessingId(inquiryId);

      setError("");

      await closeInquiry(inquiryId);

      setSuccess(
        "Inquiry closed successfully."
      );


      setDetailsOpen(false);

      setSelectedInquiry(null);


      await loadInquiries();

    } catch (err) {

      console.error(
        "Close inquiry error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to close inquiry."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (inquiryId) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this inquiry?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setProcessingId(inquiryId);

      setError("");

      await deleteInquiry(inquiryId);

      setSuccess(
        "Inquiry deleted successfully."
      );


      setDetailsOpen(false);

      setSelectedInquiry(null);


      await loadInquiries();

    } catch (err) {

      console.error(
        "Delete inquiry error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to delete inquiry."
      );

    } finally {

      setProcessingId(null);

    }

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
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <Box
          sx={{
            textAlign: "center",
          }}
        >

          <CircularProgress />

          <Typography
            sx={{
              mt: 2,
              color: "text.secondary",
            }}
          >
            Loading inquiries...
          </Typography>

        </Box>

      </Box>

    );

  }


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <Box>

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

        <Box>

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "#14213d",
            }}
          >
            Property Inquiries
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Manage inquiries received from your customers
          </Typography>

        </Box>


        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadInquiries}
        >
          Refresh
        </Button>

      </Box>


      {/* =================================================
          ALERTS
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


      {success && (

        <Alert
          severity="success"
          sx={{
            mb: 2,
          }}
          onClose={() =>
            setSuccess("")
          }
        >
          {success}
        </Alert>

      )}


      {/* =================================================
          STATISTICS
      ================================================= */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
        }}
      >

        {/* TOTAL */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 2.4,
          }}
        >

          <Card
            sx={{
              borderRadius: 3,
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >

            <CardContent>

              <Typography
                color="text.secondary"
                fontSize={13}
              >
                Total
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  mt: 1,
                }}
              >
                {totalCount}
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* PENDING */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 2.4,
          }}
        >

          <Card
            sx={{
              borderRadius: 3,
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >

            <CardContent>

              <Typography
                color="text.secondary"
                fontSize={13}
              >
                Pending
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  mt: 1,
                  color: "#ed6c02",
                }}
              >
                {pendingCount}
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* ACCEPTED */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 2.4,
          }}
        >

          <Card
            sx={{
              borderRadius: 3,
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >

            <CardContent>

              <Typography
                color="text.secondary"
                fontSize={13}
              >
                Accepted
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  mt: 1,
                  color: "#2e7d32",
                }}
              >
                {acceptedCount}
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* REJECTED */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 2.4,
          }}
        >

          <Card
            sx={{
              borderRadius: 3,
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >

            <CardContent>

              <Typography
                color="text.secondary"
                fontSize={13}
              >
                Rejected
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  mt: 1,
                  color: "#d32f2f",
                }}
              >
                {rejectedCount}
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* CLOSED */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 2.4,
          }}
        >

          <Card
            sx={{
              borderRadius: 3,
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >

            <CardContent>

              <Typography
                color="text.secondary"
                fontSize={13}
              >
                Closed
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  mt: 1,
                  color: "#616161",
                }}
              >
                {closedCount}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* =================================================
          FILTER BAR
      ================================================= */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.06)",
        }}
      >

        <CardContent>

          <Grid
            container
            spacing={2}
            alignItems="center"
          >

            <Grid
              size={{
                xs: 12,
                md: 8,
              }}
            >

              <TextField
                fullWidth
                placeholder="Search property, customer or message..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />

            </Grid>


            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >

              <TextField
                select
                fullWidth
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >

                <MenuItem value="ALL">
                  All Statuses
                </MenuItem>

                <MenuItem value="PENDING">
                  Pending
                </MenuItem>

                <MenuItem value="ACCEPTED">
                  Accepted
                </MenuItem>

                <MenuItem value="REJECTED">
                  Rejected
                </MenuItem>

                <MenuItem value="CLOSED">
                  Closed
                </MenuItem>

              </TextField>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filteredInquiries.length === 0 && (

        <Card
          sx={{
            borderRadius: 3,
            textAlign: "center",
            py: 8,
          }}
        >

          <Message
            sx={{
              fontSize: 60,
              color: "#b0b7c3",
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            No inquiries found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            {inquiries.length === 0
              ? "You have not received any property inquiries yet."
              : "No inquiries match your current search or filter."
            }
          </Typography>

        </Card>

      )}


      {/* =================================================
          INQUIRY CARDS
      ================================================= */}

      <Grid
        container
        spacing={3}
      >

        {filteredInquiries.map((inquiry) => (

          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 4,
            }}
            key={inquiry.id}
          >

            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                boxShadow:
                  "0 5px 18px rgba(0,0,0,0.08)",
                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                  transform:
                    "translateY(-4px)",
                  boxShadow:
                    "0 10px 25px rgba(0,0,0,0.12)",
                },
              }}
            >

              {/* PROPERTY HEADER */}

              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #14213d, #3769e8)",
                  color: "white",
                  p: 2.5,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 1,
                    alignItems:
                      "flex-start",
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.2,
                    }}
                  >

                    <HomeWork />

                    <Typography
                      fontWeight="bold"
                      sx={{
                        lineHeight: 1.3,
                      }}
                    >
                      {inquiry.propertyTitle ||
                        "Property"}
                    </Typography>

                  </Box>


                  <Chip
                    label={getStatusLabel(
                      inquiry.status
                    )}
                    color={getStatusColor(
                      inquiry.status
                    )}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                    }}
                  />

                </Box>

              </Box>


              <CardContent
                sx={{
                  flex: 1,
                }}
              >

                {/* CUSTOMER */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >

                  <Person
                    color="action"
                  />

                  <Box>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      Customer
                    </Typography>

                    <Typography
                      fontWeight="bold"
                    >
                      {inquiry.customerName ||
                        "Unknown Customer"}
                    </Typography>

                  </Box>

                </Box>


                {/* ADDRESS */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "flex-start",
                    gap: 1.5,
                    mb: 2,
                  }}
                >

                  <LocationOn
                    color="action"
                    fontSize="small"
                  />

                  <Box>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      Property Address
                    </Typography>

                    <Typography
                      fontSize={14}
                    >
                      {inquiry.propertyAddress ||
                        "Address not available"}
                    </Typography>

                  </Box>

                </Box>


                {/* PRICE */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >

                  <AttachMoney
                    color="action"
                  />

                  <Box>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      Property Price
                    </Typography>

                    <Typography
                      fontWeight="bold"
                    >
                      {formatPrice(
                        inquiry.propertyPrice
                      )}
                    </Typography>

                  </Box>

                </Box>


                {/* MESSAGE */}

                <Box
                  sx={{
                    backgroundColor:
                      "#f5f7fb",
                    borderRadius: 2,
                    p: 1.5,
                    mb: 2,
                  }}
                >

                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    sx={{
                      mb: 0.5,
                    }}
                  >
                    Message
                  </Typography>

                  <Typography
                    fontSize={14}
                    sx={{
                      display:
                        "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient:
                        "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {inquiry.message ||
                      "No message"}
                  </Typography>

                </Box>


                {/* DATE */}

                <Typography
                  fontSize={12}
                  color="text.secondary"
                >
                  Received:{" "}
                  {formatDate(
                    inquiry.createdAt
                  )}
                </Typography>

              </CardContent>


              <Divider />


              {/* ACTIONS */}

              <Box
                sx={{
                  p: 1.5,
                  display: "flex",
                  gap: 1,
                  alignItems:
                    "center",
                }}
              >

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() =>
                    handleView(inquiry)
                  }
                >
                  View
                </Button>


                {inquiry.status ===
                  "PENDING" && (

                  <>

                    <Tooltip title="Accept">

                      <IconButton
                        color="success"
                        onClick={() =>
                          handleAccept(
                            inquiry.id
                          )
                        }
                        disabled={
                          processingId ===
                          inquiry.id
                        }
                      >
                        <CheckCircle />
                      </IconButton>

                    </Tooltip>


                    <Tooltip title="Reject">

                      <IconButton
                        color="error"
                        onClick={() =>
                          handleReject(
                            inquiry.id
                          )
                        }
                        disabled={
                          processingId ===
                          inquiry.id
                        }
                      >
                        <Cancel />
                      </IconButton>

                    </Tooltip>

                  </>

                )}


                {inquiry.status ===
                  "ACCEPTED" && (

                  <Tooltip title="Close Inquiry">

                    <IconButton
                      color="warning"
                      onClick={() =>
                        handleCloseInquiry(
                          inquiry.id
                        )
                      }
                      disabled={
                        processingId ===
                        inquiry.id
                      }
                    >
                      <Close />
                    </IconButton>

                  </Tooltip>

                )}


                <Tooltip title="Delete">

                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDelete(
                        inquiry.id
                      )
                    }
                    disabled={
                      processingId ===
                      inquiry.id
                    }
                  >
                    <Delete />
                  </IconButton>

                </Tooltip>

              </Box>

            </Card>

          </Grid>

        ))}

      </Grid>


      {/* =================================================
          DETAILS DIALOG
      ================================================= */}

      <Dialog
        open={detailsOpen}
        onClose={
          handleCloseDetails
        }
        fullWidth
        maxWidth="md"
      >

        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >

          <Box>
            Inquiry Details
          </Box>

          <IconButton
            onClick={
              handleCloseDetails
            }
          >
            <Close />
          </IconButton>

        </DialogTitle>


        {selectedInquiry && (

          <DialogContent dividers>

            {/* =================================================
                PROPERTY
            ================================================= */}

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mb: 2,
              }}
            >
              Property Information
            </Typography>


            <Grid
              container
              spacing={2}
              sx={{
                mb: 3,
              }}
            >

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                  }}
                >

                  <HomeWork color="primary" />

                  <Box>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      Property
                    </Typography>

                    <Typography
                      fontWeight="bold"
                    >
                      {selectedInquiry.propertyTitle ||
                        "N/A"}
                    </Typography>

                  </Box>

                </Box>

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                  }}
                >

                  <AttachMoney
                    color="primary"
                  />

                  <Box>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      Price
                    </Typography>

                    <Typography
                      fontWeight="bold"
                    >
                      {formatPrice(
                        selectedInquiry.propertyPrice
                      )}
                    </Typography>

                  </Box>

                </Box>

              </Grid>


              <Grid
                size={12}
              >

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                  }}
                >

                  <LocationOn
                    color="primary"
                  />

                  <Box>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      Address
                    </Typography>

                    <Typography>
                      {selectedInquiry.propertyAddress ||
                        "N/A"}
                    </Typography>

                  </Box>

                </Box>

              </Grid>

            </Grid>


            <Divider
              sx={{
                mb: 3,
              }}
            />


            {/* =================================================
                CUSTOMER
            ================================================= */}

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mb: 2,
              }}
            >
              Customer Information
            </Typography>


            <Grid
              container
              spacing={2}
              sx={{
                mb: 3,
              }}
            >

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                  }}
                >

                  <Person color="primary" />

                  <Box>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      Customer Name
                    </Typography>

                    <Typography
                      fontWeight="bold"
                    >
                      {selectedInquiry.customerName ||
                        "N/A"}
                    </Typography>

                  </Box>

                </Box>

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                  }}
                >

                  <Person color="primary" />

                  <Box>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      Customer ID
                    </Typography>

                    <Typography>
                      {selectedInquiry.customerId ||
                        "N/A"}
                    </Typography>

                  </Box>

                </Box>

              </Grid>

            </Grid>


            <Divider
              sx={{
                mb: 3,
              }}
            />


            {/* =================================================
                INQUIRY
            ================================================= */}

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mb: 2,
              }}
            >
              Inquiry Information
            </Typography>


            <Box
              sx={{
                backgroundColor:
                  "#f5f7fb",
                borderRadius: 2,
                p: 2,
                mb: 2,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                }}
              >

                <Message color="primary" />

                <Box>

                  <Typography
                    fontSize={12}
                    color="text.secondary"
                  >
                    Customer Message
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {selectedInquiry.message ||
                      "No message"}
                  </Typography>

                </Box>

              </Box>

            </Box>


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
            >

              <Chip
                label={getStatusLabel(
                  selectedInquiry.status
                )}
                color={getStatusColor(
                  selectedInquiry.status
                )}
                sx={{
                  fontWeight: "bold",
                }}
              />


              <Typography
                fontSize={13}
                color="text.secondary"
              >
                Received:{" "}
                {formatDate(
                  selectedInquiry.createdAt
                )}
              </Typography>

            </Stack>

          </DialogContent>

        )}


        <DialogActions
          sx={{
            p: 2,
            gap: 1,
            flexWrap: "wrap",
          }}
        >

          {selectedInquiry?.status ===
            "PENDING" && (

            <>

              <Button
                variant="contained"
                color="success"
                startIcon={
                  <CheckCircle />
                }
                onClick={() =>
                  handleAccept(
                    selectedInquiry.id
                  )
                }
                disabled={
                  processingId ===
                  selectedInquiry.id
                }
              >
                Accept
              </Button>


              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={() =>
                  handleReject(
                    selectedInquiry.id
                  )
                }
                disabled={
                  processingId ===
                  selectedInquiry.id
                }
              >
                Reject
              </Button>

            </>

          )}


          {selectedInquiry?.status ===
            "ACCEPTED" && (

            <Button
              variant="contained"
              color="warning"
              startIcon={<Close />}
              onClick={() =>
                handleCloseInquiry(
                  selectedInquiry.id
                )
              }
              disabled={
                processingId ===
                selectedInquiry.id
              }
            >
              Close Inquiry
            </Button>

          )}


          {selectedInquiry && (

            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() =>
                handleDelete(
                  selectedInquiry.id
                )
              }
              disabled={
                processingId ===
                selectedInquiry.id
              }
            >
              Delete
            </Button>

          )}


          <Button
            variant="outlined"
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


export default OwnerInquiries;