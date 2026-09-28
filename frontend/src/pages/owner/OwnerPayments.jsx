import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  Payment as PaymentIcon,
  Visibility,
  Refresh,
  CheckCircle,
  Cancel,
  Replay,
  Error,
} from "@mui/icons-material";

import {
  getOwnerPayments,
  getPaymentById,
  successPayment,
  failedPayment,
  cancelPayment,
  refundPayment,
} from "../../api";


// =====================================================
// OWNER PAYMENTS
// =====================================================

function OwnerPayments() {

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

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [actionError, setActionError] =
    useState("");

  const [actionSuccess, setActionSuccess] =
    useState("");


  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  const loadPayments = async () => {

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
        await getOwnerPayments(ownerId);


      console.log(
        "OWNER PAYMENTS RESPONSE:",
        response
      );


      const data =
        response?.data?.data ??
        response?.data ??
        [];


      setPayments(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Owner payments error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load owner payments."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadPayments();

  }, [ownerId]);


  // =====================================================
  // VIEW PAYMENT
  // =====================================================

  const handleViewPayment = async (paymentId) => {

    try {

      setActionError("");

      setActionSuccess("");

      const response =
        await getPaymentById(paymentId);


      console.log(
        "PAYMENT DETAILS RESPONSE:",
        response
      );


      const data =
        response?.data?.data ??
        response?.data;


      setSelectedPayment(data);

      setDetailsOpen(true);

    } catch (err) {

      console.error(
        "Payment details error:",
        err
      );

      setActionError(
        err?.response?.data?.message ||
        "Failed to load payment details."
      );

    }

  };


  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const handleCloseDetails = () => {

    setDetailsOpen(false);

    setSelectedPayment(null);

    setActionError("");

  };


  // =====================================================
  // PAYMENT ACTION
  // =====================================================

  const handlePaymentAction =
    async (
      paymentId,
      action
    ) => {

      try {

        setActionLoading(true);

        setActionError("");

        setActionSuccess("");


        let response;


        if (action === "success") {

          response =
            await successPayment(
              paymentId
            );

        }

        else if (action === "failed") {

          response =
            await failedPayment(
              paymentId
            );

        }

        else if (action === "cancel") {

          response =
            await cancelPayment(
              paymentId
            );

        }

        else if (action === "refund") {

          response =
            await refundPayment(
              paymentId
            );

        }


        console.log(
          "PAYMENT ACTION RESPONSE:",
          response
        );


        setActionSuccess(
          response?.data?.message ||
          "Payment updated successfully."
        );


        await loadPayments();


        if (selectedPayment?.id === paymentId) {

          const updatedResponse =
            await getPaymentById(
              paymentId
            );


          const updatedPayment =
            updatedResponse?.data?.data ??
            updatedResponse?.data;


          setSelectedPayment(
            updatedPayment
          );

        }

      } catch (err) {

        console.error(
          "Payment action error:",
          err
        );

        setActionError(
          err?.response?.data?.message ||
          "Unable to update payment."
        );

      } finally {

        setActionLoading(false);

      }

    };


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {

    if (
      amount === null ||
      amount === undefined
    ) {

      return "₹0";

    }

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(amount);

  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {

      return "-";

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
  // STATUS COLOR
  // =====================================================

  const getStatusColor = (status) => {

    switch (status) {

      case "SUCCESS":
        return "success";

      case "PENDING":
        return "warning";

      case "FAILED":
        return "error";

      case "CANCELLED":
        return "default";

      case "REFUNDED":
        return "info";

      default:
        return "default";

    }

  };


  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments =
    payments.filter((payment) => {

      const searchText =
        search
          .toLowerCase()
          .trim();


      const matchesSearch =
        !searchText ||
        payment.customerName
          ?.toLowerCase()
          .includes(searchText) ||
        payment.bookingId
          ?.toLowerCase()
          .includes(searchText) ||
        payment.transactionId
          ?.toLowerCase()
          .includes(searchText) ||
        payment.id
          ?.toLowerCase()
          .includes(searchText);


      const matchesStatus =
        statusFilter === "ALL" ||
        payment.status === statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    });


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalPayments =
    payments.length;


  const successfulPayments =
    payments.filter(
      payment =>
        payment.status === "SUCCESS"
    );


  const pendingPayments =
    payments.filter(
      payment =>
        payment.status === "PENDING"
    );


  const refundedPayments =
    payments.filter(
      payment =>
        payment.status === "REFUNDED"
    );


  const totalReceived =
    successfulPayments.reduce(
      (total, payment) =>
        total +
        Number(payment.amount || 0),
      0
    );


  const totalPending =
    pendingPayments.reduce(
      (total, payment) =>
        total +
        Number(payment.amount || 0),
      0
    );


  const totalRefunded =
    refundedPayments.reduce(
      (total, payment) =>
        total +
        Number(payment.amount || 0),
      0
    );


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
        }}
      >

        <CircularProgress />

      </Box>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <Box>

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          mb: 4,
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
            Owner Payments
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            View and manage payments received
            for your properties.
          </Typography>

        </Box>


        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadPayments}
        >
          Refresh
        </Button>

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
          SUCCESS / ACTION MESSAGE
      ================================================= */}

      {actionSuccess && (

        <Alert
          severity="success"
          onClose={() =>
            setActionSuccess("")
          }
          sx={{
            mb: 3,
          }}
        >
          {actionSuccess}
        </Alert>

      )}


      {/* =================================================
          STATISTICS
      ================================================= */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 4,
        }}
      >

        {/* TOTAL */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <Card
            sx={{
              borderRadius: 3,
              height: "100%",
            }}
          >

            <CardContent>

              <PaymentIcon
                sx={{
                  fontSize: 35,
                  color: "#3769e8",
                  mb: 1,
                }}
              />

              <Typography
                color="text.secondary"
                fontSize={14}
              >
                Total Payments
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
              >
                {totalPayments}
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* RECEIVED */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <Card
            sx={{
              borderRadius: 3,
              height: "100%",
            }}
          >

            <CardContent>

              <CheckCircle
                sx={{
                  fontSize: 35,
                  color: "#2e7d32",
                  mb: 1,
                }}
              />

              <Typography
                color="text.secondary"
                fontSize={14}
              >
                Successful Amount
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                color="success.main"
              >
                {formatCurrency(
                  totalReceived
                )}
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* PENDING */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <Card
            sx={{
              borderRadius: 3,
              height: "100%",
            }}
          >

            <CardContent>

              <Error
                sx={{
                  fontSize: 35,
                  color: "#ed6c02",
                  mb: 1,
                }}
              />

              <Typography
                color="text.secondary"
                fontSize={14}
              >
                Pending Amount
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                color="warning.main"
              >
                {formatCurrency(
                  totalPending
                )}
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* REFUNDED */}

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <Card
            sx={{
              borderRadius: 3,
              height: "100%",
            }}
          >

            <CardContent>

              <Replay
                sx={{
                  fontSize: 35,
                  color: "#0288d1",
                  mb: 1,
                }}
              />

              <Typography
                color="text.secondary"
                fontSize={14}
              >
                Refunded Amount
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                color="info.main"
              >
                {formatCurrency(
                  totalRefunded
                )}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* =================================================
          FILTERS
      ================================================= */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
        }}
      >

        <CardContent>

          <Grid
            container
            spacing={2}
            alignItems="center"
          >

            <Grid
              item
              xs={12}
              md={8}
            >

              <TextField
                fullWidth
                label="Search Payments"
                placeholder="Customer, booking ID, transaction ID..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                select
                fullWidth
                label="Payment Status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >

                <MenuItem value="ALL">
                  All Statuses
                </MenuItem>

                <MenuItem value="PENDING">
                  Pending
                </MenuItem>

                <MenuItem value="SUCCESS">
                  Success
                </MenuItem>

                <MenuItem value="FAILED">
                  Failed
                </MenuItem>

                <MenuItem value="CANCELLED">
                  Cancelled
                </MenuItem>

                <MenuItem value="REFUNDED">
                  Refunded
                </MenuItem>

              </TextField>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =================================================
          PAYMENTS TABLE
      ================================================= */}

      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >

        <Box
          sx={{
            p: 3,
          }}
        >

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Payment History
          </Typography>

          <Typography
            color="text.secondary"
            fontSize={14}
          >
            {filteredPayments.length}
            {" "}
            payment(s) found
          </Typography>

        </Box>


        <Divider />


        {filteredPayments.length === 0 ? (

          <Box
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >

            <PaymentIcon
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
              No payments found
            </Typography>

            <Typography
              color="text.secondary"
            >
              Payment records will appear here
              when customers make payments.
            </Typography>

          </Box>

        ) : (

          <TableContainer
            component={Paper}
            elevation={0}
          >

            <Table>

              <TableHead>

                <TableRow
                  sx={{
                    backgroundColor:
                      "#f8fafc",
                  }}
                >

                  <TableCell>
                    <b>Customer</b>
                  </TableCell>

                  <TableCell>
                    <b>Booking ID</b>
                  </TableCell>

                  <TableCell>
                    <b>Amount</b>
                  </TableCell>

                  <TableCell>
                    <b>Method</b>
                  </TableCell>

                  <TableCell>
                    <b>Status</b>
                  </TableCell>

                  <TableCell>
                    <b>Date</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Action</b>
                  </TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {filteredPayments.map(
                  (payment) => (

                    <TableRow
                      key={payment.id}
                      hover
                    >

                      <TableCell>

                        <Typography
                          fontWeight={600}
                        >
                          {payment.customerName ||
                            "Customer"}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {payment.customerId}
                        </Typography>

                      </TableCell>


                      <TableCell>

                        <Typography
                          fontSize={13}
                          sx={{
                            wordBreak:
                              "break-all",
                          }}
                        >
                          {payment.bookingId ||
                            "-"}
                        </Typography>

                      </TableCell>


                      <TableCell>

                        <Typography
                          fontWeight="bold"
                        >
                          {formatCurrency(
                            payment.amount
                          )}
                        </Typography>

                      </TableCell>


                      <TableCell>

                        <Chip
                          label={
                            payment.paymentMethod ||
                            "-"
                          }
                          size="small"
                          variant="outlined"
                        />

                      </TableCell>


                      <TableCell>

                        <Chip
                          label={
                            payment.status ||
                            "UNKNOWN"
                          }
                          size="small"
                          color={getStatusColor(
                            payment.status
                          )}
                        />

                      </TableCell>


                      <TableCell>

                        {formatDate(
                          payment.createdAt
                        )}

                      </TableCell>


                      <TableCell align="center">

                        <Tooltip
                          title="View Payment"
                        >

                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleViewPayment(
                                payment.id
                              )
                            }
                          >

                            <Visibility />

                          </IconButton>

                        </Tooltip>

                      </TableCell>

                    </TableRow>

                  )
                )}

              </TableBody>

            </Table>

          </TableContainer>

        )}

      </Card>


      {/* =================================================
          PAYMENT DETAILS DIALOG
      ================================================= */}

      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
      >

        <DialogTitle
          sx={{
            fontWeight: "bold",
          }}
        >
          Payment Details
        </DialogTitle>


        <DialogContent dividers>

          {actionError && (

            <Alert
              severity="error"
              sx={{
                mb: 2,
              }}
            >
              {actionError}
            </Alert>

          )}


          {selectedPayment && (

            <Box>

              {/* STATUS */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  {formatCurrency(
                    selectedPayment.amount
                  )}
                </Typography>

                <Chip
                  label={
                    selectedPayment.status
                  }
                  color={getStatusColor(
                    selectedPayment.status
                  )}
                />

              </Box>


              <Grid
                container
                spacing={2}
              >

                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                  >
                    Payment ID
                  </Typography>

                  <Typography
                    fontWeight={600}
                    sx={{
                      wordBreak:
                        "break-all",
                    }}
                  >
                    {selectedPayment.id}
                  </Typography>

                </Grid>


                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                  >
                    Booking ID
                  </Typography>

                  <Typography
                    fontWeight={600}
                    sx={{
                      wordBreak:
                        "break-all",
                    }}
                  >
                    {selectedPayment.bookingId}
                  </Typography>

                </Grid>


                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                  >
                    Customer
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {selectedPayment.customerName ||
                      "-"}
                  </Typography>

                </Grid>


                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                  >
                    Customer ID
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {selectedPayment.customerId ||
                      "-"}
                  </Typography>

                </Grid>


                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                  >
                    Owner
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {selectedPayment.ownerName ||
                      "-"}
                  </Typography>

                </Grid>


                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                  >
                    Payment Method
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {selectedPayment.paymentMethod ||
                      "-"}
                  </Typography>

                </Grid>


                <Grid
                  item
                  xs={12}
                >

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                  >
                    Transaction ID
                  </Typography>

                  <Typography
                    fontWeight={600}
                    sx={{
                      wordBreak:
                        "break-all",
                    }}
                  >
                    {selectedPayment.transactionId ||
                      "Not generated"}
                  </Typography>

                </Grid>


                <Grid
                  item
                  xs={12}
                >

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                  >
                    Description
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {selectedPayment.description ||
                      "-"}
                  </Typography>

                </Grid>


                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                  >
                    Created At
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {formatDate(
                      selectedPayment.createdAt
                    )}
                  </Typography>

                </Grid>


                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                  >
                    Updated At
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {formatDate(
                      selectedPayment.updatedAt
                    )}
                  </Typography>

                </Grid>

              </Grid>


              {/* =================================================
                  ACTIONS
              ================================================= */}

              {(selectedPayment.status ===
                "PENDING" ||
                selectedPayment.status ===
                "SUCCESS") && (

                <>

                  <Divider
                    sx={{
                      my: 3,
                    }}
                  />

                  <Typography
                    fontWeight="bold"
                    mb={2}
                  >
                    Payment Actions
                  </Typography>


                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                    }}
                  >

                    {selectedPayment.status ===
                      "PENDING" && (

                      <Button
                        variant="contained"
                        color="success"
                        startIcon={
                          <CheckCircle />
                        }
                        disabled={
                          actionLoading
                        }
                        onClick={() =>
                          handlePaymentAction(
                            selectedPayment.id,
                            "success"
                          )
                        }
                      >
                        Mark Successful
                      </Button>

                    )}


                    {selectedPayment.status ===
                      "PENDING" && (

                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={
                          <Error />
                        }
                        disabled={
                          actionLoading
                        }
                        onClick={() =>
                          handlePaymentAction(
                            selectedPayment.id,
                            "failed"
                          )
                        }
                      >
                        Mark Failed
                      </Button>

                    )}


                    {selectedPayment.status ===
                      "PENDING" && (

                      <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={
                          <Cancel />
                        }
                        disabled={
                          actionLoading
                        }
                        onClick={() =>
                          handlePaymentAction(
                            selectedPayment.id,
                            "cancel"
                          )
                        }
                      >
                        Cancel Payment
                      </Button>

                    )}


                    {selectedPayment.status ===
                      "SUCCESS" && (

                      <Button
                        variant="contained"
                        color="info"
                        startIcon={
                          <Replay />
                        }
                        disabled={
                          actionLoading
                        }
                        onClick={() =>
                          handlePaymentAction(
                            selectedPayment.id,
                            "refund"
                          )
                        }
                      >
                        Refund Payment
                      </Button>

                    )}

                  </Box>


                  {actionLoading && (

                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >

                      <CircularProgress
                        size={20}
                      />

                      <Typography
                        fontSize={14}
                        color="text.secondary"
                      >
                        Updating payment...
                      </Typography>

                    </Box>

                  )}

                </>

              )}

            </Box>

          )}

        </DialogContent>


        <DialogActions>

          <Button
            onClick={handleCloseDetails}
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

    </Box>

  );

}


export default OwnerPayments;